import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed "output: export" to enable dynamic rendering (SSR/ISR)
  // For production with static hosting, use "output: standalone"
  output: "standalone",
  trailingSlash: true,
  images: {
    // Allow private IPs for local network PocketBase
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // PocketBase file storage (production - public URL)
        protocol: "https",
        hostname: "pb.troebel.wotis-cloud.com",
        pathname: "/api/files/**",
      },
      {
        // PocketBase file storage (local network)
        protocol: "http",
        hostname: "192.168.1.63",
        port: "8055",
        pathname: "/api/files/**",
      },
      {
        // PocketBase via localhost (for dev)
        protocol: "http",
        hostname: "localhost",
        port: "8055",
        pathname: "/api/files/**",
      },
    ],
  },
  // Environment variables accessible at runtime
  env: {
    NEXT_PUBLIC_POCKETBASE_URL: process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://192.168.1.63:8055",
  },
};

export default nextConfig;
