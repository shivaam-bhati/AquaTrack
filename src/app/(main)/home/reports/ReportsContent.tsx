"use client";

import { useState, useEffect } from "react";
import { useCustomers } from "@/hooks/useCustomers";
import { useOrders } from "@/hooks/useOrders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PaymentDialog } from "@/components/payments/PaymentDialog";
import { Button } from "@/components/ui/button";
import { ChevronRight, Home, Receipt } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Customer {
  id: number;
  name: string;
  pricePerJar: string;
}

interface Order {
  id: number;
  customerId: number;
  givenJars: number;
  returnedJars: number;
  date: string;
}

interface CustomerSummary {
  id: number;
  name: string;
  totalAmount: number;
  pendingJars: number;
}

export function ReportsContent() {
  const { customers} = useCustomers();
  const { orders, mutate } = useOrders();
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [customerSummaries, setCustomerSummaries] = useState<CustomerSummary[]>([]);

  useEffect(() => {
    setCurrentMonth(format(new Date(), 'MMMM yyyy'));
  }, []);

  useEffect(() => {
    if (customers && orders) {
      const newCustomerSummaries = customers.map((customer: Customer) => {
        const customerOrders = orders.filter(
          (order: Order) =>
            order.customerId === customer.id &&
            new Date(order.date).getMonth() === new Date().getMonth()
        );

        const totalAmount =
          customerOrders.reduce(
            (sum: number, order: Order) =>
              sum + order.givenJars * parseFloat(customer.pricePerJar),
            0
          ) || 0;

        const pendingJars =
          customerOrders.reduce(
            (sum: number, order: Order) => sum + (order.givenJars - order.returnedJars),
            0
          ) || 0;

        return {
          id: customer.id,
          name: customer.name,
          totalAmount,
          pendingJars,
        };
      });

      setCustomerSummaries(newCustomerSummaries);
    }
  }, [customers, orders]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link
              href="/home"
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
            <span className="text-blue-600 font-medium">Reports</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-blue-600">Monthly Reports</h1>
          <p className="text-gray-500 mt-1">{currentMonth}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Collections Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ₹{customerSummaries?.reduce(
                  (sum: number, customer: CustomerSummary) => sum + customer.totalAmount,
                  0
                ).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Jars Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {customerSummaries?.reduce(
                  (sum: number, customer: CustomerSummary) => sum + customer.pendingJars,
                  0
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Active Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {customerSummaries?.filter(
                  (c: CustomerSummary) => c.totalAmount > 0
                ).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer-wise Report */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Customer-wise Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 hover:bg-gray-100">
                    <TableHead className="font-semibold text-gray-900 whitespace-nowrap">Customer</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-center whitespace-nowrap">
                      Pending Amount
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 text-center whitespace-nowrap">
                      Pending Jars
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 text-right whitespace-nowrap">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerSummaries
                    ?.filter(
                      (customer: CustomerSummary) =>
                        customer.totalAmount > 0 || customer.pendingJars > 0
                    )
                    .map((customer: CustomerSummary) => (
                      <TableRow key={customer.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="whitespace-nowrap font-medium text-gray-900">
                          {customer.name}
                        </TableCell>
                        <TableCell className="text-center font-medium text-gray-900">
                          ₹{customer.totalAmount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-medium text-gray-900">
                          {customer.pendingJars}
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-blue-50 text-sm text-blue-600 hover:text-blue-600"
                              >
                                <Receipt className="h-4 w-4 mr-2 text-green-500" />
                                Payment
                              </Button>
                            </DialogTrigger>
                            <PaymentDialog
                              customer={{
                                id: customer.id,
                                name: customer.name,
                                pendingAmount: customer.totalAmount,
                              }}
                              onClose={() => {}}
                              onSuccess={() => mutate()}
                            />
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  {orders?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        No data found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}