import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {

    remotePatterns: [

      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

      {
        protocol: "https",
        hostname: "*.supabase.co",
      },

    ],

    formats: [
      "image/avif",
      "image/webp",
    ],

    minimumCacheTTL: 60 * 60 * 24 * 30,

  },

  experimental: {

    optimizePackageImports: [
      "@supabase/supabase-js",
    ],

  },

};

export default nextConfig;