import { Queue } from "../src/queue"
import { Task } from "../src/task"

(async () => {
    await Queue.add(new Task('https://httpbin.org/get', { callback: print, retry: 2 }))
    await Queue.run()
})()

async function print(task: Task) {
    console.log('Hello World!')
    let s = {}
    console.log(s['hello']['world'])
}
