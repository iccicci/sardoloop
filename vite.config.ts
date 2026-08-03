import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

import { closeBundle } from "./publish";

// https://vite.dev/config/
export default defineConfig({
  build:   { rollupOptions: { input: { en: path.resolve(__dirname, "index-en.html"), it: path.resolve(__dirname, "index.html") } } },
  plugins: [react(), { closeBundle, name: "publish" }]
});
