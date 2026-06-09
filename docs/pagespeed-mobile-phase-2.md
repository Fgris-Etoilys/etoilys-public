# PageSpeed mobile - phase 2

## Problème initial

Le rapport PageSpeed mobile du 9 juin 2026 sur `https://www.etoilys.fr/` indiquait un score Performance de 80, avec un FCP à 3,6 s, un LCP à 3,8 s, un TBT à 30 ms et un CLS à 0,003.

Les principaux signaux étaient les polices Google Fonts bloquantes, un bundle initial trop gros, un preload LCP mal aligné avec l'image réellement chargée sur mobile, une image hero AVIF trop lourde, une erreur d'hydratation React `#418` observée dans le rapport distant, et quelques contrastes insuffisants.

## Phase 1 appliquée

La phase 1 traite uniquement les optimisations à faible risque :

- suppression du chargement bloquant Google Fonts ;
- remplacement de Roboto par une stack système ;
- auto-hébergement local de Playfair Display en WOFF2, poids 600 uniquement, depuis Google Fonts / `fonts.gstatic.com` ;
- preload LCP responsive basé sur le manifeste image, avec `imagesrcset` et `imagesizes` ;
- compression plus légère des variantes hero générées par le pipeline existant ;
- import dynamique de `posthog-js` uniquement après consentement analytics ;
- corrections ciblées de contrastes sur les éléments remontés ;
- headers Vercel simples, sans CSP stricte.

## Points volontairement non traités

Ces points restent exclus de la phase 1 car ils peuvent toucher le prerender, le SEO, l'hydratation ou le routing :

- lazy loading des routes avec `React.lazy` ;
- ajout de `Suspense` dans le routing ;
- découpage avancé des chunks Vite ;
- remplacement de `renderToString` ;
- migration vers `react-dom/static` ou `renderToPipeableStream` ;
- refonte de `scripts/prerender.ts` ;
- modification profonde du système SEO, des routes, canonical, sitemap ou JSON-LD ;
- correction React `#418` sans reproduction locale fiable ni cause exacte identifiée.

## Plan recommandé pour une phase 2

Lancer une phase 2 uniquement si un nouveau test PageSpeed mobile post-déploiement reste insuffisant.

1. Code splitting des routes
   - Garder `Home` et `Layout` en eager.
   - Lazy-loader progressivement les simulateurs, les articles Actualités, les pages légales et les pages secondaires.
   - Surveiller le nombre de chunks pour éviter une fragmentation excessive.

2. Prerender compatible Suspense
   - Étudier d'abord une solution React 19 adaptée au prerender statique, par exemple `react-dom/static` avec `prerenderToNodeStream`.
   - N'utiliser `renderToPipeableStream` avec `onAllReady` que si c'est plus compatible avec l'architecture actuelle.
   - Vérifier que le HTML prerender contient le vrai contenu des routes et pas un fallback Suspense.

3. Validation SEO complète
   - Vérifier que les titres, descriptions, canonical, JSON-LD global, breadcrumbs et `ArticleStructuredData` restent corrects.
   - Vérifier que les routes `noindex` et le sitemap restent inchangés.

4. Diagnostic React `#418`
   - Reproduire localement sur un build SEO servi comme en production.
   - Comparer le HTML prerender avec le DOM après hydratation.
   - Examiner en priorité les ressources preload générées par React, le bandeau cookies, les lectures de storage et les valeurs dépendantes du navigateur.

## Risques de phase 2

- Le lazy loading peut afficher un fallback dans le HTML prerender si le rendu serveur n'attend pas les composants.
- Un changement de moteur prerender peut dupliquer ou supprimer des balises SEO si l'injection n'est pas reprise exactement.
- Un découpage trop fin peut dégrader la navigation ou multiplier les requêtes.
- Une correction d'hydratation mal ciblée peut masquer une divergence réelle plutôt que la résoudre.
- Une CSP ajoutée trop tôt peut casser Turnstile, PostHog, les formulaires ou les scripts JSON-LD.

## Prérequis avant phase 2

Avant toute phase 2, vérifier :

- nouveau test PageSpeed mobile post-déploiement ;
- comparaison du bundle initial avant/après phase 1 ;
- absence d'erreur React `#418` ou reproduction locale fiable ;
- HTML prerender non vide pour les routes principales et les articles Actualités ;
- canonical inchangé ;
- une seule injection SEO ;
- JSON-LD non dupliqué ;
- sitemap aligné avec les routes indexables ;
- validation des pages home, simulateurs, pages locales, pages légales et articles Actualités.
