import { promiseTimeout } from './helper'
import { logger } from './logger'

import { Page, Browser } from 'puppeteer'

export enum TaskStatus {
    PENDING,
    RUNNING,
    SUCCESS,
    FAILURE,
}

export interface TaskOptions {
    callback?: (task: Task) => Promise<any>
    failure_callback?: (task: Task, err: Error) => Promise<void>
    retry?: number
    timeout?: number
    meta?: Object
    priority?: number
}

let task_count = 0

export class Task {
    __id__: number
    options: TaskOptions
    status: TaskStatus
    page: Page
    browser: Browser

    constructor(url: string, options: TaskOptions = {}) {
        this.options = {
            ...{
                callback: this.defaultCallback,
                failure_callback: this.defaultFailureCallback,
            },
            ...options
        }
        this.__id__ = task_count
        task_count++
        this.status = TaskStatus.PENDING
        this.page = null
        this.browser = null
    }

    get id(): number { return this.__id__ }
    set id(v) { throw new Error('Task id property is read only') }

    async run(): Promise<any> {
        let result: any
        this.status = TaskStatus.PENDING
        try {
            if (this.options.timeout) {
                result = await promiseTimeout(this.options.timeout, this.options.callback(this))
            } else {
                result = await this.options.callback(this)
            }
        } catch (err) {
            this.status = TaskStatus.FAILURE
            if (this.options.retry === undefined || this.options.retry === 0) {
                await this.options.failure_callback(this, err)
            }
            throw err
        } finally {

        }
        this.status = TaskStatus.SUCCESS
        return result
    }

    async defaultCallback(task: Task): Promise<any> {
        logger.debug('Here is the default callback function, you may need to override it')
    }
    async defaultFailureCallback(task: Task, err: Error): Promise<void> {
        logger.debug('Here is the default failure callback function, you may need to override it')
    }
}
