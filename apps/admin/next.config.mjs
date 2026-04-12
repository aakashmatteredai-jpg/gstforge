/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@gstforge/ui", "@gstforge/utils", "@gstforge/types", "@gstforge/prisma"],
};

export default nextConfig;
