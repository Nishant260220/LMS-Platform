import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    /* domains: [
      "utfs.io"
    ] */
   remotePatterns: [
    {
      protocol: "https",
      hostname: "*.ufs.sh", 
    },
  ],
  }
};

export default nextConfig;
 