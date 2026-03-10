import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_URL = import.meta.env.VITE_API_URL ?? 'https://covoit-api.john-world.store'

function authHeaders() {
  const token = useAuthStore.getState().token
  return { Authorization: `Bearer ${token}` }
}

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
  const { data } = await axios.get<ProfilResponse>(`${API_URL}/api/persons/${id}`, {
    headers: authHeaders(),
  })
  return data
}

export async function getMyProfil(): Promise<ProfilResponse> {
  const { data } = await axios.get<ProfilResponse>(`${API_URL}/api/persons/me`, {
    headers: authHeaders(),
  })
  return data
}

export async function updateProfil(
  id: number,
  patch: { firstname?: string; lastname?: string; phone?: string },
): Promise<ProfilResponse> {
  const { data } = await axios.patch<ProfilResponse>(`${API_URL}/api/persons/${id}`, patch, {
    headers: authHeaders(),
  })
  return data
}

export async function createProfil(
  firstname: string,
  lastname: string,
  phone: string,
): Promise<void> {
  await axios.post(
    `${API_URL}/api/persons`,
    { firstname, lastname, phone },
    { headers: authHeaders() },
  )
}
