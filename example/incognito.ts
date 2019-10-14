import { Queue } from "../src/queue"
import { Task } from "../src/task"
import { puppeteerStealth } from "../src/puppeteer-stealth"

(async () => {
    Queue.createPage = async function (task: Task) {
        const content = await task.queue.browser.createIncognitoBrowserContext()
        task.page = await content.newPage()
        await puppeteerStealth(task.page)
        return task.page
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
    await Queue.add(new Task('https://httpbin.org/cookies/set/key/value', { callback: cookies1 }))
    await Queue.add(new Task('https://httpbin.org/cookies/set/key/value', { callback: cookies1 }))
    await Queue.run()
})()

async function cookies1(task: Task) {
    const page = task.page
    await page.goto(task.url)
    await page.waitFor(1000)
    let data = await page.evaluate(() => {
        return document.body.innerText
    })
    data = JSON.parse(data)
    if (data['cookies']['key'] === 'value') {
        console.log('Set cookies')
        await Queue.add(new Task('https://httpbin.org/cookies', { callback: cookies2 }))
    }
}

async function cookies2(task: Task) {
    const page = task.page
    await page.goto(task.url)
    await page.waitFor(1000)
    let data = await page.evaluate(() => {
        return document.body.innerText
    })
    data = JSON.parse(data)
    if (data['cookies']['key'] !== 'value') {
        console.log('Incognito success!')
    }
}