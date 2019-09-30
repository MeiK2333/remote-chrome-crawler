import { CrawlerQueue } from "../src/queue"
import { Task } from "../src/task"

test('new', () => {
    let queue = new CrawlerQueue()
    expect(queue.started).toBe(false)
    expect(queue.ended).toBe(false)
    expect(queue.pending_node_list.empty()).toBe(true)
})

test('run1', async () => {
    let queue = new CrawlerQueue()
    await queue.run()
    expect(queue.ended).toBe(true)
})

test('run2', async () => {
    let queue = new CrawlerQueue()
    let task = new Task('', {
        callback: async () => {
            expect(queue.started).toBe(true)
            expect(queue.ended).toBe(false)
        }
    })
    await queue.add(task)
    await queue.run()
})
