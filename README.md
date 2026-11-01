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
VITE_ENABLE_OPENAI_ADS_IN_DEV=false
VITE_ALLOW_MEASUREMENT_ON_NON_CANONICAL_HOST=false
ETOILYS_API_BASE_URL=https://api-dev.etoilys.fr
```

`VITE_API_BASE_URL` reste sur `/api` pour garder des URLs frontend same-origin.
`ETOILYS_API_BASE_URL` est l’unique cible utilisée en développement local par les quatre proxies Vite : Contact, Classement, Simulations et Communes. Elle vaut `https://api-dev.etoilys.fr` par défaut. Les slashs finaux sont supprimés et `http://api-dev.etoilys.fr` est normalisé vers HTTPS.
`VITE_ENABLE_ANALYTICS_IN_DEV=false` évite les appels PostHog en local, même si un ancien consentement analytics est stocké dans le navigateur. Utiliser `true` uniquement pour tester explicitement l’analytics.
`VITE_ENABLE_COOKIELESS_AUDIENCE=false` maintient la mesure minimale après refus désactivée. Ce flag ne doit passer à `true` qu’après validation des textes, contrôle du payload réel, configuration du projet PostHog et test live.
`VITE_OPENAI_ADS_PIXEL_ID` est l'identifiant public du Pixel OpenAI Ads (source « Etoilys | Site web »). Le laisser vide en local pour ne jamais charger le SDK pendant le développement ; ne le définir que sur les environnements où la mesure `lead_created` doit réellement être active.
`VITE_ENABLE_OPENAI_ADS_IN_DEV=false` évite le chargement du Pixel OpenAI Ads en développement local, même avec un consentement publicitaire stocké.
`VITE_ALLOW_MEASUREMENT_ON_NON_CANONICAL_HOST=false` bloque PostHog et OpenAI Ads hors `www.etoilys.fr`, y compris après consentement. Conserver cette valeur sur les Previews : aucune mesure ni conversion de production ne doit partir de staging.

## Backends publics

Le site public consomme Starsmanager via des URLs same-origin :

- Formulaires publics :
  - `POST /api/public/forms/contact`
  - `POST /api/public/forms/classement`
- Simulateur public :
  - `/api/public/simulations`
  - `/api/public/simulations/*`
- Communes :
  - `/api/public/communes`
  - `/api/public/communes/:codeInsee` (un seul segment)

Les appels frontend restent en `/api/...`. Vite et Vercel retirent le préfixe `/api` en conservant les sous-chemins et paramètres de recherche. Vite retire aussi l’en-tête `Origin` pour les quatre familles. Vercel transmet cet en-tête : le CORS backend doit autoriser l’origine du site concerné. Aucun proxy global `/api/*` n’est déclaré.

Les simulations publiques sont associées au navigateur par le backend. Les appels simulateur doivent passer par `src/utils/simulatorApi.ts`, qui utilise `credentials: 'include'`.

## Configuration Vercel

Le fichier unique `vercel.ts` exporte `config` et sélectionne la même cible pour les six rewrites API à partir de la seule variable système `VERCEL_ENV` :

| Contexte                             | Cible des API publiques                    |
| ------------------------------------ | ------------------------------------------ |
| Vercel `production`                  | `https://api-prod.etoilys.fr`              |
| Vercel `preview` ou `development`    | `https://api-dev.etoilys.fr`               |
| `VERCEL_ENV` absent, vide ou inconnu | Erreur au chargement de la configuration   |
| Vite local                           | `ETOILYS_API_BASE_URL`, staging par défaut |

`npm run dev`, `npm run test:run` et `npm run build:seo` ne demandent pas de définir `VERCEL_ENV` dans le terminal ou les fichiers `.env`. Vite ne charge pas `vercel.ts` et les tests définissent explicitement leurs environnements. La disponibilité de la variable système lors de l’évaluation par l’intégration Git Vercel doit être confirmée par la première Preview ; les validations locales ne le prouvent pas.

Variables à définir dans Vercel :

- `VITE_API_BASE_URL=/api`
- `VITE_TURNSTILE_SITE_KEY=<site_key_turnstile>`

Vérifier aussi :

- Conserver le widget Turnstile actuel pendant la transition ; faire autoriser uniquement l’alias Preview fixe `etoilys-public-git-dev-scratchones-projects.vercel.app` en plus des domaines publics existants.
- Les secrets/configurations Starsmanager nécessaires à Turnstile et Resend.
- La protection des Previews et le blocage de PostHog/OpenAI Ads sur les domaines non canoniques.

La mise en production dépend du jalon backend ETOILYS-428. Le déroulé Preview/Production, la réception des emails, la séparation ultérieure des widgets et la fermeture explicite du rollback sont détaillés dans le [runbook des API publiques](docs/tech/public-api-routing.md). Ces actions opérationnelles et configurations externes ne sont pas validées par les tests du dépôt.

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
