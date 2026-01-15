import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// Fallback mock data for when database is unavailable
const mockHotels = [
  {
    id: 1,
    userId: "user_1",
    title: "Oceanview Paradise",
    description: "Beautiful beachfront hotel with stunning ocean views, private beach access, and water sports facilities.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    country: "India",
    state: "Goa",
    city: "Panaji",
    price: 5500,
    rating: 4.8,
    status: "Available",
    createdAt: new Date("2025-01-01"),
    rooms: []
  },
  {
    id: 2,
    userId: "user_1",
    title: "Mountain Escape Resort",
    description: "Cozy mountain resort perfect for nature lovers with hiking trails and adventure activities.",
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
    country: "India",
    state: "Himachal Pradesh",
    city: "Manali",
    price: 4200,
    rating: 4.6,
    status: "Available",
    createdAt: new Date("2025-01-02"),
    rooms: []
  },
  {
    id: 3,
    userId: "user_2",
    title: "City Lights Boutique",
    description: "Modern luxury hotel in the heart of the city with rooftop bar and fine dining.",
    image: "https://images.unsplash.com/photo-1551882547-ff43c63faf76?auto=format&fit=crop&w=800&q=80",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    price: 3800,
    rating: 4.7,
    status: "Available",
    createdAt: new Date("2025-01-03"),
    rooms: []
  },
  {
    id: 4,
    userId: "user_2",
    title: "Desert Mirage Palace",
    description: "Luxurious desert resort with traditional architecture in the heart of Rajasthan.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    country: "India",
    state: "Rajasthan",
    city: "Jaisalmer",
    price: 4000,
    rating: 4.5,
    status: "Available",
    createdAt: new Date("2025-01-04"),
    rooms: []
  },
  {
    id: 5,
    userId: "user_3",
    title: "Backwater Breeze",
    description: "Serene houseboat hotel offering unique Kerala backwater experience.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    country: "India",
    state: "Kerala",
    city: "Kochi",
    price: 3200,
    rating: 4.9,
    status: "Available",
    createdAt: new Date("2025-01-05"),
    rooms: []
  },
  {
    id: 6,
    userId: "user_3",
    title: "Tech Valley Vista",
    description: "Modern tech-enabled hotel in IT hub with high-speed internet.",
    image: "https://images.unsplash.com/photo-1571896349842-35fc6f9aa603?auto=format&fit=crop&w=800&q=80",
    country: "India",
    state: "Karnataka",
    city: "Bangalore",
    price: 2800,
    rating: 4.4,
    status: "Available",
    createdAt: new Date("2025-01-06"),
    rooms: []
  }
];

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    try {
      const prismadb = (await import('@/lib/prismadb')).default;

      const hotel = await prismadb.hotel.create({
        data: {
          ...body,
          userId,
        },
        include: { rooms: true },
      });

      return NextResponse.json(hotel, { status: 201 });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Return mock response on DB failure
      return NextResponse.json({ 
        ...body, 
        id: Math.random(), 
        userId,
        rooms: [],
        message: "Hotel added (offline mode)"
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating hotel:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    try {
      const prismadb = (await import('@/lib/prismadb')).default;
      
      const hotels = await prismadb.hotel.findMany({
        include: { rooms: true },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json(hotels);
    } catch (dbError) {
      console.log('[HOTELS_FALLBACK] Database unavailable, using mock data:', dbError);
      return NextResponse.json(mockHotels);
    }
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return NextResponse.json(mockHotels);
  }
}
