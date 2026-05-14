export type ImageAssetKey =
  | 'homeHero'
  | 'homeProcedure'
  | 'pourquoiReferencement'
  | 'simulateurClassement'
  | 'simulateurTaxeSejour'
  | 'simulateurFiscalClassement'
  | 'articleMeubles20252026'
  | 'articleMicroBic2026'
  | 'articleResidence90Jours'
  | 'articleCoproprieteReglement'
  | 'articleTaxeDeSejour2026'
  | 'articleMeubleClasseNonClasse';

export interface ImageManifestEntry {
  width: number;
  height: number;
  src: string;
  srcSetWebp: string;
  srcSetAvif: string;
}

export const IMAGE_MANIFEST: Record<ImageAssetKey, ImageManifestEntry> = {
  homeHero: {
    width: 1920,
    height: 1080,
    src: '/images/optimized/home-hero-1200.jpg',
    srcSetWebp:
      '/images/optimized/home-hero-480.webp 480w, /images/optimized/home-hero-768.webp 768w, /images/optimized/home-hero-1200.webp 1200w, /images/optimized/home-hero-1600.webp 1600w, /images/optimized/home-hero-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/home-hero-480.avif 480w, /images/optimized/home-hero-768.avif 768w, /images/optimized/home-hero-1200.avif 1200w, /images/optimized/home-hero-1600.avif 1600w, /images/optimized/home-hero-1920.avif 1920w',
  },
  homeProcedure: {
    width: 1920,
    height: 1282,
    src: '/images/optimized/home-procedure-1200.jpg',
    srcSetWebp:
      '/images/optimized/home-procedure-480.webp 480w, /images/optimized/home-procedure-768.webp 768w, /images/optimized/home-procedure-1200.webp 1200w, /images/optimized/home-procedure-1600.webp 1600w, /images/optimized/home-procedure-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/home-procedure-480.avif 480w, /images/optimized/home-procedure-768.avif 768w, /images/optimized/home-procedure-1200.avif 1200w, /images/optimized/home-procedure-1600.avif 1600w, /images/optimized/home-procedure-1920.avif 1920w',
  },
  pourquoiReferencement: {
    width: 1920,
    height: 1238,
    src: '/images/optimized/pourquoi-referencement-1200.jpg',
    srcSetWebp:
      '/images/optimized/pourquoi-referencement-480.webp 480w, /images/optimized/pourquoi-referencement-768.webp 768w, /images/optimized/pourquoi-referencement-1200.webp 1200w, /images/optimized/pourquoi-referencement-1600.webp 1600w, /images/optimized/pourquoi-referencement-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/pourquoi-referencement-480.avif 480w, /images/optimized/pourquoi-referencement-768.avif 768w, /images/optimized/pourquoi-referencement-1200.avif 1200w, /images/optimized/pourquoi-referencement-1600.avif 1600w, /images/optimized/pourquoi-referencement-1920.avif 1920w',
  },
  simulateurClassement: {
    width: 1200,
    height: 630,
    src: '/images/optimized/simulateur-classement-og-1200.jpg',
    srcSetWebp:
      '/images/optimized/simulateur-classement-og-480.webp 480w, /images/optimized/simulateur-classement-og-768.webp 768w, /images/optimized/simulateur-classement-og-1200.webp 1200w, /images/optimized/simulateur-classement-og-1600.webp 1600w, /images/optimized/simulateur-classement-og-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/simulateur-classement-og-480.avif 480w, /images/optimized/simulateur-classement-og-768.avif 768w, /images/optimized/simulateur-classement-og-1200.avif 1200w, /images/optimized/simulateur-classement-og-1600.avif 1600w, /images/optimized/simulateur-classement-og-1920.avif 1920w',
  },
  simulateurTaxeSejour: {
    width: 1200,
    height: 630,
    src: '/images/optimized/simulateur-taxe-sejour-og-1200.jpg',
    srcSetWebp:
      '/images/optimized/simulateur-taxe-sejour-og-480.webp 480w, /images/optimized/simulateur-taxe-sejour-og-768.webp 768w, /images/optimized/simulateur-taxe-sejour-og-1200.webp 1200w, /images/optimized/simulateur-taxe-sejour-og-1600.webp 1600w, /images/optimized/simulateur-taxe-sejour-og-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/simulateur-taxe-sejour-og-480.avif 480w, /images/optimized/simulateur-taxe-sejour-og-768.avif 768w, /images/optimized/simulateur-taxe-sejour-og-1200.avif 1200w, /images/optimized/simulateur-taxe-sejour-og-1600.avif 1600w, /images/optimized/simulateur-taxe-sejour-og-1920.avif 1920w',
  },
  simulateurFiscalClassement: {
    width: 1200,
    height: 630,
    src: '/images/optimized/simulateur-fiscal-classement-og-1200.jpg',
    srcSetWebp:
      '/images/optimized/simulateur-fiscal-classement-og-480.webp 480w, /images/optimized/simulateur-fiscal-classement-og-768.webp 768w, /images/optimized/simulateur-fiscal-classement-og-1200.webp 1200w, /images/optimized/simulateur-fiscal-classement-og-1600.webp 1600w, /images/optimized/simulateur-fiscal-classement-og-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/simulateur-fiscal-classement-og-480.avif 480w, /images/optimized/simulateur-fiscal-classement-og-768.avif 768w, /images/optimized/simulateur-fiscal-classement-og-1200.avif 1200w, /images/optimized/simulateur-fiscal-classement-og-1600.avif 1600w, /images/optimized/simulateur-fiscal-classement-og-1920.avif 1920w',
  },
  articleMeubles20252026: {
    width: 1920,
    height: 1234,
    src: '/images/optimized/article-meubles-2025-2026-1200.jpg',
    srcSetWebp:
      '/images/optimized/article-meubles-2025-2026-480.webp 480w, /images/optimized/article-meubles-2025-2026-768.webp 768w, /images/optimized/article-meubles-2025-2026-1200.webp 1200w, /images/optimized/article-meubles-2025-2026-1600.webp 1600w, /images/optimized/article-meubles-2025-2026-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/article-meubles-2025-2026-480.avif 480w, /images/optimized/article-meubles-2025-2026-768.avif 768w, /images/optimized/article-meubles-2025-2026-1200.avif 1200w, /images/optimized/article-meubles-2025-2026-1600.avif 1600w, /images/optimized/article-meubles-2025-2026-1920.avif 1920w',
  },
  articleMicroBic2026: {
    width: 1920,
    height: 1280,
    src: '/images/optimized/article-micro-bic-2026-1200.jpg',
    srcSetWebp:
      '/images/optimized/article-micro-bic-2026-480.webp 480w, /images/optimized/article-micro-bic-2026-768.webp 768w, /images/optimized/article-micro-bic-2026-1200.webp 1200w, /images/optimized/article-micro-bic-2026-1600.webp 1600w, /images/optimized/article-micro-bic-2026-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/article-micro-bic-2026-480.avif 480w, /images/optimized/article-micro-bic-2026-768.avif 768w, /images/optimized/article-micro-bic-2026-1200.avif 1200w, /images/optimized/article-micro-bic-2026-1600.avif 1600w, /images/optimized/article-micro-bic-2026-1920.avif 1920w',
  },
  articleResidence90Jours: {
    width: 1920,
    height: 2880,
    src: '/images/optimized/article-residence-90-jours-1200.jpg',
    srcSetWebp:
      '/images/optimized/article-residence-90-jours-480.webp 480w, /images/optimized/article-residence-90-jours-768.webp 768w, /images/optimized/article-residence-90-jours-1200.webp 1200w, /images/optimized/article-residence-90-jours-1600.webp 1600w, /images/optimized/article-residence-90-jours-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/article-residence-90-jours-480.avif 480w, /images/optimized/article-residence-90-jours-768.avif 768w, /images/optimized/article-residence-90-jours-1200.avif 1200w, /images/optimized/article-residence-90-jours-1600.avif 1600w, /images/optimized/article-residence-90-jours-1920.avif 1920w',
  },
  articleCoproprieteReglement: {
    width: 1920,
    height: 1080,
    src: '/images/optimized/article-copropriete-reglement-1200.jpg',
    srcSetWebp:
      '/images/optimized/article-copropriete-reglement-480.webp 480w, /images/optimized/article-copropriete-reglement-768.webp 768w, /images/optimized/article-copropriete-reglement-1200.webp 1200w, /images/optimized/article-copropriete-reglement-1600.webp 1600w, /images/optimized/article-copropriete-reglement-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/article-copropriete-reglement-480.avif 480w, /images/optimized/article-copropriete-reglement-768.avif 768w, /images/optimized/article-copropriete-reglement-1200.avif 1200w, /images/optimized/article-copropriete-reglement-1600.avif 1600w, /images/optimized/article-copropriete-reglement-1920.avif 1920w',
  },
  articleTaxeDeSejour2026: {
    width: 6881,
    height: 4587,
    src: '/images/optimized/article-taxe-sejour-2026-1200.jpg',
    srcSetWebp:
      '/images/optimized/article-taxe-sejour-2026-480.webp 480w, /images/optimized/article-taxe-sejour-2026-768.webp 768w, /images/optimized/article-taxe-sejour-2026-1200.webp 1200w, /images/optimized/article-taxe-sejour-2026-1600.webp 1600w, /images/optimized/article-taxe-sejour-2026-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/article-taxe-sejour-2026-480.avif 480w, /images/optimized/article-taxe-sejour-2026-768.avif 768w, /images/optimized/article-taxe-sejour-2026-1200.avif 1200w, /images/optimized/article-taxe-sejour-2026-1600.avif 1600w, /images/optimized/article-taxe-sejour-2026-1920.avif 1920w',
  },
  articleMeubleClasseNonClasse: {
    width: 1728,
    height: 2592,
    src: '/images/optimized/pexels-rachel-claire-5490384-1200.jpg',
    srcSetWebp:
      '/images/optimized/pexels-rachel-claire-5490384-480.webp 480w, /images/optimized/pexels-rachel-claire-5490384-768.webp 768w, /images/optimized/pexels-rachel-claire-5490384-1200.webp 1200w, /images/optimized/pexels-rachel-claire-5490384-1600.webp 1600w',
    srcSetAvif:
      '/images/optimized/pexels-rachel-claire-5490384-480.avif 480w, /images/optimized/pexels-rachel-claire-5490384-768.avif 768w, /images/optimized/pexels-rachel-claire-5490384-1200.avif 1200w, /images/optimized/pexels-rachel-claire-5490384-1600.avif 1600w',
  },
};
