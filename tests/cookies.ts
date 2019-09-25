import { Queue } from '../src/queue'
import { Task } from '../src/task'
import { sleep } from '../src/sleep';

const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            // '--incognito',
        ]
    })
    Queue.browser = browser
    await Queue.push(new Task('https://httpbin.org/get', parse))
    await Queue.run()
})()

async function parse(task: Task) {
    let page = task.page
    await page.goto(task.url)
    await page.goto('https://httpbin.org/cookies/set/key/value')
    console.log(await page.content())
    await Queue.push(new Task('https://httpbin.org/cookies', print))
}

async function print(task: Task) {
    let page = task.page
    await page.goto('https://httpbin.org/cookies');
    console.log(await page.content())
    await sleep(3000)
}
