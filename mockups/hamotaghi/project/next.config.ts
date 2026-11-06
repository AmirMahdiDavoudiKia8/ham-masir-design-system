import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Tree-shake MUI icon and component barrels.
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
};

export default nextConfig;
