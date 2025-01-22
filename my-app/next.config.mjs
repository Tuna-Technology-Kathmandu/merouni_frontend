/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        baseUrl: 'https://backend.merouni.com',
        version: '/api/v1'
    },
    eslint: {
        ignoreDuringBuilds: true,
      },
};

export default nextConfig;
