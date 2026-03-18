import { type ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import type { AuthUser } from '../../store/authStore'

interface ProviderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
  routePath?: string
  authState?: { token: string; user: AuthUser }
}

export function renderWithProviders(
  ui: ReactElement,
  {
    initialEntries = ['/'],
    routePath,
    authState,
    ...renderOptions
  }: ProviderOptions = {},
) {
  if (authState) {
    useAuthStore.setState(authState)
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          {routePath ? (
            <Routes>
              <Route path={routePath} element={children} />
            </Routes>
          ) : (
            children
          )}
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  }
}
