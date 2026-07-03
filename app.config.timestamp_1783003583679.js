// app.config.ts
import { defineConfig } from "vinxi";
import { tanStackRouterLinkPlugin } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
var app_config_default = defineConfig({
  plugins: [
    tanStackRouterLinkPlugin(),
    react(),
    tsconfigPaths()
  ]
});
export {
  app_config_default as default
};
