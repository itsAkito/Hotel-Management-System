"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface GuestProfileProps {
  bookingId: string;
  onSuccess?: () => void;
}

export default function GuestProfileManager({ bookingId, onSuccess }: GuestProfileProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    guestFirstName: "",
    guestLastName: "",
    guestEmail: "",
    guestPhone: "",
    guestAddress: "",
    guestCity: "",
    guestState: "",
    guestZip: "",
    guestCountry: "",
    numberOfGuests: "1",
    specialRequests: "",
    idType: "",
    idNumber: "",
  });

  useEffect(() => {
    // Fetch existing guest profile if available
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/guest-profile?bookingId=${bookingId}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            guestFirstName: data.guestFirstName || "",
            guestLastName: data.guestLastName || "",
            guestEmail: data.guestEmail || "",
            guestPhone: data.guestPhone || "",
            guestAddress: data.guestAddress || "",
            guestCity: data.guestCity || "",
            guestState: data.guestState || "",
            guestZip: data.guestZip || "",
            guestCountry: data.guestCountry || "",
            numberOfGuests: data.numberOfGuests?.toString() || "1",
            specialRequests: data.specialRequests || "",
            idType: data.idType || "",
            idNumber: data.idNumber || "",
          });
        }
      } catch (error) {
        console.error("Error fetching guest profile:", error);
      }
    };

    fetchProfile();
  }, [bookingId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/guest-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          ...formData,
          numberOfGuests: parseInt(formData.numberOfGuests),
        }),
      });

      if (response.ok) {
        setMessage("Guest profile updated successfully!");
        setTimeout(() => {
          setMessage("");
          onSuccess?.();
        }, 2000);
      } else {
        setMessage("Error updating guest profile");
      }
    } catch (error) {
      setMessage("Error: " + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Guest Profile Information</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name *</label>
            <Input
              name="guestFirstName"
              value={formData.guestFirstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name *</label>
            <Input
              name="guestLastName"
              value={formData.guestLastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              name="guestEmail"
              type="email"
              value={formData.guestEmail}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input
              name="guestPhone"
              value={formData.guestPhone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <Input
            name="guestAddress"
            value={formData.guestAddress}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <Input
              name="guestCity"
              value={formData.guestCity}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <Input
              name="guestState"
              value={formData.guestState}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Zip Code</label>
            <Input
              name="guestZip"
              value={formData.guestZip}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <Input
              name="guestCountry"
              value={formData.guestCountry}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Number of Guests</label>
            <Input
              name="numberOfGuests"
              type="number"
              value={formData.numberOfGuests}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ID Type (Passport, License, etc.)</label>
            <Input
              name="idType"
              value={formData.idType}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">ID Number</label>
          <Input
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Special Requests</label>
          <textarea
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            placeholder="Any special requests or requirements..."
            rows={3}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {message && (
          <div className={`p-3 rounded ${message.includes("Error") ? "bg-red-100" : "bg-green-100"}`}>
            {message}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Guest Profile"}
        </Button>
      </form>
    </Card>
  );
}
