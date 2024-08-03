import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default nextConfig;
