"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var puppeteer_1 = tslib_1.__importDefault(require("puppeteer"));
var puppeteer_stealth_1 = require("./puppeteer-stealth");
function createBrowser(queue) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = queue;
                    return [4 /*yield*/, puppeteer_1.default.launch({})];
                case 1:
                    _a.browser = _b.sent();
                    return [2 /*return*/, queue.browser];
            }
        });
    });
}
exports.createBrowser = createBrowser;
function closeBrowser(queue) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!queue.browser) return [3 /*break*/, 2];
                    return [4 /*yield*/, queue.browser.close()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.closeBrowser = closeBrowser;
function createPage(task) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = task;
                    return [4 /*yield*/, task.queue.browser.newPage()];
                case 1:
                    _a.page = _b.sent();
                    return [4 /*yield*/, puppeteer_stealth_1.puppeteerStealth(task.page)];
                case 2:
                    _b.sent();
                    return [2 /*return*/, task.page];
            }
        });
    });
}
exports.createPage = createPage;
function closePage(task) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!task.page) return [3 /*break*/, 2];
                    return [4 /*yield*/, task.page.close()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.closePage = closePage;
