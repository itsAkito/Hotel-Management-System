import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20',
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      roomId, 
      hotelId, 
      checkIn, 
      checkOut, 
      totalPrice, 
      currency = 'usd',
      userName,
      breakfastIncluded
    } = body;

    if (!roomId || !hotelId || !checkIn || !checkOut || !totalPrice || !userName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prismadb = (await import('@/lib/prismadb')).default;

    // Verify room and hotel exist
    const room = await prismadb.room.findUnique({
      where: { id: roomId },
      include: { hotel: true },
    });

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // Amount in cents
      currency: currency.toLowerCase(),
      metadata: {
        roomId: roomId.toString(),
        hotelId: hotelId.toString(),
        userId: userId,
        hotelOwnerId: room.hotel.userId,
        checkIn: checkIn.toString(),
        checkOut: checkOut.toString(),
      },
      description: `Booking for ${room.title} at ${room.hotel.title}`,
    });

    // Create booking record with pending status
    const booking = await prismadb.booking.create({
      data: {
        userId,
        userName,
        hotelOwnerId: room.hotel.userId,
        roomId,
        hotelId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        breakfastIncluded,
        currency: currency.toUpperCase(),
        totalPrice,
        paymentIntent: paymentIntent.id,
        status: 'pending',
        paymentStatus: false,
      },
    });

    return NextResponse.json(
      {
        booking,
        clientSecret: paymentIntent.client_secret,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prismadb = (await import('@/lib/prismadb')).default;

    // Get user's bookings
    const bookings = await prismadb.booking.findMany({
      where: { userId },
      include: {
        hotel: true,
        room: true,
      },
      orderBy: { bookedAt: 'desc' },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
