# Contexte projet Etoilys

État du repo au 30 mai 2026.

Ce document sert de point d’entrée pour une personne ou un agent qui doit intervenir sur le site public Etoilys. Il résume le but du site, sa structure actuelle, sa stack technique, les conventions du repo et les règles métier à respecter avant toute modification.

## But du site

Etoilys est le site public d’un service spécialisé dans le classement officiel des meublés de tourisme. Le site informe sur le cadre du classement, présente les démarches, propose des outils de simulation et permet de contacter Etoilys ou de déposer une demande de classement.

Le site n’est pas un outil de conseil personnalisé aux propriétaires. Les pages de service, formulaires, CTA commerciaux, simulateurs et contenus métier hors blog doivent rester factuels, neutres et descriptifs. Les articles d’Actualités ont une liberté éditoriale plus pratique, mais les affirmations juridiques et fiscales doivent rester sourcées.

## Stack actuelle

- Frontend : React 19, TypeScript strict, Vite 7.
- Routing : React Router 7, routes déclarées dans `src/AppRoutes.tsx`, enveloppées par `src/components/layout/Layout.tsx`.
- Style : Tailwind CSS 3, tokens dans `tailwind.config.js`, styles globaux dans `src/index.css`.
- Icônes : `lucide-react`.
- Tests : Vitest, Testing Library, jsdom.
- SEO/prerender : configuration centralisée dans `src/content/seoRoutes.ts`, génération sitemap, prerender Playwright.
- Images SEO/CWV : pipeline local Sharp via `npm run images:build`, manifeste typé dans `src/content/imageManifest.ts`, contrôle rapide via `npm run images:check`.
- Analytics : PostHog via `src/utils/analytics.ts`, consentement cookies via le layout.
- Backends publics :
  - Supabase Edge Functions pour les formulaires.
  - Backend Etoilys `api-dev.etoilys.fr` pour le simulateur public.

La source de vérité des versions est `package.json`. Si une ancienne doc mentionne React 18, elle est obsolète pour l’état actuel du repo.

## Commandes utiles

```bash
npm ci
npm run dev
npm run typecheck
npm run lint
npm run test:run
npm run build
npm run build:seo
npm run seo:sitemap
npm run images:build
npm run prerender
```

Pré-requis principaux :

- Node.js 22 LTS (`.nvmrc`, `package.json`).
- npm 10+.
- Supabase CLI pour les fonctions de formulaires.

## Variables d’environnement

Variables principales côté frontend/local :

- `VITE_API_BASE_URL` : préfixe API same-origin, généralement `/api`.
- `VITE_TURNSTILE_SITE_KEY` : clé publique Cloudflare Turnstile.
- `VITE_ENABLE_ANALYTICS_IN_DEV` : `false` par défaut recommandé en local.
- `SUPABASE_FUNCTIONS_BASE_URL` : cible proxy Vite pour les Edge Functions en développement.
- `ETOILYS_SIMULATOR_API_BASE_URL` : cible proxy Vite pour le simulateur public.

Les appels frontend doivent rester en `/api/...`. Le routage vers les backends se fait par le proxy Vite en local et par les rewrites Vercel en production.

## Structure fonctionnelle du site

Le routing actif est défini dans `src/AppRoutes.tsx`. Toutes les routes sont enfants du layout global.

### Navigation principale

Menu desktop/mobile actuel (`src/components/layout/Header.tsx`) :

- Accueil : `/`
- Le classement : `/classement`
  - Vue d’ensemble : `/classement`
  - Les avantages du classement : `/les-avantages-du-classement`
  - Prérequis au classement : `/prerequis-au-classement`
  - Procédure : `/procedure`
  - FAQ : `/faq`
- Outils :
  - Simulateur de classement : `/simulateur`
  - Simulateur taxe de séjour : `/simulateur-taxe-sejour`
  - Simulateur fiscal classement 2026 : `/simulateur-fiscal-classement`
- Actualités : `/actualites`
- Contact : `/contact`
- CTA principal : `/demande-classement`

Les pages `Notre équipe` et `Recrutement` existent encore dans `src/pages`, mais leurs routes et liens de navigation sont commentés tant que les pages ne sont pas prêtes.

### Routes actives

| Route                           | Page                              | Rôle                                                                       |
| ------------------------------- | --------------------------------- | -------------------------------------------------------------------------- |
| `/`                             | `Home`                            | Accueil et entrée principale vers le service Etoilys.                      |
| `/classement`                   | `Classement`                      | Présentation générale du classement des meublés de tourisme.               |
| `/les-avantages-du-classement`  | `PourquoiClasser`                 | Effets factuels du classement : cadre officiel, fiscalité, taxe de séjour. |
| `/prerequis-au-classement`      | `Prerequis`                       | Conditions et points préalables avant une demande de classement.           |
| `/procedure`                    | `Procedure`                       | Étapes de la procédure de classement.                                      |
| `/simulateur`                   | `Simulateur`                      | Entrée du simulateur public de classement.                                 |
| `/simulateur/:simulationId`     | `SimulationClassement`            | Détail d’une simulation publique, route dynamique `noindex`.               |
| `/simulateur-taxe-sejour`       | `SimulateurTaxeSejour`            | Outil de comparaison taxe de séjour classé/non classé.                     |
| `/simulateur-fiscal-classement` | `SimulateurFiscalClassement`      | Outil de comparaison fiscale 2026 classé/non classé.                       |
| `/faq`                          | `FAQ`                             | Questions fréquentes sur le classement.                                    |
| `/actualites`                   | `Actualites`                      | Liste des articles.                                                        |
| `/actualites/*`                 | pages dans `src/pages/actualites` | Articles éditoriaux SEO.                                                   |
| `/contact`                      | `Contact`                         | Formulaire de contact et coordonnées.                                      |
| `/demande-classement`           | `DemandeClassement`               | Formulaire de demande de classement.                                       |
| `/confidentialite`              | `Confidentialite`                 | Politique de confidentialité.                                              |
| `/mentions-legales`             | `MentionsLegales`                 | Mentions légales et données business de référence.                         |
| `*`                             | `NotFound`                        | 404 avec SEO `noindex,follow`.                                             |

### Articles actifs

Les métadonnées de liste sont dans `src/content/actualitesArticles.ts`. Les données structurées des articles sont dans `src/content/articleStructuredData.ts`.

Articles routés actuellement :

- `/actualites/meubles-de-tourisme-ce-qui-change-vraiment-en-2025-2026`
- `/actualites/micro-bic-2026-meuble-classe-vs-non-classe`
- `/actualites/airbnb-residence-principale-limite-90-jours`
- `/actualites/copropriete-location-touristique-reglement`
- `/actualites/taxe-de-sejour-2026-pourquoi-le-classement-change-la-donne`
- `/actualites/meuble-classe-non-classe-seuils-micro-bic`
- `/actualites/facturation-electronique-2026-proprietaires-meubles`
- `/actualites/dpe-meubles-tourisme-2026-2034`
- `/actualites/api-meubles-declaration-meuble-tourisme`

## Arborescence du repo

Principaux dossiers :

- `src/pages` : pages routées.
- `src/pages/actualites` : pages d’articles.
- `src/components/layout` : layout, header, footer, analytics, cookies.
- `src/components/ui` : composants UI réutilisables.
- `src/components/forms` : formulaires publics et Turnstile.
- `src/content` : contenu structuré, SEO, articles, manifeste images, grille simulateur.
- `src/utils` : clients API, validation, analytics, calculs, exports.
- `src/assets/seo-images/source` : sources des images critiques.
- `public` : assets statiques, favicon, `robots.txt`, `sitemap.xml`, clé IndexNow.
- `scripts` : génération images, sitemap, prerender, dataset taxe de séjour, IndexNow.
- `supabase` : Edge Functions et migrations des formulaires.
- `docs` : documentation projet, sources réglementaires, workflows SEO, Swagger.

## Conventions UI

Les conventions visuelles sont portées par Tailwind :

- Breakpoints : `sm 640`, `md 768`, `lg 1024`, `xl 1150`, `2xl 1536`.
- Couleurs de marque : `primary`, `success`, `warning`, `alert`, `themePrimary`, `textLight`.
- Polices : Playfair Display pour les titres, Roboto pour le texte courant.
- Conteneur standard : classe utilitaire `container-adaptive`.
- Espacement de section : token `pt-section` / `spacing.section`.
- Rayon de carte : `rounded-card`.

Avant de créer un composant, vérifier d’abord `src/components/ui`. Les composants existants couvrent notamment `Button`, `Card`, `FeatureCard`, `Accordion`, `Input`, `Textarea`, `Select`, `Checkbox`, `ResponsiveComparisonTable`, `SmartImage`, `SEO`, `StructuredData`, `Toast` et `Tooltip`.

Pour les formulaires, réutiliser les composants de `src/components/forms` et la validation de `src/utils/formValidation.ts`.

## SEO et données structurées

Règles obligatoires :

- Domaine canonique unique : `https://www.etoilys.fr`.
- Ne jamais injecter le SEO directement dans `src/pages/*`.
- Le seul injecteur SEO est `<SEO />` dans `src/components/layout/Layout.tsx`.
- Toute nouvelle route dans `src/AppRoutes.tsx` doit être ajoutée dans `src/content/seoRoutes.ts`.
- Les routes inconnues doivent rester `noindex,follow` via `NOT_FOUND_SEO`.
- Pas de `meta keywords`.
- Les URLs SEO absolues doivent rester sur `https://www.etoilys.fr`.
- Les breadcrumbs sont uniquement en JSON-LD, générés par `getBreadcrumbItems`.
- Home et 404 ne doivent pas sortir de `BreadcrumbList`.
- Les articles utilisent `ArticleStructuredData` et `src/content/articleStructuredData.ts`.
- Ne pas injecter manuellement de JSON-LD dans une page.

Pour ajouter ou supprimer une route indexable :

1. Modifier `src/AppRoutes.tsx`.
2. Modifier `src/content/seoRoutes.ts`.
3. Ajouter les données article si nécessaire dans `src/content/articleStructuredData.ts`.
4. Régénérer le sitemap avec `npm run seo:sitemap`.
5. Vérifier que les routes `noindex` et la 404 ne sont pas dans le sitemap.

Le workflow détaillé pour les pages/articles est `docs/seo-structurant-workflow.md`.

## Images

Les images critiques SEO/CWV doivent passer par `SmartImage` et le pipeline local :

1. Ajouter la source dans `src/assets/seo-images/source/*`.
2. Lancer `npm run images:build`.
3. Lancer `npm run images:check`.
4. Utiliser la clé générée dans `src/content/imageManifest.ts`.
5. Renseigner `ogImageKey` et, si pertinent, `lcpImageKey` dans `seoRoutes.ts`.

Éviter les images externes pour les images critiques des routes actives. Ne pas utiliser de `background-image` pour les héros SEO critiques.

## Formulaires publics

Deux formulaires publics sont actifs :

- Contact : `src/components/forms/ContactForm.tsx`, endpoint `/api/public/forms/contact`.
- Demande de classement : `src/components/forms/DemandeClassementForm.tsx`, endpoint `/api/public/forms/classement`.

Les deux passent par :

- `src/utils/formValidation.ts` pour la validation frontend.
- `src/utils/api.ts` pour `submitToApi`.
- `TurnstileField` pour la vérification anti-spam.
- `src/utils/analytics.ts` pour le tracking des étapes formulaire.

Les Edge Functions correspondantes sont dans `supabase/functions/public-forms-contact` et `supabase/functions/public-forms-classement`.

## Simulateur public

Le simulateur public utilise le backend Etoilys via `/api/public/simulations`.

Fichiers principaux :

- `src/pages/Simulateur.tsx` : liste/création/entrée des simulations.
- `src/pages/SimulationClassement.tsx` : parcours de simulation.
- `src/utils/simulatorApi.ts` : client API typé avec `credentials: 'include'`.
- `src/content/simulatorGrid.ts` : parsing et modèle de grille.
- `docs/swagger.json` : contrat OpenAPI de référence du backend.
- `docs/simulateur-backend-integration.md` : notes d’intégration.

Les simulations publiques sont associées au navigateur par le backend. Ne pas remplacer ce contrat par un contournement frontend persistant.

## Sources de contenu réglementaire

Pour les contenus juridiques/fiscaux liés aux meublés de tourisme :

1. Vérifier les faits dans `docs/sources_infos_search.pdf`.
2. Utiliser `docs/sources_infos_gpt.pdf` pour l’angle éditorial et la structure.
3. En cas de conflit, prioriser `sources_infos_search.pdf`, puis les sources officielles citées : Legifrance, impots.gouv, Service-Public, Atout France.

Les fichiers `.txt` associés peuvent aider à rechercher rapidement, mais les PDF restent les sources conservées.

## Règles éditoriales critiques

Sur les pages de service, formulaires, CTA commerciaux, simulateurs et contenus métier hors blog :

- Ne pas employer de verbes impératifs orientés conseil ou action commerciale.
- Ne pas promettre de résultats business : hausse de revenus, amélioration du taux de réservation, performance locative.
- Ne pas écrire de recommandations personnalisées : `nous vous conseillons`, `vous devriez`, `il est recommandé de`.
- Préférer les formulations factuelles : cadre légal, caractéristiques du classement, description du service, informations objectives.

Les articles d’Actualités peuvent adopter une formulation plus pratique, mais les faits sensibles doivent rester vérifiés et sourcés.

## Qualité TypeScript

- Conserver le mode strict.
- Éviter `any`.
- Éviter `@ts-ignore` et `@ts-expect-error`; toute exception doit être explicitement justifiée.
- Éviter les casts larges comme `as any` ou `unknown as X`.
- Préférer les types précis, les parsers et les garde-types pour les données externes.

## Architecture frontend/backends

Le frontend ne doit pas masquer durablement un contrat backend absent ou incorrect. Si un problème relève du backend, documenter clairement le besoin backend au lieu d’ajouter un contournement permanent côté frontend.

Routage API :

- En frontend, construire les URLs avec `getApiUrl` ou les clients dédiés.
- En local, `vite.config.ts` route `/api/public/forms/*` vers Supabase et `/api/public/simulations*` vers le backend simulateur.
- En production, `vercel.json` applique les rewrites équivalents.

## Déploiement et SEO build

La production Vercel utilise :

```bash
npm run build:seo
```

Cette commande exécute :

1. `npm run images:check`
2. `npm run typecheck`
3. `npm run seo:sitemap`
4. `vite build`
5. `npm run prerender`

Vercel ne régénère pas les images optimisées. Les fichiers sous `public/images/optimized`, `src/content/imageManifest.ts` et `src/content/imageManifest.integrity.json` sont des artefacts versionnés. Après modification d'une source image, lancer `npm run images:build` puis `npm run images:check` avant commit.

Le fichier `vercel.json` définit aussi les rewrites API et la route dynamique `/simulateur/:simulationId` vers `simulation-noindex.html`.

## Checklist avant livraison

Avant de livrer une modification significative :

- Lire `CLAUDE.md`, `tailwind.config.js`, `src/App.tsx` et `src/AppRoutes.tsx`.
- Vérifier les composants existants dans `src/components/ui` et `src/components/forms`.
- Vérifier les helpers concernés dans `src/utils`.
- Si une route est ajoutée/supprimée, mettre à jour `seoRoutes.ts` et régénérer le sitemap.
- Si une image critique est ajoutée, passer par `SmartImage`, `npm run images:build` et `npm run images:check`.
- Si du contenu juridique/fiscal est modifié, vérifier les sources documentaires.
- Lancer `npm run typecheck` et corriger jusqu’à zéro erreur.
- Vérifier les fichiers modifiés : UTF-8 sans BOM, accents français préservés, pas de marqueurs de mojibake.

## Règles de sécurité de travail

- Ne pas exécuter d’opérations git sans demande explicite : commit, push, merge, changement de branche.
- Ne pas démarrer ou arrêter de serveur long-running sans demande explicite.
- Les commandes de validation sont autorisées.
- Ne jamais commiter de secrets `.env*`, clés Supabase, clés Turnstile ou clés de service.
- Ne pas exposer `SUPABASE_SERVICE_ROLE_KEY` côté frontend.
