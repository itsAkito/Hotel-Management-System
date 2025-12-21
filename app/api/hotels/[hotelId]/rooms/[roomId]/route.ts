import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hotelId: string; roomId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prismadb = (await import('@/lib/prismadb')).default;
    const { hotelId: hotelIdStr, roomId: roomIdStr } = await params;
    const hotelId = parseInt(hotelIdStr, 10);
    const roomId = parseInt(roomIdStr, 10);

    if (isNaN(hotelId) || isNaN(roomId)) {
      return NextResponse.json({ error: 'Invalid hotel or room ID' }, { status: 400 });
    }

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
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ hotelId: string; roomId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const prismadb = (await import('@/lib/prismadb')).default;
    const { hotelId: hotelIdStr, roomId: roomIdStr } = await params;
    const hotelId = parseInt(hotelIdStr, 10);
    const roomId = parseInt(roomIdStr, 10);

    if (isNaN(hotelId) || isNaN(roomId)) {
      return NextResponse.json({ error: 'Invalid hotel or room ID' }, { status: 400 });
    }

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
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ hotelId: string; roomId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prismadb = (await import('@/lib/prismadb')).default;
    const { hotelId: hotelIdStr, roomId: roomIdStr } = await params;
    const hotelId = parseInt(hotelIdStr, 10);
    const roomId = parseInt(roomIdStr, 10);

    if (isNaN(hotelId) || isNaN(roomId)) {
      return NextResponse.json({ error: 'Invalid hotel or room ID' }, { status: 400 });
    }

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
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
