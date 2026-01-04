const { ipcMain } = require("electron");
const mangadex = require("./mangadex");

const providers = new Map();

function register(provider) {
  if (!provider.name || !provider.search) {
    throw new Error("Invalid provider");
  }

  providers.set(provider.name, provider);
}

register(mangadex);

function getProviders() {
  return [...providers.values()];
}

function getProvider(name) {
  return providers.get(name) || null;
}

function registerProviderRegistererIPC() {
  ipcMain.handle("get-providers", () => {
    return getProviders().map((provider) => ({
      name: provider.name,
    }));
  });

  ipcMain.handle(
    "search-in-provider",
    async (_, providerName, query, offset) => {
      const provider = getProvider(providerName);

      if (!provider) {
        throw new Error(`Provider not found: ${providerName}`);
      }

      return provider.search(query, offset);
    }
  );
}

module.exports = { getProviders, getProvider, registerProviderRegistererIPC };
