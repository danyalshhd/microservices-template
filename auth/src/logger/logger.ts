import { createLogger, format, transports } from "winston";
import stringify from "fast-safe-stringify";
const { combine, timestamp, label, printf, colorize } = format;

const customFormat = printf((info) => {
  return `[${info.level}] ${info.timestamp} ${stringify(info.message)}`;
});

const logger = createLogger({
  // level: 'info', // by default is info
  format: combine(
    colorize(),
    label({ label: "AccountManagement_MS" }),
    timestamp({ format: "DD-MMM-YYYY HH:mm:ss" }),
    customFormat
  ),
  transports: [
    new transports.Console({
      level: "debug",
      handleExceptions: true,
    }),
  ],
  exitOnError: false, // do not exit on handled exceptions
});
export default logger;
