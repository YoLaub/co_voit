import apiClient from './axiosClient'

export interface ProfilResponse {
  profilId: number
  accountId: number
  firstname: string
  lastname: string
  phone: string
  status: string
  hasVehicle: boolean
  vehicle: null | { id: number; brand: string; model: string; seats: number; carregistration: string }
}

export async function getProfil(id: number): Promise<ProfilResponse> {
  const { data } = await apiClient.get<ProfilResponse>(`/api/persons/${id}`)
  return data
}

export async function getMyProfil(): Promise<ProfilResponse> {
  const { data } = await apiClient.get<ProfilResponse>(`/api/persons/me`)
  return data
}

export async function updateProfil(
  id: number,
  patch: { firstname?: string; lastname?: string; phone?: string },
): Promise<ProfilResponse> {
  const { data } = await apiClient.patch<ProfilResponse>(`/api/persons/${id}`, patch)
  return data
}

export async function createProfil(
  firstname: string,
  lastname: string,
  phone: string,
): Promise<void> {
  await apiClient.post(`/api/persons`, { firstname, lastname, phone })
}
