"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { useCustomers } from "@/hooks/useCustomers";
import { Plus } from "lucide-react";
import { z } from "zod";
import { cn } from "@/lib/utils";

interface CustomerFormProps {
  mode: 'create' | 'edit';
  customer?: {
    id: number;
    name: string;
    phone: string;
    address: string | null;
    pricePerJar: string;
  };
  onClose: () => void;
  onSuccess?: () => void;
}

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/, 'Invalid Indian phone number format'),
  address: z.string().optional(),
  pricePerJar: z.string()
    .min(1, "Price per jar is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
});

export function CustomerDialog({ mode, customer, onClose, onSuccess }: CustomerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      pricePerJar: formData.get("pricePerJar") as string,
    };

    // Validate form data
    const result = customerSchema.safeParse(data);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        formattedErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        mode === 'create' ? "/api/customers" : `/api/customers/${customer?.id}`,
        {
          method: mode === 'create' ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error(`Failed to ${mode} customer`);

      toast.success(`Customer ${mode === 'create' ? 'created' : 'updated'} successfully`);
      onClose();
      onSuccess?.();
    } catch (error) {
      toast.error(`Error ${mode}ing customer`);
      console.error(`Error ${mode}ing customer:`, error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px] p-6">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">
          {mode === 'create' ? 'Add New Customer' : 'Edit Customer'}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="name">Customer Name</Label>
          <Input 
            id="name" 
            name="name" 
            defaultValue={customer?.name} 
            className={cn("w-full", errors.name && "border-red-500")}
            required 
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone" 
            name="phone" 
            type="tel" 
            defaultValue={customer?.phone}
            className={cn("w-full", errors.phone && "border-red-500")}
            required 
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input 
            id="address" 
            name="address"
            defaultValue={customer?.address || ''} 
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pricePerJar">Price Per Jar</Label>
          <Input 
            id="pricePerJar" 
            name="pricePerJar" 
            type="number"
            step="0.01"
            defaultValue={customer?.pricePerJar}
            className={cn("w-full", errors.pricePerJar && "border-red-500")}
            required 
          />
          {errors.pricePerJar && (
            <p className="text-sm text-red-500 mt-1">{errors.pricePerJar}</p>
          )}
        </div>
        <Button 
          type="submit" 
          className="w-full mt-6" 
          variant="primary"
          size="lg"
          disabled={isLoading}
        >
          {isLoading 
            ? mode === 'create' ? "Creating..." : "Updating..." 
            : mode === 'create' ? "Create Customer" : "Update Customer"}
        </Button>
      </form>
    </DialogContent>
  );
}

interface CreateCustomerButtonProps {
  mode?: 'default' | 'mobile';
}

export function CreateCustomerButton({ mode = 'default' }: CreateCustomerButtonProps) {
  const [open, setOpen] = useState(false);
  const { mutate } = useCustomers();

  if (mode === 'mobile') {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            size="sm"
            className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <CustomerDialog 
          mode="create" 
          onClose={() => setOpen(false)}
          onSuccess={() => mutate()}
        />
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          size="lg"
          className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Customer
        </Button>
      </DialogTrigger>
      <CustomerDialog 
        mode="create" 
        onClose={() => setOpen(false)}
        onSuccess={() => mutate()}
      />
    </Dialog>
  );
}
