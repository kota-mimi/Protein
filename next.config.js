/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'thumbnail.image.rakuten.co.jp',
      'tshop.r10s.jp',
      'image.rakuten.co.jp',
      'shopping.c.yimg.jp',
      'auctions.c.yimg.jp',
      'item-shopping.c.yimg.jp',
      'm.media-amazon.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.rakuten.co.jp',
      },
      {
        protocol: 'https',
        hostname: '**.yimg.jp',
      },
      {
        protocol: 'https',
        hostname: '**.amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      }
    ]
  }
};

module.exports = nextConfig;