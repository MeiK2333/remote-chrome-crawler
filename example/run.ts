import Crawl from '../src/crawler'
import { Task } from '../src/task'
import { BrowserHelper } from '../src/browser_helper'
import { logger } from '../src/logger'
import { asyncSleep } from '../src/helper'

import puppeteer from 'puppeteer'

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            "--no-sandbox",
            "--disable-infobars",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
        ],
        defaultViewport: null,
    })
    await BrowserHelper.addBrowser(browser.wsEndpoint())
    await Crawl.add(new Task('https://httpbin.org/get', { callback: print }))
    await Crawl.run()
    await asyncSleep(3000)
    await browser.close()
})()

async function print(task: Task) {
    const page = await BrowserHelper.getIdleBrowserPage()
    await task.atExit(async () => {
        await page.close()
    })
    await page.goto(task.url)
    const data = await page.evaluate(() => {
        return document.body.innerText
    })
    logger.info(data)
}
