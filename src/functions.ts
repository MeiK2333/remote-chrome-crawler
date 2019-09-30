import puppeteer from 'puppeteer'
import { CrawlerQueue } from './queue'
import { Task } from './task'
import { puppeteerStealth } from './puppeteer-stealth'

export async function createBrowser(queue: CrawlerQueue) {
    queue.browser = await puppeteer.launch({})
    return queue.browser
}

export async function closeBrowser(queue: CrawlerQueue) {
    if (queue.browser) {
        await queue.browser.close()
    }
}

export async function createPage(task: Task) {
    task.page = await task.queue.browser.newPage()
    await puppeteerStealth(task.page)
    return task.page
}

export async function closePage(task: Task) {
    if (task.page) {
        await task.page.close()
    }
}
