import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import process from "node:process";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";

// Vercel sets VERCEL=1 during its builds. Locally `npm run build` stays fast and
// produces dist/; on Vercel the nitro plugin emits .vercel/output (Build Output API v3).
// Force it locally with `npm run build:vercel`.
const isVercelBuild = !!process.env.VERCEL || process.env.DEPLOY_TARGET === "vercel";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      // Fail the build if server-only modules are pulled into a client bundle
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
    }),
    ...(isVercelBuild ? [nitro({ preset: "vercel" })] : []),
    viteReact(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    // Surface anything that would bloat the client bundle
    chunkSizeWarningLimit: 900,
    sourcemap: false,
  },
});
