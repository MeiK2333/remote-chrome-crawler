import { Crawler } from '../src/crawler'
import { Task } from '../src/task'
import { BrowserHelper } from '../src/browser_helper'
import { logger } from '../src/logger'
import { asyncSleep } from '../src/helper'


(async () => {
    await BrowserHelper.addBrowser('ws://127.0.0.1:5678/1')
    await BrowserHelper.addBrowser('ws://127.0.0.1:5678/2')
    await BrowserHelper.addBrowser('ws://127.0.0.1:5678/3')
    await BrowserHelper.addBrowser('ws://127.0.0.1:5678/4')
    for (let i = 0; i < 100; i++) {
        await Crawler.add(new Task('https://httpbin.org/get', { callback: print }))
    }
    await Crawler.run()
    await BrowserHelper.disconnect()
})()

async function print(task: Task) {
    const page = await BrowserHelper.getIdleBrowserPage(task)
    await page.goto(task.url)
    const data = await page.evaluate(() => {
        return document.body.innerText
    })
    logger.info(data)
}
