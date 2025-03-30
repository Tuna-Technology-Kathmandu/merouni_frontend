/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // baseUrl: "http://localhost:8000",
    baseUrl: "https://backend.merouni.com",
    mediaUrl: "https://uploads.merouni.com",
    version: "/api/v1",
    jwtsecret: "somethingisdown",
    ckeditor: "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDQ1ODg3OTksImp0aSI6ImU1MmNhNGJhLWZkMTgtNDA1NS1hZWE2LTkxZjM5ZTdjMTUxMyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjQ0MjYwYjAwIn0.ynboY1sC58KyhDfRVV0QlAqC1JQWYdNpXWj5u7FStei3u-1d4xsurdqlfIaOd4VJdISi3i9EzFMQ1cQ4e7rkcw"
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
