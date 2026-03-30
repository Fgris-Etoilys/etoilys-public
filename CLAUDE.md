# CLAUDE.md

Guidance for Claude Code in this repository.

## Project Overview

Etoilys is a React + TypeScript + Vite website for French short-term rental star classification ("meublés de tourisme").

## Non-Negotiable Directive

Whenever you write code, apply this instruction:
"Sois précis, robuste et exhaustif. Lis la doc et les conventions afin de rester cohérent avec le repo. Mets à jour la doc si nécessaire et run npx tsc --noEmit à la fin. Corrige les erreurs s'il y en a."

## Core Principles

- KISS: prefer simple, readable solutions.
- DRY: extract reusable code when a pattern appears 3+ times.
- Consistency first: reuse existing patterns/components before adding new ones.
- No premature optimization: optimize only with concrete evidence.

## Mandatory Sources Before Changes

- `CLAUDE.md`
- `tailwind.config.js`
- `src/App.tsx`
- `src/components/ui/*`
- `src/components/forms/*`
- `src/utils/formValidation.ts`
- `src/utils/api.ts`

## 2026 Content Sources (Meubles)

- Keep and use both documents:
  - `docs/sources_infos_search.pdf` = canonical fact base for legal/fiscal assertions (priority, official sources + URLs).
  - `docs/sources_infos_gpt.pdf` = editorial page-by-page drafting guide (angles, structure, neutral wording).
- Method:
  - Validate facts first with `sources_infos_search.pdf`.
  - Use `sources_infos_gpt.pdf` to convert validated facts into page copy.
  - If conflict exists, prioritize `sources_infos_search.pdf`, then primary official texts (Legifrance, impots.gouv, Service-Public, Atout France).

## Best-Practice Research (Context7)

- If a task involves framework/library best practices or architecture tradeoffs, use MCP `context7` before implementation.
- Priority scope for this repo: React, React Router, Vite, Tailwind CSS, TypeScript.
- Prefer official documentation first, then align with project conventions.

## SEO by Default (MANDATORY)

- Canonical domain is fixed to `https://www.etoilys.fr`.
- Never add page-level SEO injection inside `src/pages/*`: SEO is rendered once in `src/components/layout/Layout.tsx`.
- Every new route added in `src/App.tsx` must be declared in `src/content/seoRoutes.ts` with at least:
  - `title`
  - `description`
  - `breadcrumbLabel` (except home)
  - optional `robots` only when needed
- Unknown routes must keep the fallback `noindex,follow` (`NOT_FOUND_SEO`).
- Do not reintroduce `meta keywords`.
- Absolute SEO URLs (canonical, `og:url`, JSON-LD `url`) must stay on `https://www.etoilys.fr`.

### Structured Data Rules (Medium-Term Phase)

- Keep global structured data in one place only: `src/components/ui/StructuredData.tsx`:
  - `Organization`
  - `WebSite`
- Business fields (`legalName`, SIRET `identifier`, contact, address) must match `MentionsLegales`.
- Do not add `sameAs` until official social profiles are provided and validated.
- Breadcrumbs are JSON-LD only (no visible breadcrumb UI), generated from `getBreadcrumbItems` in `src/content/seoRoutes.ts`.
- Home and 404 must not output `BreadcrumbList`.
- Articles must use `ArticleStructuredData` + `src/content/articleStructuredData.ts`; no manual `useEffect` JSON-LD in article pages.

### Indexation and Static SEO Files (Quick Wins)

- Keep `public/robots.txt` with sitemap reference to `https://www.etoilys.fr/sitemap.xml`.
- Update `public/sitemap.xml` whenever an indexable route is added/removed.
- Never include 404 or `noindex` routes in sitemap.
- Favicon must be served from `public/*` and referenced in `index.html`.

### Structural Rules (Images, Prerender, IndexNow)

- Critical SEO/CWV images must use `SmartImage` (`src/components/ui/SmartImage.tsx`), not free-form `<img>` patterns and not hero `background-image`.
- Do not use external hosts for critical images on active routes (`images.pexels.com`): use local versioned assets.
- Mandatory image pipeline:
  - sources: `src/assets/seo-images/source/*`
  - variant generation + manifest: `npm run images:build` (`scripts/images-build.mjs`)
  - typed manifest: `src/content/imageManifest.ts`
- Sitemap must be generated from route config (no manual edits): `npm run seo:sitemap`.
- SEO prerender must run through `npm run prerender` (Playwright) and be included via `npm run build:seo`.
- `SeoRouteConfig` is the technical source of truth; keep and use:
  - `indexable?: boolean`
  - `prerender?: boolean`
  - `lcpImageKey?: ImageAssetKey`
- IndexNow:
  - public key file: `public/a4f9bc0d1e4b47b9b0e2b438d9d8f2aa.txt`
  - local submit script: `npm run indexnow:submit` (use `INDEXNOW_DRY_RUN=1` when needed)
  - CI automation: `.github/workflows/indexnow.yml` on `main` pushes

### Mandatory SEO Validation Before Delivery

- Verify there is only one SEO injector (`<SEO />`) in layout.
- Verify no page imports `SEO` directly.
- Verify all active routes in `src/App.tsx` are covered by `src/content/seoRoutes.ts`.
- Verify no duplicated JSON-LD scripts after SPA navigation.
- Run `npx tsc --noEmit` and fix errors until clean.
- For any new page/article, follow `docs/seo-structurant-workflow.md`.

## Development Commands

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
npm run preview
```

## Architecture Snapshot

- Stack: React 18, TypeScript, Vite, React Router v7, Tailwind CSS, Lucide React.
- App routing is defined in `src/App.tsx`, wrapped by layout components.
- Shared UI lives in `src/components/ui`; forms in `src/components/forms`; helpers in `src/utils`.
- API base URL comes from `VITE_API_BASE_URL` (default `https://api.etoilys.fr`).

## UI Rules (Web)

- Prioritize existing Tailwind tokens/classes and current design system patterns.
- Reuse components from `src/components/ui` before creating new ones.
- Promote repeated UI patterns (3+ uses) into reusable components.
- Keep clear layering: reusable UI primitives first, domain/page usage second.

## TypeScript Quality

- Keep strict mode.
- Do not use `any` unless explicitly justified.
- Do not use `@ts-ignore` / `@ts-expect-error` without explicit justification.
- Avoid broad unsafe casts (`as any`, `unknown as X`); prefer narrow safe typing.

## Frontend vs Backend Ownership

- Do not add permanent frontend workarounds for missing/incorrect backend contracts.
- If backend is the correct fix, say it explicitly and list the backend requirement.
- Frontend changes should target frontend-owned issues (UI, interaction, rendering, local state).

## Safety Rails (Commands & Git)

- Do not perform git operations (commit/push/merge/branch switch) unless explicitly requested.
- Do not start/stop dev servers or long-running processes unless explicitly requested.
- Validation commands are allowed when needed.
- End meaningful code changes with `npx tsc --noEmit` and fix errors until clean.

## Encoding Safety

- Keep text files (`.md`, `.json`, `.ts`, `.tsx`, `.yml`, `.mjs`) in UTF-8 without BOM.
- Do not write files with PowerShell redirection (`>`, `>>`) or `Out-File` / `Set-Content` / `Add-Content`.
- Prefer patch-based edits or explicit UTF-8-no-BOM writers.
- Before finishing, check touched files for BOM and mojibake markers (examples: `\u00C3`, `\u00C2`, `\u00E2\u20AC\u2122`, `\u00E2\u20AC\u0153`, `\u00E2\u20AC`, `\uFFFD`).

## Content Compliance (CRITICAL)

**Etoilys must not provide consulting/advisory wording to property owners.**

### Forbidden

- Imperative action language ("Valorisez", "Optimisez", "Améliorez", "Profitez").
- Business-outcome promises (higher bookings, increased revenue, etc.).
- Recommendation wording ("nous vous conseillons", "vous devriez", "il est recommandé de").
- Superlative benefit claims ("maximisez vos profits", etc.).

### Allowed

- Factual and neutral statements.
- Objective legal information (including fiscal benefits defined by law).
- Clear service description without performance promises.

### If in doubt

- Rewrite as objective information, with no injunction and no promise.

## Environment Variables

- `VITE_API_BASE_URL` (optional, defaults to `https://api.etoilys.fr`)
