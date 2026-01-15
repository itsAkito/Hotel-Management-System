import React from 'react';
import { Star, MapPin, IndianRupee } from 'lucide-react';

const HotelCard = ({ hotel }) => {
  // Check if hotel is available based on status
  const isAvailable = hotel.status === 'Available';

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      
      {/* 1. Image Section */}
      <div className="relative h-56 w-full overflow-hidden">
        <img 
          src={hotel.image} 
          alt={hotel.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Availability Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
            isAvailable 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {hotel.status || 'Available'}
          </span>
        </div>

        {/* Rating Overlay */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-bold text-gray-800">{hotel.rating || "4.8"}</span>
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
            {hotel.title || hotel.name}
          </h3>
        </div>

        {/* Location (Optional but adds to UI) */}
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin className="w-3.5 h-3.5 mr-1" />
          <span>{hotel.city || hotel.location || "Prime Location"}</span>
        </div>

        {/* 3. Pricing & Booking Section */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Price starts at</p>
            <div className="flex items-center text-xl font-bold text-gray-900">
              <IndianRupee className="w-4 h-4" />
              <span>{hotel.price || hotel.pricePerNight || "0"}</span>
              <span className="text-sm font-normal text-gray-500 ml-1">/night</span>
            </div>
          </div>

          <button 
            disabled={!isAvailable}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
              isAvailable 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
            }`}
          >
            {isAvailable ? 'Book Now' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
