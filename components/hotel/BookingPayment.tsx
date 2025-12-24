'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

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
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [orderCreated, setOrderCreated] = useState(false);

  const nightsDiff = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Initialize booking and create Razorpay order
  useEffect(() => {
    if (!user || orderCreated) return;

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
        setBookingId(data.booking.id);
        setOrderCreated(true);
      } catch (err) {
        console.error('Payment initialization error:', err);
        setError(err instanceof Error ? err.message : 'Payment initialization failed');
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [user, roomId, hotelId, checkIn, checkOut, breakfastIncluded, currency, totalPrice, userName, orderCreated]);

  const handlePayment = async () => {
    if (!bookingId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch Razorpay order from backend
      const orderResponse = await fetch(`/api/bookings/${bookingId}/razorpay-order`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to get payment order');
      }

      const orderData = await orderResponse.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(totalPrice * 100), // Amount in paise
        currency: currency.toUpperCase(),
        name: hotelTitle,
        description: `Booking for ${roomTitle}`,
        order_id: orderData.razorpayOrderId,
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch(`/api/bookings/${bookingId}/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            // Payment successful, redirect to confirmation
            router.push(`/booking-confirmation?bookingId=${bookingId}&hotelId=${hotelId}&roomId=${roomId}`);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Payment verification failed');
          }
        },
        prefill: {
          name: userName || user?.fullName || 'Guest',
          email: user?.primaryEmailAddress?.emailAddress || '',
          contact: user?.phoneNumbers?.[0]?.phoneNumber || '',
        },
        theme: {
          color: '#3399cc',
        },
      };

      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !orderCreated) {
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
        <Button
          onClick={handlePayment}
          disabled={loading || !bookingId}
          className="w-full py-6 text-lg font-semibold"
        >
          {loading ? 'Processing...' : 'Proceed to Payment'}
        </Button>
      </Card>

      <div className="text-sm text-gray-600 text-center">
        <p>Your booking ID: {bookingId}</p>
        <p>Secure payment powered by Razorpay</p>
      </div>
    </div>
  );
}