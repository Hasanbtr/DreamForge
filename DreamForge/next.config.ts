// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/idea-images/**', // Bu satırı kendi bucket adınızla güncelleyin
      },
      {
        protocol: 'https',
        hostname: 'www.gravatar.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos', // Yeni placeholder için ekleyin
        port: '',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;