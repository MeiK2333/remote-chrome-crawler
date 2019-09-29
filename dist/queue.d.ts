/// <reference types="node" />
import EventEmitter from 'events';
import { Task } from './task';
export declare class CrawlerNode {
    prev: CrawlerNode;
    next: CrawlerNode;
    task: Task;
    constructor(task: Task);
}
export declare class CrawlerNodeList {
    head: CrawlerNode;
    tail: CrawlerNode;
    constructor();
    iter(): Generator<CrawlerNode, void, unknown>;
    add(node: CrawlerNode): void;
    delete(node: CrawlerNode): CrawlerNode;
    empty(): boolean;
    size(): number;
    pop(): CrawlerNode;
    get(n: number): CrawlerNode;
}
export declare class CrawlerQueue extends EventEmitter {
    pending_node_list: CrawlerNodeList;
    running_node_list: CrawlerNodeList;
    success_node_list: CrawlerNodeList;
    failure_node_list: CrawlerNodeList;
    max_pages: number;
    started: boolean;
    ended: boolean;
    constructor();
    resolved(res: any): Promise<void>;
    reject(err: any): Promise<void>;
    run(): Promise<void>;
    add(task: Task): void;
    _start(): Promise<void>;
    _end(): Promise<void>;
    _onTaskChange(): Promise<void>;
}
export declare const Queue: CrawlerQueue;
