import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const port = Number(process.env.PORT) || 5173;
const basePath = process.env.BASE_PATH || "/";

export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Only the always-needed core gets its own long-cached chunk. Everything else
        // (maps, charts, PDF export, MUI) stays with the lazy route that imports it,
        // instead of one multi-MB vendor bundle on every page load.
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|scheduler|wouter)\//.test(id)) {
            return 'vendor-react';
          }
          return undefined;
        }
      }
    }
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  server: {
    port,
    host: "0.0.0.0",
  },
  preview: {
    port,
    host: "0.0.0.0",
  },
});
