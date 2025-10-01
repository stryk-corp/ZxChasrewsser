import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // output the build into a folder named 'main build' per request
  distDir: 'main build',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
