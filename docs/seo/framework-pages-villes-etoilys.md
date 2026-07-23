# Framework de création des pages villes Etoilys

Version : 2026-07-22  
Projet : site public Etoilys  
Usage : document de référence pour rechercher, rédiger et intégrer progressivement des pages locales consacrées aux villes ou bassins d’intervention d’Etoilys.

---

## 1. Objectif du framework

Etoilys souhaite publier progressivement des pages locales capables de répondre à des recherches du type :

- `classement meublé de tourisme Bergerac` ;
- `organisme classement meublé Bordeaux` ;
- `faire classer un gîte à Périgueux` ;
- `classement location saisonnière Agen`.

Ces pages doivent servir trois objectifs simultanés :

1. **répondre clairement à une intention locale** ;
2. **présenter l’intervention réelle d’Etoilys sur le secteur** ;
3. **orienter le propriétaire vers une demande de classement**.

Le framework doit permettre de créer des pages cohérentes entre elles sans produire des copies où seul le nom de la ville change.

Le principe retenu est donc :

> une structure commune, des composants communs et des blocs partagés, mais une couche locale substantielle, vérifiée et spécifique à chaque territoire.

La page doit rester utile à un propriétaire qui arriverait directement dessus sans avoir consulté le reste du site.

---

## 2. Principes non négociables

### 2.1 Une page locale doit correspondre à une intervention réelle

Une page ville ne doit être publiée que si Etoilys peut réellement traiter les demandes du secteur selon des conditions claires et reproductibles.

La page ne doit jamais :

- laisser croire qu’Etoilys possède une agence ou un bureau local inexistant ;
- inventer une équipe locale ;
- inventer un partenariat avec un office de tourisme ;
- promettre un tarif, un délai ou une disponibilité non confirmés ;
- présenter une zone comme systématiquement couverte si les interventions y sont seulement ponctuelles ou conditionnelles.

Lorsque les interventions sont soumises à l’organisation d’une tournée, à un délai particulier ou à des conditions tarifaires spécifiques, la page doit l’indiquer clairement.

### 2.2 Le framework ne doit pas produire des pages satellites

Toutes les pages villes suivent une même architecture, mais elles ne doivent pas être des variantes automatisées de la même copy.

La mutualisation porte sur :

- la mise en page ;
- la structure des sections ;
- les composants UI ;
- les explications nationales stables ;
- le déroulement général du classement ;
- les CTA ;
- les mécanismes SEO techniques.

La personnalisation porte au minimum sur :

- le hero ;
- la zone réellement couverte ;
- le contexte territorial ;
- les règles locales quand elles existent ;
- les informations pratiques locales ;
- la FAQ ;
- les modalités commerciales lorsqu’elles varient ;
- les sources et leur date de vérification.

Google recommande de créer des contenus utiles et fiables pour les internautes, avec une vraie valeur propre, plutôt que de nombreuses pages produites principalement pour capter des recherches. Une page locale ne doit donc pas être publiée si aucune information locale substantielle ne peut être apportée.

### 2.3 La précision géographique prime sur le nom commercial de la page

Une page peut être nommée d’après une ville tout en couvrant un territoire plus large :

- Bergerac et le Bergeracois ;
- Périgueux et le Grand Périgueux ;
- Bordeaux et Bordeaux Métropole ;
- Agen et l’Agenais ;
- Bassin d’Arcachon.

Cependant, chaque affirmation locale doit être rattachée au bon périmètre.

Exemple :

- la zone d’intervention commerciale d’Etoilys peut inclure des communes relevant de plusieurs EPCI ;
- une information sur la taxe de séjour d’un EPCI ne doit concerner que les communes relevant effectivement de cet EPCI ;
- une règle communale de changement d’usage ne doit jamais être présentée comme applicable aux communes voisines ;
- une statistique portant sur une agglomération ne doit pas être attribuée à la seule ville-centre.

### 2.4 Les informations locales doivent être datées et sourcées

Toute affirmation susceptible d’évoluer doit indiquer son année ou sa date de vérification :

- taxe de séjour ;
- procédure d’enregistrement ;
- changement d’usage ;
- limite locale de location d’une résidence principale ;
- tarifs d’Etoilys ;
- partenariat avec un office de tourisme ;
- statistiques touristiques ;
- composition d’un EPCI ;
- modalités d’intervention.

La page doit disposer d’un champ interne de type `localInformationVerifiedAt` ou équivalent, même si cette date n’est pas nécessairement affichée dans le hero.

### 2.5 Ne rien ajouter sur la page d’accueil

La création des pages villes ne doit entraîner :

- aucun nouveau bloc sur la page d’accueil ;
- aucun ajout de villes dans la navigation principale ;
- aucune liste de villes dans le footer.

Le maillage doit principalement passer par :

- `/zones-intervention` ;
- la page départementale parente ;
- les pages villes voisines lorsque le lien est pertinent ;
- les pages de service et outils utiles.

---

## 3. Conditions minimales avant de publier une page ville

Une page ne doit pas être intégrée tant que les éléments suivants ne sont pas disponibles ou explicitement validés.

### Obligatoire

- nom de la ville ou du bassin ciblé ;
- département parent ;
- slug définitif ;
- zone d’intervention réelle ;
- liste indicative de communes couvertes ;
- rattachement EPCI exact de chaque commune citée dans une information fiscale ou réglementaire ;
- modalités tarifaires confirmées par Etoilys ;
- hero avec une image locale utilisable légalement ;
- au moins deux éléments locaux réellement utiles et vérifiables pour le bloc 3 ;
- cinq questions de FAQ au minimum ;
- sources officielles ou institutionnelles suffisantes ;
- date de vérification des informations locales.

### Facultatif

- avis client local ;
- partenariat local ;
- volume de visites déjà réalisé ;
- inspecteur identifié sur le secteur ;
- photo prise lors d’une intervention ;
- modalités de tournée très spécifiques ;
- témoignage ou cas concret.

L’absence de preuve locale ne doit pas bloquer la page si les autres blocs sont solides. Elle entraîne simplement la suppression totale du bloc 6.

---

## 4. Architecture éditoriale commune

Chaque page ville doit respecter l’ordre général suivant :

1. Hero avec image locale et réponse immédiate ;
2. Zone d’intervention précise ;
3. Particularités et informations locales utiles ;
4. Déroulement du classement ;
5. Tarifs et modalités commerciales ;
6. Preuve ou ancrage local — facultatif ;
7. FAQ locale ;
8. CTA final.

Le fil d’Ariane, les métadonnées SEO et les sources ne sont pas comptés comme des blocs éditoriaux, mais doivent être intégrés dans l’architecture technique.

---

# Bloc 1 — Hero local

## Statut

Obligatoire.

## Objectif

Le propriétaire doit comprendre dès l’écran initial :

- que la page concerne son secteur ;
- qu’Etoilys réalise le classement officiel des meublés de tourisme ;
- qu’il peut déposer une demande ;
- que l’intervention couvre potentiellement les communes voisines.

## Éléments attendus

- image réellement représentative du territoire ;
- badge ou sur-titre éventuel ;
- H1 local ;
- chapô court ;
- CTA principal vers `/demande-classement` ;
- CTA secondaire éventuel vers `/simulateur` ou `/procedure` ;
- texte alternatif descriptif de l’image.

## Modèle de H1

```text
Classement de meublé de tourisme à [VILLE] et dans [BASSIN]
```

Le H1 peut être adapté si la dénomination locale naturelle est différente.

## Principes de rédaction

- utiliser l’expression principale naturellement ;
- ne pas aligner artificiellement `gîte`, `Airbnb`, `location saisonnière`, `étoiles` et le nom de toutes les communes ;
- ne pas prétendre qu’Etoilys est physiquement implanté dans la ville si ce n’est pas le cas ;
- répondre en trois ou quatre phrases maximum ;
- expliquer que la visite est réalisée sur place ;
- rester factuel et rassurant.

## Image locale

L’image doit :

- représenter réellement la ville ou le bassin ;
- être utilisable légalement ;
- être suffisamment qualitative pour un hero ;
- passer par le pipeline d’images existant du repo ;
- disposer des variantes et dimensions attendues par `SmartImage` ;
- éviter les clichés touristiques trompeurs ou une photographie d’un logement qui ne serait pas lié à Etoilys.

Le brief de recherche doit fournir :

- le sujet recommandé ;
- le lieu visible ;
- le crédit et la licence ;
- une ou plusieurs sources d’image possibles ;
- une alternative si aucune image exploitable n’est trouvée.

Aucune image ne doit être intégrée par Codex tant que son origine et son droit d’utilisation ne sont pas établis.

---

# Bloc 2 — Zone d’intervention précise

## Statut

Obligatoire.

## Objectif

Aider le propriétaire à vérifier rapidement si son logement se trouve dans le secteur habituellement couvert.

## Contenu attendu

- ville principale ;
- communes voisines couramment desservies ;
- nom du bassin ou de l’agglomération ;
- mention claire que la liste n’est pas exhaustive ;
- invitation à contacter Etoilys pour une commune non citée ;
- conditions particulières éventuelles pour les communes plus éloignées.

## Formulation obligatoire sur la portée de la liste

Le wording exact peut varier, mais l’idée suivante doit apparaître :

> Cette liste est indicative et non exhaustive. Etoilys peut également intervenir dans d’autres communes du secteur selon la localisation du meublé et l’organisation des visites.

## Règle EPCI

La liste des communes couvertes commercialement peut dépasser le périmètre d’un EPCI.

En revanche, toute information locale portant sur :

- la taxe de séjour ;
- l’enregistrement ;
- une délibération ;
- un changement d’usage ;
- un plafond local de nuitées ;
- une formalité administrative ;

ne doit citer que les communes relevant du territoire auquel cette information s’applique.

Si la page couvre plusieurs EPCI, le texte doit distinguer les périmètres :

```text
Pour les communes relevant de [EPCI A]…

Pour les communes relevant de [EPCI B]…
```

Il est interdit d’utiliser une règle de la ville-centre comme raccourci pour l’ensemble du bassin.

## Sources géographiques recommandées

- Code officiel géographique de l’Insee ;
- base officielle des EPCI ;
- table d’appartenance géographique des communes ;
- sites officiels des communes et intercommunalités.

Les listes trouvées sur des annuaires privés ou des sites touristiques ne doivent pas servir seules à déterminer le rattachement administratif.

---

# Bloc 3 — Particularités et informations locales utiles

## Statut

Obligatoire dans son principe, mais modulaire dans son contenu.

## Rôle SEO et éditorial

Ce bloc est le principal différenciateur entre les pages villes.

Il faut le **blinder en qualité, en précision et en utilité**, mais pas en longueur artificielle.

Une page avec deux informations locales solides et très utiles vaut mieux qu’une page remplie de chiffres génériques sur la population, le patrimoine ou le nombre de touristes.

Le bloc doit aider un propriétaire à répondre à au moins deux questions concrètes parmi les suivantes :

- Quelle autorité locale gère la taxe de séjour ?
- Quel tarif ou régime de taxe de séjour s’applique ?
- Existe-t-il une procédure locale d’enregistrement ?
- Existe-t-il une règle de changement d’usage ?
- La commune a-t-elle adopté un plafond inférieur à 120 jours pour les résidences principales ?
- Quelle est la réalité touristique du secteur ?
- Quels types de meublés rencontre-t-on localement ?
- Quelles particularités pratiques peuvent influencer la préparation d’une visite de classement ?
- Comment Etoilys organise-t-il ses interventions dans le secteur ?

## Seuil minimal recommandé

Avant publication, le bloc doit contenir au minimum :

- **deux sous-sections locales substantielles**, ou
- **une sous-section réglementaire/fiscale forte et une sous-section pratique forte**.

Une page ne doit pas être créée uniquement avec :

- une description touristique de la ville ;
- quelques chiffres démographiques ;
- une liste de monuments ;
- un paragraphe générique sur l’attrait de la location saisonnière.

## Bibliothèque de modules locaux

Tous les modules ci-dessous sont facultatifs individuellement. Le moteur de page doit permettre d’en sélectionner seulement ceux qui sont pertinents.

### Module A — Taxe de séjour locale

Informations à rechercher :

- collectivité ou EPCI qui institue et collecte la taxe ;
- année d’application ;
- régime au réel ou au forfait ;
- tarif par étoile pour les meublés classés ;
- taux proportionnel des hébergements non classés, si pertinent ;
- taxes additionnelles applicables ;
- période de perception ;
- plateforme ou portail de déclaration ;
- lien officiel de vérification.

Sources prioritaires :

1. portail officiel DGFiP des délibérations de taxe de séjour ;
2. délibération ou guide de l’EPCI ;
3. site de l’office de tourisme ou de la collectivité en charge de la collecte ;
4. jeu de données DELTA publié par l’administration.

Règles :

- toujours indiquer l’année ;
- vérifier que les communes citées appartiennent au territoire concerné ;
- ne pas calculer ou extrapoler un tarif manquant ;
- ne pas présenter la taxe de séjour comme un avantage uniforme du classement sans expliquer le régime local ;
- distinguer clairement tarif national encadré et délibération locale.

### Module B — Déclaration, enregistrement et changement d’usage

Informations à rechercher :

- formulaire ou téléservice applicable ;
- autorité compétente ;
- numéro d’enregistrement éventuel ;
- changement d’usage éventuel ;
- compensation éventuelle ;
- régime résidence principale / résidence secondaire ;
- plafond local éventuel de location d’une résidence principale ;
- date d’entrée en vigueur ;
- sanctions uniquement si elles sont utiles et clairement sourcées.

Sources prioritaires :

1. Légifrance pour le cadre national ;
2. Service-Public ;
3. site officiel de la ville ou de l’EPCI ;
4. délibération locale ;
5. préfecture lorsque la règle relève d’un dispositif préfectoral.

Règles :

- distinguer règle nationale et décision locale ;
- ne jamais affirmer qu’une règle locale vaut pour tout le département ;
- ne pas confondre classement et obligations de mise en location ;
- rappeler sobrement que le classement ne remplace pas les déclarations ou autorisations locales.

### Module C — Contexte touristique et données locales

Informations possibles :

- capacité officielle en hébergements touristiques ;
- importance du tourisme dans l’économie locale ;
- fréquentation ou saisonnalité ;
- part de clientèle étrangère ;
- typologie des hébergements ;
- données d’un observatoire touristique local ;
- position du territoire dans une destination touristique reconnue.

Sources prioritaires :

- Insee ;
- observatoire régional ou départemental du tourisme ;
- agence départementale du tourisme ;
- office de tourisme ou EPCI ;
- données publiques de la DGE ;
- data.gouv.fr lorsque le producteur est clairement identifié.

Règles :

- dater chaque chiffre ;
- préciser le périmètre exact : commune, EPCI, département ou région ;
- ne pas attribuer à la commune une statistique départementale ;
- ne pas présenter les données relatives aux hôtels, campings ou hébergements collectifs comme des données sur les meublés de tourisme ;
- ne pas déduire un nombre de meublés ou un potentiel commercial sans source ;
- éviter les chiffres qui n’aident pas le propriétaire.

### Module D — Typologie locale des biens et points de vigilance

Informations possibles :

- présence fréquente de maisons anciennes, échoppes, appartements en centre-ville, domaines ruraux, logements avec piscine, dépendances ou bâtiments divisés ;
- contraintes récurrentes liées aux surfaces, aux couchages, aux accès ou aux équipements ;
- importance de certains équipements dans le contexte local ;
- situations où plusieurs logements se trouvent sur une même propriété ;
- saisonnalité qui influence la disponibilité pour les visites.

Ce module doit être fondé sur :

- l’expérience réelle d’Etoilys ;
- les retours d’inspection ;
- des informations fournies par Florian ou l’équipe ;
- éventuellement des données institutionnelles correctement interprétées.

ChatGPT ne doit pas inventer cette expérience à partir de clichés architecturaux ou touristiques.

Lorsque les informations manquent, le prompt final destiné à Codex doit demander à Florian de les fournir ou supprimer ce module.

### Module E — Écosystème touristique local

Informations possibles :

- offices de tourisme compétents ;
- organisation touristique du territoire ;
- interlocuteur chargé de la taxe de séjour ;
- ressources utiles pour les loueurs ;
- partenariats Etoilys confirmés ;
- tarif préférentiel réservé aux adhérents d’un office partenaire.

Règles :

- ne jamais qualifier un organisme de partenaire sans confirmation d’Etoilys ;
- distinguer un simple lien utile d’un partenariat commercial ;
- vérifier que l’office ou la structure couvre bien les communes citées ;
- ne pas afficher les coordonnées d’un tiers sans raison utile.

### Module F — Modalités pratiques d’intervention Etoilys

Informations possibles :

- fréquence ou logique des tournées ;
- délai habituel de prise de contact ;
- possibilité de regrouper plusieurs visites ;
- conditions particulières de déplacement ;
- intervention habituelle ou sur étude ;
- période de forte demande ;
- capacité à traiter plusieurs meublés d’un même propriétaire ou secteur.

Ces informations doivent être fournies ou confirmées par Etoilys.

Le moteur de recherche ou ChatGPT ne doit pas les déduire.

## Ce qu’il ne faut pas mettre dans le bloc local

- histoire générale de la ville sans rapport avec le propriétaire ;
- inventaire de monuments ;
- adjectifs promotionnels génériques : « destination incontournable », « cadre idyllique », etc. ;
- données démographiques sans utilité ;
- statistiques de plateformes privées non expliquées ;
- nombre estimé d’Airbnb obtenu par un outil commercial sans méthodologie solide ;
- promesses de rentabilité ;
- affirmation selon laquelle le classement augmente automatiquement le taux d’occupation ou les revenus ;
- conseils fiscaux personnalisés ;
- reformulation locale d’une règle nationale déjà expliquée ailleurs sans valeur supplémentaire.

## Présentation du bloc

Selon les informations trouvées, le bloc peut utiliser :

- deux à quatre sous-sections ;
- un tableau comparatif ;
- une checklist ;
- un encadré de vigilance ;
- quelques statistiques en cartes ;
- des liens officiels utiles.

Le template doit accepter des variantes sans obliger chaque ville à utiliser exactement les mêmes composants.

Les sources officielles doivent être affichées soit :

- directement à proximité de l’information ;
- dans un sous-bloc compact « Sources locales » ;
- ou dans une section de sources partagée en bas de page.

La méthode doit rester cohérente sur toutes les pages villes.

---

# Bloc 4 — Déroulement du classement

## Statut

Obligatoire et largement mutualisable.

## Objectif

Expliquer brièvement comment la prestation se déroule, sans recopier toute la page `/procedure`.

## Structure recommandée

Trois ou quatre étapes maximum :

1. envoi de la demande ;
2. échange avec Etoilys et contractualisation ;
3. visite sur place ;
4. transmission du certificat et de la décision selon la procédure applicable.

## Règles

- réutiliser une copy commune lorsque les modalités ne varient pas ;
- ajouter uniquement une phrase locale si l’organisation des visites le justifie ;
- intégrer un lien contextuel vers `/procedure` ;
- ne pas dupliquer le détail complet des 133 critères ;
- ne pas transformer la page locale en deuxième page pilier sur la procédure.

---

# Bloc 5 — Tarifs et modalités commerciales

## Statut

Obligatoire, mais son contenu doit être confirmé avant intégration.

## Objectif

Donner une information suffisamment précise pour rassurer le propriétaire, sans afficher un tarif trompeur lorsque le prix dépend du secteur ou de la mission.

## Contenu attendu

- fourchette tarifaire applicable à la zone ;
- mention du tarif préférentiel pour les adhérents d’un office de tourisme partenaire, lorsqu’un partenariat existe ;
- majoration ou niveau tarifaire supérieur pour une demande urgente, si Etoilys applique réellement cette règle ;
- tarif dégressif lorsque plusieurs meublés sont classés dans le même secteur ou pendant une même tournée ;
- éventuels frais ou conditions de déplacement ;
- rappel que le tarif définitif est confirmé avant contractualisation.

## Données que ChatGPT ou Codex ne doivent jamais inventer

- montant minimum ;
- montant maximum ;
- montant du tarif adhérent ;
- définition exacte d’une urgence ;
- niveau de majoration urgente ;
- seuil déclenchant la dégressivité ;
- formule de remise ;
- frais de déplacement ;
- délai garanti ;
- liste des offices partenaires.

## Questions obligatoires si les informations manquent

Le prompt final destiné à Codex doit lui demander de poser à Florian, avant l’implémentation, une série courte et consolidée de questions portant sur les données manquantes.

Exemple :

1. Quelle fourchette tarifaire doit être affichée pour cette zone ?
2. Quels offices de tourisme partenaires ouvrent droit à un tarif préférentiel et quel est ce tarif ?
3. Comment définis-tu une demande urgente et quel supplément ou tarif doit être annoncé ?
4. Quelle dégressivité faut-il afficher pour plusieurs meublés dans le même secteur ?
5. Des frais ou conditions de déplacement spécifiques s’appliquent-ils ?

Codex ne doit pas intégrer de placeholder du type `[TARIF À CONFIRMER]` en production.

Si l’information n’est pas disponible, il doit attendre la réponse ou proposer de masquer temporairement la précision concernée.

## Formulation générale attendue

Le texte doit expliquer que :

- le tarif varie selon les conditions de la mission ;
- les adhérents d’un office partenaire peuvent bénéficier d’un tarif préférentiel ;
- une demande urgente peut être facturée plus cher ;
- plusieurs visites regroupées peuvent bénéficier d’un tarif dégressif ;
- le propriétaire reçoit une confirmation claire avant de s’engager.

La page ne doit pas donner l’impression que la fourchette haute sera systématiquement appliquée.

---

# Bloc 6 — Preuve ou ancrage local

## Statut

Facultatif.

## Objectif

Renforcer la crédibilité locale avec une preuve réelle.

## Éléments possibles

- avis d’un client du secteur ;
- photo d’une intervention réelle ;
- nombre de visites réalisées, si le chiffre est significatif et vérifiable ;
- partenariat confirmé ;
- présentation de l’inspecteur affecté au secteur ;
- retour d’expérience local ;
- exemple anonymisé d’une situation réellement rencontrée.

## Règle d’affichage

Si aucune preuve réelle n’est disponible :

- le composant doit retourner `null` ;
- aucun titre vide ne doit apparaître ;
- aucun espace ne doit être réservé ;
- aucun avis générique national ne doit être artificiellement présenté comme local.

---

# Bloc 7 — FAQ locale

## Statut

Obligatoire.

## Objectif

Répondre aux recherches longues et aux objections concrètes, sans répéter mécaniquement la FAQ nationale.

## Volume recommandé

Cinq à huit questions.

## Répartition recommandée

- deux ou trois questions réellement locales ;
- deux ou trois questions sur la prestation dans le secteur ;
- une ou deux questions générales indispensables au parcours de conversion.

## Questions possibles

- Etoilys intervient-il à [VILLE] et dans les communes voisines ?
- Quelles communes sont couvertes autour de [VILLE] ?
- Combien coûte le classement d’un meublé à [VILLE] ?
- Existe-t-il un tarif pour les adhérents de l’office de tourisme ?
- Peut-on regrouper la visite de plusieurs gîtes ?
- Combien de temps faut-il pour organiser une visite dans le secteur ?
- Le classement remplace-t-il la déclaration en mairie ou l’enregistrement local ?
- Quelle taxe de séjour s’applique dans [EPCI] ?
- Etoilys intervient-il pour un logement situé hors de la liste de communes ?
- Le classement est-il valable uniquement dans la commune ?

## Règles

- chaque réponse doit être exacte et directement utile ;
- une question locale ne doit pas recevoir une réponse nationale vague ;
- les montants et délais doivent être confirmés ;
- les règles fiscales et administratives doivent être sourcées ;
- les questions doivent refléter une vraie intention, pas seulement répéter le mot-clé principal ;
- ne pas promettre l’affichage d’un résultat enrichi FAQ dans Google ;
- ne pas ajouter manuellement de JSON-LD si le SEO est centralisé ailleurs dans le repo.

---

# Bloc 8 — CTA final

## Statut

Obligatoire.

## Objectif

Transformer la lecture en action sans pression commerciale excessive.

## Contenu attendu

- titre local ;
- rappel de la zone ;
- explication de l’étape suivante ;
- CTA vers `/demande-classement` ;
- éventuellement un lien secondaire vers `/contact` ou `/simulateur`.

## Principes

- mentionner que l’adresse du logement permettra de confirmer les modalités d’intervention ;
- ne pas promettre une date immédiate ;
- ne pas annoncer un tarif non confirmé ;
- garder un ton simple et rassurant.

---

## 5. Métadonnées SEO et intentions de recherche

Chaque recherche préalable doit proposer :

- intention principale ;
- intentions secondaires ;
- requête cible principale ;
- variantes naturelles ;
- meta title ;
- meta description ;
- H1 ;
- slug ;
- éventuels H2 locaux ;
- ancres de liens internes.

## Modèles indicatifs

### Slug

```text
/classement-meuble-tourisme-[ville]
```

Pour un bassin reconnu :

```text
/classement-meuble-tourisme-[bassin]
```

### Meta title

```text
Classement meublé de tourisme à [VILLE] | Etoilys
```

Le title peut être adapté pour inclure le bassin si cela correspond mieux à l’intention réelle.

### Meta description

Elle doit mentionner :

- la visite officielle ;
- la ville ou le bassin ;
- l’action possible ;
- un élément différenciant réel, sans empiler des mots-clés.

## Règles

- une seule intention locale principale par page ;
- ne pas créer une page par variante lexicale ;
- éviter plusieurs pages concurrentes pour la ville, l’agglomération et le bassin si elles couvrent la même intervention ;
- garder une canonical vers la page elle-même ;
- ne pas utiliser de `meta keywords` ;
- ne pas créer une fausse adresse locale ;
- ne pas créer une entité `LocalBusiness` propre à chaque ville sans implantation physique réelle.

---

## 6. Maillage interne attendu

### Liens entrants obligatoires

Une page ville doit recevoir au minimum des liens depuis :

1. `/zones-intervention` ;
2. sa page départementale parente.

### Liens sortants obligatoires

La page ville doit renvoyer vers :

- sa page départementale parente ;
- `/zones-intervention` ;
- `/procedure` ;
- `/les-avantages-du-classement` lorsque pertinent ;
- `/simulateur` ;
- `/demande-classement` ;
- éventuellement `/faq`.

### Liens entre pages villes

Ils ne sont ajoutés que si :

- les secteurs sont géographiquement proches ;
- le lien aide réellement le propriétaire ;
- le libellé ne laisse pas penser que les zones sont identiques ;
- la page cible existe déjà.

### Interdictions

- aucun lien depuis la home dans le cadre actuel ;
- aucune liste exhaustive de villes dans le footer ;
- aucun lien vers une future route non publiée ;
- aucun lien enfant factice ou désactivé.

---

## 7. Framework technique recommandé

Le repo doit disposer d’un composant ou d’une composition partagée pour les pages villes.

Nom indicatif :

```text
LocalServiceAreaPage
```

Le composant partagé doit gérer :

- hero ;
- fil d’Ariane ;
- zone couverte ;
- modules locaux ;
- déroulement ;
- tarifs ;
- preuve facultative ;
- FAQ ;
- CTA ;
- sources ;
- responsive ;
- accessibilité.

La copy propre à chaque ville doit rester dans une source de données ou un fichier de contenu clairement identifié, et non dans une succession de conditions dans le composant.

## Modèle de données indicatif

```ts
interface CityServicePageContent {
  id: string;
  slug: string;
  cityName: string;
  areaLabel: string;
  departmentId: DepartmentAreaId;
  primaryEpci: {
    name: string;
    code?: string;
  };
  secondaryEpcis?: Array<{
    name: string;
    code?: string;
  }>;
  seo: {
    title: string;
    description: string;
    h1: string;
  };
  hero: {
    imageKey: string;
    eyebrow?: string;
    lede: ReactNode;
  };
  coverage: {
    communes: string[];
    nonExhaustiveNotice: string;
    additionalConditions?: ReactNode;
  };
  localModules: LocalContentModule[];
  processVariant?: ReactNode;
  pricing: {
    rangeLabel: string;
    partnerRateNotice?: string;
    urgentRequestNotice?: string;
    groupedVisitsNotice?: string;
    travelConditions?: string;
  };
  localProof?: LocalProofContent;
  faq: FaqItem[];
  sources: LocalSource[];
  localInformationVerifiedAt: string;
}
```

Les types exacts doivent être adaptés au repo. Ce modèle ne doit pas imposer de stocker des `ReactNode` si l’architecture existante privilégie des objets structurés ou des composants de page.

## Modularité obligatoire

Le moteur doit accepter :

- zéro preuve locale ;
- plusieurs types de modules locaux ;
- un ou plusieurs EPCI ;
- des conditions tarifaires différentes ;
- une FAQ de longueur variable dans les limites fixées ;
- une zone avec une seule commune ou un bassin étendu.

Il ne doit pas rendre de titre ou d’espace vide lorsqu’un module facultatif est absent.

---

## 8. Méthode de recherche à suivre pour chaque ville

La session ChatGPT chargée de préparer une page doit travailler dans l’ordre suivant.

### Étape 1 — Définir le périmètre exact

Identifier :

- ville cible ;
- bassin recherché par les utilisateurs ;
- département ;
- EPCI principal ;
- éventuels EPCI secondaires ;
- communes à citer comme zone habituelle ;
- communes qui ne doivent pas être associées aux informations fiscales ou réglementaires du territoire principal.

Sources obligatoires :

- Insee COG ;
- base officielle des EPCI ;
- sites des collectivités concernées.

### Étape 2 — Étudier l’intention SEO

Rechercher :

- requêtes GSC déjà détectées ;
- formulations utilisées dans les résultats de recherche ;
- variantes ville, bassin et département ;
- intention dominante : trouver un organisme, connaître le prix, comprendre la procédure ou vérifier la zone ;
- risque de cannibalisation avec la page départementale ou une autre page locale.

La recherche ne doit pas conduire à créer plusieurs pages pour des formulations synonymes.

### Étape 3 — Rechercher les règles locales

Vérifier :

- déclaration ou enregistrement ;
- changement d’usage ;
- régime résidence principale ;
- éventuelle délibération sur le plafond annuel ;
- taxe de séjour ;
- organisme collecteur ;
- portail local ;
- autres obligations locales réellement utiles.

Chaque résultat doit être consigné avec :

- affirmation ;
- périmètre géographique ;
- source ;
- date de la source ;
- date d’entrée en vigueur ;
- niveau de confiance ;
- wording recommandé ;
- point de vigilance.

### Étape 4 — Rechercher les données touristiques utiles

Chercher uniquement les informations capables d’aider le propriétaire ou de contextualiser le besoin de classement.

Pour chaque statistique :

- vérifier l’année ;
- vérifier le périmètre ;
- vérifier le champ statistique ;
- expliquer ce qu’elle permet réellement de conclure ;
- ne pas extrapoler au marché des meublés si la donnée porte sur un autre type d’hébergement.

### Étape 5 — Recueillir les informations métier Etoilys

La recherche externe ne suffit pas.

ChatGPT doit identifier les informations qui nécessitent une réponse de Florian :

- fourchette tarifaire ;
- tarif partenaire ;
- liste des offices partenaires ;
- urgence ;
- dégressivité ;
- frais de déplacement ;
- organisation des tournées ;
- délai habituel ;
- communes réellement couvertes ;
- expérience locale ;
- preuve locale ;
- éventuel inspecteur référent.

Si ces données ne figurent pas dans le contexte du projet, ChatGPT doit les marquer comme **questions à poser** et ne pas les inventer.

### Étape 6 — Choisir les modules du bloc 3

Sélectionner seulement les modules apportant une vraie valeur.

Le livrable doit expliquer :

- modules retenus ;
- modules écartés ;
- raison de chaque choix ;
- sources disponibles ;
- informations encore manquantes.

### Étape 7 — Rédiger toute la copy exacte

La session ChatGPT doit fournir :

- métadonnées exactes ;
- hero exact ;
- texte de la zone d’intervention ;
- bloc local complet ;
- déroulement ;
- tarifs ;
- bloc de preuve si disponible ;
- FAQ complète ;
- CTA final ;
- libellés de liens internes ;
- sources à afficher ;
- date de vérification.

Il ne faut pas transmettre à Codex un simple plan ou des notes de recherche.

Codex doit recevoir la copy finale prête à intégrer.

---

## 9. Format du livrable de recherche attendu

La session ChatGPT préparant une ville doit produire les sections suivantes.

### A. Verdict de publication

- La page mérite-t-elle d’être créée maintenant ?
- L’intervention est-elle réelle et claire ?
- Le bloc local est-il suffisamment substantiel ?
- Existe-t-il un risque de page satellite ou de cannibalisation ?

### B. Périmètre géographique

Tableau :

| Élément          | Valeur | Source | Date de vérification |
| ---------------- | ------ | ------ | -------------------- |
| Ville cible      |        |        |                      |
| Bassin           |        |        |                      |
| Département      |        |        |                      |
| EPCI principal   |        |        |                      |
| EPCI secondaires |        |        |                      |
| Communes citées  |        |        |                      |

### C. Intention SEO

- requête principale ;
- variantes ;
- title ;
- description ;
- H1 ;
- slug ;
- pages concurrentes internes ;
- stratégie de différenciation.

### D. Informations locales vérifiées

Tableau :

| Sujet | Information vérifiée | Périmètre | Source officielle | Date | Utilisation dans la page |
| ----- | -------------------- | --------- | ----------------- | ---- | ------------------------ |

### E. Questions métier à poser à Florian

Liste courte, consolidée et priorisée.

Ne pas poser une question dont la réponse figure déjà dans le contexte du projet.

### F. Copy finale bloc par bloc

Tous les textes exacts, dans l’ordre du framework.

### G. Sources à afficher

Liste avec :

- nom ;
- organisme ;
- URL ;
- date ;
- affirmation supportée.

### H. Prompt final destiné à Codex

Le prompt doit contenir toute la copy et toutes les instructions techniques nécessaires.

---

## 10. Exigences du prompt final destiné à Codex

Le prompt généré par ChatGPT doit dire à Codex de :

1. lire la documentation du projet et ce framework ;
2. inspecter les composants de pages locales déjà présents ;
3. réutiliser le framework commun plutôt que créer une page indépendante ;
4. intégrer exactement la copy fournie ;
5. ne pas improviser ou réécrire les informations réglementaires, fiscales, locales ou tarifaires ;
6. poser à Florian des questions si une donnée métier nécessaire manque encore ;
7. regrouper les questions en une seule demande claire avant l’implémentation ;
8. ne jamais laisser de placeholder en production ;
9. créer la route React Router ;
10. ajouter le SEO dans la configuration centralisée ;
11. ajouter la canonical ;
12. ajouter la page au sitemap et au prerender ;
13. ajouter les breadcrumbs JSON-LD selon l’architecture existante ;
14. enregistrer la page comme enfant du bon département uniquement après création de la route réelle ;
15. ajouter les liens depuis `/zones-intervention` et la page départementale ;
16. ne rien ajouter sur la page d’accueil ;
17. ne rien ajouter dans le footer ou la navigation principale ;
18. ne pas créer de version EN ou NL ;
19. ne pas créer de faux `LocalBusiness` ou de fausse implantation ;
20. intégrer l’image dans le pipeline existant ;
21. afficher ou référencer les sources locales selon la convention retenue ;
22. ajouter les tests de route, SEO, sitemap, prerender, maillage, accessibilité et responsive ;
23. exécuter les validations habituelles du repo.

## Instruction spécifique sur les questions

Le prompt doit contenir une instruction explicite du type :

> Avant d’implémenter, vérifie que toutes les informations propres à Etoilys sont disponibles, notamment les tarifs, les conditions d’urgence, la dégressivité, les partenariats, les frais de déplacement et les modalités d’intervention. Si une donnée manque ou reste ambiguë, pose à Florian une seule série de questions consolidées et attends sa réponse. N’invente rien et n’intègre aucun placeholder en production.

Codex ne doit pas demander de confirmation sur les éléments déjà fournis et validés dans le prompt.

---

## 11. Sources de référence pour les recherches futures

### Géographie et EPCI

- Insee — Code officiel géographique ;
- Insee — base des EPCI à fiscalité propre ;
- Insee — table d’appartenance géographique des communes ;
- sites officiels des communes et intercommunalités.

### Fiscalité et taxe de séjour

- portail DGFiP des délibérations sur les taxes de séjour ;
- données DELTA ;
- délibérations locales ;
- sites officiels de collecte ;
- Service-Public Entreprendre pour le cadre général.

### Réglementation des meublés

- Légifrance ;
- Service-Public ;
- DGE / entreprises.gouv.fr ;
- ministère chargé du logement ou du tourisme ;
- sites des villes et EPCI ;
- préfectures.

### Statistiques

- Insee ;
- DGE ;
- observatoires régionaux, départementaux ou intercommunaux du tourisme ;
- agences départementales du tourisme ;
- data.gouv.fr en vérifiant le producteur du jeu de données.

### Classement

- Atout France ;
- Cofrac ;
- documents et informations internes Etoilys.

### SEO

- Google Search Central — contenus utiles, fiables et conçus pour les internautes ;
- Google Search Central — règles concernant le spam et les contenus créés à grande échelle ;
- Google Search Central — bonnes pratiques de liens, données structurées et sitemap.

---

## 12. Checklist de validation éditoriale

Avant transmission à Codex :

- [ ] La page cible une zone réellement couverte.
- [ ] Le périmètre ville / bassin / EPCI est clair.
- [ ] Chaque règle locale est correctement scoped.
- [ ] Les communes associées à une information EPCI appartiennent au bon EPCI.
- [ ] La liste de communes est présentée comme non exhaustive.
- [ ] Le bloc 3 contient au moins deux informations locales substantielles.
- [ ] Les chiffres sont datés et leur périmètre est indiqué.
- [ ] Les données d’hébergements collectifs ne sont pas présentées comme des données de meublés.
- [ ] Aucun partenariat n’est inventé.
- [ ] Les tarifs sont confirmés.
- [ ] Les conditions d’urgence et de dégressivité sont confirmées.
- [ ] L’image locale et ses droits sont identifiés.
- [ ] Le bloc de preuve est supprimé s’il n’existe aucune preuve.
- [ ] La FAQ comporte des questions réellement locales.
- [ ] Toute la copy exacte est fournie.
- [ ] Les sources officielles sont listées.
- [ ] Les questions restantes à Florian sont consolidées.

---

## 13. Checklist de validation technique pour Codex

- [ ] La page utilise le composant commun des pages villes.
- [ ] La route publique existe.
- [ ] Le SEO est ajouté dans `src/content/seoRoutes.ts` ou son équivalent actuel.
- [ ] La canonical est correcte.
- [ ] La page est ajoutée au sitemap.
- [ ] La page est ajoutée au prerender.
- [ ] Les breadcrumbs sont cohérents.
- [ ] La page est enregistrée sous le bon département.
- [ ] Aucun lien ne pointe vers une route absente.
- [ ] Le hub et la page départementale affichent l’enfant automatiquement.
- [ ] Aucun changement n’est apporté à la home.
- [ ] Aucun lien ville n’est ajouté au footer ou au header.
- [ ] Aucune version EN ou NL n’est créée.
- [ ] Aucun faux `LocalBusiness` n’est ajouté.
- [ ] Les blocs facultatifs retournent `null` lorsqu’ils sont absents.
- [ ] L’image utilise le pipeline existant.
- [ ] La page est correcte à 390, 768, 1024 et 1440 px.
- [ ] Les liens sont accessibles et crawlables.
- [ ] Les tests SEO, sitemap et prerender passent.
- [ ] `npm run typecheck` passe.
- [ ] `npm run lint` passe.
- [ ] `npm run test:run` passe.
- [ ] `npm run build` passe.
- [ ] `npm run prerender` passe.

---

## 14. Principe final

Le framework commun doit rendre la production plus simple, mais il ne doit jamais rendre la publication automatique.

Une page ville Etoilys n’est publiable que lorsque trois conditions sont réunies :

1. **la zone est réellement couverte** ;
2. **la page apporte une valeur locale vérifiable** ;
3. **les informations commerciales et opérationnelles ont été confirmées par Etoilys**.

Le bon niveau de standardisation est donc :

> structure commune, données structurées, copy locale exacte, modules facultatifs et contrôle humain avant publication.
