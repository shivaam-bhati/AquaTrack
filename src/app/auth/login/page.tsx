"use client";

import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  
  // Redirect to dashboard if already logged in
  if (session?.user) {
    redirect("/home");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Title */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-blue-600/10 p-3">
                <svg 
                  className="h-10 w-10 text-blue-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M20 12h-4m0 0l-4-4m4 4l-4 4M4 12h4m0 0l4-4m-4 4l4 4" 
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome to AquaTrack
            </h2>
            <p className="mt-3 text-gray-600">
              Manage your water jar business efficiently
            </p>
          </div>

          {/* Login Button */}
          <div className="mt-8 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gradient-to-br from-blue-50 via-white to-blue-50 px-2 text-gray-500">
                  Sign in with
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => signIn("google", { callbackUrl: "/home" })}
                disabled={status === "loading"}
                className="relative w-full inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "loading" ? (
                  <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                ) : (
                  <>
                    <Image
                      src="/google.svg"
                      alt="Google logo"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    Continue with Google
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Terms and Privacy */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              By signing in, you agree to our{" "}
              <a href="/terms" className="font-medium text-blue-600 hover:text-blue-500">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 