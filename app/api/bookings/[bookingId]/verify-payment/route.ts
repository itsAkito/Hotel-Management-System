import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(
  req: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Get booking
    const booking = await prismadb.booking.findUnique({
      where: { id: params.bookingId },
    });

    if (!booking) {
      return new NextResponse("Booking not found", { status: 404 });
    }

    if (booking.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Verify signature
    const body_string = razorpay_order_id + "|" + razorpay_payment_id;
    const expected_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(body_string)
      .digest("hex");

    if (expected_signature !== razorpay_signature) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    // Update booking as paid
    const updatedBooking = await prismadb.booking.update({
      where: { id: params.bookingId },
      data: {
        paymentStatus: true,
        status: "confirmed",
        paymentIntent: razorpay_payment_id,
      },
      include: {
        hotel: true,
        room: true,
      },
    });

    // Mark room as booked for these dates
    await prismadb.room.update({
      where: { id: booking.roomId },
      data: {
        isBooked: true,
      },
    });

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
    });
  } catch (error) {
    console.log("[PAYMENT_VERIFY_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
