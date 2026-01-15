"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Edit,
  Trash2,
  MapPin,
  Plus,
  Search,
  Wifi,
  Waves,
  Dumbbell,
  Wine,
  Sparkles,
  Building2,
} from "lucide-react";

interface Hotel {
  id: number;
  title: string;
  description: string;
  image: string;
  country: string;
  state: string;
  city: string;
  locationDescription?: string;
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

export default function AdminHotelsPage() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date" | "rooms" | "location">("date");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!userId) {
      router.push("/login");
      return;
    }

    checkUserRole();
  }, [userId, isLoaded]);

  const checkUserRole = async () => {
    try {
      const response = await fetch(`/api/user-role?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserRole(data.role);

        if (data.role !== "admin") {
          router.push("/my-bookings");
          return;
        }

        fetchHotels();
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error checking user role:", error);
      router.push("/");
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await fetch("/api/myhotels");
      if (response.ok) {
        const data = await response.json();
        setHotels(data);
        applyFiltersAndSort(data);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = (hotelList: Hotel[]) => {
    let filtered = hotelList;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (h) =>
          h.title.toLowerCase().includes(query) ||
          h.description?.toLowerCase().includes(query) ||
          h.locationDescription?.toLowerCase().includes(query)
      );
    }

    // City filter
    if (filterCity.trim()) {
      filtered = filtered.filter(
        (h) => h.city.toLowerCase().includes(filterCity.toLowerCase())
      );
    }

    // Country filter
    if (filterCountry.trim()) {
      filtered = filtered.filter(
        (h) => h.country.toLowerCase().includes(filterCountry.toLowerCase())
      );
    }

    // Sorting
    if (sortBy === "name") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "date") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "rooms") {
      filtered.sort((a, b) => b.rooms.length - a.rooms.length);
    } else if (sortBy === "location") {
      filtered.sort((a, b) => `${a.city}, ${a.country}`.localeCompare(`${b.city}, ${b.country}`));
    }

    setFilteredHotels(filtered);
  };

  useEffect(() => {
    applyFiltersAndSort(hotels);
  }, [searchQuery, filterCity, filterCountry, sortBy]);

  const deleteHotel = async (hotelId: number) => {
    if (!confirm("Are you sure you want to delete this hotel?")) return;

    try {
      const response = await fetch(`/api/hotels/${hotelId}`, {
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
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const icons: { [key: string]: JSX.Element } = {
      freeWifi: <Wifi size={18} />,
      swimmingPool: <Waves size={18} />,
      gym: <Dumbbell size={18} />,
      spa: <Sparkles size={18} />,
      bar: <Wine size={18} />,
    };
    return icons[amenity] || null;
  };

  const getHotelAmenities = (hotel: Hotel) => {
    const amenities = [];
    if (hotel.freeWifi) amenities.push("freeWifi");
    if (hotel.swimmingPool) amenities.push("swimmingPool");
    if (hotel.gym) amenities.push("gym");
    if (hotel.spa) amenities.push("spa");
    if (hotel.bar) amenities.push("bar");
    return amenities;
  };

  const uniqueCities = [...new Set(hotels.map((h) => h.city))];
  const uniqueCountries = [...new Set(hotels.map((h) => h.country))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8">
          <p className="text-gray-600">Loading hotels...</p>
        </Card>
      </div>
    );
  }

  if (userRole !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">My Hotels</h1>
              <p className="text-gray-600 mt-2">Manage your hotel portfolio with locations</p>
            </div>
            <Link href="/addhotel">
              <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 px-6 py-3">
                <Plus size={20} />
                Add New Hotel
              </Button>
            </Link>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
              <p className="text-sm text-gray-600">Total Hotels</p>
              <p className="text-3xl font-bold text-blue-900">{hotels.length}</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100">
              <p className="text-sm text-gray-600">Total Rooms</p>
              <p className="text-3xl font-bold text-green-900">
                {hotels.reduce((sum, h) => sum + h.rooms.length, 0)}
              </p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100">
              <p className="text-sm text-gray-600">Cities</p>
              <p className="text-3xl font-bold text-purple-900">{uniqueCities.length}</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-pink-50 to-pink-100">
              <p className="text-sm text-gray-600">Countries</p>
              <p className="text-3xl font-bold text-pink-900">{uniqueCountries.length}</p>
            </Card>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="p-6 mb-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search size={20} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search hotels by name, description, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Toggle and Sort */}
            <div className="flex gap-2 items-center flex-wrap">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="flex items-center gap-2"
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Latest Added</option>
                <option value="name">Hotel Name</option>
                <option value="rooms">Most Rooms</option>
                <option value="location">By Location</option>
              </select>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by City
                  </label>
                  <select
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Cities</option>
                    {uniqueCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Country
                  </label>
                  <select
                    value={filterCountry}
                    onChange={(e) => setFilterCountry(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Countries</option>
                    {uniqueCountries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Hotels Grid */}
        {filteredHotels.length === 0 ? (
          <Card className="p-12 text-center">
            <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">
              {hotels.length === 0
                ? "You haven't added any hotels yet. Click the 'Add New Hotel' button to get started!"
                : "No hotels match your search filters."}
            </p>
          </Card>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredHotels.length}</span> of{" "}
              <span className="font-semibold">{hotels.length}</span> hotels
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map((hotel) => (
                <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition">
                  {/* Image */}
                  {hotel.image && (
                    <div className="relative h-48 bg-gray-200">
                      <img
                        src={hotel.image}
                        alt={hotel.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{hotel.title}</h3>

                    {/* Location */}
                    <div className="flex items-start gap-2 mb-4">
                      <MapPin size={18} className="text-blue-600 flex-shrink-0 mt-1" />
                      <div className="text-sm text-gray-600">
                        <p>{hotel.city}, {hotel.state}</p>
                        <p>{hotel.country}</p>
                        {hotel.locationDescription && (
                          <p className="text-xs text-gray-500 mt-1">{hotel.locationDescription}</p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {hotel.description}
                    </p>

                    {/* Amenities */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {getHotelAmenities(hotel).map((amenity) => (
                        <div
                          key={amenity}
                          className="p-2 bg-blue-50 text-blue-700 rounded-lg"
                          title={amenity}
                        >
                          {getAmenityIcon(amenity)}
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-gray-600">Rooms</p>
                        <p className="font-bold text-gray-900">{hotel.rooms.length}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-gray-600">Added</p>
                        <p className="font-bold text-gray-900">
                          {new Date(hotel.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link href={`/addhotel?id=${hotel.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2"
                        >
                          <Edit size={18} />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        onClick={() => deleteHotel(hotel.id)}
                        variant="outline"
                        className="flex-1 flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
