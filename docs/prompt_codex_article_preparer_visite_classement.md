# Prompt Codex — Créer l’article « Comment préparer la visite de classement de votre meublé de tourisme ? »

Tu vas créer et intégrer dans le site public Etoilys un nouvel article evergreen de la rubrique **Actualités**.

L’objectif n’est pas de me rendre une proposition de texte. Tu dois **modifier directement les fichiers du repo** pour publier l’article, l’ajouter à la liste des actualités, déclarer sa route, ses métadonnées SEO et ses données structurées, puis vérifier que le site compile correctement.

## 1. Documents et architecture à respecter

Avant toute modification :

1. lis `docs/Etoilys_guide_redaction_articles_actualites_v3.md` ou le fichier équivalent réellement présent dans le repo ;
2. lis `docs/contexte-projet-etoilys.md` ;
3. inspecte deux ou trois articles récents dans `src/pages/actualites` afin de reprendre exactement les composants, la structure visuelle, la gestion des sources, les encadrés, les tableaux, les CTA et les métadonnées déjà utilisés ;
4. inspecte les sources de vérité suivantes :
   - `src/AppRoutes.tsx` ;
   - `src/content/actualitesArticles.ts` ;
   - `src/content/seoRoutes.ts` ;
   - `src/content/articleStructuredData.ts` ;
   - les éventuels composants d’article partagés dans `src/components/ui` ou `src/components/actualites` ;
   - le workflow SEO du repo s’il existe, notamment `docs/seo-structurant-workflow.md`.

Réutilise strictement l’architecture existante. Ne crée pas un second système de blog, de SEO ou de données structurées.

## 2. Résultat attendu dans le repo

Tu dois au minimum :

- créer la page de l’article dans `src/pages/actualites` selon la convention existante ;
- déclarer la route dans `src/AppRoutes.tsx` ;
- ajouter l’article à `src/content/actualitesArticles.ts` avec la bonne date, le bon extrait et le bon ordre d’affichage ;
- ajouter les métadonnées dans `src/content/seoRoutes.ts` ;
- ajouter ou compléter les données structurées dans `src/content/articleStructuredData.ts` ;
- utiliser `BlogPosting` ;
- renseigner `headline`, `author`, `datePublished`, `dateModified`, `publisher`, `mainEntityOfPage` et l’image exigée par l’architecture existante ;
- faire apparaître sous le H1 une ligne de métadonnées lisible avec la date, l’auteur **Florian Grisorio** et le temps de lecture ;
- calculer le temps de lecture sur la base de 200 mots par minute, arrondi à l’entier supérieur ;
- intégrer les liens internes demandés sous forme de vrais liens HTML accessibles ;
- ajouter les sources officielles à la fin de l’article ;
- régénérer le sitemap si le repo conserve le fichier généré ;
- conserver les breadcrumbs JSON-LD gérés par le système central du site ;
- ne pas injecter manuellement de balises SEO ou de JSON-LD dans la page si le repo les centralise déjà ;
- ne pas traduire cet article en anglais ou en néerlandais : le périmètre est uniquement la version française ;
- ne modifier aucun contenu sans rapport avec cet article.

## 3. Contraintes éditoriales impératives

La copy ci-dessous est **définitive**. Tu dois l’intégrer telle quelle.

Tu peux seulement :

- adapter la syntaxe JSX/TSX ;
- utiliser les composants existants pour les tableaux, encadrés, listes et CTA ;
- remplacer les liens Markdown par les composants de lien utilisés dans le repo ;
- corriger une espace insécable ou une coquille purement typographique ;
- adapter les niveaux de titre si un composant impose une structure technique équivalente, sans changer les intitulés visibles.

Tu ne dois pas :

- réécrire, résumer, développer ou « améliorer » la copy ;
- ajouter tes propres conseils ;
- inventer d’autres exemples ;
- ajouter une explication détaillée du mécanisme de compensation des points obligatoires ;
- parler de la compensation par trois fois plus de points à la carte ;
- ajouter le prérequis de surface dans l’introduction ou dans le calcul des points ;
- écrire qu’un classement est garanti ;
- écrire qu’Etoilys conseille au propriétaire quels équipements acheter ou quelle catégorie viser ;
- employer les formulations `nous vous conseillons`, `vous devriez`, `maximisez vos chances`, `gagnez des points`, `réussissez votre classement` ou toute promesse similaire ;
- transformer l’article en reproduction exhaustive du guide Atout France ;
- créer un visuel décoratif ou télécharger une photo générique de propriétaire avec des clés — le monde survivra sans cela.

L’article doit rester factuel, simple et actionnable. Il explique ce qui doit pouvoir être constaté pendant la visite, sans constituer un pré-audit ni une prestation de conseil personnalisée.

## 4. Métadonnées exactes

Utilise les métadonnées suivantes :

- **Titre H1** : `Comment préparer la visite de classement de votre meublé de tourisme ?`
- **Meta title** : `Préparer la visite de classement de son meublé | Etoilys`
- **Meta description** : `133 critères, vaisselle, équipements, documents et informations clients : les points à vérifier avant la visite de classement de votre meublé.`
- **Slug** : `preparer-visite-classement-meuble-tourisme`
- **Route canonique** : `https://www.etoilys.fr/actualites/preparer-visite-classement-meuble-tourisme`
- **Published date** : `2026-07-19`
- **Updated date** : `2026-07-19`
- **Auteur visible et structured data** : `Florian Grisorio`
- **Type de contenu** : `blog-posting`
- **Schema** : `BlogPosting`
- **Catégorie** : `actualites`
- **Noindex** : `false`
- **Excerpt / texte de carte** : `Comment fonctionne la grille des 133 critères et quels équipements, quantités et informations vérifier avant la visite de classement ?`
- **Tags**, si le système en utilise :
  - `classement meublé de tourisme`
  - `visite de classement`
  - `critères Atout France`
  - `simulateur de classement`
  - `préparation du logement`

N’invente pas une nouvelle image de couverture. Si l’architecture exige une image pour la carte, Open Graph ou le structured data, réutilise le mécanisme ou l’image éditoriale par défaut déjà employée pour les articles qui n’ont pas de visuel spécifique. N’ajoute aucun visuel dans le corps de l’article : les tableaux et la checklist apportent déjà la valeur visuelle utile.

## 5. Intention de recherche

L’article doit répondre aux propriétaires qui cherchent notamment :

- comment préparer une visite de classement de meublé de tourisme ;
- ce que vérifie l’inspecteur ;
- comment fonctionnent les 133 critères ;
- quels équipements sont souvent oubliés ;
- quelles quantités de vaisselle sont nécessaires ;
- quels documents ou informations doivent être disponibles ;
- comment savoir à combien d’étoiles leur logement peut prétendre.

Le contenu est un **article evergreen pratique**. Il ne doit pas être présenté comme une actualité chaude ni artificiellement daté dans son titre.

## 6. Liens internes à intégrer exactement

Intègre naturellement les liens suivants :

1. chaque mention cliquable de `simulateur de classement Etoilys` ou chaque bouton de simulation doit pointer vers `/simulateur` ;
2. le lien `comprendre la procédure de classement` doit pointer vers `/procedure` ;
3. le lien `consulter les prérequis au classement` doit pointer vers `/prerequis-au-classement` ;
4. le lien `faire une demande de classement` doit pointer vers `/demande-classement` ;
5. l’encart `À lire aussi` doit pointer vers :
   - `/actualites/micro-bic-2026-meuble-classe-vs-non-classe`
   - avec l’ancre exacte : `Micro-BIC 2026 : meublé classé vs non classé, l’écart se creuse`.

Les CTA doivent utiliser les composants `Button` ou équivalents déjà présents dans le site. Ne crée pas un style de bouton propre à cet article.

## 7. Sources officielles à utiliser

Utilise uniquement les sources officielles suivantes pour cet article. Affiche-les dans la section finale `Sources officielles` avec des liens externes correctement sécurisés selon les conventions du repo.

1. **Atout France — Meublé de tourisme**  
   `https://www.atout-france.fr/fr/classement/meuble-de-tourisme`

2. **Atout France — Référentiel de classement des meublés de tourisme 2022**  
   `https://www.atout-france.fr/sites/default/files/2025-12/R%C3%A9f%C3%A9rentiel%20de%20classement%20des%20meubl%C3%A9s%20de%20tourisme%202022%20V2.pdf`

3. **Atout France — Guide de contrôle du classement des meublés de tourisme**  
   `https://www.atout-france.fr/sites/default/files/2026-01/Guide%20de%20contr%C3%B4le%20-%20Meubl%C3%A9%20de%20tourisme.pdf`

4. **Atout France — FAQ Meublé de tourisme**  
   `https://www.atout-france.fr/fr/classement/faq-meuble-de-tourisme`

Dans le corps de l’article, transforme la première occurrence de `référentiel national` en lien vers le référentiel PDF et la première occurrence de `guide de contrôle` en lien vers le guide PDF. Ne surcharge pas chaque paragraphe de renvois identiques.

## 8. Copy exacte de l’article

Intègre exactement le contenu visible ci-dessous.

---

# Comment préparer la visite de classement de votre meublé de tourisme ?

Lors de la visite de classement, l’inspecteur évalue votre logement à partir des **133 critères du référentiel national**. Certains critères sont obligatoires, d’autres sont « à la carte », et leur répartition change selon la catégorie demandée. Pour obtenir le classement visé, votre logement doit atteindre au moins **95 % des points obligatoires**, ainsi qu’un quota de points à la carte. Certains critères obligatoires non compensables doivent, eux, être validés dans tous les cas.

Cela ne signifie pas que votre logement doit être parfait. En revanche, certains critères reposent sur des éléments très simples auxquels on pense rarement : une quantité précise de vaisselle, une information écrite dans l’annonce ou un petit équipement manquant. Cet article fait le point sur les éléments les plus souvent oubliés ou bloquants, afin d’éviter les mauvaises surprises le jour de la visite.

> Les exemples ci-dessous reprennent les règles générales du référentiel. Ils ne constituent ni une évaluation préalable de votre logement, ni un conseil personnalisé sur les équipements à ajouter, ni une garantie d’obtenir la catégorie demandée.

## À retenir

- Les **133 critères** ne sont pas tous obligatoires pour toutes les catégories.
- La catégorie demandée et la capacité d’accueil déterminent une partie des exigences applicables.
- Il faut atteindre au moins **95 % des points obligatoires**, ainsi qu’un quota de points à la carte.
- Certains critères obligatoires non compensables doivent impérativement être validés.
- Le **simulateur de classement Etoilys** permet de parcourir tous les critères et d’estimer la catégorie à laquelle votre logement peut prétendre.

## Comprendre les critères correspondant à la catégorie demandée

Avant le début de la visite, vous indiquez la catégorie de classement demandée. L’inspecteur examine ensuite le logement en appliquant les critères correspondant à cette catégorie.

Un même équipement peut être à la carte pour une catégorie, puis devenir obligatoire lorsque le nombre d’étoiles augmente. Quelques exemples permettent de comprendre rapidement cette logique :

| Exemple de critère                     | 1 étoile   | 2 étoiles   | 3 étoiles   | 4 étoiles   | 5 étoiles   |
| -------------------------------------- | ---------- | ----------- | ----------- | ----------- | ----------- |
| Bouilloire                             | À la carte | Obligatoire | Obligatoire | Obligatoire | Obligatoire |
| Produits d’accueil dans la salle d’eau | À la carte | À la carte  | Obligatoire | Obligatoire | Obligatoire |
| Machine à expresso                     | À la carte | À la carte  | À la carte  | Obligatoire | Obligatoire |

Les produits d’accueil correspondent au minimum à du savon ou du gel douche et du shampoing dans chaque salle d’eau. Un produit combiné shampoing-douche est également accepté.

Pour obtenir la catégorie demandée, le logement doit atteindre au moins 95 % des points obligatoires et le quota de points à la carte prévu pour cette catégorie. Un critère obligatoire manquant n’empêche donc pas systématiquement d’obtenir le classement. En revanche, les critères obligatoires non compensables doivent tous être validés.

### Vous ne savez pas quelle catégorie demander ?

Le **simulateur de classement Etoilys** reprend les 133 critères et adapte l’évaluation à la catégorie envisagée et à la capacité de votre logement. Il permet de réaliser une première auto-évaluation avant la visite.

**CTA : Tester mon logement avec le simulateur**

## Vérifier les équipements et les quantités correspondant à la capacité

La capacité d’accueil déclarée ne détermine pas seulement le nombre de couchages. Elle modifie aussi les quantités de vaisselle, le nombre de places autour de la table et plusieurs autres exigences du référentiel.

### Critère 63 : vérifier les quantités de vaisselle

Le critère 63 porte sur la **quantité de vaisselle de table non dépareillée, minimum par personne**.

Pour chaque personne accueillie, le logement doit disposer au minimum de :

- 2 verres à eau ;
- 1 verre à vin ;
- 2 assiettes plates ;
- 2 assiettes creuses ;
- 2 assiettes à dessert ;
- 2 grandes cuillères ;
- 2 petites cuillères ;
- 2 couteaux ;
- 2 fourchettes ;
- 2 bols ;
- 2 tasses ou mugs.

Pour un logement classé pour **6 personnes**, il faut donc notamment 12 verres à eau, 6 verres à vin, 12 assiettes plates, 12 bols, 12 tasses ou mugs et 12 exemplaires de chaque couvert demandé en double.

La vaisselle ne doit pas nécessairement être entièrement identique. Pour les 12 bols d’un logement de 6 personnes, vous pouvez par exemple disposer de **6 bols blancs identiques et de 6 bols bleus identiques**. Vous disposez alors de deux séries cohérentes d’un bol par personne. En revanche, 12 bols tous différents ne constituent pas des ensembles de vaisselle non dépareillée.

### Critère 65 : vérifier la liste complète

Le critère 65 exige l’équipement minimum suivant pour la préparation des repas :

> 1 saladier, 1 plat allant au four, 2 casseroles, 1 poêle, 1 fait-tout, 1 tire-bouchon, 1 décapsuleur, 1 paire de ciseaux, 1 planche à découper, 1 couteau à pain, 1 passoire, 1 couvercle, 1 essoreuse à salade, 1 moule à tarte et/ou moule à gâteau, 1 ouvre-boîte, 1 économe, 1 dessous de plat, 1 verre doseur, 1 louche, 1 écumoire, 1 spatule et 1 fouet.

Tous ces éléments appartiennent au même critère. **S’il en manque un seul, le critère 65 ne peut pas être validé.**

### Les assises doivent également correspondre à la capacité

La table et ses assises doivent correspondre à la capacité totale du logement. Pour l’espace salon, le nombre de places sur le canapé et les fauteuils doit également correspondre à la capacité, mais cette exigence est **plafonnée à 7 personnes**. Un logement prévu pour 10 personnes n’a donc pas besoin de proposer 10 assises dans son salon pour valider ce critère.

Si votre logement accueille 6 personnes mais que le salon ne propose que 5 assises, le critère correspondant ne pourra pas être validé. Cela ne signifie pas automatiquement que le classement sera refusé : le logement doit atteindre au moins 95 % des points obligatoires. Tous les critères manquants n’ont donc pas le même caractère bloquant.

D’autres exigences varient selon la capacité, notamment le nombre de couchages, la capacité du réfrigérateur, le nombre de foyers de cuisson ou certains équipements sanitaires. Le **simulateur de classement Etoilys** adapte automatiquement ces exigences à la capacité renseignée.

## Préparer les documents et les informations destinées aux voyageurs

Certains critères ne reposent pas seulement sur la présence d’un équipement. Ils vérifient aussi les informations réellement mises à la disposition des voyageurs. Une déclaration orale faite le jour de la visite ne suffit pas toujours : l’information doit pouvoir être retrouvée sur un support vérifiable.

### Critère 100 : prévoir cinq supports d’information touristique

Le critère 100 demande de mettre à disposition des informations locales et touristiques en français et dans au moins une langue étrangère.

Pour le valider, il faut prévoir :

- au moins **5 dépliants, brochures ou supports d’information** au total ;
- parmi eux, au moins **3 disponibles dans une ou plusieurs langues étrangères**.

Une brochure bilingue compte à la fois pour le français et pour la langue étrangère. Les supports peuvent être proposés sur papier ou sous forme numérique : QR code, tablette, lien de téléchargement, site internet ou guide numérique.

Ces informations peuvent par exemple concerner les sites et monuments, les activités de loisirs, les excursions, les animations, l’office de tourisme, les commerces, les services publics ou les professionnels de santé à proximité.

### Critères 105, 106, 108 et 110 : rendre les services vérifiables par écrit

Les critères suivants portent sur des services proposés aux voyageurs :

| Critère | Information concernée                                          |
| ------- | -------------------------------------------------------------- |
| 105     | Draps de lit proposés systématiquement par le loueur           |
| 106     | Linge de toilette proposé systématiquement par le loueur       |
| 108     | Lits faits à l’arrivée proposés systématiquement par le loueur |
| 110     | Service de ménage proposé systématiquement                     |

Ces prestations peuvent être gratuites ou payantes. L’important est qu’elles soient systématiquement proposées et que l’information puisse être vérifiée par écrit : annonce de location, livret d’accueil, site internet, e-mail type, brochure ou affichage dans le logement.

Dire simplement à l’inspecteur que les lits sont toujours faits ou que le ménage est toujours proposé ne permet pas, à lui seul, de valider le critère. Il faut que cette information soit effectivement communiquée aux voyageurs.

Attention également à ne pas confondre deux services différents : **proposer les draps** et **proposer que les lits soient faits à l’arrivée** correspondent à deux critères distincts.

### Critère 116 : informer sur l’accessibilité ou la non-accessibilité

Le critère 116 porte sur les **informations concernant l’accessibilité sur les supports d’information**.

Le logement n’a pas besoin d’être accessible aux personnes à mobilité réduite pour valider ce critère. En revanche, les voyageurs doivent être clairement informés de son niveau d’accessibilité. Si le logement n’est pas adapté, cela doit être précisé sur l’annonce, le site internet, le livret d’accueil ou un autre support destiné aux voyageurs.

Une phrase simple peut suffire :

> Ce logement n’est pas adapté à l’accueil des personnes à mobilité réduite.

### Critère 130 : sensibiliser les voyageurs au respect de l’environnement

Le critère 130 porte sur la **sensibilisation des clients aux actions qu’ils peuvent réaliser pendant leur séjour en matière de respect de l’environnement**.

Cette information peut figurer dans le livret d’accueil, sur l’annonce, sur le site internet ou sur une affichette dans le logement. Il n’est pas nécessaire de rédiger une charte environnementale de trois pages. Une consigne courte et concrète peut permettre d’informer les voyageurs, par exemple :

> Pensez à éteindre les lumières et la climatisation lorsque vous quittez le logement, et à limiter votre consommation d’eau pendant votre séjour.

La sensibilisation peut aussi porter sur le tri des déchets, les transports en commun, la location de vélos, les itinéraires pédestres, les produits locaux ou d’autres moyens de réduire l’impact environnemental du séjour.

## Présenter le logement dans sa configuration réelle

La visite porte sur le logement tel qu’il est réellement proposé aux voyageurs. Les pièces comprises dans la location doivent être accessibles, les couchages doivent être installés dans leur configuration habituelle et les équipements déclarés doivent être présents, accessibles et fonctionnels.

Les appareils, les télécommandes, l’accès au Wi-Fi et les documents présentés comme des services du logement doivent pouvoir être vérifiés pendant la visite.

Le logement doit également être propre et correctement entretenu. Les sanitaires, les sols, les murs et plafonds, le mobilier, la literie ainsi que la cuisine et ses équipements font l’objet de cinq critères obligatoires non compensables : ils doivent tous être validés.

## La checklist avant la visite

Avant le rendez-vous, vérifiez les points suivants :

- La catégorie demandée est-elle cohérente avec le niveau d’équipement du logement ?
- La capacité déclarée correspond-elle aux couchages réellement présents ?
- Les places à table et dans le salon correspondent-elles aux exigences liées à cette capacité ?
- Les quantités de vaisselle prévues par le critère 63 sont-elles respectées ?
- La vaisselle forme-t-elle des ensembles cohérents ?
- Tous les éléments du critère 65 sont-ils présents ?
- Les équipements sont-ils accessibles et fonctionnels ?
- Au moins cinq supports d’information touristique sont-ils disponibles, dont trois en langue étrangère ou bilingues ?
- Les services proposés aux voyageurs sont-ils indiqués par écrit ?
- L’accessibilité ou la non-accessibilité du logement est-elle précisée ?
- Une information simple sensibilise-t-elle les voyageurs au respect de l’environnement ?
- Le logement est-il propre, entretenu et présenté comme il le serait pour accueillir des voyageurs ?

**CTA : Faire l’auto-évaluation complète de mon logement**

## Peut-on transmettre des compléments après la visite ?

Le **guide de contrôle** permet de transmettre certains éléments factuels dans un délai maximal de **15 jours ouvrés après la visite**. Il peut notamment s’agir de documents, d’un affichage, d’un guide d’accueil ou de certains petits équipements.

Cette possibilité n’est toutefois ni automatique, ni destinée à remplacer la préparation du logement. Les équipements et les services doivent normalement être constatés sur place le jour de l’inspection. La prise en compte d’un complément dépend de la nature du critère et des éléments transmis.

Un devis ou une facture ne permet notamment pas de valider des travaux non réalisés, un problème de propreté, un défaut d’entretien ou un équipement important qui n’était pas présent lors de la visite.

Etoilys vérifie au cas par cas si les éléments transmis permettent de constater valablement le respect du critère concerné. Pour comprendre l’ensemble des étapes et des délais, vous pouvez également **comprendre la procédure de classement**.

## Sources officielles

- Atout France — Meublé de tourisme
- Atout France — Référentiel de classement des meublés de tourisme 2022
- Atout France — Guide de contrôle du classement des meublés de tourisme
- Atout France — FAQ Meublé de tourisme

## Bien préparer la visite, sans chercher à rendre chaque critère parfait

Préparer la visite ne consiste pas à rendre chaque critère parfait. Il s’agit surtout de choisir une catégorie cohérente, de vérifier les quantités qui dépendent de la capacité et de rendre accessibles les équipements, documents et informations réellement proposés aux voyageurs.

Le moyen le plus simple de faire le point avant la visite reste de parcourir les 133 critères dans le **simulateur de classement Etoilys**. Vous pouvez ensuite **consulter les prérequis au classement** ou **faire une demande de classement** lorsque votre projet est prêt.

**CTA principal : Tester mon logement avec le simulateur de classement**

**À lire aussi : Micro-BIC 2026 : meublé classé vs non classé, l’écart se creuse**

---

## 9. Mise en forme attendue

Respecte les conventions visuelles des autres articles Etoilys.

### Métadonnées visibles

Sous le H1, affiche une ligne du type :

`Publié le 19 juillet 2026 · Florian Grisorio · X min de lecture`

Calcule `X` à partir du nombre réel de mots du contenu principal, avec `ceil(nombre de mots / 200)` et un minimum de 1 minute. Avec la copy fournie, le résultat attendu est **11 min de lecture** ; vérifie-le après intégration.

### Encadré de prudence

Le paragraphe placé juste après l’introduction et commençant par `Les exemples ci-dessous…` doit être rendu comme un encadré d’information sobre, pas comme une alerte rouge.

### Bloc À retenir

Utilise le composant d’encadré déjà utilisé dans les autres articles, avec cinq points maximum.

### Tableau des catégories

Le premier tableau doit rester lisible sur mobile. Réutilise `ResponsiveComparisonTable` s’il correspond à cet usage ou le composant de tableau responsive déjà employé dans les articles. N’affiche pas une grille qui impose un scroll horizontal illisible sans traitement mobile.

### Critère 65

La liste complète du critère 65 doit apparaître dans un bloc visuellement distinct, mais pas dans un composant d’erreur. Mets particulièrement en évidence la phrase :

`S’il en manque un seul, le critère 65 ne peut pas être validé.`

### Tableau des services

Le tableau des critères 105, 106, 108 et 110 doit rester court, lisible et accessible. Ne rajoute pas de colonnes.

### Checklist

La checklist doit être présentée en un seul bloc. Ne la transforme pas en rétroplanning, en calendrier ou en étapes `une semaine avant / la veille / le jour J`.

### CTA

Remplace les marqueurs textuels `CTA :` et `CTA principal :` par de vrais boutons :

- `Tester mon logement avec le simulateur` → `/simulateur`
- `Faire l’auto-évaluation complète de mon logement` → `/simulateur`
- `Tester mon logement avec le simulateur de classement` → `/simulateur`

Ne conserve pas le préfixe visible `CTA :` dans la page finale.

Le CTA final vers le simulateur doit être le bouton principal. Les liens vers la procédure, les prérequis et la demande de classement restent secondaires.

### Liens externes

Les sources officielles doivent s’ouvrir selon la convention existante du site. Si les liens externes s’ouvrent dans un nouvel onglet, ajoute les attributs de sécurité requis par le composant partagé.

## 10. Contrôles factuels à ne pas modifier

Les affirmations suivantes sont intentionnelles et doivent rester telles quelles :

- le référentiel comprend 133 critères ;
- la bouilloire est à la carte en 1 étoile et obligatoire de 2 à 5 étoiles ;
- les produits d’accueil sont à la carte en 1 et 2 étoiles et obligatoires de 3 à 5 étoiles ;
- la machine à expresso est à la carte de 1 à 3 étoiles et obligatoire en 4 et 5 étoiles ;
- le critère 47 demande au minimum du savon ou du gel douche et du shampoing dans toutes les salles d’eau ; le shampoing-douche est accepté ;
- le critère 63 demande les quantités détaillées dans l’article, calculées par personne ;
- deux séries cohérentes de six bols sont acceptables pour un logement de six personnes, alors que douze bols tous différents ne forment pas des ensembles cohérents ;
- le critère 65 forme un seul critère : l’absence d’un seul équipement empêche sa validation ;
- le critère 26 plafonne le nombre d’assises du salon à sept personnes ;
- le critère 100 demande au moins cinq supports au total, dont trois en langue étrangère ; les supports bilingues et numériques sont admis ;
- les critères 105, 106, 108 et 110 doivent être vérifiables par un support écrit ou un autre moyen factuel ; une affirmation orale seule ne suffit pas ;
- le critère 116 exige d’informer sur l’accessibilité ou la non-accessibilité du logement ;
- le critère 130 peut être validé par une information courte sur la consommation d’eau ou d’énergie, le tri, l’écomobilité ou d’autres gestes environnementaux ;
- certains compléments factuels peuvent être reçus dans les quinze jours ouvrés après la visite, sans que cela constitue un droit automatique à corriger tous les écarts.

Ne remplace pas ces formulations par des versions plus vagues.

## 11. Tests et validation finale

Après intégration :

1. vérifie qu’aucune route existante n’est cassée ;
2. vérifie que la nouvelle route est indexable, canonique et présente dans le sitemap ;
3. vérifie que le H1 est unique ;
4. vérifie que les métadonnées visibles affichent `Florian Grisorio` ;
5. vérifie que le structured data utilise également `Florian Grisorio` ;
6. vérifie que `datePublished` et `dateModified` valent `2026-07-19` ;
7. vérifie que les boutons vers `/simulateur` fonctionnent ;
8. vérifie que les liens vers `/procedure`, `/prerequis-au-classement`, `/demande-classement` et l’article Micro-BIC fonctionnent ;
9. vérifie la lisibilité des deux tableaux et de la checklist sur mobile ;
10. vérifie que la page n’affiche aucun marqueur résiduel du prompt comme `CTA :`, `CTA principal :` ou `Copy exacte` ;
11. lance les commandes utiles du repo, au minimum :
    - `npm run typecheck`
    - `npm run lint`
    - `npm run test:run`
    - `npm run build`
    - `npm run seo:sitemap` si le sitemap est généré et versionné ;
    - le prerender ou la validation SEO prévue par le workflow du repo si elle fait partie du processus normal.

Corrige les erreurs introduites par ta modification. Ne masque pas les erreurs avec `any`, `@ts-ignore` ou un contournement de typage.

## 12. Compte rendu attendu

À la fin, rends un compte rendu court avec :

- les fichiers créés ou modifiés ;
- la route publiée ;
- le temps de lecture calculé ;
- les commandes de validation exécutées et leur résultat ;
- les éventuels points que tu n’as pas pu vérifier.

Ne recopie pas l’article dans ta réponse finale : il doit être directement intégré au repo.
