'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Flight {
  airline: string
  flightNumber: string
  origin: string
  destination: string
  departure_time: string
  arrival_time: string
}

interface Booking {
  id: string
  flight_id: string
  passenger_name: string
  seat_class: string
  created_at: string
  total_price_paid: number
  flights: Flight
  return_flight_id?: string | null
  return_flights?: Flight | null // Optional return flight details
}

interface ApiResponse {
  data: Booking[]
  page: number
  total: number
  totalPages: number
}

export default function BookingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchBookings = async (page: number) => {
    setLoading(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }

      const data: ApiResponse = await response.json()
      console.log(data.data.length)
      setTotal(data.total)
      setBookings(data.data)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings(currentPage)
  }, [currentPage, router])

  useEffect(() => {
    setCurrentPage(1) // Reset to page 1 when tab changes
    fetchBookings(1)  // Fetch bookings for the new tab
  }, [activeTab])

  const currentDate = new Date()
  const currentBookings = bookings.filter(booking => 
    new Date(booking.flights.departure_time) > currentDate
  )
  const pastBookings = bookings.filter(booking => 
    new Date(booking.flights.departure_time) <= currentDate
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4">
          {error}
        </div>
      </div>
    )
  }

  const renderBookingCard = (booking: Booking) => {
    const departureDate = new Date(booking.flights.departure_time)
    const arrivalDate = new Date(booking.flights.arrival_time)

    return (
      <div key={booking.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">
              {booking.flights.airline} - {booking.flights.flightNumber}
            </h3>
            <p className="text-gray-600">
              {booking.flights.origin} → {booking.flights.destination}
            </p>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {booking.seat_class}
            </span>
            <p className="mt-2 text-lg font-semibold text-green-600">
              ₹{booking.total_price_paid.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div>
              <p className="text-gray-500">Departure</p>
              <p className="font-medium">
                {departureDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
              <p className="text-gray-600">
                {departureDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Arrival</p>
              <p className="font-medium">
                {arrivalDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
              <p className="text-gray-600">
                {arrivalDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600">
              Passenger: {booking.passenger_name || 'N/A'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
                Return Flight: {booking.return_flight_id ? "Yes": "No"}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const renderPagination = () => (
    <div className="flex justify-center items-center mt-6 space-x-2">
      <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-gray-300"
      >
        Prev
      </button>
      <span className="text-gray-700">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-gray-300"
      >
        Next
      </button>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('current')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'current'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Current Bookings ({total})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'past'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Past Bookings ({pastBookings.length})
            </button>
          </nav>
        </div>
      </div>

      <div className="space-y-6">
        {activeTab === 'current' ? (
          currentBookings.length > 0 ? (
            <>
              {currentBookings.map(renderBookingCard)}
              {renderPagination()}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No current bookings</p>
              <button
                onClick={() => router.push('/flights')}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                Book a Flight
              </button>
            </div>
          )
        ) : (
          pastBookings.length > 0 ? (
            <>
              {pastBookings.map(renderBookingCard)}
              {renderPagination()}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No past bookings</p>
            </div>
          )
        )}
      </div>
    </div>
  )
}