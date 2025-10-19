import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

const devServerPort = Number.parseInt(process.env.VITE_PORT ?? "5173", 10);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: devServerPort,
  },
  preview: {
    port: devServerPort,
  },
});

