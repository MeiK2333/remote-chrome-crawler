import { logger } from './logger'
import { Task } from './task'

import { EventEmitter } from "events"
import { CrawlerTaskQueue } from './queue'
import { asyncSleep } from './helper'

interface CrawlerQueueOptions {
    max_tasks?: number
    task_delay?: number
}

export class CrawlerQueue extends EventEmitter {
    pending_queue: CrawlerTaskQueue
    running_queue: CrawlerTaskQueue
    options: CrawlerQueueOptions

    crawler_started: boolean
    crawler_running: boolean
    crawler_ended: boolean

    constructor(options: CrawlerQueueOptions = {}) {
        super()
        this.pending_queue = new CrawlerTaskQueue()
        this.running_queue = new CrawlerTaskQueue()
        this.options = {
            ...{
                max_tasks: Number(process.env.MAX_PAGES) || 8,
                task_delay: Number(process.env.TASK_DELAY) || 0
            },
            ...options
        }
        this.crawler_started = false
        this.crawler_running = false
        this.crawler_ended = false

        this.on('resolved', this._resolved)
        this.on('reject', this._reject)
        this.on('retry', this._retry)
    }

    async _resolved(res) {
        await this._onTaskChange()
        if (this.crawler_running === false) {
            this.emit('onIdle')
        }
    }

    async _reject(err) {
        await this._onTaskChange()
        if (this.crawler_running === false) {
            this.emit('onIdle')
        }
    }

    async _retry() {
        await this._onTaskChange()
        if (this.crawler_running === false) {
            this.emit('onIdle')
        }
    }

    async add(task: Task) {
        logger.debug(`add task ${task.id}: ${task.url} to crawler`)
        this.pending_queue.add(task)
        if (this.crawler_started) {
            await this._onTaskChange()
        }
    }

    async start() {
        this.crawler_started = true
        await this._onTaskChange()
        logger.debug(`crawler started`)
    }

    async waitIdle() {
        if (this.crawler_running === false) {
            return
        }
        return new Promise((resolve, reject) => {
            this.on('onIdle', () => {
                resolve()
            })
        })
    }

    async end() {
        this.crawler_ended = true
        logger.debug(`crawler ended`)
    }

    async run() {
        await this.start()
        await this.waitIdle()
        await this.end()
    }

    async _onTaskChange() {
        if (this.crawler_started === false || this.crawler_ended === true) {
            return
        }
        let pending_count = this.pending_queue.size()
        let running_count = this.running_queue.size()
        if (pending_count === 0 && running_count === 0) {
            this.crawler_running = false
        } else {
            this.crawler_running = true
        }

        while (running_count < this.options.max_tasks && pending_count > 0) {
            const task = this.pending_queue.pop()
            this.running_queue.add(task)
            task.run()
                .then(async res => {
                    if (this.options.task_delay > 0) {
                        await asyncSleep(this.options.task_delay)
                    }
                    this.running_queue.delete(task)
                    logger.debug(`${task.url} done`)
                    this.emit('resolved', res)
                })
                .catch(async err => {
                    this.running_queue.delete(task)
                    logger.error(`${task.url} failure`)
                    console.error(err)

                    if (task.options.retry > 1) {
                        logger.warn(`Task ${task.id}: ${task.url} retry: ${task.options.retry} -> ${task.options.retry - 1}`)
                        task.options.retry--
                        this.pending_queue.add(task)
                        this.emit('retry')
                        return
                    }

                    try {
                        await task.options.failure_callback(task, err)
                    } catch (e) {
                        console.error(e)
                    }
                    this.emit('reject', err)
                })
            pending_count--
            running_count++
        }
    }
}

export default new CrawlerQueue()
