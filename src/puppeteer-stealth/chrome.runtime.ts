import { Page } from "puppeteer"

export async function chromeRuntime(page: Page) {
    await page.evaluateOnNewDocument(() => {
        //@ts-ignore
        window.chrome = {
            runtime: {}
        }
    })
}