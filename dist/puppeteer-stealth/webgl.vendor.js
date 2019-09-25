"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
function webglVendor(page) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Chrome returns undefined, Firefox false
                return [4 /*yield*/, page.evaluateOnNewDocument(function () {
                        try {
                            /* global WebGLRenderingContext */
                            //@ts-ignore
                            var getParameter_1 = WebGLRenderingContext.getParameter;
                            WebGLRenderingContext.prototype.getParameter = function (parameter) {
                                // UNMASKED_VENDOR_WEBGL
                                if (parameter === 37445) {
                                    return 'Intel Inc.';
                                }
                                // UNMASKED_RENDERER_WEBGL
                                if (parameter === 37446) {
                                    return 'Intel Iris OpenGL Engine';
                                }
                                return getParameter_1(parameter);
                            };
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
exports.webglVendor = webglVendor;
