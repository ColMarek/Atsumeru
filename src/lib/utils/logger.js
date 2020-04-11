const winston = require("winston");
const moment = require("moment");
const path = require("path");
const { app } = require("electron");

const { combine, printf, colorize } = winston.format;

const myFormat = printf(({ level, message, logTimestamp }) => {
  const m = moment(logTimestamp);
  const formattedTimestamp = m.format("YYYY-MM-DD HH:mm:ss.SSS");
  return `${formattedTimestamp} | ${level.toUpperCase()}: ${message}`;
});

winston.configure({
  level: "debug",
  format: myFormat,
  transports: [
    new winston.transports.Console({ format: combine(myFormat, colorize({ all: true })) })
  ]
});
if (app.isPackaged) {
  const logFilePath = path.normalize(`${app.getPath("userData")}/logs/main.log`);
  winston.add(new winston.transports.File({ filename: logFilePath, maxsize: 50 * 1024 }));
}

module.exports = {
  info(message) {
    winston.info(message);
  },
  debug(message) {
    winston.debug(message);
  },
  error(message) {
    winston.error(message);
  },
  warn(message) {
    winston.warn(message);
  }
};
