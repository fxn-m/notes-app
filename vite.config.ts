import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

// https://vite.dev/config/
export default defineConfig({
  base: "/notes-app/",
  plugins: [react()],
  server: {
    proxy: {
      // Proxy /api to the backend server running on localhost:3000
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  },
  resolve: {
    alias: {
      "@": "/src"
    }
  }
})
