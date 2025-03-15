export interface BookingRequest {
  flight_id: string;
  seat_number: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  price: number;
}

export interface Booking extends BookingRequest {
  id: string;
  user_id: string;
  created_at: string;
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createBooking(token: string, bookingData: BookingRequest): Promise<Booking> {
  const response = await fetch(`${baseURL}/bookings`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to create booking');
  }

  return response.json();
} 