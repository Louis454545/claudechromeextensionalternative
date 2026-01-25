import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  vite: () => ({
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js"],
      exclude: ["@puppeteer/browsers"],
    },
    build: {
      rollupOptions: {
        // Externalize modules not needed in browser context
        external: [
          "chromium-bidi/lib/cjs/bidiMapper/BidiMapper.js",
          /^node:/,
        ],
      },
    },
    resolve: {
      alias: {
        // Stub out @puppeteer/browsers as it's not needed for extension usage
        "@puppeteer/browsers": resolve(__dirname, "lib/puppeteer-browsers-stub.ts"),
      },
    },
  }),
  manifest: {
    permissions: ["sidePanel", "debugger", "activeTab", "tabs"],
    action: {},
  },
});
