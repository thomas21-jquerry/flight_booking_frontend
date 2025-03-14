import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white rounded-lg p-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Find Your Perfect Flight</h1>
        <p className="text-xl mb-8">Book flights to destinations worldwide with ease</p>
        <Link 
          href="/flights" 
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
        >
          Search Flights
        </Link>
      </section>

      {/* Featured Destinations */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Popular Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['New York', 'London', 'Tokyo'].map((city) => (
            <div key={city} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{city}</h3>
                <p className="text-gray-600">Discover amazing deals to {city}</p>
                <Link 
                  href={`/flights?destination=${city}`}
                  className="mt-2 inline-block text-blue-600 hover:text-blue-800"
                >
                  View Flights →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">✈️</div>
            <h3 className="font-semibold mb-2">Best Prices</h3>
            <p className="text-gray-600">Find the most competitive flight prices</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🛡️</div>
            <h3 className="font-semibold mb-2">Secure Booking</h3>
            <p className="text-gray-600">Safe and secure payment process</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold mb-2">Easy Search</h3>
            <p className="text-gray-600">Simple and intuitive flight search</p>
          </div>
        </div>
      </section>
    </div>
  )
}
