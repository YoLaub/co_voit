import apiClient from './axiosClient'
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
  departure: LocationResponse
  arrival: LocationResponse
  date: string
  hour: string
  kms: number
  availableSeats: number
  driverName: string
  iconLabel: string
}

export interface CreateTripRequest {
  kms: number
  availableSeats: number
  tripDatetime: string
  startingAddress: AddressRequest
  arrivalAddress: AddressRequest
  iconId?: number
}

export async function createTrip(data: CreateTripRequest): Promise<void> {
  const dt = new Date(data.tripDatetime)
  const tripDate = dt.toISOString().split('T')[0] // "2026-03-12"
  const tripHour = dt.toTimeString().slice(0, 5)   // "17:00"

  await apiClient.post(`/api/trips`, {
    kms: data.kms,
    availableSeats: data.availableSeats,
    tripDate,
    tripHour,
    iconId: data.iconId ?? 1,
    startingAddress: {
      ...data.startingAddress,
      city: data.startingAddress.city,
    },
    arrivalAddress: {
      ...data.arrivalAddress,
      city: data.arrivalAddress.city,
    },
  })
}

export async function getAllTrips(): Promise<RouteResponse[]> {
  const { data } = await apiClient.get<RouteResponse[]>(`/api/trips`)
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
  departure: LocationResponse
  arrival: LocationResponse
  date: string
  hour: string
  kms: number
  availableSeats: number
  driverName: string
  iconLabel: string
  driver: {
    profilId: number
    firstname: string
    lastname: string
    phone: string
    email: string
  }
  vehicle: {
    id: number
    brand: string
    model: string
    seats: number
    carregistration: string
  } | null
  passengers?: PersonResponse[]
}

export interface SearchParams {
  startingCity?: string
  arrivalCity?: string
  tripDate?: string
}

export async function getTripById(id: number): Promise<RouteDetailResponse> {
  const { data } = await apiClient.get<RouteDetailResponse>(`/api/trips/${id}`)
  return data
}

export async function reserveTrip(id: number): Promise<void> {
  await apiClient.post(`/api/trips/${id}/person`, null)
}

export async function getMyTrips(): Promise<RouteResponse[]> {
  const { data } = await apiClient.get<RouteResponse[]>(`/api/persons/me/trips-driver`)
  return data
}

export async function deleteTrip(id: number): Promise<void> {
  await apiClient.delete(`/api/trips/${id}`)
}

export async function searchTrips(params: SearchParams): Promise<RouteResponse[]> {
  const query = new URLSearchParams()
  if (params.startingCity) query.set('startingcity', params.startingCity)
  if (params.arrivalCity) query.set('arrivalcity', params.arrivalCity)
  if (params.tripDate) query.set('tripdate', params.tripDate)
  const { data } = await apiClient.get<RouteResponse[]>(`/api/trips?${query}`)
  return data
}
