export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">About Water Manager</h1>
        
        <div className="prose prose-blue">
          <p className="text-gray-600 mb-6">
            Water Manager is a digital solution designed specifically for water jar suppliers across India. 
            Our mission is to simplify the daily operations of water supply businesses by replacing traditional 
            paper-based systems with an efficient digital solution.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Our Story</h2>
          <p className="text-gray-600 mb-6">
            Started in 2025, Water Manager was born from the realization that water jar suppliers 
            needed a better way to manage their daily operations. We observed suppliers struggling 
            with paper diaries and decided to create a simple yet powerful digital solution.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            To empower water jar suppliers with digital tools that make their business operations 
            more efficient, organized, and profitable.
          </p>
        </div>
      </div>
    </main>
  );
} 