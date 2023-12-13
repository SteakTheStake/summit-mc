/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "*.patreonusercontent.com",
      },
      {
        hostname: "localhost",
      },
    ],
  },
};

module.exports = nextConfig;
