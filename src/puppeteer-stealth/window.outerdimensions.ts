import { Page } from 'puppeteer'

export async function windowOuterdimensions(page: Page) {
    // Chrome returns undefined, Firefox false
    await page.evaluateOnNewDocument(() => {
        try {
            if (window.outerWidth && window.outerHeight) {
                return // nothing to do here
            }
            const windowFrame = 85 // probably OS and WM dependent
            //@ts-ignore
            window.outerWidth = window.innerWidth
            //@ts-ignore
            window.outerHeight = window.innerHeight + windowFrame
        } catch (err) { }
    })
}