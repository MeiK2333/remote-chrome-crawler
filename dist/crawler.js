"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var logger_1 = require("./logger");
var events_1 = require("events");
var queue_1 = require("./queue");
var helper_1 = require("./helper");
var CrawlerQueue = /** @class */ (function (_super) {
    tslib_1.__extends(CrawlerQueue, _super);
    function CrawlerQueue(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.pending_queue = new queue_1.CrawlerTaskQueue();
        _this.running_queue = new queue_1.CrawlerTaskQueue();
        _this.options = tslib_1.__assign({
            max_tasks: Number(process.env.MAX_PAGES) || 8,
            task_delay: Number(process.env.TASK_DELAY) || 0
        }, options);
        _this.crawler_started = false;
        _this.crawler_running = false;
        _this.crawler_ended = false;
        _this.on('resolved', _this._resolved);
        _this.on('reject', _this._reject);
        _this.on('retry', _this._retry);
        return _this;
    }
    CrawlerQueue.prototype._resolved = function (res) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._onTaskChange()];
                    case 1:
                        _a.sent();
                        if (this.crawler_running === false) {
                            this.emit('onIdle');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CrawlerQueue.prototype._reject = function (err) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._onTaskChange()];
                    case 1:
                        _a.sent();
                        if (this.crawler_running === false) {
                            this.emit('onIdle');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CrawlerQueue.prototype._retry = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._onTaskChange()];
                    case 1:
                        _a.sent();
                        if (this.crawler_running === false) {
                            this.emit('onIdle');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CrawlerQueue.prototype.add = function (task) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger_1.logger.debug("add task " + task.id + ": " + task.url + " to crawler");
                        this.pending_queue.add(task);
                        if (!this.crawler_started) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._onTaskChange()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    CrawlerQueue.prototype.start = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.crawler_started = true;
                        return [4 /*yield*/, this._onTaskChange()];
                    case 1:
                        _a.sent();
                        logger_1.logger.debug("crawler started");
                        return [2 /*return*/];
                }
            });
        });
    };
    CrawlerQueue.prototype.waitIdle = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                if (this.crawler_running === false) {
                    return [2 /*return*/];
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.on('onIdle', function () {
                            resolve();
                        });
                    })];
            });
        });
    };
    CrawlerQueue.prototype.end = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.crawler_ended = true;
                logger_1.logger.debug("crawler ended");
                return [2 /*return*/];
            });
        });
    };
    CrawlerQueue.prototype.run = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.start()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.waitIdle()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.end()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CrawlerQueue.prototype._onTaskChange = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var pending_count, running_count, _loop_1, this_1;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                if (this.crawler_started === false || this.crawler_ended === true) {
                    return [2 /*return*/];
                }
                pending_count = this.pending_queue.size();
                running_count = this.running_queue.size();
                if (pending_count === 0 && running_count === 0) {
                    this.crawler_running = false;
                }
                else {
                    this.crawler_running = true;
                }
                _loop_1 = function () {
                    var task = this_1.pending_queue.pop();
                    this_1.running_queue.add(task);
                    task.run()
                        .then(function (res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(this.options.task_delay > 0)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, helper_1.asyncSleep(this.options.task_delay)];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2:
                                    this.running_queue.delete(task);
                                    logger_1.logger.debug(task.url + " done");
                                    this.emit('resolved', res);
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                        .catch(function (err) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var e_1;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.running_queue.delete(task);
                                    logger_1.logger.error(task.url + " failure");
                                    console.error(err);
                                    if (task.options.retry > 1) {
                                        logger_1.logger.warn("Task " + task.id + ": " + task.url + " retry: " + task.options.retry + " -> " + (task.options.retry - 1));
                                        task.options.retry--;
                                        this.pending_queue.add(task);
                                        this.emit('retry');
                                        return [2 /*return*/];
                                    }
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, task.options.failure_callback(task, err)];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    e_1 = _a.sent();
                                    console.error(e_1);
                                    return [3 /*break*/, 4];
                                case 4:
                                    this.emit('reject', err);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    pending_count--;
                    running_count++;
                };
                this_1 = this;
                while (running_count < this.options.max_tasks && pending_count > 0) {
                    _loop_1();
                }
                return [2 /*return*/];
            });
        });
    };
    return CrawlerQueue;
}(events_1.EventEmitter));
exports.CrawlerQueue = CrawlerQueue;
exports.default = new CrawlerQueue();
