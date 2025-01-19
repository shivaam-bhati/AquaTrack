import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="px-4 py-12 md:py-20 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4 md:mb-6">
                #1 Water Jar Management App
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                Welcome to AquaTrack
                <span className="text-blue-600 block mt-2">Your Water Business Partner</span>
              </h1>
              <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8">
                Stop using diaries! Track water jars, manage customers, and grow your business digitally - all from your phone.
              </p>
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 max-w-sm mx-auto md:mx-0">
                <Link 
                  href="/auth/login" 
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all text-center shadow-lg hover:shadow-xl"
                >
                  Start Using Now 
                </Link>
                <Link 
                  href="#how-it-works" 
                  className="w-full bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all border border-blue-100 text-center"
                >
                  See How It Works
                </Link>
              </div>
            </div>
            
            {/* Summary Card - Hidden on mobile, shown on desktop */}
            <div className="hidden md:block relative">
              <div className="bg-blue-600 rounded-3xl p-6 text-white transform rotate-3 shadow-xl">
                <div className="text-lg font-semibold mb-4">Today&apos;s Summary</div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Given Jars</span>
                    <span className="font-bold">45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Returned Jars</span>
                    <span className="font-bold">38</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Active Customers</span>
                    <span className="font-bold">128</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold">SMART FEATURES</span>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mt-2">
              Everything You Need to Manage Water Jars
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard 
              title="Daily Jar Tracking" 
              features={[
                "Track given & returned jars",
                "Real-time inventory updates",
                "Customer-wise records",
              ]}
            />
            <FeatureCard 
              title="Business Reports" 
              features={[
                "Monthly collection reports",
                "Jar balance analysis",
                "Business insights",
              ]}
            />
            <FeatureCard 
              title="Customer Management" 
              features={[
                "Digital customer profiles",
                "Payment history",
                "Delivery addresses",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Footer - Simplified and Mobile Optimized */}
      <footer className="bg-gradient-to-br from-white via-blue-50 to-blue-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12h-4m0 0l-4-4m4 4l-4 4M4 12h4m0 0l4-4m-4 4l4 4" />
              </svg>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                AquaTrack
              </span>
            </div>
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link href="/features" className="text-gray-600 hover:text-blue-600">Features</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-blue-600">Pricing</Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
              <Link href="/privacy" className="text-gray-600 hover:text-blue-600">Privacy</Link>
            </nav>
            <p className="text-sm text-gray-500 text-center">© 2025 AquaTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ title, features }: { title: string; features: string[] }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <ul className="space-y-2 text-gray-600">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}