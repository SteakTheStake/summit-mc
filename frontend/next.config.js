/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "*.patreonusercontent.com",
      },
      {
        hostname: process.env.NEXT_PUBLIC_API,
      },
    ],
  },
};

module.exports = nextConfig;
