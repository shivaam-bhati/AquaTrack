"use client";

import { useState, useEffect } from "react";
import { useCustomers } from "@/hooks/useCustomers";
import { useOrders } from "@/hooks/useOrders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PaymentDialog } from "@/components/payments/PaymentDialog";
import { Button } from "@/components/ui/button";
import { ChevronRight, Home, Link, Receipt } from "lucide-react";

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
  const { customers, isLoading: customersLoading } = useCustomers();
  const { orders, isLoading: ordersLoading, mutate } = useOrders();
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

  if (customersLoading || ordersLoading || !currentMonth) {
    return <div>Loading...</div>; // You can add a more sophisticated loading spinner here
  }

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
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                      Pending Amount
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                      Pending Jars
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customerSummaries
                    ?.filter(
                      (customer: CustomerSummary) =>
                        customer.totalAmount > 0 || customer.pendingJars > 0
                    )
                    .map((customer: CustomerSummary) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {customer.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                          ₹{customer.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                          {customer.pendingJars}
                        </td>
                        <td className="px-6 py-4 text-right">
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
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}