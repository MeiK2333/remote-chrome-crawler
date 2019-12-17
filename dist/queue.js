"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fastpriorityqueue_1 = tslib_1.__importDefault(require("fastpriorityqueue"));
var CrawlerTaskQueue = /** @class */ (function () {
    function CrawlerTaskQueue(trim) {
        if (trim === void 0) { trim = 100; }
        this.queue = new fastpriorityqueue_1.default(function (t1, t2) {
            if (t1.options.priority != t2.options.priority) {
                return t1.options.priority > t2.options.priority;
            }
            return t1.id < t2.id;
        });
        this.min_priority = 0;
        this.count = 0;
        this.trim_count = trim;
    }
    CrawlerTaskQueue.prototype.add = function (task) {
        if (this.count++ % this.trim_count === 0)
            this.queue.trim();
        if (task.options.priority !== null) {
            this.min_priority = this.min_priority < task.options.priority ?
                this.min_priority : task.options.priority;
            this.queue.add(task);
        }
        else {
            this.push(task);
        }
    };
    CrawlerTaskQueue.prototype.push = function (task) {
        if (this.count++ % this.trim_count === 0)
            this.queue.trim();
        this.min_priority--;
        task.options.priority = this.min_priority;
        this.queue.add(task);
    };
    CrawlerTaskQueue.prototype.delete = function (task) {
        if (this.count++ % this.trim_count === 0)
            this.queue.trim();
        if (this.queue.remove(task)) {
            return task;
        }
        return null;
    };
    CrawlerTaskQueue.prototype.pop = function () {
        if (this.count++ % this.trim_count === 0)
            this.queue.trim();
        var task = this.queue.poll();
        if (task) {
            return task;
        }
        return null;
    };
    CrawlerTaskQueue.prototype.empty = function () {
        return this.queue.isEmpty();
    };
    CrawlerTaskQueue.prototype.size = function () {
        return this.queue.size;
    };
    return CrawlerTaskQueue;
}());
exports.CrawlerTaskQueue = CrawlerTaskQueue;
