/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // baseUrl: "http://localhost:8000",
    baseUrl: "https://backend.merouni.com",
    mediaUrl: "https://uploads.merouni.com",
    version: "/api/v1",
    jwtsecret: "somethingisdown",
    ckeditor: "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDgwNDQ3OTksImp0aSI6IjAwNzRjMGNlLWU1OWQtNDEwOC1hZmJiLTg4NTU5YzkxMmY1MSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjRhY2ZmYzU5In0.xubQ9FITqkAxpvQf36505midisFEOzXQqeoRjNQJreWy6-Kzk0UKm0KE1ilCgCDB2goi2aG79fh0ZEHUQenTVA"
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
