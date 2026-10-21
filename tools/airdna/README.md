# Exports AirDNA France

Ce répertoire contient l'outil local utilisé pour extraire les marchés français
d'AirDNA, filtrés sur les logements entiers (`entire_place`), puis les rapprocher
du référentiel officiel des communes françaises.

## Organisation

- `fetch_markets.py` : extraction paginée et enrichissement géographique ;
- `session.local` : jetons de session AirDNA locaux, ignorés par Git ;
- `reference/communes-france.geojson` : référentiel géographique local, ignoré par Git ;
- `exports/` : exports JSON datés, ignorés par Git.

## Exécution

Depuis la racine du projet :

```powershell
python -B tools/airdna/fetch_markets.py
```

Le script crée automatiquement un fichier nommé
`exports/airdna-france-AAAA-MM-JJ_HHMMSS.json`, avec l'heure de Paris. Il attend
par défaut 0,5 seconde entre deux pages AirDNA.

Pour limiter une exécution de test :

```powershell
python -B tools/airdna/fetch_markets.py --limit 50
```

Pour choisir le fichier de sortie ou la temporisation :

```powershell
python -B tools/airdna/fetch_markets.py --output chemin/export.json --airdna-delay 1
```

Pour actualiser uniquement le référentiel des communes :

```powershell
python -B tools/airdna/fetch_markets.py --refresh-communes --download-communes-only
```

Le champ `short_term_rental_listings_entire_place_ltm` correspond au
`listing_count` renvoyé par le bulk des marchés AirDNA pour le filtre
`entire_place`. Il représente l'inventaire Short-Term Rentals observé sur les
12 derniers mois, et non le Total Active Listings du dernier mois. Un export
complet nécessite une session AirDNA encore valide dans `session.local`.
