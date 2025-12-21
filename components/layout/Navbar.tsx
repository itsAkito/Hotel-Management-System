
"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sun, Moon, Menu, X, Hotel, LogOut } from 'lucide-react';
import Image from 'next/image';
import SearchInput from '../SearchInput'
import { NavMenu } from './Navmenu';
import { useAuth, SignOutButton } from '@clerk/nextjs';

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full shadow-md bg-linear-to-r from-blue-600 to-blue-700 dark:from-slate-900 dark:to-slate-800 border-b border-blue-400 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <div className="shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-lg group-hover:shadow-lg transition-shadow">
                <Hotel className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xl font-bold text-white hidden sm:inline">HotelHub</span>
            </Link>
          </div>

          {/* Center Search - Hidden on mobile */}
          <div className="hidden lg:flex flex-1 mx-8">
            <SearchInput/>
          </div>

          {/* Right Side: Auth & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-2">
            
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-blue-700 dark:hover:bg-slate-700 transition-colors focus:outline-none text-white"
              aria-label="Toggle Dark Mode"
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-white" />
              )}
            </button>

            {/* Book a Stay Button - Only for signed in users */}
            {isSignedIn && (
              <Link href="/book-stay">
                <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-md">
                  📅 Book a Stay
                </button>
              </Link>
            )}

            {/* Nav Menu - Only show if signed in */}
            {isSignedIn && (
              <div className="border-l border-blue-400 dark:border-slate-700 pl-2">
                <NavMenu/>
              </div>
            )}

            {/* Auth Buttons */}
            {!isSignedIn ? (
              <>
                <Link href="/sign-in">
                  <button className="px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link href="/sign-up">
                  <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-md">
                    Sign Up
                  </button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2 border-l border-blue-400 dark:border-slate-700 pl-2">
                <span className="text-white text-sm px-3 py-2 bg-blue-500/30 dark:bg-slate-700/50 rounded-lg">
                  Welcome!
                </span>
                <SignOutButton>
                  <button className="p-2 rounded-lg hover:bg-red-500/30 dark:hover:bg-red-900/30 transition-colors text-red-200 hover:text-red-100 cursor-pointer">
                    <LogOut className="h-5 w-5" />
                  </button>
                </SignOutButton>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-blue-700 dark:hover:bg-slate-700 transition-colors text-white"
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-white" />}
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:bg-blue-700 dark:hover:bg-slate-700 p-2 rounded-lg transition-colors focus:outline-none"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-3">
          <SearchInput/>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-t border-blue-400 dark:border-slate-700 shadow-lg">
          <div className="px-4 py-4 space-y-3 max-h-96 overflow-y-auto">
            
            {/* Quick Links */}
            <div className="space-y-2 border-b border-gray-200 dark:border-slate-800 pb-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quick Links</p>
              {isSignedIn && (
                <>
                  <Link href="/book-stay" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full text-left px-3 py-2 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors flex items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                      <span className="text-lg">📅</span> Book a Stay
                    </button>
                  </Link>
                  <Link href="/hotel/new" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full text-left px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
                      <span className="text-lg">➕</span> Add Hotel
                    </button>
                  </Link>
                  <Link href="/my-hotels" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full text-left px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
                      <span className="text-lg">🏨</span> My Hotels
                    </button>
                  </Link>
                  <Link href="/my-bookings" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full text-left px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
                      <span className="text-lg">📋</span> My Bookings
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Auth Buttons for Mobile */}
            {!isSignedIn && (
              <div className="flex flex-col space-y-2">
                <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full px-4 py-2 border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-md">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}

            {/* Sign Out for Mobile */}
            {isSignedIn && (
              <div className="pt-4 border-t border-gray-200 dark:border-slate-800">
                <SignOutButton>
                  <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;