# Prompt Codex — Création de la page Lot-et-Garonne Etoilys

Tu travailles sur le site public Etoilys.

Ta mission est de créer et intégrer une nouvelle landing page locale SEO pour le Lot-et-Garonne.

## Page à créer

Route :

`/classement-meuble-tourisme-lot-et-garonne`

H1 :

`Classement de meublé de tourisme dans le Lot-et-Garonne`

Meta title :

`Classement meublé de tourisme Lot-et-Garonne | Etoilys`

Meta description :

`Etoilys accompagne les propriétaires de gîtes, locations saisonnières et meublés de tourisme dans le Lot-et-Garonne pour leur classement officiel.`

URL finale attendue :

`https://www.etoilys.fr/classement-meuble-tourisme-lot-et-garonne`

---

## Contexte important

Une page départementale Dordogne existe déjà :

`/classement-meuble-tourisme-dordogne`

Tu dois reprendre la même structure, la même architecture, le même rythme de page, les mêmes composants et la même logique UX que cette page Dordogne.

Il ne faut pas réinventer la roue.

La page Lot-et-Garonne doit être créée à partir de la page Dordogne comme modèle, mais sans faire un simple copier-coller générique.

La bonne approche est la suivante :

- conserver la structure globale ;
- conserver les blocs fixes Etoilys ;
- conserver la logique de conversion ;
- conserver les CTA ;
- conserver les explications nationales courtes sur le classement ;
- remplacer uniquement les contenus spécifiques au département.

Les contenus à adapter sont notamment :

- le nom du département ;
- l’introduction locale ;
- les chiffres touristiques locaux ;
- les villes et secteurs couverts ;
- les exemples de logements ;
- les points de vigilance locaux ;
- la FAQ locale ;
- les sources locales ;
- les métadonnées SEO.

Le contenu fixe Etoilys peut rester similaire :

- classement officiel de 1 à 5 étoiles ;
- classement valable 5 ans ;
- visite sur place ;
- procédure nationale ;
- demande en ligne ;
- lien vers la procédure ;
- lien vers les simulateurs ;
- lien vers la FAQ ;
- CTA vers la demande de classement ;
- absence de tarif public affiché.

---

## Architecture technique du site à respecter

Le projet utilise :

- React 19 ;
- TypeScript strict ;
- Vite ;
- React Router ;
- Tailwind CSS ;
- SEO centralisé dans `src/content/seoRoutes.ts` ;
- routes déclarées dans `src/AppRoutes.tsx` ;
- layout global dans `src/components/layout/Layout.tsx`.

Règles impératives :

- Ne pas injecter le SEO directement dans la page.
- Ajouter la route dans `src/AppRoutes.tsx`.
- Ajouter les métadonnées SEO dans `src/content/seoRoutes.ts`.
- S’assurer que la route est indexable.
- Utiliser le domaine canonique unique : `https://www.etoilys.fr`.
- Ne pas ajouter de `meta keywords`.
- Ne pas injecter manuellement de JSON-LD si le projet centralise déjà les données structurées.
- Réutiliser les composants existants dès que possible.
- Reprendre l’architecture technique de la page Dordogne.
- Ne pas casser la page Dordogne existante.
- Ne pas faire de refactor large inutile.

Si un composant partagé existe déjà pour les pages locales, l’utiliser ou l’étendre proprement.

Si la page Dordogne est hardcodée, créer la page Lot-et-Garonne en conservant une approche simple et sûre. Ne pas lancer une refonte structurelle si elle n’est pas nécessaire.

---

## Liens internes à intégrer naturellement

Utiliser les routes existantes suivantes :

- `/zone-intervention`
- `/classement`
- `/les-avantages-du-classement`
- `/procedure`
- `/faq`
- `/simulateur`
- `/simulateur-taxe-sejour`
- `/simulateur-fiscal-classement`
- `/demande-classement`

La page Lot-et-Garonne doit faire un lien vers `/zone-intervention`.

La page `/zone-intervention` doit aussi faire un lien vers la nouvelle page Lot-et-Garonne si ce n’est pas déjà le cas.

Si la page Dordogne contient des liens vers les autres départements, ajouter la page Lot-et-Garonne dans cette logique.

---

## Positionnement éditorial

Cette page est une landing page locale de service.

Ce n’est pas un article Actualités.

Ton attendu :

- clair ;
- professionnel ;
- direct ;
- rassurant ;
- utile pour les propriétaires ;
- commercial sans être agressif ;
- localisé sans faire office de guide touristique.

Public cible :

- propriétaires de meublés de tourisme ;
- propriétaires de gîtes ;
- propriétaires de locations saisonnières ;
- hôtes Airbnb, Booking, Abritel ;
- propriétaires de résidences secondaires ;
- futurs loueurs préparant une mise en location.

Ne pas écrire :

- `boostez vos revenus` ;
- `maximisez vos réservations` ;
- `augmentez automatiquement votre taux d’occupation` ;
- toute promesse de hausse de revenu ;
- toute promesse de hausse de réservation ;
- tout conseil fiscal personnalisé ;
- tout contenu générique de type office de tourisme.

La page doit rester factuelle, utile et orientée action.

---

## Tarif

Ne pas afficher de tarif fixe.

Ne pas écrire :

- `à partir de X €` ;
- `visite à X €` ;
- `devis gratuit`, sauf si cette formulation existe déjà ailleurs et est validée.

Utiliser plutôt une formulation de ce type :

> Après réception de votre demande, Etoilys vous confirme les modalités d’intervention et le tarif applicable avant toute validation.

---

## Sources locales à utiliser

### 1. Mémento du Tourisme en Lot-et-Garonne — édition 2025

URL :

`https://pro.tourisme-lotetgaronne.com/wp-content/uploads/2025/06/TourismeLotetGaronne_ChiffresCles2025.pdf`

Données à utiliser :

- 1 210 meublés en 2025 ;
- 7 325 lits en meublés en 2025 ;
- 51,9 % des meublés sont classés ;
- 44,4 % des meublés sont labellisés ;
- +10,2 % de nuits réservées en 2024 par rapport à 2023 ;
- taux d’occupation : 28 % ;
- durée moyenne de séjour : 3,62 jours.

Le PDF mentionne notamment Lighthouse et SIRTAQUI, données mars 2025.

Utiliser ces chiffres dans une section “chiffres clés locaux”.

Ne pas utiliser tous les chiffres si cela alourdit la page. Sélectionner 3 à 5 chiffres maximum dans le bloc principal.

Formulation recommandée :

> Selon le Mémento du Tourisme en Lot-et-Garonne 2025, le département compte 1 210 meublés pour 7 325 lits. Le document indique aussi que 51,9 % des meublés sont classés et que les nuits réservées ont progressé de 10,2 % en 2024 par rapport à 2023.

Ne pas dire que ces chiffres prouvent que le classement augmente les revenus ou les réservations. Ils montrent seulement que les meublés touristiques occupent une vraie place dans l’offre locale.

### 2. ADRT Lot-et-Garonne — Classement des meublés de tourisme

URL :

`https://pro.tourisme-lotetgaronne.com/accompagnement/classement-2/classement-des-meubles-de-tourisme/`

Points utiles à reprendre :

- le logement doit faire l’objet d’une visite de contrôle ;
- la visite se fait sur rendez-vous ;
- la visite est réalisée par un organisme agréé ou accrédité ;
- le meublé doit être déclaré en mairie ;
- le classement est volontaire ;
- la page rappelle l’écart fiscal entre meublé classé et non classé.

Ne pas laisser croire qu’Etoilys est l’ADRT ou dépend de l’ADRT.

### 3. Sources nationales existantes

Réutiliser les sources nationales déjà utilisées dans le site pour les règles fixes :

- Atout France — classement des meublés de tourisme ;
- Service-Public ;
- Légifrance / Code du tourisme ;
- economie.gouv.fr / impots.gouv.fr pour le micro-BIC ;
- Service-Public Entreprendre pour la taxe de séjour.

Ces sources servent uniquement aux règles nationales. La page locale ne doit pas devenir un article juridique.

---

## Villes et secteurs à mentionner

Mentionner qu’Etoilys intervient dans le Lot-et-Garonne, notamment autour de :

- Agen ;
- Villeneuve-sur-Lot ;
- Marmande ;
- Nérac ;
- Casteljaloux ;
- Fumel ;
- Tonneins ;
- Sainte-Livrade-sur-Lot ;
- Le Passage ;
- Aiguillon ;
- Mézin ;
- Monflanquin ;
- Penne-d’Agenais ;
- Pujols ;
- Clairac ;
- Duras.

Utiliser une formulation souple :

> Etoilys intervient dans le Lot-et-Garonne, notamment autour de…

Ne pas garantir explicitement une intervention dans chaque petite commune si le site ne le garantit pas déjà.

Ajouter une phrase du type :

> Vous pouvez déposer une demande même si votre commune n’apparaît pas dans cette liste : Etoilys vous confirmera les modalités d’intervention après réception de votre demande.

---

## Structure recommandée de la page

Reprendre la structure de la page Dordogne.

### 1. Hero

H1 :

`Classement de meublé de tourisme dans le Lot-et-Garonne`

Texte d’introduction recommandé :

> Vous louez un gîte, une maison de vacances ou un meublé de tourisme dans le Lot-et-Garonne ? Etoilys vous accompagne pour organiser la visite de classement officielle de votre logement, notamment autour d’Agen, Villeneuve-sur-Lot, Marmande, Nérac ou Casteljaloux.

CTA principal :

`Demander mon classement`

CTA secondaire :

`Comprendre la procédure`

Mentions courtes possibles :

- Classement officiel de 1 à 5 étoiles ;
- Visite sur place ;
- Classement valable 5 ans.

Ne pas afficher de tarif.

---

### 2. Contexte local

Titre recommandé :

`Pourquoi faire classer un meublé de tourisme dans le Lot-et-Garonne ?`

Angle éditorial :

Le Lot-et-Garonne est un territoire de gîtes, maisons de vacances, hébergements familiaux, séjours nature et tourisme diffus. Le classement permet de donner un cadre officiel au logement et de rendre l’offre plus lisible pour les voyageurs.

Éviter les clichés touristiques. Ne pas écrire une brochure de destination.

---

### 3. Chiffres clés locaux

Titre recommandé :

`Un territoire où les meublés touristiques occupent une vraie place`

Créer 3 à 5 cartes chiffres.

Chiffres recommandés :

- `1 210 meublés`
- `7 325 lits`
- `51,9 % de meublés classés`
- `+10,2 % de nuits réservées en 2024`
- `3,62 jours de séjour moyen`

Ajouter une note source courte :

> Source : Mémento du Tourisme en Lot-et-Garonne 2025, Tourisme Lot-et-Garonne / SIRTAQUI / Lighthouse.

Ne pas surcharger la page avec tous les chiffres disponibles.

---

### 4. Zone d’intervention

Titre recommandé :

`Etoilys intervient dans le Lot-et-Garonne et les secteurs proches`

Mentionner les secteurs :

- Agen ;
- Villeneuve-sur-Lot ;
- Marmande ;
- Nérac ;
- Casteljaloux ;
- Fumel ;
- Tonneins ;
- Sainte-Livrade-sur-Lot ;
- Aiguillon ;
- Monflanquin ;
- Penne-d’Agenais ;
- Pujols ;
- Duras.

Texte recommandé :

> Vous pouvez déposer une demande même si votre commune n’apparaît pas dans cette liste : Etoilys vous confirmera les modalités d’intervention après réception de votre demande.

CTA vers `/demande-classement`.

---

### 5. Ce que le classement peut changer

Titre recommandé :

`Ce que le classement peut changer pour un propriétaire`

Contenu à garder proche de la page Dordogne, en version adaptée :

- repère officiel de 1 à 5 étoiles ;
- validité de 5 ans ;
- présentation plus lisible du logement ;
- possible intérêt au micro-BIC selon la situation fiscale ;
- effet sur la logique de taxe de séjour ;
- possibilité de renvoyer vers les simulateurs Etoilys.

Liens à intégrer :

- `/les-avantages-du-classement`
- `/simulateur-fiscal-classement`
- `/simulateur-taxe-sejour`

Ne pas donner de conseil fiscal personnalisé.

---

### 6. Procédure

Reprendre la structure fixe Etoilys utilisée sur la page Dordogne.

Étapes recommandées :

1. Demande en ligne.
2. Analyse de la demande par Etoilys.
3. Confirmation des modalités d’intervention.
4. Planification de la visite.
5. Visite sur place du logement.
6. Envoi des documents et proposition de classement.
7. Classement valable 5 ans si accepté.

Lien vers `/procedure`.

Garder un ton simple et concret.

---

### 7. Points à vérifier localement

Titre recommandé :

`Les points à vérifier avant de louer dans le Lot-et-Garonne`

Mentionner brièvement :

- déclaration en mairie ;
- taxe de séjour locale ;
- éventuelles règles d’enregistrement selon la commune ;
- situation du logement : résidence principale ou secondaire ;
- règlement de copropriété si le logement est en copropriété ;
- traitement fiscal selon meublé classé ou non classé.

Formulation recommandée :

> Le classement ne remplace pas les autres démarches locales. Selon la commune et la situation du logement, vous pouvez aussi devoir vérifier la déclaration en mairie, la taxe de séjour, le règlement de copropriété ou les règles applicables à une résidence principale ou secondaire.

Liens possibles :

- `/faq`
- `/actualites/micro-bic-2026-meuble-classe-vs-non-classe`
- `/actualites/airbnb-residence-principale-limite-90-jours`
- `/actualites/taxe-de-sejour-2026-pourquoi-le-classement-change-la-donne`

Utiliser uniquement les liens qui existent réellement dans le repo.

---

### 8. CTA demande de classement

Reprendre la logique Dordogne.

Ne pas afficher de tarif.

Texte recommandé :

> Après réception de votre demande, Etoilys vous confirme les modalités d’intervention et le tarif applicable avant toute validation.

CTA :

`Demander mon classement`

Lien :

`/demande-classement`

---

### 9. FAQ locale

Créer une FAQ locale avec 5 à 6 questions.

Questions recommandées :

#### Etoilys intervient-il à Agen, Villeneuve-sur-Lot ou Marmande ?

Réponse :

> Oui, Etoilys peut étudier les demandes de classement dans le Lot-et-Garonne, notamment autour d’Agen, Villeneuve-sur-Lot, Marmande, Nérac et des secteurs proches. Les modalités exactes d’intervention sont confirmées après réception de votre demande.

#### Le classement est-il obligatoire pour louer un meublé de tourisme dans le Lot-et-Garonne ?

Réponse :

> Non, le classement officiel reste une démarche volontaire. En revanche, d’autres obligations peuvent s’appliquer, comme la déclaration en mairie, la taxe de séjour ou certaines règles locales.

#### Combien de temps le classement est-il valable ?

Réponse :

> Le classement d’un meublé de tourisme est valable 5 ans.

#### Le classement remplace-t-il la déclaration en mairie ?

Réponse :

> Non. Le classement et la déclaration en mairie sont deux démarches différentes. Un meublé classé peut toujours devoir être déclaré selon les règles applicables dans la commune.

#### Le classement peut-il avoir un intérêt fiscal ?

Réponse :

> Oui, pour les propriétaires relevant du micro-BIC, le classement peut créer une différence importante entre meublé classé et non classé. La situation fiscale doit toutefois être vérifiée selon le cas du propriétaire.

#### Combien coûte une visite de classement dans le Lot-et-Garonne ?

Réponse :

> Etoilys confirme les modalités d’intervention et le tarif applicable après réception de la demande. Aucun tarif fixe ne doit être affiché publiquement sur cette page.

---

### 10. Sources

Ajouter une section visible “Sources”.

Sources à inclure :

#### Mémento du Tourisme en Lot-et-Garonne 2025

`https://pro.tourisme-lotetgaronne.com/wp-content/uploads/2025/06/TourismeLotetGaronne_ChiffresCles2025.pdf`

#### ADRT Lot-et-Garonne — Classement des meublés de tourisme

`https://pro.tourisme-lotetgaronne.com/accompagnement/classement-2/classement-des-meubles-de-tourisme/`

#### Atout France — Classement des meublés de tourisme

`https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme`

#### Service-Public / Service-Public Entreprendre

Utiliser les pages déjà présentes dans le projet pour :

- déclaration ;
- taxe de séjour ;
- obligations du loueur.

---

## SEO à ajouter

Ajouter une entrée dans `src/content/seoRoutes.ts`.

Exemple attendu, à adapter au format réel du fichier :

```ts
{
  path: "/classement-meuble-tourisme-lot-et-garonne",
  title: "Classement meublé de tourisme Lot-et-Garonne | Etoilys",
  description: "Etoilys accompagne les propriétaires de gîtes, locations saisonnières et meublés de tourisme dans le Lot-et-Garonne pour leur classement officiel.",
  canonical: "https://www.etoilys.fr/classement-meuble-tourisme-lot-et-garonne",
}
```

Si le projet utilise un champ `ogImageKey`, `lcpImageKey`, `breadcrumbs`, `type`, `priority` ou autre, suivre exactement le modèle de la page Dordogne.

---

## Mise à jour de la page zone-intervention

Vérifier la page `/zone-intervention`.

Si elle contient déjà une liste de départements ou de cartes locales, ajouter une carte ou un lien vers :

`/classement-meuble-tourisme-lot-et-garonne`

Texte possible :

`Lot-et-Garonne`

Description possible :

`Classement de meublés de tourisme autour d’Agen, Villeneuve-sur-Lot, Marmande et des secteurs proches.`

Ne pas modifier inutilement le reste de la page.

---

## Checklist qualité avant livraison

Vérifier que :

- la page reprend bien la structure de la page Dordogne ;
- la page n’est pas un simple clone avec le nom du département remplacé ;
- les chiffres Lot-et-Garonne sont sourcés ;
- les sources locales sont affichées ;
- aucun tarif fixe n’est affiché ;
- aucune promesse de hausse de revenus ou de réservations n’est faite ;
- la page contient un CTA vers `/demande-classement` ;
- la page contient un lien vers `/zone-intervention` ;
- la page `/zone-intervention` contient un lien vers la nouvelle page ;
- le SEO est unique ;
- la route est indexable ;
- aucune meta keywords n’est ajoutée ;
- la page est incluse dans le système SEO/sitemap ;
- le style reste cohérent avec le site ;
- la page Dordogne continue de fonctionner.

---

## Commandes à exécuter ou recommander

À la fin, exécuter si possible :

```bash
npm run typecheck
npm run lint
npm run build
npm run seo:sitemap
```

Si une commande échoue, expliquer précisément l’erreur et les fichiers concernés.

---

## Résumé attendu à la fin

Répondre avec un résumé concis indiquant :

- fichiers créés ;
- fichiers modifiés ;
- route ajoutée ;
- entrée SEO ajoutée ;
- lien ajouté depuis `/zone-intervention` ;
- sources utilisées ;
- commandes exécutées ;
- éventuelles limites ou points à vérifier manuellement.
