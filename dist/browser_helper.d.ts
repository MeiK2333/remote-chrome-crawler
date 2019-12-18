/// <reference types="node" />
import { EventEmitter } from "events";
import { Page } from 'puppeteer';
import { Browser } from 'puppeteer';
export declare class BrowserHelperCls extends EventEmitter {
    browsers: Array<Browser>;
    constructor();
    addBrowser(ws_endpoint: string): Promise<void>;
    getIdleBrowser(): Promise<Browser>;
    getIdleBrowserPage(): Promise<Page>;
}
export declare const BrowserHelper: BrowserHelperCls;
