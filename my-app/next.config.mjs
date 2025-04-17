/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    baseUrl: "http://localhost:8000",
    // baseUrl: "https://backend.merouni.com",
    mediaUrl: "https://uploads.merouni.com",
    version: "/api/v1",
    jwtsecret: "somethingisdown",
    ckeditor: "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDYxNDM5OTksImp0aSI6IjY3Yzk3MzY2LWM0YmYtNDAzYy05OTk4LTJjYTVjNTllZDRhOCIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImNiZmUxMjQ4In0.kvSTWPiernO-De_hTd9xCTttQiq3GFdrDVKTDFGAH2RzHg0guYzZhAuACF3y5AgU7k_3lA2EZyNIJXvqCmrqzQ"
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
