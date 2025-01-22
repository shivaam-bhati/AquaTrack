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
import { Pencil, Trash2, Package, CheckCircle, IndianRupee } from "lucide-react";
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
  };

  if (isLoading) return <TableSkeleton />;
  if (error) return <div>Error loading orders</div>;

  return (
    <div className="rounded-md border">
      {/* Desktop Table */}
      <div className="hidden md:block">
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
              <TableHead className="font-semibold text-gray-900 text-right w-[100px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order: Order) => (
              <TableRow key={order.id} className="hover:bg-gray-50 transition-colors">
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
            {orders?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Stacked Layout */}
      <div className="md:hidden space-y-4 p-4">
        {orders?.map((order: Order) => (
          <div
            key={order.id}
            className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900 text-lg">{order.customerName}</p>
                <p className="text-sm text-gray-500">{format(new Date(order.date), 'dd/MM/yyyy')}</p>
              </div>
              <div className="flex gap-2">
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
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-full">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-sm text-gray-700">
                  Given Jars: <span className="font-medium text-gray-900">{order.givenJars}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-sm text-gray-700">
                  Returned Jars: <span className="font-medium text-gray-900">{order.returnedJars}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-full">
                  <IndianRupee className="h-4 w-4 text-purple-600" />
                </div>
                <p className="text-sm text-gray-700">
                  Net Amount: <span className="font-medium text-purple-700">₹{order.netAmount}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
        {orders?.length === 0 && (
          <div className="text-center py-8 text-gray-500">No orders found</div>
        )}
      </div>

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