/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    baseUrl: "http://localhost:8000",
    version: "/api/v1",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
