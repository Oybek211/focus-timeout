import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Focus Timeout",
    short_name: "FocusTimeout",
    description: "Offline-ready focus timer with timeout breaks.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0f12",
    theme_color: "#0b0f12",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
