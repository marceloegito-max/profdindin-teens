/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração de imagens
  images: {
    domains: ['placehold.co'],
  },

  // ===== CONFIGURAÇÃO PARA ABACUS.AI =====
  // Output standalone para deploy otimizado
  output: 'standalone',

  // Configurações de build
  eslint: {
    // Avisar sobre erros ESLint mas não bloquear build
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Avisar sobre erros TypeScript mas não bloquear build em desenvolvimento
    ignoreBuildErrors: false,
  },

  // Configurações de performance
  swcMinify: true, // Usar SWC para minificação (mais rápido)
  reactStrictMode: true,

  // Configurações experimentais para otimização
  experimental: {
    // Otimizar bundle do servidor
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Redirects (se necessário)
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
}

module.exports = nextConfig
