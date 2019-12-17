import { Task } from './task';
import FastPriorityQueue from 'fastpriorityqueue';
export declare class CrawlerTaskQueue {
    queue: FastPriorityQueue<Task>;
    min_priority: number;
    constructor();
}
