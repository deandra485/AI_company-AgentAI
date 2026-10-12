/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ai-company/types', '@ai-company/shared', 'three'],
  reactStrictMode: true,
};

export default nextConfig;
