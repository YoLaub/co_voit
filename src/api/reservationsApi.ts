import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_URL = import.meta.env.VITE_API_URL ?? 'https://covoit-api.john-world.store'

function authHeaders() {
  const token = useAuthStore.getState().token
  return { Authorization: `Bearer ${token}` }
}

export interface ReservationResponse {
  routeId: number
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
  departureCity: string
  arrivalCity: string
  tripDate: string
  driverName: string
}

export interface PassengerResponse {
  profilId: number
  firstname: string
  lastname: string
  phone: string
  email: string
}

export async function reserveTrip(tripId: number): Promise<ReservationResponse> {
  const { data } = await axios.post<ReservationResponse>(
    `${API_URL}/api/trips/${tripId}/person`,
    null,
    { headers: authHeaders() },
  )
  return data
}

export async function cancelReservation(tripId: number): Promise<void> {
  await axios.delete(`${API_URL}/api/trips/${tripId}/person`, { headers: authHeaders() })
}

export async function getTripPassengers(tripId: number): Promise<PassengerResponse[]> {
  const { data } = await axios.get<PassengerResponse[]>(
    `${API_URL}/api/trips/${tripId}/person`,
    { headers: authHeaders() },
  )
  return data
}

export async function getMyReservations(): Promise<ReservationResponse[]> {
  const { data } = await axios.get<ReservationResponse[]>(
    `${API_URL}/api/trips/my-reservations`,
    { headers: authHeaders() },
  )
  return data
}
