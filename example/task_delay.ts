import { Queue } from "../src/queue"
import { Task } from "../src/task"
import { logger } from "../src/logger"

(async () => {
    Queue.task_delay = 3000
    Queue.max_pages = 2
    await Queue.add(new Task('https://httpbin.org/get', { callback: print }))
    await Queue.add(new Task('https://httpbin.org/get', { callback: print }))
    await Queue.add(new Task('https://httpbin.org/get', { callback: print }))
    await Queue.add(new Task('https://httpbin.org/get', { callback: print }))
    await Queue.add(new Task('https://httpbin.org/get', { callback: print }))
    await Queue.run()
})()

async function print(task: Task) {
    logger.info('Hello World!')
}
