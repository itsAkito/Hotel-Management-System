"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, ShieldAdmin } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const handleUserLogin = () => {
    router.push('/sign-in?role=user');
  };

  const handleAdminLogin = () => {
    router.push('/sign-in?role=admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">StayEase</h1>
          </Link>
          <p className="text-gray-600">Choose how you want to login</p>
        </div>

        <div className="space-y-4">
          {/* User Login Button */}
          <button
            onClick={handleUserLogin}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <User size={24} />
            <span>Login as Guest</span>
          </button>

          {/* Admin Login Button */}
          <button
            onClick={handleAdminLogin}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <ShieldAdmin size={24} />
            <span>Login as Admin</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-600 mb-4">New user?</p>
          <div className="space-y-3">
            <Link href="/sign-up?role=user" className="block">
              <button className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors duration-200">
                Sign Up as Guest
              </button>
            </Link>
            <Link href="/sign-up?role=admin" className="block">
              <button className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors duration-200">
                Sign Up as Admin
              </button>
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Back to Home
          </Link>
        </p>
      </Card>
    </div>
  );
}
