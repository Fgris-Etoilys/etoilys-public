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
  routes: [
    // Headers must run before terminal redirects, localized 404s and API rewrites.
    {
      src: '/(.*)',
      headers: {
        'Strict-Transport-Security': 'max-age=31536000',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      },
      continue: true,
    },
    {
      src: '/documents/clients/(.*)',
      headers: { 'X-Robots-Tag': 'noindex' },
      continue: true,
    },
    {
      src: '/email-signatures/(.*)',
      headers: {
        'X-Robots-Tag': 'noindex, noimageindex, nosnippet, noarchive',
        'Cache-Control': 'public, max-age=86400',
      },
      continue: true,
    },
    // Equivalent to trailingSlash: false, without mixing routing formats.
    {
      src: '^/(.*)/$',
      headers: { Location: '/$1' },
      status: 308,
    },
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
    {
      src: '/api/public/forms/contact',
      dest: `${publicApiBaseUrl}/public/forms/contact`,
    },
    {
      src: '/api/public/forms/classement',
      dest: `${publicApiBaseUrl}/public/forms/classement`,
    },
    {
      src: '/api/public/simulations',
      dest: `${publicApiBaseUrl}/public/simulations`,
    },
    {
      src: '/api/public/simulations/(.*)',
      dest: `${publicApiBaseUrl}/public/simulations/$1`,
    },
    {
      src: '/api/public/communes',
      dest: `${publicApiBaseUrl}/public/communes`,
    },
    {
      src: '/api/public/communes/([^/]+)',
      dest: `${publicApiBaseUrl}/public/communes/$1`,
    },
    {
      src: '/simulateur/([^/]+)',
      dest: '/simulation-noindex.html',
    },
  ],
} satisfies VercelConfig;
