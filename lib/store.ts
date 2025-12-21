import { create } from 'zustand';
import { DateRange } from 'react-day-picker';

interface SearchFilters {
  searchQuery: string;
  location: string;
  dateRange: DateRange | undefined;
  guests: number;
  rooms: number;
}

interface SearchStore {
  // Search Filters
  filters: SearchFilters;
  setSearchQuery: (query: string) => void;
  setLocation: (location: string) => void;
  setDateRange: (dateRange: DateRange | undefined) => void;
  setGuests: (guests: number) => void;
  setRooms: (rooms: number) => void;
  clearFilters: () => void;

  // Bookings
  bookings: any[];
  setBookings: (bookings: any[]) => void;
  addBooking: (booking: any) => void;
  removeBooking: (bookingId: string) => void;

  // Hotels
  hotels: any[];
  setHotels: (hotels: any[]) => void;
  addHotel: (hotel: any) => void;
  removeHotel: (hotelId: number) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  filters: {
    searchQuery: '',
    location: '',
    dateRange: undefined,
    guests: 1,
    rooms: 1,
  },

  setSearchQuery: (query: string) =>
    set((state) => ({
      filters: { ...state.filters, searchQuery: query },
    })),

  setLocation: (location: string) =>
    set((state) => ({
      filters: { ...state.filters, location },
    })),

  setDateRange: (dateRange: DateRange | undefined) =>
    set((state) => ({
      filters: { ...state.filters, dateRange },
    })),

  setGuests: (guests: number) =>
    set((state) => ({
      filters: { ...state.filters, guests },
    })),

  setRooms: (rooms: number) =>
    set((state) => ({
      filters: { ...state.filters, rooms },
    })),

  clearFilters: () =>
    set({
      filters: {
        searchQuery: '',
        location: '',
        dateRange: undefined,
        guests: 1,
        rooms: 1,
      },
    }),

  // Bookings
  bookings: [],
  setBookings: (bookings: any[]) => set({ bookings }),
  addBooking: (booking: any) =>
    set((state) => ({
      bookings: [...state.bookings, booking],
    })),
  removeBooking: (bookingId: string) =>
    set((state) => ({
      bookings: state.bookings.filter((b) => b.id !== bookingId),
    })),

  // Hotels
  hotels: [],
  setHotels: (hotels: any[]) => set({ hotels }),
  addHotel: (hotel: any) =>
    set((state) => ({
      hotels: [...state.hotels, hotel],
    })),
  removeHotel: (hotelId: number) =>
    set((state) => ({
      hotels: state.hotels.filter((h) => h.id !== hotelId),
    })),
}));
