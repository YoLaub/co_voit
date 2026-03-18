import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server'
import { renderWithProviders } from '../helpers/renderWithProviders'
import { mockDriver, mockPassengers } from '../mocks/handlers'
import RideDetails from '../../pages/RideDetails'

const driverAuth = {
  token: 'fake-token',
  user: {
    accountId: 1,
    email: mockDriver.email,
    role: 'USER',
    hasCompletedProfile: true,
  },
}

const passengerAuth = {
  token: 'fake-token',
  user: {
    accountId: 10,
    email: 'other@test.com',
    role: 'USER',
    hasCompletedProfile: true,
  },
}

function renderRideDetails(authState = driverAuth) {
  return renderWithProviders(<RideDetails />, {
    initialEntries: ['/trips/1'],
    routePath: '/trips/:id',
    authState,
  })
}

describe('RideDetails — driver view', () => {
  it('shows passengers section with names', async () => {
    renderRideDetails(driverAuth)
    await waitFor(() => {
      expect(screen.getByText('Marie Martin')).toBeInTheDocument()
    })
    // The heading "Passagers (2)" may be split across text nodes
    expect(screen.getByText(/Passagers/)).toBeInTheDocument()
    expect(screen.getByText('Pierre Durand')).toBeInTheDocument()
  })

  it('shows empty state when no passengers', async () => {
    server.use(
      http.get('*/api/trips/:id/person', () => {
        return HttpResponse.json([])
      }),
    )
    renderRideDetails(driverAuth)
    await waitFor(() => {
      expect(screen.getByText(/aucun passager pour le moment/i)).toBeInTheDocument()
    })
  })

  it('shows phone link for each passenger', async () => {
    renderRideDetails(driverAuth)
    await waitFor(() => {
      expect(screen.getByText('Marie Martin')).toBeInTheDocument()
    })
    const phoneLinks = screen.getAllByRole('link', { name: /appeler/i })
    // Filter to only visible ones (passenger phone links in driver view)
    const visiblePhoneLinks = phoneLinks.filter((el) => !el.hidden)
    expect(visiblePhoneLinks).toHaveLength(2)
    expect(visiblePhoneLinks[0]).toHaveAttribute('href', `tel:${mockPassengers[0].phone}`)
  })

  it('opens EmailModal when email button is clicked', async () => {
    renderRideDetails(driverAuth)
    const user = userEvent.setup()
    await waitFor(() => {
      expect(screen.getByText('Marie Martin')).toBeInTheDocument()
    })
    const emailBtns = screen.getAllByLabelText(/envoyer un email à/i)
    await user.click(emailBtns[0])
    expect(screen.getByText('Envoyer un email')).toBeInTheDocument()
  })
})

describe('RideDetails — passenger view', () => {
  it('does not show passengers section', async () => {
    renderRideDetails(passengerAuth)
    await waitFor(() => {
      expect(screen.getByText('Détails trajet')).toBeInTheDocument()
    })
    expect(screen.queryByText(/^Passagers/)).not.toBeInTheDocument()
  })

  it('shows reserve button when seats available', async () => {
    renderRideDetails(passengerAuth)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /réserver/i })).toBeVisible()
    })
  })
})
