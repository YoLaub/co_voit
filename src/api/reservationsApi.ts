import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import type { RouteResponse } from './tripsApi'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

function authHeaders() {
  const token = useAuthStore.getState().token
  return { Authorization: `Bearer ${token}` }
}

export interface ReservationResponse {
  id: number
  route: RouteResponse
  status: 'pending' | 'confirmed' | 'cancelled'
  roleInRoute: 'driver' | 'passenger'
  createdAt: string
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
