import { test as base, type Page } from '@playwright/test'

interface AuthFixtures {
  driverPage: Page
  passengerPage: Page
}

async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Mot de passe').fill(password)
  await page.getByRole('button', { name: /se connecter/i }).click()
  await page.waitForURL('/')
}

export const test = base.extend<AuthFixtures>({
  driverPage: async ({ page }, use) => {
    await loginAs(page, 'driver-e2e@test.com', 'password123')
    await use(page)
  },
  passengerPage: async ({ browser }, use) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    await loginAs(page, 'passenger-e2e@test.com', 'password123')
    await use(page)
    await context.close()
  },
})

export { expect } from '@playwright/test'
