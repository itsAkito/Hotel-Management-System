"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, SignOutButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

interface UserRole {
  role: 'user' | 'admin' | null;
  loading: boolean;
}

const Navbar = () => {
  const { isSignedIn, userId } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>({ role: null, loading: true });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isSignedIn && userId) {
      fetchUserRole();
    } else {
      setUserRole({ role: null, loading: false });
    }
  }, [isSignedIn, userId]);

  const fetchUserRole = async () => {
    try {
      const response = await fetch(`/api/user-role?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserRole({ role: data.role as 'user' | 'admin', loading: false });
      } else {
        setUserRole({ role: null, loading: false });
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole({ role: null, loading: false });
    }
  };

  if (!mounted) {
    return null;
  }

  const isAdmin = userRole.role === 'admin';

  return (
    <nav className="flex items-center justify-between px-10 py-5 bg-white border-b shadow-sm sticky top-0 z-50">
      {/* Logo/Brand */}
      <Link href="/">
        <h1 className="text-2xl font-bold text-blue-900 cursor-pointer hover:text-blue-700 transition-colors">
          StayEase
        </h1>
      </Link>

      {/* Navigation Links - Hidden on mobile */}
      <div className="space-x-8 font-medium text-gray-600 hidden md:flex">
        <Link href="/" className={`relative px-1 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${pathname === '/' ? 'text-blue-700' : 'text-gray-600'} after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-blue-600 after:w-0 hover:after:w-full after:transition-all after:duration-300`}>
          Home
        </Link>
        {!isAdmin && (
          <Link href="/search" className={`relative px-1 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${pathname?.startsWith('/search') ? 'text-blue-700' : 'text-gray-600'} after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-blue-600 after:w-0 hover:after:w-full after:transition-all after:duration-300`}>
            Destinations
          </Link>
        )}
        {!isAdmin && isSignedIn && (
          <Link href="/my-bookings" className={`relative px-1 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${pathname?.startsWith('/my-bookings') ? 'text-blue-700' : 'text-gray-600'} after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-blue-600 after:w-0 hover:after:w-full after:transition-all after:duration-300`}>
            My Bookings
          </Link>
        )}
      </div>

      {/* Right Side: Auth & Action Buttons */}
      <div className="flex items-center space-x-4">
        {!isSignedIn ? (
          <>
            <Link href="/login">
              <button className="px-4 py-2 text-gray-600 font-medium hover:text-blue-600 transition-colors">
                Sign In
              </button>
            </Link>
            <Link href="/login">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md">
                Sign Up
              </button>
            </Link>
          </>
        ) : (
          <>
            {!isAdmin && (
              <Link href="/book-stay">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md">
                  Book Now
                </button>
              </Link>
            )}
            {isAdmin && (
              <Link href="/my-hotels">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-md">
                  My Hotels
                </button>
              </Link>
            )}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <span>Dashboard</span>
                <ChevronDown size={18} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link href={isAdmin ? '/management-dashboard' : '/my-bookings'}>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">
                      {isAdmin ? 'Bookings' : 'My Bookings'}
                    </button>
                  </Link>
                  {isAdmin && (
                    <>
                      <Link href="/hotel-analytics">
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">
                          Analytics
                        </button>
                      </Link>
                      <Link href="/reservation-management">
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">
                          Reservations
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
            <SignOutButton redirectUrl="/">
              <button className="px-4 py-2 text-gray-600 font-medium hover:text-red-600 transition-colors">
                Sign Out
              </button>
            </SignOutButton>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
