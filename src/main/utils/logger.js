const { app } = require("electron");
const path = require("path");
const fs = require("fs/promises");

const logPath = path.join(app.getPath("userData"));

const file = path.join(logPath, "app.log");

const logger = {
  info: async (...args) => await write("INFO", ...args),
  warn: async (...args) => await write("WARN", ...args),
  error: async (...args) => await write("ERROR", ...args),
};

/**
 * Write a message to the log file.
 * @param {string} level - The log level.
 * @param {...any} args - The messages/objects to log.
 */
async function write(level, ...args) {
  const msg = args
    .map((arg) => {
      if (arg instanceof Error) {
        return arg.stack || arg.message;
      } else if (typeof arg === "object") {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    })
    .join(" ");

  const line = `[${new Date().toISOString()}] [${level}] ${msg}\n`;

  try {
    await fs.appendFile(file, line, { encoding: "utf-8" });
  } catch (e) {
    console.log("[logger.js/write] Can not access log file.");
    console.error(e);
  }
}

module.exports = logger;
