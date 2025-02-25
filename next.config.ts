import type { NextConfig } from "next"
const nextConfig : NextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    BACKEND_SERVER_API_URL: process.env.BACKEND_SERVER_API_URL,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_SERVER_API_URL}/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/pages',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;