// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: '*.supabase.co',
//         port: '',
//         pathname: '/storage/v1/object/public/**',
//       },
//     ],
//   },
//   experimental: {
//     serverActions: {
//       allowedOrigins: ['*'],
//     },
//   },
// }

// module.exports = nextConfig


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig