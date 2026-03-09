/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // replaces `next export`
  images: {
    unoptimized: true, // required if you use next/image (Render's static hosting doesn't support image optimization)
  },
};

module.exports = nextConfig;
