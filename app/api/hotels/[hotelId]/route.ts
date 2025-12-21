import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { hotelId: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prismadb = (await import('@/lib/prismadb')).default;
    const hotelId = parseInt(params.hotelId);

    const hotel = await prismadb.hotel.findUnique({
      where: { id: hotelId },
      include: { rooms: true },
    });

    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    if (hotel.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(hotel);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { hotelId: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const prismadb = (await import('@/lib/prismadb')).default;
    const hotelId = parseInt(params.hotelId);

    const hotel = await prismadb.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel || hotel.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedHotel = await prismadb.hotel.update({
      where: { id: hotelId },
      data: body,
      include: { rooms: true },
    });

    return NextResponse.json(updatedHotel);
  } catch (error) {
    console.error('Error updating hotel:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { hotelId: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prismadb = (await import('@/lib/prismadb')).default;
    const hotelId = parseInt(params.hotelId);

    const hotel = await prismadb.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel || hotel.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prismadb.hotel.delete({
      where: { id: hotelId },
    });

    return NextResponse.json({ message: 'Hotel deleted' });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
