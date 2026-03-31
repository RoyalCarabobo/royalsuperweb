/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rivpuyxchzzlaktgzplj.supabase.co'
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
