'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LandingPage() {
  const router = useRouter()

  const featuredDestinations = [
    {
      city: 'Kochi',
      country: 'India',
      image: '/kochi.jpeg',
      price: '3500',
      description: 'Experience the beauty of backwaters and rich cultural heritage',
    },
    {
      city: 'Mumbai',
      country: 'India',
      image: '/mumbai.jpeg',
      price: '5000',
      description: 'The city that never sleeps, where dreams take flight',
    },
    {
      city: 'Bangalore',
      country: 'India',
      image: '/bangalore.jpeg',
      price: '4000',
      description: 'Silicon Valley of India with perfect weather year-round',
    },
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Business Traveler',
      image: '/katana.png',
      quote: 'SkyWings has made my business travel seamless and comfortable. Their service is unmatched!',
    },
    {
      name: 'Michael Chen',
      role: 'Adventure Enthusiast',
      image: '/katana.png',
      quote: 'The best flight booking experience I\'ve ever had. Quick, easy, and reliable.',
    },
    {
      name: 'Priya Patel',
      role: 'Family Vacationer',
      image: '/katana.png',
      quote: 'Perfect for family trips! Great deals and excellent customer service.',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <div className="relative h-[80vh] bg-gradient-to-r from-blue-600 to-blue-400 overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
          poster="/hero-poster.jpg"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
              Your Journey Begins Here
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              Discover amazing destinations and create unforgettable memories with our exclusive flight deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push('/flights')}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Book Your Flight
              </button>
              <button
                onClick={() => router.push('/about')}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors duration-200"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Flight Quick Access */}
      {/* <div className="relative -mt-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"> */}
                  {/* <option>Select origin</option>
                  <option>Delhi</option>
                  <option>Mumbai</option>
                  <option>Bangalore</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label> */}
                {/* <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Select destination</option>
                  <option>Kochi</option>
                  <option>Chennai</option>
                  <option>Hyderabad</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input type="date" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div> */}
              {/* <div className="flex items-end">
                <button
                  onClick={() => router.push('/flights')}
                  className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                >
                  Search Flights
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose SkyWings?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the best in air travel with our premium services and exclusive benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors duration-200">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">24/7 Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Our dedicated team is available round-the-clock to assist you with any queries or concerns.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors duration-200">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Best Prices</h3>
              <p className="text-gray-600 leading-relaxed">
                Get the most competitive rates and exclusive deals on flights to your favorite destinations.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors duration-200">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Flexible Booking</h3>
              <p className="text-gray-600 leading-relaxed">
                Change or cancel your bookings with ease. We understand plans can change.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Destinations */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our most sought-after destinations with exclusive flight deals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredDestinations.map((destination) => (
              <div
                key={destination.city}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-64">
                  <Image
                    src={destination.image}
                    alt={`${destination.city}, ${destination.country}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold">{destination.city}</h3>
                    <p className="text-sm text-gray-200">{destination.country}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{destination.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{destination.price}
                    </span>
                    <button
                      onClick={() => router.push('/flights')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what travelers have to say about their experience with SkyWings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-gray-50 p-8 rounded-xl">
                <div className="flex items-center mb-6">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section with Enhanced Design */}
      <div className="relative py-24 bg-blue-600 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/newsletter-bg.jpg"
            alt="Newsletter background"
            fill
            className="object-cover opacity-10"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Never Miss a Deal
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about exclusive flight offers and travel tips.
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
              />
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-lg hover:shadow-xl">
                Subscribe
              </button>
            </div>
            <p className="mt-4 text-sm text-blue-100">
              By subscribing, you agree to our Privacy Policy and Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
