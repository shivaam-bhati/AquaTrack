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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { CustomerDialog } from "./CreateCustomerButton";

interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string | null;
  activeJars: number;
  pricePerJar: string;
}

export function CustomersTable() {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const { customers, pagination, isLoading, error, mutate } = useCustomers();

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/customers/${deleteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete customer');

      toast.success('Customer deleted successfully');
      mutate();
    } catch (error) {
      toast.error('Failed to delete customer');
      console.error(error);
    } finally {
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Failed to load customers</div>;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100 hover:bg-gray-100">
            <TableHead className="font-semibold text-gray-900 px-4">Name</TableHead>
            <TableHead className="font-semibold text-gray-900 px-4">Phone</TableHead>
            <TableHead className="font-semibold text-gray-900 px-4">Address</TableHead>
            <TableHead className="font-semibold text-gray-900 px-4">Price/Jar</TableHead>
            <TableHead className="font-semibold text-gray-900 px-4 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers?.map((customer: Customer) => (
            <TableRow key={customer.id} className="hover:bg-gray-50 transition-colors">
              <TableCell className="font-medium px-4 whitespace-nowrap">{customer.name}</TableCell>
              <TableCell className="px-4">{customer.phone}</TableCell>
              <TableCell className="text-gray-500 px-4 whitespace-nowrap">{customer.address}</TableCell>
              <TableCell className="px-4">₹{customer.pricePerJar}</TableCell>
              <TableCell className="px-4">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingCustomer(customer)}
                    className="h-8 w-8 p-0 hover:bg-blue-50"
                  >
                    <Pencil className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(customer.id)}
                    className="h-8 w-8 p-0 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {customers?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No customers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {pagination && pagination.pageCount > 0 && (
        <div className="py-4 border-t">
          <PaginationBar totalPages={pagination.pageCount} />
        </div>
      )}

      <Dialog open={!!editingCustomer} onOpenChange={(open) => !open && setEditingCustomer(null)}>
        <CustomerDialog
          mode="edit"
          customer={editingCustomer || undefined}
          onClose={() => {
            setEditingCustomer(null);
            mutate();
          }}
        />
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="w-[calc(100%-2rem)] max-w-lg mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold">
              Delete Customer
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 mt-3">
              Are you sure you want to delete this customer? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="w-full sm:w-auto">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Customer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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