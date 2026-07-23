export type ImageAssetKey =
  | 'homeHero'
  | 'homeProcedure'
  | 'pourquoiReferencement'
  | 'recrutementInspection'
  | 'simulateurClassement'
  | 'simulateurTaxeSejour'
  | 'simulateurFiscalClassement'
  | 'articleMeubles20252026'
  | 'articleMicroBic2026'
  | 'articleResidence90Jours'
  | 'articleCoproprieteReglement'
  | 'articleTaxeDeSejour2026'
  | 'articleMeubleClasseNonClasse'
  | 'articleFacturationElectronique2026'
  | 'articleDpeMeublesTourisme'
  | 'articleApiMeubles'
  | 'articleTransmissionDonnees'
  | 'articleApresClassement'
  | 'articlePreparerVisiteClassement'
  | 'dordogneHero'
  | 'dordogneInterior'
  | 'dordogneLandscape'
  | 'girondeHero'
  | 'girondeTerritory'
  | 'girondeCoast'
  | 'lotEtGaronneHero'
  | 'lotEtGaronneTerritory'
  | 'lotEtGaronneCanal'
  | 'bergeracHero';

export interface ImageManifestEntry {
  width: number;
  height: number;
  src: string;
  srcSetWebp: string;
  srcSetAvif: string;
}

export const IMAGE_MANIFEST: Record<ImageAssetKey, ImageManifestEntry> = {
  homeHero: {
    width: 8806,
    height: 3257,
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
  recrutementInspection: {
    width: 3066,
    height: 3066,
    src: '/images/optimized/AdobeStock_31855482-1200.jpg',
    srcSetWebp:
      '/images/optimized/AdobeStock_31855482-480.webp 480w, /images/optimized/AdobeStock_31855482-768.webp 768w, /images/optimized/AdobeStock_31855482-1200.webp 1200w, /images/optimized/AdobeStock_31855482-1600.webp 1600w, /images/optimized/AdobeStock_31855482-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/AdobeStock_31855482-480.avif 480w, /images/optimized/AdobeStock_31855482-768.avif 768w, /images/optimized/AdobeStock_31855482-1200.avif 1200w, /images/optimized/AdobeStock_31855482-1600.avif 1600w, /images/optimized/AdobeStock_31855482-1920.avif 1920w',
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
  articleFacturationElectronique2026: {
    width: 6192,
    height: 4128,
    src: '/images/optimized/sumup-ru18KXzFA4E-unsplash-1200.jpg',
    srcSetWebp:
      '/images/optimized/sumup-ru18KXzFA4E-unsplash-480.webp 480w, /images/optimized/sumup-ru18KXzFA4E-unsplash-768.webp 768w, /images/optimized/sumup-ru18KXzFA4E-unsplash-1200.webp 1200w, /images/optimized/sumup-ru18KXzFA4E-unsplash-1600.webp 1600w, /images/optimized/sumup-ru18KXzFA4E-unsplash-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/sumup-ru18KXzFA4E-unsplash-480.avif 480w, /images/optimized/sumup-ru18KXzFA4E-unsplash-768.avif 768w, /images/optimized/sumup-ru18KXzFA4E-unsplash-1200.avif 1200w, /images/optimized/sumup-ru18KXzFA4E-unsplash-1600.avif 1600w, /images/optimized/sumup-ru18KXzFA4E-unsplash-1920.avif 1920w',
  },
  articleDpeMeublesTourisme: {
    width: 1789,
    height: 2482,
    src: '/images/optimized/pexels-rachel-claire-4846106-1200.jpg',
    srcSetWebp:
      '/images/optimized/pexels-rachel-claire-4846106-480.webp 480w, /images/optimized/pexels-rachel-claire-4846106-768.webp 768w, /images/optimized/pexels-rachel-claire-4846106-1200.webp 1200w, /images/optimized/pexels-rachel-claire-4846106-1600.webp 1600w',
    srcSetAvif:
      '/images/optimized/pexels-rachel-claire-4846106-480.avif 480w, /images/optimized/pexels-rachel-claire-4846106-768.avif 768w, /images/optimized/pexels-rachel-claire-4846106-1200.avif 1200w, /images/optimized/pexels-rachel-claire-4846106-1600.avif 1600w',
  },
  articleApiMeubles: {
    width: 4284,
    height: 5712,
    src: '/images/optimized/pexels-orneiseppi-32486469-1200.jpg',
    srcSetWebp:
      '/images/optimized/pexels-orneiseppi-32486469-480.webp 480w, /images/optimized/pexels-orneiseppi-32486469-768.webp 768w, /images/optimized/pexels-orneiseppi-32486469-1200.webp 1200w, /images/optimized/pexels-orneiseppi-32486469-1600.webp 1600w, /images/optimized/pexels-orneiseppi-32486469-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/pexels-orneiseppi-32486469-480.avif 480w, /images/optimized/pexels-orneiseppi-32486469-768.avif 768w, /images/optimized/pexels-orneiseppi-32486469-1200.avif 1200w, /images/optimized/pexels-orneiseppi-32486469-1600.avif 1600w, /images/optimized/pexels-orneiseppi-32486469-1920.avif 1920w',
  },
  articleTransmissionDonnees: {
    width: 6779,
    height: 2995,
    src: '/images/optimized/article-transmission-donnees-plateformes-1200.jpg',
    srcSetWebp:
      '/images/optimized/article-transmission-donnees-plateformes-480.webp 480w, /images/optimized/article-transmission-donnees-plateformes-768.webp 768w, /images/optimized/article-transmission-donnees-plateformes-1200.webp 1200w, /images/optimized/article-transmission-donnees-plateformes-1600.webp 1600w, /images/optimized/article-transmission-donnees-plateformes-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/article-transmission-donnees-plateformes-480.avif 480w, /images/optimized/article-transmission-donnees-plateformes-768.avif 768w, /images/optimized/article-transmission-donnees-plateformes-1200.avif 1200w, /images/optimized/article-transmission-donnees-plateformes-1600.avif 1600w, /images/optimized/article-transmission-donnees-plateformes-1920.avif 1920w',
  },
  articleApresClassement: {
    width: 7000,
    height: 2961,
    src: '/images/optimized/article-apres-classement-1200.jpg',
    srcSetWebp:
      '/images/optimized/article-apres-classement-480.webp 480w, /images/optimized/article-apres-classement-768.webp 768w, /images/optimized/article-apres-classement-1200.webp 1200w, /images/optimized/article-apres-classement-1600.webp 1600w, /images/optimized/article-apres-classement-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/article-apres-classement-480.avif 480w, /images/optimized/article-apres-classement-768.avif 768w, /images/optimized/article-apres-classement-1200.avif 1200w, /images/optimized/article-apres-classement-1600.avif 1600w, /images/optimized/article-apres-classement-1920.avif 1920w',
  },
  articlePreparerVisiteClassement: {
    width: 1672,
    height: 941,
    src: '/images/optimized/article-preparer-visite-classement-1200.jpg',
    srcSetWebp:
      '/images/optimized/article-preparer-visite-classement-480.webp 480w, /images/optimized/article-preparer-visite-classement-768.webp 768w, /images/optimized/article-preparer-visite-classement-1200.webp 1200w, /images/optimized/article-preparer-visite-classement-1600.webp 1600w',
    srcSetAvif:
      '/images/optimized/article-preparer-visite-classement-480.avif 480w, /images/optimized/article-preparer-visite-classement-768.avif 768w, /images/optimized/article-preparer-visite-classement-1200.avif 1200w, /images/optimized/article-preparer-visite-classement-1600.avif 1600w',
  },
  dordogneHero: {
    width: 5120,
    height: 2880,
    src: '/images/optimized/pexels-slimmars-13-197677686-14298615-1200.jpg',
    srcSetWebp:
      '/images/optimized/pexels-slimmars-13-197677686-14298615-480.webp 480w, /images/optimized/pexels-slimmars-13-197677686-14298615-768.webp 768w, /images/optimized/pexels-slimmars-13-197677686-14298615-1200.webp 1200w, /images/optimized/pexels-slimmars-13-197677686-14298615-1600.webp 1600w, /images/optimized/pexels-slimmars-13-197677686-14298615-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/pexels-slimmars-13-197677686-14298615-480.avif 480w, /images/optimized/pexels-slimmars-13-197677686-14298615-768.avif 768w, /images/optimized/pexels-slimmars-13-197677686-14298615-1200.avif 1200w, /images/optimized/pexels-slimmars-13-197677686-14298615-1600.avif 1600w, /images/optimized/pexels-slimmars-13-197677686-14298615-1920.avif 1920w',
  },
  dordogneInterior: {
    width: 3158,
    height: 2228,
    src: '/images/optimized/jametlene-reskp-0MF_yWx470o-unsplash-1200.jpg',
    srcSetWebp:
      '/images/optimized/jametlene-reskp-0MF_yWx470o-unsplash-480.webp 480w, /images/optimized/jametlene-reskp-0MF_yWx470o-unsplash-768.webp 768w, /images/optimized/jametlene-reskp-0MF_yWx470o-unsplash-1200.webp 1200w, /images/optimized/jametlene-reskp-0MF_yWx470o-unsplash-1600.webp 1600w, /images/optimized/jametlene-reskp-0MF_yWx470o-unsplash-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/jametlene-reskp-0MF_yWx470o-unsplash-480.avif 480w, /images/optimized/jametlene-reskp-0MF_yWx470o-unsplash-768.avif 768w, /images/optimized/jametlene-reskp-0MF_yWx470o-unsplash-1200.avif 1200w, /images/optimized/jametlene-reskp-0MF_yWx470o-unsplash-1600.avif 1600w, /images/optimized/jametlene-reskp-0MF_yWx470o-unsplash-1920.avif 1920w',
  },
  dordogneLandscape: {
    width: 4000,
    height: 6000,
    src: '/images/optimized/le-sixieme-reve-2gjxjF6BjWs-unsplash-1200.jpg',
    srcSetWebp:
      '/images/optimized/le-sixieme-reve-2gjxjF6BjWs-unsplash-480.webp 480w, /images/optimized/le-sixieme-reve-2gjxjF6BjWs-unsplash-768.webp 768w, /images/optimized/le-sixieme-reve-2gjxjF6BjWs-unsplash-1200.webp 1200w, /images/optimized/le-sixieme-reve-2gjxjF6BjWs-unsplash-1600.webp 1600w, /images/optimized/le-sixieme-reve-2gjxjF6BjWs-unsplash-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/le-sixieme-reve-2gjxjF6BjWs-unsplash-480.avif 480w, /images/optimized/le-sixieme-reve-2gjxjF6BjWs-unsplash-768.avif 768w, /images/optimized/le-sixieme-reve-2gjxjF6BjWs-unsplash-1200.avif 1200w, /images/optimized/le-sixieme-reve-2gjxjF6BjWs-unsplash-1600.avif 1600w, /images/optimized/le-sixieme-reve-2gjxjF6BjWs-unsplash-1920.avif 1920w',
  },
  girondeHero: {
    width: 7440,
    height: 3926,
    src: '/images/optimized/axel-delansorne-fSpupJ0C95E-unsplash-1200.jpg',
    srcSetWebp:
      '/images/optimized/axel-delansorne-fSpupJ0C95E-unsplash-480.webp 480w, /images/optimized/axel-delansorne-fSpupJ0C95E-unsplash-768.webp 768w, /images/optimized/axel-delansorne-fSpupJ0C95E-unsplash-1200.webp 1200w, /images/optimized/axel-delansorne-fSpupJ0C95E-unsplash-1600.webp 1600w, /images/optimized/axel-delansorne-fSpupJ0C95E-unsplash-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/axel-delansorne-fSpupJ0C95E-unsplash-480.avif 480w, /images/optimized/axel-delansorne-fSpupJ0C95E-unsplash-768.avif 768w, /images/optimized/axel-delansorne-fSpupJ0C95E-unsplash-1200.avif 1200w, /images/optimized/axel-delansorne-fSpupJ0C95E-unsplash-1600.avif 1600w, /images/optimized/axel-delansorne-fSpupJ0C95E-unsplash-1920.avif 1920w',
  },
  girondeTerritory: {
    width: 3000,
    height: 4000,
    src: '/images/optimized/arpad-czapp-J181eozqAd8-unsplash-1200.jpg',
    srcSetWebp:
      '/images/optimized/arpad-czapp-J181eozqAd8-unsplash-480.webp 480w, /images/optimized/arpad-czapp-J181eozqAd8-unsplash-768.webp 768w, /images/optimized/arpad-czapp-J181eozqAd8-unsplash-1200.webp 1200w, /images/optimized/arpad-czapp-J181eozqAd8-unsplash-1600.webp 1600w, /images/optimized/arpad-czapp-J181eozqAd8-unsplash-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/arpad-czapp-J181eozqAd8-unsplash-480.avif 480w, /images/optimized/arpad-czapp-J181eozqAd8-unsplash-768.avif 768w, /images/optimized/arpad-czapp-J181eozqAd8-unsplash-1200.avif 1200w, /images/optimized/arpad-czapp-J181eozqAd8-unsplash-1600.avif 1600w, /images/optimized/arpad-czapp-J181eozqAd8-unsplash-1920.avif 1920w',
  },
  girondeCoast: {
    width: 6000,
    height: 3830,
    src: '/images/optimized/benjamin-esteves-A_JaVydOsRk-unsplash-1200.jpg',
    srcSetWebp:
      '/images/optimized/benjamin-esteves-A_JaVydOsRk-unsplash-480.webp 480w, /images/optimized/benjamin-esteves-A_JaVydOsRk-unsplash-768.webp 768w, /images/optimized/benjamin-esteves-A_JaVydOsRk-unsplash-1200.webp 1200w, /images/optimized/benjamin-esteves-A_JaVydOsRk-unsplash-1600.webp 1600w, /images/optimized/benjamin-esteves-A_JaVydOsRk-unsplash-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/benjamin-esteves-A_JaVydOsRk-unsplash-480.avif 480w, /images/optimized/benjamin-esteves-A_JaVydOsRk-unsplash-768.avif 768w, /images/optimized/benjamin-esteves-A_JaVydOsRk-unsplash-1200.avif 1200w, /images/optimized/benjamin-esteves-A_JaVydOsRk-unsplash-1600.avif 1600w, /images/optimized/benjamin-esteves-A_JaVydOsRk-unsplash-1920.avif 1920w',
  },
  lotEtGaronneHero: {
    width: 3888,
    height: 2593,
    src: '/images/optimized/AdobeStock_1364523535-1200.jpg',
    srcSetWebp:
      '/images/optimized/AdobeStock_1364523535-480.webp 480w, /images/optimized/AdobeStock_1364523535-768.webp 768w, /images/optimized/AdobeStock_1364523535-1200.webp 1200w, /images/optimized/AdobeStock_1364523535-1600.webp 1600w, /images/optimized/AdobeStock_1364523535-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/AdobeStock_1364523535-480.avif 480w, /images/optimized/AdobeStock_1364523535-768.avif 768w, /images/optimized/AdobeStock_1364523535-1200.avif 1200w, /images/optimized/AdobeStock_1364523535-1600.avif 1600w, /images/optimized/AdobeStock_1364523535-1920.avif 1920w',
  },
  lotEtGaronneTerritory: {
    width: 3456,
    height: 4608,
    src: '/images/optimized/pexels-d-goth-37724280-1200.jpg',
    srcSetWebp:
      '/images/optimized/pexels-d-goth-37724280-480.webp 480w, /images/optimized/pexels-d-goth-37724280-768.webp 768w, /images/optimized/pexels-d-goth-37724280-1200.webp 1200w, /images/optimized/pexels-d-goth-37724280-1600.webp 1600w, /images/optimized/pexels-d-goth-37724280-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/pexels-d-goth-37724280-480.avif 480w, /images/optimized/pexels-d-goth-37724280-768.avif 768w, /images/optimized/pexels-d-goth-37724280-1200.avif 1200w, /images/optimized/pexels-d-goth-37724280-1600.avif 1600w, /images/optimized/pexels-d-goth-37724280-1920.avif 1920w',
  },
  lotEtGaronneCanal: {
    width: 4000,
    height: 2250,
    src: '/images/optimized/AdobeStock_919223785-1200.jpg',
    srcSetWebp:
      '/images/optimized/AdobeStock_919223785-480.webp 480w, /images/optimized/AdobeStock_919223785-768.webp 768w, /images/optimized/AdobeStock_919223785-1200.webp 1200w, /images/optimized/AdobeStock_919223785-1600.webp 1600w, /images/optimized/AdobeStock_919223785-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/AdobeStock_919223785-480.avif 480w, /images/optimized/AdobeStock_919223785-768.avif 768w, /images/optimized/AdobeStock_919223785-1200.avif 1200w, /images/optimized/AdobeStock_919223785-1600.avif 1600w, /images/optimized/AdobeStock_919223785-1920.avif 1920w',
  },
  bergeracHero: {
    width: 6744,
    height: 3372,
    src: '/images/optimized/bergerac-view-late-afternoon-1200.jpg',
    srcSetWebp:
      '/images/optimized/bergerac-view-late-afternoon-480.webp 480w, /images/optimized/bergerac-view-late-afternoon-768.webp 768w, /images/optimized/bergerac-view-late-afternoon-1200.webp 1200w, /images/optimized/bergerac-view-late-afternoon-1600.webp 1600w, /images/optimized/bergerac-view-late-afternoon-1920.webp 1920w',
    srcSetAvif:
      '/images/optimized/bergerac-view-late-afternoon-480.avif 480w, /images/optimized/bergerac-view-late-afternoon-768.avif 768w, /images/optimized/bergerac-view-late-afternoon-1200.avif 1200w, /images/optimized/bergerac-view-late-afternoon-1600.avif 1600w, /images/optimized/bergerac-view-late-afternoon-1920.avif 1920w',
  },
};
