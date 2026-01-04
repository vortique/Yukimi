const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("yukimi", {
  getProviders: () => ipcRenderer.invoke("get-providers"),
  searchInProvider: (providerName, query, offset) =>
    ipcRenderer.invoke("search-in-provider", providerName, query, offset),
});
