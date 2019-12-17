import { Task } from '../src/task'

test('task_callback', async () => {
    let result = false
    const task = new Task('https://httpbin.org/get', {
        callback: async (task: Task) => { result = true }
    })
    expect(result).toBe(false)
    await task.run()
    expect(result).toBe(true)
})

test('task_failure_callback', async () => {
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
