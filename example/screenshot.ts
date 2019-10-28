import { Queue } from "../src/queue"
import { Task } from "../src/task"

(async () => {
    await Queue.add(new Task('http://localhost:1313/', { callback: screenshot }))
    await Queue.add(new Task('http://localhost:1313/', { callback: tn }))
    await Queue.add(new Task('http://localhost:1313/', { callback: mobile }))
    await Queue.run()
})()

async function screenshot(task: Task) {
    const page = task.page
    await page.setViewport({
        width: 1500,
        height: 1000
    })
    await page.goto(task.url)
    await page.screenshot({ fullPage: true, path: 'screenshot.png' })
}

async function tn(task: Task) {
    const page = task.page
    await page.setViewport({
        width: 900,
        height: 600
    })
    await page.goto(task.url)
    await page.screenshot({ fullPage: true, path: 'tn.png' })
}


async function mobile(task: Task) {
    const page = task.page
    await page.setViewport({
        width: 375,
        height: 812
    })
    await page.goto(task.url)
    await page.screenshot({ fullPage: true, path: 'mobile.png' })
}