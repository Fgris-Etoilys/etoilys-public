# Exports de marchés et relevés de meublés

Ce répertoire contient deux étapes locales :

1. `fetch_markets.py` collecte les marchés français filtrés sur les logements entiers. Son ancien géocodage et ses codes INSEE sont conservés dans l'original pour la traçabilité.
2. `prepare_releves.py` rapproche **hors ligne** chaque marché avec le millésime communal 2026. Son résultat est destiné à la CLI du backend. Il ne recollecte rien et ne modifie jamais l'original.

L'indicateur `short_term_rental_listings_entire_place_ltm` provient de `listing_count` avec le filtre `entire_place`. Il représente des logements entiers observés sur douze mois, et non les logements actifs du dernier mois. Les volumes de marchés distincts sont additionnés selon l'hypothèse métier d'annonces disjointes ; le JSON ne contient pas les annonces permettant de contrôler cette hypothèse.

## Référentiel figé 2026

`reference/2026/manifest.json` fixe les URL et SHA-256 de quatre fichiers : communes et localités `COM`, `COMA`, `COMD`, `ARM` du COG 2026, noms historiques depuis 1943, événements de passage vers 2026, et contours communaux Etalab 2026 à 100 m. Le préparateur vérifie les quatre empreintes et que tous les codes `COM` sont couverts par les contours. Il n'appelle ni cache géographique ni API pendant le retraitement. Les 45 contours d'arrondissement municipal sont ramenés à leur commune parente ; les contours hors référentiel 477 ne sont pas attribués.

Le nom actuel, associé, délégué, d'arrondissement ou historique forme les candidats. Le point départage les homonymes ; s'il contredit un nom unique, le nom reste prioritaire. Sans candidat nominal, le point sert de repli. Le département déduit du point n'est jamais une validation indépendante. Le rapport interne conserve la méthode, la qualité, les écarts et les lignes éventuellement exclues. Les incertitudes géographiques ne bloquent pas l'import.

## Collecte future

Depuis la racine du site public :

```powershell
python -B tools/airdna/fetch_markets.py
```

Un export obtenu sans `--limit` porte `metadata.collection_complete=true` seulement lorsque la pagination se termine naturellement par une page courte ou vide. `metadata.collection_end` précise `short_page`, `empty_page` ou `limit`. Un export limité est incomplet pour l'import.

L'ancienne référence `reference/communes-france.geojson` reste un cache local ignoré par Git pour l'enrichissement indicatif de l'original. Elle n'entre pas dans la préparation 2026.

## Préparation de l'export du 21 octobre

L'original est le fichier local ignoré par Git `exports/airdna-france-2026-10-21_142841.json`, SHA-256 `69251636DC384FBF5947F536998D501C99677E347AB5285AB301A53FB85EDA82`. Comme cet export précède le marqueur de complétude, il faut un fichier de décisions local, lié à cette empreinte :

```json
{
  "original_sha256": "69251636DC384FBF5947F536998D501C99677E347AB5285AB301A53FB85EDA82",
  "attestation": {
    "operator": "Nom et prénom de l'opérateur réel à renseigner",
    "reason": "Complétude de l'export du 21 octobre confirmée lors de la validation du plan ETOILYS-491."
  },
  "corrections": []
}
```

Enregistrer ce JSON dans `exports/decisions-2026-10-21.json`, puis lancer depuis la racine :

```powershell
python -B tools/airdna/prepare_releves.py `
  tools/airdna/exports/airdna-france-2026-10-21_142841.json `
  tools/airdna/exports/releves-2026-10-21-prepares.json `
  tools/airdna/exports/releves-2026-10-21-rapport.json `
  --decisions tools/airdna/exports/decisions-2026-10-21.json
```

Les deux sorties doivent être nouvelles. Elles et le fichier de décisions restent dans `exports/`, ignoré par Git. L'original reste inchangé.

Une correction manuelle se fait en ajoutant une entrée à `corrections`, puis en régénérant **de nouvelles** sorties sans refaire la collecte :

```json
{
  "market_id": "37986",
  "code_insee": "91692",
  "operator": "Nom et prénom de l'opérateur réel à renseigner",
  "reason": "Nom Les Ulis confirmé pour le millésime 2026."
}
```

Le code doit être un `COM` 2026. Chaque correction conserve opérateur et motif dans le préparé et dans le rapport. Le SHA-256 des décisions lie la révision à l'original. Une correction absente est acceptable : le rapprochement automatique reste utilisable. Un marché sans rattachement géographique demeure listé et exclu du volume agrégé, sans bloquer les autres marchés.

Le JSON préparé porte le format `etoilys-releves-1`, la date d'extraction de l'original, ses empreintes, la complétude (`verified` ou `attested`), et un marché par `market_id` avec `volume`, code `COM` 2026 ou `null`, méthode et qualité `HIGH`, `MEDIUM`, `LOW` ou `UNMATCHED`. Le rapport porte le format `etoilys-releves-report-1`, le SHA du préparé, les compteurs et les avertissements détaillés. Le backend Java valide ces fichiers et gère la persistance et les lectures API ; il ne refait pas le géocodage.

## Vérification

```powershell
python -B -m unittest discover -s tools/airdna -p 'test_*.py'
npm run typecheck
```
