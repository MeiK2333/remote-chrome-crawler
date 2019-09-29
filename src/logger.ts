import { createLogger, format, transports } from 'winston'
const { combine, timestamp, printf } = format;

const fmt = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
})

export const logger = createLogger({
    format: combine(
        timestamp(),
        fmt
    ),
    transports: [
        new transports.Console({ level: process.env.LOG_LEVEL || 'info' }),
    ]
})
