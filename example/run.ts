import { Queue } from "../src/queue"
import { Task } from "../src/task"

(async () => {
    await Queue.add(new Task('https://httpbin.org', { callback: print }))
    await Queue.run()
})()

async function print(task: Task) {
    console.log(task.url)
}