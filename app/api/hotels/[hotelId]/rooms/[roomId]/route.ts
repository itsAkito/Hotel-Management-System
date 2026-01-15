import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { hotelId: string; roomId: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prismadb = (await import('@/lib/prismadb')).default;
    const hotelId = parseInt(params.hotelId);
    const roomId = parseInt(params.roomId);

    // Verify hotel ownership
    const hotel = await prismadb.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel || hotel.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const room = await prismadb.room.findUnique({
      where: { id: roomId },
    });

    if (!room || room.hotelId !== hotelId) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { hotelId: string; roomId: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const prismadb = (await import('@/lib/prismadb')).default;
    const hotelId = parseInt(params.hotelId);
    const roomId = parseInt(params.roomId);

    // Verify hotel ownership
    const hotel = await prismadb.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel || hotel.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const room = await prismadb.room.findUnique({
      where: { id: roomId },
    });

    if (!room || room.hotelId !== hotelId) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const updatedRoom = await prismadb.room.update({
      where: { id: roomId },
      data: body,
    });

    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error('Error updating room:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { hotelId: string; roomId: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prismadb = (await import('@/lib/prismadb')).default;
    const hotelId = parseInt(params.hotelId);
    const roomId = parseInt(params.roomId);

    // Verify hotel ownership
    const hotel = await prismadb.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel || hotel.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const room = await prismadb.room.findUnique({
      where: { id: roomId },
    });

    if (!room || room.hotelId !== hotelId) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    await prismadb.room.delete({
      where: { id: roomId },
    });

    return NextResponse.json({ message: 'Room deleted' });
  } catch (error) {
    console.error('Error deleting room:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
