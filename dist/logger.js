"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = require("winston");
var combine = winston_1.format.combine, timestamp = winston_1.format.timestamp, printf = winston_1.format.printf;
var fmt = printf(function (_a) {
    var level = _a.level, message = _a.message, timestamp = _a.timestamp;
    return timestamp + " [" + level.toUpperCase() + "]: " + message;
});
exports.logger = winston_1.createLogger({
    format: combine(timestamp(), fmt),
    transports: [
        new winston_1.transports.Console({ level: process.env.LOG_LEVEL || 'info' }),
    ]
});
