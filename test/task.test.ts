import { Task } from '../src/task'
import { asyncSleep } from '../src/helper'

test('callback', async () => {
    let result = false
    const task = new Task('https://httpbin.org/get', {
        callback: async (task: Task) => { result = true }
    })
    expect(result).toBe(false)
    await task.run()
    expect(result).toBe(true)
})

test('failure_callback', async () => {
    let result = false
    const task = new Task('https://httpbin.org/get', {
        callback: async (task: Task) => { throw new Error("Hello World!") },
        failure_callback: async (task: Task, err: Error) => { result = true }
    })
    expect(result).toBe(false)
    let error
    try {
        await task.run()
    } catch (e) {
        error = e
    }
    expect(error).toEqual(new Error("Hello World!"))
    expect(result).toBe(true)
})

test('timeout', async () => {
    const task = new Task('https://httpbin.org/get', {
        callback: async () => { await asyncSleep(10000) },
        timeout: 500
    })
    const date = new Date()
    try {
        await task.run()
    } catch (e) {
    }

    expect(new Date().getTime() - date.getTime() >= 500).toBe(true)
    expect(new Date().getTime() - date.getTime() < 1000).toBe(true)
})
