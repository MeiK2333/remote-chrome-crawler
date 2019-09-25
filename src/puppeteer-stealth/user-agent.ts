import { Page } from 'puppeteer'

export async function userAgent(page: Page, windows: boolean = false) {
    let ua = await page.browser().userAgent()
    if (ua.indexOf('HeadlessChrome/') !== -1) {
        ua = ua.replace('HeadlessChrome/', 'Chrome/')
    }
    if (windows) {
        ua = ua.replace(/\(([^)]+)\)/, '(Windows NT 10.0; Win64; x64)')
    }
    await page.setUserAgent(ua)
}