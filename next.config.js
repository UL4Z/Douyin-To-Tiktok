/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['p16-sign-va.tiktokcdn.com', 'p77-sign-va.tiktokcdn.com'],
  },
  webpack: (config) => {
    config.externals.push('better-sqlite3');
    return config;
  },
}

module.exports = nextConfig
