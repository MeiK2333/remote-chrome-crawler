import { Queue, CrawlerQueue } from "../src/queue"
import { Task } from "../src/task"
import puppeteer from 'puppeteer'

(async () => {
    Queue.createBrowser = async function createBrowser(queue: CrawlerQueue) {
        const browser = puppeteer.launch({
            headless: false
        })
        return browser
    }
    await Queue.add(new Task('https://httpbin.org/get', { callback: print }))
    await Queue.run()
})()

async function print(task: Task) {
    const page = task.page
    await page.goto(task.url)
    await page.waitFor(1000)
    let data = await page.evaluate(() => {
        return document.body.innerText
    })
    data = JSON.parse(data)
    console.log(data)
}
