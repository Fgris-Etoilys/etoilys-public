# Documentation GEO / AEO

Ce dossier regroupe les documents de pilotage GEO/AEO du site public Etoilys.

| Document                                                  | Rôle                                                             |
| --------------------------------------------------------- | ---------------------------------------------------------------- |
| [Roadmap](./roadmap-geo-aeo-site-public-etoilys.md)       | Ordre des lots, décisions, tâches et critères d’acceptation.     |
| [Baseline de juillet 2026](./geo-aeo-baseline-2026-07.md) | État initial technique, externe et mesurable.                    |
| [Panel de requêtes](./geo-aeo-query-panel.md)             | Liste versionnée des 20 requêtes ChatGPT à rejouer.              |
| [Résultats du 10 juillet 2026](./tests/2026-07-10.md)     | Première exécution datée du panel.                               |
| [Mesure GEO/AEO](./geo-aeo-measurement.md)                | Contrat de mesure, limites et checklist d’activation.            |
| [Données structurées](../structured-data-etoilys.md)      | Entités JSON-LD canoniques, périmètre d’injection et validation. |

## Convention

- Conserver la roadmap, la baseline et le panel à la racine de ce dossier.
- Stocker chaque nouvelle exécution dans `tests/` avec un nom `AAAA-MM-JJ.md`.
- Ne pas modifier rétroactivement une exécution datée.
- Mettre à jour les liens de cet index lors de l’ajout d’un nouveau document de pilotage permanent.
