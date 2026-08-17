import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import pluginChecker from "vite-plugin-checker";
import mkcert from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
  base: "/mptbc-public/",
  plugins: [
    tailwindcss(),
    react(),
    pluginChecker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
        useFlatConfig: true,
      },
      overlay: true,
    }),
    mkcert(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    // https: true,
    port: 5200,
    strictPort: true,
  },
});
