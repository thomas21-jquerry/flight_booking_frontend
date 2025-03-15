'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Flight, getFlightById } from '@/services/flightService'
import { supabase } from '@/lib/supabase'
import { Suspense } from 'react'

type ClassType = 'economy' | 'premium' | 'business' | 'first_class'

interface SelectedClasses {
  departure: ClassType
  return: ClassType
}

interface SeatQuantities {
  departure: number
  return: number
}

interface PassengerNames {
  departure: string[]
  return: string[]
}

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Component containing the booking logic
function BookingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // All state hooks
  const [flights, setFlights] = useState<{
    departure?: Flight
    return?: Flight
  }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedClasses, setSelectedClasses] = useState<SelectedClasses>({
    departure: 'economy',
    return: 'economy',
  })
  const [seatQuantities, setSeatQuantities] = useState<SeatQuantities>({
    departure: 1,
    return: 1,
  })
  const [passengerNames, setPassengerNames] = useState<PassengerNames>({
    departure: [''],
    return: [''],
  })

  // Memoized helper functions
  const getPrice = useCallback((flight: Flight, classType: ClassType) => {
    switch (classType) {
      case 'economy':
        return flight.economy_price
      case 'premium':
        return flight.premium_price
      case 'business':
        return flight.business_price
      case 'first_class':
        return flight.first_class_price
    }
  }, [])

  const getSeats = useCallback((flight: Flight, classType: ClassType) => {
    switch (classType) {
      case 'economy':
        return flight.economy_seats
      case 'premium':
        return flight.premium_seats
      case 'business':
        return flight.business_seats
      case 'first_class':
        return flight.first_class_seats
    }
  }, [])

  // Effect for fetching flight details
  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const departureFlight = searchParams.get('departureFlight')
        const returnFlight = searchParams.get('returnFlight')

        if (!departureFlight) {
          throw new Error('No departure flight selected')
        }

        const departureDetails = await getFlightById(departureFlight)
        const flightDetails: { departure: Flight; return?: Flight } = {
          departure: departureDetails,
        }

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

  // Effect for updating passenger names when seat quantities change
  useEffect(() => {
    setPassengerNames((prev) => ({
      departure: Array(seatQuantities.departure)
        .fill('')
        .map((_, i) => prev.departure[i] || ''),
      return: Array(seatQuantities.return)
        .fill('')
        .map((_, i) => prev.return[i] || ''),
    }))
  }, [seatQuantities.departure, seatQuantities.return])

  // Memoized handlers
  const handleQuantityChange = useCallback(
    (flightType: 'departure' | 'return', change: number) => {
      setSeatQuantities((prev) => {
        const newQuantity = Math.max(1, prev[flightType] + change)
        const maxSeats = flights[flightType]
          ? getSeats(flights[flightType]!, selectedClasses[flightType])
          : 1
        return {
          ...prev,
          [flightType]: Math.min(newQuantity, maxSeats),
        }
      })
    },
    [flights, selectedClasses, getSeats]
  )

  const handlePassengerNameChange = useCallback(
    (flightType: 'departure' | 'return', index: number, value: string) => {
      setPassengerNames((prev) => ({
        ...prev,
        [flightType]: prev[flightType].map((name, i) =>
          i === index ? value : name
        ),
      }))
    },
    []
  )

  const handleClassSelection = useCallback(
    (flightType: 'departure' | 'return', type: ClassType) => {
      setSelectedClasses((prev) => ({
        ...prev,
        [flightType]: type,
      }))
      setSeatQuantities((prev) => ({
        ...prev,
        [flightType]: 1,
      }))
    },
    []
  )

  const handleProceedToPayment = useCallback(async () => {
    setLoading(true)
    setError(null)

    const departureNamesValid = passengerNames.departure.every(
      (name) => name.trim() !== ''
    )
    const returnNamesValid =
      !flights.return || passengerNames.return.every((name) => name.trim() !== '')

    if (!departureNamesValid || !returnNamesValid) {
      setError('Please enter names for all passengers')
      setLoading(false)
      return
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
        return
      }

      const data = []
      const departureData = []
      for (let i = 0; i < seatQuantities.departure; i++) {
        departureData.push({
          flight_id: flights.departure?.id,
          seat_class: selectedClasses.departure,
          passenger_name: passengerNames.departure[i],
        })
      }
      const returnData = []

      if (flights?.return) {
        for (let i = 0; i < seatQuantities?.return; i++) {
          returnData.push({
            flight_id: flights.return?.id,
            seat_class: selectedClasses?.return,
            passenger_name: passengerNames?.return[i],
          })
        }
      }

      data.push(...departureData, ...returnData)
      const requestData = {
        data: data,
        return_booked: flights.return ? true : false,
      }
      console.log(requestData, 'requestData')

      const bookingResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/create`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        }
      )

      if (!bookingResponse.ok) {
        const errorText = await bookingResponse.text()
        throw new Error(errorText || 'Failed to create booking')
      }

      router.push(`/bookings`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process booking')
    } finally {
      setLoading(false)
    }
  }, [flights, selectedClasses, seatQuantities, passengerNames, router])

  // Early returns for loading and error states
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
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4">{error}</div>
        <button
          onClick={() => router.push('/flights')}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to flight search
        </button>
      </div>
    )
  }

  // Calculate total price
  const totalPrice =
    (flights.departure
      ? (getPrice(flights.departure, selectedClasses.departure) ?? 0) *
        seatQuantities.departure
      : 0) +
    (flights.return
      ? (getPrice(flights.return, selectedClasses.return) ?? 0) *
        seatQuantities.return
      : 0)

  // Render functions
  const renderClassOption = (
    flight: Flight,
    type: ClassType,
    label: string,
    flightType: 'departure' | 'return'
  ) => {
    const price = getPrice(flight, type)
    const seats = getSeats(flight, type)
    const isSelected = selectedClasses[flightType] === type

    return (
      <button
        onClick={() => handleClassSelection(flightType, type)}
        className={`p-3 border rounded-lg text-left transition-colors ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
        }`}
      >
        <p className="font-medium">{label}</p>
        <p className={`${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
          ₹{price.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">{seats} seats available</p>
      </button>
    )
  }

  const renderSeatQuantitySelector = (flightType: 'departure' | 'return') => {
    const quantity = seatQuantities[flightType]
    const flight = flights[flightType]
    const maxSeats = flight
      ? getSeats(flight, selectedClasses[flightType]) ?? 1
      : 1

    return (
      <div className="flex items-center space-x-4 mt-4 p-3 bg-gray-50 rounded-lg">
        <span className="text-gray-700">Number of Seats:</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleQuantityChange(flightType, -1)}
            disabled={quantity <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
          >
            -
          </button>
          <span className="w-8 text-center font-medium">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(flightType, 1)}
            disabled={quantity >= maxSeats}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
          >
            +
          </button>
        </div>
        <span className="text-sm text-gray-500">(Max: {maxSeats})</span>
      </div>
    )
  }

  const renderPassengerInputs = (flightType: 'departure' | 'return') => {
    const quantity = seatQuantities[flightType]
    const names = passengerNames[flightType]

    return (
      <div className="mt-4 space-y-4">
        <h3 className="font-medium text-gray-700">Passenger Details</h3>
        <div className="space-y-3">
          {Array.from({ length: quantity }).map((_, index) => (
            <div
              key={`${flightType}-passenger-${index}`}
              className="flex items-center space-x-2"
            >
              <span className="text-sm text-gray-500 w-24">
                Passenger {index + 1}
              </span>
              <input
                type="text"
                value={names[index] || ''}
                onChange={(e) =>
                  handlePassengerNameChange(flightType, index, e.target.value)
                }
                placeholder="Enter passenger name"
                className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Main render
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
            <div className="space-y-4">
              <div>
                <p className="text-lg">
                  <span className="font-medium">{flights.departure.airline}</span> -{' '}
                  {flights.departure.flightNumber}
                </p>
                <p className="text-gray-600">
                  {capitalizeFirstLetter(flights.departure.origin)} →{' '}
                  {capitalizeFirstLetter(flights.departure.destination)}
                </p>
                <p className="text-gray-500">
                  Departure: {flights.departure.departure_time} | Arrival:{' '}
                  {flights.departure.arrival_time}
                </p>
                <p className="text-gray-500">
                  Duration: {flights.departure.duration}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {renderClassOption(flights.departure, 'economy', 'Economy', 'departure')}
                {renderClassOption(flights.departure, 'premium', 'Premium', 'departure')}
                {renderClassOption(flights.departure, 'business', 'Business', 'departure')}
                {renderClassOption(flights.departure, 'first_class', 'First Class', 'departure')}
              </div>

              {renderSeatQuantitySelector('departure')}
              {renderPassengerInputs('departure')}
            </div>
          </div>
        )}

        {flights.return && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Return Flight</h2>
            <div className="space-y-4">
              <div>
                <p className="text-lg">
                  <span className="font-medium">{flights.return.airline}</span> -{' '}
                  {flights.return.flightNumber}
                </p>
                <p className="text-gray-600">
                  {capitalizeFirstLetter(flights.return.origin)} →{' '}
                  {capitalizeFirstLetter(flights.return.destination)}
                </p>
                <p className="text-gray-500">
                  Departure: {flights.return.departure_time} | Arrival:{' '}
                  {flights.return.arrival_time}
                </p>
                <p className="text-gray-500">Duration: {flights.return.duration}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {renderClassOption(flights.return, 'economy', 'Economy', 'return')}
                {renderClassOption(flights.return, 'premium', 'Premium', 'return')}
                {renderClassOption(flights.return, 'business', 'Business', 'return')}
                {renderClassOption(flights.return, 'first_class', 'First Class', 'return')}
              </div>

              {renderSeatQuantitySelector('return')}
              {renderPassengerInputs('return')}
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Total Price</h2>
              <p className="text-gray-600">Including all taxes and fees</p>
              <p className="text-sm text-gray-500">
                Departure: {capitalizeFirstLetter(selectedClasses.departure)}{' '}
                Class ({seatQuantities.departure}{' '}
                {seatQuantities.departure === 1 ? 'seat' : 'seats'})
                {flights.return &&
                  ` | Return: ${capitalizeFirstLetter(selectedClasses.return)} Class (${
                    seatQuantities.return
                  } ${seatQuantities.return === 1 ? 'seat' : 'seats'})`}
              </p>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              ₹{totalPrice.toLocaleString()}
            </p>
          </div>
        </div>

        <button
          onClick={handleProceedToPayment}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Book Now'}
        </button>
      </div>
    </div>
  )
}

// Wrap the content in Suspense
export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading booking details...</p>
          </div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  )
}