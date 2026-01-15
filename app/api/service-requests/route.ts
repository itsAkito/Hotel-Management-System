import { NextRequest, NextResponse } from "next/server";
import { prismadb } from "@/lib/prismadb";

// GET all service requests for a hotel
export async function GET(req: NextRequest) {
  try {
    const hotelId = req.nextUrl.searchParams.get("hotelId");
    const status = req.nextUrl.searchParams.get("status");
    const priority = req.nextUrl.searchParams.get("priority");

    const where: any = {};

    if (hotelId) {
      where.hotelId = parseInt(hotelId);
    }

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    const serviceRequests = await prismadb.serviceRequest.findMany({
      where,
      include: {
        booking: {
          include: {
            guestProfile: true,
            room: true,
          },
        },
      },
      orderBy: {
        requestedAt: "desc",
      },
    });

    return NextResponse.json(serviceRequests);
  } catch (error: any) {
    console.error("[SERVICE-REQUEST-GET]", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create or update service request
export async function POST(req: NextRequest) {
  try {
    const {
      bookingId,
      hotelId,
      serviceType,
      description,
      priority,
      assignedTo,
      status,
      resolution,
    } = await req.json();

    if (!bookingId || !hotelId || !serviceType) {
      return NextResponse.json(
        { error: "Booking ID, Hotel ID, and service type are required" },
        { status: 400 }
      );
    }

    const serviceRequest = await prismadb.serviceRequest.create({
      data: {
        bookingId,
        hotelId,
        serviceType,
        description: description || "",
        priority: priority || "normal",
        assignedTo: assignedTo || null,
        status: status || "pending",
        resolution: resolution || null,
      },
    });

    return NextResponse.json(serviceRequest, { status: 201 });
  } catch (error: any) {
    console.error("[SERVICE-REQUEST-POST]", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update service request
export async function PUT(req: NextRequest) {
  try {
    const { id, status, assignedTo, resolution } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Service request ID is required" },
        { status: 400 }
      );
    }

    const serviceRequest = await prismadb.serviceRequest.update({
      where: { id },
      data: {
        status,
        assignedTo,
        resolution,
        completedAt: status === "completed" ? new Date() : null,
      },
    });

    return NextResponse.json(serviceRequest);
  } catch (error: any) {
    console.error("[SERVICE-REQUEST-PUT]", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
