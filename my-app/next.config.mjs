/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    localUrl: "http://localhost:8000",
    mediaUrl: "https://uploads.merouni.com",
    baseUrl: "https://backend.merouni.com",
    version: "/api/v1",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
