import { test, expect } from './fixtures/auth'

test.describe('Reservation — passenger books a trip', () => {
  test('passenger can reserve a trip', async ({ passengerPage: page }) => {
    await page.goto('/search')

    const firstTrip = page.locator('[class*="rounded-xl"]').filter({ hasText: /place/ }).first()
    await firstTrip.click()

    await expect(page.getByText('Détails trajet')).toBeVisible()

    await expect(page.getByText(/^Passagers/)).not.toBeVisible()

    const reserveBtn = page.getByRole('button', { name: /réserver/i })
    await expect(reserveBtn).toBeVisible()
    await reserveBtn.click()

    await expect(page.getByText(/réservation confirmée/i)).toBeVisible({ timeout: 5000 })
  })
})
