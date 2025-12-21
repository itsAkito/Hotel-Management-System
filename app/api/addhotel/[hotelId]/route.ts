import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ hotelId: string }> }
) {
  try {
    const { hotelId } = await params;
    const hotelIdNum = parseInt(hotelId);

    if (!hotelIdNum || isNaN(hotelIdNum)) {
      return new NextResponse("Invalid hotel ID", { status: 400 });
    }

    const hotel = await prismadb.hotel.findUnique({
      where: {
        id: hotelIdNum,
      },
      include: {
        rooms: true,
        bookings: true,
      },
    });

    if (!hotel) {
      return new NextResponse("Hotel not found", { status: 404 });
    }

    return NextResponse.json(hotel);
  } catch (error) {
    console.log("[HOTEL_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ hotelId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { hotelId } = await params;
    const hotelIdNum = parseInt(hotelId);

    if (!hotelIdNum || isNaN(hotelIdNum)) {
      return new NextResponse("Invalid hotel ID", { status: 400 });
    }

    // Check if hotel exists and belongs to user
    const hotel = await prismadb.hotel.findUnique({
      where: {
        id: hotelIdNum,
      },
    });

    if (!hotel) {
      return new NextResponse("Hotel not found", { status: 404 });
    }

    if (hotel.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();

    const updatedHotel = await prismadb.hotel.update({
      where: {
        id: hotelIdNum,
      },
      data: {
        ...body,
      },
      include: {
        rooms: true,
        bookings: true,
      },
    });

    return NextResponse.json(updatedHotel);
  } catch (error) {
    console.log("[HOTEL_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ hotelId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { hotelId } = await params;
    const hotelIdNum = parseInt(hotelId);

    if (!hotelIdNum || isNaN(hotelIdNum)) {
      return new NextResponse("Invalid hotel ID", { status: 400 });
    }

    // Check if hotel exists and belongs to user
    const hotel = await prismadb.hotel.findUnique({
      where: {
        id: hotelIdNum,
      },
    });

    if (!hotel) {
      return new NextResponse("Hotel not found", { status: 404 });
    }

    if (hotel.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Delete hotel (rooms and bookings will cascade delete)
    await prismadb.hotel.delete({
      where: {
        id: hotelIdNum,
      },
    });

    return new NextResponse("Hotel deleted successfully", { status: 200 });
  } catch (error) {
    console.log("[HOTEL_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
