# Etoilys Public

Application web React + TypeScript + Vite pour la présentation et la gestion
des parcours de classement des meublés de tourisme.

## Prérequis

- Node.js 22 LTS (voir `.nvmrc`)
- npm 10+

## Installation

```bash
npm ci
```

## Scripts utiles

```bash
npm run dev         # serveur de développement
npm run typecheck   # vérification TypeScript stricte
npm run lint        # linting ESLint
npm run test:run    # tests unitaires (Vitest)
npm run build       # build production
npm run preview     # preview local du build
```

## Workflow recommandé

1. Développer la fonctionnalité.
2. Exécuter `npm run typecheck`.
3. Exécuter `npm run lint`.
4. Exécuter `npm run test:run`.
5. Exécuter `npm run build`.

Le CI GitHub applique ces contrôles sur `main` et sur les pull requests.

## Conventions projet

- Stack principale: React, React Router, TypeScript, Tailwind CSS, Vite.
- Les composants réutilisables sont dans `src/components/ui`.
- Les formulaires sont dans `src/components/forms`.
- Le routage est centralisé dans `src/App.tsx`.
- Les pages légales sont routées sur:
  - `/confidentialite`
  - `/mentions-legales`
  - `/cgu`

## Dépannage

- Si `npm ci` échoue après un changement de version Node, supprimer `node_modules`
  puis relancer `npm ci`.
- Si l’audit npm remonte une alerte runtime, mettre à jour en priorité la
  dépendance concernée avant livraison.
