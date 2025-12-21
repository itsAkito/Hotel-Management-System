import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ hotelId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const prismadb = (await import('@/lib/prismadb')).default;
    const { hotelId: hotelIdStr } = await params;
    const hotelId = parseInt(hotelIdStr, 10);

    if (isNaN(hotelId)) {
      return NextResponse.json({ error: 'Invalid hotel ID' }, { status: 400 });
    }

    // Verify hotel ownership
    const hotel = await prismadb.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel || hotel.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const room = await prismadb.room.create({
      data: {
        ...body,
        hotelId,
      },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error('Error creating room:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hotelId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prismadb = (await import('@/lib/prismadb')).default;
    const { hotelId: hotelIdStr } = await params;
    const hotelId = parseInt(hotelIdStr, 10);

    if (isNaN(hotelId)) {
      return NextResponse.json({ error: 'Invalid hotel ID' }, { status: 400 });
    }

    // Verify hotel ownership
    const hotel = await prismadb.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel || hotel.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const rooms = await prismadb.room.findMany({
      where: { hotelId },
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
