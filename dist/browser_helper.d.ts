/// <reference types="node" />
import { EventEmitter } from "events";
import { Page } from 'puppeteer';
import { Browser } from 'puppeteer';
export declare class BrowserHelper extends EventEmitter {
    browsers: Array<Browser>;
    constructor();
    addBrowser(ws_endpoint: string): Promise<void>;
    getIdleBrowser(): Promise<Browser>;
    getIdleBrowserPage(): Promise<Page>;
}
declare const _default: BrowserHelper;
export default _default;
