"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
function navigatorWebdriver(page) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Chrome returns undefined, Firefox false
                return [4 /*yield*/, page.evaluateOnNewDocument(function () {
                        //@ts-ignore
                        var newProto = navigator.__proto__;
                        delete newProto.webdriver;
                        //@ts-ignore
                        navigator.__proto__ = newProto;
                    })];
                case 1:
                    // Chrome returns undefined, Firefox false
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.navigatorWebdriver = navigatorWebdriver;
