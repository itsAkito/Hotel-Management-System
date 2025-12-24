import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import crypto from "crypto";

// Helper function to create Razorpay order
async function createRazorpayOrder(amount: number, currency: string, bookingId: string) {
  try {
    const options = {
      method: "POST",
      url: "https://api.razorpay.com/v1/orders",
      auth: {
        username: process.env.RAZORPAY_KEY_ID || "",
        password: process.env.RAZORPAY_KEY_SECRET || "",
      },
      headers: {
        "content-type": "application/json",
      },
      data: {
        amount: Math.round(amount * 100), // Amount in smallest currency unit (paise for INR)
        currency: currency.toUpperCase(),
        receipt: bookingId,
        notes: {
          bookingId,
        },
      },
    };

    const response = await fetch(options.url, {
      method: options.method,
      headers: {
        ...options.headers,
        "Authorization": `Basic ${Buffer.from(`${options.auth.username}:${options.auth.password}`).toString("base64")}`,
      },
      body: JSON.stringify(options.data),
    });

    if (!response.ok) {
      throw new Error("Failed to create Razorpay order");
    }

    return await response.json();
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    throw error;
  }
}

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
        paymentIntent: "", // Will be filled with Razorpay order ID
        status: "pending",
        paymentStatus: false,
      },
      include: {
        hotel: true,
        room: true,
      },
    });

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(totalPrice, currency, booking.id);

    // Update booking with Razorpay order ID
    const updatedBooking = await prismadb.booking.update({
      where: { id: booking.id },
      data: { paymentIntent: razorpayOrder.id },
      include: {
        hotel: true,
        room: true,
      },
    });

    return NextResponse.json(
      {
        booking: updatedBooking,
        razorpayOrderId: razorpayOrder.id,
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
