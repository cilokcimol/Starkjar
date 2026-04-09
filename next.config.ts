import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["starkzap"],
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
    };

    config.resolve.alias = {
      ...config.resolve.alias,
      "@hyperlane-xyz/registry": false,
      "@hyperlane-xyz/sdk": false,
      "@hyperlane-xyz/utils": false,
      "@fatsolutions/tongo-sdk": false,
      "@solana/web3.js": false,
      "@cartridge/controller": false,
      "@farcaster/mini-app-solana": false,
    };

    return config;
  },
};

export default nextConfig;
