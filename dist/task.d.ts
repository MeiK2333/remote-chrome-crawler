export declare enum TaskStatus {
    PENDING = 0,
    RUNNING = 1,
    SUCCESS = 2,
    FAILURE = 3
}
export interface TaskOptions {
}
export declare class Task {
    id: number;
    url: string;
    options: TaskOptions;
    constructor(url: string, options?: TaskOptions);
    run(): Promise<void>;
}
