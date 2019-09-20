"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var task_1 = require("./task");
var sleep_1 = require("./sleep");
var loglevel_1 = tslib_1.__importDefault(require("loglevel"));
var puppeteer_extra_1 = tslib_1.__importDefault(require("puppeteer-extra"));
var puppeteer_extra_plugin_stealth_1 = tslib_1.__importDefault(require("puppeteer-extra-plugin-stealth"));
var events_1 = tslib_1.__importDefault(require("events"));
puppeteer_extra_1.default.use(puppeteer_extra_plugin_stealth_1.default());
var CrawlerQueue = /** @class */ (function (_super) {
    tslib_1.__extends(CrawlerQueue, _super);
    function CrawlerQueue() {
        var _this = _super.call(this) || this;
        _this._queue = [];
        //@ts-ignore
        _this.browser = null;
        _this.started = false;
        _this.ended = false;
        _this.max_pages = Number(process.env.pages) || 8;
        return _this;
    }
    CrawlerQueue.prototype.push = function (item) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._queue.push(item);
                        if (!this.started) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.onTaskChange()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    CrawlerQueue.prototype.pop = function () {
        return this._queue.shift();
    };
    CrawlerQueue.prototype.empty = function () {
        return this._queue.length === 0;
    };
    CrawlerQueue.prototype.removeEnded = function () {
        for (var i = 0; i < this._queue.length; i++) {
            if (this._queue[i].status === task_1.TaskStatus.SUCCESS || this._queue[i].status === task_1.TaskStatus.FAILURE) {
                this._queue.splice(i, 1);
                return this.removeEnded();
            }
        }
    };
    CrawlerQueue.prototype.onTaskChange = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var running, pending, _loop_1, this_1, i;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                this.removeEnded();
                running = 0;
                pending = 0;
                this._queue.map(function (task, index, array) {
                    if (task.status === task_1.TaskStatus.RUNNING) {
                        running += 1;
                    }
                    else if (task.status === task_1.TaskStatus.PENDING) {
                        pending += 1;
                    }
                });
                if (pending !== 0) {
                    _loop_1 = function (i) {
                        var task = this_1._queue[i];
                        if (task.status === task_1.TaskStatus.PENDING) {
                            loglevel_1.default.debug(task.url);
                            task.crawl()
                                .then(function (res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    task.status = task_1.TaskStatus.SUCCESS;
                                    loglevel_1.default.debug(task.url, 'success');
                                    this.emit('resolved', res);
                                    return [2 /*return*/];
                                });
                            }); })
                                .catch(function (e) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var t;
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            task.status = task_1.TaskStatus.FAILURE;
                                            loglevel_1.default.warn(task.url, 'failure');
                                            this.emit('reject', e);
                                            if (!(task.retry > 0)) return [3 /*break*/, 2];
                                            console.log(task.url + " retry: " + task.retry + " -> " + (task.retry - 1));
                                            t = new task_1.Task(task.url, task.crawl_callback, task.options);
                                            t.retry = task.retry - 1;
                                            return [4 /*yield*/, this.push(t)];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); });
                            running += 1;
                        }
                    };
                    this_1 = this;
                    for (i = 0; i < this._queue.length && running < this.max_pages; i++) {
                        _loop_1(i);
                    }
                }
                if (running === 0 && pending === 0) {
                    this.ended = true;
                }
                return [2 /*return*/];
            });
        });
    };
    CrawlerQueue.prototype.start = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.started = true;
                this.onTaskChange();
                return [2 /*return*/];
            });
        });
    };
    CrawlerQueue.prototype.end = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ended = true;
                        if (!this.browser) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.browser.close()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    CrawlerQueue.prototype.run = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.browser === null)) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, puppeteer_extra_1.default.launch({
                                headless: false
                            })];
                    case 1:
                        _a.browser = _b.sent();
                        _b.label = 2;
                    case 2: return [4 /*yield*/, this.start()];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        if (!true) return [3 /*break*/, 8];
                        return [4 /*yield*/, sleep_1.sleep(100)];
                    case 5:
                        _b.sent();
                        if (!this.ended) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.end()];
                    case 6:
                        _b.sent();
                        return [2 /*return*/];
                    case 7: return [3 /*break*/, 4];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return CrawlerQueue;
}(events_1.default));
exports.Queue = new CrawlerQueue();
exports.Queue.on('resolved', function resolved(res) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.Queue.onTaskChange()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
exports.Queue.on('reject', function reject(err) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.Queue.onTaskChange()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
