import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const booking = await prismadb.booking.findUnique({
      where: { id: params.bookingId },
    });

    if (!booking) {
      return new NextResponse("Booking not found", { status: 404 });
    }

    if (booking.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    return NextResponse.json({
      razorpayOrderId: booking.paymentIntent,
    });
  } catch (error) {
    console.log("[RAZORPAY_ORDER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
