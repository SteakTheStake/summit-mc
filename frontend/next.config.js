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
      {
        hostname: "*.summitmc.xyz",
      },
    ],
  },
};

module.exports = nextConfig;
