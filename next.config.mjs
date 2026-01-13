/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Use webpack instead of turbopack for builds
    turbo: undefined,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ak-tekstilsolo.ac.id',
      },
      {
        protocol: 'https',
        hostname: 'new.ak-tekstilsolo.ac.id',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  trailingSlash: true,
};

export default nextConfig;
