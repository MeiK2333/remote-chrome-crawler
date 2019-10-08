import { Queue } from "../src/queue"
import { Task } from "../src/task"

(async () => {
    await Queue.add(new Task('https://httpbin.org/get', { callback: print, meta: { 'Hello': 'World' } }))
    await Queue.run()
})()

async function print(task: Task) {
    const meta = task.options.meta
    if (meta['Hello'] === 'World') {
        console.log('Set meta success')
    }
}
