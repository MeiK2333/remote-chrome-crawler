import { logger } from './logger'

import { EventEmitter } from "events"
import puppeteer from 'puppeteer'
import { Browser } from 'puppeteer'

export class CrawlerQueue extends EventEmitter {
    browsers: Array<Browser>

    constructor() {
        super()
        this.browsers = []
    }

    async addBrowser(ws_endpoint: string) {
        const browser = await puppeteer.connect({
            browserWSEndpoint: ws_endpoint,
            defaultViewport: null,
        })
        logger.debug(`browser connected: ${ws_endpoint}`)
        this.browsers.push(browser)
        browser.on('disconnected', () => {
            logger.debug(`browser disconnected: ${ws_endpoint}`)
            this.browsers.splice(this.browsers.indexOf(browser), 1)
        })
    }
}

export default new CrawlerQueue()
