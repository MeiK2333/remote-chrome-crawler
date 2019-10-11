import { logger } from './logger'
import { Page } from 'puppeteer'
import { CrawlerQueue } from './queue'

export enum TaskStatus {
    PENDING,
    RUNNING,
    SUCCESS,
    FAILURE,
}

export interface TaskOptions {
    callback?: CallableFunction
    error_callback?: CallableFunction
    retry?: number
    timeout?: number
    meta?: Object
    level?: number
}

let task_count = 0

export class Task {
    __id__: number
    url: string
    status: TaskStatus
    options: TaskOptions
    queue: CrawlerQueue
    page: Page
    prev: Task
    next: Task

    constructor(url: string, options: TaskOptions = {}) {
        this.options = {
            ...{
                callback: this._callback,
                error_callback: this._error_callback,
                retry: 0,
                timeout: -1
            },
            ...options
        }
        this.__id__ = task_count
        task_count++
        this.url = url
        this.status = TaskStatus.PENDING
        this.queue = null
        this.page = null
        this.prev = null
        this.next = null
    }

    get id(): number { return this.__id__ }

    set id(v) { throw new Error('Task id property is read only') }

    async onRetry() {
        this.status = TaskStatus.PENDING
    }

    _promiseTimeout(ms: number, promise) {
        return new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error("Task Timeout")), ms);
            promise.then(resolve).catch(reject);
        });
    }

    async run() {
        let result;
        this.status = TaskStatus.RUNNING
        try {
            this.page = await this.queue.createPage(this)
            if (this.options.timeout > 0) {
                result = await this._promiseTimeout(this.options.timeout, this.options.callback(this))
            } else {
                result = await this.options.callback(this)
            }
        } catch (err) {
            this.status = TaskStatus.FAILURE
            await this.options.error_callback(err)
            throw err
        } finally {
            await this.queue.closePage(this)
        }
        this.status = TaskStatus.SUCCESS
        return result
    }

    async _callback() {
    }

    async _error_callback(err) {
    }
}
