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
        hostname: "supabase.salvatorelaspata.net",
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

module.exports = nextConfig;
