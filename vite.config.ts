import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import process from "node:process";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";

/*
 * Deploy target decides which nitro preset (if any) runs.
 *
 *  - unset      plain `dist/`: a fetch handler with no HTTP listener. Fine for local
 *               builds and inspection, NOT something a Node host can serve.
 *  - "vercel"   .vercel/output, Build Output API v3. Vercel sets VERCEL=1 itself.
 *  - "node"     .output/server/index.mjs, a standalone server that binds to PORT —
 *               what a Node host such as Hostinger's Web Apps needs.
 */
const deployTarget = process.env.VERCEL ? "vercel" : process.env.DEPLOY_TARGET;
const nitroPreset =
  deployTarget === "vercel" ? "vercel" : deployTarget === "node" ? "node-server" : null;

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
    ...(nitroPreset ? [nitro({ preset: nitroPreset })] : []),
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
