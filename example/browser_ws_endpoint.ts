import { Queue, CrawlerQueue } from "../src/queue"
import { Task } from "../src/task"
import puppeteer from 'puppeteer'

(async () => {
    Queue.createBrowser = async function createBrowser(queue: CrawlerQueue) {
        const browser = puppeteer.connect({
            // /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=$(mktemp -d -t 'chrome-remote_data_dir')
            browserWSEndpoint: 'ws://127.0.0.1:9222/devtools/browser/6598b562-365e-4c7d-9fc8-9568af528761',
        })
        return browser
    }
    Queue.createPage = async function (task: Task) {
        const content = await task.queue.browser.createIncognitoBrowserContext()
        const page = await content.newPage()
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
    // Queue.closeBrowser = async function () { }
    await Queue.add(new Task('https://fingerprintjs.com/demo', { callback: main }))
    await Queue.run()
})()

async function main(task: Task) {
    const page = task.page
    await page.goto(task.url)
    await page.waitFor(100000)
}
