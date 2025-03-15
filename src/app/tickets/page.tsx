'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

// Updated Ticket interface to reflect booking-level flight data
interface Ticket {
  id: string
  booking_id: string
  passenger_name: string
  seat_class: 'economy' | 'premium' | 'business' | 'first_class'
  flight_id: string // Ticket's flight_id to match with booking flights
  active: boolean,
}

interface Booking {
  id: string
  flight_id: string
  return_flight_id: string | null
  flights: {
    airline: string
    flight_number: string
    origin: string
    destination: string
    departure_time: string
    arrival_time: string
    duration: string
  }
  tickets: Ticket[]
}

export default function TicketsPage() {
  const router = useRouter()
  const [tickets, setTickets] = useState<(Ticket & { flights: Booking['flights'] })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancellingTicketId, setCancellingTicketId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'active' | 'cancelled'>('active')

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/auth/login')
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch tickets')
        }
        const resp = await response.json()
        console.log(resp)
        const bookingsData: Booking[] = resp.data;
        console.log(bookingsData, "data")

        // Flatten bookings into tickets with flight details
        const ticketPromises = bookingsData.flatMap((booking) =>
          booking.tickets.map(async (ticket) => {
            const flight = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/flights/${ticket.flight_id}`)
            const flights = await flight.json()
            return { ...ticket, flights }
          })
        )
        
        const allTickets = await Promise.all(ticketPromises)
        const currentDate = new Date()
        // Filter tickets based on active status and departure time
        const activeTickets = allTickets.filter((ticket) => 
          ticket.active && new Date(ticket.flights.departure_time) > currentDate
        )
        const cancelledTickets = allTickets.filter((ticket) => !ticket.active)
        setTickets(activeTab === 'active' ? activeTickets : cancelledTickets)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tickets')
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [router, activeTab])

  const handleCancelTicket = async (ticketId: string) => {
    try {
      setCancellingTicketId(ticketId)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to cancel ticket')
      }

      // Remove the cancelled ticket from state
      setTickets(prev => prev.filter(ticket => ticket.id !== ticketId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel ticket')
    } finally {
      setCancellingTicketId(null)
    }
  }

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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const renderTicket = (ticket: Ticket & { flights: Booking['flights'] }) => {
    const departureDate = new Date(ticket.flights.departure_time)
    const arrivalDate = new Date(ticket.flights.arrival_time)

    return (
      <div key={ticket.id} className="relative mb-8 group">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="bg-blue-600 px-6 py-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {ticket.flights.airline}
              </h3>
              <span className="text-blue-100">
                Flight {ticket.flights.flight_number}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="text-center flex-1">
                <p className="text-3xl font-bold text-gray-800">{ticket.flights.origin}</p>
                <p className="text-sm text-gray-500">{formatTime(ticket.flights.departure_time)}</p>
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
                <p className="text-sm text-gray-500">{formatTime(ticket.flights.arrival_time)}</p>
              </div>
            </div>

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
                  <p className="font-medium">{formatDate(ticket.flights.departure_time)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Booking ID: {ticket.booking_id}
              </div>
              {ticket.active && (
                <button
                  onClick={() => handleCancelTicket(ticket.id)}
                  disabled={cancellingTicketId === ticket.id}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-opacity duration-200 opacity-0 group-hover:opacity-100
                    ${cancellingTicketId === ticket.id
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                >
                  {cancellingTicketId === ticket.id ? 'Cancelling...' : 'Cancel Ticket'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-100 rounded-full"></div>
        <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-100 rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Tickets</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${activeTab === 'active'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Active Tickets
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${activeTab === 'cancelled'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Cancelled Tickets
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {tickets.length > 0 ? (
          tickets.map(renderTicket)
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zm12 3h.01M7 10h.01M7 14h.01M11 10h.01M11 14h.01M15 10h.01M15 14h.01M19 10h.01M19 14h.01" />
            </svg>
            <p className="text-gray-500 mb-4">No {activeTab} tickets found</p>
            {activeTab === 'active' && (
              <button
                onClick={() => router.push('/flights')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Book a Flight
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}