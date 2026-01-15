"use client";

import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const locations = {
    Cities: ["Mumbai", "Delhi", "Bangalore", "Goa", "Jaipur", "Udaipur"],
    Regions: ["North India", "South India", "Coastal Karnataka", "North East", "Himalayas"],
    TopDestinations: ["Manali", "Rishikesh", "Ooty", "Puducherry", "Shimla"],
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top Section: Branding & Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 border-b border-gray-800 pb-12">
          {/* Column 1: Brand Info */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">StayEase</h2>
            <p className="text-sm leading-relaxed text-gray-400">
              India's most trusted hotel booking platform. Find verified stays across 500+ cities with real-time availability.
            </p>
            <div className="flex space-x-4 mt-6">
              <Facebook className="w-5 h-5 hover:text-blue-500 cursor-pointer transition" />
              <Instagram className="w-5 h-5 hover:text-pink-500 cursor-pointer transition" />
              <Twitter className="w-5 h-5 hover:text-blue-400 cursor-pointer transition" />
            </div>
          </div>

          {/* Column 2: Popular Cities */}
          <div>
            <h3 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest">Hotels by City</h3>
            <ul className="space-y-3 text-sm">
              {locations.Cities.map((city) => (
                <li key={city} className="hover:text-blue-400 cursor-pointer transition">Hotels in {city}</li>
              ))}
            </ul>
          </div>

          {/* Column 3: Regions & States */}
          <div>
            <h3 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest">Explore Regions</h3>
            <ul className="space-y-3 text-sm">
              {locations.Regions.map((region) => (
                <li key={region} className="hover:text-blue-400 cursor-pointer transition">Best of {region}</li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Country */}
          <div>
            <h3 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest">Contact Us</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>Headquarters: Bengaluru, India</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-500" />
                <span>+91 1800-HOTEL-STAY</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-500" />
                <span>support@stayease.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: SEO/Legal */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
          <p className="text-xs text-gray-500">© 2026 StayEase India Private Limited. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-xs">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> India (Domestic)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
