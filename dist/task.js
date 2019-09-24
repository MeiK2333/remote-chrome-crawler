"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var queue_1 = require("./queue");
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["PENDING"] = 0] = "PENDING";
    TaskStatus[TaskStatus["RUNNING"] = 1] = "RUNNING";
    TaskStatus[TaskStatus["SUCCESS"] = 2] = "SUCCESS";
    TaskStatus[TaskStatus["FAILURE"] = 3] = "FAILURE";
})(TaskStatus = exports.TaskStatus || (exports.TaskStatus = {}));
var Task = /** @class */ (function () {
    function Task(url, crawl_callback, options) {
        if (options === void 0) { options = {}; }
        this.options = tslib_1.__assign({
            error_callback: this.error,
            meta: {},
            retry: Number(process.env.DEFAULT_TASK_RETRY) | 0
        }, options);
        this.url = url;
        this.crawl_callback = crawl_callback;
        this.error_callback = this.options.error_callback;
        this.status = TaskStatus.PENDING;
        this.meta = this.options.meta;
        this.retry = this.options.retry;
        //@ts-ignore
        this.page = null;
    }
    Task.prototype.crawl = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var content, _a, result, e_1;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.status = TaskStatus.RUNNING;
                        return [4 /*yield*/, queue_1.Queue.browser.createIncognitoBrowserContext()];
                    case 1:
                        content = _b.sent();
                        _a = this;
                        return [4 /*yield*/, content.newPage()];
                    case 2:
                        _a.page = _b.sent();
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, 7, 10]);
                        return [4 /*yield*/, this.crawl_callback(this)];
                    case 4:
                        result = _b.sent();
                        return [3 /*break*/, 10];
                    case 5:
                        e_1 = _b.sent();
                        return [4 /*yield*/, this.error_callback(e_1)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 7: return [4 /*yield*/, this.page.close()];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, content.close()];
                    case 9:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/, result];
                }
            });
        });
    };
    Task.prototype.error = function (e) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                console.error(e);
                throw e;
            });
        });
    };
    return Task;
}());
exports.Task = Task;
