import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/d-n",
  images: {
    unoptimized: true
  }
};

export default nextConfig;
