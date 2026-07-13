# Etoilys Public

Application web React + TypeScript + Vite pour la présentation des parcours de classement des meublés de tourisme.

## Gouvernance GEO / AEO

- [Index de la documentation GEO / AEO](docs/geo-aeo/README.md)
- [Roadmap GEO / AEO](docs/geo-aeo/roadmap-geo-aeo-site-public-etoilys.md)
- [Baseline de juillet 2026](docs/geo-aeo/geo-aeo-baseline-2026-07.md)
- [Panel de 20 requêtes ChatGPT](docs/geo-aeo/geo-aeo-query-panel.md)
- [Résultats du 10 juillet 2026](docs/geo-aeo/tests/2026-07-10.md)

ChatGPT est le seul assistant testé activement. Les autres référents IA restent observés passivement lorsqu’ils apparaissent dans les données analytics.

## Prérequis

- Node.js 22 LTS (voir `.nvmrc`)
- npm 10+
- Supabase CLI (`npx supabase --version`)

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
ETOILYS_SIMULATOR_API_BASE_URL=https://api-dev.etoilys.fr
SUPABASE_FUNCTIONS_BASE_URL=https://<project_ref>.supabase.co/functions/v1
```

`VITE_API_BASE_URL` reste sur `/api` pour garder des URLs frontend same-origin.
`SUPABASE_FUNCTIONS_BASE_URL` est utilisé uniquement en développement local par le proxy Vite pour les formulaires.
`ETOILYS_SIMULATOR_API_BASE_URL` est utilisé uniquement en développement local par le proxy Vite pour le simulateur public.
`VITE_ENABLE_ANALYTICS_IN_DEV=false` évite les appels PostHog en local, même si un ancien consentement analytics est stocké dans le navigateur. Utiliser `true` uniquement pour tester explicitement l’analytics.
`VITE_ENABLE_COOKIELESS_AUDIENCE=false` maintient la mesure minimale après refus désactivée. Ce flag ne doit passer à `true` qu’après validation des textes, contrôle du payload réel, configuration du projet PostHog et test live.

## Backends publics

Deux backends coexistent dans ce repo :

- Supabase Edge Functions pour les formulaires publics :
  - `POST /api/public/forms/contact`
  - `POST /api/public/forms/classement`
- Backend Etoilys `api-dev.etoilys.fr` pour le simulateur public :
  - `/api/public/simulations`
  - `/api/public/simulations/*`

Les appels frontend restent en `/api/...`. En développement, Vite route ces chemins vers le bon backend. En production, Vercel applique les rewrites équivalents.

Les simulations publiques sont associées au navigateur par le backend. Les appels simulateur doivent passer par `src/utils/simulatorApi.ts`, qui utilise `credentials: 'include'`.

## Configuration Vercel (prod)

Pour garder `VITE_API_BASE_URL=/api` aussi en production, ce repo inclut un `vercel.json` qui rewrite :

- `/api/public/forms/contact` -> `public-forms-contact` (Supabase)
- `/api/public/forms/classement` -> `public-forms-classement` (Supabase)
- `/api/public/simulations` et sous-routes -> `api-dev.etoilys.fr` (backend simulateur)

Variables à définir dans Vercel :

- `VITE_API_BASE_URL=/api`
- `VITE_TURNSTILE_SITE_KEY=<site_key_turnstile>`

Vérifier aussi :

- Les hostnames Turnstile autorisés (domaine prod + domaines preview Vercel).
- `ALLOWED_ORIGINS` côté Supabase Secrets (domaine prod + previews + localhost).
- L’accessibilité du backend simulateur. En production, privilégier HTTPS côté backend, ou conserver le routage same-origin via Vercel.

## Scripts utiles

```bash
npm run dev
npm run typecheck
npm run lint
npm run test:run
npm run build
npm run preview
```

## Setup Supabase (transitoire)

1. Initialiser le dossier Supabase local :

```bash
npx supabase init
npx supabase link --project-ref <project_ref>
```

2. Appliquer les migrations :

```bash
npx supabase db push
```

3. Déployer les functions :

```bash
npx supabase functions deploy public-forms-contact --project-ref <project_ref>
npx supabase functions deploy public-forms-classement --project-ref <project_ref>
```

4. Configurer les secrets functions :

```bash
npx supabase secrets set TURNSTILE_SECRET_KEY=...
npx supabase secrets set RESEND_API_KEY=...
npx supabase secrets set RESEND_FROM_EMAIL=...
npx supabase secrets set NOTIFY_TO_EMAIL=...
```

`RESEND_FROM_EMAIL` est réutilisé pour les notifications internes et les accusés de réception client.
`NOTIFY_TO_EMAIL` reçoit les notifications internes et sert aussi d'adresse de réponse (`reply_to`) pour les confirmations envoyées aux clients.

Secrets optionnels :

- `ALLOWED_ORIGINS` (liste séparée par virgules)
- `FORM_RATE_LIMIT_IP_PER_HOUR` (défaut : 10)
- `FORM_RATE_LIMIT_EMAIL_PER_HOUR` (défaut : 5)
- `BYPASS_TURNSTILE=true` (uniquement pour debug local)

Un exemple local est disponible dans `supabase/functions/.env.example`.

## Contrat API formulaires

- `POST /api/public/forms/contact`
- `POST /api/public/forms/classement`

Réponse succès :

```json
{ "success": true, "submissionId": "uuid", "message": "..." }
```

Réponse erreur :

```json
{ "success": false, "error": "...", "fieldErrors": { "champ": "..." } }
```

En développement, Vite proxy ces routes vers :

- `public-forms-contact`
- `public-forms-classement`

## Rétention et purge

La rétention cible est 12 mois.

Commande de purge :

```sql
select public.purge_form_submissions_older_than(interval '12 months');
```

## Règles sécurité

- Ne jamais commiter de secrets (`.env*`, `supabase/.env`, `supabase/functions/.env`).
- Ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY` dans le frontend.
- La table `form_submissions` est en RLS forcée, sans policy publique.
- Les écritures se font uniquement via Edge Functions.
