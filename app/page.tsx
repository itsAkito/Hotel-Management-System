"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import FeaturedSection from "@/components/FeaturedSection";
import Image from "next/image";

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] w-full overflow-hidden">
        <Image
          src="/Image/heroImage.png"
          alt="Hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Hotel
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-200">
              Discover amazing hotels and book your next adventure
            </p>
            {isLoaded && !user && (
              <Button
                onClick={() => router.push("/sign-in")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      {isLoaded && user && (
        <section className="py-8 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
          <Container>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button
                onClick={() => router.push("/hotel/new")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                ➕ Add New Hotel
              </Button>
              <Button
                onClick={() => router.push("/my-hotels")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                🏨 My Hotels
              </Button>
              <Button
                onClick={() => router.push("/my-bookings")}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                📅 My Bookings
              </Button>
            </div>
          </Container>
        </section>
      )}

      {/* Featured Hotels Section */}
      <FeaturedSection />

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
        <Container>
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Best Hotels
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Carefully selected hotels with great ratings and reviews
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Best Prices
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Competitive prices with transparent booking process
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Easy Booking
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Simple and secure booking experience
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Hotels Stats */}
      <section className="py-16 bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">8+</div>
              <p className="text-blue-100">Premium Hotels</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <p className="text-blue-100">Rooms Available</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <p className="text-blue-100">Customer Support</p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
