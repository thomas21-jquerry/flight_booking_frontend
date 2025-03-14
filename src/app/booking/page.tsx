'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Flight, getFlightById } from '@/services/flightService'

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function BookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [flights, setFlights] = useState<{
    departure?: Flight
    return?: Flight
  }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const departureFlight = searchParams.get('departureFlight')
        const returnFlight = searchParams.get('returnFlight')

        if (!departureFlight) {
          throw new Error('No departure flight selected')
        }

        // Fetch departure flight details
        const departureDetails = await getFlightById(departureFlight)
        const flightDetails: { departure: Flight; return?: Flight } = {
          departure: departureDetails
        }

        // Fetch return flight details if it exists
        if (returnFlight) {
          const returnDetails = await getFlightById(returnFlight)
          flightDetails.return = returnDetails
        }

        setFlights(flightDetails)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load flight details')
      } finally {
        setLoading(false)
      }
    }

    fetchFlightDetails()
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading flight details...</p>
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
        <button
          onClick={() => router.push('/flights')}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to flight search
        </button>
      </div>
    )
  }

  const totalPrice = (flights.departure?.price || 0) + (flights.return?.price || 0)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => router.push('/flights')}
        className="text-blue-600 hover:text-blue-800 mb-6 inline-flex items-center"
      >
        ← Back to flight search
      </button>

      <h1 className="text-3xl font-bold mb-8">Flight Booking Details</h1>

      <div className="space-y-6">
        {flights.departure && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Departure Flight</h2>
            <div className="space-y-2">
              <p className="text-lg">
                <span className="font-medium">{flights.departure.airline}</span> - {flights.departure.flightNumber}
              </p>
              <p className="text-gray-600">
                {capitalizeFirstLetter(flights.departure.origin)} → {capitalizeFirstLetter(flights.departure.destination)}
              </p>
              <p className="text-gray-500">
                Departure: {flights.departure.departure_time} | 
                Arrival: {flights.departure.arrival_time}
              </p>
              <p className="text-blue-600 font-bold">
                ₹{flights.departure.price.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {flights.return && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Return Flight</h2>
            <div className="space-y-2">
              <p className="text-lg">
                <span className="font-medium">{flights.return.airline}</span> - {flights.return.flightNumber}
              </p>
              <p className="text-gray-600">
                {capitalizeFirstLetter(flights.return.origin)} → {capitalizeFirstLetter(flights.return.destination)}
              </p>
              <p className="text-gray-500">
                Departure: {flights.return.departure_time} | 
                Arrival: {flights.return.arrival_time}
              </p>
              <p className="text-blue-600 font-bold">
                ₹{flights.return.price.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Total Price</h2>
              <p className="text-gray-600">Including all taxes and fees</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              ₹{totalPrice.toLocaleString()}
            </p>
          </div>
        </div>

        <button
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  )
} 