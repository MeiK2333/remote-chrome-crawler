import { Task } from './task';
import FastPriorityQueue from 'fastpriorityqueue';
export declare class CrawlerTaskQueue {
    queue: FastPriorityQueue<Task>;
    min_priority: number;
    count: number;
    trim_count: number;
    constructor(trim?: number);
    add(task: Task): void;
    push(task: Task): void;
    delete(task: Task): Task;
    pop(): Task;
    empty(): boolean;
    size(): number;
}
