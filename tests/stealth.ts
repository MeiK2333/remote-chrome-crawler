import { Queue } from '../src/queue'
import { Task } from '../src/task'
import { sleep } from '../src/sleep'

(async () => {
    await Queue.push(new Task('https://bot.sannysoft.com/', parse))
    await Queue.run()
})()

async function parse(task: Task) {
    let page = task.page
    await page.goto(task.url)
    await page.waitFor(5000)
    await page.screenshot({ path: 'test.png', fullPage: true })
    await sleep(10000)
}
