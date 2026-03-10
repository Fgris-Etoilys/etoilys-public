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

## Best-Practice Research (Context7)

- If a task involves framework/library best practices or architecture tradeoffs, use MCP `context7` before implementation.
- Priority scope for this repo: React, React Router, Vite, Tailwind CSS, TypeScript.
- Prefer official documentation first, then align with project conventions.

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
