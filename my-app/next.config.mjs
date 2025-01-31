/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // baseUrl: "https://backend.merouni.com",
    baseUrl: "http://localhost:8000",

    version: "/api/v1",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
