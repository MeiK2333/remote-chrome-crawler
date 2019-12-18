import { CrawlerQueue } from '../src/crawler'
import { Task } from '../src/task'
import { asyncSleep } from '../src/helper'

test('run', async () => {
    const Crawler = new CrawlerQueue()
    let url = ''
    const task = new Task('https://httpbin.org/get', {
        callback: async (task: Task) => {
            url = task.url
        }
    })
    await Crawler.add(task)
    await Crawler.run()
    expect(url).toEqual('https://httpbin.org/get')
})

test('task_manage', async () => {
    const Crawler = new CrawlerQueue()
    let count = 0
    const func = async () => { count++ }
    const task1 = new Task('1', { callback: func })
    const task2 = new Task('2', { callback: func })
    const task3 = new Task('3', { callback: func })
    const task4 = new Task('4', { callback: func })
    await Crawler.add(task1)
    await Crawler.start()
    await Crawler.add(task2)
    await Crawler.waitIdle()
    expect(count).toEqual(2)
    await Crawler.add(task3)
    await Crawler.waitIdle()
    expect(count).toEqual(3)
    await Crawler.end()
    await Crawler.add(task4)
    await Crawler.waitIdle()
    expect(count).toEqual(3)
})

test('failure_retry', async () => {
    const Crawler = new CrawlerQueue()
    let count = 0
    const task = new Task('https://httpbin.org/get', {
        callback: async () => {
            count++
            throw new Error('Hello World!')
        },
        retry: 3
    })
    await Crawler.add(task)
    await Crawler.run()
    expect(count).toEqual(3)
})

test('failure_callback', async () => {
    const Crawler = new CrawlerQueue()
    let count = 0
    const task = new Task('https://httpbin.org/get', {
        callback: async () => {
            throw new Error('Hello World!')
        },
        failure_callback: async (task: Task, err: Error) => {
            expect(err).toEqual(new Error("Hello World!"))
            count++
        },
        retry: 3
    })
    await Crawler.add(task)
    await Crawler.run()
    expect(count).toEqual(1)
})

test('task_complicating', async () => {
    const Crawler = new CrawlerQueue({ max_tasks: 8 })
    for (let i = 0; i < 8; i++) {
        await Crawler.add(new Task(`${i}`, { callback: async () => { await asyncSleep(1000) } }))
    }
    const date = new Date()
    await Crawler.run()
    expect(new Date().getTime() - date.getTime() >= 1000).toBe(true)
    expect(new Date().getTime() - date.getTime() < 1500).toBe(true)
})

test('task_order', async () => {
    const Crawler = new CrawlerQueue({ max_tasks: 7 })
    for (let i = 0; i < 8; i++) {
        await Crawler.add(new Task(`${i}`, { callback: async () => { await asyncSleep(1000) } }))
    }
    const date = new Date()
    await Crawler.run()
    expect(new Date().getTime() - date.getTime() >= 2000).toBe(true)
    expect(new Date().getTime() - date.getTime() < 2500).toBe(true)
})
