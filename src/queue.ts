import EventEmitter from 'events'
import { Task } from './task'
import { sleep } from './sleep'

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
        this.head = new CrawlerNode(new Task(''))
        this.tail = null
    }

    *iter() {
        let cur = this.head
        while (cur.next) {
            yield cur
            cur = cur.next
        }
    }

    add(node: CrawlerNode) {
        this.tail.next = node
        node.prev = this.tail
        this.tail = node
    }

    delete(node: CrawlerNode): CrawlerNode {
        let cur = this.head
        while (cur.next) {
            if (node.task.id === cur.task.id) {
                cur.prev.next = cur.next
                cur.next.prev = cur.prev
                cur.prev = null
                cur.next = null
                return cur
            }
            cur = cur.next
        }
        return null
    }

    empty(): boolean {
        return this.head.next === null
    }

    size() {
        let cur = this.head
        let count = 0
        while (cur.next) {
            count++
        }
        return count
    }

    pop(): CrawlerNode {
        if (this.head.next) {
            return this.delete(this.head.next)
        }
        return null
    }

    get(n: number): CrawlerNode {
        let cur = this.head
        while (cur.next) {
            cur = cur.next
            if (n === 0) {
                return cur
            }
            n--
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

        this.on('resolved', this.resolved)
        this.on('reject', this.reject)
    }

    async resolved(res) {
        await this._onTaskChange()
    }

    async reject(err) {
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

    add(task: Task) {
        let node = new CrawlerNode(task)
        this.pending_node_list.add(node)
    }

    async _start() {
        this.started = true
        await this._onTaskChange()
    }

    async _end() {
        this.ended = true
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
                    this.emit('resolved', res)
                })
                .catch(async err => {
                    this.emit('reject', err)
                })
        }
    }
}

export const Queue: CrawlerQueue = new CrawlerQueue()
