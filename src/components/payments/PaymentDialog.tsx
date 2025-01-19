"use client";

import { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PaymentDialogProps {
  customer: {
    id: number;
    name: string;
    pendingAmount: number;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentDialog({ customer, onClose, onSuccess }: PaymentDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customer.id,
          amount: formData.get("amount"),
          date: formData.get("date"),
          note: formData.get("note"),
        }),
      });

      if (!response.ok) throw new Error("Failed to record payment");

      toast.success("Payment recorded successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Error recording payment");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Record Payment - <span className="text-blue-600">{customer.name}</span></DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="pendingAmount">Pending Amount</Label>
          <Input
            id="pendingAmount"
            value={`₹${customer.pendingAmount.toFixed(2)}`}
            disabled
          />
        </div>
        <div>
          <Label htmlFor="amount">Payment Amount</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            required
            max={customer.pendingAmount}
          />
        </div>
        <div>
          <Label htmlFor="date">Payment Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <Label htmlFor="note">Note (Optional)</Label>
          <Input
            id="note"
            name="note"
            placeholder="Add a note about this payment"
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="primary" type="submit" disabled={isLoading}>
            Record Payment
          </Button>
        </div>
      </form>
    </DialogContent>
  );
} 