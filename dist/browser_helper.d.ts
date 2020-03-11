/// <reference types="node" />
import { EventEmitter } from "events";
import { Page } from 'puppeteer';
import { Browser } from 'puppeteer';
import { Task } from './task';
export declare class BrowserHelperCls extends EventEmitter {
    browsers: Array<Browser>;
    constructor();
    addBrowser(ws_endpoint: string): Promise<void>;
    getIdleBrowser(): Promise<Browser>;
    getIdleBrowserPage(task?: Task): Promise<Page>;
    disconnect(): Promise<void>;
}
export declare const BrowserHelper: BrowserHelperCls;
