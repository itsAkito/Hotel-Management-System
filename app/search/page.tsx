'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useSearchStore } from '@/lib/store';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Search, MapPin, Calendar, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { DateRange } from 'react-day-picker';

interface Room {
  id: number;
  roomPrice: number;
  breakfastPrice: number;
  title: string;
}

interface Hotel {
  id: number;
  title: string;
  description: string;
  image: string;
  country: string;
  state: string;
  city: string;
  rooms: Room[];
}

export default function SearchPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { filters, setSearchQuery, setLocation, setDateRange } = useSearchStore();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('price-asc');

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    filterHotels();
  }, [hotels, filters, sortBy]);

  const fetchHotels = async () => {
    try {
      const response = await fetch('/api/addhotel');
      if (response.ok) {
        const data = await response.json();
        setHotels(data);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterHotels = () => {
    let filtered = hotels.filter((hotel) => {
      // Search by hotel name
      if (
        filters.searchQuery &&
        !hotel.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
        !hotel.description?.toLowerCase().includes(filters.searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Filter by location (city, state, country)
      if (filters.location) {
        const locationLower = filters.location.toLowerCase();
        if (
          !hotel.city?.toLowerCase().includes(locationLower) &&
          !hotel.state?.toLowerCase().includes(locationLower) &&
          !hotel.country?.toLowerCase().includes(locationLower)
        ) {
          return false;
        }
      }

      return true;
    });

    // Sort results
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => {
        const priceA = a.rooms?.[0]?.roomPrice || 0;
        const priceB = b.rooms?.[0]?.roomPrice || 0;
        return priceA - priceB;
      });
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => {
        const priceA = a.rooms?.[0]?.roomPrice || 0;
        const priceB = b.rooms?.[0]?.roomPrice || 0;
        return priceB - priceA;
      });
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredHotels(filtered);
  };

  const getMinPrice = (rooms: Room[]) => {
    if (!rooms || rooms.length === 0) return 0;
    return Math.min(...rooms.map((room) => room.roomPrice));
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setLocation('');
    setDateRange(undefined);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Container>
        {/* Search Filters Section */}
        <div className="py-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Search Hotels
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Found {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Filter Card */}
          <Card className="p-6 space-y-4 border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search Query */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Hotel Name
                </label>
                <Input
                  placeholder="Search..."
                  value={filters.searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-slate-200 dark:border-slate-700"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </label>
                <Input
                  placeholder="City, state, country..."
                  value={filters.location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="border-slate-200 dark:border-slate-700"
                />
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Dates
                </label>
                <DateRangePicker
                  dateRange={filters.dateRange}
                  onDateRangeChange={setDateRange}
                  placeholder="Check-in to Check-out"
                />
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
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            {(filters.searchQuery || filters.location || filters.dateRange) && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  className="text-slate-600 dark:text-slate-400"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-96 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredHotels.length === 0 ? (
          <div className="py-24 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-6">
              <span className="text-5xl">🔍</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              No Hotels Found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Try adjusting your search filters
            </p>
            <Button
              onClick={handleClearFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
            {filteredHotels.map((hotel) => (
              <Card
                key={hotel.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-slate-200 dark:border-slate-800 flex flex-col"
                onClick={() => router.push(`/hotel/${hotel.id}`)}
              >
                {/* Image */}
                {hotel.image && (
                  <div className="relative h-48 w-full overflow-hidden bg-slate-200 dark:bg-slate-800 group">
                    <Image
                      src={hotel.image}
                      alt={hotel.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow space-y-4">
                  {/* Title & Location */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2">
                      {hotel.title}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                      <MapPin size={16} />
                      <span>
                        {hotel.city}, {hotel.state}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {hotel.description}
                  </p>

                  {/* Price */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-auto">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-widest font-semibold text-slate-500 dark:text-slate-400">
                          From
                        </p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                          ${getMinPrice(hotel.rooms)}
                          <span className="text-sm text-slate-600 dark:text-slate-400 font-normal">
                            /night
                          </span>
                        </p>
                      </div>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
