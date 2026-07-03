// app.config.ts
import { createApp } from "vinxi";
import { tanStackRouterLinkPlugin } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
var app_config_default = createApp({
  plugins: [
    tanStackRouterLinkPlugin(),
    react(),
    tsconfigPaths()
  ]
});
export {
  app_config_default as default
};
