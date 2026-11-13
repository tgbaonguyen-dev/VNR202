import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Khi chạy dev: chuyển WebSocket /ws sang máy chủ (npm run dev:server, cổng 8787)
    proxy: { "/ws": { target: "ws://localhost:8787", ws: true } },
  },
});
