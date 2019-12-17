"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var events_1 = require("events");
var Crawler = /** @class */ (function (_super) {
    tslib_1.__extends(Crawler, _super);
    function Crawler() {
        var _this = _super.call(this) || this;
        _this.ws_endpoints = [];
        return _this;
    }
    Crawler.prototype.addBrowserWSEndpoint = function (ws_endpoint) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.ws_endpoints.push(ws_endpoint);
                return [2 /*return*/];
            });
        });
    };
    return Crawler;
}(events_1.EventEmitter));
exports.Crawler = Crawler;
