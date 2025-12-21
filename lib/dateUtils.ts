/**
 * Check if two date ranges overlap
 * @param checkIn1 Start date of first booking
 * @param checkOut1 End date of first booking
 * @param checkIn2 Start date of second booking
 * @param checkOut2 End date of second booking
 * @returns true if ranges overlap, false otherwise
 */
export function doDateRangesOverlap(
  checkIn1: Date,
  checkOut1: Date,
  checkIn2: Date,
  checkOut2: Date
): boolean {
  return checkIn1 < checkOut2 && checkIn2 < checkOut1;
}

/**
 * Check if a booking overlaps with existing bookings
 * @param checkIn Check-in date
 * @param checkOut Check-out date
 * @param existingBookings Array of existing bookings to check against
 * @param roomId Room ID to check (optional, for same room check)
 * @returns true if overlap exists, false otherwise
 */
export function hasBookingOverlap(
  checkIn: Date,
  checkOut: Date,
  existingBookings: any[],
  roomId?: number
): boolean {
  return existingBookings.some((booking) => {
    // Only check same room bookings if roomId is provided
    if (roomId && booking.roomId !== roomId) {
      return false;
    }

    // Skip cancelled or failed bookings
    if (booking.status === 'cancelled' || booking.status === 'failed') {
      return false;
    }

    const bookingCheckIn = new Date(booking.checkIn);
    const bookingCheckOut = new Date(booking.checkOut);

    return doDateRangesOverlap(checkIn, checkOut, bookingCheckIn, bookingCheckOut);
  });
}

/**
 * Calculate number of nights between two dates
 * @param checkIn Check-in date
 * @param checkOut Check-out date
 * @returns Number of nights
 */
export function calculateNights(checkIn: Date, checkOut: Date): number {
  const timeDiff = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

/**
 * Calculate total price including breakfast
 * @param roomPrice Price per night
 * @param nights Number of nights
 * @param breakfastIncluded Whether breakfast is included
 * @param breakfastPrice Price of breakfast per night
 * @returns Total price
 */
export function calculateTotalPrice(
  roomPrice: number,
  nights: number,
  breakfastIncluded: boolean = false,
  breakfastPrice: number = 0
): number {
  const roomTotal = roomPrice * nights;
  const breakfastTotal = breakfastIncluded ? breakfastPrice * nights : 0;
  return roomTotal + breakfastTotal;
}

/**
 * Format date to readable string
 * @param date Date to format
 * @returns Formatted date string (MM/DD/YYYY)
 */
export function formatDateToString(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
}

/**
 * Get available rooms based on date range and existing bookings
 * @param rooms All rooms in the hotel
 * @param checkIn Check-in date
 * @param checkOut Check-out date
 * @param existingBookings Array of existing bookings
 * @returns Array of available rooms
 */
export function getAvailableRooms(
  rooms: any[],
  checkIn: Date,
  checkOut: Date,
  existingBookings: any[]
): any[] {
  return rooms.filter((room) => {
    const roomBookings = existingBookings.filter((b) => b.roomId === room.id);
    return !hasBookingOverlap(checkIn, checkOut, roomBookings, room.id);
  });
}
