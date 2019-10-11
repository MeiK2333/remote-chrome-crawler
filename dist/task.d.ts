import { Page } from 'puppeteer';
import { CrawlerQueue } from './queue';
export declare enum TaskStatus {
    PENDING = 0,
    RUNNING = 1,
    SUCCESS = 2,
    FAILURE = 3
}
export interface TaskOptions {
    callback?: CallableFunction;
    error_callback?: CallableFunction;
    retry?: number;
    timeout?: number;
    meta?: Object;
    level?: number;
}
export declare class Task {
    __id__: number;
    url: string;
    status: TaskStatus;
    options: TaskOptions;
    queue: CrawlerQueue;
    page: Page;
    prev: Task;
    next: Task;
    constructor(url: string, options?: TaskOptions);
    id: number;
    onRetry(): Promise<void>;
    _promiseTimeout(ms: number, promise: any): Promise<unknown>;
    run(): Promise<any>;
    _callback(): Promise<void>;
    _error_callback(err: any): Promise<void>;
}
