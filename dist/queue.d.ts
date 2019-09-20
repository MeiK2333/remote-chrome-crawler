/// <reference types="node" />
import { Task } from './task';
import { Browser } from 'puppeteer';
import EventEmitter from 'events';
declare class CrawlerQueue extends EventEmitter {
    _queue: Array<Task>;
    browser: Browser;
    started: boolean;
    ended: boolean;
    max_pages: number;
    constructor();
    push(item: Task): Promise<void>;
    pop(): Task | undefined;
    empty(): boolean;
    removeEnded(): any;
    onTaskChange(): Promise<void>;
    start(): Promise<void>;
    end(): Promise<void>;
    run(): Promise<void>;
}
export declare const Queue: CrawlerQueue;
export {};
