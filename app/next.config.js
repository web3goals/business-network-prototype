/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }; // Fix for RainbowKit
    return config;
  },
  transpilePackages: ["@lens-protocol"],
};

module.exports = nextConfig;
