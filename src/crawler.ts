import { EventEmitter } from "events"

export class Crawler extends EventEmitter {
    ws_endpoints: Array<string>

    constructor() {
        super()
        this.ws_endpoints = []
    }

    async addBrowserWSEndpoint(ws_endpoint: string) {
        this.ws_endpoints.push(ws_endpoint)
    }
}
