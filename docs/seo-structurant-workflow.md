# SEO structurant workflow (Etoilys)

## Objectif

Documenter le flux obligatoire pour que chaque ajout de page/article respecte automatiquement :

- SEO centralisé par route
- images optimisées et dimensionnées
- sitemap cohérent avec des `<lastmod>` réels
- prerender statique des routes indexables
- notification IndexNow post-déploiement production

## Ajout d'une nouvelle page indexable

1. Ajouter la route dans `src/App.tsx`.
2. Ajouter la meta route dans `src/content/seoRoutes.ts` :
   - `title`
   - `description`
   - `breadcrumbLabel`
   - `lastModified` au format `YYYY-MM-DD`, à mettre à jour lors de chaque changement éditorial significatif de la page
   - `ogImageKey` recommandé pour définir une image de partage Open Graph/Twitter
   - `indexable` laissé implicite `true` sauf exception
   - `prerender` laissé implicite `true` sauf exception
3. Si la page contient une image critique :
   - ajouter l'image source dans `src/assets/seo-images/source/`
   - déclarer la clé dans `scripts/images-build.mjs`
   - utiliser `SmartImage` dans la page
4. Régénérer les assets SEO :
   - `npm run images:build`
   - `npm run seo:sitemap`
5. Vérifier :
   - `npm run test:run`
   - `npm run typecheck`

## Ajout d'un nouvel article

1. Ajouter la route article dans `src/App.tsx`.
2. Ajouter la meta route dans `src/content/seoRoutes.ts`.
3. Ajouter les métadonnées canoniques de l'article dans `src/content/articleStructuredData.ts`.
   Pour ce lot, ce fichier est la source canonique temporaire de `datePublished` et `dateModified`.
4. Ajouter l'entrée de liste dans `src/content/actualitesArticles.ts` sans ressaisir les dates :
   les dates affichées sont dérivées de `src/content/articleStructuredData.ts`.
5. Ajouter l'image source dans `src/assets/seo-images/source/` puis régénérer :
   - `npm run images:build`
6. Régénérer le sitemap :
   - `npm run seo:sitemap`
7. Valider build prerendu :
   - `npm run build:seo`
   - vérifier que les fichiers `dist/**/index.html` des routes indexables contiennent un contenu HTML réel dans `#root`.

Les dates articles alimentent les données structurées, la page article, la liste Actualités et le sitemap. Ne pas créer de date parallèle dans une page article ou dans `actualitesArticles.ts`.

## Commandes de référence

- `npm run images:build` -> génère variantes AVIF/WebP/JPG + met à jour `src/content/imageManifest.ts`.
- `npm run seo:sitemap` -> régénère `public/sitemap.xml` depuis `seoRoutes` et les dates canoniques articles.
- `npm run prerender` -> prerender React statique des routes indexables/prerenderables dans `dist/`, génère `dist/404.html` et un shell `noindex,follow` pour les URLs dynamiques de simulation, puis valide que chaque page indexable contient un body HTML non vide, un `h1`, une canonical et les balises SEO attendues.
- `npm run build:seo` -> images + sitemap + build vite + prerender.

## Commandes IndexNow manuelles

Utiliser `INDEXNOW_DRY_RUN=1` pour vérifier la sélection sans notifier IndexNow.

- URL unique : `npm run indexnow:submit -- --url https://www.etoilys.fr/actualites`
- Liste d'URLs : `npm run indexnow:submit -- --urls urls.txt`
- Fichiers changés : `npm run indexnow:submit -- --from-changed-files changed-files.txt`
- Diff sitemap : `npm run indexnow:submit -- --from-sitemap-diff previous-sitemap.xml public/sitemap.xml`
- Tout le sitemap courant, uniquement si nécessaire : `npm run indexnow:submit -- --all`

Le script déduplique les URLs, refuse les hôtes hors `www.etoilys.fr`, découpe par lots de 10 000 URLs, retente de façon bornée les réponses `429` et `5xx`, accepte `200` et `202`, et échoue sans retry aveugle sur les autres `4xx`.

Lors d'un renommage ou retrait de route, l'ancienne URL doit aussi être soumise. Le workflow compare l'ancien sitemap et le sitemap courant pour que les moteurs constatent la redirection, la `404` ou la `410`.

## Notes CI/CD

- Le déploiement Vercel doit exécuter `npm run build:seo` et publier `dist` (config versionnée dans `vercel.json`).
- Le prerender ne doit pas avoir de fallback qui injecte seulement le `<head>` SEO. Un échec de rendu React, de sitemap ou de validation HTML doit faire échouer le build.
- Ne pas réintroduire de rewrite SPA global `/(.*) -> /index.html` en production, afin de conserver un vrai statut HTTP 404 sur les routes inconnues.
- Le workflow `.github/workflows/indexnow.yml` ne soumet plus IndexNow au `push main`. Il attend `repository_dispatch` `vercel.deployment.success`, filtre la production, checkout le commit réellement déployé via `github.event.client_payload.git.sha`, génère le sitemap attendu depuis ce SHA, puis poll `https://www.etoilys.fr/sitemap.xml` jusqu'à correspondance avant soumission.
- La baseline IndexNow est le dernier SHA de production soumis avec succès, conservé en artifact GitHub Actions `indexnow-production-sha`. Ne pas utiliser le parent direct du commit déployé comme baseline : un déploiement production peut contenir plusieurs commits. Si aucune baseline n'est encore disponible, le workflow soumet le sitemap courant complet.
- Pour les anciennes URLs supprimées ou renommées, la vérification live accepte `301`, `302`, `404` et `410` comme états finaux valides avant soumission.
- La clé IndexNow publique est versionnée dans `public/a4f9bc0d1e4b47b9b0e2b438d9d8f2aa.txt`.
- Si le domaine canonique change, mettre à jour :
  - `SITE_URL` dans `src/content/seoRoutes.ts`
  - `public/robots.txt`
  - la config IndexNow dans `scripts/indexnow-submit.ts`
