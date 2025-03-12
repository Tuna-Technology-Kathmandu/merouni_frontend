/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    baseUrl: "http://localhost:8000",
    // baseUrl: "https://backend.merouni.com",
    mediaUrl: "https://uploads.merouni.com",
    version: "/api/v1",
    jwtsecret: "somethingisdown",
    ckeditor: "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDI2ODc5OTksImp0aSI6ImE1NDE1ZjYxLWJkM2YtNGJjZS1hOWRmLWRjZjBhZGQxMTMyNiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjM1ZGJmZGI2In0.wf4KxNLHx7lXynfn49RBpIl4D1fAvTwFYNEVUSUQEcEVBRabJ33-M0cjW5dlueUT5XEChX1PbpJTnfpy8QRYGg"
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
