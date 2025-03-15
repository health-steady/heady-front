/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // 기존 설정이 있다면 유지
  // ...
};

module.exports = nextConfig;
