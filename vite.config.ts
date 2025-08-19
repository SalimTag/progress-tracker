import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png", "pwa-192x192.png"],
      manifest: {
        name: "Progress Tracker",
        short_name: "Tracker",
        description: "Daily progress tracker",
        categories: ["productivity", "lifestyle"],
        theme_color: "#0ea5e9",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          // App shell
          {
            urlPattern: ({ request }) =>
              ["document", "script", "style"].includes(request.destination),
            handler: "NetworkFirst",
            options: {
              cacheName: "app-shell",
            },
          },
          // Images & fonts
          {
            urlPattern: ({ request }) => ["image", "font"].includes(request.destination),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "static-assets",
            },
          },
        ],
      },
    }),
  ],
});
