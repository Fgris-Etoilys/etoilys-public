# SEO structurant workflow (Etoilys)

## Objectif

Documenter le flux obligatoire pour que chaque ajout de page/article respecte automatiquement:

- SEO centralise par route
- images optimisees et dimensionnees
- sitemap coherent
- prerender statique des routes indexables
- notification IndexNow sur `push main`

## Ajout d'une nouvelle page indexable

1. Ajouter la route dans `src/App.tsx`.
2. Ajouter la meta route dans `src/content/seoRoutes.ts`:
   - `title`
   - `description`
   - `breadcrumbLabel`
   - `ogImageKey` (recommande pour definir une image de partage Open Graph/Twitter)
   - `indexable` (laisser implicite `true` sauf exception)
   - `prerender` (laisser implicite `true` sauf exception)
3. Si la page contient une image critique:
   - ajouter l'image source dans `src/assets/seo-images/source/`
   - declarer la cle dans `scripts/images-build.mjs`
   - utiliser `SmartImage` dans la page
4. Regenerer les assets SEO:
   - `npm run images:build`
   - `npm run seo:sitemap`
5. Verifier:
   - `npm run test:run`
   - `npx tsc --noEmit`

## Ajout d'un nouvel article

1. Ajouter la route article dans `src/App.tsx`.
2. Ajouter la meta route dans `src/content/seoRoutes.ts`.
3. Ajouter l'entree article dans:
   - `src/content/actualitesArticles.ts` (`imageKey`, `href`, date)
   - `src/content/articleStructuredData.ts` (`imageKey`, dates, metadata)
4. Ajouter l'image source dans `src/assets/seo-images/source/` puis regenerer:
   - `npm run images:build`
5. Regenerer le sitemap:
   - `npm run seo:sitemap`
6. Valider build prerendu:
   - `npm run build:seo`
   - vérifier que les fichiers `dist/**/index.html` des routes indexables contiennent un
     contenu HTML réel dans `#root` (le script de prerender échoue si une page reste vide).

## Commandes de reference

- `npm run images:build` -> genere variantes AVIF/WebP/JPG + met a jour `src/content/imageManifest.ts`.
- `npm run seo:sitemap` -> regenere `public/sitemap.xml` depuis `seoRoutes`.
- `npm run prerender` -> prerender React statique des routes indexables/prerenderables dans
  `dist/`, génère `dist/404.html` et un shell `noindex,follow` pour les URLs dynamiques de
  simulation, puis valide que chaque page indexable contient un body HTML non vide, un `h1`,
  une canonical et les balises SEO attendues.
- `npm run build:seo` -> images + sitemap + build vite + prerender.
- `npm run indexnow:submit` -> soumet les URLs sitemap a IndexNow.

## Notes CI/CD

- Le deploiement Vercel doit executer `npm run build:seo` et publier `dist` (config versionnee dans `vercel.json`).
- Le prerender ne doit pas avoir de fallback qui injecte seulement le `<head>` SEO. Un échec de
  rendu React, de sitemap ou de validation HTML doit faire échouer le build.
- Ne pas reintroduire de rewrite SPA global `/(.*) -> /index.html` en production, afin de conserver un vrai statut HTTP 404 sur les routes inconnues.
- Le workflow `.github/workflows/indexnow.yml` soumet IndexNow sur `push main`.
- La cle IndexNow publique est versionnee dans `public/a4f9bc0d1e4b47b9b0e2b438d9d8f2aa.txt`.
- Si le domaine canonique change, mettre a jour:
  - `SITE_URL` dans `src/content/seoRoutes.ts`
  - `public/robots.txt`
  - la config IndexNow dans `scripts/indexnow-submit.ts`
