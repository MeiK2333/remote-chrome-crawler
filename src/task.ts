import { Page } from 'puppeteer'
import { Queue } from './queue'
import log from 'loglevel'
import { puppeteerStealth } from './puppeteer-stealth'

export enum TaskStatus {
    PENDING,
    RUNNING,
    SUCCESS,
    FAILURE,
}

export interface TaskOptions {
    error_callback?: CallableFunction
    meta?: Object
    retry?: number
}

export class Task {
    url: string
    status: TaskStatus
    crawl_callback: CallableFunction
    error_callback: CallableFunction
    meta: Object
    page: Page
    retry: number
    options: TaskOptions

    constructor(url: string, crawl_callback: CallableFunction, options: TaskOptions = {}) {
        this.options = {
            ...{
                error_callback: this.error,
                meta: {},
                retry: Number(process.env.DEFAULT_TASK_RETRY) | 0
            },
            ...options
        }

        this.url = url
        this.crawl_callback = crawl_callback
        this.error_callback = this.options.error_callback
        this.status = TaskStatus.PENDING
        this.meta = this.options.meta
        this.retry = this.options.retry
        //@ts-ignore
        this.page = null
    }

    async crawl() {
        this.status = TaskStatus.RUNNING
        let content = await Queue.browser.createIncognitoBrowserContext()
        // this.page = await content.newPage()
        this.page = await Queue.browser.newPage()
        await puppeteerStealth(this.page)
        let result;
        try {
            result = await this.crawl_callback(this)
        } catch (e) {
            await this.error_callback(e)
        } finally {
            await this.page.close()
            await content.close()
        }
        return result
    }

    async error(e: Error) {
        console.error(e)
        throw e
    }
}
