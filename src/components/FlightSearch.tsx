'use client'

import { useState, useEffect } from 'react'
import { searchFlights, type Flight } from '@/services/flightService'
import { useRouter } from 'next/navigation'

export default function FlightSearch() {
  const router = useRouter()
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [isRoundTrip, setIsRoundTrip] = useState(false)
  const [flights, setFlights] = useState<{ departure: Flight[], return: Flight[] }>({ departure: [], return: [] })
  const [selectedFlights, setSelectedFlights] = useState<{ departure?: Flight, return?: Flight }>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({ min: '', max: '' })
  const [activeTab, setActiveTab] = useState<'departure' | 'return'>('departure')

  useEffect(() => {
    // Calculate date range on client side only
    const today = new Date().toISOString().split('T')[0]
    const maxDate = new Date()
    maxDate.setFullYear(maxDate.getFullYear() + 1)
    const maxDateString = maxDate.toISOString().split('T')[0]
    setDateRange({ min: today, max: maxDateString })
  }, [])

  // Reset selected flights when changing trip type
  useEffect(() => {
    setSelectedFlights({})
    setActiveTab('departure')
  }, [isRoundTrip])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSelectedFlights({})

    try {
      // Search for departure flights
      const departureResults = await searchFlights({
        origin: origin.toLowerCase(),
        destination: destination.toLowerCase(),
        date: new Date(departureDate).toISOString().split('T')[0],
      })

      let returnResults: Flight[] = []
      if (isRoundTrip && returnDate) {
        // Search for return flights
        returnResults = await searchFlights({
          origin: destination.toLowerCase(),
          destination: origin.toLowerCase(),
          date: new Date(returnDate).toISOString().split('T')[0],
        })
      }

      setFlights({
        departure: departureResults,
        return: returnResults
      })
      setActiveTab('departure')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search flights')
    } finally {
      setLoading(false)
    }
  }

  const handleFlightSelect = (flight: Flight, type: 'departure' | 'return') => {
    setSelectedFlights(prev => ({ ...prev, [type]: flight }))
    
    if (isRoundTrip) {
      if (type === 'departure') {
        setActiveTab('return')
      } else if (type === 'return') {
        // Navigate to booking page with both flights
        router.push(`/booking?departureFlight=${selectedFlights.departure?.id}&returnFlight=${flight.id}`)
      }
    } else {
      // Navigate to booking page with single flight
      router.push(`/booking?departureFlight=${flight.id}`)
    }
  }

  const renderFlights = (flightList: Flight[], type: 'departure' | 'return') => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">
        {type === 'departure' ? 'Departure' : 'Return'} Flights
        {isRoundTrip && type === 'departure' && selectedFlights.departure && (
          <span className="ml-2 text-sm text-green-600">
            (Selected flight: {selectedFlights.departure.airline} - {selectedFlights.departure.flightNumber})
          </span>
        )}
      </h2>
      {flightList.map((flight) => (
        <div
          key={flight.id}
          className={`bg-white p-4 rounded-lg shadow-md border ${
            selectedFlights[type]?.id === flight.id
              ? 'border-blue-500 ring-2 ring-blue-500'
              : 'border-gray-200 hover:border-blue-300'
          } cursor-pointer transition-all`}
          onClick={() => handleFlightSelect(flight, type)}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">
                {flight.airline} - {flight.flightNumber}
              </h3>
              <p className="text-gray-600">
                {flight.origin} → {flight.destination}
              </p>
              <p className="text-sm text-gray-500">
                Departure: {flight.departure_time} | 
                Arrival: {flight.arrival_time}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-blue-600">
                ₹{flight.economy_price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                {flight.economy_seats} seats available
              </p>
              <button
                className="mt-2 px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={(e) => {
                  e.stopPropagation()
                  handleFlightSelect(flight, type)
                }}
              >
                {selectedFlights[type]?.id === flight.id ? 'Selected' : 'Select'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSearch} className="space-y-4 mb-8">
        <div className="flex gap-4 mb-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-blue-600"
              checked={!isRoundTrip}
              onChange={() => setIsRoundTrip(false)}
            />
            <span className="ml-2">One Way</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-blue-600"
              checked={isRoundTrip}
              onChange={() => setIsRoundTrip(true)}
            />
            <span className="ml-2">Round Trip</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-gray-700">
              Origin
            </label>
            <input
              type="text"
              id="origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Delhi"
              required
            />
          </div>

          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
              Destination
            </label>
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Mumbai"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700">
              Departure Date
            </label>
            <input
              type="date"
              id="departureDate"
              value={departureDate}
              onChange={(e) => {
                setDepartureDate(e.target.value)
                // Clear return date if it's before new departure date
                if (returnDate && returnDate < e.target.value) {
                  setReturnDate('')
                }
              }}
              min={dateRange.min}
              max={dateRange.max}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {isRoundTrip && (
            <div>
              <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">
                Return Date
              </label>
              <input
                type="date"
                id="returnDate"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={departureDate || dateRange.min}
                max={dateRange.max}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required={isRoundTrip}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search Flights'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {(flights.departure.length > 0 || flights.return.length > 0) && (
        <div className="space-y-6">
          {isRoundTrip && (
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setActiveTab('departure')}
                className={`flex-1 py-2 px-4 rounded-md ${
                  activeTab === 'departure'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Departure Flights
              </button>
              <button
                onClick={() => setActiveTab('return')}
                className={`flex-1 py-2 px-4 rounded-md ${
                  activeTab === 'return'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                disabled={!selectedFlights.departure}
              >
                Return Flights
              </button>
            </div>
          )}
          
          {activeTab === 'departure' && flights.departure.length > 0 && (
            renderFlights(flights.departure, 'departure')
          )}
          
          {activeTab === 'return' && flights.return.length > 0 && (
            renderFlights(flights.return, 'return')
          )}
        </div>
      )}
    </div>
  )
} 