# Audit SEO externe Etoilys - suivi des recommandations

Date de l'audit externe : 6 juin 2026  
Périmètre : observation du site public, recherches `site:etoilys.fr`, requêtes concurrentielles, analyse des titres visibles, lecture des pages principales, intentions de recherche, concurrents et snippets.  
Limites : pas d'accès Search Console, Analytics, logs serveur, crawl Screaming Frog complet, Lighthouse fiable, données d'impressions, CTR, backlinks, pages orphelines ou erreurs serveur.

## Synthèse

Le site dispose déjà d'un socle SEO sain : pages indexables, contenu métier réel, pages locales, articles d'actualité, simulateurs, sources officielles et CTA clairs. Google comprend globalement le thème principal : le classement des meublés de tourisme.

Le problème principal est stratégique plutôt que purement technique :

- les pages locales départementales commencent à ressortir, mais elles portent trop de villes à elles seules ;
- les requêtes ville comme `classement meublé Agen`, `classement meublé Bordeaux` ou `classement meublé Bergerac` sont trop spécifiques pour être durablement gagnées avec une seule page départementale ;
- les balises title sont parfois trop génériques ou trop longues, avec un suffixe de marque lourd ;
- la page d'accueil mentionne encore `partout en France`, alors que la stratégie commerciale réelle est concentrée sur Sud-Ouest, Dordogne, Gironde et Lot-et-Garonne ;
- les articles Actualités sont un actif fort : micro-BIC, DPE, API Meublés, taxe de séjour, copropriété, 90 jours, réforme 2025-2026.

Note conformité : plusieurs formulations proposées par l'audit sont orientées action (`Découvrez`, `Comparez`, `Demandez`, `Déposez`). Avant implémentation sur pages de service, formulaires, simulateurs ou CTA commerciaux, les reformuler en langage factuel et neutre conformément aux règles éditoriales Etoilys.

## Inventaire des pages principales

| Route                                        | Rôle                 | Intention SEO                         | Qualité / actif                       | Risque SEO                                                                       | Priorité |
| -------------------------------------------- | -------------------- | ------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------- | -------- |
| `/`                                          | Accueil / conversion | classement meublé de tourisme, marque | Bonne base, claire                    | Trop générique, mention `partout en France` trop large                           | Haute    |
| `/classement`                                | Page pilier service  | Comprendre le classement              | Correcte, sourcée, mais un peu courte | Cannibalisation possible avec `/les-avantages-du-classement` et FAQ              | Moyenne  |
| `/les-avantages-du-classement`               | Page bénéfices       | Pourquoi faire classer                | Très utile                            | Attention aux promesses générales sur taxe / revenus                             | Haute    |
| `/prerequis-au-classement`                   | Page préparation     | Conditions classement meublé          | Très bonne, concrète                  | Peut être mieux liée depuis simulateur et demande                                | Moyenne  |
| `/procedure`                                 | Page procédure       | Procédure classement meublé           | Claire, conversion                    | `faire appel` peut être juridiquement imprécis par rapport à `refuser/contester` | Moyenne  |
| `/faq`                                       | Longue traîne        | Questions fréquentes                  | Solide, très utile                    | H1 trop générique : `Foire aux questions`                                        | Haute    |
| `/simulateur`                                | Outil                | Simulateur classement meublé          | Différenciant                         | Besoin de contenu SEO explicatif autour de l'outil                               | Haute    |
| `/simulateur-taxe-sejour`                    | Outil taxe           | Simulateur taxe séjour meublé         | Très bon angle SEO                    | Peut mieux cibler les requêtes locales taxe                                      | Haute    |
| `/simulateur-fiscal-classement`              | Outil fiscal         | Simulateur fiscal meublé classé       | Très pertinent                        | Besoin de contenu statique SEO en haut/bas                                       | Haute    |
| `/actualites`                                | Hub éditorial        | Actualités réglementation/fiscalité   | Très bon début                        | Title/H1 `Actualités` trop générique                                             | Moyenne  |
| `/classement-meuble-tourisme-dordogne`       | Landing locale       | Dordogne + villes                     | Très pertinente                       | Page départementale surchargée en villes                                         | Haute    |
| `/classement-meuble-tourisme-gironde`        | Landing locale       | Gironde + villes                      | Très pertinente                       | Concurrence forte Bordeaux / Arcachon / Gironde Tourisme                         | Haute    |
| `/classement-meuble-tourisme-lot-et-garonne` | Landing locale       | Lot-et-Garonne + Agen                 | Très bonne                            | Agen pas assez individualisé                                                     | Haute    |
| `/zones-intervention`                        | Hub local            | Zones intervention                    | Utile                                 | Peut devenir un vrai hub de maillage local                                       | Moyenne  |
| `/demande-classement`                        | Conversion           | Demande / devis                       | Claire                                | SEO secondaire, contenu court acceptable                                         | Moyenne  |
| `/contact`                                   | Contact              | Marque / contact                      | OK                                    | Accents manquants dans certains textes visibles du formulaire                    | Faible   |

## Indexation visible

La requête `site:etoilys.fr` fait ressortir les pages importantes : accueil, pages locales, FAQ, zones d'intervention, simulateurs, procédure, contact, demande, actualités. Aucun parasite flagrant n'a été observé dans les premiers résultats consultés.

| Requête                          | Pages visibles                                 | Problème observé                        | Action recommandée                           |
| -------------------------------- | ---------------------------------------------- | --------------------------------------- | -------------------------------------------- |
| `site:etoilys.fr`                | Accueil, locales, FAQ, simulateurs, actualités | Titles parfois réécrits / suffixe lourd | Nettoyer les titles                          |
| `site:etoilys.fr dordogne`       | Page Dordogne, zones                           | OK                                      | Renforcer Bergerac, Sarlat, Périgueux        |
| `site:etoilys.fr gironde`        | Page Gironde                                   | OK, concurrence forte                   | Créer pages ville/secteur                    |
| `site:etoilys.fr lot-et-garonne` | Page Lot-et-Garonne                            | Bonne visibilité                        | Renforcer Agen, Marmande, Villeneuve-sur-Lot |
| `site:etoilys.fr actualites`     | Hub + articles                                 | Bon index éditorial                     | Améliorer le hub Actualités                  |
| `site:etoilys.fr taxe de séjour` | Simulateur + article                           | Très bon angle                          | Créer des liens depuis les pages locales     |
| `site:etoilys.fr micro bic`      | Articles + simulateur fiscal                   | Fort potentiel                          | Consolider autour d'une page pilier fiscale  |

## Titles et meta descriptions à traiter

Problème global observé : suffixes trop longs ou redondants, par exemple `Actualités meublés de tourisme | Etoilys - Etoilys`, `Classement meublé de tourisme | Etoilys - Classement Meubles de Tourisme`, `Contact Etoilys | Etoilys - Classement Meubles de Tourisme`.

Règle recommandée : standardiser les titles avec un suffixe simple `| Etoilys`.

- [x] Accueil : évaluer le title `Classement meublé de tourisme en Dordogne, Gironde et Lot-et-Garonne | Etoilys`.
- [x] Accueil : évaluer la description `Etoilys accompagne les propriétaires de meublés de tourisme pour obtenir leur classement officiel en Dordogne, Gironde et Lot-et-Garonne.`
- [x] `/classement` : évaluer le title `Classement des meublés de tourisme : principe, avantages et procédure | Etoilys`.
- [x] `/classement` : évaluer la description `Comprendre le classement officiel des meublés de tourisme : étoiles, durée de validité, organisme accrédité, visite et critères à vérifier.`
- [x] `/les-avantages-du-classement` : évaluer le title `Pourquoi faire classer son meublé de tourisme ? | Etoilys`.
- [x] `/les-avantages-du-classement` : évaluer la description `Fiscalité, taxe de séjour, visibilité, confiance des voyageurs : découvrez les avantages concrets du classement officiel d'un meublé de tourisme.`
- [x] `/prerequis-au-classement` : évaluer le title `Prérequis au classement d'un meublé de tourisme | Etoilys`.
- [x] `/prerequis-au-classement` : évaluer la description `Surface, équipements, état du logement, pièces comptabilisables : les points à vérifier avant de demander le classement de votre meublé.`
- [x] `/procedure` : évaluer le title `Procédure de classement d'un meublé de tourisme | Etoilys`.
- [x] `/procedure` : évaluer la description `Découvrez les étapes d'une demande de classement : prise de contact, visite, rapport, proposition de classement et validité 5 ans.`
- [x] `/faq` : évaluer le title `FAQ classement meublé de tourisme | Etoilys`.
- [x] `/faq` : évaluer la description `Réponses aux questions fréquentes sur le classement des meublés de tourisme : fiscalité, taxe de séjour, procédure, durée, obligations.`
- [x] `/simulateur` : évaluer le title `Simulateur de classement meublé de tourisme | Etoilys`.
- [x] `/simulateur` : évaluer la description `Estimez le classement possible de votre meublé de tourisme avant la visite officielle. Simulation gratuite à partir de la grille de classement.`
- [x] `/simulateur-taxe-sejour` : évaluer le title `Simulateur taxe de séjour : meublé classé ou non classé | Etoilys`.
- [x] `/simulateur-taxe-sejour` : évaluer la description `Comparez la taxe de séjour d'un meublé classé et non classé selon la commune, le prix de la nuitée, le nombre de voyageurs et les étoiles.`
- [x] `/simulateur-fiscal-classement` : évaluer le title `Simulateur fiscal meublé classé vs non classé 2026 | Etoilys`.
- [x] `/simulateur-fiscal-classement` : évaluer la description `Comparez l'impact fiscal du classement en micro-BIC : seuils, abattements, base imposable et différence entre meublé classé et non classé.`
- [x] `/actualites` : évaluer le title `Actualités meublés de tourisme : fiscalité, avantages, réglementation | Etoilys`.
- [x] `/actualites` : évaluer la description `Actualités et guides pratiques sur les meublés de tourisme : classement officiel, fiscalité, réglementation, taxe de séjour, obligations locales et démarches propriétaires.`
- [x] Dordogne : évaluer le title `Classement gîte et meublé de tourisme en Dordogne | Etoilys`.
- [x] Dordogne : évaluer la description `Etoilys accompagne les propriétaires de gîtes et meublés de tourisme en Dordogne : Bergerac, Sarlat, Périgueux et secteurs proches.`
- [x] Gironde : évaluer le title `Classement gîte et meublé de tourisme en Gironde | Etoilys`.
- [x] Gironde : reformuler en neutre la description proposée : `Demandez le classement officiel de votre meublé en Gironde : Bordeaux, Libourne, Saint-Émilion, Entre-deux-Mers, Blayais et secteurs proches.`
- [x] Lot-et-Garonne : évaluer le title `Classement gîte et meublé de tourisme en Lot-et-Garonne | Etoilys`.
- [x] Lot-et-Garonne : évaluer la description `Classement officiel de meublés de tourisme en Lot-et-Garonne : Agen, Marmande, Villeneuve-sur-Lot, Casteljaloux, Nérac et alentours.`
- [x] `/demande-classement` : évaluer le title `Demande de classement meublé de tourisme | Etoilys`.
- [x] `/demande-classement` : évaluer la description `Demandez le classement de votre meublé de tourisme. Procédure simple. Etoilys vous recontacte sous 24h pour organiser la visite.`

## Intentions de recherche

| Famille            | Requêtes                                                               | Pages actuelles                                    | Couverture | Opportunité                             | Action                                                      |
| ------------------ | ---------------------------------------------------------------------- | -------------------------------------------------- | ---------- | --------------------------------------- | ----------------------------------------------------------- |
| Service national   | classement meublé de tourisme, organisme classement, visite classement | `/classement`, `/procedure`, `/demande-classement` | Moyenne    | Forte mais concurrence institutionnelle | Renforcer page pilier + preuve COFRAC                       |
| Locale département | Dordogne, Gironde, Lot-et-Garonne                                      | Pages locales                                      | Bonne      | Très forte                              | Consolider le maillage depuis footer, hub et articles       |
| Locale ville       | Bergerac, Agen, Bordeaux, Sarlat, Périgueux, Marmande, Casteljaloux    | Pages départementales                              | Partielle  | Très forte                              | Créer blocs/pages ville selon priorité                      |
| Fiscalité          | micro-BIC, meublé classé/non classé                                    | Articles + simulateur fiscal                       | Très bonne | Forte                                   | Créer une page pilier fiscale reliée au simulateur          |
| Taxe de séjour     | taxe de séjour meublé classé/non classé                                | Simulateur + article                               | Très bonne | Forte                                   | Ajouter des entrées locales taxe séjour Dordogne/Gironde/47 |
| Réglementaire      | 90 jours, DPE, API Meublés, copropriété                                | Articles                                           | Bonne      | Forte                                   | Mettre à jour régulièrement et créer un hub réglementation  |

## SERP et zones prioritaires

### National

La SERP `classement meublé de tourisme` est dominée par Atout France, entreprises.gouv.fr, Service-Public, JeDéclareMonMeublé, Etoiles de France, Clévacances, In Auris et des offices / ADT.

| Requête                                 | Visibilité Etoilys                                | Diagnostic                                       |
| --------------------------------------- | ------------------------------------------------- | ------------------------------------------------ |
| classement meublé de tourisme           | Non visible dans les premiers résultats consultés | Requête nationale très institutionnelle          |
| faire classer son meublé de tourisme    | Non visible / faible                              | Concurrents privés et institutionnels forts      |
| organisme classement meublé tourisme    | Faible                                            | Mieux pousser `organisme accrédité Cofrac`       |
| visite classement meublé de tourisme    | Faible                                            | Page procédure à renforcer                       |
| classement Atout France meublé tourisme | Très difficile                                    | SERP dominée par Atout France et institutionnels |

Action stratégique : ne pas concentrer l'effort sur le national ; la conquête la plus réaliste est locale + informationnelle.

### Dordogne

Etoilys apparaît sur `classement meublé tourisme Dordogne`, mais derrière des acteurs institutionnels ou historiques : Dordogne Périgord Tourisme, Sarlat Tourisme, Vallée Dordogne, In Auris.

| Requête                             | Visibilité Etoilys    | Diagnostic                                     |
| ----------------------------------- | --------------------- | ---------------------------------------------- |
| classement meublé tourisme Dordogne | Visible, pas dominant | Bonne base à renforcer                         |
| classement meublé Bergerac          | Faible / irrégulier   | Ciblage Bergerac à renforcer                   |
| classement meublé Périgueux         | Faible                | SERP parasitée par OT / hébergements           |
| classement meublé Sarlat            | Faible à moyenne      | Sarlat Tourisme très fort                      |
| classement meublé tourisme Périgord | À travailler          | Créer sections Périgord Noir / Pourpre / Blanc |

### Lot-et-Garonne

Etoilys est très bien placé sur `classement meublé tourisme Lot-et-Garonne`, derrière Clévacances et devant ou proche des acteurs institutionnels.

| Requête                                   | Visibilité Etoilys    | Diagnostic                                    |
| ----------------------------------------- | --------------------- | --------------------------------------------- |
| classement meublé tourisme Lot-et-Garonne | Très bonne            | Page à consolider                             |
| classement meublé Agen                    | Faible à moyenne      | Besoin de signaux dédiés Agen                 |
| classement meublé Marmande                | Faible                | SERP parasitée par location meublée classique |
| classement meublé Villeneuve-sur-Lot      | Faible                | SERP bruitée immobilier                       |
| classement meublé Casteljaloux            | Potentiel intéressant | Moins concurrentiel                           |
| classement meublé Nérac                   | Faible                | Requête bruitée garde-meuble / locations      |

### Gironde

Etoilys est visible sur `classement meublé tourisme Gironde`, mais derrière Gironde Tourisme, FNAIM, Gîtes de France, AGIFOM et Clévacances.

| Requête                            | Visibilité Etoilys                            | Diagnostic                             |
| ---------------------------------- | --------------------------------------------- | -------------------------------------- |
| classement meublé tourisme Gironde | Visible                                       | Bonne page, concurrence forte          |
| classement meublé Bordeaux         | Faible                                        | SERP mixte réglementation + organismes |
| classement meublé Libourne         | Faible                                        | Opportunité locale                     |
| classement meublé Arcachon         | Faible                                        | Institutionnels forts sur le bassin    |
| classement meublé Saint-Émilion    | Visible via page Gironde sur requête enrichie | Bon potentiel oenotourisme             |
| classement meublé Blaye            | Faible                                        | Opportunité BBTE / Haute-Gironde       |

Priorisation recommandée : Libourne, Saint-Émilion, Blaye et Entre-deux-Mers avant Bordeaux pur, plus difficile et plus réglementaire.

### Informationnel

Etoilys est déjà présent sur plusieurs requêtes longues : micro-BIC, taxe de séjour, DPE, API Meublés, copropriété, 90 jours.

| Requête                                    | Visibilité Etoilys         | Diagnostic                  |
| ------------------------------------------ | -------------------------- | --------------------------- |
| micro bic meublé classé 2026               | Bonne sur longue traîne    | Très bon angle SEO          |
| meublé classé non classé fiscalité         | Bonne base                 | Consolider avec page pilier |
| taxe de séjour meublé classé               | Bonne                      | Article + simulateur solide |
| Airbnb résidence principale 90 jours       | Bonne sur requête enrichie | Continuer les mises à jour  |
| copropriété location touristique règlement | Bonne sur requête enrichie | Sujet pertinent             |
| DPE meublé de tourisme 2034                | Bonne                      | Article récent pertinent    |
| API Meublés déclaration                    | Bonne                      | Sujet chaud à mettre à jour |

## Analyse concurrentielle

| Concurrent                        | Type                 | Forces                                 | Faiblesses                                                     | Opportunité Etoilys                                                |
| --------------------------------- | -------------------- | -------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------ |
| Atout France                      | Institutionnel       | Autorité maximale, source officielle   | Peu orienté conversion locale                                  | Citer et s'aligner sur la source officielle, sans attaque frontale |
| Service-Public / entreprises.gouv | Institutionnel       | Confiance, définitions                 | Pas commercial, peu local                                      | Se positionner explication + passage à l'action, en restant neutre |
| ADT / CDT / OT                    | Institutionnel local | Autorité locale, ancienneté, backlinks | Contenus parfois datés, UX moyenne                             | Produire plus clair, plus actuel, plus orienté propriétaire        |
| Gironde Tourisme                  | Institutionnel local | Très fort en Gironde                   | Peu orienté conversion directe privée                          | Jouer zones ciblées et simplicité de parcours                      |
| Dordogne Périgord Tourisme        | Institutionnel local | Très fort en Dordogne                  | Documents PDF, parcours parfois lourd                          | Proposer un parcours simple et une demande directe                 |
| Clévacances                       | Label / organisme    | Forte marque, pages locales            | Positionnement label + classement parfois mélangé              | Clarifier classement officiel sans adhésion label                  |
| Gîtes de France                   | Label / organisme    | Très forte notoriété                   | Peut être perçu comme réseau/adhésion                          | Insister sur indépendance et simplicité                            |
| In Auris                          | Concurrent privé     | Large couverture, expérience           | Pages parfois anciennes/génériques                             | Gagner localement avec pages très ciblées                          |
| Etoiles de France                 | Concurrent privé     | Ancienneté SEO                         | Certains contenus datés, dont mention de 112 critères observée | Mettre en avant fraîcheur 2026 + exactitude                        |
| JeDéclareMonMeublé / LMNP.ai      | Fiscalité / contenu  | Très forts sur fiscalité               | Pas organisme local de visite                                  | Récupérer l'intention comprendre puis demander classement          |

Signal de confiance à mieux exploiter : Etoilys figure dans la liste officielle des organismes accrédités avec statut `VALIDE`, accréditation n°3-2394.

## Contenu et maillage interne

Ce qui fonctionne :

- FAQ solide : définition, classement obligatoire ou non, durée, fiscalité, taxe de séjour, déclaration mairie, SIRET, cas particuliers ;
- pages locales utiles : gîte, Airbnb, appartement, zone d'intervention, coût, durée, déclaration, fiscalité ;
- articles bien choisis : API Meublés, DPE, facturation électronique, taxe de séjour, seuils micro-BIC, 90 jours, copropriété, réforme 2025-2026 ;
- footer déjà utile pour mailler services, outils, zones d'intervention, actualités et FAQ.

Points de blocage :

- pages départementales trop chargées en villes pour convaincre sur chaque requête ville ;
- homepage trop large avec `partout en France` ;
- certaines formulations marketing trop fortes ou trop génériques au regard de la stratégie locale et des règles de conformité éditoriale.

Ancres recommandées :

- `classement de meublé de tourisme en Dordogne`
- `classement de gîte à Bergerac`
- `classement de meublé à Agen`
- `classement Airbnb en Gironde`
- `demander une visite de classement en Lot-et-Garonne`
- `comparer la taxe de séjour d'un meublé classé`

## Audit technique externe

Vérifié dans l'audit externe :

- site accessible ;
- pages principales rendues en HTML lisible par les outils de recherche ;
- H1 présents ;
- liens internes visibles ;
- pages importantes indexables et visibles via recherches `site:` ;
- contenu textuel accessible, donc pas bloqué dans une app React invisible aux moteurs.

Non vérifié proprement dans l'audit externe :

- `robots.txt` ;
- `sitemap.xml` ;
- statuts HTTP détaillés ;
- canonicals ;
- hreflang ;
- Core Web Vitals ;
- poids images ;
- profondeur de clic complète ;
- erreurs 404/500 ;
- pages orphelines ;
- balises JSON-LD réelles.

À vérifier côté repo : SEO centralisé dans `src/content/seoRoutes.ts`, génération sitemap/prerender par scripts, Article JSON-LD via `src/content/articleStructuredData.ts`.

## Checklist priorisée

### P0 - À faire vite

- [x] Nettoyer tous les titles et supprimer les suffixes lourds.
- [x] Éviter les titles dupliqués du type `Etoilys - Etoilys`.
- [x] Standardiser le suffixe title en `| Etoilys`.
- [x] Corriger la homepage pour remplacer `partout en France` par une formulation centrée Dordogne, Gironde, Lot-et-Garonne et secteurs proches de Bergerac.
- [ ] Garder l'éventuelle expansion nationale hors promesse principale de homepage.
- [ ] Créer ou renforcer un bloc/page ville pour Bergerac.
- [ ] Créer ou renforcer un bloc/page ville pour Agen.
- [ ] Créer ou renforcer un bloc/page ville pour Sarlat.
- [ ] Créer ou renforcer un bloc/page ville pour Périgueux.
- [ ] Créer ou renforcer des contenus ville/secteur pour Libourne et Saint-Émilion.
- [ ] Reporter Bordeaux après les zones plus accessibles, sauf besoin business prioritaire.
- [ ] Mieux exploiter la preuve COFRAC sur les pages service et locales.
- [ ] Ajouter un badge ou bloc court `Organisme accrédité COFRAC n°3-2394`.
- [ ] Ajouter un lien vers la portée officielle / Atout France quand pertinent.

### P1 - Fort levier SEO

- [ ] Transformer `/zones-intervention` en vrai hub SEO local.
- [ ] Ajouter une carte ou représentation claire des zones couvertes sur `/zones-intervention`.
- [ ] Structurer `/zones-intervention` par départements.
- [ ] Structurer `/zones-intervention` par villes prioritaires.
- [ ] Ajouter les secteurs couverts sur `/zones-intervention`.
- [ ] Ajouter un CTA conforme et neutre sur `/zones-intervention`.
- [ ] Ajouter une FAQ courte sur `/zones-intervention`.
- [ ] Créer une page pilier `Fiscalité du meublé classé en 2026`.
- [ ] Relier la page pilier fiscalité aux articles micro-BIC.
- [ ] Relier la page pilier fiscalité au simulateur fiscal.
- [ ] Couvrir seuils, abattements, classé vs non classé, régime réel et micro-social sur la page pilier fiscalité.
- [ ] Créer une page pilier `Taxe de séjour et classement`.
- [ ] Relier la page pilier taxe de séjour à l'article taxe existant.
- [ ] Relier la page pilier taxe de séjour au simulateur taxe.
- [ ] Ajouter au moins un exemple local sur la page pilier taxe de séjour.
- [ ] Ajouter des FAQ locales en bas des pages départementales.
- [ ] Ajouter une question locale du type `Etoilys intervient-il à Agen ?`.
- [ ] Ajouter une question locale du type `Peut-on faire classer un Airbnb à Bergerac ?`.
- [ ] Ajouter une question locale du type `Combien coûte une visite en Gironde ?`.
- [ ] Ajouter une question locale du type `Le classement remplace-t-il la déclaration en mairie ?`.

### P2 - Croissance éditoriale

- [ ] Publier un article evergreen `Déclaration en mairie d'un meublé de tourisme : ce qui change avec API Meublés`.
- [ ] Publier un article evergreen `Classement meublé de tourisme : combien de temps faut-il prévoir ?`.
- [ ] Publier un article evergreen `Gîte, Airbnb, location saisonnière : est-ce toujours un meublé de tourisme ?`.
- [ ] Publier un article evergreen `Classement 1, 2, 3, 4 ou 5 étoiles : comment choisir la catégorie visée ?`.
- [ ] Mettre à jour régulièrement les articles 2026 sur API Meublés.
- [ ] Mettre à jour régulièrement les articles 2026 sur fiscalité.
- [ ] Mettre à jour régulièrement les articles 2026 sur DPE.
- [ ] Mettre à jour régulièrement les articles 2026 sur facturation électronique.
- [ ] Créer un hub ou une structuration éditoriale `réglementation` si les articles réglementaires continuent à croître.

### Maillage interne

- [ ] Ajouter des liens depuis `/zones-intervention` vers chaque page départementale.
- [ ] Ajouter des liens depuis chaque page départementale vers les villes prioritaires.
- [ ] Ajouter des liens depuis les articles fiscaux vers le simulateur fiscal.
- [ ] Ajouter des liens depuis l'article taxe de séjour vers le simulateur taxe.
- [ ] Ajouter des liens depuis les pages locales vers `/demande-classement` avec ancre locale conforme.
- [ ] Ajouter des liens depuis la FAQ vers les pages locales quand une question est liée à une zone.
- [ ] Ajouter des liens depuis les pages locales vers les contenus taxe de séjour quand pertinent.
- [ ] Ajouter des liens depuis les pages locales vers les contenus fiscalité quand pertinent.

### Vérifications techniques

- [ ] Vérifier que `robots.txt` est bien publié.
- [ ] Vérifier que `sitemap.xml` est bien publié.
- [ ] Vérifier les statuts HTTP des pages stratégiques.
- [ ] Vérifier les canonicals.
- [ ] Vérifier l'absence de besoin `hreflang`.
- [ ] Vérifier les Core Web Vitals, en particulier LCP mobile.
- [ ] Vérifier le poids des images critiques.
- [ ] Vérifier la profondeur de clic complète.
- [ ] Vérifier les 404/500 éventuelles.
- [ ] Vérifier les pages orphelines.
- [ ] Vérifier les JSON-LD Article, Organization, WebSite et Breadcrumb.
- [ ] Vérifier les redirections www/non-www.
- [ ] Vérifier que les routes dynamiques ou états internes du simulateur restent en `noindex` si nécessaire.

### Données à récupérer dans Search Console

- [ ] Requêtes exactes générant des impressions.
- [ ] Positions moyennes par page.
- [ ] CTR par title.
- [ ] Pages découvertes mais non indexées.
- [ ] Cannibalisation éventuelle entre `/classement`, `/les-avantages-du-classement`, FAQ et articles.
- [ ] Performance des pages locales par ville.
- [ ] Requêtes avec impressions sans clic.
- [ ] Pages en position 8-20.
- [ ] Titles réécrits par Google.
- [ ] Villes qui émergent dans les impressions.

## Roadmap proposée

### Semaine 1

- [ ] Nettoyage titles/meta.
- [ ] Correction homepage.
- [ ] Renforcement COFRAC.
- [ ] Vérification sitemap/robots/canonicals dans le repo et en production.
- [ ] Ajout d'ancres internes depuis footer/hub vers pages locales.

### Semaines 2-3

- [ ] Créer page ou bloc fort Bergerac.
- [ ] Créer page ou bloc fort Agen.
- [ ] Ajouter FAQ locales sur Dordogne.
- [ ] Ajouter FAQ locales sur Lot-et-Garonne.
- [ ] Ajouter FAQ locales sur Gironde.
- [ ] Ajouter liens contextuels depuis articles vers simulateurs.

### Mois 2

- [ ] Créer pages ou sections Sarlat.
- [ ] Créer pages ou sections Périgueux.
- [ ] Créer pages ou sections Libourne.
- [ ] Créer pages ou sections Saint-Émilion.
- [ ] Créer page pilier fiscalité.
- [ ] Créer page pilier taxe de séjour.
- [ ] Publier deux articles evergreen.

### Mois 3

- [ ] Ajuster selon les requêtes avec impressions mais CTR faible.
- [ ] Ajuster selon les pages en position 8-20.
- [ ] Ajuster selon les villes qui émergent.
- [ ] Ajuster selon les titles réécrits par Google.
- [ ] Ajuster selon les pages non indexées.

## Références citées dans l'audit

- Site Etoilys : <https://www.etoilys.fr/>
- Actualités Etoilys : <https://www.etoilys.fr/actualites>
- Article micro-BIC Etoilys : <https://www.etoilys.fr/actualites/micro-bic-2026-meuble-classe-vs-non-classe>
- FAQ Etoilys : <https://www.etoilys.fr/faq>
- Page Dordogne Etoilys : <https://www.etoilys.fr/classement-meuble-tourisme-dordogne>
- Atout France - classement des meublés de tourisme : <https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme>
- Atout France - organismes accrédités meublés de tourisme : <https://www.atout-france.fr/sites/default/files/2026-03/OEC%20meubl%C3%A9s%2002-03-2026.pdf>
- Dordogne Périgord Tourisme : <https://www.dordogne-perigord-tourisme.fr/espace-pro/classement-meubles-tourisme/>
- Clévacances Lot-et-Garonne : <https://www.clevacances.com/fr/pages/198-classement-meuble-de-tourisme-lot-et-garonne>
- Gironde Tourisme : <https://www.gironde-tourisme.com/espace-pro/hebergements/meubles-de-tourisme/le-classement-2/>
