"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, MapPin, Heart, Star } from "lucide-react";

interface Room {
  id: number;
  roomPrice: number;
  breakfastPrice: number;
}

interface FeaturedHotel {
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
  swimmingPool: boolean;
  freeWifi: boolean;
  rooms: Room[];
}

export default function FeaturedHotelsSection() {
  const router = useRouter();
  const [hotels, setHotels] = useState<FeaturedHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("/api/addhotel");
        if (response.ok) {
          const data = await response.json();
          const limited = data.slice(0, 8);
          setHotels(limited);
          const indices: { [key: number]: number } = {};
          limited.forEach((hotel: FeaturedHotel) => {
            indices[hotel.id] = 0;
          });
          setCurrentImageIndex(indices);
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const getMinPrice = (rooms: Room[]) => {
    if (!rooms || rooms.length === 0) return 0;
    return Math.min(...rooms.map((room) => room.roomPrice));
  };

  const rotateImage = (hotelId: number, direction: "next" | "prev") => {
    setCurrentImageIndex((prev) => {
      const current = prev[hotelId] || 0;
      const next = direction === "next" ? (current + 1) % 3 : (current - 1 + 3) % 3;
      return { ...prev, [hotelId]: next };
    });
  };

  const toggleFavorite = (hotelId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(hotelId)
        ? prev.filter((id) => id !== hotelId)
        : [...prev, hotelId]
    );
  };

  const fallbackImages = [
    "/Image/roomImg1.png",
    "/Image/roomImg2.png",
    "/Image/roomImg3.png",
  ];

  const getImageForHotel = (hotel: FeaturedHotel, imageIndex: number) => {
    if (hotel.image && hotel.image.startsWith("http")) {
      return hotel.image;
    }
    return fallbackImages[imageIndex % fallbackImages.length];
  };

  if (loading) {
    return (
      <section className="py-16">
        <Container>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-gray-200 dark:bg-slate-700 rounded-lg" />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-transparent via-blue-50/50 to-indigo-50/50 dark:via-slate-900/30 dark:to-slate-900/30">
      <Container>
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            ✨ Featured Hotels
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Discover our premium hotel selection with beautiful accommodations, world-class amenities, and exceptional service
          </p>
        </div>

        {hotels.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="pt-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">No hotels available</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hotels.map((hotel) => {
              const imageIndex = currentImageIndex[hotel.id] || 0;
              const imageUrl = getImageForHotel(hotel, imageIndex);
              const minPrice = getMinPrice(hotel.rooms);

              return (
                <Card
                  key={hotel.id}
                  className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  onClick={() => router.push(`/hotel/${hotel.id}`)}
                >
                  {/* Image Carousel */}
                  <div className="relative h-56 w-full bg-gray-200 dark:bg-slate-700 overflow-hidden group">
                    <Image
                      src={imageUrl}
                      alt={hotel.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    {/* Navigation Buttons */}
                    <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          rotateImage(hotel.id, "prev");
                        }}
                        className="h-8 w-8 p-0 bg-white/80 hover:bg-white dark:bg-slate-700/80 dark:hover:bg-slate-700 rounded-full"
                      >
                        <ChevronLeft size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          rotateImage(hotel.id, "next");
                        }}
                        className="h-8 w-8 p-0 bg-white/80 hover:bg-white dark:bg-slate-700/80 dark:hover:bg-slate-700 rounded-full"
                      >
                        <ChevronRight size={16} />
                      </Button>
                    </div>

                    {/* Image Indicators */}
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {[0, 1, 2].map((index) => (
                        <div
                          key={index}
                          className={`h-2 w-2 rounded-full transition-all ${
                            index === imageIndex
                              ? "bg-white w-6"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => toggleFavorite(hotel.id, e)}
                      className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-700/90 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-colors"
                    >
                      <Heart
                        size={18}
                        className={
                          favorites.includes(hotel.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400 dark:text-gray-500"
                        }
                      />
                    </button>

                    {/* Rating Badge */}
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-700/90 px-3 py-1 rounded-full flex items-center gap-1">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        4.8
                      </span>
                    </div>
                  </div>

                  {/* Hotel Info */}
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-gray-900 dark:text-white line-clamp-2">
                      {hotel.title}
                    </CardTitle>
                    <CardDescription className="flex items-center text-gray-600 dark:text-gray-400">
                      <MapPin size={16} className="mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">
                        {hotel.city}, {hotel.state}
                      </span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pb-4">
                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {hotel.description}
                    </p>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(
                        [
                          { key: "gym", icon: "🏋️" },
                          { key: "spa", icon: "🧖" },
                          { key: "bar", icon: "🍹" },
                          { key: "swimmingPool", icon: "🏊" },
                        ] as const
                      ).map(({ key, icon }) => (
                        hotel[key] && (
                          <span
                            key={key}
                            className="text-lg bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded"
                          >
                            {icon}
                          </span>
                        )
                      ))}
                      {hotel.freeWifi && (
                        <span className="text-lg bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                          📶
                        </span>
                      )}
                    </div>

                    {/* Price and Booking */}
                    <div className="border-t border-gray-200 dark:border-slate-700 pt-3">
                      <div className="flex items-baseline justify-between mb-3">
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                          From
                        </span>
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          ${minPrice}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                        per night (room only)
                      </p>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/hotel/${hotel.id}`);
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-2xl p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Can't Find Your Perfect Hotel?
          </h3>
          <p className="text-blue-100 mb-8 text-lg">
            Browse all available hotels or add your own to our platform
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={() => router.push("/my-hotels")}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3"
            >
              View All Hotels
            </Button>
            <Button
              onClick={() => router.push("/hotel/new")}
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-3 border border-blue-500"
            >
              Add Your Hotel
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
