import { Page } from 'puppeteer';
export declare enum TaskStatus {
    PENDING = 0,
    RUNNING = 1,
    SUCCESS = 2,
    FAILURE = 3
}
export interface TaskOptions {
    error_callback?: CallableFunction;
    meta?: Object;
    retry?: number;
}
export declare class Task {
    url: string;
    status: TaskStatus;
    crawl_callback: CallableFunction;
    error_callback: CallableFunction;
    meta: Object;
    page: Page;
    retry: number;
    options: TaskOptions;
    constructor(url: string, crawl_callback: CallableFunction, options?: TaskOptions);
    crawl(): Promise<any>;
    error(e: Error): Promise<void>;
}
