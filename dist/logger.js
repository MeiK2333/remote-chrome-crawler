"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var winston_1 = require("winston");
var moment_1 = tslib_1.__importDefault(require("moment"));
var combine = winston_1.format.combine, printf = winston_1.format.printf;
var fmt = printf(function (_a) {
    var level = _a.level, message = _a.message;
    var timestamp = moment_1.default().format('YYYY-MM-DD HH:mm:ss').trim();
    return timestamp + " [" + level.toUpperCase() + "]: " + message;
});
exports.logger = winston_1.createLogger({
    format: combine(fmt),
    transports: [
        new winston_1.transports.Console({ level: process.env.LOG_LEVEL || 'info' }),
    ]
});
