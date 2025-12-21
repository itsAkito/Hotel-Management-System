"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import BookingCard from "@/components/hotel/BookingCard";
import { Calendar, MapPin, DollarSign, Search, CheckCircle2, Clock, XCircle } from "lucide-react";

interface Booking {
  id: string;
  userName: string;
  hotelId: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
  currency: string;
  totalPrice: number;
  breakfastIncluded: boolean;
  status: string;
  paymentStatus: boolean;
  bookedAt: string;
  hotel?: {
    id: number;
    title: string;
    image: string;
    country: string;
    state: string;
    city: string;
  };
  room?: {
    id: number;
    title: string;
  };
}

export default function MyBookingsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "price">("date");
  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    fetchBookings();
  }, [isLoaded, user]);

  useEffect(() => {
    filterAndSortBookings();
  }, [bookings, filter, searchQuery, sortBy]);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings");
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBookings = () => {
    let filtered = bookings.filter((booking) => {
      // Filter by status
      if (filter !== "all" && booking.status !== filter) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          booking.hotel?.title.toLowerCase().includes(query) ||
          booking.hotel?.city?.toLowerCase().includes(query) ||
          booking.room?.title.toLowerCase().includes(query)
        );
      }

      return true;
    });

    // Sort
    if (sortBy === "date") {
      filtered.sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime());
    } else if (sortBy === "price") {
      filtered.sort((a, b) => b.totalPrice - a.totalPrice);
    }

    setFilteredBookings(filtered);
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setCanceling(bookingId);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBookings(bookings.filter((b) => b.id !== bookingId));
        alert("Booking cancelled successfully");
      } else {
        alert("Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert("Error canceling booking");
    } finally {
      setCanceling(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const stats = [
    {
      label: "Total Bookings",
      value: bookings.length,
      icon: "📅",
      color: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      label: "Confirmed",
      value: bookings.filter((b) => b.status === "confirmed").length,
      icon: "✓",
      color: "bg-green-100 dark:bg-green-900/20",
    },
    {
      label: "Pending",
      value: bookings.filter((b) => b.status === "pending").length,
      icon: "⏳",
      color: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      label: "Cancelled",
      value: bookings.filter((b) => b.status === "cancelled").length,
      icon: "✕",
      color: "bg-red-100 dark:bg-red-900/20",
    },
  ];

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
              My Bookings
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Manage and track your hotel reservations
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        {!loading && bookings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            {stats.map((stat) => (
              <Card key={stat.label} className={`p-6 border-0 ${stat.color}`}>
                <div className="space-y-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    {stat.label}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Filter and Search Section */}
        {!loading && bookings.length > 0 && (
          <Card className="mb-8 p-6 space-y-4 border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search Bookings
                </label>
                <Input
                  placeholder="Hotel name, room type, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-slate-200 dark:border-slate-700"
                />
              </div>

              {/* Filter */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-white">
                  Status
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="all">All Bookings</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
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
                  <option value="date">Recently Booked</option>
                  <option value="price">Highest Price</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Showing <span className="font-semibold text-slate-900 dark:text-white">{filteredBookings.length}</span> of{" "}
                <span className="font-semibold text-slate-900 dark:text-white">{bookings.length}</span> bookings
              </p>
            </div>
          </Card>
        )}

        {/* Bookings List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                Loading your bookings...
              </p>
            </div>
          </div>
        ) : filteredBookings.length === 0 && searchQuery ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-6">
              No bookings match your search
            </p>
            <Button
              onClick={() => setSearchQuery("")}
              variant="outline"
              className="text-slate-600 dark:text-slate-400"
            >
              Clear Search
            </Button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="text-5xl mb-4">📅</div>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-6">
              {filter === "all"
                ? "You have no bookings yet"
                : `No ${filter} bookings`}
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Explore Hotels
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                id={booking.id}
                hotel={{
                  id: booking.hotel?.id || 0,
                  title: booking.hotel?.title || "Hotel",
                  image: booking.hotel?.image,
                }}
                room={{
                  id: booking.room?.id || 0,
                  title: booking.room?.title || "Room",
                  roomPrice: 0,
                }}
                checkIn={booking.checkIn}
                checkOut={booking.checkOut}
                totalPrice={booking.totalPrice}
                currency={booking.currency}
                status={booking.status as any}
                paymentStatus={booking.paymentStatus}
                breakfastIncluded={booking.breakfastIncluded}
                onCancelled={() => handleCancelBooking(booking.id)}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
