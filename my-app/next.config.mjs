/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // baseUrl: "http://localhost:8000",
    baseUrl: "https://backend.merouni.com",
    mediaUrl: "https://uploads.merouni.com",
    version: "/api/v1",
    jwtsecret: "somethingisdown",
    ckeditor: "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NzQ5MTUxOTksImp0aSI6IjdkZmM3YjRlLTY3NWItNDc1OC05NGFhLTRlNTg5ZWNiZjNiZCIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiXSwiZmVhdHVyZXMiOlsiRFJVUCJdLCJ2YyI6IjQ4YTBlODgwIn0.toQyBxQzjesVdJUe0jxAbaqjKm_QTffoDKK8goeMlEv32_kL32ugD68xI4xEKxE3p1HubStc4s8NzroCOWXTxQ"
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
