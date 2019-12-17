import { Page, Browser } from 'puppeteer';
export declare enum TaskStatus {
    PENDING = 0,
    RUNNING = 1,
    SUCCESS = 2,
    FAILURE = 3
}
export interface TaskOptions {
    callback?: (task: Task) => Promise<any>;
    failure_callback?: (task: Task, err: Error) => Promise<void>;
    retry?: number;
    timeout?: number;
    meta?: Object;
    priority?: number;
}
export declare class Task {
    __id__: number;
    options: TaskOptions;
    status: TaskStatus;
    page: Page;
    browser: Browser;
    constructor(url: string, options?: TaskOptions);
    id: number;
    run(): Promise<any>;
    defaultCallback(task: Task): Promise<any>;
    defaultFailureCallback(task: Task, err: Error): Promise<void>;
}
