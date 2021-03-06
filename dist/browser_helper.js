"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var logger_1 = require("./logger");
var events_1 = require("events");
var puppeteer_1 = tslib_1.__importDefault(require("puppeteer"));
var BrowserHelperCls = /** @class */ (function (_super) {
    tslib_1.__extends(BrowserHelperCls, _super);
    function BrowserHelperCls() {
        var _this = _super.call(this) || this;
        _this.browsers = [];
        return _this;
    }
    BrowserHelperCls.prototype.addBrowser = function (ws_endpoint) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var browser;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, puppeteer_1.default.connect({
                            browserWSEndpoint: ws_endpoint,
                            defaultViewport: null,
                        })];
                    case 1:
                        browser = _a.sent();
                        logger_1.logger.debug("browser connected: " + ws_endpoint);
                        this.browsers.push(browser);
                        browser.on('disconnected', function () {
                            logger_1.logger.debug("browser disconnected: " + ws_endpoint);
                            _this.browsers.splice(_this.browsers.indexOf(browser), 1);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowserHelperCls.prototype.getIdleBrowser = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var browser, min_pages, i, item, len;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        browser = null;
                        min_pages = 2147483647;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.browsers.length)) return [3 /*break*/, 4];
                        item = this.browsers[i];
                        return [4 /*yield*/, item.pages()];
                    case 2:
                        len = (_a.sent()).length;
                        if (len < min_pages) {
                            browser = item;
                            min_pages = len;
                        }
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, browser];
                }
            });
        });
    };
    BrowserHelperCls.prototype.getIdleBrowserPage = function (task) {
        if (task === void 0) { task = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var browser, page;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getIdleBrowser()];
                    case 1:
                        browser = _a.sent();
                        if (browser === null) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, browser.newPage()];
                    case 2:
                        page = _a.sent();
                        if (!(task !== null)) return [3 /*break*/, 4];
                        return [4 /*yield*/, task.atExit(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, page.close()];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, page];
                }
            });
        });
    };
    BrowserHelperCls.prototype.disconnect = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var browser;
            return tslib_1.__generator(this, function (_a) {
                while (this.browsers.length !== 0) {
                    browser = this.browsers[0];
                    browser.disconnect();
                }
                return [2 /*return*/];
            });
        });
    };
    return BrowserHelperCls;
}(events_1.EventEmitter));
exports.BrowserHelperCls = BrowserHelperCls;
exports.BrowserHelper = new BrowserHelperCls();
