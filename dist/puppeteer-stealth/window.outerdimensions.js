"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
function windowOuterdimensions(page) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Chrome returns undefined, Firefox false
                return [4 /*yield*/, page.evaluateOnNewDocument(function () {
                        try {
                            if (window.outerWidth && window.outerHeight) {
                                return; // nothing to do here
                            }
                            var windowFrame = 85; // probably OS and WM dependent
                            //@ts-ignore
                            window.outerWidth = window.innerWidth;
                            //@ts-ignore
                            window.outerHeight = window.innerHeight + windowFrame;
                        }
                        catch (err) { }
                    })];
                case 1:
                    // Chrome returns undefined, Firefox false
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.windowOuterdimensions = windowOuterdimensions;
