import apiClient from './axiosClient'

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
  const { data } = await apiClient.post<ReservationResponse>(
    `/api/trips/${tripId}/person`,
    null,
  )
  return data
}

export async function cancelReservation(tripId: number): Promise<void> {
  await apiClient.delete(`/api/trips/${tripId}/person`)
}

export async function getTripPassengers(tripId: number): Promise<PassengerResponse[]> {
  const { data } = await apiClient.get<PassengerResponse[]>(
    `/api/trips/${tripId}/person`,
  )
  return data
}

export async function getMyReservations(): Promise<ReservationResponse[]> {
  const { data } = await apiClient.get<ReservationResponse[]>(
    `/api/trips/my-reservations`,
  )
  return data
}
