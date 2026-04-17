# Simulateur taxe de séjour - Maintenance

## Objectif

Ce document décrit comment maintenir le simulateur disponible sur `/simulateur-taxe-sejour` :

- mettre à jour les données sources (XML/PDF),
- régénérer le dataset consommé par le front,
- vérifier rapidement que le calcul et l'autocomplete restent cohérents.

Le simulateur historique `/simulateur` n'est pas concerné.

## Fichiers clés

- Sources de données:
  - `docs/taxe_sejour_donnees_deliberations.xml`
  - `docs/fiche_technique_taxe_sejour.pdf`
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

## Fonctionnement (rappel)

Entrées utilisateur:

- Ville (autocomplete: `Ville (Département)`, sans code INSEE affiché),
- Prix de la nuit HT,
- Capacité du meublé,
- Nombre de nuits.

Sorties:

- Tableau des montants par catégorie: `Non classé`, `1*`, `2*`, `3*`, `4*`, `5*`,
- Montants en euros arrondis à 2 décimales,
- Taxes additionnelles en binaire `OUI/NON` avec références légales,
- Avertissements (régime forfaitaire, multi-périodes).

## Procédure de mise à jour des données

1. Remplacer les fichiers sources:
   - `docs/taxe_sejour_donnees_deliberations.xml`
   - `docs/fiche_technique_taxe_sejour.pdf`
2. Régénérer le dataset front:

```bash
npm run taxe-sejour:data
```

3. Vérifier que le fichier a bien été produit:
   - `public/data/taxe-sejour-dataset.v1.json`
4. Vérifier manuellement le simulateur sur `/simulateur-taxe-sejour`:
   - `grenoble` doit proposer `GRENOBLE (38)`,
   - `paris` doit proposer `VILLE DE PARIS (75)`,
   - faute simple type `pairs` doit proposer des résultats proches.
5. Vérifier la compilation TypeScript:

```bash
npx tsc --noEmit
```

## Points de vigilance

- Le script de build gère les deux cas:
  - délibérations avec bloc `collectivites`,
  - délibérations "ville seule" via `collectiviteDeliberante.codeInsee` (cas Paris).
- Le chargement dataset utilise `cache: 'no-store'` pour éviter de servir un ancien JSON.
- L'autocomplete trie les suggestions par pertinence (pas uniquement par `includes`) et applique un fallback tolérant aux fautes simples.
- Aucun affichage du code INSEE côté interface.

## Si les résultats semblent incohérents

- Vérifier que le JSON a été régénéré après mise à jour du XML.
- Vérifier que le navigateur n'affiche pas une ancienne build front.
- Comparer une commune cible dans le JSON généré (label + rates + taxMask).
- Contrôler le régime:
  - `r` = réel,
  - `f` = forfaitaire (résultat affiché comme indicatif).

## Commandes utiles

```bash
# Régénérer le dataset
npm run taxe-sejour:data

# Vérifier le typage
npx tsc --noEmit
```
