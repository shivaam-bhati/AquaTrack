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
import { useOrders } from "@/hooks/useOrders";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationBar } from "../customers/PaginationBar";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { OrderDialog } from "./CreateOrderButton";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  async function handleDelete(orderId: number) {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete order");

      toast.success("Order deleted successfully");
      mutate(); // Refresh the orders list
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
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-blue-50 transition-colors"
                        onClick={() => setEditingOrder(order)}
                      >
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Button>
                    </DialogTrigger>
                    {editingOrder && (
                      <OrderDialog
                        mode="edit"
                        order={editingOrder}
                        onClose={() => {
                          setIsDialogOpen(false);
                          setEditingOrder(null);
                        }}
                        onSuccess={() => {
                          mutate();
                          setIsDialogOpen(false);
                          setEditingOrder(null);
                        }}
                      />
                    )}
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-50 transition-colors"
                    onClick={() => handleDelete(order.id)}
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