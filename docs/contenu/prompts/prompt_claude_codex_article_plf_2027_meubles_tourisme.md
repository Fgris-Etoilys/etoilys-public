# Prompt Claude / Codex — Article Actualités Etoilys

## PLF 2027 : ce qui pourrait changer pour les propriétaires de meublés de tourisme

Tu vas **rédiger et intégrer dans le site public Etoilys** un nouvel article de la rubrique **Actualités** consacré au projet de loi de finances pour 2027 et à ses conséquences potentielles pour les propriétaires de meublés de tourisme.

L’article doit être conçu dès le départ comme un **article vivant**, destiné à être mis à jour aux étapes parlementaires importantes, sans créer un nouvel article à chaque amendement ou rebondissement.

L’objectif n’est pas de produire une note parlementaire ou fiscale soporifique. Le lecteur doit comprendre **très vite ce qui pourrait changer pour lui**, puis seulement ensuite où en est le texte.

---

# 1. Avant toute modification : inspecter le projet

Commence par lire et respecter les documents de référence présents dans le repo, en particulier :

- `Etoilys_guide_redaction_articles_actualites_v3.md`
- `contexte-projet-etoilys.md`
- la documentation actuelle sur la structure/refonte des articles Actualités, notamment `roadmap_refacto_structure_articles.md` si elle est présente ;
- les articles Actualités déjà publiés ;
- les composants partagés utilisés par ces articles.

Inspecte notamment :

- `src/pages/actualites/*`
- `src/content/actualitesArticles.ts`
- `src/content/articleStructuredData.ts`
- `src/content/seoRoutes.ts`
- `src/AppRoutes.tsx`
- `ArticleLayout`
- `KeyTakeaways`
- `ArticleSources`
- `ArticleTableOfContents`
- `ArticleSectionHeading`
- le système actuel d’articles associés ;
- le bloc auteur ;
- les tests de gouvernance des articles et des routes ;
- le sitemap et le prerender.

## Contraintes techniques

- Réutilise strictement l’architecture actuelle des articles Actualités.
- Ne recrée pas un shell d’article spécifique.
- Ne crée pas de nouveau composant métier spécifique à cet article si les composants existants suffisent.
- Ne crée pas de nouvelle dépendance.
- Garde React 19, TypeScript strict, React Router 7 et Tailwind 3.
- Le SEO doit rester centralisé selon les conventions du repo.
- N’injecte pas manuellement de JSON-LD dans la page.
- Utilise le système existant pour les métadonnées d’article, la catégorie, le temps de lecture, les sources, les articles associés et le bloc auteur.
- Ne modifie aucune autre page éditorialement.
- Ne modifie pas les routes EN/NL.
- Aucun visuel dans le corps n’est nécessaire pour cet article. N’invente pas une image générique.
- Ne crée pas de gros tableau comparatif pour expliquer la réforme : sur ce sujet, privilégie des phrases courtes et un **exemple concret de propriétaire**.

---

# 2. Vérification obligatoire de l’état du PLF avant rédaction

Ce brief a été préparé le **4 octobre 2026** à partir du **projet initial du Gouvernement**, n° 3210, déposé à l’Assemblée nationale le **1er octobre 2026**.

**Avant de rédiger**, vérifie impérativement l’état exact du texte au moment où tu exécutes ce prompt.

Utilise en priorité :

1. le dossier législatif officiel de l’Assemblée nationale ;
2. la dernière version officielle du projet ou du texte adopté disponible ;
3. les amendements effectivement adoptés lorsqu’ils modifient matériellement le sujet ;
4. Légifrance pour le droit actuellement en vigueur ;
5. impots.gouv.fr / economie.gouv.fr / BOFiP pour les règles fiscales déjà applicables.

## Ce que tu dois vérifier

- Le PLF 2027 est-il toujours au stade du projet initial, en commission, adopté par l’Assemblée, transmis au Sénat, en CMP, adopté définitivement ou promulgué ?
- L’article 7 existe-t-il toujours dans la même rédaction ?
- Les plafonds **1,5 % / 5 000 €** pour les meublés de tourisme ont-ils été modifiés ?
- Le plafond général **2,5 % / 7 000 €** a-t-il été modifié ?
- Le traitement des amortissements non déduits à partir des exercices clos en 2027 a-t-il été modifié ?
- Le régime transitoire du stock d’amortissements antérieurs a-t-il été modifié ?
- Une autre disposition du PLF ou un amendement adopté a-t-il entre-temps modifié le micro-BIC des meublés de tourisme ?
- Le calendrier d’entrée en vigueur a-t-il été précisé ou modifié ?

### Règle éditoriale essentielle

Le **corps principal de l’article doit toujours décrire l’état actuel le plus pertinent du texte**, tandis que l’historique placé en bas doit conserver la trace des grandes étapes précédentes.

Ne laisse jamais plusieurs versions contradictoires de la règle se battre au milieu de l’article.

Un amendement simplement déposé ne devient pas la nouvelle vérité de l’article. Ne modifie le cœur du contenu que lorsqu’une évolution parlementaire a une importance réelle pour le propriétaire et un statut suffisamment solide.

---

# 3. Sources officielles de départ

## PLF 2027 — Assemblée nationale

### Dossier législatif

https://www.assemblee-nationale.fr/dyn/17/dossiers/PLF_2027

### Projet de loi n° 3210

https://www.assemblee-nationale.fr/dyn/17/textes/l17b3210_projet-loi

### Texte intégral / version raw

https://www.assemblee-nationale.fr/dyn/docs/PRJLANR5L17B3210.raw

À vérifier en priorité dans la version du texte disponible au moment de la rédaction :

- **article 7** : modifications proposées de l’article 39 C du CGI ;
- **article 33** : modalités d’entrée en vigueur des mesures fiscales.

## Droit actuellement applicable — article 39 C du CGI

https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000029355753/2026-01-29

Le droit actuel prévoit notamment le report des amortissements régulièrement comptabilisés mais non déduits dans les conditions prévues par l’article 39 C.

## Micro-BIC 2026 — source officielle

https://www.economie.gouv.fr/particuliers/impots-et-fiscalite/gerer-mon-impot-sur-le-revenu/location-meublee-de-tourisme-quelles-sont-les-regles-respecter-pour-sa-residence

Pour les **revenus 2026 déclarés en 2027**, la source indique actuellement :

- meublé de tourisme **classé** : micro-BIC jusqu’à **83 600 €**, abattement **50 %** ;
- meublé de tourisme **non classé** : micro-BIC jusqu’à **15 000 €**, abattement **30 %**.

Tu peux aussi vérifier la version BOFiP la plus récente si nécessaire.

## Rapport Annaïg Le Meur — ordre de grandeur sur le régime réel

Source institutionnelle :
https://portail.documentation.developpement-durable.gouv.fr/pub/CGE00001131-propositions-reforme-fiscalite-locative-appui-mme.html

Le rapport **« Propositions de réforme de la fiscalité locative »** reprend des données de la Direction de la législation fiscale.

Pour 2021, il recense parmi les LMNP :

- **595 000** déclarants en micro-BIC cas général ;
- **124 000** déclarants en micro-BIC classé ;
- **305 000** déclarants au régime BIC réel ;
- **1 024 000** déclarants LMNP au total.

Soit environ **29,8 %**, donc **près de 30 %**, au régime réel.

### Garde-fou impératif sur ce chiffre

N’écris pas que « 30 % des propriétaires de meublés de tourisme sont au réel ».

Les données portent sur **l’ensemble des LMNP**, location meublée touristique et autres locations meublées confondues, et datent de 2021.

La formulation correcte est du type :

> À titre d’ordre de grandeur, les données fiscales 2021 reprises dans le rapport Le Meur comptaient environ 305 000 déclarants LMNP au régime réel sur un peu plus d’un million au total, soit près de 30 %. Ce chiffre concerne l’ensemble des locations meublées non professionnelles, pas uniquement les meublés de tourisme.

Le rapport indique également que le recours au réel était très souvent lié à l’intérêt de l’amortissement et non à un simple dépassement des seuils du micro. Cette donnée peut être utilisée pour expliquer **pourquoi la réforme est importante**, sans transformer l’article en plaidoyer politique.

---

# 4. Ce que dit le projet initial au 4 octobre 2026

Cette section du brief sert de **baseline**. Si le texte a évolué au moment de l’exécution, actualise l’article avec la nouvelle version officielle au lieu de recopier aveuglément ces éléments.

Dans le projet initial, l’article 7 propose notamment :

- pour les locations meublées non professionnelles en général :
  - amortissement immobilier plafonné à **2,5 %** ;
  - avec un maximum de **7 000 € par an et par foyer fiscal** ;

- lorsque le logement est un **meublé de tourisme** :
  - taux abaissé à **1,5 %** ;
  - maximum de **5 000 € par an et par foyer fiscal** ;

- pour les **exercices clos à compter du 1er janvier 2027** :
  - les amortissements qui ne peuvent pas être déduits du résultat d’un exercice du fait de ces nouvelles limites **ne seraient plus reportables sur les exercices suivants** ;

- pour le **stock d’amortissements non déduits antérieur au 1er janvier 2027** :
  - utilisation possible jusqu’au **31 décembre 2036** ;
  - dans la limite de **la moitié du résultat imposable restant**, après application des nouvelles règles d’amortissement.

L’article 33 du projet initial prévoit, sauf disposition spécifique, une entrée en vigueur au **31 décembre 2026** pour les impositions dont le fait générateur est l’achèvement de l’année civile ou la clôture de l’exercice comptable.

### Garde-fou calendrier

Ne simplifie pas cela en écrivant trop vite :

> « applicable aux revenus 2027 »

ou toute autre formule approximative.

Explique seulement le calendrier que permet d’affirmer la version officielle du texte au moment de la rédaction.

---

# 5. Positionnement éditorial

## Type d’article

Article d’actualité fiscale conçu pour devenir un **article vivant de référence pendant l’examen du PLF 2027**.

Longueur cible à la première publication : **environ 1 000 à 1 400 mots**.

Ne gonfle pas artificiellement le texte.

## Public

Propriétaires de meublés de tourisme, non spécialistes de fiscalité.

Le lecteur veut savoir :

- est-ce que cela me concerne ?
- qu’est-ce qui pourrait changer ?
- combien cela peut représenter concrètement ?
- qu’arrive-t-il aux amortissements que j’ai déjà accumulés ?
- est-ce déjà voté ?

Il ne vient pas lire un compte rendu de la commission des finances.

## Angle

**Impact fiscal d’abord. Processus parlementaire ensuite.**

L’article doit commencer par le changement potentiel pour le propriétaire, pas par l’état procédural du PLF.

Ne crée pas en haut de page un encadré « État du texte », une chronologie parlementaire ou un préambule du type « cette page sera mise à jour au fil des débats ».

L’information sur le caractère non définitif du texte est indispensable, mais elle doit rester **secondaire** dans l’ouverture.

---

# 6. Métadonnées

## H1

`PLF 2027 : ce qui pourrait changer pour les propriétaires de meublés de tourisme`

Si, au moment de l’exécution, la loi de finances a été définitivement adoptée et promulguée, adapte le H1 en conséquence, sans changer inutilement le slug.

## Meta title

`PLF 2027 et meublés de tourisme : les mesures à suivre | Etoilys`

Si le texte est définitivement adopté, adapte le verbe pour refléter le droit réel.

## Meta description

`Amortissement LMNP, régime réel, micro-BIC : les mesures du PLF 2027 qui concernent les propriétaires de meublés de tourisme.`

Ajuste si nécessaire selon la version définitive du texte, sans rallonger artificiellement.

## Slug

`plf-2027-meubles-tourisme`

Ne change pas ce slug au fil des mises à jour.

## Catégorie

`fiscalite`

Libellé public : `Fiscalité`

## Auteur

`Florian Grisorio`

## Published date

Utilise la vraie date de première publication.

Si l’article est publié le jour de préparation de ce brief :
`2026-10-04`

## Updated date

Identique à la date de publication lors de la première mise en ligne.

Lors d’une future mise à jour substantielle du texte, actualise `updatedAt` selon les conventions du projet.

## Temps de lecture

Calcule-le selon le système actuel du repo.

---

# 7. Chapô — utiliser cette copy

Le chapô doit être court et immédiatement utile.

Utilise cette base, sauf si l’état du droit a déjà évolué au moment de la rédaction :

> **Le PLF 2027 s’attaque directement à l’un des grands avantages du LMNP au régime réel : l’amortissement. Pour les meublés de tourisme, le Gouvernement propose de limiter beaucoup plus fortement ce qui peut être déduit chaque année. Si vous êtes au micro-BIC, cette mesure ne vous concerne pas. Si vous êtes au réel, en revanche, le changement peut être important.**

Si le texte n’est plus seulement une proposition gouvernementale, adapte les temps et les verbes. Ne conserve pas « propose » si la mesure a été définitivement adoptée.

### À éviter absolument dans le chapô

- `Cette page sera mise à jour au fil de l’actualité.`
- `Le texte commence son parcours parlementaire.`
- `Dans le cadre de l’examen du projet de loi...`
- toute explication sur la navette parlementaire ;
- toute phrase qui retarde l’information principale.

---

# 8. Bloc « À retenir »

Utilise le composant partagé `KeyTakeaways`, probablement en variante `bullets`.

Maximum : **5 items**.

Dans la version initiale du PLF, utilise cet ordre logique :

1. **Pour les meublés de tourisme, le Gouvernement propose de plafonner la déduction des amortissements immobiliers à 1,5 % et 5 000 € par an et par foyer fiscal.**

2. **Les amortissements qui ne pourraient pas être déduits pour les exercices clos à compter de 2027 ne seraient plus reportables sur les exercices suivants.**

3. **Les amortissements accumulés avant 2027 resteraient utilisables jusqu’à fin 2036, mais dans la limite de 50 % du résultat imposable restant selon les modalités prévues par le texte.**

4. **La mesure vise les LMNP au régime réel.** Les propriétaires au micro-BIC ne déduisent pas d’amortissements et ne sont donc pas concernés par ce plafonnement. Tu peux rappeler très brièvement que, sous les règles actuellement applicables aux revenus 2026, un meublé classé conserve au micro-BIC un plafond de **83 600 € avec 50 % d’abattement**, contre **15 000 € et 30 %** pour un non-classé.

5. **Rien n’est encore définitif** si le PLF est toujours en cours d’examen : ces règles correspondent à l’état actuel du texte et peuvent encore évoluer avant l’adoption du budget.

Si le PLF a évolué, mets naturellement à jour ces cinq points. Ne conserve jamais une ancienne règle uniquement parce qu’elle figure dans ce brief.

---

# 9. Structure détaillée de l’article

Utilise **5 H2 maximum**.

Ne commence pas par un H2 expliquant où en est le PLF.

---

## H2 1 — `Le PLF 2027 veut fortement limiter l’amortissement des meublés de tourisme`

Si le texte est définitivement adopté, adapte le titre au présent.

### Objectif

Expliquer immédiatement la mesure principale et pourquoi elle peut compter.

### Déroulé attendu

Commence par expliquer très brièvement le fonctionnement actuel :

- au régime réel, le propriétaire peut déduire des charges ;
- l’amortissement du logement constitue un mécanisme central du régime réel LMNP ;
- dans les limites actuelles prévues par l’article 39 C, les amortissements non déduits peuvent aujourd’hui être reportés ;
- le projet veut changer fortement cette mécanique.

Ne fais pas un cours de comptabilité.

Ensuite explique clairement :

- plafond général prévu pour le LMNP : **2,5 % / 7 000 €** ;
- régime plus strict lorsqu’il s’agit d’un meublé de tourisme : **1,5 % / 5 000 €**.

### Exemple concret obligatoire

Après l’explication, donne un **cas simple de propriétaire**.

L’objectif est que le lecteur comprenne en 15 secondes ce que signifie le plafond.

Tu peux partir d’une logique du type :

> Un propriétaire au réel déduit aujourd’hui 8 000 € d’amortissement immobilier sur son exercice. Avec le projet actuel, il ne pourrait de toute façon plus déduire plus de 5 000 € pour un meublé de tourisme, et le plafond de 1,5 % pourrait conduire à un montant encore inférieur selon la base applicable.

Mais **vérifie impérativement la mécanique exacte du taux de 1,5 % avant de figer l’exemple**.

Si la source officielle ne permet pas de construire proprement un exemple à partir d’un prix d’achat ou d’une base amortissable, n’invente pas de formule. Utilise un exemple centré sur la dotation annuelle et le plafond absolu de 5 000 €, avec une phrase expliquant que le taux de 1,5 % peut abaisser davantage la déduction.

Ne calcule pas un « impôt supplémentaire de X € » sans hypothèses fiscales solides : cela dépendrait notamment du résultat, des autres charges et de la situation fiscale du foyer.

---

## H2 2 — `Qui serait réellement concerné ?`

Pas de tableau.

Réponds en quelques paragraphes simples.

### À expliquer

La mesure concerne les **loueurs en meublé non professionnels au régime réel**.

Elle ne concerne pas directement les propriétaires au **micro-BIC**, puisque ceux-ci bénéficient d’un abattement forfaitaire au lieu de déduire leurs charges et amortissements individuellement.

Profite de ce passage pour rappeler **très brièvement** l’écart actuel en faveur du classement au micro-BIC :

> Pour les revenus 2026, un meublé de tourisme classé peut actuellement rester au micro-BIC jusqu’à 83 600 € de recettes avec un abattement de 50 %, contre 15 000 € et 30 % pour un meublé non classé.

Ne transforme pas cette parenthèse en nouvelle section sur le micro-BIC : l’article existant d’Etoilys couvre déjà ce sujet.

### Ajouter l’ordre de grandeur Le Meur

Intègre ensuite la donnée avec la nuance obligatoire :

> À titre d’ordre de grandeur, les données fiscales 2021 reprises dans le rapport Le Meur comptaient environ 305 000 déclarants LMNP au régime réel sur un peu plus d’un million au total, soit près de 30 %. Ce chiffre concerne l’ensemble de la location meublée non professionnelle, pas uniquement les meublés de tourisme.

Tu peux ensuite expliquer en une phrase que le rapport souligne le rôle important de l’amortissement dans l’attrait du régime réel.

### Classé / non classé au régime réel

Ne crée **aucun H3** dédié à cette question.

Ajoute seulement une phrase courte si la rédaction du texte est toujours la même :

> Dans la rédaction actuelle du PLF, le plafond spécifique vise les meublés de tourisme sans distinguer les logements classés des non-classés.

Pas davantage.

---

## H2 3 — `Le projet change aussi le sort des amortissements non déduits`

Cette section doit montrer que la réforme ne se limite pas au couple `1,5 % / 5 000 €`.

Explique distinctement deux choses.

### 1. Les nouveaux amortissements qui ne peuvent pas être déduits

Dans le projet initial, pour les exercices clos à compter du 1er janvier 2027, les amortissements qui ne pourraient pas être déduits en raison des nouvelles limites **ne seraient plus reportables sur les exercices suivants**.

Explique la différence avec le fonctionnement actuel sans entrer dans une démonstration comptable interminable.

### 2. Le stock déjà accumulé avant 2027

Dans le projet initial :

- il ne disparaît pas immédiatement ;
- il peut être utilisé jusqu’au **31 décembre 2036** ;
- mais seulement dans la limite prévue par le texte, correspondant à **la moitié du résultat imposable restant** après application des nouvelles règles.

### Exemple court conseillé

Tu peux ajouter un mini-cas :

> Si un propriétaire arrive au 31 décembre 2026 avec un stock d’amortissements non encore déduits, ce stock ne serait donc pas effacé du jour au lendemain. En revanche, il ne pourrait plus être utilisé aussi librement qu’aujourd’hui et serait soumis au nouveau plafond annuel jusqu’en 2036.

Ne donne un montant chiffré que si le calcul est incontestable.

---

## H2 4 — `Ce qui peut encore changer pendant l’examen du budget`

Cette section ne doit pas raconter la vie de l’Assemblée nationale.

Elle doit répondre à :

> Quelles parties du dispositif faut-il réellement surveiller avant de considérer la réforme comme acquise ?

Suis en priorité :

- le taux **1,5 %** ;
- le plafond **5 000 €** ;
- la différence de traitement entre meublés de tourisme et autres locations meublées ;
- la suppression du report des nouveaux amortissements non déduits ;
- le traitement du stock antérieur ;
- le calendrier d’entrée en vigueur ;
- l’apparition éventuelle d’une autre mesure fiscale concernant les meublés de tourisme, notamment le micro-BIC.

### Règle éditoriale

Ne transforme pas cette section en inventaire d’amendements.

Un amendement simplement déposé peut être ignoré s’il ne change rien de concret à l’état du texte.

Si un amendement important est adopté, actualise le corps principal de l’article et conserve l’ancienne étape dans l’historique du H2 suivant.

---

## H2 5 — `Où en est le PLF 2027 ?`

Cette information arrive volontairement **en bas de l’article**, après l’impact fiscal.

### Introduction courte

Dans la version initiale, la logique est :

> Le projet de loi de finances pour 2027 a été déposé par le Gouvernement le 1er octobre 2026. Les mesures présentées dans cet article correspondent à l’état actuel du texte : elles peuvent encore être amendées, supprimées ou remplacées avant l’adoption définitive du budget.

Adapte naturellement si le processus a avancé.

### Historique des changements importants

Sous cette introduction, crée une chronologie éditoriale très sobre.

À la première publication :

**1er octobre 2026 — Projet initial du Gouvernement**

Puis résume en 1 ou 2 phrases maximum :

> Le Gouvernement propose de plafonner l’amortissement immobilier des LMNP, avec un régime plus strict pour les meublés de tourisme : 1,5 % et 5 000 € par an et par foyer fiscal.

Pour les futures mises à jour, ajoute uniquement les étapes qui changent réellement quelque chose :

- modification importante en commission ;
- texte adopté par l’Assemblée nationale ;
- texte du Sénat s’il diffère ;
- éventuelle CMP ;
- adoption définitive ;
- promulgation.

Maximum 2 à 3 phrases par étape.

Le haut de l’article reste toujours la version utile et actuelle. Cet historique sert seulement à comprendre les évolutions successives.

---

# 10. Fin de l’article et maillage interne

## Pas de CTA commercial vers le classement

La mesure proposée au régime réel ne crée pas d’avantage spécifique pour les meublés classés.

Ne termine donc pas par :

- `Demander mon classement`
- `Faire classer mon meublé`
- ou un bloc artificiel expliquant que le classement protège de la réforme.

Ce serait faux ou hors sujet.

## Transition utile vers l’article Micro-BIC

Termine plutôt par une transition éditoriale sobre vers l’article existant :

> **Vous êtes au micro-BIC ?** Cette réforme de l’amortissement ne vous concerne pas directement. Retrouvez les seuils et abattements applicables aux meublés classés et non classés dans notre décryptage du micro-BIC 2026.

Utilise la vraie route actuelle de l’article :

`/actualites/micro-bic-2026-meuble-classe-vs-non-classe`

Tu peux aussi utiliser le système d’articles associés existant pour afficher cet article comme contenu connexe.

Ne surcharge pas la fin avec plusieurs CTA.

---

# 11. Ton et style : règle majeure

L’article doit être **impactant sans devenir racoleur**.

On parle de fiscalité à des propriétaires, pas à des fiscalistes.

## À privilégier

- paragraphes courts ;
- phrases directes ;
- exemples concrets ;
- chiffres visibles ;
- formulations comme :
  - `Concrètement`
  - `Le changement est important`
  - `Si vous êtes au réel...`
  - `Si vous êtes au micro-BIC...`
  - `Le projet veut surtout changer deux choses`
  - `Pour un propriétaire, cela signifie...`

## À éviter

- `Il convient de noter que...`
- `Dans le cadre de...`
- `S’agissant de...` à répétition ;
- `Le lecteur doit comprendre que...`
- `Cette page sera mise à jour...`
- `À ce stade du processus législatif...` en ouverture ;
- les paragraphes sur la procédure parlementaire avant d’avoir expliqué l’impact ;
- les phrases de 5 lignes ;
- les répétitions du fait que le texte n’est pas définitif ;
- le jargon comptable non expliqué ;
- les gros tableaux remplis de règles ;
- le ton dramatique du type `séisme fiscal`, `coup de massue`, `fin du LMNP`, sauf si une source officielle justifie réellement une telle formulation — ce qui n’est pas le cas ici.

### Important

Ne confonds pas **impactant** et **clickbait**.

Le bon rythme est :

> changement concret → qui est concerné → exemple → conséquences → seulement ensuite statut parlementaire.

---

# 12. Sources officielles visibles dans l’article

Utilise le composant partagé `ArticleSources`.

La section finale doit au minimum contenir, dans leur version la plus récente au jour de rédaction :

1. **Assemblée nationale — Projet de loi de finances pour 2027, dossier législatif**
2. **Assemblée nationale — Texte du PLF 2027 / article 7 dans la version réellement analysée**
3. **Légifrance — article 39 C du CGI dans sa version en vigueur**
4. **Assemblée nationale — article 33 du PLF 2027**, si nécessaire pour expliquer le calendrier
5. **Ministère / Bercy — règles micro-BIC applicables en 2026**
6. **Rapport Annaïg Le Meur / IGF / IGEDD — Propositions de réforme de la fiscalité locative**, pour l’ordre de grandeur du nombre de LMNP au réel

Si une loi de finances est promulguée entre-temps, la **loi publiée sur Légifrance devient la source principale**, devant le projet initial.

Ne conserve pas quinze versions intermédiaires devenues inutiles dans les sources finales.

---

# 13. Articles associés

Utilise le système actuel des articles associés.

Priorité :

1. `Micro-BIC 2026 : meublé classé vs non classé, l’écart se creuse`
2. éventuellement un autre article fiscal ou réglementaire réellement pertinent déjà présent dans le repo.

Ne crée pas de contenu associé artificiel.

---

# 14. SEO et données structurées

Respecte l’architecture existante :

- route dans `AppRoutes.tsx` si nécessaire ;
- métadonnées dans `seoRoutes.ts` ;
- métadonnées de liste dans `actualitesArticles.ts` ;
- données structurées via le système central existant ;
- aucune injection SEO manuelle dans la page ;
- sitemap régénéré selon le workflow du repo ;
- prerender vérifié ;
- canonical sur le domaine `https://www.etoilys.fr`.

Le slug doit rester stable pendant toute la vie de l’article, même lorsque le PLF devient loi de finances.

---

# 15. Critères d’acceptation éditoriaux

Avant de considérer l’article terminé, vérifie que :

- le chapô donne l’impact principal en quelques secondes ;
- le premier H2 parle de l’amortissement, pas du processus parlementaire ;
- le bloc `À retenir` ne commence pas par une non-information sur le statut du texte ;
- la mention `LMNP au réel uniquement` apparaît clairement mais pas comme première puce ;
- le micro-BIC et le régime réel ne sont jamais confondus ;
- l’avantage actuel du classement au micro-BIC est rappelé brièvement et correctement ;
- la statistique `près de 30 %` est correctement qualifiée comme donnée LMNP 2021, pas comme part des meublés de tourisme ;
- aucun H3 `classé / non classé` n’est créé pour le régime réel ;
- il n’y a pas de tableau inutile dans les sections `changement proposé` ou `qui est concerné` ;
- un exemple concret aide réellement à comprendre le plafonnement ;
- les règles sur les amortissements antérieurs et futurs sont distinguées ;
- le statut parlementaire arrive tard dans l’article ;
- l’historique parlementaire ne contient que les changements importants ;
- aucune mesure proposée n’est présentée comme déjà applicable si elle ne l’est pas ;
- aucune nuance juridique n’est sacrifiée pour rendre le texte plus accrocheur ;
- le texte ne donne pas envie de dormir.

---

# 16. Vérifications techniques finales

Après intégration :

1. Vérifie la route de l’article.
2. Vérifie son apparition sur `/actualites`.
3. Vérifie les métadonnées visibles :
   - catégorie ;
   - H1 ;
   - date ;
   - auteur ;
   - temps de lecture ;
   - date de mise à jour si différente.
4. Vérifie le sommaire si le seuil du composant est atteint.
5. Vérifie `KeyTakeaways`.
6. Vérifie `ArticleSources`.
7. Vérifie les articles associés.
8. Vérifie le lien vers l’article Micro-BIC existant.
9. Vérifie les données structurées.
10. Vérifie le sitemap et le prerender.
11. Vérifie qu’aucune route EN/NL n’a été créée par erreur.
12. Vérifie l’affichage à 390, 768, 1024 et 1440 px si le workflow du repo le permet.

Exécute au minimum les validations adaptées du projet, notamment :

```bash
npm run typecheck
npm run lint
npm run test:run
npm run build
npm run prerender
```

Si le repo utilise `npm run build:seo` comme validation globale de production, exécute-le également si pertinent.

---

# 17. Compte rendu attendu

Après modification, donne-moi :

1. la liste des fichiers modifiés ;
2. le titre, le slug et les métadonnées finales ;
3. le nombre de mots et le temps de lecture ;
4. la version exacte du PLF utilisée pour la rédaction ;
5. les éventuelles différences constatées par rapport au projet initial du 1er octobre 2026 ;
6. les sources officielles utilisées ;
7. les tests et validations exécutés ;
8. les éventuels points que tu n’as pas pu vérifier.

Ne me rends pas seulement un brouillon de l’article : **intègre-le réellement dans le site selon l’architecture existante**.
