"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fastpriorityqueue_1 = tslib_1.__importDefault(require("fastpriorityqueue"));
var CrawlerTaskQueue = /** @class */ (function () {
    function CrawlerTaskQueue() {
        this.queue = new fastpriorityqueue_1.default(function (t1, t2) {
            return true;
        });
    }
    return CrawlerTaskQueue;
}());
exports.CrawlerTaskQueue = CrawlerTaskQueue;
