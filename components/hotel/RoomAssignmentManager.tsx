"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface RoomAssignmentProps {
  bookingId: string;
  guestName?: string;
  onSuccess?: () => void;
}

export default function RoomAssignmentManager({
  bookingId,
  guestName,
  onSuccess,
}: RoomAssignmentProps) {
  const [roomNumber, setRoomNumber] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [assignedBy, setAssignedBy] = useState("");
  const [maintenanceNeeded, setMaintenanceNeeded] = useState(false);
  const [maintenanceNotes, setMaintenanceNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomNumber || !assignedBy) {
      setMessage("Room number and staff assignment are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/room-assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          roomNumber,
          floorNumber: floorNumber ? parseInt(floorNumber) : null,
          assignedBy,
          maintenanceNeeded,
          maintenanceNotes: maintenanceNotes || null,
        }),
      });

      if (response.ok) {
        setMessage("Room assigned successfully!");
        setRoomNumber("");
        setFloorNumber("");
        setAssignedBy("");
        setMaintenanceNeeded(false);
        setMaintenanceNotes("");
        setTimeout(() => {
          setMessage("");
          onSuccess?.();
        }, 2000);
      } else {
        setMessage("Error assigning room");
      }
    } catch (error) {
      setMessage("Error: " + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Room Assignment</h3>
      
      {guestName && (
        <div className="mb-4 p-3 bg-blue-50 rounded">
          <p><strong>Guest:</strong> {guestName}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Room Number *</label>
            <Input
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder="E.g., 101, 205"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Floor Number</label>
            <Input
              type="number"
              value={floorNumber}
              onChange={(e) => setFloorNumber(e.target.value)}
              placeholder="E.g., 1, 2, 3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Assigned By (Staff ID) *</label>
          <Input
            value={assignedBy}
            onChange={(e) => setAssignedBy(e.target.value)}
            placeholder="Staff member ID"
            required
          />
        </div>

        <label className="flex items-center gap-2">
          <Checkbox
            checked={maintenanceNeeded}
            onCheckedChange={(checked) => setMaintenanceNeeded(!!checked)}
          />
          <span>Room needs maintenance</span>
        </label>

        {maintenanceNeeded && (
          <div>
            <label className="block text-sm font-medium mb-1">Maintenance Notes</label>
            <Textarea
              value={maintenanceNotes}
              onChange={(e) => setMaintenanceNotes(e.target.value)}
              placeholder="Describe the maintenance needed..."
              rows={3}
            />
          </div>
        )}

        {message && (
          <div className={`p-3 rounded ${message.includes("Error") ? "bg-red-100" : "bg-green-100"}`}>
            {message}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Assigning..." : "Assign Room"}
        </Button>
      </form>
    </Card>
  );
}
