"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

interface CheckInCheckOutProps {
  bookingId: string;
  guestName?: string;
  roomNumber?: string;
  onSuccess?: () => void;
}

export default function CheckInCheckOutManager({
  bookingId,
  guestName,
  roomNumber,
  onSuccess,
}: CheckInCheckOutProps) {
  const [checkInTime, setCheckInTime] = useState<string>("");
  const [checkOutTime, setCheckOutTime] = useState<string>("");
  const [checkInBy, setCheckInBy] = useState<string>("");
  const [checkOutBy, setCheckOutBy] = useState<string>("");
  const [keyIssued, setKeyIssued] = useState(false);
  const [keyReturned, setKeyReturned] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/check-in-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          checkInTime: checkInTime ? new Date(checkInTime) : null,
          checkOutTime: checkOutTime ? new Date(checkOutTime) : null,
          checkInBy: checkInBy || null,
          checkOutBy: checkOutBy || null,
          keyIssued,
          keyReturned,
          notes: notes || null,
        }),
      });

      if (response.ok) {
        setMessage("Check-in/Check-out updated successfully!");
        setTimeout(() => {
          setMessage("");
          onSuccess?.();
        }, 2000);
      } else {
        setMessage("Error updating check-in/check-out");
      }
    } catch (error) {
      setMessage("Error: " + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Check-In / Check-Out Management</h3>
      
      <div className="mb-4 p-3 bg-blue-50 rounded">
        {guestName && <p><strong>Guest:</strong> {guestName}</p>}
        {roomNumber && <p><strong>Room:</strong> {roomNumber}</p>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Check-In Time</label>
            <input
              type="datetime-local"
              value={checkInTime}
              onChange={(e) => setCheckInTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Check-Out Time</label>
            <input
              type="datetime-local"
              value={checkOutTime}
              onChange={(e) => setCheckOutTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Checked In By (Staff ID)</label>
            <Input
              value={checkInBy}
              onChange={(e) => setCheckInBy(e.target.value)}
              placeholder="Staff ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Checked Out By (Staff ID)</label>
            <Input
              value={checkOutBy}
              onChange={(e) => setCheckOutBy(e.target.value)}
              placeholder="Staff ID"
            />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <Checkbox checked={keyIssued} onCheckedChange={(checked) => setKeyIssued(!!checked)} />
            <span>Key Issued</span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox checked={keyReturned} onCheckedChange={(checked) => setKeyReturned(!!checked)} />
            <span>Key Returned</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes..."
            rows={4}
          />
        </div>

        {message && (
          <div className={`p-3 rounded ${message.includes("Error") ? "bg-red-100" : "bg-green-100"}`}>
            {message}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Updating..." : "Update Check-In/Check-Out"}
        </Button>
      </form>
    </Card>
  );
}
