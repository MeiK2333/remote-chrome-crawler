import puppeteer from 'puppeteer';
import { CrawlerQueue } from './queue';
import { Task } from './task';
export declare function createBrowser(queue: CrawlerQueue): Promise<puppeteer.Browser>;
export declare function closeBrowser(queue: CrawlerQueue): Promise<void>;
export declare function createPage(task: Task): Promise<puppeteer.Page>;
export declare function closePage(task: Task): Promise<void>;
