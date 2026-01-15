"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, MapPin, IndianRupee, ChevronDown } from "lucide-react";

interface Hotel {
  id: string | number;
  title?: string;
  name?: string;
  image: string;
  price?: number;
  pricePerNight?: number;
  rating?: number;
  city?: string;
  location?: string;
  status?: string;
}

interface FeaturedHotelsCarouselProps {
  hotels: Hotel[];
}

export default function FeaturedHotelsCarousel({ hotels }: FeaturedHotelsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  useEffect(() => {
    if (!isAutoScroll || hotels.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % hotels.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoScroll, hotels.length]);

  if (hotels.length === 0) {
    return null;
  }

  const currentHotel = hotels[currentIndex];
  const hotelName = currentHotel.title || currentHotel.name || "Hotel";
  const hotelPrice = currentHotel.price || currentHotel.pricePerNight || 0;
  const hotelRating = currentHotel.rating || 4.8;
  const hotelCity = currentHotel.city || currentHotel.location || "India";
  const hotelImage = currentHotel.image;

  return (
    <section className="relative w-full h-[600px] md:h-[700px] bg-gradient-to-br from-gray-900 to-black overflow-hidden group">
      {/* Background Image with Lazy Load */}
      <div className="absolute inset-0">
        <Image
          src={hotelImage}
          alt={hotelName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
          quality={75}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src =
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=75";
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 md:p-12 text-white">
        {/* Hotel Info */}
        <div className="mb-8 transform transition-all duration-500">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-lg font-bold">{hotelRating}</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">{hotelName}</h2>

          <div className="flex items-center gap-2 text-gray-300 mb-6">
            <MapPin className="w-5 h-5" />
            <span className="text-lg">{hotelCity}</span>
          </div>

          <div className="flex items-center gap-1 mb-6">
            <IndianRupee className="w-6 h-6" />
            <span className="text-3xl font-bold">{hotelPrice}</span>
            <span className="text-gray-400 ml-2">/night</span>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Explore Now
          </button>
        </div>

        {/* Carousel Dots/Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {hotels.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setIsAutoScroll(false);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-8 bg-blue-500"
                  : "w-2 bg-gray-500 hover:bg-gray-400"
              }`}
              aria-label={`Go to hotel ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white opacity-70" />
      </div>

      {/* Auto-scroll indicator */}
      {isAutoScroll && (
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white">
          Auto-scrolling
        </div>
      )}
    </section>
  );
}
