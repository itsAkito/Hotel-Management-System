"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Calendar, MapPin, Users, Hotel, Search, Wifi, Utensils, Waves, Check } from "lucide-react";
import Image from "next/image";
import { DateRange } from "react-day-picker";

interface Room {
  id: number;
  title: string;
  description: string;
  bedCount: number;
  roomNumber: number;
  roomPrice: number;
}

interface Hotel {
  id: number;
  title: string;
  description: string;
  image: string;
  country: string;
  state: string;
  city: string;
  rooms: Room[];
  freeWifi?: boolean;
  restaurant?: boolean;
  swimmingPool?: boolean;
  gym?: boolean;
  spa?: boolean;
  bar?: boolean;
}

export default function BookStayPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Search filters
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState("1");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  // Fetch hotels
  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await fetch("/api/addhotel");
      if (response.ok) {
        const data = await response.json();
        setHotels(data);
        setFilteredHotels(data);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const handleSearch = () => {
    let filtered = [...hotels];

    // Search by hotel name
    if (searchQuery.trim()) {
      filtered = filtered.filter((h) =>
        h.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by location (city, state, country)
    if (location.trim()) {
      filtered = filtered.filter(
        (h) =>
          h.city.toLowerCase().includes(location.toLowerCase()) ||
          h.state.toLowerCase().includes(location.toLowerCase()) ||
          h.country.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by hotels with available rooms for guest count
    const guestNum = parseInt(guests) || 1;
    filtered = filtered.filter((h) => h.rooms && h.rooms.length > 0);

    setFilteredHotels(filtered);
  };

  // Handle date range change
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from) {
      setCheckInDate(range.from.toISOString().split("T")[0]);
    }
    if (range?.to) {
      setCheckOutDate(range.to.toISOString().split("T")[0]);
    }
  };

  // Book room
  const handleBookRoom = (hotel: Hotel, room: Room) => {
    if (!checkInDate || !checkOutDate) {
      alert("Please select check-in and check-out dates");
      return;
    }

    // Store booking data in sessionStorage or navigate to confirmation
    const bookingData = {
      hotelId: hotel.id,
      hotelTitle: hotel.title,
      roomId: room.id,
      roomTitle: room.title,
      roomPrice: room.roomPrice,
      checkInDate,
      checkOutDate,
      guests: parseInt(guests),
    };

    sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
    router.push(`/booking-confirmation?hotelId=${hotel.id}&roomId=${room.id}`);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <Container>
        {/* Header */}
        <div className="py-8 border-b border-gray-200 dark:border-slate-800">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🏨 Book Your Perfect Stay
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search and book from our premium collection of hotels
          </p>
        </div>

        {/* Search Section */}
        <div className="py-8 bg-linear-to-r from-blue-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Search Hotels
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Hotel Name Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Hotel className="h-4 w-4" />
                Hotel Name
              </label>
              <Input
                placeholder="Search hotel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-gray-300 dark:border-slate-700"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </label>
              <Input
                placeholder="City, region..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-gray-300 dark:border-slate-700"
              />
            </div>

            {/* Check-in/Check-out Dates */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Dates
              </label>
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={handleDateRangeChange}
                placeholder="Check-in to Check-out"
              />
            </div>

            {/* Number of Guests */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select guests</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num.toString()}>
                    {num} {num === 1 ? "Guest" : "Guests"}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Hotels Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredHotels.length === 0 ? (
          <div className="text-center py-16">
            <Hotel className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No hotels found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredHotels.map((hotel) => (
              <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
                  {/* Hotel Image */}
                  <div className="md:col-span-1">
                    <div className="relative h-48 md:h-64 w-full rounded-lg overflow-hidden bg-gray-200 dark:bg-slate-700">
                      {hotel.image ? (
                        <Image
                          src={hotel.image}
                          alt={hotel.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          📷 No Image
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hotel Info */}
                  <div className="md:col-span-3">
                    {/* Hotel Header */}
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {hotel.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {hotel.city}, {hotel.state}, {hotel.country}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                        {hotel.description}
                      </p>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      {hotel.freeWifi && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                          <Wifi className="h-4 w-4" />
                          <span>Free WiFi</span>
                        </div>
                      )}
                      {hotel.restaurant && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm">
                          <Utensils className="h-4 w-4" />
                          <span>Restaurant</span>
                        </div>
                      )}
                      {hotel.swimmingPool && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-full text-sm">
                          <Waves className="h-4 w-4" />
                          <span>Swimming Pool</span>
                        </div>
                      )}
                      {hotel.gym && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm">
                          <span>💪 Gym</span>
                        </div>
                      )}
                    </div>

                    {/* Rooms */}
                    {hotel.rooms && hotel.rooms.length > 0 ? (
                      <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Available Rooms
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {hotel.rooms.map((room) => (
                            <div
                              key={room.id}
                              className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                                {room.title}
                              </h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {room.description}
                              </p>
                              <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {room.bedCount} bed{room.bedCount > 1 ? "s" : ""}
                                </span>
                                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                  ${room.roomPrice}
                                </span>
                              </div>
                              <Button
                                onClick={() => handleBookRoom(hotel, room)}
                                disabled={!checkInDate || !checkOutDate}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Book Room
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No rooms available</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
