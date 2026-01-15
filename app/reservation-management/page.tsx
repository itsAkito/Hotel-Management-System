"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CheckInCheckOutManager from "@/components/hotel/CheckInCheckOutManager";
import RoomAssignmentManager from "@/components/hotel/RoomAssignmentManager";
import GuestProfileManager from "@/components/hotel/GuestProfileManager";
import BillingManager from "@/components/hotel/BillingManager";
import GuestServicesManager from "@/components/hotel/GuestServicesManager";

export default function ReservationManagementPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const hotelId = searchParams.get("hotelId");
  const [activeTab, setActiveTab] = useState("guest-profile");
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`);
      if (response.ok) {
        const data = await response.json();
        setBooking(data);
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!bookingId || !hotelId) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <p>Please provide both bookingId and hotelId parameters.</p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <p>Loading booking details...</p>
        </Card>
      </div>
    );
  }

  const guestName = booking?.userName || "Guest";

  const tabs = [
    { id: "guest-profile", label: "Guest Profile", icon: "👤" },
    { id: "check-in-out", label: "Check-In/Out", icon: "🔑" },
    { id: "room-assignment", label: "Room Assignment", icon: "🚪" },
    { id: "billing", label: "Billing", icon: "💳" },
    { id: "services", label: "Services & Maintenance", icon: "🔧" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Reservation Management</h1>
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4">
              <p className="text-sm text-gray-600">Guest Name</p>
              <p className="text-lg font-semibold">{guestName}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">Booking ID</p>
              <p className="text-lg font-semibold">{bookingId.slice(0, 8)}...</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-semibold">{booking?.status || "Pending"}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">Check-In</p>
              <p className="text-lg font-semibold">
                {booking?.checkIn ? new Date(booking.checkIn).toLocaleDateString() : "N/A"}
              </p>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? "default" : "outline"}
                className="whitespace-nowrap"
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === "guest-profile" && (
            <GuestProfileManager bookingId={bookingId} onSuccess={fetchBookingDetails} />
          )}

          {activeTab === "check-in-out" && (
            <CheckInCheckOutManager
              bookingId={bookingId}
              guestName={guestName}
              roomNumber={booking?.room?.title}
              onSuccess={fetchBookingDetails}
            />
          )}

          {activeTab === "room-assignment" && (
            <RoomAssignmentManager
              bookingId={bookingId}
              guestName={guestName}
              onSuccess={fetchBookingDetails}
            />
          )}

          {activeTab === "billing" && (
            <BillingManager
              bookingId={bookingId}
              hotelId={parseInt(hotelId)}
              guestName={guestName}
              onSuccess={fetchBookingDetails}
            />
          )}

          {activeTab === "services" && (
            <GuestServicesManager
              bookingId={bookingId}
              hotelId={parseInt(hotelId)}
              guestName={guestName}
              onSuccess={fetchBookingDetails}
            />
          )}
        </div>
      </div>
    </div>
  );
}
