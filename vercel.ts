import type { VercelConfig } from '@vercel/config/v1';

const getPublicApiBaseUrl = (): string => {
  switch (process.env.VERCEL_ENV) {
    case 'production':
      return 'https://api-prod.etoilys.fr';
    case 'preview':
    case 'development':
      return 'https://api-dev.etoilys.fr';
    default:
      throw new Error('VERCEL_ENV must be production, preview or development.');
  }
};

const publicApiBaseUrl = getPublicApiBaseUrl();

export const config = {
  buildCommand: 'npm run build:seo',
  outputDirectory: 'dist',
  trailingSlash: false,
  routes: [
    {
      src: '/en/(?!(furnished-tourist-accommodation-classification|benefits-of-furnished-tourist-accommodation-classification|classification-requirements|classification-process|faq|contact|request-a-classification|privacy-policy|tourist-tax-simulator|furnished-tourist-accommodation-tax-simulator|articles/prepare-holiday-rental-star-rating-inspection)/?$).+',
      dest: '/en/404.html',
      status: 404,
    },
    {
      src: '/nl/(?!(classificatie-vakantiewoning-frankrijk|voordelen-classificatie-vakantiewoning|voorwaarden-classificatie-vakantiewoning|classificatieprocedure-vakantiewoning|faq|contact|classificatie-aanvragen|privacybeleid|artikelen/vakantiewoning-voorbereiden-inspectiebezoek-sterrenclassificatie)/?$).+',
      dest: '/nl/404.html',
      status: 404,
    },
  ],
  headers: [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), payment=()',
        },
      ],
    },
    {
      source: '/documents/clients/(.*)',
      headers: [
        {
          key: 'X-Robots-Tag',
          value: 'noindex',
        },
      ],
    },
    {
      source: '/email-signatures/(.*)',
      headers: [
        {
          key: 'X-Robots-Tag',
          value: 'noindex, noimageindex, nosnippet, noarchive',
        },
        {
          key: 'Cache-Control',
          value: 'public, max-age=86400',
        },
      ],
    },
  ],
  rewrites: [
    {
      source: '/api/public/forms/contact',
      destination: `${publicApiBaseUrl}/public/forms/contact`,
    },
    {
      source: '/api/public/forms/classement',
      destination: `${publicApiBaseUrl}/public/forms/classement`,
    },
    {
      source: '/api/public/simulations',
      destination: `${publicApiBaseUrl}/public/simulations`,
    },
    {
      source: '/api/public/simulations/:path*',
      destination: `${publicApiBaseUrl}/public/simulations/:path*`,
    },
    {
      source: '/api/public/communes',
      destination: `${publicApiBaseUrl}/public/communes`,
    },
    {
      source: '/api/public/communes/:codeInsee',
      destination: `${publicApiBaseUrl}/public/communes/:codeInsee`,
    },
    {
      source: '/simulateur/:simulationId',
      destination: '/simulation-noindex.html',
    },
  ],
} satisfies VercelConfig;
