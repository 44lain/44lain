/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['10.0.0.100'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.scdn.co' },
    ],
  },
}

export default nextConfig
