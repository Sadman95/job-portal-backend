import {} from "winston-daily-rotate-file"
import { createLogger } from "winston";
import { consoleTransport, errorFileTransport, infoFileTransport } from "./logger-transports";

export const logger = createLogger({
  transports: [
    consoleTransport,
    errorFileTransport,
    infoFileTransport,
  ],
})
