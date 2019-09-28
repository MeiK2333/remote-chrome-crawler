import EventEmitter from 'events'

export class CrawlerQueue extends EventEmitter {
    constructor() {
        super()
    }
}

export const Queue: CrawlerQueue = new CrawlerQueue()
