"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Edit, Trash2, MapPin, Star, Search, Wifi, Waves, Dumbbell, Wine, Sparkles } from "lucide-react";

interface Hotel {
  id: number;
  title: string;
  description: string;
  image: string;
  country: string;
  state: string;
  city: string;
  gym: boolean;
  spa: boolean;
  bar: boolean;
  laundry: boolean;
  restaurant: boolean;
  shopping: boolean;
  freeParking: boolean;
  bikeRental: boolean;
  freeWifi: boolean;
  movieNights: boolean;
  swimmingPool: boolean;
  coffeeShop: boolean;
  createdAt: string;
  rooms: any[];
}

export default function MyHotelsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date" | "rooms">("date");

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    fetchMyHotels();
  }, [isLoaded, user]);

  useEffect(() => {
    filterAndSortHotels();
  }, [hotels, searchQuery, sortBy]);

  const fetchMyHotels = async () => {
    try {
      const response = await fetch("/api/myhotels");
      if (response.ok) {
        const data = await response.json();
        setHotels(data);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortHotels = () => {
    let filtered = hotels.filter((hotel) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        hotel.title.toLowerCase().includes(query) ||
        hotel.description?.toLowerCase().includes(query) ||
        hotel.city?.toLowerCase().includes(query) ||
        hotel.state?.toLowerCase().includes(query)
      );
    });

    // Sort
    if (sortBy === "name") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "date") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "rooms") {
      filtered.sort((a, b) => (b.rooms?.length || 0) - (a.rooms?.length || 0));
    }

    setFilteredHotels(filtered);
  };

  const handleDelete = async (hotelId: number) => {
    if (!confirm("Are you sure you want to delete this hotel?")) return;

    setDeleting(hotelId);
    try {
      const response = await fetch(`/api/addhotel/${hotelId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setHotels(hotels.filter((h) => h.id !== hotelId));
        alert("Hotel deleted successfully");
      } else {
        alert("Failed to delete hotel");
      }
    } catch (error) {
      console.error("Error deleting hotel:", error);
      alert("Error deleting hotel");
    } finally {
      setDeleting(null);
    }
  };

  const amenityIcons = [
    { key: "freeWifi", icon: Wifi, label: "WiFi", color: "text-blue-600 dark:text-blue-400" },
    { key: "swimmingPool", icon: Waves, label: "Pool", color: "text-cyan-600 dark:text-cyan-400" },
    { key: "gym", icon: Dumbbell, label: "Gym", color: "text-orange-600 dark:text-orange-400" },
    { key: "bar", icon: Wine, label: "Bar", color: "text-purple-600 dark:text-purple-400" },
    { key: "spa", icon: Sparkles, label: "Spa", color: "text-pink-600 dark:text-pink-400" },
  ] as const;

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors py-16">
      <Container>
        {/* Header */}
        <div className="mb-12 space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-slate-900 to-blue-900 dark:from-white dark:to-blue-400 bg-clip-text text-transparent">
              My Hotels
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Manage and organize your hotel listings
            </p>
          </div>

          <Button
            onClick={() => router.push("/hotel/new")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg"
          >
            ➕ Add New Hotel
          </Button>
        </div>

        {/* Search and Sort Bar */}
        {!loading && hotels.length > 0 && (
          <Card className="mb-8 p-6 space-y-4 border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search Hotels
                </label>
                <Input
                  placeholder="Search by name, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-slate-200 dark:border-slate-700"
                />
              </div>

              {/* Sort */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-white">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="date">Recently Added</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="rooms">Most Rooms</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="flex items-end">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Showing <span className="font-semibold text-slate-900 dark:text-white">{filteredHotels.length}</span> of <span className="font-semibold text-slate-900 dark:text-white">{hotels.length}</span> hotels
                </div>
              </div>
            </div>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                Loading your hotels...
              </p>
            </div>
          </div>
        ) : filteredHotels.length === 0 && searchQuery ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-6">
              No hotels match your search
            </p>
            <Button
              onClick={() => setSearchQuery("")}
              variant="outline"
              className="text-slate-600 dark:text-slate-400"
            >
              Clear Search
            </Button>
          </div>
        ) : filteredHotels.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="text-5xl mb-4">🏨</div>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-6">
              You haven't added any hotels yet
            </p>
            <Button
              onClick={() => router.push("/hotel/new")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create Your First Hotel
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredHotels.map((hotel) => (
              <Card
                key={hotel.id}
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-slate-200 dark:border-slate-800 flex flex-col"
              >
                {/* Hotel Image */}
                <div className="relative h-56 w-full bg-slate-200 dark:bg-slate-800 overflow-hidden group">
                  {hotel.image && hotel.image.startsWith("http") ? (
                    <>
                      <Image
                        src={hotel.image}
                        alt={hotel.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-300 dark:bg-slate-700">
                      <span className="text-slate-400 dark:text-slate-500 text-lg">
                        No Image
                      </span>
                    </div>
                  )}
                </div>

                {/* Hotel Info */}
                <div className="p-6 flex flex-col grow space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white line-clamp-2">
                      {hotel.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center text-slate-600 dark:text-slate-400">
                      <MapPin size={16} className="mr-2 shrink-0" />
                      <span className="text-sm">
                        {hotel.city}, {hotel.state}
                        {hotel.country && `, ${hotel.country}`}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">
                    {hotel.description || "No description provided"}
                  </p>

                  {/* Amenities */}
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-widest font-semibold text-slate-500 dark:text-slate-400">
                      Amenities
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {amenityIcons.map(({ key, icon: Icon, label, color }) => (
                        hotel[key as keyof typeof hotel] && (
                          <div
                            key={key}
                            title={label}
                            className={`p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg ${color} hover:scale-110 transition-transform`}
                          >
                            <Icon size={16} />
                          </div>
                        )
                      ))}
                    </div>
                  </div>

                  {/* Rooms Count */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-slate-900 dark:text-white text-lg">
                        {hotel.rooms?.length || 0}
                      </span>{" "}
                      room{hotel.rooms?.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto pt-4 flex gap-3">
                    <Link href={`/hotel/${hotel.id}`} className="flex-1">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                        <Edit size={16} className="mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleDelete(hotel.id)}
                      disabled={deleting === hotel.id}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                    >
                      <Trash2 size={16} className="mr-2" />
                      {deleting === hotel.id ? "..." : "Delete"}
                    </Button>
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
