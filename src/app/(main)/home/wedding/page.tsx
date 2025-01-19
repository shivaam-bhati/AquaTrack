import {auth} from "@/lib/auth";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function WeddingPage() {
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
            <span className="text-blue-600 font-medium">Wedding</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center mt-32 text-3xl">
        Coming Soon...
      </div>
    </div>
  )
}