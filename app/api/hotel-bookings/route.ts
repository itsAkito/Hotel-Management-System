import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get all bookings for hotels owned by the authenticated user
    const bookings = await prismadb.booking.findMany({
      where: {
        hotelOwnerId: userId,
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
    console.log("[HOTEL_BOOKINGS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { bookingId, status, paymentStatus } = body;

    if (!bookingId) {
      return new NextResponse("Booking ID is required", { status: 400 });
    }

    // Get booking
    const booking = await prismadb.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return new NextResponse("Booking not found", { status: 404 });
    }

    // Check if user is the hotel owner
    if (booking.hotelOwnerId !== userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Update booking
    const updatedBooking = await prismadb.booking.update({
      where: { id: bookingId },
      data: {
        status: status || booking.status,
        paymentStatus: paymentStatus !== undefined ? paymentStatus : booking.paymentStatus,
      },
      include: {
        hotel: true,
        room: true,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.log("[HOTEL_BOOKINGS_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
