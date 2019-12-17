import { Task } from './task'

import FastPriorityQueue from 'fastpriorityqueue'

export class CrawlerTaskQueue {
    queue: FastPriorityQueue<Task>
    min_priority: number

    constructor() {
        this.queue = new FastPriorityQueue<Task>(function (t1: Task, t2: Task) {
            return true
        })
    }
}