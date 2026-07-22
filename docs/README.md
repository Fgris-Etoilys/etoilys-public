# Documentation Etoilys

Ce dossier regroupe la documentation utile au site public Etoilys. Le rangement reste volontairement simple.

## Dossiers

- [`tech/`](./tech/) : documentation technique durable, contrats, workflows et maintenance.
- [`seo/`](./seo/) : audits, roadmaps SEO, i18n, performance et suivi GEO/AEO.
- [`contenu/`](./contenu/) : guides éditoriaux, briefs, prompts et sources de contenu.
- [`data/`](./data/) : fichiers de données ou contrats utilisés par les scripts et tests.

## Règle de rangement

- Une doc qui sert à maintenir ou développer le site va dans `tech/`.
- Une doc de pilotage acquisition, indexation, GEO/AEO, i18n ou performance va dans `seo/`.
- Une doc qui sert à produire ou vérifier du contenu va dans `contenu/`.
- Un fichier volumineux, généré, importé ou consommé par un script va dans `data/`.
- Un plan terminé ou conditionnel qui ne pilote plus le travail courant va dans `seo/archive/`.

Quand un fichier est déplacé, mettre à jour les liens Markdown et les chemins utilisés par les scripts/tests dans le même changement.
