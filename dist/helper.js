"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
function asyncSleep(ms) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
        });
    });
}
exports.asyncSleep = asyncSleep;
function promiseTimeout(ms, promise) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    setTimeout(function () { return reject(new Error("promise timeout")); }, ms);
                    promise.then(resolve).catch(reject);
                })];
        });
    });
}
exports.promiseTimeout = promiseTimeout;
