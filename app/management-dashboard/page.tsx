"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { Search, Filter, Download, X } from "lucide-react";

interface BookingWithDetails {
  id: string;
  userName: string;
  hotelId: number;
  checkIn?: string;
  checkOut?: string;
  status: string;
  totalPrice: number;
  paymentStatus: boolean;
  room?: {
    title: string;
  };
  checkIn_checkout?: {
    checkInTime?: string;
    keyIssued: boolean;
  };
  roomAssignment?: {
    roomNumber: string;
    floorNumber?: number;
  };
  guestProfile?: {
    guestFirstName: string;
    guestLastName: string;
    guestEmail: string;
  };
}

export default function ManagementDashboard() {
  const { userId } = useAuth();
  const [hotels, setHotels] = useState<any[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<number | null>(null);
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState({ from: "", to: "" });
  const [priceRangeFilter, setPriceRangeFilter] = useState({ min: 0, max: 100000 });
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  useEffect(() => {
    fetchHotels();
  }, [userId]);

  useEffect(() => {
    if (selectedHotel) {
      fetchBookings();
    }
  }, [selectedHotel, filter]);

  useEffect(() => {
    applyFilters();
  }, [bookings, searchQuery, dateRangeFilter, priceRangeFilter, paymentFilter, sortBy]);

  const fetchHotels = async () => {
    try {
      const response = await fetch("/api/myhotels");
      if (response.ok) {
        const data = await response.json();
        setHotels(data);
        if (data.length > 0) {
          setSelectedHotel(data[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(`/api/hotel-bookings?hotelId=${selectedHotel}`);
      if (response.ok) {
        const data = await response.json();
        let filtered = data;

        if (filter === "active") {
          filtered = data.filter((b: any) => b.status === "confirmed" || b.status === "checked-in");
        } else if (filter === "pending") {
          filtered = data.filter((b: any) => b.status === "pending");
        } else if (filter === "completed") {
          filtered = data.filter((b: any) => b.status === "completed" || b.status === "checked-out");
        }

        setBookings(filtered);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.userName.toLowerCase().includes(query) ||
          b.guestProfile?.guestFirstName?.toLowerCase().includes(query) ||
          b.guestProfile?.guestLastName?.toLowerCase().includes(query) ||
          b.guestProfile?.guestEmail?.toLowerCase().includes(query) ||
          b.id.toLowerCase().includes(query)
      );
    }

    // Date range filter
    if (dateRangeFilter.from) {
      const fromDate = new Date(dateRangeFilter.from);
      filtered = filtered.filter((b) => new Date(b.checkIn || "") >= fromDate);
    }
    if (dateRangeFilter.to) {
      const toDate = new Date(dateRangeFilter.to);
      filtered = filtered.filter((b) => new Date(b.checkOut || "") <= toDate);
    }

    // Price range filter
    filtered = filtered.filter(
      (b) => b.totalPrice >= priceRangeFilter.min && b.totalPrice <= priceRangeFilter.max
    );

    // Payment filter
    if (paymentFilter === "paid") {
      filtered = filtered.filter((b) => b.paymentStatus);
    } else if (paymentFilter === "pending") {
      filtered = filtered.filter((b) => !b.paymentStatus);
    }

    // Sorting
    if (sortBy === "date") {
      filtered.sort((a, b) => new Date(b.checkIn || "").getTime() - new Date(a.checkIn || "").getTime());
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.totalPrice - a.totalPrice);
    } else if (sortBy === "price-low") {
      filtered.sort((a, b) => a.totalPrice - b.totalPrice);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.userName.localeCompare(b.userName));
    }

    setFilteredBookings(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "checked-in":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
      case "checked-out":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusIcon = (paid: boolean) => {
    return paid ? "✅ Paid" : "⏳ Pending";
  };

  const calculateStats = () => {
    return {
      total: filteredBookings.length,
      activeCheckIns: filteredBookings.filter((b) => b.checkIn_checkout?.checkInTime).length,
      pendingPayments: filteredBookings.filter((b) => !b.paymentStatus).length,
      roomsAssigned: filteredBookings.filter((b) => b.roomAssignment?.roomNumber).length,
      totalRevenue: filteredBookings.reduce((sum, b) => sum + b.totalPrice, 0),
    };
  };

  const stats = calculateStats();

  const handleResetFilters = () => {
    setSearchQuery("");
    setDateRangeFilter({ from: "", to: "" });
    setPriceRangeFilter({ min: 0, max: 100000 });
    setPaymentFilter("all");
    setSortBy("date");
  };

  const handleExportData = () => {
    const csvContent = [
      ["Guest Name", "Email", "Check-In", "Check-Out", "Room", "Total Price", "Status", "Payment Status"],
      ...filteredBookings.map((b) => [
        `${b.guestProfile?.guestFirstName || b.userName} ${b.guestProfile?.guestLastName || ""}`,
        b.guestProfile?.guestEmail || "N/A",
        b.checkIn ? format(new Date(b.checkIn), "MMM dd, yyyy") : "N/A",
        b.checkOut ? format(new Date(b.checkOut), "MMM dd, yyyy") : "N/A",
        b.roomAssignment?.roomNumber || b.room?.title || "N/A",
        b.totalPrice,
        b.status,
        b.paymentStatus ? "Paid" : "Pending",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <p>Loading management dashboard...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your hotels and bookings efficiently</p>
        </div>

        {/* Hotel Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Your Hotels</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {hotels.map((hotel) => (
              <Card
                key={hotel.id}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  selectedHotel === hotel.id
                    ? "ring-2 ring-blue-500 bg-blue-50 shadow-lg"
                    : "hover:bg-gray-50 hover:shadow-md"
                }`}
                onClick={() => setSelectedHotel(hotel.id)}
              >
                <h3 className="font-semibold text-gray-900">{hotel.title}</h3>
                <p className="text-sm text-gray-600 mt-2">
                  📍 {hotel.city}, {hotel.state}
                </p>
                {hotel.country && <p className="text-xs text-gray-500">{hotel.country}</p>}
              </Card>
            ))}
          </div>
        </div>

        {/* Statistics Cards */}
        {selectedHotel && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100">
              <p className="text-sm text-gray-600">Active Check-Ins</p>
              <p className="text-3xl font-bold text-green-900">{stats.activeCheckIns}</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100">
              <p className="text-sm text-gray-600">Pending Payments</p>
              <p className="text-3xl font-bold text-yellow-900">{stats.pendingPayments}</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100">
              <p className="text-sm text-gray-600">Rooms Assigned</p>
              <p className="text-3xl font-bold text-purple-900">{stats.roomsAssigned}</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-pink-50 to-pink-100">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-pink-900">${stats.totalRevenue}</p>
            </Card>
          </div>
        )}

        {/* Quick Filters */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {["all", "active", "pending", "completed"].map((f) => (
            <Button
              key={f}
              onClick={() => setFilter(f)}
              variant={filter === f ? "default" : "outline"}
              className="capitalize"
            >
              {f === "all" ? "All Bookings" : f}
            </Button>
          ))}
          <Button
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Filter size={18} />
            Advanced Search
          </Button>
          <Button
            onClick={handleExportData}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download size={18} />
            Export
          </Button>
        </div>

        {/* Advanced Search Section */}
        {showAdvancedSearch && (
          <Card className="p-6 mb-8 bg-white border-2 border-blue-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Advanced Search & Filters</h3>
              <button
                onClick={() => setShowAdvancedSearch(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Search by Name/Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search by Name or Email
                </label>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-In From
                </label>
                <input
                  type="date"
                  value={dateRangeFilter.from}
                  onChange={(e) => setDateRangeFilter({ ...dateRangeFilter, from: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-Out To
                </label>
                <input
                  type="date"
                  value={dateRangeFilter.to}
                  onChange={(e) => setDateRangeFilter({ ...dateRangeFilter, to: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price: ${priceRangeFilter.min}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={priceRangeFilter.min}
                  onChange={(e) =>
                    setPriceRangeFilter({ ...priceRangeFilter, min: Number(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price: ${priceRangeFilter.max}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={priceRangeFilter.max}
                  onChange={(e) =>
                    setPriceRangeFilter({ ...priceRangeFilter, max: Number(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              {/* Payment Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date">Latest First</option>
                  <option value="price-high">Highest Price</option>
                  <option value="price-low">Lowest Price</option>
                  <option value="name">Guest Name</option>
                </select>
              </div>
            </div>

            {/* Reset Button */}
            <Button
              onClick={handleResetFilters}
              variant="outline"
              className="mt-4 w-full"
            >
              Reset All Filters
            </Button>
          </Card>
        )}

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray-500">No bookings found for the selected filters.</p>
            </Card>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredBookings.length}</span> of{" "}
                <span className="font-semibold">{bookings.length}</span> bookings
              </div>
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {booking.guestProfile?.guestFirstName
                          ? `${booking.guestProfile.guestFirstName} ${booking.guestProfile.guestLastName}`
                          : booking.userName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        📧 {booking.guestProfile?.guestEmail || "N/A"} | 🆔 {booking.id.slice(0, 8)}...
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status.toUpperCase()}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100">
                        {getPaymentStatusIcon(booking.paymentStatus)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-600">Room</p>
                      <p className="font-semibold">
                        {booking.roomAssignment?.roomNumber || booking.room?.title || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Check-In</p>
                      <p className="font-semibold">
                        {booking.checkIn ? format(new Date(booking.checkIn), "MMM dd") : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Check-Out</p>
                      <p className="font-semibold">
                        {booking.checkOut ? format(new Date(booking.checkOut), "MMM dd") : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total</p>
                      <p className="font-semibold text-blue-600">${booking.totalPrice}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Key Status</p>
                      <p className="font-semibold">
                        {booking.checkIn_checkout?.keyIssued ? "✅ Issued" : "⏳ Pending"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Link href={`/reservation-management?bookingId=${booking.id}&hotelId=${booking.hotelId}`}>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Manage
                      </Button>
                    </Link>
                    <Link href={`/reservation-management?bookingId=${booking.id}&hotelId=${booking.hotelId}&tab=guest-profile`}>
                      <Button size="sm" variant="outline">
                        👤 Profile
                      </Button>
                    </Link>
                    <Link href={`/reservation-management?bookingId=${booking.id}&hotelId=${booking.hotelId}&tab=check-in-out`}>
                      <Button size="sm" variant="outline">
                        🔑 Check-In/Out
                      </Button>
                    </Link>
                    <Link href={`/reservation-management?bookingId=${booking.id}&hotelId=${booking.hotelId}&tab=room-assignment`}>
                      <Button size="sm" variant="outline">
                        🚪 Room
                      </Button>
                    </Link>
                    <Link href={`/reservation-management?bookingId=${booking.id}&hotelId=${booking.hotelId}&tab=billing`}>
                      <Button size="sm" variant="outline">
                        💳 Billing
                      </Button>
                    </Link>
                    <Link href={`/reservation-management?bookingId=${booking.id}&hotelId=${booking.hotelId}&tab=services`}>
                      <Button size="sm" variant="outline">
                        🔧 Services
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}