import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // O cache de filesystem do Turbopack (padrão desde o 16.1) corrompia a
    // descoberta de rotas no dev neste ambiente: rotas aninhadas sob
    // [peladaId] sumiam da árvore após a compactação do cache, gerando 404.
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;
