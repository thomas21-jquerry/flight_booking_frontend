export interface FlightSearchParams {
  origin: string;
  destination: string;
  date: string;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  economy_price: number;
  premium_price: number;
  business_price: number;
  first_class_price: number;
  economy_seats: number;
  premium_seats: number;
  business_seats: number;
  first_class_seats: number;
  created_at: string;
}


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const searchFlights = async (params: FlightSearchParams): Promise<Flight[]> => {
  try {
    const queryParams = new URLSearchParams({
      origin: params.origin,
      destination: params.destination,
      date: params.date,
    });

    const response = await fetch(`${API_BASE_URL}/flights/search?${queryParams}`);
    
    if (!response.ok) {
      console.log(response)
      throw new Error('Failed to fetch flights');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
};

export const getFlightById = async (id: string): Promise<Flight> => {
  try {
    const response = await fetch(`${API_BASE_URL}/flights/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch flight details');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching flight details:', error);
    throw error;
  }
}; 