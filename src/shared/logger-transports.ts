import { transports, format } from 'winston';
import { LOG_LEVELS } from "./log-levels";
import path from 'path'
import DailyRotateFile from "winston-daily-rotate-file";



//custom-format
const myFormat = format.printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp as string)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  return `${date.toDateString()} ${hours}:${minutes}:${seconds} [${label}] ${level}: ${message}`
})


// Conseole Transport
const consoleTransport = new transports.Console({level: 'http', format: myFormat})



// File rotate Transport
const loggerTransport = (filename: string, level: LOG_LEVELS) => {
    return new DailyRotateFile({
        level: level || LOG_LEVELS.ERROR,
        format: myFormat,
        filename: filename || path.join(
        process.cwd(),
        'logs',
        'winston',  
        'error_logs',
        '-%DATE%-error.log'
      ),
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    })
}

const errorFileTransport = loggerTransport(
  path.join(
    process.cwd(),
    'logs',
    'winston',
    'error_logs',
    '-%DATE%-error.log'
  ), LOG_LEVELS.ERROR
)

const infoFileTransport = loggerTransport(
  path.join(
    process.cwd(),
    'logs',
    'winston',
    'info_logs',
    '-%DATE%-info.log'
  ),
  LOG_LEVELS.INFO
)



export {consoleTransport, errorFileTransport, infoFileTransport}