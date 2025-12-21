'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Calendar, MapPin, DollarSign, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

interface BookingCardProps {
  id: string;
  hotel: {
    id: number;
    title: string;
    image?: string;
  };
  room: {
    id: number;
    title: string;
    roomPrice: number;
  };
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'failed';
  paymentStatus: boolean;
  breakfastIncluded: boolean;
  onCancelled?: () => void;
}

export default function BookingCard({
  id,
  hotel,
  room,
  checkIn,
  checkOut,
  totalPrice,
  currency,
  status,
  paymentStatus,
  breakfastIncluded,
  onCancelled,
}: BookingCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCancel = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      toast.success('Booking cancelled successfully');
      onCancelled?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to cancel booking');
    } finally {
      setIsDeleting(false);
    }
  };

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nightsDiff = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const getStatusIcon = () => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 border-green-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      case 'cancelled':
      case 'failed':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-white';
    }
  };

  return (
    <Card className={`overflow-hidden ${getStatusColor()}`}>
      <div className="md:flex">
        {hotel.image && (
          <div className="md:w-48 h-48 md:h-auto overflow-hidden">
            <img
              src={hotel.image}
              alt={hotel.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1 p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">{hotel.title}</h3>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4" />
                {room.title}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-3 md:mt-0">
              {getStatusIcon()}
              <span className="font-semibold capitalize text-sm">{status}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Check-in</p>
              <p className="font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {checkInDate.toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Check-out</p>
              <p className="font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {checkOutDate.toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Nights</p>
              <p className="font-semibold">{nightsDiff}</p>
            </div>
          </div>

          {breakfastIncluded && (
            <p className="text-sm text-green-600 font-medium mb-3">
              ✓ Breakfast included
            </p>
          )}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500">Total Price</p>
                <p className="text-lg font-bold">
                  {currency} {totalPrice.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {paymentStatus ? (
                <span className="text-sm font-semibold text-green-600">
                  ✓ Payment Confirmed
                </span>
              ) : (
                <span className="text-sm font-semibold text-yellow-600">
                  ⏳ Awaiting Payment
                </span>
              )}
            </div>

            {status !== 'cancelled' && status !== 'failed' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel this booking?
                    {paymentStatus && ' A refund will be processed to your original payment method.'}
                  </AlertDialogDescription>
                  <div className="flex justify-end gap-2">
                    <AlertDialogCancel>No, Keep It</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancel}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Yes, Cancel Booking
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}