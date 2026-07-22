# Simulateur taxe de séjour - Maintenance

## Objectif

Ce document décrit comment maintenir le simulateur disponible sur `/simulateur-taxe-sejour`:

- mettre à jour les données sources (XML/PDF),
- régénérer le dataset consommé par le front,
- vérifier la cohérence juridique du calcul (régimes, périodes, abattements),
- valider rapidement l'autocomplete et l'affichage.

Le simulateur historique `/simulateur` n'est pas concerné.

## Fichiers clés

- Sources de données:
  - `docs/data/taxe_sejour_donnees_deliberations.xml`
  - `docs/contenu/sources/fiche_technique_taxe_sejour.pdf`
- Script de build:
  - `scripts/build-taxe-sejour-dataset.ts`
- Dataset généré:
  - `public/data/taxe-sejour-dataset.v1.json`
- Chargement dataset:
  - `src/content/taxeSejourDataset.ts`
- Moteur de calcul:
  - `src/utils/taxeSejourCalculator.ts`
- UI simulateur:
  - `src/pages/SimulateurTaxeSejour.tsx`

## Rappel fonctionnel

Interface guidée par régime:

- au chargement, seul le champ `Ville` est affiché,
- après sélection, l'UI affiche uniquement les champs utiles au calcul:
  - toujours `Prix de la nuit HT` et `Nombre de nuits`,
  - `Capacité d'accueil` uniquement si `classifiedRegime = forfaitaire`,
  - `Personnes accueillies` et `Personnes exonérées` quand un calcul au réel est nécessaire,
- `Personnes exonérées` est optionnel (valeur par défaut: `0`) avec info-bulle sur les cas d'exonération.

Périodes:

- le simulateur utilise la première période publiée dans le dataset pour la commune,
- il n'y a plus de sélecteur de période dans l'interface.

Sorties:

- tableau `Non classé`, `1*`, `2*`, `3*`, `4*`, `5*`,
- statut par ligne (`exact` / `indicatif`),
- bloc taxes additionnelles `OUI/NON`,
- avertissements explicites (hypothèses, forfait).

## Contrat dataset actuel (v2)

Chaque ville contient notamment:

- `classifiedRegime` (nature `4`),
- `unclassifiedRegime` (nature `10`),
- `periods[]` avec `dateDebut`, `dateFin` et tarifs de calcul,
- `abatements[]` (`taux`, `nuiteMin`, `nuiteMax`) pour les cas forfaitaires.

Le script intègre aussi:

- les communes issues de `collectivites`,
- les cas "ville seule" via `collectiviteDeliberante.codeInsee` (ex: Paris).

## Procédure de mise à jour des données

1. Remplacer les fichiers sources:
   - `docs/data/taxe_sejour_donnees_deliberations.xml`
   - `docs/contenu/sources/fiche_technique_taxe_sejour.pdf`
2. Régénérer le dataset:

```bash
npm run taxe-sejour:data
```

3. Vérifier la présence du fichier généré:
   - `public/data/taxe-sejour-dataset.v1.json`
4. Vérifier manuellement le simulateur:
   - `grenoble` propose `GRENOBLE (38)`,
   - `paris` propose `VILLE DE PARIS (75)`,
   - faute simple `pairs` propose des résultats proches.
5. Lancer les vérifications techniques:

```bash
npx vitest run src/utils/taxeSejourCalculator.test.ts scripts/build-taxe-sejour-dataset.test.ts
npx tsc --noEmit
```

## Points de vigilance

- Le mode forfait reste indicatif: le calcul annuel exact nécessite des données d'exploitation non fournies à l'interface.
- En mode forfait, la simulation n'applique pas d'abattement local: elle utilise une formule simplifiée séjour type (`tarif × capacité × nuits`) pour comparer les catégories.
- Le warning forfait doit rappeler explicitement que le calcul légal repose sur la période d'ouverture/de mise en location et la capacité d'accueil, qu'un abattement local peut exister, et qu'il n'est pas intégré ici.
- Le chargement dataset utilise `cache: 'no-store'` pour éviter un JSON obsolète.
- Aucun affichage du code INSEE côté interface.
- La page restaure l'état du formulaire et le dernier calcul validé via `sessionStorage` (portée: onglet en cours) avec la clé `etoilys.simulateurTaxeSejour.v1`.
- La restauration du résultat se fait par recalcul automatique à partir du dernier calcul validé et du dataset courant; en cas de payload invalide/obsolète, la restauration est ignorée silencieusement.
- Le lien partageable encode le dernier calcul validé dans l'URL avec les paramètres `city`, `nightly`, `nights`, `capacity`, `persons`, `exempted`.
- Priorité de restauration au chargement: `query params` > `sessionStorage` > état vide.
- L'export PDF est généré côté front à partir des données structurées du résultat (paramètres, tableau, taxes additionnelles, avertissements, source DELTA/date de référence), sans capture visuelle de page.

## Commandes utiles

```bash
# Régénérer le dataset à partir du XML
npm run taxe-sejour:data

# Vérifier les tests ciblés simulateur
npx vitest run src/utils/taxeSejourCalculator.test.ts scripts/build-taxe-sejour-dataset.test.ts

# Vérifier le typage global
npx tsc --noEmit
```
