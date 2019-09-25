"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chrome_runtime_1 = require("./chrome.runtime");
var console_debug_1 = require("./console.debug");
var navigator_languages_1 = require("./navigator.languages");
var navigator_permissions_1 = require("./navigator.permissions");
var navigator_plugins_1 = require("./navigator.plugins");
var navigator_webdriver_1 = require("./navigator.webdriver");
var user_agent_1 = require("./user-agent");
var webgl_vendor_1 = require("./webgl.vendor");
var window_outerdimensions_1 = require("./window.outerdimensions");
function puppeteerStealth(page) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chrome_runtime_1.chromeRuntime(page)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, console_debug_1.consoleDebug(page)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, navigator_languages_1.navigatorLanguage(page)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, navigator_permissions_1.navigatorPermissions(page)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, navigator_plugins_1.navigatorPlugins(page)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, navigator_webdriver_1.navigatorWebdriver(page)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, user_agent_1.userAgent(page)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, webgl_vendor_1.webglVendor(page)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, window_outerdimensions_1.windowOuterdimensions(page)];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.puppeteerStealth = puppeteerStealth;
