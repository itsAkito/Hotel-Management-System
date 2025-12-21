import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20",
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params;

    if (!bookingId) {
      return new NextResponse("Invalid booking ID", { status: 400 });
    }

    const booking = await prismadb.booking.findUnique({
      where: { id: bookingId },
      include: {
        hotel: true,
        room: true,
      },
    });

    if (!booking) {
      return new NextResponse("Booking not found", { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.log("[BOOKING_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { bookingId } = await params;

    if (!bookingId) {
      return new NextResponse("Invalid booking ID", { status: 400 });
    }

    // Check if booking exists and belongs to user
    const booking = await prismadb.booking.findUnique({
      where: { id: bookingId },
      include: { room: true },
    });

    if (!booking) {
      return new NextResponse("Booking not found", { status: 404 });
    }

    if (booking.userId !== userId) {
      return new NextResponse("Unauthorized to modify this booking", { status: 403 });
    }

    // Can only update pending bookings
    if (booking.status !== "pending") {
      return new NextResponse("Cannot update booking with status: " + booking.status, { status: 400 });
    }

    const body = await req.json();

    // Calculate new price if dates changed
    let newTotalPrice = booking.totalPrice;
    if (body.checkIn || body.checkOut) {
      const checkIn = new Date(body.checkIn || booking.checkIn);
      const checkOut = new Date(body.checkOut || booking.checkOut);

      const nightsDiff = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      if (nightsDiff <= 0) {
        return new NextResponse("Check-out must be after check-in", { status: 400 });
      }

      newTotalPrice = nightsDiff * booking.room.roomPrice;
      if (body.breakfastIncluded !== undefined ? body.breakfastIncluded : booking.breakfastIncluded) {
        newTotalPrice += nightsDiff * (booking.room.breakfastPrice || 0);
      }
    }

    // If price changed, update payment intent
    if (newTotalPrice !== booking.totalPrice && booking.paymentIntent) {
      await stripe.paymentIntents.update(booking.paymentIntent, {
        amount: Math.round(newTotalPrice * 100),
      });
    }

    const updatedBooking = await prismadb.booking.update({
      where: { id: bookingId },
      data: {
        checkIn: body.checkIn ? new Date(body.checkIn) : undefined,
        checkOut: body.checkOut ? new Date(body.checkOut) : undefined,
        breakfastIncluded: body.breakfastIncluded !== undefined ? body.breakfastIncluded : undefined,
        totalPrice: newTotalPrice,
      },
      include: {
        hotel: true,
        room: true,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.log("[BOOKING_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { bookingId } = await params;

    if (!bookingId) {
      return new NextResponse("Invalid booking ID", { status: 400 });
    }

    // Check if booking exists and belongs to user
    const booking = await prismadb.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return new NextResponse("Booking not found", { status: 404 });
    }

    if (booking.userId !== userId) {
      return new NextResponse("Unauthorized to delete this booking", { status: 403 });
    }

    // Process refund if payment is confirmed
    if (booking.paymentStatus && booking.paymentIntent) {
      try {
        await stripe.refunds.create({
          payment_intent: booking.paymentIntent,
          reason: "requested_by_customer",
        });
      } catch (stripeError) {
        console.log("[STRIPE_REFUND_ERROR]", stripeError);
        return new NextResponse("Failed to process refund", { status: 500 });
      }
    }

    // Update booking status to cancelled instead of deleting
    await prismadb.booking.update({
      where: { id: bookingId },
      data: {
        status: "cancelled",
        paymentStatus: false,
      },
    });

    return NextResponse.json(
      {
        message: "Booking cancelled successfully",
        refunded: booking.paymentStatus,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[BOOKING_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
