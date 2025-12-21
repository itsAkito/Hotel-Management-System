"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Home, FileText, Clock } from "lucide-react";

interface BookingDetails {
  id: number;
  hotelId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export default function BookingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      // In a real app, you'd fetch from an API
      // For now, we'll show a success message without fetching
      setLoading(false);
    } catch (error) {
      console.error("Error fetching booking:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <Container>
        {/* Success Animation */}
        <div className="py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-6 animate-bounce">
              <CheckCircle className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Booking Confirmed! 🎉
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
              Your reservation has been successfully created
            </p>
            {bookingId && (
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Booking ID: <span className="font-mono font-bold">{bookingId}</span>
              </p>
            )}
          </div>

          {/* Success Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Booking Number */}
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <FileText className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Booking Confirmation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Check your email for confirmation details
              </p>
            </Card>

            {/* Next Steps */}
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Clock className="h-12 w-12 text-orange-600 dark:text-orange-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Check-in Info
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Review check-in details in your account
              </p>
            </Card>

            {/* View Bookings */}
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Home className="h-12 w-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                My Bookings
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Access your booking anytime
              </p>
            </Card>
          </div>

          {/* Important Information */}
          <Card className="p-8 mb-12 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              ℹ️ Important Information
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="shrink-0 w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-400 text-white dark:text-slate-900 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Check-in Instructions
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    A detailed check-in email with instructions has been sent to your registered email address. Please arrive by 3:00 PM on your check-in date.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="shrink-0 w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-400 text-white dark:text-slate-900 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Cancellation Policy
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Free cancellation up to 48 hours before check-in. After that, full charges will apply.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="shrink-0 w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-400 text-white dark:text-slate-900 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Special Requests
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    If you have special requests (late check-in, high floor, etc.), contact the hotel directly through your booking details.
                  </p>
                </div>
              </li>
            </ul>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/my-bookings")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              View My Bookings
            </Button>
            <Button
              onClick={() => router.push("/book-stay")}
              variant="outline"
              className="px-8 py-3 text-lg"
            >
              Book Another Stay
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="px-8 py-3 text-lg"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
