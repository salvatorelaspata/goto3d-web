/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  redirects: () => [
    // {
    //   source: "/",
    //   destination: "/dashboard",
    //   permanent: false,
    // },
    // {
    //   source: "/login",
    //   destination: "/dashboard",
    //   permanent: false,
    // },
  ],
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
