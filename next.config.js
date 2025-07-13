/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [], // Add allowed image domains here if needed
  },
  // Configure for static export if needed
  output: 'standalone',
  // Ensure proper TypeScript handling
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: false,
  },
  // Add custom webpack config if needed
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;