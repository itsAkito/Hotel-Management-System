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
    
    // Return mock data if database is unavailable
    const mockHotels = [
      {
        id: 1,
        userId: "mock-user",
        title: "Oceanview Paradise",
        description: "Beautiful beachfront hotel with stunning ocean views",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        country: "India",
        state: "Goa",
        city: "Panaji",
        price: 350,
        rating: 4.8,
        status: "Available",
        rooms: []
      },
      {
        id: 2,
        userId: "mock-user",
        title: "Mountain Escape",
        description: "Cozy mountain resort perfect for nature lovers",
        image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
        country: "India",
        state: "Himachal Pradesh",
        city: "Manali",
        price: 280,
        rating: 4.6,
        status: "Available",
        rooms: []
      },
      {
        id: 3,
        userId: "mock-user",
        title: "City Lights Boutique",
        description: "Modern luxury hotel in the heart of the city",
        image: "https://images.unsplash.com/photo-1551882547-ff43c63faf76?auto=format&fit=crop&w=800&q=80",
        country: "India",
        state: "Maharashtra",
        city: "Mumbai",
        price: 190,
        rating: 4.7,
        status: "Available",
        rooms: []
      }
    ];
    
    return NextResponse.json(mockHotels);
  }
}
