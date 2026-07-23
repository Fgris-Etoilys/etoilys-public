# AGENTS.md — Instructions Codex (Etoilys Web)

## Directive non négociable

Quand tu dois écrire du code, applique cette instruction:
"Sois précis, robuste et exhaustif. Lis la doc et les conventions afin de rester cohérent avec le repo. Mets à jour la doc si nécessaire et run npm run typecheck à la fin. Corrige les erreurs s'il y en a."

## Principes coeur

- KISS: privilégier les solutions simples et lisibles.
- DRY: extraire le code réutilisable quand un motif apparaît 3 fois ou plus.
- Consistency first: réutiliser les patterns/composants existants avant d'en créer de nouveaux.
- Pas d'optimisation prématurée: optimiser seulement avec des signaux concrets.

## Sources à consulter avant modification

- `CLAUDE.md`
- `tailwind.config.js`
- `src/App.tsx` (routing)
- `src/components/ui/*`
- `src/components/forms/*`
- `src/utils/formValidation.ts`
- `src/utils/api.ts`

## Sources contenu 2026 (classement)

- Conserver et utiliser les 2 documents:
  - `docs/contenu/sources/sources_infos_search.pdf` = source canonique pour les faits juridiques/fiscaux (prioritaire, sources officielles + URLs).
  - `docs/contenu/sources/sources_infos_gpt.pdf` = guide editorial page par page (angles, structure, reformulations neutres).
- Methode:
  - Verifier d'abord les affirmations dans `docs/contenu/sources/sources_infos_search.pdf`.
  - Utiliser `docs/contenu/sources/sources_infos_gpt.pdf` pour transformer ces faits en contenu de pages.
  - En cas de conflit, prioriser `docs/contenu/sources/sources_infos_search.pdf`, puis les textes officiels cites (Legifrance, impots.gouv, Service-Public, Atout France).

## Best practices (MCP context7)

- Quand une tâche touche les bonnes pratiques framework/librairie ou un arbitrage d'architecture, utiliser MCP `context7` avant implémentation.
- Périmètre prioritaire pour ce repo: React, React Router, Vite, Tailwind CSS, TypeScript.
- Prioriser la documentation officielle, puis aligner l'implémentation sur les conventions du projet.

## SEO by default (obligatoire)

- Domaine canonique unique: `https://www.etoilys.fr`.
- Ne jamais injecter de SEO dans les pages (`src/pages/*`): le SEO est centralise dans `src/components/layout/Layout.tsx`.
- Toute nouvelle route ajoutee dans `src/App.tsx` doit etre ajoutee dans `src/content/seoRoutes.ts` avec au minimum:
  - `title`
  - `description`
  - `breadcrumbLabel` (sauf home)
  - `robots` seulement si besoin specifique
- Le fallback des routes inconnues doit rester `noindex,follow` (via `NOT_FOUND_SEO`).
- Interdit de reintroduire `meta keywords`.
- Les URLs absolues SEO (canonical, `og:url`, JSON-LD `url`) doivent rester sur `https://www.etoilys.fr`.

### Structured data (phase moyen terme)

- Conserver une seule source globale de donnees structurees dans `src/components/ui/StructuredData.tsx`:
  - `Organization`
  - `WebSite`
- Les donnees business (`legalName`, `identifier`/SIRET, contact, adresse) doivent rester alignees avec `MentionsLegales`.
- Ne pas ajouter `sameAs` sans profils officiels verifies.
- Les breadcrumbs doivent etre uniquement en JSON-LD (pas de breadcrumb UI), generes depuis `getBreadcrumbItems` dans `src/content/seoRoutes.ts`.
- Home et 404: aucun `BreadcrumbList`.
- Articles: utiliser `ArticleStructuredData` + `src/content/articleStructuredData.ts`, sans injection manuelle `useEffect` dans les pages article.

### Indexation et fichiers statiques (quick wins)

- `public/robots.txt` doit rester present et pointer vers `https://www.etoilys.fr/sitemap.xml`.
- `public/sitemap.xml` doit etre mis a jour a chaque ajout/suppression de route indexable.
- Ne jamais inclure la 404 ni les routes `noindex` dans le sitemap.
- Le favicon doit etre servi depuis `public/*` et reference dans `index.html`.

### Structurant (images, prerender, IndexNow)

- Les images critiques SEO/CWV doivent passer par `SmartImage` (`src/components/ui/SmartImage.tsx`), pas via `<img>` libre ni `background-image` pour les heros.
- Interdire les URLs externes pour les images critiques des routes actives (`images.pexels.com`): utiliser les assets locaux.
- Pipeline image obligatoire:
  - sources: `src/assets/seo-images/source/*`
  - generation variantes + manifeste: `npm run images:build` (script `scripts/images-build.mjs`)
  - manifeste typé: `src/content/imageManifest.ts`
- Le sitemap doit etre regenere depuis la config routes (pas edition manuelle): `npm run seo:sitemap`.
- Le prerender SEO doit passer par `npm run prerender` (Playwright) et etre embarque dans `npm run build:seo`.
- `SeoRouteConfig` est la source de verite SEO technique par route; conserver les flags:
  - `indexable?: boolean`
  - `prerender?: boolean`
  - `lcpImageKey?: ImageAssetKey`
- IndexNow:
  - cle publique versionnee: `public/a4f9bc0d1e4b47b9b0e2b438d9d8f2aa.txt`
  - soumission locale: `npm run indexnow:submit` (dry-run possible avec `INDEXNOW_DRY_RUN=1`)
  - workflow CI: `.github/workflows/indexnow.yml` (push `main`)

### Checklist obligatoire avant livraison (SEO)

- Verifier qu'il n'existe qu'un seul injecteur SEO (`<SEO />`) dans le layout.
- Verifier qu'aucune page n'importe `SEO` directement.
- Verifier que toutes les routes actives de `src/App.tsx` sont couvertes par `src/content/seoRoutes.ts`.
- Verifier qu'il n'y a pas de scripts JSON-LD dupliques apres navigation SPA.
- Exécuter `npm run typecheck` et corriger jusqu'à 0 erreur.
- Pour toute creation de page/article, suivre `docs/tech/seo-structurant-workflow.md`.

## Règles UI (web)

- Prioriser les tokens/classes Tailwind déjà définis dans le projet.
- Réutiliser d'abord les composants existants de `src/components/ui` avant d'ajouter un nouveau composant.
- Si un pattern UI est réutilisé 3 fois ou plus, le promouvoir en composant réutilisable.
- Respecter la hiérarchie actuelle: primitives UI réutilisables, puis composants orientés domaine/page.
- Pour les tableaux HTML, imposer une présentation propre et équilibrée par défaut:
  - définir explicitement la répartition des colonnes (`colgroup`) pour les tableaux comparatifs,
  - garder un alignement cohérent des en-têtes et cellules par colonne (éviter les colonnes désalignées gauche/milieu/droite sans logique claire),
  - privilégier des colonnes visuellement harmonisées plutôt qu'un rendu avec une colonne collée à gauche et une autre collée à droite.

## Qualité TypeScript

- Préserver le mode strict.
- Interdire `any` sauf cas exceptionnel explicitement justifié.
- Interdire `@ts-ignore` et `@ts-expect-error` sans justification explicite.
- Éviter les casts larges (`as any`, `unknown as X`) non justifiés; choisir le type le plus précis possible.

## Tests de contenu

- Ne crée pas de tests qui vérifient la présence exacte de phrases, paragraphes ou mots dans la copy éditoriale.
- Pour les pages de contenu, limite les tests au strict nécessaire: comportement, routes, liens, structure sémantique, accessibilité, SEO technique et données métier critiques.
- Une assertion textuelle n'est acceptable que pour une mention légale, réglementaire, contractuelle ou fonctionnelle réellement obligatoire.
- Si un test existant échoue uniquement parce qu'il vérifie une copy éditoriale exacte sans valeur fonctionnelle ou réglementaire, supprime ce test ou remplace-le par une assertion réellement utile; ne le répare pas en figeant une nouvelle phrase exacte.
- Ne remplace pas les tests de copy supprimés par d'autres tests sans valeur équivalente.

## Frontend vs Backend ownership

- Ne pas implémenter un contournement frontend permanent pour masquer un contrat backend manquant ou incorrect.
- Si la bonne solution est backend, l'indiquer explicitement et lister le besoin côté backend.
- Limiter les changements frontend aux problèmes réellement frontend (UI, interaction, rendu, état local).

## Safety rails: commandes et git

- Ne pas exécuter d'opérations git (commit/push/merge/changement de branche) sans demande explicite.
- Ne pas lancer/arrêter de serveurs de dev ou de processus longs sans demande explicite.
- Les commandes de validation sont autorisées.
- Finir tout changement de code significatif par `npm run typecheck`; corriger les erreurs jusqu'à obtenir un résultat propre.

## Sécurité encodage

- Tous les fichiers texte (`.md`, `.json`, `.ts`, `.tsx`, `.yml`, `.mjs`) doivent rester en UTF-8 sans BOM.
- Toujours écrire les textes en français avec leurs accents UTF-8 (é, è, à, ô, etc.) plutôt que des versions non accentuées.
- Ne jamais écrire des fichiers via redirection PowerShell (`>`, `>>`) ni via `Out-File`, `Set-Content` ou `Add-Content`.
- Faire les modifications via patch (`apply_patch`) ou un writer explicite UTF-8 sans BOM.
- Avant de finir, vérifier sur les fichiers modifiés l'absence de BOM et de marqueurs de mojibake (ex: `\u00C3`, `\u00C2`, `\u00E2\u20AC\u2122`, `\u00E2\u20AC\u0153`, `\u00E2\u20AC`, `\uFFFD`).
