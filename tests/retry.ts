import { Queue } from '../src/queue'
import { Task } from '../src/task'

(async () => {
    await Queue.push(new Task('https://www.baidu.com', parse, { retry: 3 }))
    await Queue.run()
})()

async function parse(task: Task) {
    let page = task.page
    await page.goto(task.url)
    await page.waitForSelector('#nonexistent', { timeout: 1000 })
    console.log('Hello World!')
}
