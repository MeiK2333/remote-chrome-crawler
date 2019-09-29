import { logger } from './logger'

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
}

let task_count = 0

export class Task {
    __id__: number
    url: string
    status: TaskStatus
    options: TaskOptions

    constructor(url: string, options: TaskOptions = {}) {
        this.options = {
            ...{
                callback: this._callback,
                error_callback: this._error_callback,
                retry: 0
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

    async onRetry() {
        this.status = TaskStatus.PENDING
    }

    async run() {
        let result;
        this.status = TaskStatus.RUNNING
        try {
            result = await this.options.callback(this)
        } catch (err) {
            this.status = TaskStatus.FAILURE
            await this.options.error_callback(err)
            throw err
        } finally {

        }
        this.status = TaskStatus.SUCCESS
        return result
    }

    async _callback() {
    }

    async _error_callback(err) {
    }
}
