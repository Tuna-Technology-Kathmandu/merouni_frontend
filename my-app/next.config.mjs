/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // baseUrl: "http://localhost:8000",
    baseUrl: "https://backend.merouni.com",
    mediaUrl: "https://uploads.merouni.com",
    version: "/api/v1",
    jwtsecret: "somethingisdown",
    ckeditor: "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NzQ5MTUxOTksImp0aSI6IjJiMjdiOWU5LTkwZTgtNDhjMi04ZDk4LTNiOWI0YzkxYWFlZSIsImxpY2Vuc2VkSG9zdHMiOlsiMTI3LjAuMC4xIiwibG9jYWxob3N0IiwiMTkyLjE2OC4qLioiLCIxMC4qLiouKiIsIjE3Mi4qLiouKiIsIioudGVzdCIsIioubG9jYWxob3N0IiwiKi5sb2NhbCJdLCJ1c2FnZUVuZHBvaW50IjoiaHR0cHM6Ly9wcm94eS1ldmVudC5ja2VkaXRvci5jb20iLCJkaXN0cmlidXRpb25DaGFubmVsIjpbImNsb3VkIiwiZHJ1cGFsIl0sImxpY2Vuc2VUeXBlIjoiZGV2ZWxvcG1lbnQiLCJmZWF0dXJlcyI6WyJEUlVQIl0sInZjIjoiOGIzODFmY2EifQ.zPZtVazBxSRSbJNbkTkzggvpV-GTANDa7QgCMQwvUuvBD4ymCNDADr6BVfl9bRJPFJpQX-VxvuLoLsTA_FsN6g"
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
