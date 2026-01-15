"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BillingProps {
  bookingId: string;
  hotelId: number;
  guestName?: string;
  onSuccess?: () => void;
}

export default function BillingManager({
  bookingId,
  hotelId,
  guestName,
  onSuccess,
}: BillingProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    roomCharges: "0",
    breakfastCharges: "0",
    serviceCharges: "0",
    taxAmount: "0",
    discountAmount: "0",
    paymentMethod: "cash",
    paidAmount: "0",
    status: "pending",
    notes: "",
  });

  const totalAmount =
    (parseInt(formData.roomCharges) || 0) +
    (parseInt(formData.breakfastCharges) || 0) +
    (parseInt(formData.serviceCharges) || 0) +
    (parseInt(formData.taxAmount) || 0) -
    (parseInt(formData.discountAmount) || 0);

  const balanceDue = totalAmount - (parseInt(formData.paidAmount) || 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.invoiceNumber) {
      setMessage("Invoice number is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          hotelId,
          invoiceNumber: formData.invoiceNumber,
          roomCharges: parseInt(formData.roomCharges) || 0,
          breakfastCharges: parseInt(formData.breakfastCharges) || 0,
          serviceCharges: parseInt(formData.serviceCharges) || 0,
          taxAmount: parseInt(formData.taxAmount) || 0,
          discountAmount: parseInt(formData.discountAmount) || 0,
          paymentMethod: formData.paymentMethod,
          paidAmount: parseInt(formData.paidAmount) || 0,
          status: formData.status,
          notes: formData.notes || null,
        }),
      });

      if (response.ok) {
        setMessage("Invoice created/updated successfully!");
        setTimeout(() => {
          setMessage("");
          onSuccess?.();
        }, 2000);
      } else {
        setMessage("Error creating invoice");
      }
    } catch (error) {
      setMessage("Error: " + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Billing & Invoice Management</h3>

      {guestName && (
        <div className="mb-4 p-3 bg-blue-50 rounded">
          <p><strong>Guest:</strong> {guestName}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Invoice Number *</label>
          <Input
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            placeholder="E.g., INV-2024-001"
            required
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <h4 className="font-semibold">Charges</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Room Charges ($)</label>
              <Input
                type="number"
                name="roomCharges"
                value={formData.roomCharges}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Breakfast Charges ($)</label>
              <Input
                type="number"
                name="breakfastCharges"
                value={formData.breakfastCharges}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Service Charges ($)</label>
              <Input
                type="number"
                name="serviceCharges"
                value={formData.serviceCharges}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tax Amount ($)</label>
              <Input
                type="number"
                name="taxAmount"
                value={formData.taxAmount}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Amount ($)</label>
              <Input
                type="number"
                name="discountAmount"
                value={formData.discountAmount}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-lg font-semibold">
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p>${totalAmount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Balance Due</p>
              <p>${balanceDue}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="cash">Cash</option>
              <option value="card">Credit/Debit Card</option>
              <option value="check">Check</option>
              <option value="bank-transfer">Bank Transfer</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Paid Amount ($)</label>
            <Input
              type="number"
              name="paidAmount"
              value={formData.paidAmount}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="pending">Pending</option>
            <option value="partial">Partial Payment</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <Textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional billing notes..."
            rows={3}
          />
        </div>

        {message && (
          <div className={`p-3 rounded ${message.includes("Error") ? "bg-red-100" : "bg-green-100"}`}>
            {message}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Processing..." : "Create/Update Invoice"}
        </Button>
      </form>
    </Card>
  );
}
