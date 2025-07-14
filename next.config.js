/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  // Statische Assets für Sounds
  async rewrites() {
    return [
      {
        source: '/sounds/:path*',
        destination: '/api/sounds/:path*',
      },
    ];
  },
}

module.exports = nextConfig