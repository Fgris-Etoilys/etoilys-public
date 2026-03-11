# AGENTS.md — Instructions Codex (Etoilys Web)

## Directive non négociable

Quand tu dois écrire du code, applique cette instruction:
"Sois précis, robuste et exhaustif. Lis la doc et les conventions afin de rester cohérent avec le repo. Mets à jour la doc si nécessaire et run npx tsc --noEmit à la fin. Corrige les erreurs s'il y en a."

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
  - `docs/sources_infos_search.pdf` = source canonique pour les faits juridiques/fiscaux (prioritaire, sources officielles + URLs).
  - `docs/sources_infos_gpt.pdf` = guide editorial page par page (angles, structure, reformulations neutres).
- Methode:
  - Verifier d'abord les affirmations dans `sources_infos_search.pdf`.
  - Utiliser `sources_infos_gpt.pdf` pour transformer ces faits en contenu de pages.
  - En cas de conflit, prioriser `sources_infos_search.pdf`, puis les textes officiels cites (Legifrance, impots.gouv, Service-Public, Atout France).

## Best practices (MCP context7)

- Quand une tâche touche les bonnes pratiques framework/librairie ou un arbitrage d'architecture, utiliser MCP `context7` avant implémentation.
- Périmètre prioritaire pour ce repo: React, React Router, Vite, Tailwind CSS, TypeScript.
- Prioriser la documentation officielle, puis aligner l'implémentation sur les conventions du projet.

## Règles UI (web)

- Prioriser les tokens/classes Tailwind déjà définis dans le projet.
- Réutiliser d'abord les composants existants de `src/components/ui` avant d'ajouter un nouveau composant.
- Si un pattern UI est réutilisé 3 fois ou plus, le promouvoir en composant réutilisable.
- Respecter la hiérarchie actuelle: primitives UI réutilisables, puis composants orientés domaine/page.

## Qualité TypeScript

- Préserver le mode strict.
- Interdire `any` sauf cas exceptionnel explicitement justifié.
- Interdire `@ts-ignore` et `@ts-expect-error` sans justification explicite.
- Éviter les casts larges (`as any`, `unknown as X`) non justifiés; choisir le type le plus précis possible.

## Frontend vs Backend ownership

- Ne pas implémenter un contournement frontend permanent pour masquer un contrat backend manquant ou incorrect.
- Si la bonne solution est backend, l'indiquer explicitement et lister le besoin côté backend.
- Limiter les changements frontend aux problèmes réellement frontend (UI, interaction, rendu, état local).

## Safety rails: commandes et git

- Ne pas exécuter d'opérations git (commit/push/merge/changement de branche) sans demande explicite.
- Ne pas lancer/arrêter de serveurs de dev ou de processus longs sans demande explicite.
- Les commandes de validation sont autorisées.
- Finir tout changement de code significatif par `npx tsc --noEmit`; corriger les erreurs jusqu'à obtenir un résultat propre.

## Sécurité encodage

- Tous les fichiers texte (`.md`, `.json`, `.ts`, `.tsx`, `.yml`, `.mjs`) doivent rester en UTF-8 sans BOM.
- Ne jamais écrire des fichiers via redirection PowerShell (`>`, `>>`) ni via `Out-File`, `Set-Content` ou `Add-Content`.
- Faire les modifications via patch (`apply_patch`) ou un writer explicite UTF-8 sans BOM.
- Avant de finir, vérifier sur les fichiers modifiés l'absence de BOM et de marqueurs de mojibake (ex: `\u00C3`, `\u00C2`, `\u00E2\u20AC\u2122`, `\u00E2\u20AC\u0153`, `\u00E2\u20AC`, `\uFFFD`).

## Conformité contenu (bloc critique)

**Etoilys ne peut pas fournir de conseil personnalisé aux propriétaires.**

### Interdit

- Verbes impératifs orientés action/conseil (ex: "Valorisez", "Optimisez", "Améliorez", "Profitez").
- Promesses de résultats business (ex: hausse des revenus, amélioration du taux de réservation).
- Formulations de recommandation (ex: "nous vous conseillons", "vous devriez", "il est recommandé de").

### Autorisé

- Langage factuel et neutre sur le classement et ses caractéristiques.
- Informations juridiques objectives (ex: avantages fiscaux prévus par la loi).
- Description du service Etoilys sans promesse de performance.

### Règle de doute

- En cas d'hésitation éditoriale, reformuler en information objective sans injonction ni promesse.
