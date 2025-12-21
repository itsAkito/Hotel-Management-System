"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, Wifi, Utensils, Waves } from "lucide-react";

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
}

export default function FeaturedSection() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchFeaturedHotels();
  }, []);

  const fetchFeaturedHotels = async () => {
    try {
      const response = await fetch("/api/addhotel");
      if (response.ok) {
        const data = await response.json();
        // Filter hotels with images and limit to 3
        const featured = data.filter((h: Hotel) => h.image).slice(0, 3);
        setHotels(featured);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMinPrice = (rooms: Room[]) => {
    if (!rooms || rooms.length === 0) return "N/A";
    const prices = rooms.map((r) => r.roomPrice);
    return `$${Math.min(...prices)}`;
  };

  if (loading) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500 dark:text-gray-400">No featured hotels available yet.</p>
      </div>
    );
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Hotels
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Check out our handpicked selection of premium hotels
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              onClick={() => router.push(`/hotel/${hotel.id}`)}
              className="group bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative h-64 w-full overflow-hidden bg-gray-200 dark:bg-slate-700">
                {hotel.image ? (
                  <Image
                    src={hotel.image}
                    alt={hotel.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    priority={false}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                    <span className="text-2xl">📷 No Image</span>
                  </div>
                )}
              </div>

              {/* Content Container */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {hotel.title}
                </h3>

                {/* Location */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {hotel.city}, {hotel.state}, {hotel.country}
                </p>

                {/* Description */}
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                  {hotel.description}
                </p>

                {/* Amenities Icons */}
                <div className="flex gap-4 mb-4">
                  {hotel.freeWifi && (
                    <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                      <Wifi size={16} />
                      <span>WiFi</span>
                    </div>
                  )}
                  {hotel.restaurant && (
                    <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                      <Utensils size={16} />
                      <span>Dining</span>
                    </div>
                  )}
                  {hotel.swimmingPool && (
                    <div className="flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400">
                      <Waves size={16} />
                      <span>Pool</span>
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900 dark:text-white">4.8</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">(256 reviews)</span>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Starting from</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {getMinPrice(hotel.rooms)}
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
