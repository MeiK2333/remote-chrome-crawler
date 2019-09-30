import { Queue } from "../src/queue"
import { Task } from "../src/task"

(async () => {
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