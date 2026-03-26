# Etoilys Public

Application web React + TypeScript + Vite pour la presentation des parcours de classement des meubles de tourisme.

## Prerequis

- Node.js 22 LTS (voir `.nvmrc`)
- npm 10+
- Supabase CLI (`npx supabase --version`)

## Installation

```bash
npm ci
```

## Variables d'environnement (frontend)

Copier `.env.example` vers `.env.local` puis renseigner:

```bash
VITE_API_BASE_URL=/api
VITE_TURNSTILE_SITE_KEY=...
SUPABASE_FUNCTIONS_BASE_URL=https://<project_ref>.supabase.co/functions/v1
```

`VITE_API_BASE_URL` reste sur `/api` pour garder un contrat HTTP stable, meme apres migration vers le backend Java.
`SUPABASE_FUNCTIONS_BASE_URL` est utilise uniquement en developpement local par le proxy Vite.

## Configuration Vercel (prod)

Pour garder `VITE_API_BASE_URL=/api` aussi en production, ce repo inclut un `vercel.json` qui rewrite:

- `/api/public/forms/contact` -> `public-forms-contact` (Supabase)
- `/api/public/forms/classement` -> `public-forms-classement` (Supabase)

Variables a definir dans Vercel:

- `VITE_API_BASE_URL=/api`
- `VITE_TURNSTILE_SITE_KEY=<site_key_turnstile>`

Verifier aussi:

- Les hostnames Turnstile autorises (domaine prod + domaines preview Vercel).
- `ALLOWED_ORIGINS` cote Supabase Secrets (domaine prod + previews + localhost).

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

1. Initialiser le dossier Supabase local:

```bash
npx supabase init
npx supabase link --project-ref <project_ref>
```

2. Appliquer les migrations:

```bash
npx supabase db push
```

3. Deployer les functions:

```bash
npx supabase functions deploy public-forms-contact --project-ref <project_ref>
npx supabase functions deploy public-forms-classement --project-ref <project_ref>
```

4. Configurer les secrets functions:

```bash
npx supabase secrets set TURNSTILE_SECRET_KEY=...
npx supabase secrets set RESEND_API_KEY=...
npx supabase secrets set RESEND_FROM_EMAIL=...
npx supabase secrets set NOTIFY_TO_EMAIL=...
```

Secrets optionnels:

- `ALLOWED_ORIGINS` (liste separee par virgules)
- `FORM_RATE_LIMIT_IP_PER_HOUR` (defaut: 10)
- `FORM_RATE_LIMIT_EMAIL_PER_HOUR` (defaut: 5)
- `BYPASS_TURNSTILE=true` (uniquement pour debug local)

Un exemple local est disponible dans `supabase/functions/.env.example`.

## Contrat API transitoire

- `POST /api/public/forms/contact`
- `POST /api/public/forms/classement`

Reponse succes:

```json
{ "success": true, "submissionId": "uuid", "message": "..." }
```

Reponse erreur:

```json
{ "success": false, "error": "...", "fieldErrors": { "champ": "..." } }
```

En developpement, Vite proxy ces routes vers:

- `public-forms-contact`
- `public-forms-classement`

## Retention et purge

La retention cible est 12 mois.

Commande de purge:

```sql
select public.purge_form_submissions_older_than(interval '12 months');
```

## Regles securite

- Ne jamais commiter de secrets (`.env*`, `supabase/.env`, `supabase/functions/.env`).
- Ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY` dans le frontend.
- La table `form_submissions` est en RLS forcee, sans policy publique.
- Les ecritures se font uniquement via Edge Functions.
