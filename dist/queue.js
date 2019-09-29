"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var events_1 = tslib_1.__importDefault(require("events"));
var sleep_1 = require("./sleep");
var logger_1 = require("./logger");
var CrawlerNode = /** @class */ (function () {
    function CrawlerNode(task) {
        this.task = task;
        this.prev = null;
        this.next = null;
    }
    return CrawlerNode;
}());
exports.CrawlerNode = CrawlerNode;
var CrawlerNodeList = /** @class */ (function () {
    function CrawlerNodeList() {
        this.head = null;
        this.tail = null;
    }
    CrawlerNodeList.prototype.iter = function () {
        var cur;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cur = this.head;
                    _a.label = 1;
                case 1:
                    if (!(cur && cur.next)) return [3 /*break*/, 3];
                    return [4 /*yield*/, cur];
                case 2:
                    _a.sent();
                    cur = cur.next;
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    };
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
        while (cur && cur.next) {
            if (node.task.id === cur.task.id) {
                cur.prev.next = cur.next;
                cur.next.prev = cur.prev;
                cur.prev = null;
                cur.next = null;
                return cur;
            }
            cur = cur.next;
        }
        return null;
    };
    CrawlerNodeList.prototype.empty = function () {
        return this.head.next === null;
    };
    CrawlerNodeList.prototype.size = function () {
        var cur = this.head;
        var count = 0;
        while (cur && cur.next) {
            count++;
        }
        return count;
    };
    CrawlerNodeList.prototype.pop = function () {
        if (this.head.next) {
            return this.delete(this.head.next);
        }
        return null;
    };
    CrawlerNodeList.prototype.get = function (n) {
        var cur = this.head;
        while (cur && cur.next) {
            cur = cur.next;
            if (n === 0) {
                return cur;
            }
            n--;
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
        _this.on('resolved', _this.resolved);
        _this.on('reject', _this.reject);
        return _this;
    }
    CrawlerQueue.prototype.resolved = function (res) {
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
    CrawlerQueue.prototype.reject = function (err) {
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
        var node = new CrawlerNode(task);
        this.pending_node_list.add(node);
    };
    CrawlerQueue.prototype._start = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger_1.logger.info('queue run start');
                        this.started = true;
                        return [4 /*yield*/, this._onTaskChange()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CrawlerQueue.prototype._end = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.ended = true;
                logger_1.logger.info('queue run end');
                return [2 /*return*/];
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
                    node.task.run()
                        .then(function (res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            logger_1.logger.debug(node.task.url + " done");
                            this.emit('resolved', res);
                            return [2 /*return*/];
                        });
                    }); })
                        .catch(function (err) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            logger_1.logger.error(node.task.url + " failure");
                            logger_1.logger.error(err);
                            this.emit('reject', err);
                            return [2 /*return*/];
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
