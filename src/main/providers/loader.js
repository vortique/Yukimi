const { ipcMain } = require("electron");
const mangadex = require("./api/mangadex");

const providers = [
  {
    name: "mangadex",
    search_func: mangadex.search,
  },
];

function getProviders() {
  return providers;
}

function findProvider(name) {
  const foundProvider = getProviders().find(
    (provider) => provider.name === name
  );

  return foundProvider || false;
}

async function searchInProvider(providerName, query) {
  return findProvider(providerName).search_func(query);
}

function registerLoaderIPC() {
  ipcMain.handle("get-providers", () => {
    return getProviders().map((provider) => ({
      name: provider.name,
    }));
  });
  ipcMain.handle(
    "search-in-provider",
    async (_, proivderName, query) =>
      await searchInProvider(proivderName, query)
  );
}

module.exports = { getProviders, findProvider, registerLoaderIPC };
