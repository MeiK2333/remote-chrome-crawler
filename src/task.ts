import { promiseTimeout } from './helper'
import { logger } from './logger'

export enum TaskStatus {
    PENDING,
    RUNNING,
    SUCCESS,
    FAILURE,
}

export interface TaskOptions {
    callback?: (task: Task) => Promise<any>
    failure_callback?: (task: Task, err: Error) => Promise<void>
    finally_callback?: (task: Task) => Promise<void>
    exit_callback?: Array<(task: Task) => Promise<void>>
    retry?: number
    timeout?: number
    meta?: Object
    priority?: number
}

let task_count = 0

export class Task {
    __id__: number
    url: string
    options: TaskOptions
    status: TaskStatus

    constructor(url: string, options: TaskOptions = {}) {
        this.options = {
            ...{
                callback: this.defaultCallback,
                failure_callback: this.defaultFailureCallback,
                finally_callback: this.defaultFinallyCallback,
                exit_callback: [],
                retry: 0,
                meta: {}
            },
            ...options
        }
        this.__id__ = task_count
        task_count++
        this.url = url
        this.status = TaskStatus.PENDING
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
            if (this.options.retry === 0) {
                await this.options.failure_callback(this, err)
            }
            throw err
        } finally {
            try {
                await this.options.finally_callback(this)
            } catch (e) {
                logger.error(`${this.url} finally callback failure!`)
                console.error(e)
            }
            for (let i = 0; i < this.options.exit_callback.length; i++) {
                const func = this.options.exit_callback[i]
                try {
                    await func(this)
                } catch (err) {
                    logger.error(`${this.url} exit callback ${i} failure!`)
                    console.error(err)
                }
            }
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
    async defaultFinallyCallback(task: Task): Promise<void> {
        logger.debug('Here is the default finally callback function, you may need to override it')
    }

    async atExit(func: (task: Task) => Promise<void>) {
        this.options.exit_callback.push(func)
    }
}
