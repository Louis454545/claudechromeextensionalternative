// Stub module for @puppeteer/browsers - not used in browser extension context
// This is needed because puppeteer-core has a dynamic import that Vite tries to resolve

export const Browser = {};
export const BrowserPlatform = {};
export const ChromeReleaseChannel = {};

export function detectBrowserPlatform() {
  return undefined;
}

export function resolveDefaultUserDataDir() {
  return "";
}

export function resolveBuildId() {
  return "";
}

export function createProfile() {
  return Promise.resolve();
}

export function getInstalledBrowsers() {
  return Promise.resolve([]);
}

export function install() {
  return Promise.resolve();
}

export function uninstall() {
  return Promise.resolve();
}

export function launch() {
  throw new Error("@puppeteer/browsers is not available in browser extension context");
}
