import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Three.js/R3F/drei only load on the homepage (see HeroSection's
          // lazy import) but keeping them in a dedicated chunk means they're
          // cached separately from the rest of the app's vendor code.
          three: ["three", "@react-three/fiber", "@react-three/drei"],
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Lets the client call "/api/..." during dev without CORS setup
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
