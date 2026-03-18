import '@testing-library/jest-dom/vitest'
import { server } from './mocks/server'
import { useAuthStore } from '../store/authStore'

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))

afterEach(() => {
  server.resetHandlers()
  useAuthStore.setState({ token: null, user: null })
  localStorage.clear()
})

afterAll(() => server.close())
