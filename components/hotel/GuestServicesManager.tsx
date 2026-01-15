"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ServiceRequest {
  id: string;
  serviceType: string;
  description: string;
  priority: string;
  status: string;
  assignedTo?: string;
  requestedAt: string;
  resolution?: string;
  booking?: {
    guestProfile?: {
      guestFirstName: string;
      guestLastName: string;
    };
  };
}

interface GuestServicesProps {
  bookingId: string;
  hotelId: number;
  guestName?: string;
  onSuccess?: () => void;
}

export default function GuestServicesManager({
  bookingId,
  hotelId,
  guestName,
  onSuccess,
}: GuestServicesProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    serviceType: "room-service",
    description: "",
    priority: "normal",
    assignedTo: "",
  });

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  const fetchServiceRequests = async () => {
    try {
      const response = await fetch(`/api/service-requests?hotelId=${hotelId}`);
      if (response.ok) {
        const data = await response.json();
        setServiceRequests(data);
      }
    } catch (error) {
      console.error("Error fetching service requests:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.serviceType || !formData.description) {
      setMessage("Service type and description are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          hotelId,
          serviceType: formData.serviceType,
          description: formData.description,
          priority: formData.priority,
          assignedTo: formData.assignedTo || null,
        }),
      });

      if (response.ok) {
        setMessage("Service request created successfully!");
        setFormData({
          serviceType: "room-service",
          description: "",
          priority: "normal",
          assignedTo: "",
        });
        setShowForm(false);
        fetchServiceRequests();
        setTimeout(() => setMessage(""), 2000);
      } else {
        setMessage("Error creating service request");
      }
    } catch (error) {
      setMessage("Error: " + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequest = async (id: string, status: string, resolution?: string) => {
    try {
      const response = await fetch("/api/service-requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status,
          resolution: resolution || null,
        }),
      });

      if (response.ok) {
        fetchServiceRequests();
        setMessage("Service request updated!");
        setTimeout(() => setMessage(""), 2000);
      }
    } catch (error) {
      setMessage("Error: " + (error as any).message);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "normal":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Guest Services & Maintenance Requests</h3>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "New Request"}
          </Button>
        </div>

        {guestName && (
          <div className="mb-4 p-3 bg-blue-50 rounded">
            <p><strong>Guest:</strong> {guestName}</p>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium mb-1">Service Type *</label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="room-service">Room Service</option>
                <option value="maintenance">Maintenance</option>
                <option value="housekeeping">Housekeeping</option>
                <option value="laundry">Laundry</option>
                <option value="front-desk">Front Desk</option>
                <option value="concierge">Concierge</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the service request..."
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assign To (Staff ID)</label>
                <Input
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  placeholder="Staff ID (optional)"
                />
              </div>
            </div>

            {message && (
              <div className={`p-3 rounded ${message.includes("Error") ? "bg-red-100" : "bg-green-100"}`}>
                {message}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating..." : "Create Service Request"}
            </Button>
          </form>
        )}
      </Card>

      {serviceRequests.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold">Active Requests</h4>
          {serviceRequests.map((request) => (
            <Card key={request.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h5 className="font-semibold capitalize">{request.serviceType.replace("-", " ")}</h5>
                  <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(request.priority)}`}>
                    {request.priority}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-500 mb-3">
                <p>Requested: {new Date(request.requestedAt).toLocaleString()}</p>
                {request.assignedTo && <p>Assigned to: {request.assignedTo}</p>}
              </div>

              {request.status !== "completed" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleUpdateRequest(request.id, "in-progress")}
                    className="bg-yellow-500 hover:bg-yellow-600"
                  >
                    Mark In Progress
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleUpdateRequest(request.id, "completed")}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Complete
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
