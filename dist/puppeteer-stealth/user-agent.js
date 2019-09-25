"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
function userAgent(page, windows) {
    if (windows === void 0) { windows = false; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var ua;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.browser().userAgent()];
                case 1:
                    ua = _a.sent();
                    if (ua.indexOf('HeadlessChrome/') !== -1) {
                        ua = ua.replace('HeadlessChrome/', 'Chrome/');
                    }
                    if (windows) {
                        ua = ua.replace(/\(([^)]+)\)/, '(Windows NT 10.0; Win64; x64)');
                    }
                    return [4 /*yield*/, page.setUserAgent(ua)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.userAgent = userAgent;
