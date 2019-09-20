import { Task, TaskStatus } from './task'
import { Browser } from 'puppeteer'
import { sleep } from './sleep'

import log from 'loglevel'
import puppeteer from 'puppeteer-extra'
import pluginStealth from 'puppeteer-extra-plugin-stealth'
import EventEmitter from 'events'

puppeteer.use(pluginStealth());

class CrawlerQueue extends EventEmitter {
    _queue: Array<Task>
    browser: Browser
    started: boolean
    ended: boolean
    max_pages: number

    constructor() {
        super();
        this._queue = []
        //@ts-ignore
        this.browser = null
        this.started = false
        this.ended = false
        this.max_pages = Number(process.env.pages) || 8
    }

    async push(item: Task) {
        this._queue.push(item);
        if (this.started) {
            await this.onTaskChange()
        }
    }

    pop(): Task | undefined {
        return this._queue.shift()
    }

    empty(): boolean {
        return this._queue.length === 0
    }

    removeEnded() {
        for (let i = 0; i < this._queue.length; i++) {
            if (this._queue[i].status === TaskStatus.SUCCESS || this._queue[i].status === TaskStatus.FAILURE) {
                this._queue.splice(i, 1);
                return this.removeEnded()
            }
        }
    }

    async onTaskChange() {
        this.removeEnded()
        let running = 0;
        let pending = 0;
        this._queue.map((task, index, array) => {
            if (task.status === TaskStatus.RUNNING) {
                running += 1
            } else if (task.status === TaskStatus.PENDING) {
                pending += 1
            }
        })

        if (pending !== 0) {
            for (let i = 0; i < this._queue.length && running < this.max_pages; i++) {
                let task = this._queue[i];
                if (task.status === TaskStatus.PENDING) {
                    log.debug(task.url);
                    task.crawl()
                        .then(async res => {
                            task.status = TaskStatus.SUCCESS
                            log.debug(task.url, 'success')
                            this.emit('resolved', res)
                        })
                        .catch(async e => {
                            task.status = TaskStatus.FAILURE
                            log.warn(task.url, 'failure')
                            this.emit('reject', e)

                            if (task.retry > 0) {
                                console.log(`${task.url} retry: ${task.retry} -> ${task.retry - 1}`)
                                let t = new Task(
                                    task.url,
                                    task.crawl_callback,
                                    task.options
                                )
                                t.retry = task.retry - 1
                                await this.push(t)
                            }
                        })
                    running += 1
                }
            }
        }
        if (running === 0 && pending === 0) {
            this.ended = true
        }
    }

    async start() {
        this.started = true
        this.onTaskChange()
    }

    async end() {
        this.ended = true
        if (this.browser) {
            await this.browser.close()
        }
    }

    async run() {
        if (this.browser === null) {
            this.browser = await puppeteer.launch({
                headless: false
            })
        }
        await this.start()
        while (true) {
            await sleep(100)
            if (this.ended) {
                await this.end()
                return
            }
        }
    }
}

export const Queue: CrawlerQueue = new CrawlerQueue()

Queue.on('resolved', async function resolved(res) {
    await Queue.onTaskChange()
})

Queue.on('reject', async function reject(err) {
    await Queue.onTaskChange()
})
