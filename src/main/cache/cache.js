const io = require("../utils/io");
const logger = require("../utils/logger");

async function cache(path, key, jsonContent, ttl) {
  try {
    await io.writeFile(
      path,
      JSON.stringify({ [key]: jsonContent, time: Date.now() + ttl })
    );
    return jsonContent
  } catch (e) {
    return { success: false, message: e.message };
  }
}

async function getCachedData(path, key) {
  try {
    if (!(await io.pathExists(path))) return { success: false };

    const raw = await io.readFile(path);
    const jsonContent = JSON.parse(raw);

    if (Date.now() < jsonContent.time) {
      return { success: true, content: jsonContent[key] };
    } else {
      return { success: false };
    }
  } catch (e) {
    logger.error(`[cache.js/getCachedData] ${e.message}`);
  }
}

module.exports = { cache, getCachedData };
