import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "yachu.baliyoventures.com",
      },
    ],
  },
};

export default nextConfig;
