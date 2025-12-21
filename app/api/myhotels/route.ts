import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch all hotels belonging to the authenticated user
    const hotels = await prismadb.hotel.findMany({
      where: {
        userId: userId,
      },
      include: {
        rooms: true,
        bookings: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(hotels);
  } catch (error) {
    console.log("[MYHOTELS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
