const { app } = require("electron");
const fs = require("fs/promises");
const path = require("path");
const { createDirectory } = require("./io");

async function createDirsForUser(paths) {
  for (p of paths) {
    if (
      !(await fs
        .access(p.path, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false))
    ) {
      await createDirectory(p.path);
    }
  }

  return { success: true };
}

module.exports = createDirsForUser;
