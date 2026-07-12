import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  ETOILYS_GOOGLE_MAPS_URL,
  ETOILYS_LOGO_URL,
  ETOILYS_ORGANIZATION_IMAGE_URL,
  STRUCTURED_DATA_IDS,
  buildArticleStructuredData,
  buildPageStructuredData,
  type JsonLdObject,
} from '../content/structuredData';

function getGraph(data: JsonLdObject | null): JsonLdObject[] {
  expect(data).not.toBeNull();
  const graph = data?.['@graph'];
  expect(Array.isArray(graph)).toBe(true);

  return (graph as unknown[]).filter(
    (node): node is JsonLdObject =>
      typeof node === 'object' && node !== null && !Array.isArray(node)
  );
}

function findNodeById(graph: JsonLdObject[], id: string): JsonLdObject {
  const node = graph.find((item) => item['@id'] === id);
  expect(node).toBeDefined();
  return node as JsonLdObject;
}

function findOptionalNodeById(graph: JsonLdObject[], id: string): JsonLdObject | undefined {
  return graph.find((item) => item['@id'] === id);
}

function findNodeByType(graph: JsonLdObject[], type: string): JsonLdObject {
  const node = graph.find((item) => item['@type'] === type);
  expect(node).toBeDefined();
  return node as JsonLdObject;
}

function countNodesById(graph: JsonLdObject[], id: string): number {
  return graph.filter((item) => item['@id'] === id).length;
}

function asObject(value: unknown): JsonLdObject {
  expect(typeof value).toBe('object');
  expect(value).not.toBeNull();
  expect(Array.isArray(value)).toBe(false);
  return value as JsonLdObject;
}

function asStringArray(value: unknown): string[] {
  expect(Array.isArray(value)).toBe(true);
  return (value as unknown[]).filter((item): item is string => typeof item === 'string');
}

function publicPathFromSiteUrl(url: string): string {
  const pathname = new URL(url).pathname;
  return path.resolve(process.cwd(), 'public', pathname.replace(/^\/+/, ''));
}

describe('structured data graph', () => {
  it('exposes the complete home graph with stable entity ids', () => {
    const graph = getGraph(buildPageStructuredData('/'));
    const organization = findNodeById(graph, STRUCTURED_DATA_IDS.organization);
    const website = findNodeById(graph, STRUCTURED_DATA_IDS.website);
    const service = findNodeById(graph, STRUCTURED_DATA_IDS.serviceClassification);
    const certification = findNodeById(graph, STRUCTURED_DATA_IDS.cofracAccreditation);

    expect(countNodesById(graph, STRUCTURED_DATA_IDS.organization)).toBe(1);
    expect(countNodesById(graph, STRUCTURED_DATA_IDS.cofracAccreditation)).toBe(1);
    expect(organization['@type']).toBe('Organization');
    expect(organization.foundingDate).toBe('2025-01-08');
    expect(organization.areaServed).toBeUndefined();
    expect(organization.iso6523Code).toBe('0009:93933080900012');
    expect(String(organization.iso6523Code)).toMatch(/^\d{4}:[A-Z0-9]+$/);
    expect(asStringArray(asObject(organization.contactPoint).availableLanguage)).toEqual([
      'fr',
      'en',
    ]);
    expect(asStringArray(organization.sameAs)).toEqual([
      ETOILYS_GOOGLE_MAPS_URL,
      'https://www.linkedin.com/company/etoilys-classement/',
      'https://annuaire-entreprises.data.gouv.fr/entreprise/939330809',
    ]);
    expect(JSON.stringify(organization.sameAs)).not.toContain('google.com/search');
    expect(JSON.stringify(organization.sameAs)).not.toContain('kgmid');

    const identifiers = (organization.identifier as JsonLdObject[]) ?? [];
    expect(identifiers.map((identifier) => identifier.value)).toEqual([
      '939330809',
      '93933080900012',
    ]);
    expect(JSON.stringify(identifiers)).not.toContain('3-2394');

    expect(asObject(website.publisher)['@id']).toBe(STRUCTURED_DATA_IDS.organization);
    expect(asObject(service.provider)['@id']).toBe(STRUCTURED_DATA_IDS.organization);
    expect(service.areaServed).toBe('Dordogne, Gironde et Lot-et-Garonne');
    expect(service.offers).toBeUndefined();

    expect(certification.certificationIdentification).toBe('3-2394');
    expect(certification.certificationStatus).toBe('https://schema.org/CertificationActive');
    expect(asObject(certification.about)['@id']).toBe(STRUCTURED_DATA_IDS.organization);
    expect(asObject(certification.issuedBy).name).toBe('Comité français d’accréditation');
    expect(certification.validFrom).toBe('2026-03-01');
    expect(certification.expires).toBe('2030-02-28');
  });

  it('keeps classification and service pages page-aware', () => {
    const classificationGraph = getGraph(buildPageStructuredData('/classement'));
    const servicePageGraph = getGraph(buildPageStructuredData('/procedure'));

    expect(
      findNodeById(classificationGraph, STRUCTURED_DATA_IDS.organization).legalName
    ).toBeUndefined();
    expect(findOptionalNodeById(classificationGraph, STRUCTURED_DATA_IDS.website)).toBeUndefined();
    expect(
      findNodeById(classificationGraph, STRUCTURED_DATA_IDS.serviceClassification)
    ).toBeDefined();
    expect(
      findNodeById(classificationGraph, STRUCTURED_DATA_IDS.cofracAccreditation)
    ).toBeDefined();

    expect(
      findNodeById(servicePageGraph, STRUCTURED_DATA_IDS.organization).legalName
    ).toBeUndefined();
    expect(findOptionalNodeById(servicePageGraph, STRUCTURED_DATA_IDS.website)).toBeUndefined();
    expect(findNodeById(servicePageGraph, STRUCTURED_DATA_IDS.serviceClassification)).toBeDefined();
    expect(
      servicePageGraph.some((node) => node['@id'] === STRUCTURED_DATA_IDS.cofracAccreditation)
    ).toBe(false);
  });

  it('exposes global structured data on completed Dutch pages', () => {
    const homeGraph = getGraph(buildPageStructuredData('/nl'));
    const classificationGraph = getGraph(
      buildPageStructuredData('/nl/classificatie-vakantiewoning-frankrijk')
    );
    const servicePageGraph = getGraph(
      buildPageStructuredData('/nl/classificatieprocedure-vakantiewoning')
    );
    const privacyGraph = getGraph(buildPageStructuredData('/nl/privacybeleid'));

    expect(findNodeById(homeGraph, STRUCTURED_DATA_IDS.website)).toBeDefined();
    expect(findNodeById(homeGraph, STRUCTURED_DATA_IDS.serviceClassification)).toBeDefined();
    expect(
      findNodeById(classificationGraph, STRUCTURED_DATA_IDS.cofracAccreditation)
    ).toBeDefined();
    expect(findNodeById(servicePageGraph, STRUCTURED_DATA_IDS.serviceClassification)).toBeDefined();
    expect(findNodeById(privacyGraph, STRUCTURED_DATA_IDS.organization)).toBeDefined();
  });

  it('defines canonical article author and publisher nodes on article pages', () => {
    const graph = getGraph(
      buildArticleStructuredData({
        url: 'https://www.etoilys.fr/actualites/example',
        headline: 'Article de test',
        description: 'Description de test.',
        datePublished: '2026-07-10',
        dateModified: '2026-07-10',
        image: 'https://www.etoilys.fr/images/optimized/article-apres-classement-1200.jpg',
        authorName: 'Florian Grisorio',
      })
    );
    const article = findNodeByType(graph, 'BlogPosting');
    const author = findNodeById(graph, STRUCTURED_DATA_IDS.florianGrisorio);
    const publisher = findNodeById(graph, STRUCTURED_DATA_IDS.organization);

    expect(buildPageStructuredData('/actualites/example')).toBeNull();
    expect(countNodesById(graph, STRUCTURED_DATA_IDS.florianGrisorio)).toBe(1);
    expect(countNodesById(graph, STRUCTURED_DATA_IDS.organization)).toBe(1);
    expect(author['@type']).toBe('Person');
    expect(author.name).toBe('Florian Grisorio');
    expect(publisher['@type']).toBe('Organization');
    expect(publisher.name).toBe('Etoilys');
    expect(asObject(article.author)['@id']).toBe(STRUCTURED_DATA_IDS.florianGrisorio);
    expect(asObject(article.publisher)['@id']).toBe(STRUCTURED_DATA_IDS.organization);
  });

  it('references local logo and image assets that exist in public', () => {
    expect(existsSync(publicPathFromSiteUrl(ETOILYS_LOGO_URL))).toBe(true);
    expect(existsSync(publicPathFromSiteUrl(ETOILYS_ORGANIZATION_IMAGE_URL))).toBe(true);
  });
});
