
// 'use client'
// import { Search } from 'lucide-react';
// import { Input } from "./ui/input"

// const SearchInput = () => {
//     return (
//         <div className='relative w-full max-w-sm'>
//             <div className='absolute left-3 top-1/2 -translate-y-2 text-muted-foreground h-4 w-4'>
//                 <Search></Search>
//                 <Input placeholder='Search' className='pl-8 bg-white/20' />
//             </div>
//         </div>
//     )
// }
// export default SearchInput
'use client';

import { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { DateRangePicker } from './ui/date-range-picker';
import { useSearchStore } from '@/lib/store';
import { DateRange } from 'react-day-picker';
import { useRouter } from 'next/navigation';

const SearchInput = () => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const { filters, setSearchQuery, setLocation, setDateRange, setGuests } = useSearchStore();
  const [guestCount, setGuestCount] = useState(filters.guests.toString());

  const handleSearch = () => {
    setGuests(parseInt(guestCount) || 1);
    router.push('/search');
  };

  const handleDateRangeChange = (dateRange: DateRange | undefined) => {
    setDateRange(dateRange);
  };

  return (
    <div className="w-full max-w-2xl">
      {!isExpanded ? (
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 h-4 w-5" />
          <Input
            placeholder="Search hotels, cities..."
            className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70 cursor-pointer hover:bg-white/30 focus:bg-white/40 transition-colors focus:border-white/50"
            onClick={() => setIsExpanded(true)}
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in duration-200">
          {/* Title */}
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Find Your Perfect Hotel
          </h3>

          {/* Search Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Query */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Search className="h-4 w-4" />
                Hotel Name
              </label>
              <Input
                placeholder="Search hotel..."
                value={filters.searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-slate-200 dark:border-slate-700"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </label>
              <Input
                placeholder="City, region..."
                value={filters.location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-slate-200 dark:border-slate-700"
              />
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Dates
              </label>
              <DateRangePicker
                dateRange={filters.dateRange}
                onDateRangeChange={handleDateRangeChange}
                placeholder="Check-in to Check-out"
              />
            </div>

            {/* Guests */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Guests
              </label>
              <Input
                type="number"
                min="1"
                max="20"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              onClick={() => setIsExpanded(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSearch}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Search Hotels
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInput;