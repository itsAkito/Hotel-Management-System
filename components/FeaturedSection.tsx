"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Star, Wifi, Utensils, Waves } from "lucide-react";
import Container from "./Container";

interface Hotel {
  id: string;
  title: string;
  description: string;
  image: string | null;
  country: string;
  state: string;
  city: string;
  freeWifi: boolean;
  restaurant: boolean;
  swimmingPool: boolean;
  rooms: any[];
}

export default function FeaturedSection() {
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedHotels();
  }, []);

  const fetchFeaturedHotels = async () => {
    try {
      const response = await fetch("/api/addhotel");
      if (response.ok) {
        const data = await response.json();
        // Get only hotels with images, limit to first 3
        const hotelsWithImages = data
          .filter((h: Hotel) => h.image)
          .slice(0, 3);
        setHotels(hotelsWithImages);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-linear-to-b from-white to-blue-50 dark:from-slate-950 dark:to-slate-900">
        <Container>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </Container>
      </section>
    );
  }

  if (hotels.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-linear-to-b from-white to-blue-50 dark:from-slate-950 dark:to-slate-900">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            ⭐ Featured Hotels
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Discover our hand-picked selection of premium accommodations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel) => {
            const minPrice = hotel.rooms && hotel.rooms.length > 0
              ? Math.min(...hotel.rooms.map((r: any) => r.price || 0))
              : 0;

            return (
              <div
                key={hotel.id}
                onClick={() => router.push(`/hotel/${hotel.id}`)}
                className="group cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white dark:bg-slate-800"
              >
                {/* Image Container */}
                <div className="relative h-48 w-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
                  {hotel.image ? (
                    <Image
                      src={hotel.image}
                      alt={hotel.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-slate-600">
                      <span className="text-gray-500">📷</span>
                    </div>
                  )}
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-semibold flex items-center gap-1 shadow-md">
                    <Star size={16} className="fill-yellow-400" />
                    4.8
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {hotel.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                    <MapPin size={16} className="mr-2 shrink-0" />
                    <span className="line-clamp-1">
                      {hotel.city}, {hotel.state}, {hotel.country}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {hotel.description}
                  </p>

                  {/* Amenities Icons */}
                  <div className="flex gap-2 mb-4">
                    {hotel.freeWifi && (
                      <div
                        title="Free WiFi"
                        className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400"
                      >
                        <Wifi size={16} />
                      </div>
                    )}
                    {hotel.restaurant && (
                      <div
                        title="Restaurant"
                        className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400"
                      >
                        <Utensils size={16} />
                      </div>
                    )}
                    {hotel.swimmingPool && (
                      <div
                        title="Swimming Pool"
                        className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg text-cyan-600 dark:text-cyan-400"
                      >
                        <Waves size={16} />
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
                        From per night
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${Math.ceil(minPrice / 100)}
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-md">
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
