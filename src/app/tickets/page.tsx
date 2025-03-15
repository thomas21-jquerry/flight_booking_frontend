'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Ticket {
  id: string
  booking_id: string
  passenger_name: string
  seat_class: string
  flights: {
    airline: string
    flightNumber: string
    origin: string
    destination: string
    departure_time: string
    arrival_time: string
    duration: string
  }
}

export default function TicketsPage() {
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/auth/login')
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/tickets`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch tickets')
        }

        const data = await response.json()
        // Only show tickets for future flights
        const currentDate = new Date()
        const futureTickets = data.filter((ticket: Ticket) => 
          new Date(ticket.flights.departure_time) > currentDate
        )
        setTickets(futureTickets)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tickets')
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your tickets...</p>
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const renderTicket = (ticket: Ticket) => {
    const departureDate = new Date(ticket.flights.departure_time)
    const arrivalDate = new Date(ticket.flights.arrival_time)

    return (
      <div key={ticket.id} className="relative mb-8">
        {/* Ticket container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Airline header */}
          <div className="bg-blue-600 px-6 py-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {ticket.flights.airline}
              </h3>
              <span className="text-blue-100">
                Flight {ticket.flights.flightNumber}
              </span>
            </div>
          </div>

          {/* Main ticket content */}
          <div className="p-6">
            {/* Flight info */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-center flex-1">
                <p className="text-3xl font-bold text-gray-800">{ticket.flights.origin}</p>
                <p className="text-sm text-gray-500">{formatTime(departureDate)}</p>
              </div>
              
              <div className="flex-1 px-4">
                <div className="relative">
                  <div className="border-t-2 border-gray-300 absolute w-full top-1/2"></div>
                  <div className="flex justify-center">
                    <span className="bg-white px-2 text-gray-400 relative">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">{ticket.flights.duration}</p>
              </div>

              <div className="text-center flex-1">
                <p className="text-3xl font-bold text-gray-800">{ticket.flights.destination}</p>
                <p className="text-sm text-gray-500">{formatTime(arrivalDate)}</p>
              </div>
            </div>

            {/* Passenger info */}
            <div className="border-t border-dashed pt-6 mt-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Passenger</p>
                  <p className="font-medium">{ticket.passenger_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Class</p>
                  <p className="font-medium">{ticket.seat_class}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Date</p>
                  <p className="font-medium">{formatDate(departureDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket footer */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Booking ID: {ticket.booking_id}
              </div>
              <button
                onClick={() => router.push(`/bookings/${ticket.booking_id}`)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Booking Details →
              </button>
            </div>
          </div>
        </div>

        {/* Decorative circles for ticket effect */}
        <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-100 rounded-full"></div>
        <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-100 rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Tickets</h1>
        <button
          onClick={() => router.push('/bookings')}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
          </svg>
          View All Bookings
        </button>
      </div>

      {tickets.length > 0 ? (
        <div>
          {tickets.map(renderTicket)}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zm12 3h.01M7 10h.01M7 14h.01M11 10h.01M11 14h.01M15 10h.01M15 14h.01M19 10h.01M19 14h.01" />
          </svg>
          <p className="text-gray-500 mb-4">No upcoming tickets found</p>
          <button
            onClick={() => router.push('/flights')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Book a Flight
          </button>
        </div>
      )}
    </div>
  )
} 