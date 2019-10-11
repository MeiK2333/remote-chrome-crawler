import { Queue } from "../src/queue"
import { Task } from "../src/task"
import { sleep } from "../src/sleep"

(async () => {
    Queue.max_pages = 2
    for (let i = 30; i > 0; i--) {
        await Queue.add(new Task('https://httpbin.org/get', { callback: priority, level: i }))
    }
    await Queue.run()
})()

async function priority(task: Task) {
    console.log(task.options.level)
    await sleep(50)
}
