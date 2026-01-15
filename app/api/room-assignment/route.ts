import { NextRequest, NextResponse } from "next/server";
import { prismadb } from "@/lib/prismadb";

// GET all room assignments for a hotel
export async function GET(req: NextRequest) {
  try {
    const hotelId = req.nextUrl.searchParams.get("hotelId");

    if (!hotelId) {
      return NextResponse.json(
        { error: "Hotel ID is required" },
        { status: 400 }
      );
    }

    const assignments = await prismadb.roomAssignment.findMany({
      where: {
        booking: {
          hotelId: parseInt(hotelId),
        },
      },
      include: {
        booking: {
          include: {
            guestProfile: true,
            room: true,
          },
        },
      },
    });

    return NextResponse.json(assignments);
  } catch (error: any) {
    console.error("[ROOM-ASSIGNMENT-GET]", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create or update room assignment
export async function POST(req: NextRequest) {
  try {
    const { bookingId, roomNumber, floorNumber, assignedBy, maintenanceNeeded, maintenanceNotes } = await req.json();

    if (!bookingId || !roomNumber) {
      return NextResponse.json(
        { error: "Booking ID and room number are required" },
        { status: 400 }
      );
    }

    const existingAssignment = await prismadb.roomAssignment.findUnique({
      where: { bookingId },
    });

    let assignment;

    if (existingAssignment) {
      assignment = await prismadb.roomAssignment.update({
        where: { bookingId },
        data: {
          roomNumber,
          floorNumber,
          assignedBy,
          maintenanceNeeded,
          maintenanceNotes,
        },
      });
    } else {
      assignment = await prismadb.roomAssignment.create({
        data: {
          bookingId,
          roomNumber,
          floorNumber: floorNumber || null,
          assignedBy,
          maintenanceNeeded: maintenanceNeeded || false,
          maintenanceNotes: maintenanceNotes || null,
        },
      });
    }

    return NextResponse.json(assignment, { status: 201 });
  } catch (error: any) {
    console.error("[ROOM-ASSIGNMENT-POST]", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
