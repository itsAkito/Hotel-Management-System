import { NextRequest, NextResponse } from "next/server";
import { prismadb } from "@/lib/prismadb";

// GET guest profile
export async function GET(req: NextRequest) {
  try {
    const bookingId = req.nextUrl.searchParams.get("bookingId");

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const guestProfile = await prismadb.guestProfile.findUnique({
      where: { bookingId },
    });

    if (!guestProfile) {
      return NextResponse.json(
        { error: "Guest profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(guestProfile);
  } catch (error: any) {
    console.error("[GUEST-PROFILE-GET]", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create or update guest profile
export async function POST(req: NextRequest) {
  try {
    const {
      bookingId,
      guestFirstName,
      guestLastName,
      guestEmail,
      guestPhone,
      guestAddress,
      guestCity,
      guestState,
      guestZip,
      guestCountry,
      numberOfGuests,
      specialRequests,
      idType,
      idNumber,
    } = await req.json();

    if (!bookingId || !guestFirstName || !guestLastName) {
      return NextResponse.json(
        { error: "Booking ID, first name, and last name are required" },
        { status: 400 }
      );
    }

    const existingProfile = await prismadb.guestProfile.findUnique({
      where: { bookingId },
    });

    let profile;

    if (existingProfile) {
      profile = await prismadb.guestProfile.update({
        where: { bookingId },
        data: {
          guestFirstName,
          guestLastName,
          guestEmail,
          guestPhone,
          guestAddress,
          guestCity,
          guestState,
          guestZip,
          guestCountry,
          numberOfGuests,
          specialRequests,
          idType,
          idNumber,
        },
      });
    } else {
      profile = await prismadb.guestProfile.create({
        data: {
          bookingId,
          guestFirstName,
          guestLastName,
          guestEmail,
          guestPhone,
          guestAddress: guestAddress || null,
          guestCity: guestCity || null,
          guestState: guestState || null,
          guestZip: guestZip || null,
          guestCountry: guestCountry || null,
          numberOfGuests: numberOfGuests || 1,
          specialRequests: specialRequests || null,
          idType: idType || null,
          idNumber: idNumber || null,
        },
      });
    }

    return NextResponse.json(profile, { status: 201 });
  } catch (error: any) {
    console.error("[GUEST-PROFILE-POST]", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
