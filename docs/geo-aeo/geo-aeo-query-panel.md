# Panel de requêtes GEO / AEO — Etoilys

**Version :** v1  
**Date de référence :** 10 juillet 2026  
**Assistant testé activement :** ChatGPT avec recherche web

## Objet

Ce fichier constitue la liste stable des requêtes utilisées pour suivre la retrouvabilité d’Etoilys. Les résultats sont stockés séparément dans un fichier daté afin de ne pas réécrire l’historique.

Les autres assistants ne font pas l’objet de tests manuels. Leurs référents restent néanmoins observables passivement lorsqu’ils apparaissent dans les données analytics.

## Contrat du panel

| Champ        | Définition                                                 |
| ------------ | ---------------------------------------------------------- |
| `id`         | Identifiant stable, conservé d’une exécution à l’autre.    |
| `requête`    | Formulation exacte à rejouer.                              |
| `intention`  | Besoin principal représenté par la requête.                |
| `locale`     | Langue de la requête.                                      |
| `page cible` | Page Etoilys qui répond le plus directement à l’intention. |
| `statut`     | `active` pour les requêtes incluses dans la mesure v1.     |

## Panel v1

| ID  | Requête                                                   | Intention                                  | Locale  | Page cible                                               | Statut |
| --- | --------------------------------------------------------- | ------------------------------------------ | ------- | -------------------------------------------------------- | ------ |
| Q01 | `classement meublé de tourisme Dordogne`                  | Commerciale départementale                 | `fr-FR` | `/classement-meuble-tourisme-dordogne`                   | active |
| Q02 | `organisme classement meublé Bergerac`                    | Commerciale locale                         | `fr-FR` | `/classement-meuble-tourisme-dordogne`                   | active |
| Q03 | `classement meublé Sarlat`                                | Commerciale locale                         | `fr-FR` | `/classement-meuble-tourisme-dordogne`                   | active |
| Q04 | `classement meublé Gironde`                               | Commerciale départementale                 | `fr-FR` | `/classement-meuble-tourisme-gironde`                    | active |
| Q05 | `classement meublé Libourne`                              | Commerciale locale                         | `fr-FR` | `/classement-meuble-tourisme-gironde`                    | active |
| Q06 | `classement meublé Lot-et-Garonne`                        | Commerciale départementale                 | `fr-FR` | `/classement-meuble-tourisme-lot-et-garonne`             | active |
| Q07 | `classement meublé Agen`                                  | Commerciale locale                         | `fr-FR` | `/classement-meuble-tourisme-lot-et-garonne`             | active |
| Q08 | `organisme accrédité Cofrac meublé de tourisme`           | Autorité institutionnelle                  | `fr-FR` | `/classement`                                            | active |
| Q09 | `furnished tourist accommodation classification Dordogne` | Commerciale locale anglophone              | `en`    | `/en/classification-process`                             | active |
| Q10 | `démarches après classement d’un meublé`                  | Informationnelle                           | `fr-FR` | `/actualites/que-faire-apres-classement-meuble-tourisme` | active |
| Q11 | `micro-BIC meublé classé 2026`                            | Informationnelle fiscale                   | `fr-FR` | `/actualites/micro-bic-2026-meuble-classe-vs-non-classe` | active |
| Q12 | `taxe de séjour meublé classé`                            | Informationnelle / outil                   | `fr-FR` | `/simulateur-taxe-sejour`                                | active |
| Q13 | `organisme classement meublé Dordogne`                    | Commerciale départementale                 | `fr-FR` | `/classement-meuble-tourisme-dordogne`                   | active |
| Q14 | `faire classer un gîte Bergerac`                          | Commerciale locale                         | `fr-FR` | `/classement-meuble-tourisme-dordogne`                   | active |
| Q15 | `classement Airbnb Dordogne`                              | Commerciale locale, formulation plateforme | `fr-FR` | `/classement-meuble-tourisme-dordogne`                   | active |
| Q16 | `classement location saisonnière Périgueux`               | Commerciale locale                         | `fr-FR` | `/classement-meuble-tourisme-dordogne`                   | active |
| Q17 | `classement meublé Marmande`                              | Commerciale locale                         | `fr-FR` | `/classement-meuble-tourisme-lot-et-garonne`             | active |
| Q18 | `prix classement meublé de tourisme`                      | Commerciale tarifaire                      | `fr-FR` | `/faq`                                                   | active |
| Q19 | `furnished tourist accommodation classification France`   | Informationnelle anglophone nationale      | `en`    | `/en/furnished-tourist-accommodation-classification`     | active |
| Q20 | `holiday rental classification Dordogne`                  | Commerciale locale anglophone              | `en`    | `/en/classification-process`                             | active |

## Règles d’exécution

- Rejouer les formulations à l’identique dans une session ChatGPT disposant de la recherche web.
- Consigner la date, l’environnement, les URLs Etoilys retrouvées, les sources dominantes, la visibilité et le diagnostic.
- Ne pas interpréter le résultat comme une position universelle ou un classement Google.
- Rejouer le panel complet une fois par trimestre et après une modification majeure affectant une intention.
- Conserver un nouveau fichier daté pour chaque exécution.
- Ajouter de nouvelles requêtes dans une version ultérieure du panel sans modifier rétroactivement la v1.

## Échelle de visibilité

- **Forte** : une page Etoilys répondant directement à l’intention est retrouvée.
- **Moyenne** : Etoilys est retrouvé par une page départementale ou générique pertinente, sans correspondance exacte.
- **Faible** : Etoilys est retrouvé indirectement, avec une réponse sensiblement moins exploitable que les sources dominantes.
- **Absence** : aucune page Etoilys pertinente n’est retrouvée dans le corpus retourné.
