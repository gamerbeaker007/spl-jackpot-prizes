import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd36mxiodymuqjm.cloudfront.net',
        pathname: '/**',
      },
    ],
  },

};

export default nextConfig;
