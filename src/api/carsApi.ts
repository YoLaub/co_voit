import apiClient from './axiosClient'

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
  brandName: string
  modelName: string
  seats: number
  carregistration: string
  additionalInfo: string | null
}

export interface CarPayload {
  modelId: number
  seats: number
  carregistration: string
}

export async function getBrands(): Promise<Brand[]> {
  const { data } = await apiClient.get<Brand[]>(`/api/brands`)
  return data
}

export async function getModelsByBrand(brandId: number): Promise<Model[]> {
  const { data } = await apiClient.get<Model[]>(`/api/models/brand/${brandId}`)
  return data
}

export async function getMyCar(): Promise<VehicleResponse> {
  const { data } = await apiClient.get<VehicleResponse>(`/api/cars/my-car`)
  return data
}

export async function createCar(payload: CarPayload): Promise<VehicleResponse> {
  const { data } = await apiClient.post<VehicleResponse>(`/api/cars`, payload)
  return data
}

export async function updateCar(id: number, payload: CarPayload): Promise<VehicleResponse> {
  const { data } = await apiClient.put<VehicleResponse>(`/api/cars/${id}`, payload)
  return data
}

export async function deleteCar(id: number): Promise<void> {
  await apiClient.delete(`/api/cars/${id}`)
}
