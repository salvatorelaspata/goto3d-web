/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "supabase.salvatorelaspata.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
