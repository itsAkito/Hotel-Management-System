'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { calculateNights, doDateRangesOverlap, calculateTotalPrice } from '@/lib/dateUtils';

interface DateRangePickerTutorialProps {
  hotelTitle?: string;
  roomPrice?: number;
  breakfastPrice?: number;
  onConfirm?: (dateRange: DateRange, nights: number, totalPrice: number) => void;
}

export function DateRangePickerTutorial({
  hotelTitle = 'Sample Hotel',
  roomPrice = 100,
  breakfastPrice = 20,
  onConfirm,
}: DateRangePickerTutorialProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [breakfastIncluded, setBreakfastIncluded] = useState(false);
  const [showSteps, setShowSteps] = useState(true);

  const nights = dateRange?.from && dateRange?.to ? calculateNights(dateRange.from, dateRange.to) : 0;
  const totalPrice = roomPrice * (nights || 1) + (breakfastIncluded ? breakfastPrice * (nights || 1) : 0);

  const handleConfirm = () => {
    if (dateRange?.from && dateRange?.to) {
      onConfirm?.(dateRange, nights, totalPrice);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      {/* Title */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Book Your Stay at {hotelTitle}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Select your check-in and check-out dates to see availability and pricing
        </p>
      </div>

      {/* Main Booking Card */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Select Your Dates</CardTitle>
          <CardDescription>
            Pick your check-in and check-out dates from the calendar below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Range Picker */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Check-in & Check-out Dates
            </label>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Select date range"
            />
          </div>

          {/* Price Breakdown */}
          {dateRange?.from && dateRange?.to && (
            <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-900 dark:text-blue-300">
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Check-in:</span> {dateRange.from.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p>
                    <span className="font-semibold">Check-out:</span> {dateRange.to.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p>
                    <span className="font-semibold">Duration:</span> {nights} night{nights !== 1 ? 's' : ''}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Breakfast Option */}
          {dateRange?.from && dateRange?.to && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">
                Add Breakfast?
              </label>
              <div className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-colors"
                onClick={() => setBreakfastIncluded(!breakfastIncluded)}
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {breakfastIncluded ? '✓ ' : ''}Breakfast Included
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    ${breakfastPrice}/night • {nights} night{nights !== 1 ? 's' : ''} = ${breakfastPrice * nights}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={breakfastIncluded}
                  onChange={() => setBreakfastIncluded(!breakfastIncluded)}
                  className="w-5 h-5"
                />
              </div>
            </div>
          )}

          {/* Price Summary */}
          {dateRange?.from && dateRange?.to && (
            <Alert className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-900 dark:text-green-300">
                <div className="space-y-2">
                  <p className="font-semibold text-lg">Price Breakdown:</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Room: ${roomPrice} × {nights} night{nights !== 1 ? 's' : ''}</span>
                      <span className="font-medium">${roomPrice * nights}</span>
                    </div>
                    {breakfastIncluded && (
                      <div className="flex justify-between">
                        <span>Breakfast: ${breakfastPrice} × {nights} night{nights !== 1 ? 's' : ''}</span>
                        <span className="font-medium">${breakfastPrice * nights}</span>
                      </div>
                    )}
                    <div className="border-t border-green-300 dark:border-green-800 pt-2 mt-2 flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Action Button */}
          <Button
            onClick={handleConfirm}
            disabled={!dateRange?.from || !dateRange?.to}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3"
          >
            {dateRange?.from && dateRange?.to ? 'Confirm & Proceed to Payment' : 'Select Dates to Continue'}
          </Button>
        </CardContent>
      </Card>

      {/* Tutorial Steps */}
      {showSteps && (
        <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">How to Book</CardTitle>
              <button
                onClick={() => setShowSteps(false)}
                className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              >
                Hide
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Select Check-in Date</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Click on the calendar to choose your arrival date</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Select Check-out Date</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Select your departure date to calculate the total stay</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Review Pricing</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Check the price breakdown and add breakfast if needed</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Confirm Booking</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Click the confirm button to proceed with your reservation</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default DateRangePickerTutorial;
