import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "*.trycloudflare.com",
      },
      {
        protocol: "https",
        hostname: "*.trycloudflare.com",
      },
      {
        protocol: "http",
        hostname: "yachu.baliyoventures.com",
      },
      {
        protocol: "https",
        hostname: "yachu.baliyoventures.com",
      },
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
