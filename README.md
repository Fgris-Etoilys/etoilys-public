# Etoilys Public

- [Index de la documentation](docs/README.md)

Application web React + TypeScript + Vite pour la présentation des parcours de classement des meublés de tourisme.

## Gouvernance GEO / AEO

- [Index de la documentation GEO / AEO](docs/seo/geo-aeo/README.md)
- [Roadmap GEO / AEO](docs/seo/geo-aeo/roadmap-geo-aeo-site-public-etoilys.md)
- [Baseline de juillet 2026](docs/seo/geo-aeo/geo-aeo-baseline-2026-07.md)
- [Panel de 20 requêtes ChatGPT](docs/seo/geo-aeo/geo-aeo-query-panel.md)
- [Résultats du 10 juillet 2026](docs/seo/geo-aeo/tests/2026-07-10.md)

ChatGPT est le seul assistant testé activement. Les autres référents IA restent observés passivement lorsqu’ils apparaissent dans les données analytics.

## Prérequis

- Node.js 22 LTS (voir `.nvmrc`)
- npm 10+

## Installation

```bash
npm ci
```

## Variables d'environnement

Copier `.env.example` vers `.env.local` puis renseigner :

```bash
VITE_API_BASE_URL=/api
VITE_TURNSTILE_SITE_KEY=...
VITE_ENABLE_ANALYTICS_IN_DEV=false
VITE_ENABLE_COOKIELESS_AUDIENCE=false
VITE_OPENAI_ADS_PIXEL_ID=your_openai_ads_pixel_id
ETOILYS_API_BASE_URL=https://api-dev.etoilys.fr
ETOILYS_SIMULATOR_API_BASE_URL=https://api-dev.etoilys.fr
```

`VITE_API_BASE_URL` reste sur `/api` pour garder des URLs frontend same-origin.
`ETOILYS_API_BASE_URL` est la cible Starsmanager utilisée uniquement en développement local par le proxy Vite pour les formulaires publics et le simulateur public.
`ETOILYS_SIMULATOR_API_BASE_URL` reste supporté temporairement comme fallback local.
`VITE_ENABLE_ANALYTICS_IN_DEV=false` évite les appels PostHog en local, même si un ancien consentement analytics est stocké dans le navigateur. Utiliser `true` uniquement pour tester explicitement l’analytics.
`VITE_ENABLE_COOKIELESS_AUDIENCE=false` maintient la mesure minimale après refus désactivée. Ce flag ne doit passer à `true` qu’après validation des textes, contrôle du payload réel, configuration du projet PostHog et test live.
`VITE_OPENAI_ADS_PIXEL_ID` est l'identifiant public du Pixel OpenAI Ads (source « Etoilys | Site web »). Le laisser vide en local pour ne jamais charger le SDK pendant le développement ; ne le définir que sur les environnements où la mesure `lead_created` doit réellement être active.

## Backends publics

Le site public consomme Starsmanager via des URLs same-origin :

- Formulaires publics :
  - `POST /api/public/forms/contact`
  - `POST /api/public/forms/classement`
- Simulateur public :
  - `/api/public/simulations`
  - `/api/public/simulations/*`

Les appels frontend restent en `/api/...`. En développement, Vite route ces chemins vers Starsmanager. En production, Vercel applique les rewrites équivalents.

Les simulations publiques sont associées au navigateur par le backend. Les appels simulateur doivent passer par `src/utils/simulatorApi.ts`, qui utilise `credentials: 'include'`.

## Configuration Vercel (prod)

Pour garder `VITE_API_BASE_URL=/api` aussi en production, ce repo inclut un `vercel.json` qui rewrite :

- `/api/public/forms/contact` -> `api-dev.etoilys.fr/public/forms/contact`
- `/api/public/forms/classement` -> `api-dev.etoilys.fr/public/forms/classement`
- `/api/public/simulations` et sous-routes -> `api-dev.etoilys.fr/public/simulations`

Variables à définir dans Vercel :

- `VITE_API_BASE_URL=/api`
- `VITE_TURNSTILE_SITE_KEY=<site_key_turnstile>`

Vérifier aussi :

- Les hostnames Turnstile autorisés (domaine prod + domaines preview Vercel).
- Les secrets/configurations Starsmanager nécessaires à Turnstile et Resend.
- L’accessibilité du backend Starsmanager. En production, privilégier HTTPS côté backend, ou conserver le routage same-origin via Vercel.

## Scripts utiles

```bash
npm run dev
npm run typecheck
npm run lint
npm run test:run
npm run build
npm run preview
```

## Contrat API formulaires

- `POST /api/public/forms/contact`
- `POST /api/public/forms/classement`

Réponse succès :

```json
{ "success": true, "message": "..." }
```

Réponse erreur formulaire :

```json
{
  "success": false,
  "error": "...",
  "errorCode": "VALIDATION_FAILED",
  "fieldErrors": { "champ": "..." },
  "fieldErrorCodes": { "champ": "REQUIRED" }
}
```

Réponse erreur transverse Starsmanager :

```json
{ "code": "INVALID_REQUEST", "message": "...", "fieldErrors": { "champ": "..." } }
```

En développement, Vite proxy ces routes vers Starsmanager :

- `/public/forms/contact`
- `/public/forms/classement`

## Règles sécurité

- Ne jamais commiter de secrets (`.env*`).
- Ne jamais exposer les secrets Starsmanager, Turnstile ou Resend dans le bundle frontend.
