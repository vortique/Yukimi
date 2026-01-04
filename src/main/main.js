const { app, BrowserWindow } = require("electron");
const path = require("path");
const { registerProviderRegistererIPC } = require("./providers/index");

let mainWindow = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 1216,
    height: 864,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile(path.join(__dirname, "../renderer/pages/home/index.html"));

  return win;
}

function main() {
  registerProviderRegistererIPC();
  mainWindow = createWindow();
}

app.whenReady().then(main);
