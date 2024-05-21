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
};

module.exports = nextConfig;
