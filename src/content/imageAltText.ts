import type { Locale } from '../i18n/locales';
import type { ImageAssetKey } from './imageManifest';

/**
 * Canonical alt text of images that can be exposed as a page preferred image
 * (`og:image`, article JSON-LD `image`, Actualités cards).
 *
 * An alt describes what is visible in the image, not the page that uses it
 * (Open Graph `og:image:alt`, Google Image SEO). It is keyed by image asset and
 * localized because the same asset can be shared by several routes and locales.
 */
type ImageAltText = {
  readonly fr: string;
  readonly en?: string;
  readonly nl?: string;
};

export const IMAGE_ALT_TEXT = {
  homeHero: {
    fr: 'Terrasse en bois avec fauteuils blancs et table basse ronde, face à une piscine, une pelouse et des montagnes',
    en: 'Wooden terrace with white armchairs and a round coffee table, facing a pool, a lawn and mountains',
    nl: 'Houten terras met witte fauteuils en een ronde salontafel, met zicht op een zwembad, een gazon en bergen',
  },
  pourquoiReferencement: {
    fr: 'Façades contemporaines blanches avec grandes baies vitrées et balcons en verre',
    en: 'White contemporary facades with large windows and glass balconies',
    nl: 'Witte moderne gevels met grote ramen en glazen balkons',
  },
  recrutementInspection: {
    fr: 'Maison aux volets bleu clair et toit de tuiles, avec piscine et chaise longue',
  },
  simulateurClassement: {
    fr: 'Maisons en bois sur une côte rocheuse au bord de l’eau, avec le texte « Etoilys – Simulateur de classement – Meublé de tourisme »',
  },
  simulateurTaxeSejour: {
    fr: 'Façades en pierre le long d’une rue de village, avec le texte « Etoilys – Simulateur taxe de séjour – Classé vs non classé »',
    en: 'Stone house fronts along a village street, with the French text “Etoilys – Simulateur taxe de séjour – Classé vs non classé”',
  },
  simulateurFiscalClassement: {
    fr: 'Mains tenant un formulaire fiscal et un stylo près d’une calculatrice, avec le texte « Etoilys – Simulateur fiscal 2026 – Classé vs non classé »',
    en: 'Hands holding a tax form and a pen beside a calculator, with the French text “Etoilys – Simulateur fiscal 2026 – Classé vs non classé”',
  },
  articleMeubles20252026: {
    fr: 'Séjour lumineux avec canapé d’angle beige, table basse ronde, tapis et escalier blanc',
  },
  articleMicroBic2026: {
    fr: 'Formulaires fiscaux, carte portant le mot « Taxes », crayon et calculatrice orange sur une surface en marbre',
  },
  articleResidence90Jours: {
    fr: 'Fauteuil clair à coussins, mur de briques, étagères en bois et panier tressé',
  },
  articleCoproprieteReglement: {
    fr: 'Immeubles résidentiels récents avec balcons, le long d’une allée bordée d’espaces verts',
  },
  articleTaxeDeSejour2026: {
    fr: 'Village de pierre perché sur une colline, éclairé par une lumière dorée',
  },
  articleMeubleClasseNonClasse: {
    fr: 'Lit au couvre-lit en lin beige, table de chevet en bois avec lampe blanche et chaussons sur un parquet',
  },
  articleFacturationElectronique2026: {
    fr: 'Mains sur le clavier d’un ordinateur portable affichant un formulaire, sur un bureau avec papiers, trombones et plantes',
  },
  articleDpeMeublesTourisme: {
    fr: 'Salon avec canapé d’angle gris, table basse en bois, fauteuil bleu et photographie de plage encadrée',
  },
  articleApiMeubles: {
    fr: 'Mer turquoise et front de mer d’une ville côtière vus entre des palmiers',
  },
  articleTransmissionDonnees: {
    fr: 'Toits de tuiles et clocher d’une ville portuaire, face à une baie bordée de collines',
  },
  articleApresClassement: {
    fr: 'Chambre contemporaine avec placards bleu nuit, lit double, banquette et grande baie vitrée',
  },
  articlePreparerVisiteClassement: {
    fr: 'Table en bois dressée avec assiettes, verres, carafe et brochures illustrées, devant un canapé gris et une cuisine ouverte',
  },
  articleRipostVoyageurRefuseQuitter: {
    fr: 'Homme tenant un dossier « Procédure administrative » face à un homme debout sur le pas d’une porte à côté d’une valise, près d’une plaque « Meublé de tourisme »',
  },
  articlePlf2027MeublesTourisme: {
    fr: 'Calculatrice, stylo et documents avec graphiques sur une table en bois, dans un séjour ouvert sur une terrasse avec vue sur la mer',
  },
  dordogneLaRoqueGageac: {
    fr: 'Les maisons de pierre de La Roque-Gageac au bord de la Dordogne',
  },
  bergeracHero: {
    fr: 'Vue sur la Dordogne et le quai Cyrano à Bergerac en fin d’après-midi',
  },
  girondeHero: {
    fr: 'Vue de Saint-Émilion en Gironde',
  },
  bordeauxHero: {
    fr: 'Place de la Bourse et miroir d’eau à Bordeaux',
  },
  bassinArcachonHero: {
    fr: 'Cabanes tchanquées sur l’île aux Oiseaux dans le Bassin d’Arcachon',
  },
  medocAtlantiqueHero: {
    fr: 'Étang de Lacanau dans le Médoc Atlantique',
  },
  lotEtGaronneHero: {
    fr: 'Nérac et son pont sur la Baïse',
  },
  lotHero: {
    fr: 'Vue sur la vallée du Lot depuis Saint-Cirq-Lapopie',
  },
  cahorsValleeLotHero: {
    fr: 'Vue panoramique de Cahors depuis le Mont Saint-Cyr',
  },
  valleeDordogneHero: {
    fr: 'Dordogne entre Lacave et Pinsac dans le Lot',
  },
  figeacGrandFigeacHero: {
    fr: 'Place des Écritures à Figeac dans le Lot',
  },
  aveyronHero: {
    fr: 'Village de Belcastel et château au bord de la rivière Aveyron',
  },
} as const satisfies Partial<Record<ImageAssetKey, ImageAltText>>;

export type DescribedImageAssetKey = keyof typeof IMAGE_ALT_TEXT;

export function getImageAltText(key: DescribedImageAssetKey, locale: Locale): string | undefined {
  const altText: ImageAltText = IMAGE_ALT_TEXT[key];
  return altText[locale];
}
