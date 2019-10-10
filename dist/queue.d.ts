/// <reference types="node" />
import EventEmitter from 'events';
import { Task } from './task';
import { Browser } from 'puppeteer';
export declare class CrawlerNodeList {
    head: Task;
    tail: Task;
    constructor();
    add(node: Task): void;
    delete(node: Task): Task;
    empty(): boolean;
    size(): number;
    pop(): Task;
}
export declare class CrawlerQueue extends EventEmitter {
    pending_node_list: CrawlerNodeList;
    running_node_list: CrawlerNodeList;
    success_node_list: CrawlerNodeList;
    failure_node_list: CrawlerNodeList;
    max_pages: number;
    task_delay: number;
    started: boolean;
    ended: boolean;
    browser: Browser;
    createBrowser: CallableFunction;
    closeBrowser: CallableFunction;
    createPage: CallableFunction;
    closePage: CallableFunction;
    constructor();
    _resolved(res: any): Promise<void>;
    _reject(err: any): Promise<void>;
    _retry(): Promise<void>;
    run(): Promise<void>;
    add(task: Task): Promise<void>;
    push(task: Task): Promise<void>;
    _start(): Promise<void>;
    _end(): Promise<void>;
    _onTaskChange(): Promise<void>;
}
export declare const Queue: CrawlerQueue;
