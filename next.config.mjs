/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    baseUrl: process.env.NEXT_APP_API_BASE_URL,
    mediaUrl: process.env.NEXT_APP_MEDIA_BASE_URL,
    version: process.env.NEXT_APP_API_VERSION_URL_PREFIX,
    ckeditor: process.env.NEXT_APP_CK_EDITOR_KEY
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  }
}

export default nextConfig
