import { Page } from 'puppeteer'

export async function navigatorLanguage(page: Page, languages: String[] = ['en-US', 'en']) {
    await page.evaluateOnNewDocument((languages) => {
        // Overwrite the `plugins` property to use a custom getter.
        Object.defineProperty(navigator, 'languages', {
            get: () => languages
        })
    },
        //@ts-ignore
        languages)
}