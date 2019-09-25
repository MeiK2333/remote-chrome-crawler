import { Page } from 'puppeteer'

export async function consoleDebug(page: Page) {
    await page.evaluateOnNewDocument(() => {
        window.console.debug = () => {
            return null
        }
    })
}