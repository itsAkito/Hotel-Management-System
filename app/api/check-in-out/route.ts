import { NextRequest, NextResponse } from "next/server";
import { prismadb } from "@/lib/prismadb";

// GET all check-in/check-out records for a hotel
export async function GET(req: NextRequest) {
  try {
    const hotelId = req.nextUrl.searchParams.get("hotelId");
    const status = req.nextUrl.searchParams.get("status");

    if (!hotelId) {
      return NextResponse.json(
        { error: "Hotel ID is required" },
        { status: 400 }
      );
    }

    const bookings = await prismadb.booking.findMany({
      where: {
        hotelId: parseInt(hotelId),
      },
      include: {
        checkIn_checkout: true,
        room: true,
        guestProfile: true,
      },
    });

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error("[CHECK-IN-OUT-GET]", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create or update check-in/check-out
export async function POST(req: NextRequest) {
  try {
    const { bookingId, checkInTime, checkOutTime, checkInBy, checkOutBy, keyIssued, keyReturned, notes } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const existingCheckInOut = await prismadb.checkInCheckOut.findUnique({
      where: { bookingId },
    });

    let checkInOut;

    if (existingCheckInOut) {
      checkInOut = await prismadb.checkInCheckOut.update({
        where: { bookingId },
        data: {
          checkInTime: checkInTime ? new Date(checkInTime) : undefined,
          checkOutTime: checkOutTime ? new Date(checkOutTime) : undefined,
          checkInBy,
          checkOutBy,
          keyIssued,
          keyReturned,
          notes,
        },
      });
    } else {
      checkInOut = await prismadb.checkInCheckOut.create({
        data: {
          bookingId,
          checkInTime: checkInTime ? new Date(checkInTime) : null,
          checkOutTime: checkOutTime ? new Date(checkOutTime) : null,
          checkInBy,
          checkOutBy,
          keyIssued: keyIssued || false,
          keyReturned: keyReturned || false,
          notes,
        },
      });
    }

    return NextResponse.json(checkInOut, { status: 201 });
  } catch (error: any) {
    console.error("[CHECK-IN-OUT-POST]", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
