# Brief Codex — Page locale Etoilys : Gironde

## 1. Informations générales

- Type de page : page départementale locale SEO / landing de service.
- Route à créer : `/classement-meuble-tourisme-gironde`
- Slug : `classement-meuble-tourisme-gironde`
- H1 : `Classement de meublé de tourisme en Gironde`
- Title SEO : `Classement meublé tourisme Gironde | Etoilys`
- Meta description : `Etoilys accompagne les propriétaires de meublés de tourisme en Gironde : classement officiel, zones d’intervention, procédure, fiscalité, taxe de séjour et demande en ligne.`
- Canonical : `https://www.etoilys.fr/classement-meuble-tourisme-gironde`
- Page parente logique : `/zones-intervention`
- Page modèle à reprendre : `/classement-meuble-tourisme-dordogne`
- Objectif principal : générer des demandes de classement de propriétaires de meublés de tourisme situés en Gironde, en particulier dans les secteurs compatibles avec l’organisation des tournées Etoilys.
- Afficher les tarifs : non.
- Images : utiliser des placeholders pour l’instant. Les assets définitifs seront fournis plus tard.

## 2. Consigne d’intégration principale pour Codex

Créer la page Gironde en reprenant la même structure, la même architecture de composants et le même framework visuel que la page Dordogne existante.

Ne pas réinventer la page.

Le travail attendu consiste à dupliquer/adapter la logique de la page Dordogne, puis à remplacer uniquement les contenus spécifiques à la Dordogne par des contenus spécifiques à la Gironde : intitulés, chiffres clés, secteurs couverts, sources, textes locaux, SEO, images et liens depuis la page zones d’intervention.

Tout le contenu fixe Etoilys doit rester cohérent avec la page Dordogne : bénéfices du classement, logique de procédure, CTA, FAQ de base, mentions de validation du tarif après demande, sources officielles, liens internes et structure générale.

### À faire côté repo

- Créer une page dédiée Gironde en suivant le modèle de la page Dordogne.
- Ajouter la route `/classement-meuble-tourisme-gironde` dans `src/AppRoutes.tsx`.
- Ajouter la configuration SEO dans `src/content/seoRoutes.ts`.
- Mettre à jour la page `/zones-intervention` : la carte Gironde doit pointer vers `/classement-meuble-tourisme-gironde` au lieu de pointer uniquement vers la demande de classement.
- Mettre à jour le footer si la liste des zones d’intervention est gérée en dur : ajouter `Classement en Gironde` sous les zones d’intervention.
- Réutiliser les composants, styles, classes Tailwind et patterns existants de la page Dordogne.
- Ne pas créer de nouvelle charte graphique.
- Ne pas créer de nouveau système d’images.
- Utiliser des placeholders images temporaires avec des noms explicites.

### Placeholders images à prévoir

- `placeholder-gironde-hero`  
  Alt : `Paysage de Gironde autour d’un secteur touristique`
- `placeholder-gironde-territoire`  
  Alt : `Territoire touristique en Gironde entre vignoble, ville et littoral`
- `placeholder-interieur-meuble-tourisme`  
  Alt : `Intérieur de maison de vacances préparée pour une visite de classement`

Les placeholders doivent être faciles à remplacer plus tard par des assets WebP/AVIF optimisés via le pipeline images existant.

## 3. Résumé stratégique

Cette page doit servir la requête principale `classement meublé tourisme Gironde` et ses variantes : `organisme classement meublé Gironde`, `classement location saisonnière Gironde`, `classement Airbnb Gironde`, `classement gîte Gironde`, `classement meublé Bordeaux`, `classement meublé Libourne`, `classement meublé Saint-Émilion`.

Elle doit aussi être utilisable comme landing page pour Google Ads, notamment sur les campagnes locales autour de Bordeaux, Libourne, Saint-Émilion, Entre-deux-Mers, Langon, Blaye, La Réole et Sainte-Foy-la-Grande.

La page doit rester une page de service : claire, concrète, structurée, orientée demande de classement. Les chiffres touristiques servent à contextualiser le marché girondin, pas à transformer la page en rapport statistique.

Le point important : ne pas créer une page générique avec trois mots remplacés. La structure est reprise de Dordogne, mais le contexte Gironde doit être réel : poids touristique du département, part des meublés/locations, volume de logements entiers proposés sur plateformes, spécificités Bordeaux/Bordeaux Métropole et importance de vérifier les règles locales.

## 4. Sources utilisées

| Source                                                                                    | Type                    |                        Date | Périmètre                         | Donnée utile                                                                                                                                                                                                       | URL                                                                                                                         |
| ----------------------------------------------------------------------------------------- | ----------------------- | --------------------------: | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Gironde Tourisme — Chiffres clés 2025                                                     | Institutionnelle / PDF  |                   Juin 2025 | Gironde                           | 561 000 lits touristiques en 2024 ; 261 000 lits marchands ; meublés/locations = 38 % des lits marchands ; 46 000 logements entiers proposés sur Airbnb, Booking et Abritel en 2024 ; répartition par territoires. | https://www.gironde-tourisme.com/espace-pro/wp-content/uploads/sites/2/2025/06/Chiffres-cles-2025.pdf                       |
| Gironde Tourisme — Enquête clientèle 2025                                                 | Institutionnelle        |                 29 mai 2026 | Gironde                           | 9,1 millions de séjours ; 47,4 millions de nuitées ; 3,84 milliards d’euros de retombées économiques directes ; les meublés arrivent en tête des hébergements marchands avec 22,1 % des nuitées.                   | https://www.gironde-tourisme.com/espace-pro/2026/05/29/enquete-clientele-tourisme-gironde-2025/                             |
| INSEE — En Nouvelle-Aquitaine, les locations de meublés touristiques en forte progression | Statistique publique    |             3 décembre 2025 | Nouvelle-Aquitaine / départements | 5,08 millions de nuitées en Gironde en 2024 via les plateformes ; la Gironde est le département néo-aquitain le plus fréquenté sur ce champ.                                                                       | https://www.insee.fr/fr/statistiques/8673310                                                                                |
| Bordeaux — Location touristique à Bordeaux : guide propriétaires                          | Institutionnelle locale |             18 février 2026 | Ville de Bordeaux                 | Rappel des démarches locales pour les locations touristiques à Bordeaux.                                                                                                                                           | https://www.bordeaux.fr/location-touristique-bordeaux--guide-proprietaires                                                  |
| Bordeaux Métropole — Taxe de séjour                                                       | Institutionnelle locale |                        2026 | Bordeaux Métropole                | Plateforme de taxe de séjour et déclaration mensuelle.                                                                                                                                                             | https://taxedesejour.bordeaux-metropole.fr/                                                                                 |
| Communauté de Communes du Grand Saint-Émilionnais — Taxe de séjour                        | Institutionnelle locale |                        2026 | Grand Saint-Émilionnais           | Plateforme de déclaration et de paiement de la taxe de séjour.                                                                                                                                                     | https://grandsaintemilionnais.taxesejour.fr/                                                                                |
| Atout France — Classement des meublés de tourisme                                         | Officielle              |                        2026 | National                          | Classement officiel, référentiel, organismes, documents de classement.                                                                                                                                             | https://www.atout-france.fr/fr/classement/meuble-de-tourisme                                                                |
| Direction générale des Entreprises — Les meublés de tourisme                              | Officielle              |             10 février 2025 | National                          | Le classement est facultatif et valorise les prestations offertes.                                                                                                                                                 | https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-meubles-de-tourisme                 |
| Service-Public — Déclaration en mairie des meublés de tourisme                            | Officielle              |                        2026 | National / local                  | Les démarches déclaratives dépendent de la commune.                                                                                                                                                                | https://www.service-public.fr/particuliers/vosdroits/R14321                                                                 |
| Service-Public Entreprendre — Taxe de séjour touristique                                  | Officielle              | Vérifié le 1er janvier 2026 | National / local                  | Barème de taxe de séjour, hébergements classés et non classés.                                                                                                                                                     | https://entreprendre.service-public.gouv.fr/vosdroits/F31635                                                                |
| impots.gouv.fr — Location meublée de tourisme, nouveau cadre fiscal                       | Officielle              |                        2026 | National                          | Seuils micro-BIC 2025 déclarés en 2026 : non classé 15 000 €, classé 77 700 €, abattement 50 % pour le classé.                                                                                                     | https://www.impots.gouv.fr/particulier/questions/je-suis-proprietaire-dune-location-meublee-de-tourisme-quel-est-le-nouveau |

## 5. Sources consultées mais non retenues

| Source                                                                           | Pourquoi non retenue                                                                                     |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Articles commerciaux de conciergeries ou plateformes de gestion locative         | Utiles pour comprendre les requêtes SEO, mais pas assez neutres pour porter les affirmations de la page. |
| Articles de presse généralistes sur Airbnb ou l’œnotourisme                      | Intéressants en contexte, mais moins adaptés qu’une source institutionnelle pour une landing de service. |
| Données anciennes 2019 ou 2023 lorsque des données 2024/2025 étaient disponibles | Données remplacées par des publications plus récentes de Gironde Tourisme et de l’INSEE.                 |

## 6. Données locales retenues

À intégrer dans le bloc `Données Gironde`, sur le même principe que le bloc `Données Dordogne`.

| Donnée                                                           | Année | Périmètre | Source                                    | Reformulation prête à intégrer                                                                                                      | Confiance |
| ---------------------------------------------------------------- | ----: | --------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 561 000 lits touristiques                                        |  2024 | Gironde   | Gironde Tourisme — Chiffres clés 2025     | La Gironde compte 561 000 lits touristiques en 2024.                                                                                | Fort      |
| 261 000 lits marchands                                           |  2024 | Gironde   | Gironde Tourisme — Chiffres clés 2025     | Sur ces lits touristiques, 261 000 relèvent de l’offre marchande.                                                                   | Fort      |
| 38 % des lits marchands en meublés/locations                     |  2024 | Gironde   | Gironde Tourisme — Chiffres clés 2025     | Les meublés et locations représentent 38 % des lits marchands, première catégorie d’hébergement marchand du département.            | Fort      |
| 46 000 logements entiers proposés sur Airbnb, Booking et Abritel |  2024 | Gironde   | Gironde Tourisme — Chiffres clés 2025     | En 2024, 46 000 logements entiers étaient proposés à la location sur les plateformes Airbnb, Booking et Abritel.                    | Fort      |
| 9,1 millions de séjours et 47,4 millions de nuitées              |  2025 | Gironde   | Gironde Tourisme — Enquête clientèle 2025 | En 2025, la Gironde a enregistré 9,1 millions de séjours et 47,4 millions de nuitées.                                               | Fort      |
| 5,08 millions de nuitées via plateformes en Gironde              |  2024 | Gironde   | INSEE                                     | En 2024, la Gironde est le département néo-aquitain le plus fréquenté via les plateformes, avec 5,08 millions de nuitées réservées. | Fort      |

### Données à afficher visuellement

Pour éviter de surcharger le bloc, afficher seulement 5 indicateurs :

- `561 000` — Lits touristiques en Gironde en 2024
- `261 000` — Lits marchands
- `38 %` — Part des meublés/locations dans les lits marchands
- `46 000` — Logements entiers proposés sur Airbnb, Booking et Abritel en 2024
- `47,4 M` — Nuitées touristiques en 2025

La donnée INSEE sur les 5,08 millions de nuitées via plateformes peut être utilisée dans le texte d’analyse, mais pas forcément dans les cartes statistiques pour éviter un bloc trop dense.

## 7. Contenu complet de la page

# Classement de meublé de tourisme en Gironde

Vous louez un appartement, une maison de vacances, un gîte ou une location saisonnière en Gironde ? Etoilys accompagne les propriétaires qui souhaitent demander le classement officiel de leur meublé de tourisme.

Entre Bordeaux, le Libournais, Saint-Émilion, l’Entre-deux-Mers, le Sud-Gironde, le Blayais, le Bassin d’Arcachon et le littoral médocain, la Gironde est un territoire touristique majeur. Dans ce contexte, le classement peut renforcer la lisibilité de votre logement et avoir des effets concrets sur la fiscalité, la taxe de séjour et la présentation de votre offre auprès des voyageurs.

[CTA primaire] Demander le classement de mon meublé  
[CTA secondaire] Comprendre la procédure

## Les bénéfices concrets du classement pour votre meublé en Gironde

La Gironde attire des clientèles très différentes : séjours urbains à Bordeaux, œnotourisme autour de Saint-Émilion et du Médoc, vacances sur le Bassin d’Arcachon, séjours nature dans l’Entre-deux-Mers, itinérances à vélo, escapades patrimoniales ou familiales.

Le classement ne sert pas seulement à obtenir des étoiles. Pour un propriétaire, il peut aussi jouer sur la fiscalité, la taxe de séjour, les cotisations sociales et la présentation du logement auprès des voyageurs.

### Fiscalité micro-BIC

Un meublé classé conserve un cadre micro-BIC plus favorable qu’un meublé non classé, avec un plafond plus élevé et un abattement forfaitaire plus important selon les règles applicables.

[Lien interne] Estimer l’impact fiscal — `/simulateur-fiscal-classement`

### Taxe de séjour

Le classement peut rendre la taxe de séjour plus lisible, car les meublés classés relèvent d’un barème par étoile. Les hébergements non classés ou en attente de classement relèvent en principe d’un calcul proportionnel, selon les règles votées localement.

[Lien interne] Comparer la taxe de séjour — `/simulateur-taxe-sejour`

### Cotisations sociales

Si vous relevez du régime micro-social, le classement peut aussi changer le cadre applicable : les meublés de tourisme classés bénéficient d’un taux spécifique de 6 %, sous conditions de seuils.

### Repère officiel pour les voyageurs

Les étoiles donnent un repère simple et reconnu au voyageur, notamment dans un département où l’offre de meublés, gîtes et locations saisonnières est importante.

Vous voulez vérifier concrètement l’impact du classement ?

[CTA] Voir tous les avantages du classement — `/les-avantages-du-classement`

## Un territoire touristique où les meublés ont une vraie place

En Gironde, les meublés et locations représentent une part majeure de l’offre touristique marchande.

Les données de Gironde Tourisme et de l’INSEE confirment le poids du secteur :

[Image placeholder : `placeholder-gironde-territoire`]  
Alt : `Territoire touristique en Gironde entre vignoble, ville et littoral`

### Données Gironde

| Chiffre | Signification                                                     |
| ------: | ----------------------------------------------------------------- |
| 561 000 | Lits touristiques en Gironde en 2024                              |
| 261 000 | Lits marchands                                                    |
|    38 % | Part des meublés/locations dans les lits marchands                |
|  46 000 | Logements entiers proposés sur Airbnb, Booking et Abritel en 2024 |
|  47,4 M | Nuitées touristiques en 2025                                      |

Source : Gironde Tourisme, Chiffres clés 2025 et Enquête clientèle 2025.

### En Gironde, les meublés de tourisme ne sont pas un marché secondaire

Avec 38 % des lits marchands en meublés et locations, la Gironde fait partie des territoires où la location saisonnière occupe une place importante dans l’offre touristique.

En 2024, Gironde Tourisme recensait aussi 46 000 logements entiers proposés à la location sur Airbnb, Booking et Abritel. L’INSEE confirme cette dynamique : la Gironde est le département néo-aquitain qui concentre le plus de nuitées réservées via les plateformes en 2024.

Dans ce contexte, le classement n’est pas seulement une formalité administrative. Il permet à votre logement de s’inscrire dans un cadre officiel, plus lisible pour les voyageurs, et peut avoir des effets concrets sur la fiscalité, la taxe de séjour et les cotisations sociales.

## Classement de meublés en Gironde : les secteurs couverts

Etoilys accompagne les propriétaires de meublés de tourisme en Gironde, selon la localisation du logement et l’organisation des tournées.

Après réception de votre demande, nous vous confirmons les possibilités d’intervention, les délais et les conditions applicables avant toute validation.

[CTA] Faire une demande de classement — `/demande-classement`

### Secteurs prioritaires

Bordeaux, Bordeaux Métropole, Libourne, Saint-Émilion, Castillon-la-Bataille, Sainte-Foy-la-Grande, Entre-deux-Mers, Créon, Cadillac, Langon, La Réole, Blaye, Bourg, Coutras, Saint-André-de-Cubzac, Saint-Loubès, Branne, Sauveterre-de-Guyenne, Monségur, Pellegrue et secteurs proches.

### Secteurs étudiés selon les tournées

Bassin d’Arcachon, Arcachon, La Teste-de-Buch, Gujan-Mestras, Andernos-les-Bains, Lège-Cap-Ferret, Lacanau, Hourtin, Carcans, Soulac-sur-Mer, Pauillac, Lesparre-Médoc et littoral médocain.

Votre commune n’est pas listée ? Indiquez-la dans votre demande : nous vous confirmerons les modalités d’intervention avant toute validation.

## Comment se déroule une visite de classement avec Etoilys ?

Vous déposez votre demande, nous vérifions le périmètre avec vous, puis la visite est organisée sur place selon la grille officielle.

[Image placeholder : `placeholder-interieur-meuble-tourisme`]  
Alt : `Intérieur de maison de vacances préparée pour une visite de classement`

### 1. Vous déposez une demande en ligne

Vous indiquez les informations principales : logement, adresse, capacité, situation, coordonnées.

### 2. Un inspecteur reprend contact avec vous

L’objectif est de vérifier le périmètre, la catégorie visée, les délais et les modalités d’intervention.

### 3. Votre logement est évalué selon la grille officielle

L’inspecteur se déplace dans votre logement et effectue la visite de contrôle avec vous.

### 4. Vous ajustez votre demande si nécessaire

À l’issue de la visite, Etoilys vous indique si la catégorie demandée semble atteignable et, si besoin, les points à corriger ou à ajuster.

### 5. Vous recevez les documents de classement

Après la visite, vous recevez le rapport de contrôle, la grille complétée et la proposition de décision de classement.

### 6. Le classement est valable 5 ans

Une fois acquis, le classement est valable 5 ans. Vous pouvez ensuite l’utiliser dans vos démarches, vos annonces et vos échanges avec la collectivité.

### Vous voulez avoir une première idée du classement possible ?

Utilisez le simulateur Etoilys pour estimer la catégorie que votre logement pourrait viser, avant une visite officielle sur place.

[CTA] Simuler mon classement — `/simulateur`

## Combien coûte une visite de classement en Gironde ?

Le tarif d’une visite dépend de plusieurs éléments simples : la localisation du logement, le délai souhaité, le nombre de meublés à classer et la possibilité de regrouper plusieurs visites dans le même secteur.

Après réception de votre demande, Etoilys vous confirme les modalités d’intervention et le tarif applicable avant toute validation. Vous savez donc à quoi vous engager avant de fixer la visite.

[CTA] Demander mon classement — `/demande-classement`

## Points à vérifier localement en Gironde

Le classement est une démarche nationale, mais les règles de mise en location restent à vérifier localement.

En Gironde, la situation peut varier selon la commune ou l’intercommunalité : déclaration en mairie, numéro d’enregistrement, taxe de séjour, changement d’usage, résidence principale, résidence secondaire ou règlement de copropriété.

À Bordeaux et dans certains secteurs de Bordeaux Métropole, les locations touristiques peuvent faire l’objet de démarches spécifiques. Dans le Libournais, le Grand Saint-Émilionnais ou les communes touristiques du littoral, la taxe de séjour est également gérée par des plateformes locales dédiées.

Avant de demander le classement, la première chose à faire est donc de vérifier les règles applicables dans la commune du logement.

[Lien interne] Consulter les prérequis au classement — `/prerequis-au-classement`

## Questions fréquentes

### Le classement d’un meublé de tourisme est-il obligatoire en Gironde ?

Non. Le classement est une démarche facultative. Un logement peut être un meublé de tourisme même s’il n’est pas classé. En revanche, le classement peut présenter un intérêt pour la lisibilité du logement, la taxe de séjour et la fiscalité micro-BIC selon la situation du propriétaire.

### Le classement remplace-t-il la déclaration en mairie ?

Non. Le classement ne remplace pas les formalités déclaratives ou d’enregistrement applicables localement. Avant de déposer une demande, vérifiez les règles auprès de la mairie ou de la plateforme officielle utilisée par la collectivité.

### Le classement est-il valable partout en France ?

Oui, le classement est une démarche officielle nationale. Il attribue une catégorie de 1 à 5 étoiles selon une grille nationale. Les règles locales de location restent toutefois à vérifier commune par commune.

### Combien de temps le classement est-il valable ?

Le classement est valable 5 ans. Passé ce délai, une nouvelle demande est nécessaire pour conserver le classement.

### Etoilys intervient-il à Bordeaux, Libourne et Saint-Émilion ?

Oui, Etoilys peut étudier les demandes de classement en Gironde, notamment autour de Bordeaux, Libourne, Saint-Émilion, l’Entre-deux-Mers, le Sud-Gironde et les secteurs proches. La zone exacte d’intervention est confirmée après votre demande.

### Etoilys intervient-il sur le Bassin d’Arcachon ou le littoral médocain ?

Les demandes situées sur le Bassin d’Arcachon, le littoral médocain ou les secteurs plus éloignés sont étudiées selon la localisation du logement et l’organisation des tournées. Indiquez la commune dans votre demande pour recevoir une réponse claire avant toute validation.

### Peut-on faire classer plusieurs logements en même temps ?

Oui, mais chaque meublé doit être visité séparément et évalué selon la grille applicable. Si vous avez plusieurs logements, indiquez-le dans votre demande pour organiser la tournée de façon efficace.

### Le classement garantit-il plus de réservations ?

Non. Le classement donne un repère officiel de confort et de services, mais il ne garantit pas un taux d’occupation, un prix moyen ou une hausse automatique des réservations.

### Le classement change-t-il la taxe de séjour ?

Il peut changer la façon dont la taxe de séjour est calculée. Les meublés classés relèvent d’un barème par étoile, tandis que les hébergements sans classement ou en attente de classement relèvent en principe d’un calcul proportionnel compris entre 1 % et 5 % du prix de la nuitée par personne, dans la limite du tarif le plus élevé adopté localement.

## Demander le classement de votre meublé en Gironde

Vous louez ou préparez la mise en location d’un meublé de tourisme en Gironde ? Etoilys peut vous accompagner pour organiser la visite de classement.

Déposez votre demande en ligne : nous vous confirmerons les modalités d’intervention, le tarif applicable et les prochaines disponibilités avant toute validation.

[CTA primaire] Demander le classement de mon meublé — `/demande-classement`  
[CTA secondaire] Lire la FAQ — `/faq`

## Sources officielles et institutionnelles

- Gironde Tourisme — Chiffres clés 2025 : https://www.gironde-tourisme.com/espace-pro/wp-content/uploads/sites/2/2025/06/Chiffres-cles-2025.pdf
- Gironde Tourisme — Enquête clientèle 2025 : https://www.gironde-tourisme.com/espace-pro/2026/05/29/enquete-clientele-tourisme-gironde-2025/
- INSEE — En Nouvelle-Aquitaine, les locations de meublés touristiques en forte progression : https://www.insee.fr/fr/statistiques/8673310
- Atout France — Classement des meublés de tourisme : https://www.atout-france.fr/fr/classement/meuble-de-tourisme
- Direction générale des Entreprises — Les meublés de tourisme : https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-meubles-de-tourisme
- Service-Public — Déclaration en mairie des meublés de tourisme : https://www.service-public.fr/particuliers/vosdroits/R14321
- Service-Public Entreprendre — Taxe de séjour touristique : https://entreprendre.service-public.gouv.fr/vosdroits/F31635
- Bordeaux — Location touristique à Bordeaux, guide propriétaires : https://www.bordeaux.fr/location-touristique-bordeaux--guide-proprietaires
- Bordeaux Métropole — Taxe de séjour : https://taxedesejour.bordeaux-metropole.fr/
- Grand Saint-Émilionnais — Taxe de séjour : https://grandsaintemilionnais.taxesejour.fr/

## 8. Maillage interne recommandé

| Lien                            | Ancre recommandée                       | Emplacement                                                |
| ------------------------------- | --------------------------------------- | ---------------------------------------------------------- |
| `/demande-classement`           | `Demander le classement de mon meublé`  | Hero, bloc secteurs, bloc tarif, CTA final                 |
| `/procedure`                    | `Comprendre la procédure`               | Hero et bloc procédure                                     |
| `/les-avantages-du-classement`  | `Voir tous les avantages du classement` | Fin du bloc bénéfices                                      |
| `/simulateur-fiscal-classement` | `Estimer l’impact fiscal`               | Bloc fiscalité micro-BIC                                   |
| `/simulateur-taxe-sejour`       | `Comparer la taxe de séjour`            | Bloc taxe de séjour                                        |
| `/simulateur`                   | `Simuler mon classement`                | Après les étapes de procédure                              |
| `/prerequis-au-classement`      | `Consulter les prérequis au classement` | Bloc points à vérifier localement + FAQ déclaration mairie |
| `/faq`                          | `Lire la FAQ`                           | CTA final                                                  |
| `/zones-intervention`           | `Zones d’intervention Etoilys`          | Fil d’Ariane ou footer local si existant                   |

## 9. Suggestions UI pour Codex

Reprendre les mêmes blocs que la page Dordogne :

1. Hero local avec image placeholder, badge `Gironde`, H1, chapô et deux CTA.
2. Bloc bénéfices avec cartes : fiscalité micro-BIC, taxe de séjour, cotisations sociales, repère officiel.
3. Bloc données locales avec image placeholder et cartes statistiques.
4. Bloc analyse locale : `En Gironde, les meublés de tourisme ne sont pas un marché secondaire`.
5. Bloc intervention locale avec liste de secteurs couverts.
6. Bloc procédure en 6 étapes.
7. Bloc tarif sans montant affiché.
8. Bloc points à vérifier localement en Gironde.
9. FAQ.
10. CTA final.
11. Sources officielles et institutionnelles.

### Notes UI spécifiques

- Ne pas afficher de prix chiffré.
- Ne pas afficher de carte interactive pour l’instant.
- Ne pas ajouter d’image réelle tant que les assets n’ont pas été fournis.
- Les placeholders doivent rester propres, identifiables et facilement remplaçables.
- Les stats doivent rester lisibles sur mobile : privilégier des cartes ou une grille responsive comme sur Dordogne.

## 10. Données structurées SEO recommandées

- Utiliser la même logique de données structurées que la page Dordogne si elle existe.
- Ajouter la route à `seoRoutes.ts` avec title, description, canonical, priority et changefreq cohérents avec la page Dordogne.
- Si le projet utilise `BreadcrumbList`, reprendre la même logique : Accueil > Zones d’intervention > Classement en Gironde.
- Ne pas ajouter de `FAQPage` si le projet ne l’utilise pas déjà proprement.
- Ne pas ajouter de `meta keywords`.

## 11. Checklist qualité avant intégration

- H1 unique.
- Title SEO unique.
- Meta description unique.
- Canonical propre.
- Route ajoutée dans `AppRoutes.tsx`.
- Route ajoutée dans `seoRoutes.ts`.
- Page `/zones-intervention` mise à jour avec lien vers Gironde.
- Footer mis à jour si nécessaire.
- Structure identique à la page Dordogne.
- Contenu local Gironde réellement distinct.
- Données locales sourcées.
- Sources institutionnelles visibles dans la page.
- Pas de tarif chiffré affiché.
- Pas de promesse de hausse de revenu.
- Pas de promesse de hausse de réservation.
- CTA vers `/demande-classement`.
- Liens internes présents.
- Images en placeholders uniquement.
- Texte utile même sans référencement.
- Page compatible Google Ads.
- Page compatible SEO local long terme.
