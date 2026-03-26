import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server'
import { renderWithProviders } from '../helpers/renderWithProviders'
import EmailModal from '../../components/ui/EmailModal'

const defaultProps = {
  tripId: 1,
  recipientProfilId: 2,
  recipientName: 'Marie Martin',
  onClose: vi.fn(),
}

function renderModal(overrides: Partial<typeof defaultProps> = {}) {
  return renderWithProviders(<EmailModal {...defaultProps} {...overrides} />)
}

describe('EmailModal', () => {
  beforeEach(() => {
    defaultProps.onClose = vi.fn()
  })

  it('displays the recipient name as read-only', () => {
    renderModal()
    expect(screen.getByText('Marie Martin')).toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: /destinataire/i })).not.toBeInTheDocument()
  })

  it('disables send button when subject is empty', () => {
    renderModal()
    const sendBtn = screen.getByRole('button', { name: /envoyer/i })
    expect(sendBtn).toBeDisabled()
  })

  it('enables send button when subject is filled', async () => {
    renderModal()
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/objet/i), 'Mon sujet')
    expect(screen.getByRole('button', { name: /envoyer/i })).toBeEnabled()
  })

  it('sends email with correct payload on submit', async () => {
    let capturedBody: Record<string, unknown> | null = null
    server.use(
      http.post('*/api/trips/:id/contact', async ({ request }) => {
        capturedBody = (await request.json()) as Record<string, unknown>
        return HttpResponse.json(null, { status: 200 })
      }),
    )
    renderModal()
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/objet/i), 'Info trajet')
    const editor = screen.getByRole('textbox', { name: /corps du message/i })
    editor.innerHTML = '<p>Bonjour</p>'
    await user.click(screen.getByRole('button', { name: /envoyer/i }))
    await waitFor(() => {
      expect(capturedBody).not.toBeNull()
    })
    expect(capturedBody).toMatchObject({
      recipientProfilId: 2,
      subject: 'Info trajet',
      htmlContent: '<p>Bonjour</p>',
    })
  })

  it('shows success toast then calls onClose after delay', async () => {
    renderModal()
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/objet/i), 'Sujet')
    await user.click(screen.getByRole('button', { name: /envoyer/i }))
    await waitFor(() => {
      expect(screen.getByText(/email envoyé avec succès/i)).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalled()
    }, { timeout: 3000 })
  })

  it('shows error message on API failure',{ timeout: 3000 }, async () => {
    server.use(
      http.post('*/api/trips/:id/contact', () => {
        return HttpResponse.json(
          { message: 'Erreur serveur' },
          { status: 500 },
        )
      }),
    )
    renderModal()
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/objet/i), 'Test')
    await user.click(screen.getByRole('button', { name: /envoyer/i }))
    await waitFor(() => {
      expect(screen.getByText(/erreur/i)).toBeInTheDocument()
    })
    expect(defaultProps.onClose).not.toHaveBeenCalled()
  }, { timeout: 3000 });

  it('closes modal when cancel button is clicked', async () => {
    renderModal()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /annuler/i }))
    expect(defaultProps.onClose).toHaveBeenCalled()
  })
})
