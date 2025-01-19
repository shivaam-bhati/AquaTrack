import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CustomersTable } from "@/components/customers/CustomersTable";
import { CreateCustomerButton } from "@/components/customers/CreateCustomerButton";
import { SearchBar } from "@/components/customers/SearchBar";
import { Home, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function CustomersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
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
            <span className="text-blue-600 font-medium">Customers</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-blue-600">Customers</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your water jar customers and their orders
              </p>
            </div>
            <div className="hidden sm:block">
              <CreateCustomerButton />
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Table Toolbar */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="w-full sm:w-[350px]">
                <SearchBar />
              </div>
            </div>
          </div>

          <CustomersTable />
        </div>
      </div>

      {/* Mobile FAB */}
      <div className="fixed right-4 bottom-4 sm:hidden">
        <CreateCustomerButton mode="mobile" />
      </div>
    </div>
  );
}