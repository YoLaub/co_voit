import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_URL = import.meta.env.VITE_API_URL ?? 'https://covoit-api.john-world.store'

function authHeaders() {
  const token = useAuthStore.getState().token
  return { Authorization: `Bearer ${token}` }
}

export interface Brand {
  id: number
  label: string
}

export interface Model {
  id: number
  label: string
}

export interface VehicleResponse {
  id: number
  brand: string
  model: string
  seats: number
  carregistration: string
}

export interface CarPayload {
  brand: string
  model: string
  seats: number
  carregistration: string
}

export async function getBrands(): Promise<Brand[]> {
  const { data } = await axios.get<Brand[]>(`${API_URL}/api/brands`, {
    headers: authHeaders(),
  })
  return data
}

export async function getModelsByBrand(brandId: number): Promise<Model[]> {
  const { data } = await axios.get<Model[]>(`${API_URL}/api/models/brand/${brandId}`, {
    headers: authHeaders(),
  })
  return data
}

export async function getMyCar(): Promise<VehicleResponse> {
  const { data } = await axios.get<VehicleResponse>(`${API_URL}/api/cars/my-car`, {
    headers: authHeaders(),
  })
  return data
}

export async function createCar(payload: CarPayload): Promise<VehicleResponse> {
  const { data } = await axios.post<VehicleResponse>(`${API_URL}/api/cars`, payload, {
    headers: authHeaders(),
  })
  return data
}

export async function updateCar(id: number, payload: CarPayload): Promise<VehicleResponse> {
  const { data } = await axios.put<VehicleResponse>(`${API_URL}/api/cars/${id}`, payload, {
    headers: authHeaders(),
  })
  return data
}

export async function deleteCar(id: number): Promise<void> {
  await axios.delete(`${API_URL}/api/cars/${id}`, { headers: authHeaders() })
}
