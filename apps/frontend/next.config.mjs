/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@gstforge/ui", "@gstforge/utils", "@gstforge/types", "@gstforge/prisma"],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
