import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20",
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const {
      userName,
      roomId,
      hotelId,
      checkIn,
      checkOut,
      breakfastIncluded,
      currency,
      totalPrice,
    } = body;

    // Validate required fields
    if (!userName || !roomId || !hotelId || !checkIn || !checkOut || !currency || !totalPrice) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Verify room exists
    const room = await prismadb.room.findUnique({
      where: { id: parseInt(roomId) },
      include: { hotel: true },
    });

    if (!room) {
      return new NextResponse("Room not found", { status: 404 });
    }

    // Verify hotel exists and get owner ID
    const hotel = await prismadb.hotel.findUnique({
      where: { id: parseInt(hotelId) },
    });

    if (!hotel) {
      return new NextResponse("Hotel not found", { status: 404 });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // Amount in cents
      currency: currency.toLowerCase(),
      metadata: {
        roomId: roomId.toString(),
        hotelId: hotelId.toString(),
        userId: userId,
        hotelOwnerId: hotel.userId,
        checkIn: checkIn,
        checkOut: checkOut,
      },
      description: `Booking for ${room.title} at ${hotel.title}`,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Create booking
    const booking = await prismadb.booking.create({
      data: {
        userName,
        userId,
        hotelOwnerId: hotel.userId,
        roomId: parseInt(roomId),
        hotelId: parseInt(hotelId),
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        breakfastIncluded: breakfastIncluded || false,
        currency: currency.toUpperCase(),
        totalPrice: parseInt(totalPrice),
        paymentIntent: paymentIntent.id,
        status: "pending",
        paymentStatus: false,
      },
      include: {
        hotel: true,
        room: true,
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
    console.log("[BOOKINGS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get all bookings for the authenticated user
    const bookings = await prismadb.booking.findMany({
      where: {
        userId: userId,
      },
      include: {
        hotel: true,
        room: true,
      },
      orderBy: {
        bookedAt: "desc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.log("[BOOKINGS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
