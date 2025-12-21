'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormLabel, FormDescription } from '@/components/ui/form';

interface LocationSelectorProps {
  onLocationChange: (location: { country: string; state: string; city: string }) => void;
  defaultCountry?: string;
  defaultState?: string;
  defaultCity?: string;
}

// Sample location data - expand as needed
const COUNTRIES = {
  'United States': {
    'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'],
    'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany'],
    'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio'],
    'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville'],
  },
  'United Kingdom': {
    'England': ['London', 'Manchester', 'Birmingham', 'Leeds'],
    'Scotland': ['Edinburgh', 'Glasgow', 'Aberdeen'],
    'Wales': ['Cardiff', 'Swansea'],
  },
  'Canada': {
    'Ontario': ['Toronto', 'Ottawa', 'Hamilton'],
    'British Columbia': ['Vancouver', 'Victoria'],
    'Quebec': ['Montreal', 'Quebec City'],
  },
  'Australia': {
    'New South Wales': ['Sydney', 'Newcastle'],
    'Victoria': ['Melbourne', 'Geelong'],
    'Queensland': ['Brisbane', 'Gold Coast'],
  },
};

export default function LocationSelector({
  onLocationChange,
  defaultCountry = '',
  defaultState = '',
  defaultCity = '',
}: LocationSelectorProps) {
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [selectedState, setSelectedState] = useState(defaultState);
  const [selectedCity, setSelectedCity] = useState(defaultCity);

  const states = selectedCountry
    ? Object.keys(COUNTRIES[selectedCountry as keyof typeof COUNTRIES] || {})
    : [];

  const cities =
    selectedCountry && selectedState
      ? COUNTRIES[selectedCountry as keyof typeof COUNTRIES]?.[
          selectedState as keyof typeof COUNTRIES['United States']
        ] || []
      : [];

  useEffect(() => {
    if (selectedCountry && selectedState && selectedCity) {
      onLocationChange({
        country: selectedCountry,
        state: selectedState,
        city: selectedCity,
      });
    }
  }, [selectedCountry, selectedState, selectedCity, onLocationChange]);

  return (
    <div className="space-y-4">
      <FormLabel>Hotel Location</FormLabel>
      <FormDescription>
        Select the country, state/province, and city where your hotel is located.
      </FormDescription>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Country Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Country</label>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(COUNTRIES).map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* State Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">State/Province</label>
          <Select
            value={selectedState}
            onValueChange={setSelectedState}
            disabled={!selectedCountry}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">City</label>
          <Select
            value={selectedCity}
            onValueChange={setSelectedCity}
            disabled={!selectedState}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedCountry && selectedState && selectedCity && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-slate-700">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Selected Location:</strong> {selectedCity}, {selectedState}, {selectedCountry}
          </p>
        </div>
      )}
    </div>
  );
}
