import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const {
      title,
      description,
      image,
      country,
      state,
      city,
      locationDescription,
      gym,
      spa,
      bar,
      laundry,
      restaurant,
      shopping,
      freeParking,
      bikeRental,
      freeWifi,
      movieNights,
      swimmingPool,
      coffeeShop,
    } = body;

    // Validate required fields
    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    // Create new hotel
    const hotel = await prismadb.hotel.create({
      data: {
        userId,
        title,
        description,
        image,
        country,
        state,
        city,
        locationDescription,
        gym: gym || false,
        spa: spa || false,
        bar: bar || false,
        laundry: laundry || false,
        restaurant: restaurant || false,
        shopping: shopping || false,
        freeParking: freeParking || false,
        bikeRental: bikeRental || false,
        freeWifi: freeWifi || false,
        movieNights: movieNights || false,
        swimmingPool: swimmingPool || false,
        coffeeShop: coffeeShop || false,
      },
      include: {
        rooms: true,
        bookings: true,
      },
    });

    return NextResponse.json(hotel);
  } catch (error) {
    console.log("[ADDHOTEL_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    // Get all hotels (public endpoint)
    const hotels = await prismadb.hotel.findMany({
      include: {
        rooms: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(hotels);
  } catch (error) {
    console.log("[ADDHOTEL_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
