import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    // Node.js polyfills needed by some Solana dependencies
    "process.env": {},
    global: "globalThis",
  },
  resolve: {
    alias: {
      buffer: "buffer",
    },
    dedupe: [
      "@solana-commerce/connector",
      "react",
      "react-dom"
    ],
  },
  optimizeDeps: {
    include: ["buffer"],
  },
});
