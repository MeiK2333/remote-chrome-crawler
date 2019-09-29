import { Task } from "../src/task"

test('new', () => {
    let url = 'https://httpbin.org/get'
    let task = new Task(url)
    expect(task.url).toBe(url)
    url = 'https://httpbin.org/post'
    task.url = url
    expect(task.url).toBe(url)

    expect(() => { task.id = 1 }).toThrow(Error)
})
