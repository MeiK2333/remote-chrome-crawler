import { Task } from './task'

import FastPriorityQueue from 'fastpriorityqueue'

export class CrawlerTaskQueue {
    queue: FastPriorityQueue<Task>
    min_priority: number
    count: number
    trim_count: number

    constructor(trim: number = 100) {
        this.queue = new FastPriorityQueue<Task>(function (t1: Task, t2: Task) {
            if (t1.options.priority != t2.options.priority) {
                return t1.options.priority > t2.options.priority
            }
            return t1.id < t2.id
        })
        this.min_priority = 0
        this.count = 0
        this.trim_count = trim
    }

    add(task: Task) {
        if (this.count++ % this.trim_count === 0) this.queue.trim()
        if (task.options.priority !== null) {
            this.min_priority = this.min_priority < task.options.priority ?
                this.min_priority : task.options.priority
            this.queue.add(task)
        } else {
            this.push(task)
        }

    }

    push(task: Task) {
        if (this.count++ % this.trim_count === 0) this.queue.trim()
        this.min_priority--
        task.options.priority = this.min_priority
        this.queue.add(task)
    }

    delete(task: Task): Task {
        if (this.count++ % this.trim_count === 0) this.queue.trim()
        if (this.queue.remove(task)) {
            return task
        }
        return null
    }

    pop(): Task {
        if (this.count++ % this.trim_count === 0) this.queue.trim()
        const task = this.queue.poll()
        if (task) {
            return task
        }
        return null
    }

    empty(): boolean {
        return this.queue.isEmpty()
    }

    size(): number {
        return this.queue.size
    }
}
