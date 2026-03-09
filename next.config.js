// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  // Optional: configure image domains if you use next/image
  images: {
    remotePatterns: [
      // Example: if you load images from Clerk
      // {
      //   protocol: 'https',
      //   hostname: 'img.clerk.com',
      // },
    ],
  },
};

module.exports = nextConfig;
