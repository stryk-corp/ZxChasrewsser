import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // Use the default .next build directory so Vercel can find required files
  // (removed custom `distDir: 'main build'` which caused missing
  // .next/routes-manifest.json during deployment)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
