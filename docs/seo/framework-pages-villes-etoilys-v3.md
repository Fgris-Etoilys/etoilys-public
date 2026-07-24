# Framework de déclinaison des pages villes Etoilys

**Version :** 3.0 — 23 juillet 2026  
**Projet :** site public Etoilys  
**Usage :** document autonome destiné à ChatGPT pour préparer les seules données propres à une nouvelle page ville, puis produire un prompt d’intégration à transmettre à Codex.

---

## 1. Finalité du framework

Etoilys publie des pages locales répondant à des recherches telles que :

- `classement meublé de tourisme Bergerac` ;
- `organisme classement meublé Bordeaux` ;
- `faire classer un gîte à Périgueux` ;
- `tarif classement location saisonnière Agen`.

Ces pages sont des landing pages locales de service. Elles doivent permettre à un propriétaire de vérifier rapidement qu’Etoilys intervient dans son secteur, de comprendre les modalités locales utiles et de déposer une demande de classement.

La page suivante constitue l’implémentation de référence :

```text
/classement-meuble-tourisme-bergerac
```

Sa structure, ses composants, ses blocs génériques, ses formulations de marque, ses CTA, son déroulement et ses éléments communs constituent la source de vérité des pages villes.

---

## 2. Principe non négociable : produire uniquement le delta local

Pour une nouvelle ville, ChatGPT ne doit pas recréer une page complète.

Il doit uniquement rechercher, vérifier et fournir les éléments qui diffèrent de Bergerac.

Codex doit ensuite injecter ces données dans la structure commune industrialisée à partir de l’implémentation de Bergerac.

### Interdiction explicite

Le présent framework ne doit pas contenir la copy commune de la page Bergerac.

Le livrable produit par ChatGPT ne doit pas contenir la copy commune.

Le prompt destiné à Codex ne doit pas recopier la copy commune.

Il faut toujours demander à Codex de la récupérer depuis l’implémentation de référence existante dans le repo.

Cette règle concerne notamment :

- les blocs génériques ;
- le déroulement du classement ;
- les arguments de marque ;
- les CTA communs ;
- les formulations générales sur Etoilys ;
- les composants visuels ;
- les règles de mise en page ;
- les éléments SEO techniques communs ;
- les comportements responsive et accessibles.

Aucune reformulation décorative ne doit être créée pour donner artificiellement l’impression que chaque page est entièrement différente.

---

## 3. Objectif d’industrialisation

La page Bergerac ne doit pas être copiée dans un nouveau fichier autonome avec quelques remplacements de mots.

L’architecture cible doit reposer sur :

- une structure ou un composant partagé pour les pages villes ;
- une source de données typée par localité ;
- des champs variables injectés dans les composants communs ;
- des modules facultatifs absents lorsqu’ils ne sont pas renseignés ;
- une source centrale pour les relations département / pages villes ;
- un SEO, un sitemap, un prerender et des breadcrumbs pilotés par les mêmes données.

Codex doit inspecter l’architecture réelle avant de décider du nom des fichiers ou de la forme exacte de cette factorisation.

### Préservation de Bergerac

L’industrialisation ne doit pas modifier le rendu, la copy ou le comportement de la page Bergerac, sauf correction technique indispensable et explicitement signalée.

Bergerac sert à extraire le modèle commun. Elle ne doit pas être réécrite pendant la création d’une nouvelle ville.

---

## 4. Éléments variables à rechercher et fournir

ChatGPT doit produire uniquement les champs locaux nécessaires à la nouvelle page.

### 4.1 Identité et SEO local

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

### 4.2 Hero local

- noms de ville, bassin et département à injecter ;
- éventuel chapô local uniquement s’il diffère réellement du modèle ;
- image locale ;
- alt ;
- source ;
- auteur ;
- licence ;
- crédit obligatoire ;
- contraintes d’utilisation.

ChatGPT ne doit pas reproduire le reste du hero commun.

### 4.3 Zone d’intervention

- ville principale ;
- bassin réellement couvert ;
- sélection de communes proches réellement desservies ;
- éventuelles conditions particulières de couverture ;
- lien vers le département parent.

La liste doit rester lisible et non exhaustive.

Ne pas fournir la liste administrative complète d’un EPCI si elle ne correspond pas à la zone commerciale réelle.

### 4.4 Bloc local et taxe de séjour

Fournir uniquement :

- une courte introduction propre à la ville ou au bassin ;
- les informations de contexte utiles à faire confirmer ;
- les sources officielles à vérifier ;
- les questions métier à poser si les données de taxe de séjour ne sont pas déjà validées par Florian.

Le composant, sa structure visuelle et les formulations génériques doivent être récupérés depuis Bergerac.

Les données de taxe de séjour publiées sont des données métier sensibles. Elles doivent être fournies ou explicitement validées par Florian pendant le plan d’implémentation, comme les tarifs Etoilys. ChatGPT peut préparer les sources et le raisonnement, mais Codex ne doit pas publier un barème, un calcul ou un exemple comparatif sans validation métier explicite.

### 4.5 FAQ

La FAQ fait partie des contenus variables.

ChatGPT doit distinguer les questions communes et les questions réellement locales.

Par défaut, les questions communes doivent reprendre le modèle Bergerac. Il ne faut pas réécrire artificiellement une FAQ commune sous prétexte de changer de ville.

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

### 4.6 Tarifs et modalités Etoilys

Les tarifs sont des données métier variables qui doivent être confirmées pour chaque zone.

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

Ne pas inclure de tarif urgent par défaut. Une modalité absente volontairement du modèle Bergerac ne doit pas être réintroduite sans instruction explicite.

### 4.7 Preuve locale facultative

Uniquement si elle existe réellement :

- témoignage local ;
- partenariat confirmé ;
- cas client ;
- photo d’intervention ;
- inspecteur affecté ;
- nombre de visites vérifiable.

En l’absence de preuve réelle, ne rien fournir et ne rien afficher.

---

## 5. Éléments communs à ne pas rechercher ni rédiger

ChatGPT ne doit pas refaire de recherche ou de rédaction sur :

- le fonctionnement général du classement ;
- les étapes nationales de la procédure ;
- l’accréditation Etoilys ;
- les bénéfices généraux du classement ;
- les outils Etoilys ;
- les CTA communs ;
- les arguments génériques de confiance ;
- le contenu générique du bloc tarifaire ;
- les formulations communes du hero ;
- les textes génériques de transition ;
- les règles nationales déjà traitées ailleurs sur le site.

Ces éléments doivent rester centralisés dans l’implémentation commune extraite de Bergerac.

Si ChatGPT détecte qu’un élément commun paraît obsolète ou problématique, il doit le signaler séparément sans le réécrire dans le livrable de la nouvelle ville.

---

## 6. Recherche locale à effectuer

La recherche doit servir uniquement à sécuriser les données variables.

### 6.1 Géographie

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

### 6.2 Identité touristique locale

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

### 6.3 Taxe de séjour

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

### 6.4 Règles locales exceptionnelles

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

## 7. Calcul standard de taxe de séjour

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

## 8. Vérification préalable de l’opportunité de publier

Avant de préparer le prompt Codex, ChatGPT doit vérifier :

- qu’Etoilys intervient réellement dans le secteur ;
- que le département parent existe sur le site ;
- que la ville apporte une intention locale distincte ;
- que les données locales sont suffisamment fiables ;
- que la page ne sera pas une simple substitution de nom sans valeur propre ;
- que la zone couverte et les tarifs pourront être confirmés ;
- qu’une image locale exploitable peut être identifiée ou qu’un brief utilisable peut être fourni.

Ne pas recommander la publication si la page n’apporte aucun delta local utile par rapport à la page départementale.

---

## 9. Gestion des informations métier manquantes

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

Ne pas poser de question sur le contenu commun, puisque celui-ci doit être récupéré depuis Bergerac.

Ne pas produire un prompt d’intégration final tant qu’un prix ou une donnée métier bloquante resterait remplacé par un placeholder.

---

## 10. Format obligatoire du livrable ChatGPT

L’exécution de ce framework doit produire les sections suivantes.

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

Fournir uniquement les champs qui doivent différer de Bergerac :

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

## 11. Exigences obligatoires du prompt destiné à Codex

Le prompt doit demander à Codex de suivre cet ordre.

### 11.1 Inspecter la source de vérité

Codex doit d’abord :

1. lire la documentation du projet ;
2. inspecter la route `/classement-meuble-tourisme-bergerac` ;
3. identifier les composants, contenus et comportements communs ;
4. inspecter la source centrale des départements et pages locales ;
5. vérifier la configuration SEO, le sitemap, le prerender et les breadcrumbs existants.

### 11.2 Industrialiser le contenu fixe

Si l’implémentation commune n’est pas encore factorisée, Codex doit :

- extraire la structure commune depuis Bergerac ;
- centraliser le contenu fixe dans un composant, une configuration ou une composition partagée adaptée au repo ;
- conserver exactement le rendu et le contenu de Bergerac ;
- éviter toute duplication du contenu commun dans la nouvelle page ;
- rendre les seuls champs locaux configurables ;
- ne pas créer un CMS ou une abstraction disproportionnée.

Le prompt ne doit pas dicter les noms de fichiers si l’architecture réelle suggère une solution différente.

### 11.3 Créer la nouvelle déclinaison

Codex doit :

- ajouter uniquement les données variables fournies ;
- enregistrer la ville sous le bon département ;
- créer la route réelle ;
- brancher la page au modèle partagé ;
- préserver les composants et la structure de Bergerac ;
- ne pas réécrire les blocs communs ;
- ne pas modifier Bergerac sauf nécessité technique de factorisation sans changement visible.

### 11.4 Vérifier les informations métier

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

### 11.5 SEO et maillage

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

### 11.6 Image

Codex doit :

- vérifier les droits ;
- intégrer l’image au pipeline existant ;
- utiliser l’alt fourni ;
- afficher le crédit lorsque la licence l’exige ;
- ne jamais hotlinker une image externe ;
- ne pas intégrer une image dont la licence est incertaine.

### 11.7 Tests

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
- modules facultatifs absents lorsqu’ils ne sont pas renseignés.

Ne pas créer de tests vérifiant mot pour mot la copy commune ou la présence exacte de phrases marketing.

Une reformulation éditoriale mineure ne doit pas casser les tests.

---

## 12. Structure recommandée du prompt Codex généré

Le prompt produit par ChatGPT doit suivre cette structure, sans inclure le contenu fixe.

```text
OBJECTIF
Créer la page ville [VILLE] en utilisant la page Bergerac comme implémentation de référence et source de vérité du contenu commun.

RÈGLE ABSOLUE
Ne recopie pas le contenu fixe dans cette nouvelle page. Inspecte Bergerac et réutilise le modèle partagé. Si le contenu fixe n’est pas encore industrialisé, factorise-le sans modifier le rendu de Bergerac.

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

- la copy complète de Bergerac ;
- le texte des blocs communs ;
- des exemples de formulations génériques à recopier ;
- des garde-fous internes présentés comme copy publique ;
- des placeholders silencieux ;
- une nouvelle architecture imposée sans inspection du repo.

---

## 13. Contrôles éditoriaux avant livraison

### Valeur locale

- Les données propres à la ville sont-elles réelles et vérifiées ?
- L’introduction locale apporte-t-elle quelque chose ?
- La liste de communes correspond-elle à la couverture réelle ?
- L’exemple de taxe a-t-il été validé par Florian ?
- La FAQ traite-t-elle des questions utiles à cette localité ?
- La page reste-t-elle une landing page claire et commerciale, sans paragraphe administratif défensif ?

### Cohérence avec Bergerac

- Aucun contenu commun n’a-t-il été réécrit inutilement ?
- La structure est-elle récupérée depuis la page de référence ?
- Les nouveaux champs sont-ils réellement variables ?
- Le rendu attendu reste-t-il cohérent avec les autres pages villes ?
- Les questions communes de FAQ sont-elles reprises depuis le modèle commun sauf vrai besoin local ?
- La nouvelle page ne contient-elle aucune mention visible de la ville de référence ou de la logique d’industrialisation ?

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

## 14. Contrôles techniques demandés à Codex

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

- rendu de Bergerac inchangé ;
- rendu de la nouvelle page ;
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
- absence de mention visible de la ville de référence sur la nouvelle page ;
- FAQ commune réutilisée sauf vrai besoin local ;
- tarifs et taxe de séjour confirmés par Florian ;
- absence de débordement horizontal ;
- accessibilité des liens, CTA, tableaux et FAQ ;
- rendu à 390, 768, 1024 et 1440 px ;
- image optimisée et correctement créditée ;
- calcul de taxe correctement affiché.

---

## 15. Résultat attendu

À chaque nouvelle ville, ChatGPT doit produire un delta local fiable, et non une nouvelle page complète.

Codex doit transformer ce delta en une déclinaison du modèle Bergerac, sans recopier le contenu commun.

Le système final doit permettre :

- d’ajouter une ville principalement par configuration ;
- de modifier une formulation commune une seule fois ;
- de conserver une cohérence parfaite entre les pages ;
- d’éviter les divergences de composants et de copy ;
- de maintenir séparément les données propres à chaque localité ;
- de faire évoluer le modèle commun sans reprendre manuellement toutes les pages.

La valeur SEO de chaque page doit venir de ses données locales réelles, de son exemple de taxe de séjour, de sa zone d’intervention, de ses tarifs confirmés, de son image et de sa FAQ — pas d’une réécriture artificielle des blocs communs.
