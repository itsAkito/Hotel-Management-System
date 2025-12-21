import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const prismadb = (await import('@/lib/prismadb')).default;

    const hotel = await prismadb.hotel.create({
      data: {
        ...body,
        userId,
      },
      include: { rooms: true },
    });

    return NextResponse.json(hotel, { status: 201 });
  } catch (error) {
    console.error('Error creating hotel:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prismadb = (await import('@/lib/prismadb')).default;

    const hotels = await prismadb.hotel.findMany({
      where: { userId },
      include: { rooms: true },
    });

    return NextResponse.json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
