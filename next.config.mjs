// import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

// if (process.env.NODE_ENV === "development") {
//   await setupDevPlatform();
// }
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

import pwa from "next-pwa";
const withPWA = pwa({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: false,
  experimental: {
    serverComponentsExternalPackages: ["@aws-sdk"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "https://hmulxbvwdgyogleepxmu.supabase.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname:
          "public-dev.5b2e4ee1915b41377002b62a6a6606c1.r2.cloudflarestorage.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname:
          "dev.5b2e4ee1915b41377002b62a6a6606c1.r2.cloudflarestorage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
});

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

export default nextConfig;
