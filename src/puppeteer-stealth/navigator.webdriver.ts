import { Page } from 'puppeteer'

export async function navigatorWebdriver(page: Page) {
    // Chrome returns undefined, Firefox false
    await page.evaluateOnNewDocument(() => {
        //@ts-ignore
        const newProto = navigator.__proto__
        delete newProto.webdriver
        //@ts-ignore
        navigator.__proto__ = newProto
    })
}