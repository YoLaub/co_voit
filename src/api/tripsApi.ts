import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import type { AddressRequest } from '../utils/formatAddress'

export interface LocationResponse {
  id: number
  streetNumber?: string
  streetName: string
  postalCode: string
  cityName: string
  latitude: number
  longitude: number
}

export interface RouteResponse {
  id: number
  startingAddress: LocationResponse
  arrivalAddress: LocationResponse
  tripDatetime: string
  kms: number
  availableSeats: number
  driverName: string
  iconLabel: string
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

function authHeaders() {
  const token = useAuthStore.getState().token
  return { Authorization: `Bearer ${token}` }
}

export interface CreateTripRequest {
  kms: number
  availableSeats: number
  tripDatetime: string
  startingAddress: AddressRequest
  arrivalAddress: AddressRequest
}

export async function createTrip(data: CreateTripRequest): Promise<void> {
  await axios.post(`${API_URL}/api/trips`, data, { headers: authHeaders() })
}

export async function getAllTrips(): Promise<RouteResponse[]> {
  const { data } = await axios.get<RouteResponse[]>(`${API_URL}/api/trips`, {
    headers: authHeaders(),
  })
  return data
}

export interface PersonResponse {
  profilId: number
  firstname: string
  lastname: string
  phone: string
  email: string
}

export interface RouteDetailResponse {
  id: number
  startingAddress: LocationResponse
  arrivalAddress: LocationResponse
  tripDatetime: string
  kms: number
  availableSeats: number
  driver: PersonResponse
  passengers: PersonResponse[]
  vehicle: {
    id: number
    brand: string
    model: string
    seats: number
    carregistration: string
  }
}

export interface SearchParams {
  startingCity?: string
  arrivalCity?: string
  tripDate?: string
}

export async function getTripById(id: number): Promise<RouteDetailResponse> {
  const { data } = await axios.get<RouteDetailResponse>(`${API_URL}/api/trips/${id}`, {
    headers: authHeaders(),
  })
  return data
}

export async function reserveTrip(id: number): Promise<void> {
  await axios.post(`${API_URL}/api/trips/${id}/person`, null, { headers: authHeaders() })
}

export async function getMyTrips(personId: number): Promise<RouteResponse[]> {
  const { data } = await axios.get<RouteResponse[]>(
    `${API_URL}/api/persons/${personId}/trips-driver`,
    { headers: authHeaders() },
  )
  return data
}

export async function deleteTrip(id: number): Promise<void> {
  await axios.delete(`${API_URL}/api/trips/${id}`, { headers: authHeaders() })
}

export async function searchTrips(params: SearchParams): Promise<RouteResponse[]> {
  const query = new URLSearchParams()
  if (params.startingCity) query.set('startingCity', params.startingCity)
  if (params.arrivalCity) query.set('arrivalCity', params.arrivalCity)
  if (params.tripDate) query.set('tripDate', params.tripDate)
  const { data } = await axios.get<RouteResponse[]>(`${API_URL}/api/trips?${query}`, {
    headers: authHeaders(),
  })
  return data
}
