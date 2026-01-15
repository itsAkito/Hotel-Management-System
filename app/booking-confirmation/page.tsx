"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, MapPin, Calendar, Users, DollarSign, AlertCircle } from "lucide-react";

interface BookingData {
  hotelId: number;
  hotelTitle: string;
  roomId: number;
  roomTitle: string;
  roomPrice: number;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
}

export default function BookingConfirmationPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmingBooking, setConfirmingBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  // Get booking data from sessionStorage
  useEffect(() => {
    const data = sessionStorage.getItem("bookingData");
    if (data) {
      setBookingData(JSON.parse(data));
    }
    setLoading(false);
  }, []);

  // Calculate nights and total price
  const calculateNights = () => {
    if (!bookingData) return 0;
    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const nights = calculateNights();
  const totalPrice = bookingData ? bookingData.roomPrice * nights : 0;

  // Confirm booking
  const handleConfirmBooking = async () => {
    if (!bookingData || !user) {
      setBookingError("Missing booking information");
      return;
    }

    setConfirmingBooking(true);
    setBookingError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId: bookingData.hotelId,
          roomId: bookingData.roomId,
          checkInDate: bookingData.checkInDate,
          checkOutDate: bookingData.checkOutDate,
          numberOfGuests: bookingData.guests,
          totalPrice: totalPrice,
          userId: user.id,
        }),
      });

      if (response.ok) {
        const booking = await response.json();
        // Clear session storage
        sessionStorage.removeItem("bookingData");
        // Redirect to success page
        router.push(`/booking-success?bookingId=${booking.id}`);
      } else {
        const error = await response.json();
        setBookingError(error.message || "Failed to confirm booking");
      }
    } catch (error) {
      console.error("Booking error:", error);
      setBookingError("An error occurred while processing your booking");
    } finally {
      setConfirmingBooking(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <Container>
          <div className="py-16 text-center">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Booking Data Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please start a new booking from the Book a Stay page
            </p>
            <Button
              onClick={() => router.push("/book-stay")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Back to Book a Stay
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <Container>
        {/* Header */}
        <div className="py-8 border-b border-gray-200 dark:border-slate-800">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            ✨ Review Your Booking
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please review the details and confirm your reservation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
          {/* Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hotel Info */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Hotel Details
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Hotel Name</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {bookingData.hotelTitle}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Room Type</p>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {bookingData.roomTitle}
                  </p>
                </div>
              </div>
            </Card>

            {/* Stay Details */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Stay Details
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Check-in Date</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {new Date(bookingData.checkInDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Check-out Date</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {new Date(bookingData.checkOutDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Number of Guests</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {bookingData.guests} {bookingData.guests === 1 ? "Guest" : "Guests"}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <span className="text-sm">Number of Nights</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {nights} {nights === 1 ? "Night" : "Nights"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Guest Info */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Guest Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 bg-linear-to-br from-blue-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 border-2 border-blue-200 dark:border-blue-900">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Price Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    ${bookingData.roomPrice} × {nights} night{nights !== 1 ? "s" : ""}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-t-2 border-gray-300 dark:border-slate-700 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    Total Price
                  </span>
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {bookingError && (
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg mb-4">
                  {bookingError}
                </div>
              )}

              <Button
                onClick={handleConfirmBooking}
                disabled={confirmingBooking}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 text-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {confirmingBooking ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Confirm Booking
                  </>
                )}
              </Button>

              <Button
                onClick={() => router.back()}
                variant="outline"
                className="w-full mt-3"
              >
                Cancel
              </Button>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
