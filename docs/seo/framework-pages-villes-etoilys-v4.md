# Framework de déclinaison des pages villes Etoilys

**Version :** 4.0 — 7 septembre 2026  
**Projet :** site public Etoilys  
**Usage :** document autonome destiné à ChatGPT pour auditer, migrer ou créer une page ville selon le modèle CRO commun, préparer uniquement les données locales nécessaires, puis produire un prompt d’intégration à transmettre à Codex.

---

## 1. Finalité du framework

Etoilys publie des pages locales répondant à des recherches telles que :

- `classement meublé de tourisme Bergerac` ;
- `organisme classement meublé Bordeaux` ;
- `faire classer un gîte à Périgueux` ;
- `tarif classement location saisonnière Agen`.

Ces pages sont des **landing pages locales de service**. Leur objectif principal est de convertir un propriétaire en demande de classement, sans supposer qu’il est déjà convaincu de l’intérêt du classement.

Une page ville doit donc servir trois niveaux de maturité :

1. le propriétaire déjà décidé, qui veut vérifier qu’Etoilys intervient chez lui et passer immédiatement à l’action ;
2. le propriétaire intéressé mais hésitant, qui veut comprendre le prix, le délai, la procédure et les bénéfices ;
3. le propriétaire encore peu informé, qui doit comprendre rapidement pourquoi le classement peut présenter un intérêt concret pour son meublé.

Le modèle cible doit réunir, dans cet ordre mental :

- **pourquoi classer** ;
- **Etoilys intervient-il réellement ici** ;
- **combien cela coûte** ;
- **comment cela se passe** ;
- **pourquoi choisir Etoilys** ;
- **quelle preuve locale concrète confirme la valeur du classement** ;
- **réponses aux dernières objections** ;
- **passage à l’action**.

### Source de vérité à partir de la V4

La **structure CRO cible** est définie par le présent framework V4.

La route suivante reste la page ville de référence fonctionnelle et la première page à migrer vers cette V4 :

```text
/classement-meuble-tourisme-bergerac
```

Une fois Bergerac migrée et validée, son implémentation partagée devient la **référence technique** du modèle V4 pour les autres pages villes.

Il ne faut plus considérer l’ordre historique des sections de Bergerac V3 comme une contrainte. Le framework V4 prévaut lorsqu’un ticket demande explicitement la migration d’une page vers le nouveau modèle CRO.

---

## 2. Principe non négociable : séparer modèle commun et delta local

Pour une nouvelle ville, ChatGPT ne doit pas recréer une page complète.

Il doit uniquement rechercher, vérifier et fournir les éléments qui varient réellement selon la localité.

Pour une ville existante à migrer, ChatGPT doit distinguer :

- les **changements communs V4**, définis une seule fois par ce framework ;
- les **données locales déjà présentes**, à conserver si elles restent exactes ;
- les **données locales à corriger ou compléter**, si nécessaire.

Codex doit ensuite brancher ces données sur l’implémentation commune V4, sans dupliquer la copy générique page par page.

### Interdiction explicite

Le livrable produit par ChatGPT pour une localité ne doit pas recopier toute la copy commune.

Le prompt destiné à Codex ne doit pas recréer les blocs communs dans chaque page.

Les formulations communes doivent vivre dans l’implémentation partagée du modèle V4.

Cette règle concerne notamment :

- le bloc générique `Pourquoi classer votre meublé ?` ;
- le déroulement commun du classement ;
- les arguments de marque Etoilys ;
- les CTA communs ;
- les formulations générales sur Etoilys ;
- les composants visuels ;
- les règles de mise en page ;
- les éléments SEO techniques communs ;
- les comportements responsive et accessibles.

Aucune reformulation décorative ne doit être créée pour donner artificiellement l’impression que chaque page est entièrement différente.

---

## 3. Objectif d’industrialisation et migration contrôlée

L’architecture cible doit reposer sur :

- une structure ou un composant partagé pour les pages villes ;
- une source de données typée par localité ;
- des champs variables injectés dans les composants communs ;
- des modules facultatifs absents lorsqu’ils ne sont pas renseignés ;
- une source centrale pour les relations département / pages villes ;
- un SEO, un sitemap, un prerender et des breadcrumbs pilotés par les mêmes données.

Codex doit inspecter l’architecture réelle avant de décider du nom des fichiers ou de la forme exacte de cette factorisation.

### Migration des pages villes existantes

La migration vers la V4 doit pouvoir être faite **page par page**.

Lorsqu’une page cible utilise déjà un composant partagé avec d’autres villes, Codex ne doit pas modifier silencieusement toutes les autres pages si le ticket ne demande d’en migrer qu’une seule.

Si nécessaire, Codex doit introduire un mécanisme transitoire propre et limité, par exemple :

- une variante de layout activée par configuration ;
- un flag de version par page ;
- ou toute autre solution équivalente cohérente avec l’architecture réelle.

Le mécanisme choisi doit :

- permettre de basculer chaque ville vers la V4 indépendamment ;
- éviter la duplication durable du contenu commun ;
- être simple à supprimer une fois toutes les pages migrées ;
- ne pas devenir une deuxième architecture permanente.

### Bergerac comme première migration

La première migration de Bergerac a vocation à établir l’implémentation technique du modèle V4.

Dans ce ticket spécifique, il est normal de modifier sa structure et certaines formulations communes conformément au présent framework.

Après validation de Bergerac V4 :

- les nouvelles pages villes doivent utiliser directement le modèle V4 ;
- les pages villes existantes restantes doivent être migrées une par une ;
- le comportement historique ne doit être conservé que temporairement pour les pages non encore migrées.

---

## 4. Structure CRO cible des pages villes

Sauf exception locale réellement utile, les pages villes V4 doivent suivre l’ordre ci-dessous.

L’objectif n’est pas d’ajouter davantage de contenu que dans la version précédente, mais de **mieux ordonner les informations et supprimer les répétitions**.

### 4.1 Hero transactionnel

Le hero doit permettre de comprendre en quelques secondes :

- qu’Etoilys réalise le classement officiel des meublés de tourisme ;
- que le service est disponible dans la ville ou le bassin concerné ;
- quelle est l’action principale ;
- qu’il existe un chemin secondaire pour le propriétaire qui veut d’abord estimer son logement ;
- les principales modalités de rassurance confirmées pour la zone.

Le modèle commun doit conserver une logique de deux CTA :

- CTA principal vers la demande de classement ;
- CTA secondaire vers le simulateur de classement.

Les micro-preuves placées sous les CTA doivent rester courtes et factuelles. Elles peuvent notamment porter sur :

- la rapidité de la demande ;
- le délai moyen d’intervention ;
- l’absence de frais de déplacement.

Toute modalité variable selon la zone doit être confirmée avant publication.

Ne pas charger le hero avec les détails fiscaux, un tableau tarifaire complet ou une longue explication sur le classement.

### 4.2 Bloc commun `Pourquoi classer votre meublé ?`

Ce bloc doit apparaître **immédiatement après le hero**, avant le détail de la zone d’intervention.

Il sert principalement les visiteurs qui ne sont pas encore totalement convaincus de l’intérêt du classement.

Intro publique à utiliser :

> Le classement ne sert pas seulement à obtenir des étoiles. Pour un propriétaire, il peut avoir des effets très concrets sur la fiscalité, la taxe de séjour et l’attractivité du logement auprès des voyageurs.

Il doit rester court et contenir **exactement trois bénéfices principaux** :

1. **Fiscalité micro-BIC** ;
2. **Taxe de séjour** ;
3. **Gagnez en visibilité auprès des voyageurs**.

#### Angle éditorial des trois bénéfices

**Fiscalité micro-BIC**  
Au régime micro-BIC, un meublé classé bénéficie d’un plafond plus élevé et d’un abattement plus favorable qu’un meublé non classé.

**Taxe de séjour**  
Un meublé classé passe à un tarif fixe selon son nombre d’étoiles. Selon la commune, cela peut réduire sensiblement la taxe de séjour payée par vos voyageurs.

**Gagnez en visibilité auprès des voyageurs**
Les étoiles offrent un repère officiel reconnu, rassurent au moment de réserver et aident votre annonce à se démarquer pour attirer davantage de voyageurs.

En revanche, ne pas garantir un résultat non démontrable du type `le classement vous apportera plus de réservations`, `augmente automatiquement votre taux d’occupation` ou toute promesse chiffrée sans preuve.

#### Ce qui sort de ce bloc

Ne pas inclure les **cotisations sociales** dans les trois bénéfices principaux des pages villes V4. Le sujet est plus technique, moins universel et doit rester traité dans les contenus spécialisés lorsqu’il est pertinent.

Sous les trois bénéfices, prévoir un lien secondaire vers la page générale des avantages du classement. Ne pas ajouter un troisième gros CTA concurrent du hero.

### 4.3 Zone d’intervention

Le bloc de couverture vient après les bénéfices.

Son rôle est de répondre à la question :

> Etoilys intervient-il réellement chez moi ?

Il doit rester concis :

- ville principale ;
- bassin réellement couvert ;
- sélection raisonnable de communes voisines ;
- mention que la liste n’est pas exhaustive lorsque c’est utile ;
- lien vers le département parent.

Éviter les listes interminables de communes. La valeur du bloc vient de la confirmation de couverture, pas du volume de noms de lieux.

### 4.4 Tarifs et modalités

Le bloc tarifaire doit apparaître **avant la procédure**.

Une fois que le visiteur a compris l’intérêt du classement et vérifié qu’Etoilys intervient dans son secteur, la question commerciale la plus naturelle est :

> Combien cela coûte ?

Le bloc doit afficher, lorsque les données sont confirmées :

- tarif standard ;
- qualification TTC ou HT ;
- tarif partenaire éventuel ;
- tarifs dégressifs ;
- frais de déplacement ;
- toute condition importante réellement applicable.

Un CTA direct vers la demande de classement doit être présent après ce bloc.

Ne pas masquer volontairement un tarif fixe connu derrière une demande de devis.

### 4.5 Procédure

La procédure doit rester commercialement simple.

Par défaut, le modèle V4 utilise **trois grandes étapes** :

1. demande de classement ;
2. organisation de la visite ;
3. inspection et classement.

Le détail réglementaire complet reste sur la page `/procedure`.

Le bloc doit rassurer sur la simplicité du parcours, pas reproduire toute la procédure administrative.

### 4.6 Bloc commun `Pourquoi choisir Etoilys ?`

Ce bloc vient après la procédure et doit se concentrer sur les **vrais différenciateurs** d’Etoilys.

Il doit contenir **exactement trois arguments principaux** :

1. **Des outils pour mieux préparer la catégorie visée** ;
2. **100 % spécialisés dans le classement des meublés de tourisme** ;
3. **Organisme accrédité Cofrac Inspection**.

La formulation historique `Des outils pour atteindre plus facilement la catégorie visée` doit être abandonnée. Elle est trop proche d’une promesse de résultat et cadre moins bien avec la posture d’un organisme d’inspection.

Utiliser une formulation centrée sur la **préparation** de la catégorie visée, la compréhension des critères et l’identification des points à compléter.

Ne pas répéter ici :

- `Demande en 30 secondes` ;
- `Intervention rapide` ;

si ces éléments figurent déjà dans le hero.

Le bloc doit se terminer par un CTA principal vers la demande de classement.

### 4.7 Bloc local différenciant — taxe de séjour et preuve locale

Le bloc local principal est déplacé vers le bas de la page, **après `Pourquoi choisir Etoilys ?` et juste avant la FAQ**, sauf contrainte locale particulière.

Son rôle n’est plus de présenter la taxe de séjour comme un bénéfice générique — ce rôle est déjà assuré par le bloc `Pourquoi classer votre meublé ?`.

Il doit devenir une **preuve locale concrète** :

- règle ou barème réellement applicable au territoire ;
- exemple chiffré validé ;
- comparaison classé / non classé ;
- lien vers le simulateur de taxe de séjour ;
- source officielle.

L’angle éditorial recommandé est :

> le bénéfice a été présenté plus haut ; voici maintenant ce qu’il peut donner concrètement dans cette ville.

Éviter de répéter mot pour mot les explications générales du bloc `Pourquoi classer`.

Si la donnée locale n’est pas fiable ou n’apporte pas de valeur réelle, le module doit pouvoir être simplifié ou absent plutôt que rempli artificiellement.

### 4.8 Règle locale exceptionnelle éventuelle

Une règle locale particulière peut être affichée uniquement si elle influence réellement la décision ou les obligations du propriétaire.

Par défaut :

- si elle est critique pour savoir si le propriétaire peut exploiter le logement, elle peut être placée après la zone d’intervention ou au moment où elle devient utile ;
- si elle est informative mais non bloquante, la conserver près du bloc local différenciant ou dans la FAQ ;
- ne pas casser le parcours de conversion avec un gros encadré administratif sans nécessité.

### 4.9 FAQ locale

La FAQ vient après le bloc local différenciant.

Elle doit traiter en priorité les dernières objections :

- prix ;
- délai ;
- zone couverte ;
- critères manquants ;
- plusieurs logements ;
- questions réellement propres à la localité.

Elle ne doit pas répéter intégralement les blocs déjà lus plus haut.

### 4.10 CTA final

La page se termine par un CTA de demande de classement clair et sobre.

Il peut rappeler une ou deux modalités fortes déjà confirmées, mais ne doit pas recréer une nouvelle section de vente complète.

### 4.11 Ce que la V4 ne prévoit pas par défaut

Ne pas ajouter mécaniquement :

- sticky CTA mobile ;
- témoignages ;
- compteurs ;
- nouvelles statistiques locales ;
- calculateur de devis ;
- nouvelles sections SEO ;
- contenu touristique décoratif.

Ces éléments peuvent faire l’objet de tests ou d’un enrichissement ultérieur s’ils reposent sur un besoin démontré et des données réelles.

---

## 5. Éléments variables à rechercher et fournir

ChatGPT doit produire uniquement les champs locaux nécessaires à la page cible, qu’il s’agisse d’une nouvelle ville ou d’une page existante à migrer.

### 5.1 Identité et SEO local

- ville cible ;
- bassin ou agglomération utile ;
- département parent ;
- slug ;
- H1 ;
- meta title ;
- meta description ;
- canonical auto-référente ;
- libellé court utilisé dans les liens et breadcrumbs ;
- date de vérification des données locales.

### 5.2 Hero local

- noms de ville, bassin et département à injecter ;
- éventuel chapô local uniquement s’il diffère réellement du modèle ;
- image locale ;
- alt ;
- source ;
- auteur ;
- licence ;
- crédit obligatoire ;
- contraintes d’utilisation.

Pour une page existante à migrer, conserver par défaut l’image locale, son alt et son crédit lorsqu’ils sont toujours valides. Ne pas relancer une recherche d’image uniquement parce que la structure CRO change.

ChatGPT ne doit pas reproduire le reste du hero commun.

### 5.3 Zone d’intervention

- ville principale ;
- bassin réellement couvert ;
- sélection de communes proches réellement desservies ;
- éventuelles conditions particulières de couverture ;
- lien vers le département parent.

La liste doit rester lisible et non exhaustive.

Ne pas fournir la liste administrative complète d’un EPCI si elle ne correspond pas à la zone commerciale réelle.

### 5.4 Bloc local et taxe de séjour

Fournir uniquement :

- une courte introduction propre à la ville ou au bassin ;
- les informations de contexte utiles à faire confirmer ;
- les sources officielles à vérifier ;
- les questions métier à poser si les données de taxe de séjour ne sont pas déjà validées par Florian.

Le composant, sa structure visuelle et les formulations génériques doivent être récupérés depuis l’implémentation commune V4. Pour une page non encore migrée, ne pas prendre l’ordre historique V3 comme modèle.

Les données de taxe de séjour publiées sont des données métier sensibles. Elles doivent être fournies ou explicitement validées par Florian pendant le plan d’implémentation, comme les tarifs Etoilys. ChatGPT peut préparer les sources et le raisonnement, mais Codex ne doit pas publier un barème, un calcul ou un exemple comparatif sans validation métier explicite.

Dans la V4, ce module est placé vers le bas de la landing page, juste avant la FAQ. Il doit être traité comme une **preuve locale concrète** du bénéfice taxe de séjour déjà évoqué plus haut, et non comme une deuxième explication générique du même avantage.

### 5.5 FAQ

La FAQ fait partie des contenus variables.

ChatGPT doit distinguer les questions communes et les questions réellement locales.

Par défaut, les questions communes doivent reprendre le modèle FAQ partagé V4. Il ne faut pas réécrire artificiellement une FAQ commune sous prétexte de changer de ville.

La FAQ peut contenir :

- des questions réellement locales ;
- des questions commerciales communes dont la réponse injecte les données de la ville ;
- des précisions sur la zone couverte ;
- les prix applicables ;
- les délais applicables ;
- les visites groupées ;
- les modalités locales utiles.

Il n’est pas nécessaire de rendre chaque question totalement originale. Il faut éviter aussi bien la duplication mécanique que l’invention de questions artificielles.

Interdiction : la FAQ publique ne doit jamais mentionner la ville de référence ou la logique d’industrialisation. Ne pas écrire par exemple « les tarifs de Bergerac s’appliquent aussi », « comme Bergerac », « modèle Bergerac » ou toute formulation équivalente.

### 5.6 Tarifs et modalités Etoilys

Les tarifs sont des données métier variables qui doivent être confirmées pour chaque zone.

Dans la V4, le bloc tarifaire est placé **avant la procédure**. Le prix est une information décisionnelle majeure : lorsqu’un tarif fixe est connu et validé, il doit être affiché clairement plutôt que masqué derrière une demande de devis.

Toujours demander confirmation à Florian pendant le plan d’implémentation :

- tarif standard ;
- qualification TTC ou HT ;
- tarif partenaire ;
- conditions du tarif partenaire ;
- tarifs dégressifs ;
- conditions des visites groupées ;
- éventuels frais de déplacement ;
- délai moyen d’intervention ;
- délai maximal annoncé ;
- toute autre modalité réellement affichée dans le modèle de page.

Ne pas considérer les tarifs de Bergerac comme des tarifs par défaut.

Même si la nouvelle ville semble appartenir à la même zone commerciale, Codex doit demander confirmation. Si Florian répond que les tarifs sont exactement les mêmes que Bergerac, Codex peut alors réutiliser la configuration tarifaire commune, sans jamais le dire dans la page publique.

Ne pas rechercher les tarifs Etoilys sur le web.

Ne rien déduire d’une autre page locale.

Ne pas inclure de tarif urgent par défaut. Une modalité absente volontairement du modèle V4 ne doit pas être réintroduite sans instruction explicite.

### 5.7 Preuve locale facultative

Uniquement si elle existe réellement :

- témoignage local ;
- partenariat confirmé ;
- cas client ;
- photo d’intervention ;
- inspecteur affecté ;
- nombre de visites vérifiable.

En l’absence de preuve réelle, ne rien fournir et ne rien afficher.

---

## 6. Éléments communs V4 à ne pas réécrire localement

ChatGPT ne doit pas refaire de recherche ou de rédaction locale sur :

- le fonctionnement général du classement ;
- le bloc commun `Pourquoi classer votre meublé ?` et ses trois bénéfices ;
- les étapes communes de la procédure en trois temps ;
- le bloc commun `Pourquoi choisir Etoilys ?` et ses trois différenciateurs ;
- l’accréditation Etoilys ;
- les outils Etoilys ;
- les CTA communs ;
- les arguments génériques de confiance ;
- le contenu générique du bloc tarifaire ;
- les formulations communes du hero ;
- les textes génériques de transition ;
- les règles nationales déjà traitées ailleurs sur le site.

Ces éléments doivent rester centralisés dans l’implémentation commune V4. Le présent framework fixe leur rôle, leur ordre et leurs garde-fous ; la copy commune elle-même ne doit pas être dupliquée dans chaque configuration locale.

Si ChatGPT détecte qu’un élément commun paraît obsolète ou problématique, il doit le signaler séparément sans le réécrire dans le livrable de la nouvelle ville.

---

## 7. Recherche locale à effectuer

La recherche doit servir uniquement à sécuriser les données variables.

### 7.1 Géographie

Rechercher :

- rattachement communal ;
- département ;
- bassin naturel ou commercial ;
- EPCI utile au contrôle ;
- communes voisines ;
- cohérence avec la zone réelle d’intervention Etoilys.

Sources prioritaires :

- Insee ;
- Code officiel géographique ;
- base officielle des EPCI ;
- sites officiels des communes et intercommunalités.

### 7.2 Identité touristique locale

Rechercher uniquement les éléments permettant de rédiger une courte introduction utile :

- attractivité touristique ;
- identité du bassin ;
- typologie d’hébergements ;
- particularité locale directement liée aux meublés de tourisme.

Sources prioritaires :

- office de tourisme ;
- agence départementale ou régionale ;
- observatoire touristique ;
- Insee ;
- DGE ;
- collectivités publiques.

Ne pas produire une brochure touristique.

### 7.3 Taxe de séjour

Rechercher pour préparer la validation métier :

- territoire collecteur ;
- année applicable ;
- taux des hébergements non classés ;
- plafond éventuel ;
- tarif total d’un meublé classé 2 étoiles ;
- taxes additionnelles ;
- source officielle.

Sources prioritaires :

- portail officiel de taxe de séjour de la collectivité ;
- délibération officielle ;
- données DELTA ;
- portail DGFiP ;
- office ou organisme public chargé de la collecte.

ChatGPT doit fournir les sources et signaler les points à confirmer. Codex doit ensuite demander à Florian les données finales à utiliser dans la page si elles ne sont pas déjà explicitement validées dans le prompt d’intégration.

### 7.4 Règles locales exceptionnelles

Ne rechercher une règle locale que si elle est susceptible d’apporter une vraie valeur à la page :

- enregistrement ;
- changement d’usage ;
- plafond local de location ;
- règle municipale particulièrement recherchée.

La découverte d’une règle locale ne signifie pas qu’elle doit être publiée.

Par défaut, ne pas transformer la page en guide réglementaire.

Les garde-fous administratifs et juridiques sont des consignes internes, pas de la copy publique. Une landing page ville doit rester une page commerciale claire, pas une fiche CERFA. Ne pas rendre publiquement des phrases défensives du type :

- « ces règles concernent spécifiquement la commune et ne doivent pas être généralisées » ;
- « vérifier la portée géographique de cette règle » ;
- « les règles présentées ne s’appliquent pas automatiquement aux communes voisines » ;
- toute autre formulation administrative destinée à protéger le raisonnement interne.

Si une règle locale est publiée, elle doit être courte, utile au propriétaire, orientée décision et formulée naturellement. Si elle ne peut pas être formulée simplement sans alourdir la page, la garder en note interne et renvoyer vers la source officielle.

---

## 8. Calcul standard de taxe de séjour

Sauf raison locale particulière, utiliser le même scénario que Bergerac afin de rendre les pages comparables :

- 150 € la nuit ;
- 4 adultes assujettis ;
- meublé non classé ;
- meublé classé 2 étoiles ;
- résultat pour une nuit ;
- projection sur sept nuits.

ChatGPT doit préparer les vérifications suivantes, mais Codex ne doit publier le calcul qu’après validation par Florian :

1. le calcul du non-classé ;
2. le tarif total du classé 2 étoiles ;
3. les taxes additionnelles ;
4. les plafonds éventuels ;
5. les montants pour quatre adultes ;
6. la différence en euros ;
7. la réduction en pourcentage ;
8. la projection sur sept nuits.

Le livrable doit fournir les sources, les hypothèses et les points à confirmer. Les données finales de taxe de séjour utilisées dans la page doivent être explicitement fournies ou validées par Florian pendant le plan d’implémentation.

Si la comparaison n’est pas fiable ou pertinente, le signaler et ne pas inventer d’exemple.

---

## 9. Vérification préalable de l’opportunité de publier

Cette section s’applique principalement à la création d’une **nouvelle** page ville. Pour la migration d’une page existante, vérifier surtout que les données locales actuellement publiées restent exactes et qu’aucun changement de structure ne rend une information trompeuse.

Avant de préparer le prompt Codex pour une nouvelle ville, ChatGPT doit vérifier :

- qu’Etoilys intervient réellement dans le secteur ;
- que le département parent existe sur le site ;
- que la ville apporte une intention locale distincte ;
- que les données locales sont suffisamment fiables ;
- que la page ne sera pas une simple substitution de nom sans valeur propre ;
- que le bloc local différenciant apporte une preuve ou une information réellement propre au territoire ;
- que la zone couverte et les tarifs pourront être confirmés ;
- qu’une image locale exploitable peut être identifiée ou qu’un brief utilisable peut être fourni.

Ne pas recommander la publication si la page n’apporte aucun delta local utile par rapport à la page départementale.

---

## 10. Gestion des informations métier manquantes

ChatGPT doit utiliser toutes les informations déjà disponibles dans le contexte avant de poser une question.

Si une donnée essentielle manque, il doit poser une seule série de questions consolidées.

Questions possibles :

- Quel tarif standard doit être affiché dans cette zone ?
- Les montants sont-ils TTC ou HT ?
- Un tarif partenaire est-il applicable ?
- Quelles sont les conditions des tarifs dégressifs ?
- Des frais de déplacement s’appliquent-ils ?
- Quels délais d’intervention peut-on annoncer ?
- Quelles communes Etoilys couvre-t-il réellement ?
- Existe-t-il une preuve locale exploitable ?

Ne pas poser de question sur le contenu commun, puisque celui-ci doit être récupéré depuis l’implémentation V4 partagée.

Ne pas produire un prompt d’intégration final tant qu’un prix ou une donnée métier bloquante resterait remplacé par un placeholder.

---

## 11. Format obligatoire du livrable ChatGPT

L’exécution de ce framework doit d’abord indiquer le **mode de travail** :

- `MIGRATION V4 D’UNE PAGE EXISTANTE` ; ou
- `CRÉATION D’UNE NOUVELLE PAGE`.

Pour une migration, ne pas relancer inutilement toute la recherche locale si les données déjà publiées sont récentes, sourcées et toujours valides. Vérifier seulement les éléments nécessaires à la migration et les données sensibles susceptibles d’avoir changé.

L’exécution doit ensuite produire les sections suivantes.

### A. Verdict de publication

- intérêt de la page ;
- intervention réelle ;
- distinction avec la page départementale ;
- risque de cannibalisation ;
- éventuel risque de page satellite.

Cette partie reste interne.

### B. Dossier de recherche locale

Tableau recommandé :

| Champ                       | Valeur | Source | Date | Usage          |
| --------------------------- | ------ | ------ | ---- | -------------- |
| Ville                       |        |        |      | Public         |
| Bassin                      |        |        |      | Public         |
| Département                 |        |        |      | Public         |
| EPCI                        |        |        |      | Interne        |
| Communes couvertes          |        |        |      | Public         |
| Introduction locale         |        |        |      | Public         |
| Collectivité taxe de séjour |        |        |      | Interne/public |
| Tarifs taxe de séjour       |        |        |      | Interne/public |
| Tarifs Etoilys              |        |        |      | Public         |
| Délais Etoilys              |        |        |      | Public         |
| Image                       |        |        |      | Public         |

Distinguer clairement les informations publiques des données conservées uniquement pour vérification.

### C. Données SEO locales

Fournir uniquement :

- slug ;
- H1 ;
- meta title ;
- meta description ;
- canonical ;
- libellé de breadcrumb ;
- département parent ;
- libellé de page locale dans le hub ;
- libellé du lien contextuel depuis la page départementale ;
- libellé du lien retour depuis la page ville vers le département parent.

Les libellés de maillage doivent rester cohérents avec les patterns existants. Si le hub affiche une page comme « Bergerac et le Bergeracois », une nouvelle ville doit utiliser un libellé de zone comparable, pas une ancre SEO longue artificielle.

### D. Paquet de contenu variable

Fournir uniquement les champs qui doivent différer du modèle commun V4 :

- données du hero local ;
- zone d’intervention ;
- introduction du bloc local ;
- contexte du module taxe de séjour et données à faire confirmer par Florian ;
- tarifs et modalités Etoilys confirmés ;
- FAQ ;
- preuve locale éventuelle ;
- données du CTA uniquement si une adaptation locale est réellement nécessaire.

Ne jamais fournir la page complète.

Ne jamais reproduire les blocs communs.

Séparer explicitement les champs publics des consignes internes. Les garde-fous de conformité, limites de portée géographique et réserves administratives ne doivent pas être injectés tels quels dans la page publique.

### E. Calcul de taxe de séjour

- hypothèses ;
- source ;
- calcul non classé préparé pour vérification ;
- calcul classé 2 étoiles préparé pour vérification ;
- résultat par nuit préparé pour vérification ;
- résultat sur sept nuits préparé pour vérification ;
- différence préparée pour vérification ;
- pourcentage préparé pour vérification ;
- données à confirmer par Florian avant injection dans le composant partagé.

### F. Image locale

- sujet ;
- lieu ;
- source ;
- auteur ;
- licence ;
- crédit ;
- alt ;
- contraintes ;
- solution alternative.

### G. Questions métier restantes

Uniquement si nécessaire, en une série consolidée.

### H. Prompt final destiné à Codex

Le prompt doit contenir :

- les données variables exactes ;
- les métadonnées locales ;
- les sources de vérification ;
- le brief image ;
- le maillage attendu ;
- les instructions d’industrialisation ;
- les validations techniques.

Il ne doit contenir aucun bloc de copy commune.

---

## 12. Exigences obligatoires du prompt destiné à Codex

Le prompt doit demander à Codex de suivre cet ordre.

### 12.1 Inspecter le framework V4 et l’implémentation réelle

Codex doit d’abord :

1. lire le présent framework V4 et la documentation du projet ;
2. inspecter la route cible ;
3. inspecter `/classement-meuble-tourisme-bergerac` pour comprendre l’implémentation actuelle et, si Bergerac a déjà été migrée, le modèle V4 en production ;
4. identifier les composants, contenus et comportements communs ;
5. inspecter la source centrale des départements et pages locales ;
6. vérifier la configuration SEO, le sitemap, le prerender et les breadcrumbs existants ;
7. déterminer si le ticket concerne une **migration V4 d’une page existante** ou la **création d’une nouvelle page déjà basée sur V4**.

### 12.2 Industrialiser le modèle commun V4

Codex doit faire du framework V4 la référence fonctionnelle du modèle commun.

Si Bergerac est la première page migrée, Codex doit :

- adapter l’implémentation partagée afin de pouvoir rendre le modèle V4 ;
- modifier Bergerac conformément à l’ordre et aux règles de la section 4 ;
- centraliser la copy et les comportements communs ;
- éviter toute duplication du contenu commun ;
- rendre les seuls champs locaux configurables ;
- préserver les autres pages villes non encore migrées si le ticket ne les concerne pas.

Si le composant partagé actuel rend impossible une migration page par page sans effet de bord, Codex doit utiliser un mécanisme transitoire limité permettant d’activer V4 localité par localité.

Si Bergerac a déjà été migrée, Codex doit réutiliser le modèle V4 existant plutôt que recréer une nouvelle structure.

Ne pas créer un CMS ou une abstraction disproportionnée.

Le prompt ne doit pas dicter les noms de fichiers si l’architecture réelle suggère une solution différente.

### 12.3 Migrer ou créer la déclinaison cible

Pour une **nouvelle ville**, Codex doit :

- ajouter uniquement les données variables fournies ;
- enregistrer la ville sous le bon département ;
- créer la route réelle ;
- brancher la page au modèle partagé V4 ;
- ne pas réécrire les blocs communs.

Pour une **ville existante à migrer**, Codex doit :

- conserver ses données locales encore valides ;
- appliquer l’ordre des sections V4 ;
- basculer la page vers le modèle commun V4 ;
- ne pas modifier les autres pages villes non demandées ;
- signaler toute donnée locale devenue incohérente avec le nouveau modèle avant de l’inventer ou de la remplacer.

### 12.4 Vérifier les informations métier

Pendant le plan d’implémentation, Codex doit demander confirmation à Florian pour :

- tarifs ;
- TTC ou HT ;
- tarif partenaire ;
- dégressivité ;
- frais ;
- délais ;
- zone couverte ;
- données de taxe de séjour à afficher ;
- exemple de taxe de séjour à publier ;
- preuve locale éventuelle.

Les tarifs et la taxe de séjour doivent toujours être confirmés pour une nouvelle ville. Si les autres informations essentielles manquent, Codex doit poser à Florian une seule série de questions consolidées avant d’intégrer le champ concerné.

Il ne doit :

- rien inventer ;
- reprendre aucun montant de Bergerac par défaut ;
- corriger ou recalculer silencieusement une donnée de taxe de séjour sans validation ;
- laisser aucun placeholder en production ;
- ajouter aucune modalité absente volontairement du modèle.

### 12.5 SEO et maillage

Codex doit :

- ajouter les métadonnées à la source SEO centralisée ;
- utiliser une canonical auto-référente ;
- ajouter la route au sitemap ;
- ajouter la route au prerender ;
- créer les breadcrumbs selon la hiérarchie :

```text
Accueil > Zones d’intervention > Département > Ville
```

- ajouter le lien depuis `/zones-intervention` ;
- ajouter le lien depuis la page départementale parente ;
- ajouter depuis la page ville un lien naturel vers le département parent ;
- respecter le style de libellé déjà utilisé dans le hub et les pages départementales ;
- reproduire le lien contextuel dans la carte de secteur si la page départementale possède déjà ce pattern ;
- ne pas ajouter la page dans la home, le header ou le footer ;
- ne pas créer de version EN ou NL ;
- ne pas générer de route locale fictive ;
- ne pas créer de faux `LocalBusiness` ;
- ne pas inventer d’adresse ou d’agence locale.

### 12.6 Image

Codex doit :

- vérifier les droits ;
- intégrer l’image au pipeline existant ;
- utiliser l’alt fourni ;
- afficher le crédit lorsque la licence l’exige ;
- ne jamais hotlinker une image externe ;
- ne pas intégrer une image dont la licence est incertaine.

### 12.7 Tests

Les tests doivent vérifier des contrats structurels :

- route existante ;
- relation département / ville ;
- données locales injectées ;
- canonical ;
- sitemap ;
- prerender ;
- breadcrumbs ;
- maillage ;
- absence de version EN/NL ;
- absence de faux `LocalBusiness` ;
- absence de modification du header, du footer et de la home ;
- pour une migration page par page : absence de modification visible des autres pages villes non ciblées ;
- modules facultatifs absents lorsqu’ils ne sont pas renseignés.

Ne pas créer de tests vérifiant mot pour mot la copy commune ou la présence exacte de phrases marketing.

Une reformulation éditoriale mineure ne doit pas casser les tests.

---

## 13. Structure recommandée du prompt Codex généré

Le prompt produit par ChatGPT doit suivre cette structure, sans inclure le contenu fixe.

```text
MODE
[MIGRATION V4 D’UNE PAGE EXISTANTE / CRÉATION D’UNE NOUVELLE PAGE]

OBJECTIF
Migrer ou créer la page ville [VILLE] selon le Framework pages villes Etoilys V4 et l’implémentation partagée V4 existante.

RÈGLE ABSOLUE
Ne recopie pas le contenu fixe dans cette page. Réutilise le modèle partagé V4. Si [VILLE] est la première migration V4, fais évoluer l’implémentation commune de manière contrôlée sans modifier visuellement les autres pages villes non encore migrées.

DONNÉES LOCALES À INJECTER
[uniquement les données variables]

CHAMPS PUBLICS VS CONSIGNES INTERNES
[séparer clairement les textes rendus publiquement des garde-fous internes qui ne doivent pas apparaître sur la landing page]

SEO ET MAILLAGE
[uniquement les données propres à la nouvelle route]

IMAGE
[brief, source et licence]

DONNÉES INTERNES DE VÉRIFICATION
[sources et calculs, non visibles sur la page]

INFORMATIONS MÉTIER À CONFIRMER
[uniquement les éventuels éléments manquants]

TAXE DE SÉJOUR À CONFIRMER
[sources, hypothèses et données à faire valider par Florian avant publication]

INSTRUCTIONS TECHNIQUES
[routes, SEO centralisé, sitemap, prerender, breadcrumbs, maillage, absence EN/NL]

VALIDATIONS
[tests et commandes]
```

Le prompt ne doit pas contenir :

- la copy complète d’une autre page ville ;
- le texte des blocs communs déjà centralisés ;
- des exemples de formulations génériques à recopier ;
- des garde-fous internes présentés comme copy publique ;
- des placeholders silencieux ;
- une nouvelle architecture imposée sans inspection du repo.

---

## 14. Contrôles éditoriaux avant livraison

### Valeur locale

- Les données propres à la ville sont-elles réelles et vérifiées ?
- L’introduction locale apporte-t-elle quelque chose ?
- La liste de communes correspond-elle à la couverture réelle ?
- L’exemple de taxe a-t-il été validé par Florian ?
- La FAQ traite-t-elle des questions utiles à cette localité ?
- La page reste-t-elle une landing page claire et commerciale, sans paragraphe administratif défensif ?

### Cohérence avec le modèle V4

- Aucun contenu commun n’a-t-il été réécrit inutilement ?
- L’ordre des sections respecte-t-il la structure CRO V4 ?
- Les nouveaux champs sont-ils réellement variables ?
- Le rendu attendu reste-t-il cohérent avec les pages villes déjà migrées ?
- Le bloc `Pourquoi classer votre meublé ?` contient-il bien uniquement les trois bénéfices prévus ?
- Le bloc `Pourquoi choisir Etoilys ?` contient-il bien uniquement les trois différenciateurs prévus ?
- Le tarif apparaît-il avant la procédure ?
- Le bloc taxe de séjour local apparaît-il vers le bas, comme preuve locale, sans répéter le bloc bénéfices ?
- Les questions communes de FAQ sont-elles reprises depuis le modèle commun sauf vrai besoin local ?
- La page cible ne contient-elle aucune mention visible de la ville de référence ou de la logique d’industrialisation ?

### SEO

- L’intention locale est-elle distincte de celle du département ?
- Le H1 et les métadonnées sont-ils propres à la ville ?
- Le maillage suit-il la hiérarchie hub > département > ville ?
- Les libellés de maillage sont-ils cohérents avec ceux des pages locales déjà publiées ?
- La page apporte-t-elle davantage qu’un simple remplacement de nom ?

### Métier

- Les tarifs sont-ils explicitement confirmés ?
- Les données de taxe de séjour sont-elles explicitement confirmées ?
- Les conditions sont-elles confirmées ?
- Les délais sont-ils confirmés ?
- Aucun montant de Bergerac n’a-t-il été repris par défaut ?
- Aucune modalité non demandée n’a-t-elle été ajoutée ?

---

## 15. Contrôles techniques demandés à Codex

Adapter les commandes aux scripts réels du repo. À défaut :

```bash
npm run typecheck
npm run lint
npm run test:run
npm run seo:sitemap
npm run build
npm run prerender
```

Vérifier notamment :

- rendu de la page cible conforme à V4 ;
- autres pages villes non ciblées inchangées pendant une migration progressive ;
- H1 unique ;
- canonical ;
- métadonnées ;
- sitemap ;
- prerender ;
- breadcrumbs ;
- maillage ;
- absence de duplication technique inutile ;
- absence de route inexistante ;
- absence de version EN/NL ;
- absence de faux `LocalBusiness` ;
- absence de modification de la home, du header et du footer ;
- modules facultatifs absents lorsqu’ils sont vides ;
- absence de phrases de consignes internes rendues publiquement ;
- absence de mention visible de la ville de référence sur la page cible ;
- FAQ commune réutilisée sauf vrai besoin local ;
- tarifs et taxe de séjour confirmés par Florian ;
- absence de débordement horizontal ;
- accessibilité des liens, CTA, tableaux et FAQ ;
- rendu à 390, 768, 1024 et 1440 px ;
- image optimisée et correctement créditée ;
- calcul de taxe correctement affiché.

---

## 16. Résultat attendu

Pour chaque ville, ChatGPT doit produire un delta local fiable et, lorsqu’il s’agit d’une page existante, identifier uniquement les adaptations nécessaires pour la basculer vers V4.

Codex doit transformer ce delta en une déclinaison du **modèle CRO V4**, sans recopier le contenu commun et sans déclencher de migration involontaire des autres villes.

Le système final doit permettre :

- de servir rapidement les visiteurs déjà décidés ;
- de convaincre aussi les propriétaires qui hésitent encore sur l’intérêt du classement ;
- d’afficher tôt les informations commerciales décisives, notamment la couverture et le prix ;
- de conserver les preuves locales concrètes sans transformer la page en contenu touristique ou réglementaire long ;
- d’ajouter une ville principalement par configuration ;
- de modifier une formulation commune une seule fois ;
- de conserver une cohérence parfaite entre les pages ;
- d’éviter les divergences de composants et de copy ;
- de maintenir séparément les données propres à chaque localité ;
- de faire évoluer le modèle commun sans reprendre manuellement toutes les pages.

La valeur SEO de chaque page doit venir de ses données locales réelles, de son exemple de taxe de séjour, de sa zone d’intervention, de ses tarifs confirmés, de son image et de sa FAQ — pas d’une réécriture artificielle des blocs communs.

La valeur CRO commune doit venir de la structure V4 :

```text
Hero
→ Pourquoi classer ?
→ Zone d’intervention
→ Tarifs
→ Procédure
→ Pourquoi Etoilys ?
→ Preuve locale / taxe de séjour
→ FAQ
→ CTA final
```
