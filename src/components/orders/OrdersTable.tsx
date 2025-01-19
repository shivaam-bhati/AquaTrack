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
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/useOrders";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationBar } from "../customers/PaginationBar";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { OrderDialog } from "./CreateOrderButton";
import { Dialog } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Order {
  id: number;
  customerId: number;
  customerName: string;
  givenJars: number;
  returnedJars: number;
  date: string;
  netAmount: number;
}

export function OrdersTable() {
  const { orders, pagination, isLoading, error, mutate } = useOrders();
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/orders/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete order");

      toast.success("Order deleted successfully");
      mutate();
    } catch (error) {
      toast.error("Error deleting order");
      console.error("Error deleting order:", error);
    }
  }

  if (isLoading) return <TableSkeleton />;
  if (error) return <div>Error loading orders</div>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100 hover:bg-gray-100">
            <TableHead className="font-semibold text-gray-900 whitespace-nowrap">Date</TableHead>
            <TableHead className="font-semibold text-gray-900">Customer</TableHead>
            <TableHead className="font-semibold text-gray-900 text-center whitespace-nowrap">
              Given Jars
            </TableHead>
            <TableHead className="font-semibold text-gray-900 text-center whitespace-nowrap">
              Returned Jars
            </TableHead>
            <TableHead className="font-semibold text-gray-900 whitespace-nowrap">Net Amount</TableHead>
            <TableHead className="font-semibold text-gray-900 text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order: Order) => (
            <TableRow 
              key={order.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell className="whitespace-nowrap">
                {format(new Date(order.date), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell className="font-medium text-gray-900">
                {order.customerName}
              </TableCell>
              <TableCell className="text-center font-medium text-gray-900">
                {order.givenJars}
              </TableCell>
              <TableCell className="text-center font-medium text-gray-900">
                {order.returnedJars}
              </TableCell>
              <TableCell className="font-medium text-gray-900">
                ₹{order.netAmount}
              </TableCell>
              <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingOrder(order)}
                    className="h-8 w-8 p-0 hover:bg-blue-50"
                  >
                    <Pencil className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(order.id)}
                    className="h-8 w-8 p-0 hover:bg-red-50"
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

<Dialog open={!!editingOrder} onOpenChange={(open) => !open && setEditingOrder(null)}>
        <OrderDialog
          mode="edit"
          order={editingOrder || undefined}
          onClose={() => {
            setEditingOrder(null);
            mutate();
          }}
        />
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="w-[calc(100%-2rem)] max-w-lg mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold">
              Delete Order
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 mt-3">
              Are you sure you want to delete this order? This action cannot be undone.
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
              Delete Order
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