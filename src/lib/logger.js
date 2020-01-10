const winston = require("winston");
const moment = require("moment");

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
    new winston.transports.Console({ format: combine(myFormat, colorize({ all: true })) }),
    new winston.transports.File({ filename: "log.log" })
  ]
});

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
