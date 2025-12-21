"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Calendar,
  MapPin,
  DollarSign,
  Trash2,
  Eye,
  Filter,
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";

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

export default function MyBooking() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    fetchBookings();
  }, [isLoaded, user]);

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

  const handleCancelBooking = async (bookingId: string) => {
    setCanceling(bookingId);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBookings(bookings.filter((b) => b.id !== bookingId));
        setShowCancelDialog(null);
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

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return nights;
  };

  const getStatusBadge = (status: string, paymentStatus: boolean) => {
    if (status === "cancelled") {
      return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-sm font-semibold">
          <AlertCircle size={16} />
          Cancelled
        </div>
      );
    }

    if (!paymentStatus) {
      return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-sm font-semibold">
          <Clock size={16} />
          Pending Payment
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm font-semibold">
        <CheckCircle size={16} />
        Confirmed
      </div>
    );
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors py-12">
      <Container>
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                My Bookings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                View and manage all your hotel reservations
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-200 dark:border-slate-700">
            {(["all", "pending", "confirmed", "cancelled"] as const).map(
              (filterOption) => (
                <Button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  variant={filter === filterOption ? "default" : "outline"}
                  className={`${
                    filter === filterOption
                      ? "bg-blue-600 text-white"
                      : "bg-transparent dark:text-gray-300"
                  }`}
                >
                  <Filter size={16} className="mr-2" />
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </Button>
              )
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Loading your bookings...
              </p>
            </div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
            <CardContent className="pt-12 text-center">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No Bookings Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === "all"
                  ? "You haven't made any bookings yet. Start exploring hotels!"
                  : `No ${filter} bookings found.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <Card
                key={booking.id}
                className="overflow-hidden hover:shadow-xl transition-shadow border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
                  {/* Hotel Image */}
                  <div className="relative h-56 md:h-full min-h-48 bg-gray-200 dark:bg-slate-700 col-span-1 overflow-hidden group">
                    {booking.hotel?.image &&
                    booking.hotel.image.startsWith("http") ? (
                      <Image
                        src={booking.hotel.image}
                        alt={booking.hotel.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400 dark:from-slate-600 dark:to-slate-700">
                        <span className="text-gray-500 dark:text-gray-300">
                          Hotel Image
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Booking Details */}
                  <div className="col-span-1 md:col-span-3 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          {booking.hotel?.title || "Hotel"}
                        </h3>
                        <CardDescription className="flex items-center text-gray-600 dark:text-gray-400">
                          <MapPin size={16} className="mr-2" />
                          {booking.hotel?.city}, {booking.hotel?.state},{" "}
                          {booking.hotel?.country}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(booking.status, booking.paymentStatus)}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical size={18} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye size={16} className="mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {booking.status !== "cancelled" && (
                              <DropdownMenuItem
                                onClick={() => setShowCancelDialog(booking.id)}
                                className="cursor-pointer text-red-600"
                              >
                                <Trash2 size={16} className="mr-2" />
                                Cancel Booking
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Room Info */}
                    {booking.room && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <span className="font-semibold">Room:</span> {booking.room.title}
                      </p>
                    )}

                    {/* Dates and Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-4 border-y border-gray-200 dark:border-slate-700">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">
                          Check-in
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                          <Calendar size={16} className="mr-2" />
                          {formatDate(booking.checkIn || "")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">
                          Check-out
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                          <Calendar size={16} className="mr-2" />
                          {formatDate(booking.checkOut || "")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">
                          Nights
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {calculateNights(booking.checkIn || "", booking.checkOut || "")} night
                          {calculateNights(booking.checkIn || "", booking.checkOut || "") !==
                          1
                            ? "s"
                            : ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">
                          Total Price
                        </p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400 flex items-center">
                          <DollarSign size={16} className="mr-1" />
                          {booking.totalPrice} {booking.currency}
                        </p>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex items-center gap-4">
                      {booking.breakfastIncluded && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-semibold">
                          🍽️ Breakfast Included
                        </span>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Booked on {formatDate(booking.bookedAt)}
                      </span>
                    </div>

                    {/* Actions */}
                    {booking.status !== "cancelled" && (
                      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                          <Eye size={16} className="mr-2" />
                          View Details
                        </Button>
                        <Button
                          onClick={() => setShowCancelDialog(booking.id)}
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Cancel Confirmation Dialog */}
        <AlertDialog
          open={showCancelDialog !== null}
          onOpenChange={() => setShowCancelDialog(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this booking? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Booking</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  showCancelDialog && handleCancelBooking(showCancelDialog)
                }
                disabled={canceling !== null}
                className="bg-red-600 hover:bg-red-700"
              >
                {canceling ? (
                  <>
                    <Loader size={16} className="mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Cancel Booking"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Container>
    </div>
  );
}
