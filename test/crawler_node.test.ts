import { CrawlerNode } from '../src/queue'
import { Task } from '../src/task'

test('new', () => {
    let node = new CrawlerNode(null)
    expect(node.task).toBe(null)
    expect(node.prev).toBe(null)
    expect(node.next).toBe(null)
})

test('Task', () => {
    let task = new Task('https://httpbin.org/get')
    let node = new CrawlerNode(task)

    expect(node.task).toBe(task)
    expect(node.task.id).toBe(task.id)
    const url = 'https://httpbin.org/post'
    task.url = url
    expect(node.task.url).toBe(url)
})