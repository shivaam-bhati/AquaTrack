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
import { useOrders } from "@/hooks/useOrders";
import { Plus } from "lucide-react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useCustomers } from "@/hooks/useCustomers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderFormProps {
  mode: 'create' | 'edit';
  order?: {
    id: number;
    customerId: number;
    givenJars: number;
    returnedJars: number;
    date: string;
  };
  onClose: () => void;
  onSuccess?: () => void;
}

const orderSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  givenJars: z.string().min(1, "Given jars is required"),
  returnedJars: z.string().min(1, "Returned jars is required"),
  date: z.string().min(1, "Date is required"),
});

export function OrderDialog({ mode, order, onClose, onSuccess }: OrderFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { customers } = useCustomers();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      customerId: formData.get("customerId") as string,
      givenJars: formData.get("givenJars") as string,
      returnedJars: formData.get("returnedJars") as string,
      date: formData.get("date") as string,
    };

    const result = orderSchema.safeParse(data);
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
        mode === 'create' ? "/api/orders" : `/api/orders/${order?.id}`,
        {
          method: mode === 'create' ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error(`Failed to ${mode} order`);

      toast.success(`Order ${mode === 'create' ? 'created' : 'updated'} successfully`);
      onClose();
      onSuccess?.();
    } catch (error) {
      toast.error(`Error ${mode}ing order`);
      console.error(`Error ${mode}ing order:`, error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px] p-6">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">
          {mode === 'create' ? 'Create New Order' : 'Edit Order'}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="customerId">Customer</Label>
          <Select name="customerId" defaultValue={order?.customerId?.toString()}>
            <SelectTrigger className={cn(errors.customerId && "border-red-500")}>
              <SelectValue placeholder="Select a customer" />
            </SelectTrigger>
            <SelectContent>
              {customers?.map((customer: Customer) => (
                <SelectItem key={customer.id} value={customer.id.toString()}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.customerId && (
            <p className="text-sm text-red-500 mt-1">{errors.customerId}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="givenJars">Given Jars</Label>
            <Input
              id="givenJars"
              name="givenJars"
              type="number"
              min="0"
              defaultValue={order?.givenJars}
              className={cn(errors.givenJars && "border-red-500")}
            />
            {errors.givenJars && (
              <p className="text-sm text-red-500 mt-1">{errors.givenJars}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="returnedJars">Returned Jars</Label>
            <Input
              id="returnedJars"
              name="returnedJars"
              type="number"
              min="0"
              defaultValue={order?.returnedJars}
              className={cn(errors.returnedJars && "border-red-500")}
            />
            {errors.returnedJars && (
              <p className="text-sm text-red-500 mt-1">{errors.returnedJars}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            defaultValue={order?.date}
            className={cn(errors.date && "border-red-500")}
          />
          {errors.date && (
            <p className="text-sm text-red-500 mt-1">{errors.date}</p>
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
            : mode === 'create' ? "Create Order" : "Update Order"}
        </Button>
      </form>
    </DialogContent>
  );
}

interface CreateOrderButtonProps {
  mode?: 'default' | 'mobile';
}

export function CreateOrderButton({ mode = 'default' }: CreateOrderButtonProps) {
  const [open, setOpen] = useState(false);
  const { mutate } = useOrders();

  if (mode === 'mobile') {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <OrderDialog
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
          New Order
        </Button>
      </DialogTrigger>
      <OrderDialog
        mode="create"
        onClose={() => setOpen(false)}
        onSuccess={() => mutate()}
      />
    </Dialog>
  );
}

// Add interface for Customer
interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string | null;
  pricePerJar: string;
} 