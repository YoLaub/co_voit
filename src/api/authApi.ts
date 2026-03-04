import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export interface LoginResponse {
  token: string
  accountId: number
  email: string
  role: string
  hasCompletedProfile: boolean
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await axios.post<LoginResponse>(`${API_URL}/login`, { email, password })
  return data
}

export async function register(
  email: string,
  password: string,
  confirmPassword: string,
): Promise<LoginResponse> {
  const { data } = await axios.post<LoginResponse>(`${API_URL}/register`, {
    email,
    password,
    confirmPassword,
  })
  return data
}
