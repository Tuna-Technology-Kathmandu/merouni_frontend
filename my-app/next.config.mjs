/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    baseUrl: "http://localhost:8000",
    // baseUrl: "https://backend.merouni.com",
    version: "/api/v1",
    jwtsecret: "somethingisdown",
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
