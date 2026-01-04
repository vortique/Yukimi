const fs = require("fs/promises");
const logger = require("./logger");

async function readFile(path) {
  try {
    const content = await fs.readFile(path, { encoding: "utf-8" });
    return content;
  } catch (e) {
    logger.error(`[io/readFile] ${e.message}`);
    throw e;
  }
}

async function writeFile(path, content) {
  try {
    await fs.writeFile(path, content, { encoding: "utf-8" });
    return content;
  } catch (e) {
    logger.error(`[io.js/writeFile] ${e.message}`);
    throw e;
  }
}

async function appendFile(path, content) {
  try {
    await fs.appendFile(path, content, { encoding: "utf-8" });
    return content;
  } catch (e) {
    logger.error(`[io.js/appendFile] ${e.message}`);
    throw e;
  }
}

async function createDirectory(path) {
  try {
    await fs.mkdir(path, { recursive: true });
    return path;
  } catch (e) {
    logger.error(`[io.js/createDirectory] ${e.message}`);
    throw e;
  }
}

async function pathExists(path) {
  try {
    return await fs
      .access(p.path, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);
  } catch (e) {
    logger.error(`[io.js/pathExists] ${e.message}`);
    throw e;
  }
}

module.exports = {
  readFile,
  writeFile,
  appendFile,
  createDirectory,
  pathExists,
};
