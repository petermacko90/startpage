import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isFirefox = mode === "firefox";

  return {
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          {
            src: "manifest.json",
            dest: ".",
            transform: (content) => {
              const manifest = JSON.parse(content.toString());

              if (isFirefox) {
                manifest.background = {
                  scripts: ["background.js"],
                  type: "module",
                };
              } else {
                manifest.background = {
                  service_worker: "background.js",
                  type: "module",
                };
              }

              return JSON.stringify(manifest, null, 2);
            },
          },
        ],
      }),
    ],
    build: {
      outDir: isFirefox ? "dist-firefox" : "dist-chrome",
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(import.meta.dirname, "index.html"),
          background: resolve(import.meta.dirname, "src/background.ts"),
        },
        output: {
          entryFileNames: (chunkInfo) => {
            return chunkInfo.name === "background"
              ? "background.js"
              : "assets/[name]-[hash].js";
          },
        },
      },
    },
    base: "./",
    optimizeDeps: {
      include: ["@material-symbols-svg/react"],
    },
  };
});
