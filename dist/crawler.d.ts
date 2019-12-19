/// <reference types="node" />
import { Task } from './task';
import { EventEmitter } from "events";
import { CrawlerTaskQueue } from './queue';
interface CrawlerQueueOptions {
    max_tasks?: number;
    task_delay?: number;
}
export declare class CrawlerQueue extends EventEmitter {
    pending_queue: CrawlerTaskQueue;
    running_queue: CrawlerTaskQueue;
    options: CrawlerQueueOptions;
    crawler_started: boolean;
    crawler_running: boolean;
    crawler_ended: boolean;
    constructor(options?: CrawlerQueueOptions);
    _resolved(res: any): Promise<void>;
    _reject(err: any): Promise<void>;
    _retry(): Promise<void>;
    add(task: Task): Promise<void>;
    start(): Promise<void>;
    waitIdle(): Promise<unknown>;
    end(): Promise<void>;
    run(): Promise<void>;
    _onTaskChange(): Promise<void>;
}
export declare const Crawler: CrawlerQueue;
export {};
