'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

interface BookingPaymentProps {
  roomId: number;
  hotelId: number;
  checkIn: Date;
  checkOut: Date;
  breakfastIncluded: boolean;
  totalPrice: number;
  currency: string;
  roomTitle: string;
  hotelTitle: string;
  userName?: string;
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

export default function BookingPayment({
  roomId,
  hotelId,
  checkIn,
  checkOut,
  breakfastIncluded,
  totalPrice,
  currency,
  roomTitle,
  hotelTitle,
  userName,
}: BookingPaymentProps) {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const nightsDiff = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
  );

  useEffect(() => {
    if (!user) return;

    const initializePayment = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userName: userName || user.fullName || 'Guest',
            roomId: roomId.toString(),
            hotelId: hotelId.toString(),
            checkIn: checkIn.toISOString(),
            checkOut: checkOut.toISOString(),
            breakfastIncluded,
            currency,
            totalPrice,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create booking');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
        setBookingId(data.booking.id);
      } catch (err) {
        console.error('Payment initialization error:', err);
        setError(err instanceof Error ? err.message : 'Payment initialization failed');
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [user, roomId, hotelId, checkIn, checkOut, breakfastIncluded, currency, totalPrice, userName]);

  if (loading || !clientSecret) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Booking Summary</h2>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="font-medium">Hotel:</span>
            <span>{hotelTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Room:</span>
            <span>{roomTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Check-in:</span>
            <span>{checkIn.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Check-out:</span>
            <span>{checkOut.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Nights:</span>
            <span>{nightsDiff}</span>
          </div>
          {breakfastIncluded && (
            <div className="flex justify-between text-green-600">
              <span className="font-medium">✓ Breakfast Included</span>
            </div>
          )}

          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>
                {currency} {totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-700">{error}</p>
        </Card>
      )}

      <Card className="p-6">
        {clientSecret && (
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        )}
      </Card>

      <div className="text-sm text-gray-600 text-center">
        <p>Your booking ID: {bookingId}</p>
        <p>Secure payment powered by Stripe</p>
      </div>
    </div>
  );
}