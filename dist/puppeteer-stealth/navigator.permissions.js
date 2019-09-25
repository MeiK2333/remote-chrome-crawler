"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
function navigatorPermissions(page) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.evaluateOnNewDocument(function () {
                        var originalQuery = window.navigator.permissions.query;
                        //@ts-ignore
                        window.navigator.permissions.__proto__.query = function (parameters) {
                            return parameters.name === 'notifications'
                                ? Promise.resolve({ state: Notification.permission })
                                : originalQuery(parameters);
                        };
                        // Inspired by: https://github.com/ikarienator/phantomjs_hide_and_seek/blob/master/5.spoofFunctionBind.js
                        var oldCall = Function.prototype.call;
                        function call() {
                            return oldCall.apply(this, arguments);
                        }
                        Function.prototype.call = call;
                        var nativeToStringFunctionString = Error.toString().replace(/Error/g, 'toString');
                        var oldToString = Function.prototype.toString;
                        function functionToString() {
                            if (this === window.navigator.permissions.query) {
                                return 'function query() { [native code] }';
                            }
                            if (this === functionToString) {
                                return nativeToStringFunctionString;
                            }
                            return oldCall.call(oldToString, this);
                        }
                        Function.prototype.toString = functionToString;
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.navigatorPermissions = navigatorPermissions;
