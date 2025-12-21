import HotelFormSection from "@/components/hotel/HotelFormSection";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface HotelPageProps {
  params: Promise<{
    hotelId: string;
  }>;
}

export default async function HotelPage({ params }: HotelPageProps) {
  const { userId } = await auth();
  const { hotelId } = await params; // ✅ await the promise

  if (!userId) {
    redirect("/sign-in");
  }

  let hotel = null;

  // Only fetch if not creating a new hotel
  if (hotelId && hotelId !== "new") {
    try {
      const prismadb = (await import("@/lib/prismadb")).default;

      hotel = await prismadb.hotel.findUnique({
        where: { id: parseInt(hotelId) },
        include: { rooms: true },
      });

      if (hotel && hotel.userId !== userId) {
        redirect("/");
      }
    } catch (error) {
      console.error("Error fetching hotel:", error);
      hotel = null;
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <HotelFormSection hotel={hotel} />
    </div>
  );
}