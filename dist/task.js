"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["PENDING"] = 0] = "PENDING";
    TaskStatus[TaskStatus["RUNNING"] = 1] = "RUNNING";
    TaskStatus[TaskStatus["SUCCESS"] = 2] = "SUCCESS";
    TaskStatus[TaskStatus["FAILURE"] = 3] = "FAILURE";
})(TaskStatus = exports.TaskStatus || (exports.TaskStatus = {}));
var task_count = 0;
var Task = /** @class */ (function () {
    function Task(url, options) {
        if (options === void 0) { options = {}; }
        this.options = tslib_1.__assign({
            callback: this._callback,
            error_callback: this._error_callback,
            retry: 0,
            timeout: -1
        }, options);
        this.__id__ = task_count;
        task_count++;
        this.url = url;
        this.status = TaskStatus.PENDING;
        this.queue = null;
        this.page = null;
        this.prev = null;
        this.next = null;
    }
    Object.defineProperty(Task.prototype, "id", {
        get: function () { return this.__id__; },
        set: function (v) { throw new Error('Task id property is read only'); },
        enumerable: true,
        configurable: true
    });
    Task.prototype.onRetry = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.status = TaskStatus.PENDING;
                return [2 /*return*/];
            });
        });
    };
    Task.prototype._promiseTimeout = function (ms, promise) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () { return reject(new Error("Task Timeout")); }, ms);
            promise.then(resolve).catch(reject);
        });
    };
    Task.prototype.run = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, _a, err_1;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.status = TaskStatus.RUNNING;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, 9, 11]);
                        _a = this;
                        return [4 /*yield*/, this.queue.createPage(this)];
                    case 2:
                        _a.page = _b.sent();
                        if (!(this.options.timeout > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._promiseTimeout(this.options.timeout, this.options.callback(this))];
                    case 3:
                        result = _b.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.options.callback(this)];
                    case 5:
                        result = _b.sent();
                        _b.label = 6;
                    case 6: return [3 /*break*/, 11];
                    case 7:
                        err_1 = _b.sent();
                        this.status = TaskStatus.FAILURE;
                        return [4 /*yield*/, this.options.error_callback(err_1)];
                    case 8:
                        _b.sent();
                        throw err_1;
                    case 9: return [4 /*yield*/, this.queue.closePage(this)];
                    case 10:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 11:
                        this.status = TaskStatus.SUCCESS;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Task.prototype._callback = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    Task.prototype._error_callback = function (err) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    return Task;
}());
exports.Task = Task;
