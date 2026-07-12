import { IMAGE_MANIFEST } from './imageManifest';
import { SITE_URL, type BreadcrumbItem } from './seoRoutes';

export type JsonLdObject = Record<string, unknown>;

export interface ArticleStructuredDataInput {
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  image: string;
  authorName: string;
}

export const STRUCTURED_DATA_IDS = {
  organization: `${SITE_URL}/#organization`,
  website: `${SITE_URL}/#website`,
  serviceClassification: `${SITE_URL}/#service-classement-meubles-tourisme`,
  cofracAccreditation: `${SITE_URL}/#cofrac-accreditation-3-2394`,
  florianGrisorio: `${SITE_URL}/#person-florian-grisorio`,
} as const;

export const ETOILYS_LOGO_URL = `${SITE_URL}/logo-etoilys.svg`;
export const ETOILYS_ORGANIZATION_IMAGE_URL = `${SITE_URL}${IMAGE_MANIFEST.homeHero.src}`;
export const ETOILYS_GOOGLE_MAPS_URL =
  'https://www.google.com/maps/place/Etoilys/@44.7878856,0.2862321,199196m/data=!3m2!1e3!4b1!4m6!3m5!1s0x6730df7915ec7283:0x628d60fdd2c1dc09!8m2!3d44.7878856!4d0.286232!16s%2Fg%2F11z5n62vbq';
export const ETOILYS_LINKEDIN_URL = 'https://www.linkedin.com/company/etoilys-classement/';
export const ETOILYS_ANNUAIRE_ENTREPRISE_URL =
  'https://annuaire-entreprises.data.gouv.fr/entreprise/939330809';
export const ETOILYS_ANNUAIRE_ETABLISSEMENT_URL =
  'https://annuaire-entreprises.data.gouv.fr/etablissement/93933080900012';
export const ETOILYS_COFRAC_CERTIFICATE_URL = 'https://tools.cofrac.fr/annexes/sect3/3-2394.pdf';

const CLASSIFICATION_AREA_SERVED =
  'Dordogne, Gironde, Lot-et-Garonne et secteurs proches de Bergerac';

const HOME_GRAPH_PATHS = new Set(['/', '/en', '/nl']);
const CLASSIFICATION_GRAPH_PATHS = new Set([
  '/classement',
  '/en/furnished-tourist-accommodation-classification',
  '/nl/classificatie-vakantiewoning-frankrijk',
]);
const SERVICE_COMPACT_GRAPH_PATHS = new Set([
  '/les-avantages-du-classement',
  '/prerequis-au-classement',
  '/procedure',
  '/zones-intervention',
  '/classement-meuble-tourisme-dordogne',
  '/classement-meuble-tourisme-gironde',
  '/classement-meuble-tourisme-lot-et-garonne',
  '/demande-classement',
  '/contact',
  '/en/benefits-of-furnished-tourist-accommodation-classification',
  '/en/classification-requirements',
  '/en/classification-process',
  '/en/request-a-classification',
  '/en/contact',
  '/nl/voordelen-classificatie-vakantiewoning',
  '/nl/voorwaarden-classificatie-vakantiewoning',
  '/nl/classificatieprocedure-vakantiewoning',
  '/nl/classificatie-aanvragen',
  '/nl/contact',
]);
const ORGANIZATION_COMPACT_GRAPH_PATHS = new Set([
  '/mentions-legales',
  '/confidentialite',
  '/en/privacy-policy',
  '/nl/privacybeleid',
]);

const STRUCTURED_DATA_AUTHORS = {
  'Florian Grisorio': {
    id: STRUCTURED_DATA_IDS.florianGrisorio,
    name: 'Florian Grisorio',
  },
} as const;

function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  if (pathname === '/') return pathname;
  return pathname.replace(/\/+$/, '') || '/';
}

function logoImageObject(): JsonLdObject {
  return {
    '@type': 'ImageObject',
    url: ETOILYS_LOGO_URL,
  };
}

function idReference(id: string): JsonLdObject {
  return { '@id': id };
}

function buildPostalAddress(): JsonLdObject {
  return {
    '@type': 'PostalAddress',
    streetAddress: '1345 route de Dautres',
    postalCode: '24150',
    addressLocality: 'Mauzac-et-Grand-Castang',
    addressCountry: 'FR',
  };
}

function buildOrganizationIdentifiers(): JsonLdObject[] {
  return [
    {
      '@type': 'PropertyValue',
      propertyID: 'SIREN',
      value: '939330809',
      url: ETOILYS_ANNUAIRE_ENTREPRISE_URL,
    },
    {
      '@type': 'PropertyValue',
      propertyID: 'SIRET',
      value: '93933080900012',
      url: ETOILYS_ANNUAIRE_ETABLISSEMENT_URL,
    },
  ];
}

function buildCompactOrganization(options: { includeCertification?: boolean } = {}): JsonLdObject {
  const organization: JsonLdObject = {
    '@id': STRUCTURED_DATA_IDS.organization,
    '@type': 'Organization',
    name: 'Etoilys',
    url: `${SITE_URL}/`,
    logo: logoImageObject(),
  };

  if (options.includeCertification === true) {
    organization.hasCertification = idReference(STRUCTURED_DATA_IDS.cofracAccreditation);
  }

  return organization;
}

function buildDetailedOrganization(): JsonLdObject {
  return {
    ...buildCompactOrganization({ includeCertification: true }),
    legalName: 'ETOILYS',
    description:
      'Organisme d’inspection accrédité Cofrac pour le classement officiel des meublés de tourisme.',
    image: ETOILYS_ORGANIZATION_IMAGE_URL,
    email: 'contact@etoilys.fr',
    telephone: '+33649551540',
    foundingDate: '2025-01-08',
    identifier: buildOrganizationIdentifiers(),
    iso6523Code: '0009:93933080900012',
    sameAs: [ETOILYS_GOOGLE_MAPS_URL, ETOILYS_LINKEDIN_URL, ETOILYS_ANNUAIRE_ENTREPRISE_URL],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: '+33649551540',
      email: 'contact@etoilys.fr',
      availableLanguage: ['fr', 'en', 'nl'],
    },
    address: buildPostalAddress(),
  };
}

function buildWebsite(): JsonLdObject {
  return {
    '@id': STRUCTURED_DATA_IDS.website,
    '@type': 'WebSite',
    name: 'Etoilys',
    url: `${SITE_URL}/`,
    publisher: idReference(STRUCTURED_DATA_IDS.organization),
  };
}

function buildCofracOrganization(): JsonLdObject {
  return {
    '@type': 'Organization',
    name: 'Comité français d’accréditation',
    alternateName: 'Cofrac',
    url: 'https://www.cofrac.fr/',
  };
}

function buildCofracCertification(): JsonLdObject {
  return {
    '@id': STRUCTURED_DATA_IDS.cofracAccreditation,
    '@type': 'Certification',
    name: 'Accréditation Cofrac Inspection n°3-2394',
    certificationIdentification: '3-2394',
    certificationStatus: 'https://schema.org/CertificationActive',
    validFrom: '2026-03-01',
    expires: '2030-02-28',
    url: ETOILYS_COFRAC_CERTIFICATE_URL,
    about: idReference(STRUCTURED_DATA_IDS.organization),
    issuedBy: buildCofracOrganization(),
  };
}

function buildClassificationService(): JsonLdObject {
  return {
    '@id': STRUCTURED_DATA_IDS.serviceClassification,
    '@type': 'Service',
    name: 'Classement officiel des meublés de tourisme',
    description:
      'Visite de classement officiel des meublés de tourisme réalisée par Etoilys dans le cadre de son accréditation Cofrac Inspection.',
    serviceType: 'Classement officiel des meublés de tourisme',
    provider: idReference(STRUCTURED_DATA_IDS.organization),
    url: `${SITE_URL}/classement`,
    areaServed: CLASSIFICATION_AREA_SERVED,
  };
}

function buildPerson(authorName: string): JsonLdObject {
  const author = STRUCTURED_DATA_AUTHORS[authorName as keyof typeof STRUCTURED_DATA_AUTHORS];

  if (author) {
    return {
      '@id': author.id,
      '@type': 'Person',
      name: author.name,
    };
  }

  return {
    '@type': 'Person',
    name: authorName,
  };
}

function getAuthorId(authorName: string): string | null {
  return STRUCTURED_DATA_AUTHORS[authorName as keyof typeof STRUCTURED_DATA_AUTHORS]?.id ?? null;
}

function graphData(nodes: JsonLdObject[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}

function isArticlePath(pathname: string): boolean {
  return pathname.startsWith('/actualites/') && pathname !== '/actualites';
}

export function buildPageStructuredData(pathname: string): JsonLdObject | null {
  const normalizedPath = normalizePath(pathname);

  if (isArticlePath(normalizedPath)) {
    return null;
  }

  if (HOME_GRAPH_PATHS.has(normalizedPath)) {
    return graphData([
      buildDetailedOrganization(),
      buildWebsite(),
      buildClassificationService(),
      buildCofracCertification(),
    ]);
  }

  if (CLASSIFICATION_GRAPH_PATHS.has(normalizedPath)) {
    return graphData([
      buildCompactOrganization({ includeCertification: true }),
      buildClassificationService(),
      buildCofracCertification(),
    ]);
  }

  if (SERVICE_COMPACT_GRAPH_PATHS.has(normalizedPath)) {
    return graphData([buildCompactOrganization(), buildClassificationService()]);
  }

  if (ORGANIZATION_COMPACT_GRAPH_PATHS.has(normalizedPath)) {
    return graphData([buildCompactOrganization()]);
  }

  return null;
}

export function buildBreadcrumbStructuredData(items: BreadcrumbItem[]): JsonLdObject | null {
  if (items.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildArticleStructuredData(input: ArticleStructuredDataInput): JsonLdObject {
  const authorId = getAuthorId(input.authorName);
  const authorNode = buildPerson(input.authorName);
  const authorReference = authorId ? idReference(authorId) : authorNode;

  return graphData([
    {
      '@id': `${input.url}#article`,
      '@type': 'BlogPosting',
      headline: input.headline,
      description: input.description,
      datePublished: input.datePublished,
      dateModified: input.dateModified,
      image: input.image,
      author: authorReference,
      publisher: idReference(STRUCTURED_DATA_IDS.organization),
      mainEntityOfPage: input.url,
    },
    authorNode,
    buildCompactOrganization(),
  ]);
}
