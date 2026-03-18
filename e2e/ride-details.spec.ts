import { test, expect } from './fixtures/auth'

test.describe('RideDetails — driver sees passengers', () => {
  test('driver can view passengers and send an email', async ({ driverPage: page }) => {
    await page.goto('/my-trips')

    const firstTrip = page.getByRole('button', { name: /→/ }).first()
    await firstTrip.click()

    await expect(page.getByText(/^Passagers/)).toBeVisible()

    const emailBtn = page.getByLabel(/envoyer un email à/i).first()
    await emailBtn.click()

    await expect(page.getByText('Envoyer un email')).toBeVisible()

    await page.getByLabel(/objet/i).fill('Info covoiturage')

    const editor = page.getByRole('textbox', { name: /corps du message/i })
    await editor.click()
    await editor.type('Bonjour, rendez-vous à 8h.')

    await page.getByRole('button', { name: /^envoyer$/i }).click()

    await expect(page.getByText('Envoyer un email')).not.toBeVisible({ timeout: 5000 })
  })
})
