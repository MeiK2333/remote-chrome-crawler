import { Task } from '../src/task'

test('callback', async () => {
    let result = false
    const task = new Task('https://httpbin.org/get', {
        callback: async (task: Task) => { result = true }
    })
    expect(result).toEqual(false)
    await task.run()
    expect(result).toEqual(true)
})

test('failure_callback', async () => {
    let result = false
    const task = new Task('https://httpbin.org/get', {
        callback: async (task: Task) => { throw new Error("Hello World!") },
        failure_callback: async (task: Task, err: Error) => { result = true }
    })
    expect(result).toEqual(false)
    let error
    try {
        await task.run()
    } catch (e) {
        error = e
    }
    expect(error).toEqual(new Error("Hello World!"))
    expect(result).toEqual(true)
})

test('finally_callback', async () => {
    let result = false
    const task = new Task('https://httpbin.org/get', {
        callback: async (task: Task) => { throw new Error("Hello World!") },
        finally_callback: async (task: Task) => { result = true }
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
    const task2 = new Task('https://httpbin.org/get', {
        callback: async (task: Task) => { },
        finally_callback: async (task: Task) => { result = false }
    })
    await task2.run()
    expect(result).toEqual(false)
    const task3 = new Task('https://httpbin.org/get', {
        callback: async (task: Task) => { task.options.meta['Hello'] = 'World' },
        finally_callback: async (task: Task) => { result = task.options.meta['Hello'] }
    })
    await task3.run()
    expect(result).toEqual('World')
})

test('at_exit', async () => {
    let result = false
    const task = new Task('https://httpbin.org/get', {
        callback: async (task: Task) => { throw new Error("Hello World!") },
    })
    await task.atExit(async () => {
        result = true
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
    const task2 = new Task('https://httpbin.org/get', {
        callback: async (task: Task) => { 
            await task.atExit(async () => {
                result = false
            })
        },
    })
    await task2.run()
    expect(result).toEqual(false)
})
