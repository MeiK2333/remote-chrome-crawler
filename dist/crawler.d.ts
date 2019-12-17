/// <reference types="node" />
import { EventEmitter } from "events";
export declare class Crawler extends EventEmitter {
    ws_endpoints: Array<string>;
    constructor();
    addBrowserWSEndpoint(ws_endpoint: string): Promise<void>;
}
