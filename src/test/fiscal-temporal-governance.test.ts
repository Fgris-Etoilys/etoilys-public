import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { ARTICLE_STRUCTURED_DATA } from '../content/articleStructuredData';
import { actualitesArticlesByRecency } from '../content/actualitesArticles';
import {
  CURRENT_MICRO_BIC_RULES,
  LEGACY_CLASSE_MICRO_BIC_PARAMETERS,
  MICRO_BIC_FISCAL_RULES,
} from '../content/microBicFiscalRules';
import { SEO_ROUTES } from '../content/seoRoutes';

const PUBLIC_FISCAL_CONTENT_FILES = [
  'src/content/pages/homePageContent.ts',
  'src/content/pages/classificationPageContent.ts',
  'src/content/pages/classificationBenefitsPageContent.ts',
  'src/content/pages/faqPageContent.tsx',
  'src/content/localServiceAreas.ts',
  'src/pages/SimulateurFiscalClassement.tsx',
  'src/pages/actualites/MicroBic2026.tsx',
  'src/pages/actualites/MeublesChangements20252026.tsx',
  'src/pages/actualites/MeubleClasseNonClasseSeuils.tsx',
] as const;

const LEGACY_CONTEXT_PATTERN =
  /ancien|anciens|ancienne|obsolète|obsolètes|historique|circuler|plus le bon cadre|plus la bonne lecture|avant la réforme|revenus 2024|en 2024/i;

const SENSITIVE_SNIPPET_THRESHOLD_PATTERN = /(?:77\s?700|83\s?600|188\s?700)\s?(?:€|EUR)|71\s?%/i;

function readProjectFile(relativePath: string): string {
  return readFileSync(path.resolve(process.cwd(), relativePath), 'utf8');
}

function windowsAround(source: string, pattern: RegExp, radius = 260): string[] {
  const matches: string[] = [];
  const globalPattern = new RegExp(
    pattern.source,
    pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`
  );
  let match = globalPattern.exec(source);

  while (match !== null) {
    matches.push(source.slice(Math.max(0, match.index - radius), match.index + radius));
    match = globalPattern.exec(source);
  }

  return matches;
}

describe('fiscal temporal governance', () => {
  it('keeps the current public micro-BIC period aligned with validated 2026 income rules', () => {
    expect(CURRENT_MICRO_BIC_RULES).toBe(MICRO_BIC_FISCAL_RULES.revenus2026Declares2027);
    expect(CURRENT_MICRO_BIC_RULES.labelFr).toBe('revenus 2026 déclarés en 2027');
    expect(CURRENT_MICRO_BIC_RULES.nonClasse).toEqual({
      microBicThreshold: 15_000,
      abattementRate: 0.3,
    });
    expect(CURRENT_MICRO_BIC_RULES.classe).toEqual({
      microBicThreshold: 83_600,
      abattementRate: 0.5,
    });
  });

  it('keeps legacy classified parameters explicitly historical in public fiscal content', () => {
    const legacyThreshold = LEGACY_CLASSE_MICRO_BIC_PARAMETERS.microBicThreshold
      .toLocaleString('fr-FR')
      .replace(/\u202f/g, ' ');
    const legacyAbattement = `${LEGACY_CLASSE_MICRO_BIC_PARAMETERS.abattementRate * 100} %`;
    const legacyPattern = new RegExp(
      `${legacyThreshold.replace(' ', '\\s?')}\\s?€|${legacyAbattement.replace(' ', '\\s?')}`,
      'i'
    );

    PUBLIC_FISCAL_CONTENT_FILES.forEach((filePath) => {
      const source = readProjectFile(filePath);
      const ambiguousWindows = windowsAround(source, legacyPattern).filter(
        (window) => !LEGACY_CONTEXT_PATTERN.test(window)
      );

      expect(ambiguousWindows, filePath).toEqual([]);
    });
  });

  it('keeps classified micro-BIC thresholds tied to their fiscal period in public content', () => {
    const threshold2025Pattern = /77\s?700\s?€/i;
    const threshold2026Pattern = /83\s?600\s?€/i;
    const context2025Pattern =
      /revenus 2025|déclarés en 2026|déclaration 2026|2025 income|declared in 2026/i;
    const context2026Pattern =
      /revenus 2026|déclarés en 2027|recettes 2026|recettes perçues en 2026|2026 income|declared in 2027|revenue earned in 2026/i;

    PUBLIC_FISCAL_CONTENT_FILES.forEach((filePath) => {
      const source = readProjectFile(filePath);
      const ambiguous2025 = windowsAround(source, threshold2025Pattern).filter(
        (window) => !context2025Pattern.test(window)
      );
      const ambiguous2026 = windowsAround(source, threshold2026Pattern).filter(
        (window) => !context2026Pattern.test(window)
      );

      expect(ambiguous2025, `${filePath} has 77 700 € without 2025/2026 context`).toEqual([]);
      expect(ambiguous2026, `${filePath} has 83 600 € without 2026/2027 context`).toEqual([]);
    });
  });

  it('keeps SEO and article snippets free of isolated sensitive fiscal thresholds', () => {
    const seoSnippets = Object.values(SEO_ROUTES).flatMap((route) => [
      route.title,
      route.description,
      route.breadcrumbLabel ?? '',
    ]);
    const articleSnippets = [
      ...ARTICLE_STRUCTURED_DATA.flatMap((article) => [article.headline, article.description]),
      ...actualitesArticlesByRecency.flatMap((article) => [article.title, article.excerpt]),
    ];

    [...seoSnippets, ...articleSnippets].forEach((snippet) => {
      expect(snippet).not.toMatch(SENSITIVE_SNIPPET_THRESHOLD_PATTERN);
    });
  });
});
