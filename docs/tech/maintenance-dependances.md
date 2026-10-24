# Maintenance des dépendances et contrôles de publication

## Automatisation

| Source                         | Déclenchement                                                 | Branche cible              | Traitement                                                                                                  |
| ------------------------------ | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Versions npm                   | Lundi, 08:00, `Europe/Paris`                                  | `dev`                      | Correctifs et versions mineures compatibles regroupés ; versions majeures séparées ; au plus 5 PR ouvertes. |
| Versions GitHub Actions        | Lundi, 08:00, `Europe/Paris`                                  | `dev`                      | Correctifs et versions mineures compatibles regroupés ; versions majeures séparées ; au plus 3 PR ouvertes. |
| Alertes de sécurité Dependabot | Dès qu'une alerte peut être corrigée, indépendamment du lundi | `main`, branche par défaut | PR à traiter selon sa gravité, puis synchronisation de `dev`.                                               |

La configuration est dans `.github/dependabot.yml`. Les groupes s'appliquent uniquement aux **mises à jour de version**. `sharp` est exclu du groupe npm correctif/mineur par `exclude-patterns` : Dependabot continue de le surveiller et doit proposer sa mise à jour de version dans une PR séparée. Cette exclusion ne constitue ni un `ignore` ni une dispense de traitement d'une alerte de sécurité. Aucune PR n'est fusionnée automatiquement. Les alertes et PR de sécurité nécessitent les fonctions GitHub décrites plus bas ; la présence du fichier YAML seule ne les active pas.

## Examiner, intégrer et publier une PR

1. Identifier la cible et la nature de la PR : version vers `dev`, sécurité vers `main`. Examiner l'avis de sécurité ou les notes de version, le manifeste, le lockfile, les changements transitifs et les éventuels changements majeurs. Traiter une alerte critique immédiatement, sans attendre le prochain cycle hebdomadaire. Si Dependabot ne peut pas proposer un correctif, préparer une correction ciblée et suivre l'alerte jusqu'à sa résolution.
2. Exiger le job GitHub Actions `quality` sur la PR. Il exécute `npm ci`, le typecheck, `images:check`, ESLint, les tests, le build SEO avec prerender et l'audit de production bloquant `npm audit --omit=dev --audit-level=moderate`. Examiner aussi la Preview Vercel lorsqu'elle est disponible. Un build Vercel réussi ne remplace pas ce contrôle. Résoudre les échecs ; ne pas les contourner.
3. Pour une PR de version, intégrer d'abord dans `dev`, vérifier le `quality` du push et la Preview, puis promouvoir `dev` vers `main` par une PR avec **merge commit** après validation. Ce mode conserve les commits de `dev`. Ne pas imposer un historique linéaire si les merge commits sont le mode de promotion retenu.
4. Pour une PR de sécurité visant directement `main`, vérifier `quality` et la Preview si disponible, puis intégrer le correctif sans attendre le cycle de versions. Synchroniser aussitôt `dev` depuis `main` avant de poursuivre les autres mises à jour.
5. Après **chaque** publication sur `main` par merge commit, attendre que `quality` passe sur le nouveau commit de `main`, puis synchroniser immédiatement `dev`. Quand `dev` est encore l'ancêtre de `main`, la synchronisation préserve l'historique par avance rapide :

   ```bash
   git fetch origin
   git switch dev
   git pull --ff-only origin dev
   git merge --ff-only origin/main
   git push origin dev
   ```

   Partir d'un arbre de travail propre. Si l'avance rapide échoue parce que `dev` a déjà progressé, arrêter cette procédure et intégrer `main` dans `dev` par un merge ordinaire, avec revue et CI ; ne pas utiliser `reset` ni `push --force`. Un merge commit peut placer `main` un commit devant `dev` alors que les fichiers sont identiques : c'est précisément le cas que couvre l'avance rapide. Une PR `main` → `dev` peut être impossible si son diff est vide. Une règle imposant une PR sur `dev` bloquerait cette synchronisation par push ordinaire ; garder cette contrainte à l'esprit lors de la configuration des protections.

### Cas particulier : Sharp

La migration de `sharp` vers `0.35.5` requiert une PR dédiée et une revue du pipeline d'images. Dans cette PR, exécuter `npm run images:build`, vérifier les changements de variantes et de manifeste, puis `npm run images:check`, les tests, `npm run build:seo` et `npm run typecheck`. Examiner les images et le rendu SEO avant intégration. Ne pas régénérer les images dans ce ticket de mise en place de l'automatisation.

## Lire les audits et suivre les exceptions

- La CI `quality` se déclenche sur les push et les PR vers `dev` et `main`. Son audit des dépendances de production échoue dès le seuil **modéré**. Le workflow `.github/workflows/dependency-audit.yml` réexamine `main` chaque mercredi à 07:17 UTC, même sans push, et peut être lancé manuellement avec `workflow_dispatch`. Il utilise Node 22, `npm ci` et le même contrôle de production bloquant.
- Dans **Actions → Dependency audit → dernier run → Summary**, lire les comptes par sévérité, les packages concernés, leur présence en production ou dans les outils de développement/build, les corrections disponibles et le code de retour de `npm audit --json`. Consulter les logs des étapes pour les détails et l'avis GitHub dans **Security → Dependabot**. Un code non nul dû à des vulnérabilités de développement est affiché mais reste informatif ; un audit de production au seuil modéré, un scan défaillant ou un rapport JSON absent/invalide fait échouer le job.
- Réévaluer les vulnérabilités résiduelles à chaque audit. Pour `sharp`, suivre la migration dédiée vers `0.35.5` et son impact sur les images. Pour `postcss-selector-parser`, vérifier les advisories actuels et si le correctif rétroporté en `6.1.5` couvre les versions résolues dans `package-lock.json`. Documenter le résultat et une échéance de traitement ; ne pas créer de liste d'ignorance permanente.

## Réglages GitHub et Vercel à vérifier

État constaté lors de la préparation de cette automatisation : `main` est la branche par défaut, `dev` existe, et les deux branches n'ont actuellement **ni protection ni check requis**. L'état de Dependency graph, Dependabot alerts et Dependabot security updates n'a **pas pu être vérifié** avec les accès disponibles. L'activation effective des Deployment Checks et de l'alias automatique de production dans Vercel n'a **pas pu être vérifiée** non plus. Recontrôler ces états après publication ; aucun réglage distant n'est modifié par les fichiers du dépôt.

1. Dans le dépôt GitHub, ouvrir **Settings → Advanced Security**. Vérifier, puis activer si nécessaire, **Dependency graph**, **Dependabot alerts** et **Dependabot security updates**. Vérifier ensuite **Security → Dependabot** et le journal Dependabot des mises à jour de version. Le fichier `.github/dependabot.yml` doit être présent sur la branche par défaut pour la prise en compte des versions hebdomadaires.
2. Dans **Settings → Branches → Add classic branch protection rule**, créer ou adapter une règle `main` : PR requise, check `quality` requis (sélectionner le check réellement publié par la CI), force-push et suppression interdits, sans bypass administrateur. Garder les merge commits autorisés. Pour `dev`, rendre `quality` requis et interdire force-push et suppression, tout en permettant l'avance rapide normale depuis `main` après publication. Vérifier le comportement effectif des règles avant de s'y fier. Une obligation de PR sur `dev` empêcherait l'avance rapide à diff vide ; un `git merge --ff-only` local suivi d'un push n'est pas compatible avec une règle imposant une PR sur cette branche.
3. Dans le projet Vercel, vérifier la connexion GitHub et **Project Settings → Environments → Production** : l'attribution automatique des domaines de production doit être active. Si **Deployment Checks** est disponible, ouvrir **Project Settings → Build and Deployment → Deployment Checks → Add Checks**, choisir **GitHub** comme fournisseur, puis sélectionner le statut GitHub Actions `quality` de ce dépôt. Faire un nouveau déploiement de production contrôlé après activation et vérifier séparément que le build Vercel est réussi, que `quality` passe pour le même commit et que le déploiement est effectivement attribué à `www.etoilys.fr`. Sans cette vérification, un build réussi ne prouve pas que le contrôle GitHub a conditionné la publication.

Le dépôt (`.nvmrc`, `package.json`) et la CI spécifient Node 22 ; Vercel était configuré en Node `24.x` lors de l'inspection. Valider Node 22 sur une Preview, puis traiter l'alignement de Vercel dans un changement séparé. Ne pas modifier la version Node dans ce ticket.

## Mise en service des fichiers de ce ticket

1. Publier sur `dev` les quatre fichiers `.github/dependabot.yml`, `.github/workflows/ci.yml`, `.github/workflows/dependency-audit.yml` et cette documentation. Contrôler le run `quality` du push et la Preview Vercel.
2. Ouvrir une PR de `dev` vers `main`, vérifier `quality` sur cette PR et fusionner par merge commit. Vérifier `quality` sur le nouveau commit de `main`, puis synchroniser `dev` immédiatement avec la procédure d'avance rapide ci-dessus, sans reset ni force-push.
3. Vérifier que GitHub a lu le fichier Dependabot sur la branche par défaut et que les deux écosystèmes apparaissent dans les mises à jour de version. Les PR hebdomadaires ciblent `dev` ; les PR de sécurité, si activées, ciblent `main`.
4. Dans **Actions → Dependency audit → Run workflow**, choisir `main`, lancer le workflow et examiner le Summary et les logs. Les exécutions programmées utilisent le fichier de la branche par défaut ; constater le premier run du mercredi.
5. Finaliser et vérifier les réglages GitHub et Vercel ci-dessus. Ne considérer les protections et Deployment Checks actifs qu'après contrôle de leur état et d'une exécution réelle.

Références : [options Dependabot](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference), [fonctions de sécurité GitHub](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/configure-security-updates), [protections de branche](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule), [Deployment Checks Vercel](https://vercel.com/docs/deployment-checks).
