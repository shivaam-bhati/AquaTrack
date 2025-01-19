"use client";

import { useCustomers } from "@/hooks/useCustomers";
import { useOrders } from "@/hooks/useOrders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PaymentDialog } from "@/components/payments/PaymentDialog";
import { Button } from "@/components/ui/button";
import { Receipt } from "lucide-react";

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
  const { customers } = useCustomers();
  const { orders, mutate } = useOrders();

  const currentMonth = format(new Date(), 'MMMM yyyy');

  const customerSummaries = customers?.map((customer: Customer) => {
    const customerOrders = orders?.filter((order: Order) => 
      order.customerId === customer.id && 
      new Date(order.date).getMonth() === new Date().getMonth()
    );

    const totalAmount = customerOrders?.reduce((sum: number, order: Order) => 
      sum + (order.givenJars * parseFloat(customer.pricePerJar)), 0
    ) || 0;

    const pendingJars = customerOrders?.reduce((sum: number, order: Order) => 
      sum + (order.givenJars - order.returnedJars), 0
    ) || 0;

    return {
      id: customer.id,
      name: customer.name,
      totalAmount,
      pendingJars,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Monthly Reports</h1>
          <p className="text-gray-500 mt-1">{currentMonth}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Collections Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ₹{customerSummaries?.reduce((sum: number, customer: CustomerSummary) => 
                  sum + customer.totalAmount, 0).toFixed(2)}
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
                {customerSummaries?.reduce((sum: number, customer: CustomerSummary) => 
                  sum + customer.pendingJars, 0)}
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
                {customerSummaries?.filter((c: CustomerSummary) => c.totalAmount > 0).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer-wise Report */}
        <Card>
          <CardHeader>
            <CardTitle>Customer-wise Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      Pending Amount
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      Pending Jars
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customerSummaries
                    ?.filter((customer: CustomerSummary) => customer.totalAmount > 0 || customer.pendingJars > 0)
                    .map((customer: CustomerSummary) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {customer.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          ₹{customer.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {customer.pendingJars}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-blue-50"
                              >
                                <Receipt className="h-4 w-4 mr-2" />
                                Record Payment
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
  )
} 