# Prompt Claude — Article Actualités Etoilys

## Loi RIPOST : voyageur qui refuse de quitter un meublé de tourisme

Tu vas **créer et intégrer dans le site public Etoilys** un nouvel article de la rubrique **Actualités** consacré à la loi RIPOST et au cas d’un voyageur qui refuse de quitter un meublé de tourisme après la fin de sa réservation.

L’objectif n’est pas de produire une note juridique ni de me rendre seulement du texte : **tu dois rédiger l’article puis modifier proprement les fichiers du site nécessaires à sa publication**, en respectant strictement l’architecture et les composants existants.

---

# 1. Avant toute modification : inspecter le projet

Commence par lire et respecter les documents de référence présents dans le repo, en particulier :

- `Etoilys_guide_redaction_articles_actualites_v3.md`
- `contexte-projet-etoilys.md`
- la documentation actuelle sur la structure/refonte des articles Actualités, notamment `roadmap_refacto_structure_articles.md` si elle est présente ;
- les articles Actualités déjà publiés ;
- les composants partagés utilisés par ces articles.

Inspecte notamment avant d’implémenter :

- `src/pages/actualites/*`
- `src/content/actualitesArticles.ts`
- `src/content/articleStructuredData.ts`
- `src/content/seoRoutes.ts`
- `src/AppRoutes.tsx`
- les composants du shell d’article, notamment `ArticleLayout`
- le composant `KeyTakeaways`
- le composant de sources officielles
- le composant de tableau comparatif existant si un tableau est nécessaire
- le système actuel d’articles associés
- les tests de gouvernance des articles et des routes
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
- Aucun visuel dans le corps n’est nécessaire pour cet article. Ne crée pas une image générique juste pour illustrer le sujet.

---

# 2. Vérification juridique obligatoire AVANT rédaction

Le sujet est une **actualité très chaude**. La décision du Conseil constitutionnel date du **14 août 2026** et, au moment où ce brief a été préparé, la loi n’était pas encore considérée comme définitivement promulguée dans la rédaction éditoriale retenue.

**Avant de rédiger l’article, vérifie impérativement l’état du droit au moment exact où tu exécutes ce prompt.**

## 2.1 Vérifier la promulgation

Cherche en priorité sur :

1. **Légifrance / Journal officiel**
2. dossier législatif officiel
3. Conseil constitutionnel

Tu dois déterminer :

- si la loi RIPOST a été promulguée ;
- la date exacte de promulgation ;
- la date de publication au Journal officiel ;
- si les dispositions concernant les meublés de tourisme sont déjà entrées en vigueur ;
- la rédaction consolidée de l’article 38 après promulgation, si elle existe.

### Si la loi N’EST PAS encore promulguée

Conserve une rédaction prudente :

- `la loi RIPOST prévoit...`
- `le texte adopté permettrait...`
- `la réforme doit permettre...`

N’écris surtout pas :

- `la loi permet désormais...`
- `depuis le 14 août...`
- `un propriétaire peut désormais...`

Le contrôle du Conseil constitutionnel n’est pas, à lui seul, la promulgation.

### Si la loi EST promulguée

Mets l’article à jour en conséquence :

- utilise la date exacte de promulgation ;
- écris de façon affirmative si le texte est effectivement entré en vigueur ;
- remplace dans le titre et le chapô les formulations de type `prévoit` par `change` / `permet désormais` lorsque juridiquement justifié ;
- utilise comme source principale la **loi promulguée sur Légifrance** et la **version consolidée applicable de l’article 38** ;
- ne conserve pas une formulation au conditionnel si elle est devenue inutile.

## 2.2 Vérifier la version actuelle de Service-Public

Vérifie si la page officielle relative aux squatteurs / à l’évacuation administrative a été actualisée après la promulgation de RIPOST.

Si elle n’a pas été actualisée et continue d’indiquer qu’un voyageur restant après une location touristique n’entre pas dans le dispositif :

- ne la présente pas comme le mode d’emploi officiel de la nouvelle réforme ;
- tu peux éventuellement l’utiliser uniquement pour documenter le fonctionnement de la procédure antérieure ou les étapes déjà communes au mécanisme de l’article 38 ;
- pour le nouveau droit, donne priorité à Légifrance.

Ne masque jamais une contradiction entre une page Service-Public ancienne et un texte légal plus récent.

---

# 3. Sources officielles de départ

Utilise des **sources primaires ou institutionnelles uniquement** pour les affirmations juridiques sensibles.

## Sources prioritaires

### Conseil constitutionnel — décision n° 2026-915 DC du 14 août 2026

https://www.conseil-constitutionnel.fr/decision/2026/2026915DC.htm

Rôle :

- déterminer précisément ce qui a été validé ;
- déterminer précisément ce qui a été censuré ;
- sécuriser l’analyse du volet pénal.

### Conseil constitutionnel — communiqué relatif à la décision

https://www.conseil-constitutionnel.fr/actualites/communique/decision-n-2026-915-dc-du-14-aout-2026-communique-de-presse

Rôle :

- expliquer pédagogiquement le motif de la censure du volet pénal.

### Sénat — texte issu de la commission mixte paritaire

https://www.senat.fr/leg/pjl25-905.html

Rôle :

- identifier précisément ce que le Parlement avait adopté concernant :
  - l’évacuation administrative ;
  - les nouvelles incriminations pénales.

### Sénat — rapport sur la disposition relative aux meublés de tourisme

https://www.senat.fr/rap/l25-601/l25-6014.html

Rôle :

- expliquer la lacune du droit antérieur ;
- expliquer pourquoi le cas d’un voyageur entré légalement puis restant après la fin de son séjour était mal couvert.

### Légifrance — article 38 de la loi DALO

Utilise **la version consolidée la plus récente disponible au moment de la rédaction**.

Version connue avant promulgation RIPOST :
https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000042655744/

Rôle :

- documenter les étapes et délais de la procédure administrative ;
- vérifier précisément ce que signifient les délais de 72 h, 48 h, 24 h ou 7 jours ;
- éviter le raccourci trompeur `expulsion garantie en 72 heures`.

### Service-Public — squat / évacuation

https://www.service-public.fr/particuliers/vosdroits/F35254

Rôle :

- source pédagogique secondaire officielle ;
- à utiliser seulement après vérification de sa date de mise à jour et de sa compatibilité avec le nouveau texte.

### Annuaire officiel des préfectures

https://lannuaire.service-public.fr/navigation/prefecture

Rôle :

- fournir au lecteur un lien concret pour retrouver la préfecture du département où se situe le logement.

## Après promulgation

Ajoute obligatoirement parmi les premières sources :

- la loi RIPOST promulguée sur Légifrance ;
- la rédaction consolidée de l’article 38 applicable après cette loi.

Si une source ci-dessus devient obsolète ou moins précise qu’une nouvelle source officielle, privilégie la source la plus récente et la plus spécifique.

## Sources interdites comme fondement d’une affirmation sensible

N’utilise pas comme source principale :

- articles de presse ;
- blogs juridiques ;
- cabinets d’avocats ;
- contenus Airbnb ;
- forums ;
- contenus SEO ;
- résumés automatiques.

Ils peuvent éventuellement servir à identifier une confusion fréquente, mais jamais à trancher la règle.

---

# 4. Positionnement éditorial

## Type d’article

`Actualité chaude`

Longueur cible : **environ 900 à 1 300 mots**, sauf si une explication supplémentaire est réellement nécessaire.

Ne gonfle pas artificiellement l’article.

## Public

Propriétaires de meublés de tourisme, y compris des personnes qui ne connaissent rien au droit.

Pars du principe que le lecteur :

- loue sur Airbnb, Booking, Abritel ou en direct ;
- comprend parfaitement le problème pratique ;
- ne sait pas ce qu’est `l’article 38`, la `loi DALO`, une `incrimination pénale` ou une `mise en demeure préfectorale`.

**Explique d’abord ce que cela change dans la vraie vie. Donne ensuite le nom juridique si nécessaire.**

## Intention de recherche principale

> Que peut faire un propriétaire si un voyageur refuse de quitter son meublé de tourisme après la fin de sa réservation ?

Intentions secondaires naturelles :

- voyageur Airbnb refuse de partir ;
- locataire saisonnier refuse de quitter logement ;
- squat Airbnb ;
- loi RIPOST meublé de tourisme ;
- expulsion Airbnb 72 heures.

## Angle Etoilys

L’article doit répondre à cette logique :

> Votre voyageur devait partir, il reste dans le logement : pourquoi le droit était jusqu’ici mal adapté, ce que RIPOST doit changer concrètement, ce que le Conseil constitutionnel a réellement supprimé, combien de temps la procédure peut prendre, et quelles démarches engager.

Le droit doit servir à répondre au problème du propriétaire.

**Ne structure pas l’article comme un commentaire juridique de la décision du Conseil constitutionnel.**

---

# 5. Pertinence du classement

`NULLE`

Le classement des meublés de tourisme n’a aucun impact sur la possibilité d’engager cette procédure d’évacuation.

Conséquences :

- ne crée aucune section `Quel impact pour un meublé classé ?`;
- ne prétends pas qu’un meublé classé est mieux protégé ;
- ne fais pas de lien artificiel avec les étoiles ;
- ne place pas de CTA final `Demander mon classement` ;
- ne force pas de lien vers la page avantages du classement ou procédure de classement.

Le fait que le site Etoilys soit spécialisé dans le classement ne justifie pas d’inventer un lien métier qui n’existe pas.

---

# 6. Métadonnées

## Cas A — si la loi n’est pas encore promulguée

### H1

`Voyageur qui refuse de quitter votre meublé : ce que prévoit la loi RIPOST`

### Meta title

`Voyageur qui refuse de partir : ce que prévoit la loi RIPOST | Etoilys`

### Meta description

`La loi RIPOST prévoit une nouvelle procédure si un voyageur refuse de quitter un meublé après son séjour. Ce qui change, les délais et les démarches.`

## Cas B — si la loi est promulguée et applicable

### H1

`Voyageur qui refuse de quitter votre meublé : ce que change la loi RIPOST`

### Meta title

`Voyageur qui refuse de partir : ce que change la loi RIPOST | Etoilys`

### Meta description

`La loi RIPOST facilite l’évacuation d’un voyageur qui refuse de quitter un meublé après son séjour. Ce qui change, les délais et les démarches.`

## Métadonnées communes

### Slug

`voyageur-refuse-quitter-meuble-tourisme-loi-ripost`

Ne change pas le slug selon le statut de promulgation.

### Catégorie principale

`reglementation`

Libellé public :
`Réglementation`

### Auteur

Utilise **Florian Grisorio** conformément au système actuel des articles Etoilys.

### Published date

Si l’article est intégré aujourd’hui :
`2026-08-16`

Si l’exécution a lieu un autre jour avant publication effective, utilise la vraie date de publication.

### Updated date

Identique à la date de publication pour la première mise en ligne.

### Type de contenu

Utilise le type actuellement prévu par le repo pour les articles (`blog-posting` / Article selon l’architecture existante).

### Tags, uniquement si le système actuel les utilise

Suggestions :

- `loi RIPOST`
- `meublé de tourisme`
- `location saisonnière`
- `Airbnb`
- `réglementation`
- `évacuation`

Ne crée pas un nouveau système de tags si le repo n’en utilise pas.

### Temps de lecture

Calcule-le selon la convention actuelle du projet et le nombre réel de mots de l’article.

---

# 7. Chapô — direction rédactionnelle obligatoire

Le chapô doit faire **2 à 4 phrases**.

Il doit commencer par cette idée concrète :

> `Un voyageur termine sa réservation mais refuse de quitter le logement : ...`

Ensuite, il doit expliquer **immédiatement ce que RIPOST change ou prévoit de changer pour le propriétaire**, puis résumer en une phrase la décision du Conseil constitutionnel.

## Si la loi n’est pas encore promulguée

La logique attendue est proche de :

> Un voyageur termine sa réservation mais refuse de quitter le logement : jusqu’ici, la procédure administrative rapide utilisée contre certaines occupations illégales était mal adaptée, car le voyageur était entré légalement dans les lieux. La loi RIPOST prévoit de permettre au propriétaire de saisir le préfet pour demander l’évacuation du logement, sans devoir commencer par une procédure judiciaire classique. Le Conseil constitutionnel a maintenu cette possibilité le 14 août 2026, tout en censurant les nouvelles sanctions pénales prévues en parallèle.

Tu peux améliorer la fluidité, mais **ne dégrade pas la clarté pratique**.

## Si la loi est promulguée

Actualise les temps et les formulations :

- `permet désormais` seulement si c’est juridiquement exact ;
- ajoute la date de promulgation si cela aide ;
- n’écris plus `la loi prévoit de permettre` si le dispositif est effectivement applicable.

## À éviter dans le chapô

N’utilise pas :

- `article 38`
- `loi DALO`
- `incrimination pénale`
- `occupation sans droit ni titre`

Le lecteur n’a pas besoin de ce jargon pour comprendre la réponse principale.

---

# 8. Bloc « À retenir »

Utilise le composant partagé `KeyTakeaways`.

Choisis la variante existante la plus cohérente, probablement `bullets`.

Maximum : **5 items**.

Chaque item doit être compris immédiatement par quelqu’un qui n’a aucune culture juridique.

## Contenu attendu

### Point 1

Si un voyageur refuse de partir à la fin de sa réservation, RIPOST ouvre / prévoit d’ouvrir la possibilité de demander au préfet son évacuation, alors que la procédure était jusqu’ici mal adaptée à ce cas.

### Point 2

Le Conseil constitutionnel **n’a pas supprimé cette nouvelle possibilité**. Il a censuré les nouvelles sanctions pénales prévues en parallèle.

### Point 3

Le propriétaire ne pourra pas expulser lui-même le voyageur : il faudra engager une procédure officielle et fournir les éléments nécessaires.

Formule les étapes de façon compréhensible :

- plainte ;
- preuves ;
- constat de l’occupation ;
- demande au préfet.

N’écris pas ici une liste juridique exhaustive.

### Point 4

`Expulsion en 72 heures` est une formule trompeuse : les 72 heures correspondent à une étape particulière de la procédure, pas au délai garanti pour récupérer le logement.

### Point 5 — uniquement si la loi n’est pas encore promulguée

Signale clairement :

- que le texte n’est pas encore promulgué au jour de publication ;
- que l’article sera mis à jour une fois le texte définitif publié.

Si la loi est promulguée, remplace cette puce par une information réellement utile, ou garde seulement 4 puces.

---

# 9. Structure détaillée de l’article

Utilise **5 H2 maximum**, conformément à la ligne éditoriale Etoilys.

---

## H2 1 — `Pourquoi cette situation posait problème jusqu’ici`

### Objectif

Faire comprendre la lacune du droit à partir d’un cas réel.

### Ouverture recommandée

Pars d’un exemple simple :

> Vous louez votre maison du samedi au samedi. La réservation se termine à 10 h, mais le voyageur refuse de rendre les clés et annonce qu’il reste dans le logement.

Puis explique :

- contrairement à quelqu’un qui entre par effraction, ce voyageur avait le droit d’entrer dans le logement au début du séjour ;
- c’est précisément ce qui rendait la procédure administrative existante mal adaptée ;
- le rapport du Sénat identifie cette difficulté.

### Terme `squatteur`

Tu peux expliquer sobrement que, dans le langage courant, le propriétaire parlera probablement de `squat`.

Mais ne présente pas automatiquement le voyageur comme un `squatteur` au sens juridique.

Formulation possible :

> Dans le langage courant, la situation ressemble évidemment à un squat. Juridiquement, la différence est importante : le voyageur était entré dans le logement avec votre autorisation.

Évite d’en faire une digression.

### Objectif de fin de section

Le lecteur doit comprendre :

> `Le problème n’était pas que le propriétaire n’avait aucun droit. Le problème était que la procédure rapide existante avait été conçue pour d’autres formes d’occupation illégale.`

---

## H2 2 — `Ce que la loi RIPOST prévoit de changer`

Si la loi est promulguée, adapte le titre en :

`Ce que la loi RIPOST change pour les propriétaires`

### Message principal

Explique d’abord en une phrase :

> RIPOST étend la procédure administrative au cas d’un voyageur entré légalement dans un meublé mais qui refuse de partir après la fin de son contrat.

Ensuite, transforme le mécanisme en étapes humaines.

Logique attendue :

1. le séjour est terminé ;
2. le voyageur reste malgré la fin de son droit d’occuper le logement ;
3. le propriétaire réunit les preuves et engage les démarches prévues ;
4. il demande au préfet d’ordonner le départ de l’occupant ;
5. si la mise en demeure n’est pas respectée et si les conditions sont réunies, la procédure peut aller jusqu’à l’évacuation forcée.

### Introduire `article 38` seulement ici

Une fois le mécanisme compris, tu peux écrire quelque chose comme :

> Juridiquement, cette procédure est prévue par l’article 38 de la loi DALO. Le nom importe peu pour le propriétaire : son intérêt est de permettre une intervention administrative sous l’autorité du préfet, plutôt que de devoir commencer par une procédure judiciaire classique.

Vérifie juridiquement la formulation exacte après promulgation.

### Garde-fou

Ne laisse jamais entendre que :

- le propriétaire peut expulser lui-même l’occupant ;
- un simple appel à la préfecture suffit ;
- toute demande débouche automatiquement sur une évacuation ;
- la procédure est instantanée.

---

## H2 3 — `Ce que le Conseil constitutionnel a changé le 14 août`

### Première phrase

Commence par l’information utile :

> `Pour un propriétaire qui cherche surtout à récupérer son logement, le principal dispositif de la réforme a été conservé.`

### Tableau comparatif

Utilise le composant de tableau responsive déjà présent dans le projet s’il convient.

Ne crée pas un nouveau composant.

Le tableau doit distinguer très simplement :

| Ce que prévoyait la loi RIPOST                                                                         | Après la décision du 14 août |
| ------------------------------------------------------------------------------------------------------ | ---------------------------- |
| Permettre de demander au préfet l’évacuation d’un voyageur qui refuse de partir après la fin du séjour | **Conservé**                 |
| Ajouter de nouvelles sanctions pénales spécifiques                                                     | **Censuré**                  |

Vérifie le wording exact à partir de la décision et du texte adopté.

### Explication de la censure

Maximum : 1 court paragraphe.

Explique en langage simple :

- le problème n’était pas le principe de protéger le propriétaire ;
- le volet pénal faisait relever les mêmes faits de deux infractions pouvant entraîner des peines différentes ;
- c’est cette construction que le Conseil constitutionnel a censurée.

Évite un développement sur :

- le principe d’égalité devant la loi pénale ;
- la jurisprudence constitutionnelle ;
- la technique des réserves d’interprétation.

Une phrase suffit si le lecteur a compris.

### Fin de section

Termine sur l’impact propriétaire, avec une idée de ce type :

> `Pour récupérer votre logement, l’essentiel de la réforme a donc survécu au contrôle du Conseil constitutionnel.`

Si l’état juridique a évolué au moment de la rédaction, ajuste précisément cette phrase.

---

## H2 4 — `Peut-on vraiment récupérer son logement en 72 heures ?`

### Réponse immédiate

Commence clairement :

> `Non : la loi ne garantit pas que le voyageur sera dehors 72 heures après votre demande.`

### Expliquer les 72 heures en français simple

Vérifie la rédaction actuelle de l’article 38.

L’idée à expliquer est la suivante, **si elle est toujours exacte dans la version applicable** :

> Le délai de 72 heures concerne un cas particulier où le propriétaire ne peut pas fournir certains justificatifs sur son droit sur le logement ; le préfet sollicite alors l’administration fiscale pour obtenir l’information. Ces 72 heures ne correspondent pas à la durée totale de l’évacuation.

Évite la formulation abstraite :

> `si le propriétaire ne peut pas prouver son droit à cause de l’occupation`

Préférer quelque chose du type :

> `si l’occupation l’empêche de récupérer ou de fournir les justificatifs nécessaires pour établir son droit sur le logement`

Mais vérifie le texte exact avant de choisir le wording final.

### Expliquer les autres délais

À partir de la version consolidée applicable, explique clairement les différentes étapes et délais éventuels :

- délai de décision du préfet ;
- délai laissé à l’occupant dans la mise en demeure ;
- éventuelle distinction domicile / autre logement ;
- évacuation forcée après expiration du délai si les conditions sont réunies.

Ne cite des chiffres que s’ils figurent bien dans le texte applicable au jour de rédaction.

### Conclusion de section

L’idée à transmettre est :

> `La procédure peut être beaucoup plus rapide qu’une procédure judiciaire classique, mais personne ne peut sérieusement promettre au propriétaire de récupérer ses clés sous 72 heures.`

Évite le clickbait inverse : ne dramatise pas non plus la durée si la procédure est effectivement conçue pour être rapide.

---

## H2 5 — `Que faire si un voyageur refuse de quitter votre meublé ?`

C’est la section la plus opérationnelle de l’article.

Présente-la sous forme de **checklist / étapes courtes**, en réutilisant les composants ou styles existants du site.

Ne crée pas un stepper métier spécifique.

### Étape 1 — Garder toutes les preuves de la réservation

Mentionner notamment :

- contrat ou confirmation de réservation ;
- plateforme utilisée ;
- dates et heures prévues du séjour ;
- identité du voyageur ;
- échanges utiles.

Objectif :
prouver que le séjour est terminé et que le voyageur n’a plus de droit à rester dans le logement.

### Étape 2 — Demander clairement au voyageur de quitter les lieux

Recommander de conserver une trace écrite de cette demande.

Ne rédige pas une mise en demeure juridique maison.

### Étape 3 — Déposer plainte

Vérifie que cette étape reste bien exigée dans la version applicable de la procédure après RIPOST.

Si oui :

- explique-le clairement ;
- si Service-Public fournit un lien officiel pertinent vers les démarches ou vers les commissariats/gendarmeries, utilise-le ;
- sinon ne crée pas de faux parcours.

### Étape 4 — Faire constater que le voyageur occupe toujours le logement

Vérifie exactement qui peut effectuer ce constat dans le texte applicable.

Si les acteurs restent :

- officier de police judiciaire ;
- maire ;
- commissaire de justice ;

indique-les simplement.

Si un annuaire officiel des commissaires de justice ou un autre lien institutionnel pertinent est disponible, tu peux le lier.

### Étape 5 — Préparer la preuve du droit sur le logement

Expliquer en une phrase qu’il faut pouvoir établir que le demandeur est bien propriétaire / titulaire du droit concerné.

Ne transforme pas ce passage en inventaire notarial.

### Étape 6 — Adresser la demande au préfet du département

C’est ici qu’il faut intégrer un lien actionnable vers :

**Annuaire officiel des préfectures**
https://lannuaire.service-public.fr/navigation/prefecture

Si une procédure officielle nationale plus précise, un formulaire ou un téléservice ont été créés depuis RIPOST, utilise-les à la place ou en complément.

**N’invente surtout pas de formulaire national s’il n’existe pas.**

### Étape 7 — Ne pas tenter d’expulser soi-même le voyageur

Rester sobre.

Dire au propriétaire de ne pas :

- changer les serrures pour mettre l’occupant dehors ;
- supprimer arbitrairement l’accès aux équipements ;
- prendre des mesures de contrainte de sa propre initiative.

Ne détaille pas les tactiques illégales.

En cas de situation complexe ou contestée, recommander de contacter un **commissaire de justice** ou un **professionnel du droit**.

### Liens dans cette section

Priorité absolue aux liens officiels réellement utiles :

- préfecture ;
- commissariat / gendarmerie si une page officielle adaptée existe ;
- annuaire des commissaires de justice si pertinent ;
- téléservice ou formulaire uniquement s’il existe réellement.

S’il n’existe pas de lien précis pour une étape, **n’en invente pas et ne colle pas un lien générique pour faire joli**.

---

# 10. Conclusion

La conclusion doit être courte, claire et orientée action.

Ne résume pas une nouvelle fois la décision du Conseil constitutionnel dans un langage juridique.

L’idée attendue est proche de :

> Si un voyageur refuse de partir à la fin de son séjour, RIPOST doit surtout donner au propriétaire une nouvelle porte de sortie : demander au préfet d’engager une procédure d’évacuation, alors que ce recours était jusqu’ici mal adapté à cette situation.

Puis :

> Le Conseil constitutionnel n’a pas remis en cause ce mécanisme. En revanche, la procédure ne devient pas automatique : il faut conserver les preuves, déposer plainte si le texte l’exige, faire constater l’occupation et saisir officiellement la préfecture.

Puis une dernière phrase réellement actionnable :

> Si cela vous arrive, votre premier réflexe doit donc être de conserver toutes les preuves de la réservation et du refus de partir, puis d’engager rapidement les démarches officielles plutôt que de tenter de récupérer le logement par vos propres moyens.

Si la loi est promulguée au moment de rédaction, adapte `doit donner` en formulation affirmative si juridiquement exact.

Pas de paragraphe final philosophique sur le droit de propriété, le Conseil constitutionnel ou l’équilibre des libertés.

---

# 11. Liens internes Etoilys

Le classement n’étant pas pertinent ici, garde un maillage interne sobre.

## Lien éditorial principal

Intègre naturellement un lien vers l’article :

**Meublés de tourisme : ce qui change vraiment en 2025-2026 pour les propriétaires**

URL actuelle attendue :
`/actualites/meubles-de-tourisme-ce-qui-change-vraiment-en-2025-2026`

Vérifie le slug réel dans le repo avant utilisation.

Ce lien peut apparaître dans une courte phrase de contexte sur les autres évolutions réglementaires du secteur.

## Articles associés

Utilise le système actuel d’articles associés.

Sélectionne, si ces articles existent toujours dans le repo, les contenus les plus cohérents autour de la réglementation de l’exploitation des meublés, par exemple :

- `Meublés de tourisme : ce qui change vraiment en 2025-2026 pour les propriétaires`
- l’article sur l’API Meublés / déclaration nationale ;
- l’article sur les données transmises par Airbnb, Booking, Abritel aux communes, s’il existe sous ce titre ou un titre équivalent.

Inspecte `actualitesArticles.ts` et utilise les vrais slugs / identifiants.

Ne crée pas un lien vers un article inexistant.

---

# 12. CTA final

Ne renvoie pas vers `Demander un classement`.

Le CTA doit prolonger logiquement l’article vers une ressource réglementaire plus large.

Direction recommandée :

### Titre

`Vous voulez faire le point sur les règles qui changent pour les meublés de tourisme ?`

### Texte

Une phrase courte expliquant que fiscalité, DPE, copropriété, enregistrement et durée de location ont également évolué.

### Bouton

`Voir ce qui change pour les meublés de tourisme`

### Destination

L’article :
`/actualites/meubles-de-tourisme-ce-qui-change-vraiment-en-2025-2026`

Adapte le wording au composant CTA existant sans le réinventer.

---

# 13. Sources officielles visibles dans l’article

Utilise le composant partagé de sources.

L’ordre recommandé est :

1. loi RIPOST promulguée sur Légifrance **si elle existe au moment de l’exécution** ;
2. Conseil constitutionnel — décision n° 2026-915 DC du 14 août 2026 ;
3. version consolidée de l’article 38 applicable après la réforme ;
4. Conseil constitutionnel — communiqué du 14 août 2026 ;
5. Sénat — texte adopté / CMP ;
6. Sénat — rapport expliquant la lacune du droit antérieur ;
7. Service-Public uniquement si la page est pertinente et suffisamment à jour ;
8. annuaire officiel des préfectures si utilisé dans la partie pratique.

Ne surcharge pas la liste avec plusieurs pages redondantes.

Pour chaque source, respecte le format déjà utilisé par le composant `ArticleSources`.

---

# 14. Garde-fous rédactionnels

## À faire

- écrire en français naturel ;
- utiliser `vous` ;
- faire des phrases plutôt courtes ;
- expliquer avant de nommer le mécanisme juridique ;
- revenir systématiquement à l’impact pour le propriétaire ;
- dater les changements ;
- être affirmatif quand le texte le permet ;
- signaler clairement ce qui n’est pas encore entré en vigueur ;
- employer `Concrètement`, `En pratique`, `Le point important` lorsque cela aide réellement ;
- distinguer le droit actuel du droit qui résultera de la promulgation si elle n’a pas encore eu lieu.

## À éviter absolument

- commencer par une dissertation sur le Parlement ou le Conseil constitutionnel ;
- parler d’`article 38` avant d’avoir expliqué à quoi il sert ;
- écrire `loi DALO` sans explication ;
- écrire `occupation sans droit ni titre` si une phrase simple suffit ;
- répéter `Conseil constitutionnel` dans chaque section ;
- annoncer `expulsion en 72 heures` ;
- dire que les 72 h correspondent au délai total ;
- dire que la procédure garantit l’évacuation ;
- appeler systématiquement le voyageur `squatteur` comme si c’était une qualification juridique évidente ;
- laisser entendre qu’un propriétaire peut changer les serrures ou sortir lui-même l’occupant ;
- inventer un lien avec le classement ;
- ajouter du SEO artificiel ;
- répéter `Airbnb` toutes les trois phrases ;
- inventer un formulaire ou une démarche officielle ;
- utiliser une page Service-Public obsolète pour contredire un texte légal plus récent.

---

# 15. Valeur SEO

L’article doit rester écrit pour le propriétaire, pas pour Google.

Intègre naturellement, sans bourrage :

- voyageur qui refuse de quitter un meublé ;
- voyageur Airbnb qui refuse de partir ;
- location saisonnière ;
- meublé de tourisme ;
- loi RIPOST ;
- évacuation ;
- préfet / préfecture ;
- 72 heures.

Ne crée pas une FAQ uniquement pour caser des mots-clés si elle n’apporte pas d’information supplémentaire.

---

# 16. Implémentation dans le repo

Après rédaction, intègre réellement l’article.

Adapte-toi à l’architecture réelle observée, mais vérifie au minimum les points suivants.

## Page article

- créer la page dans `src/pages/actualites` selon le pattern actuel ;
- utiliser `ArticleLayout` ;
- fournir le chapô via le slot / prop prévu ;
- fournir `KeyTakeaways` via l’API actuelle ;
- fournir le contenu principal selon le pattern des articles existants ;
- fournir le CTA dans le slot actuel ;
- fournir les sources via le composant partagé ;
- fournir les articles associés via le système partagé ;
- laisser le bloc auteur au shell partagé.

## Métadonnées de liste

Ajouter l’article à la source centrale utilisée par `/actualites`, actuellement attendue dans :

`src/content/actualitesArticles.ts`

Renseigner les champs réellement requis par le type existant :

- slug / path ;
- title ;
- excerpt ;
- publishedAt ;
- updatedAt ;
- author ;
- category ;
- readingTimeMinutes ;
- éventuel `imageKey` seulement si nécessaire.

Ne crée pas d’image si le système autorise les articles sans image.

## Routing

Ajouter la route selon les conventions de `src/AppRoutes.tsx`.

## SEO

Ajouter l’entrée correspondante dans le système central de `src/content/seoRoutes.ts`.

Vérifier :

- canonical auto-référente ;
- title ;
- description ;
- indexabilité ;
- sitemap ;
- prerender.

## Données structurées

Ajouter / brancher les données nécessaires dans `src/content/articleStructuredData.ts` selon le modèle existant.

Les métadonnées visibles et structurées doivent rester cohérentes :

- titre ;
- auteur ;
- date de publication ;
- date de mise à jour ;
- URL.

## Articles associés

Utilise uniquement des articles réellement présents.

## Sitemap

Régénère le sitemap avec la commande prévue par le repo si nécessaire.

## Prerender

Vérifie que la nouvelle route est prerenderée correctement.

---

# 17. Contrôles factuels obligatoires avant de finaliser

Avant de considérer l’article terminé, relis chaque affirmation sensible.

Vérifie explicitement :

- [ ] la loi est-elle promulguée ?
- [ ] si oui, quelle est sa date de promulgation ?
- [ ] la disposition concernant les meublés est-elle déjà en vigueur ?
- [ ] la version consolidée de l’article 38 a-t-elle changé ?
- [ ] la procédure couvre-t-elle bien le maintien après expiration du contrat d’un meublé de tourisme ?
- [ ] le Conseil constitutionnel a-t-il conservé ce volet ?
- [ ] quel volet pénal exact a été censuré ?
- [ ] le motif de censure est-il correctement résumé ?
- [ ] la plainte reste-t-elle obligatoire dans la nouvelle procédure ?
- [ ] qui doit constater l’occupation ?
- [ ] quels justificatifs sont nécessaires ?
- [ ] à qui adresse-t-on la demande ?
- [ ] les délais de 72 h / 48 h / 24 h / 7 jours sont-ils toujours ceux du texte applicable ?
- [ ] que signifie précisément le délai de 72 heures ?
- [ ] Service-Public a-t-il été mis à jour ?
- [ ] existe-t-il désormais un formulaire ou téléservice officiel ?
- [ ] les liens vers la préfecture / commissaire de justice / plainte sont-ils réellement pertinents ?

Si un élément n’est pas sécurisé par une source officielle :

- ne l’invente pas ;
- simplifie le passage ;
- signale-le dans ton compte rendu final.

---

# 18. Tests et vérifications techniques

Après intégration, exécute les contrôles adaptés au repo.

Au minimum :

```bash
npm run typecheck
npm run lint
npm run test:run
npm run build
npm run prerender
```

Et si nécessaire :

```bash
npm run seo:sitemap
```

ou la commande SEO équivalente actuellement prévue par le projet.

Vérifie également :

- un seul H1 ;
- ordre du shell conforme ;
- catégorie `Réglementation` ;
- pas de deuxième bloc auteur manuel ;
- pas de SEO injecté localement ;
- pas d’overflow causé par le tableau ou les URLs longues ;
- liens externes fonctionnels ;
- liens internes existants ;
- route présente dans le sitemap ;
- route correctement prerenderée ;
- données structurées cohérentes ;
- aucun changement involontaire sur les autres articles.

Si les tests font apparaître un warning préexistant sans rapport avec ton changement, ne le corrige pas hors périmètre ; signale-le simplement.

---

# 19. Résultat attendu

Ne me rends pas seulement le texte de l’article.

**Modifie réellement le site.**

À la fin, donne-moi :

1. **le statut juridique vérifié avant rédaction**
   - loi promulguée ou non ;
   - date et source officielle ;
   - version de l’article 38 utilisée ;

2. **la liste exacte des fichiers modifiés** ;

3. **le titre final et l’URL finale de l’article** ;

4. **un résumé des choix éditoriaux appliqués** ;

5. **la liste des sources officielles effectivement utilisées** ;

6. **les liens pratiques intégrés dans la section “Que faire ?”** ;

7. **les tests et commandes exécutés avec leur résultat** ;

8. **les éventuels points restant incertains ou à mettre à jour après promulgation**, s’il en reste.

Ne demande pas de validation intermédiaire si les informations nécessaires sont accessibles dans le repo et dans les sources officielles. Fais les vérifications, rédige, intègre et teste.
