import EventEmitter from 'events'
import { Task } from './task'
import { sleep } from './sleep'
import { logger } from './logger'

export class CrawlerNode {
    prev: CrawlerNode
    next: CrawlerNode
    task: Task
    constructor(task: Task) {
        this.task = task
        this.prev = null
        this.next = null
    }
}

export class CrawlerNodeList {
    head: CrawlerNode
    tail: CrawlerNode
    constructor() {
        this.head = null
        this.tail = null
    }

    add(node: CrawlerNode) {
        node.prev = null
        node.next = null
        if (this.head === null) {
            this.head = node
            this.tail = node
            return
        }
        this.tail.next = node
        node.prev = this.tail
        node.next = null
        this.tail = node
    }

    delete(node: CrawlerNode): CrawlerNode {
        let cur = this.head
        while (cur) {
            if (node.task.id === cur.task.id) {
                if (cur.prev) {
                    cur.prev.next = cur.next
                } else {
                    this.head = cur.next
                }
                if (cur.next) {
                    cur.next.prev = cur.prev
                } else {
                    this.tail = cur.prev
                }
                cur.prev = null
                cur.next = null
                return cur
            }
            cur = cur.next
        }
        return null
    }

    empty(): boolean {
        return this.head === null
    }

    size() {
        let cur = this.head
        let count = 0
        while (cur) {
            count++
            cur = cur.next
        }
        return count
    }

    pop(): CrawlerNode {
        if (this.head) {
            return this.delete(this.head)
        }
        return null
    }
}

export class CrawlerQueue extends EventEmitter {
    pending_node_list: CrawlerNodeList
    running_node_list: CrawlerNodeList
    success_node_list: CrawlerNodeList
    failure_node_list: CrawlerNodeList
    max_pages: number
    started: boolean
    ended: boolean

    constructor() {
        super()
        this.pending_node_list = new CrawlerNodeList()
        this.running_node_list = new CrawlerNodeList()
        this.success_node_list = new CrawlerNodeList()
        this.failure_node_list = new CrawlerNodeList()
        this.max_pages = Number(process.env.MAX_PAGES) || 8
        this.started = false
        this.ended = false

        this.on('resolved', this._resolved)
        this.on('reject', this._reject)
        this.on('retry', this._retry)
    }

    async _resolved(res) {
        await this._onTaskChange()
    }

    async _reject(err) {
        await this._onTaskChange()
    }

    async _retry() {
        await this._onTaskChange()
    }

    async run() {
        await this._start()
        while (true) {
            await sleep(100)
            if (this.ended) {
                await this._end()
                return
            }
        }
    }

    async add(task: Task) {
        let node = new CrawlerNode(task)
        this.pending_node_list.add(node)
        if (this.started) {
            await this._onTaskChange()
        }
    }

    async _start() {
        logger.debug('queue run start')
        this.started = true
        await this._onTaskChange()
    }

    async _end() {
        this.ended = true
        logger.debug('queue run end')
    }

    async _onTaskChange() {
        let pending_count = this.pending_node_list.size()
        let running_count = this.running_node_list.size()
        if (pending_count === 0 && running_count === 0) {
            this.ended = true
            return
        }

        while (running_count < this.max_pages && pending_count > 0) {
            let node = this.pending_node_list.pop()
            pending_count--
            running_count++
            this.running_node_list.add(node)
            node.task.run()
                .then(async res => {
                    this.running_node_list.delete(node)
                    if (process.env.DEBUG) {
                        this.success_node_list.add(node)
                    }

                    logger.debug(`${node.task.url} done`)
                    this.emit('resolved', res)
                })
                .catch(async err => {
                    this.running_node_list.delete(node)
                    if (process.env.DEBUG) {
                        this.failure_node_list.add(node)
                    }

                    logger.error(`${node.task.url} failure`)
                    logger.error(err)

                    if (node.task.options.retry > 0) {
                        await node.task.onRetry()
                        node.task.options.retry--
                        this.running_node_list.add(node)
                        this.emit('retry')
                        return
                    }

                    this.emit('reject', err)
                })
        }
    }
}

export const Queue: CrawlerQueue = new CrawlerQueue()
