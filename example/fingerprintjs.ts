/**
 * 无法通过验证
 */
import { Queue, CrawlerQueue } from "../src/queue"
import { Task } from "../src/task"
import { puppeteerStealth } from "../src/puppeteer-stealth"
import puppeteer from 'puppeteer'

(async () => {
    Queue.createBrowser = async function createBrowser(queue: CrawlerQueue) {
        const browser = puppeteer.launch({
            headless: false
        })
        return browser
    }
    Queue.createPage = async function (task: Task) {
        const content = await task.queue.browser.createIncognitoBrowserContext()
        const page = await content.newPage()
        // await page.setViewport({
        //     width: 1920,
        //     height: 1080
        // })
        await puppeteerStealth(page)
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36")
        return page
    }
    Queue.closePage = async function (task: Task) {
        if (task.page) {
            await task.page.close()
        }
        const content = task.page.browserContext()
        if (content) {
            await content.close()
        }
    }
    await Queue.add(new Task('https://fingerprintjs.com/demo', { callback: main }))
    await Queue.run()
})()

async function main(task: Task) {
    const page = task.page
    await page.goto(task.url)
    await page.waitFor(100000)
}
