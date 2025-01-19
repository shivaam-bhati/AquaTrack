"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useCustomers } from "@/hooks/useCustomers";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationBar } from "./PaginationBar";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CustomerDialog } from "./CreateCustomerButton";
import { toast } from "sonner";

interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string | null;
  pricePerJar: string;
}

export function CustomersTable() {
  const { customers, pagination, isLoading, error, mutate } = useCustomers();
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  async function handleDelete(customerId: number) {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete customer");

      toast.success("Customer deleted successfully");
      mutate();
    } catch (error) {
      toast.error("Error deleting customer");
      console.error("Error deleting customer:", error);
    }
  }

  if (isLoading) return <TableSkeleton />;
  if (error) return <div>Error loading customers</div>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100 hover:bg-gray-100">
            <TableHead className="font-semibold text-gray-900">Customer</TableHead>
            <TableHead className="font-semibold text-gray-900 whitespace-nowrap">Phone</TableHead>
            <TableHead className="font-semibold text-gray-900">Address</TableHead>
            <TableHead className="font-semibold text-gray-900 whitespace-nowrap text-right">
              Price/Jar
            </TableHead>
            <TableHead className="font-semibold text-gray-900 text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers?.map((customer: Customer) => (
            <TableRow 
              key={customer.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell className="font-medium text-gray-900">
                {customer.name}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {customer.phone}
              </TableCell>
              <TableCell className="text-gray-600">
                {customer.address || "-"}
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900 whitespace-nowrap">
                ₹{customer.pricePerJar}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-blue-50 transition-colors"
                        onClick={() => setEditingCustomer(customer)}
                      >
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Button>
                    </DialogTrigger>
                    {editingCustomer && (
                      <CustomerDialog
                        mode="edit"
                        customer={editingCustomer}
                        onClose={() => {
                          setIsDialogOpen(false);
                          setEditingCustomer(null);
                        }}
                        onSuccess={() => {
                          mutate();
                          setIsDialogOpen(false);
                          setEditingCustomer(null);
                        }}
                      />
                    )}
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-50 transition-colors"
                    onClick={() => handleDelete(customer.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination && pagination.pageCount > 0 && (
        <div className="py-4 px-6 border-t bg-white">
          <PaginationBar totalPages={pagination.pageCount} />
        </div>
      )}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
} 