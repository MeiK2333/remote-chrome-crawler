"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var events_1 = tslib_1.__importDefault(require("events"));
var sleep_1 = require("./sleep");
var logger_1 = require("./logger");
var functions_1 = require("./functions");
var CrawlerNodeList = /** @class */ (function () {
    function CrawlerNodeList() {
        this.head = null;
        this.tail = null;
    }
    CrawlerNodeList.prototype.add = function (node) {
        node.prev = null;
        node.next = null;
        if (this.head === null) {
            this.head = node;
            this.tail = node;
            return;
        }
        this.tail.next = node;
        node.prev = this.tail;
        node.next = null;
        this.tail = node;
    };
    CrawlerNodeList.prototype.delete = function (node) {
        var cur = this.head;
        while (cur) {
            if (node.id === cur.id) {
                if (cur.prev) {
                    cur.prev.next = cur.next;
                }
                else {
                    this.head = cur.next;
                }
                if (cur.next) {
                    cur.next.prev = cur.prev;
                }
                else {
                    this.tail = cur.prev;
                }
                cur.prev = null;
                cur.next = null;
                return cur;
            }
            cur = cur.next;
        }
        return null;
    };
    CrawlerNodeList.prototype.empty = function () {
        return this.head === null;
    };
    CrawlerNodeList.prototype.size = function () {
        var cur = this.head;
        var count = 0;
        while (cur) {
            count++;
            cur = cur.next;
        }
        return count;
    };
    CrawlerNodeList.prototype.pop = function () {
        if (this.head) {
            return this.delete(this.head);
        }
        return null;
    };
    return CrawlerNodeList;
}());
exports.CrawlerNodeList = CrawlerNodeList;
var CrawlerQueue = /** @class */ (function (_super) {
    tslib_1.__extends(CrawlerQueue, _super);
    function CrawlerQueue() {
        var _this = _super.call(this) || this;
        _this.pending_node_list = new CrawlerNodeList();
        _this.running_node_list = new CrawlerNodeList();
        _this.success_node_list = new CrawlerNodeList();
        _this.failure_node_list = new CrawlerNodeList();
        _this.max_pages = Number(process.env.MAX_PAGES) || 8;
        _this.started = false;
        _this.ended = false;
        _this.browser = null;
        _this.createBrowser = functions_1.createBrowser;
        _this.closeBrowser = functions_1.closeBrowser;
        _this.createPage = functions_1.createPage;
        _this.closePage = functions_1.closePage;
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
                        return [2 /*return*/];
                }
            });
        });
    };
    CrawlerQueue.prototype.run = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._start()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!true) return [3 /*break*/, 6];
                        return [4 /*yield*/, sleep_1.sleep(100)];
                    case 3:
                        _a.sent();
                        if (!this.ended) return [3 /*break*/, 5];
                        return [4 /*yield*/, this._end()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                    case 5: return [3 /*break*/, 2];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    CrawlerQueue.prototype.add = function (task) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        task.queue = this;
                        this.pending_node_list.add(task);
                        if (!this.started) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._onTaskChange()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    CrawlerQueue.prototype._start = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var createBrowser;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger_1.logger.debug('queue run start');
                        this.started = true;
                        createBrowser = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return tslib_1.__generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (this.ended) {
                                            return [2 /*return*/];
                                        }
                                        _a = this;
                                        return [4 /*yield*/, this.createBrowser(this)];
                                    case 1:
                                        _a.browser = _b.sent();
                                        this.browser.on('disconnected', createBrowser);
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        return [4 /*yield*/, createBrowser()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._onTaskChange()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CrawlerQueue.prototype._end = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ended = true;
                        return [4 /*yield*/, this.closeBrowser(this)];
                    case 1:
                        _a.sent();
                        logger_1.logger.debug('queue run end');
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
                pending_count = this.pending_node_list.size();
                running_count = this.running_node_list.size();
                if (pending_count === 0 && running_count === 0) {
                    this.ended = true;
                    return [2 /*return*/];
                }
                _loop_1 = function () {
                    var node = this_1.pending_node_list.pop();
                    pending_count--;
                    running_count++;
                    this_1.running_node_list.add(node);
                    node.run()
                        .then(function (res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            this.running_node_list.delete(node);
                            if (process.env.DEBUG) {
                                this.success_node_list.add(node);
                            }
                            logger_1.logger.debug(node.url + " done");
                            this.emit('resolved', res);
                            return [2 /*return*/];
                        });
                    }); })
                        .catch(function (err) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.running_node_list.delete(node);
                                    if (process.env.DEBUG) {
                                        this.failure_node_list.add(node);
                                    }
                                    logger_1.logger.error(node.url + " failure");
                                    console.error(err);
                                    if (!(node.options.retry > 1)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, node.onRetry()];
                                case 1:
                                    _a.sent();
                                    logger_1.logger.info("Task " + node.id + ": " + node.url + " retry: " + node.options.retry + " -> " + (node.options.retry - 1));
                                    node.options.retry--;
                                    this.pending_node_list.add(node);
                                    this.emit('retry');
                                    return [2 /*return*/];
                                case 2:
                                    this.emit('reject', err);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                };
                this_1 = this;
                while (running_count < this.max_pages && pending_count > 0) {
                    _loop_1();
                }
                return [2 /*return*/];
            });
        });
    };
    return CrawlerQueue;
}(events_1.default));
exports.CrawlerQueue = CrawlerQueue;
exports.Queue = new CrawlerQueue();
