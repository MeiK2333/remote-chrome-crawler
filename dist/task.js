"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var helper_1 = require("./helper");
var logger_1 = require("./logger");
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
            callback: this.defaultCallback,
            failure_callback: this.defaultFailureCallback,
        }, options);
        this.__id__ = task_count;
        task_count++;
        this.status = TaskStatus.PENDING;
    }
    Object.defineProperty(Task.prototype, "id", {
        get: function () { return this.__id__; },
        set: function (v) { throw new Error('Task id property is read only'); },
        enumerable: true,
        configurable: true
    });
    Task.prototype.run = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, err_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.status = TaskStatus.PENDING;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, 9, 10]);
                        if (!this.options.timeout) return [3 /*break*/, 3];
                        return [4 /*yield*/, helper_1.promiseTimeout(this.options.timeout, this.options.callback(this))];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.options.callback(this)];
                    case 4:
                        result = _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 10];
                    case 6:
                        err_1 = _a.sent();
                        this.status = TaskStatus.FAILURE;
                        if (!(this.options.retry === undefined || this.options.retry === 0)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.options.failure_callback(this, err_1)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: throw err_1;
                    case 9: return [7 /*endfinally*/];
                    case 10:
                        this.status = TaskStatus.SUCCESS;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Task.prototype.defaultCallback = function (task) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                logger_1.logger.debug('Here is the default callback function, you may need to override it');
                return [2 /*return*/];
            });
        });
    };
    Task.prototype.defaultFailureCallback = function (task, err) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                logger_1.logger.debug('Here is the default failure callback function, you may need to override it');
                return [2 /*return*/];
            });
        });
    };
    return Task;
}());
exports.Task = Task;
