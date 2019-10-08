import { Queue } from "../src/queue"
import { Task } from "../src/task"

(async () => {
    await Queue.add(new Task('https://httpbin.org/get', { callback: print, timeout: 1000 }))
    await Queue.run()
})()

async function print(task: Task) {
    console.log('crawl start')
    const page = task.page
    await page.goto(task.url)
    await page.waitFor(3000)
    console.error('You should not be here')
}
