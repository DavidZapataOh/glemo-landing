import { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";
import createNextIntlPlugin from "next-intl/plugin";

// The issuer identity is did:web:glemo.io, which W3C resolvers fetch at
// https://glemo.io/.well-known/did.json (the BRAND host, so the identity
// survives API host changes). This site does not own that key: the API does,
// so the path proxies there. Without this rewrite deployed, nothing Glemo
// signs is independently verifiable.
const API_URL = process.env.GLEMO_API_URL ?? "https://api.glemo.io";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/.well-known/did.json",
        destination: `${API_URL}/.well-known/did.json`,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
const withMDX = createMDX();

export default withNextIntl(withMDX(nextConfig));
