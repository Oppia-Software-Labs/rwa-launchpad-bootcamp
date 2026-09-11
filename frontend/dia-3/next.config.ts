import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Keep the frontend folder as the workspace root (avoid parent lockfile confusion).
    root: path.join(__dirname),
  },
};

export default nextConfig;
