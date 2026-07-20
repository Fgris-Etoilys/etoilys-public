# Refonte UI/UX des articles Actualités Etoilys

## Consignes communes à joindre à chaque ticket

Avant toute modification :

1. Inspecte les composants et conventions déjà présents dans le repo.
2. Réutilise les composants existants de `src/components/ui` quand ils répondent au besoin.
3. N’ajoute pas de nouvelle dépendance sauf nécessité démontrée.
4. Respecte React 19, TypeScript strict, React Router 7, Tailwind CSS 3 et les tokens existants.
5. Ne modifie aucune information juridique, fiscale ou réglementaire contenue dans les articles.
6. Ne réécris pas la copy des articles, sauf microcopy explicitement demandée dans le ticket.
7. Ne modifie pas les URLs, les canonical, les dates ou les données structurées sans nécessité prévue par le ticket.
8. Le SEO reste centralisé selon l’architecture existante. Ne pas injecter manuellement de SEO ou de JSON-LD dans les pages.
9. Préserve le prerender, le sitemap, les routes FR/EN/NL existantes et le consentement analytics.
10. Termine chaque ticket en exécutant les tests adaptés et en signalant les éventuels points non traités.

## Hors périmètre global

Ne pas implémenter dans ce chantier :

- de page auteur dédiée ;
- de lien depuis le bloc auteur vers une page auteur ;
- de checklist imprimable ;
- d’export PDF ;
- de calculateur de préparation de visite ;
- d’arbre de décision métier ;
- de frise chronologique spécialisée ;
- de stepper métier propre à un article ;
- de nouveaux composants spécifiques à chaque sujet d’article ;
- de moteur de recherche sur la page Actualités ;
- de pagination ;
- de carrousel à rotation automatique ;
- de réécriture éditoriale générale des articles.

---

# Ticket 1 — Créer un shell commun pour les articles Actualités

**Priorité : P1**

**Statut : terminé le 2026-07-19**

## Avancement du ticket 1 — 2026-07-19

Terminé :

- les 12 articles actifs utilisent `ArticleLayout` ;
- les catégories et temps de lecture sont centralisés dans `src/content/actualitesArticles.ts` ;
- le libellé du temps de lecture est généré depuis `readingTimeMinutes` avec un helper partagé ;
- l’image d’article existante `imageKey` reste la source de vérité pour les usages hors shell, sans champ parallèle ;
- le shell d’article ne rend plus de photo de couverture ;
- le layout impose l’ordre haut d’article : retour, catégorie, H1, métadonnées, chapô, `À retenir`, corps ;
- le layout impose l’ordre bas d’article : `footerCta`, `sources`, `relatedArticles`, `authorBlock` ;
- la structure sémantique `<article>`, `<header>` et `<footer>` est en place, avec `aria-labelledby` sur le H1 ;
- la page `/actualites` consomme la catégorie centrale dans les cartes existantes ;
- l’ancien composant `ArticleHeaderMeta` a été supprimé.

Reporté volontairement aux tickets suivants :

- standardisation des variantes `KeyTakeaways` et du composant `ArticleSources` : ticket 3 ;
- ajout effectif des articles connexes et du bloc auteur : ticket 4 ;
- refonte complète des cartes et remplacement de `Lire plus` : ticket 5.

Validations exécutées :

- `npm run typecheck` : OK ;
- `npm run lint` : OK, avec un warning préexistant dans `src/pages/SimulationClassement.tsx` sur `react-hooks/exhaustive-deps` ;
- `npm run test:run` : OK, 36 fichiers de tests et 341 tests passés ;
- `npm run build` : OK, avec le warning Vite existant sur des chunks supérieurs à 500 kB ;
- `npm run prerender` : OK, toutes les routes d’articles Actualités ont été générées.

Passe corrective avant ticket 2 :

- hero raccourci, surtout sur le padding vertical inférieur ;
- contenu du hero aligné avec la future colonne principale desktop prévue pour le sommaire ;
- ordre du shell ajusté en `chapô`, `À retenir`, puis corps ;
- lien `Retour aux actualités` retravaillé avec `ArrowLeft` et une cible tactile de 44 px ;
- vérification Playwright à 390, 768, 1024 et 1440 px : alignement OK, ordre OK, aucun débordement horizontal détecté.

Passe corrective sans photo dans le shell :

- rendu des photos supprimé de `ArticleLayout` ;
- espacement entre le chapô et le bloc `À retenir` repris dans le shell avec `.article-lede`, en neutralisant la marge du dernier élément du chapô avant d’appliquer l’écart commun ;
- espacement entre la fin du corps et le CTA corrigé : suppression du `pb-section` du corps lorsqu’un footer existe, padding haut contrôlé sur le footer, et marge haute du premier slot neutralisée avec `.article-footer-slots` ;
- validations simples : `npm run typecheck` OK, tests `ArticleLayout` + gouvernance articles OK, lint ciblé TS/TSX OK.

**Statut : terminé le 2026-07-20**

## Avancement du ticket 6 — 2026-07-20

Terminé :

- intégration axe à Vitest via `@chialab/vitest-axe` et `axe-core`, sans dépendance Jest ;
- ajout de smoke tests axe sur `/actualites` et un article riche, sans désactivation de règle axe ;
- audit de hiérarchie des titres des articles : H1 unique et succession H2/H3 cohérente ;
- renforcement de `ResponsiveComparisonTable` : captions, `scope`, classes anti-débordement, marqueurs de variantes responsive ;
- corrections des tableaux locaux d’articles : captions `sr-only`, `scope="col"`, `scope="row"` ;
- captions localisées et classes robustes pour les usages simulateurs du tableau partagé ;
- corrections responsive : `min-w-0` dans `ArticleLayout`, cibles tactiles sur sources/sommaire et bouton cookies, photo auteur décorative `alt=""` ;
- prise en compte `prefers-reduced-motion` sur scroll du sommaire et rotations d’icônes.

Validations exécutées :

- `npm run typecheck` : OK ;
- `npm run lint` : OK, avec warning préexistant dans `src/pages/SimulationClassement.tsx` sur `react-hooks/exhaustive-deps` ;
- `npm run test:run` : OK, 45 fichiers et 390 tests passés ; axe émet en stderr l’avertissement jsdom `HTMLCanvasElement.getContext()` sans règle désactivée ;
- `npm run build` : OK, avec warning Vite préexistant sur chunks > 500 kB ;
- `npm run prerender` : OK ;
- Playwright sur build prerenderé aux largeurs 390, 768, 1024 et 1440 px : `/actualites`, articles DPE/taxe de séjour/préparer visite, simulateurs avant et après calcul ciblé autour des tableaux ; pas d’overflow global, pas d’ID dupliqué, variantes responsive du tableau correctement masquées/affichées et non focusables quand masquées.

Limites restantes :

- warning lint préexistant `SimulationClassement.tsx`, non traité ;
- warning Vite de taille de chunk, non traité ;
- avertissement jsdom `canvas.getContext()` pendant les tests axe, non masqué pour éviter de désactiver une règle ;
- `npm install` signale 1 vulnérabilité low severity, non traitée dans ce ticket ;
- audit global des formulaires et parcours simulateurs hors `ResponsiveComparisonTable` non inclus conformément au périmètre.

## Objectif

Uniformiser la structure du haut et du bas de tous les articles en créant ou en consolidant un composant de mise en page partagé.

L’objectif est d’éviter que chaque page d’article recrée manuellement son header, ses métadonnées, son contenu et son footer avec de légères différences.

## Fichiers à inspecter en priorité

- `src/pages/actualites/*`
- `src/content/actualitesArticles.ts`
- `src/content/articleStructuredData.ts`
- `src/components/ui`
- les composants partagés déjà utilisés dans plusieurs articles
- les tests des routes et des articles

Les noms de fichiers ci-dessous sont indicatifs. Adapte-les à l’architecture réelle après inspection.

## Implémentation attendue

Créer ou consolider un composant partagé de type :

```tsx
<ArticleLayout
  article={articleMetadata}
  tableOfContents={...}
  sources={...}
  relatedArticles={...}
>
  {articleContent}
</ArticleLayout>
```

Ne transforme pas les articles en CMS et ne déplace pas toute leur copy dans un énorme objet TypeScript. Le corps éditorial peut rester dans chaque page.

Le composant partagé doit gérer au minimum :

- la largeur globale de l’article ;
- le retour vers `/actualites` ;
- la catégorie principale ;
- le H1 ;
- les métadonnées visibles ;
- le chapô ;
- l’image de couverture éventuelle ;
- l’emplacement du bloc « À retenir » ;
- la zone du corps d’article ;
- les sources ;
- le CTA ;
- les contenus associés ;
- le bloc auteur.

## Ordre obligatoire du haut d’article

Utiliser cet ordre :

1. lien discret `Retour aux actualités` ;
2. badge de catégorie ;
3. H1 ;
4. métadonnées ;
5. chapô ;
6. image de couverture éventuelle ;
7. bloc `À retenir` ;
8. corps de l’article.

Le H1 doit donc apparaître avant la ligne de métadonnées.

## Métadonnées visibles

Afficher sous le H1 :

- `Publié le [date]` ;
- `Mis à jour le [date]` uniquement lorsque `updatedAt` est différent de `publishedAt` ;
- auteur ;
- temps de lecture.

Exemple :

```txt
Publié le 27 mars 2026 · Mis à jour le 7 juin 2026 · Florian Grisorio · 8 min de lecture
```

Sur mobile, autoriser le retour à la ligne sans écraser ou tronquer les informations.

## Catégories

Définir une taxonomie centrale et typée, utilisée par les articles et la page `/actualites` :

```ts
type ArticleCategory =
  | 'classement'
  | 'fiscalite'
  | 'reglementation'
  | 'obligations'
  | 'guides-pratiques';
```

Libellés publics :

- Classement
- Fiscalité
- Réglementation
- Obligations
- Guides pratiques

Un article possède une catégorie principale. Les tags éventuels peuvent rester distincts, mais ne doivent pas servir de catégories concurrentes.

## Contraintes

- Un seul H1 par page.
- Ne pas modifier la hiérarchie ou la copy des H2/H3 dans ce ticket.
- Ne pas créer de breadcrumb visuel complexe : le lien `Retour aux actualités` suffit.
- Conserver les breadcrumbs JSON-LD existants.
- L’image de couverture reste facultative.
- Ne pas créer d’image générique de remplacement pour les articles qui n’en ont pas.
- Les images critiques existantes doivent continuer à passer par `SmartImage` et le pipeline prévu par le repo.

## Critères d’acceptation

- Tous les articles actifs utilisent le même shell ou la même composition partagée.
- Le H1 apparaît avant les métadonnées.
- Toutes les pages affichent une catégorie principale.
- Les dates de publication et de mise à jour sont clairement distinguées.
- Aucun contenu éditorial n’a été perdu ou réécrit.
- Les données structurées restent cohérentes avec les métadonnées visibles.
- Aucun article ne contient plus d’un H1.
- Le rendu reste correct à 390, 768, 1024 et 1440 px.
- Le prerender produit toujours le contenu intégral des articles.

## Tests

Ajouter ou mettre à jour des tests couvrant :

- l’ordre H1 puis métadonnées ;
- l’affichage conditionnel de `Mis à jour le` ;
- la catégorie ;
- le temps de lecture ;
- l’absence d’un second H1 ;
- le rendu d’un article avec et sans image de couverture.

Exécuter :

```bash
npm run typecheck
npm run lint
npm run test:run
npm run build
npm run prerender
```

---

# Ticket 2 — Ajouter un sommaire responsive aux articles longs

**Priorité : P1**
**Dépendance : Ticket 1**

**Statut : terminé le 2026-07-19**

## Avancement du ticket 2 — 2026-07-19

Terminé :

- composant partagé `ArticleTableOfContents` ajouté avec navigation desktop sticky et version mobile/tablette repliable ;
- composant partagé `ArticleSectionHeading` ajouté pour les H2 éditoriaux ciblés, avec `scroll-margin-top` responsive ;
- `ArticleLayout` accepte désormais `tableOfContents` et applique la règle d’affichage `5 sections H2 ou 6 min de lecture` ;
- le sommaire desktop démarre à `xl`, la version repliable reste utilisée à 1024 px ;
- l’état actif est géré par `IntersectionObserver`, avec fallback sur le fragment d’URL ou la dernière section cliquée, sans section active inventée ;
- le scroll global du layout ne remet plus la page en haut lorsqu’un `location.hash` est présent ;
- les 12 articles Actualités actifs possèdent un sommaire explicite et des H2 éditoriaux avec ids stables ;
- les H2 de `À retenir`, CTA, sources et encarts internes ne sont pas inclus dans le sommaire ;
- le `<details>` mobile/tablette se ferme automatiquement après clic sur une entrée ;
- les variantes responsive utilisent `hidden`/`xl:*`, donc la variante masquée est en `display: none`.

Validations exécutées :

- `npm run typecheck` : OK ;
- `npm run lint` : OK, avec le warning préexistant dans `src/pages/SimulationClassement.tsx` sur `react-hooks/exhaustive-deps` ;
- `npm run test:run` : OK, 38 fichiers de tests et 352 tests passés ;
- `npm run build` : OK, avec le warning Vite existant sur des chunks supérieurs à 500 kB ;
- `npm run prerender` : OK, relancé séquentiellement après le build pour garantir l’état final de `dist` ;
- vérification Playwright sur le build prerenderé à 390, 768, 1024 et 1440 px : H1 unique, absence de débordement horizontal, version repliable à 390/768/1024 px, version latérale à 1440 px, fermeture du `<details>` après clic et hash d’ancre corrects.

## Objectif

Permettre au lecteur d’accéder directement à la section qui l’intéresse sans faire défiler huit minutes de fiscalité pour retrouver une phrase.

## Règle d’affichage

Afficher le sommaire lorsque l’une des conditions suivantes est remplie :

- l’article possède au moins 5 sections H2 ;
- ou le temps de lecture est supérieur ou égal à 6 minutes.

Ne pas afficher de sommaire sur les articles courts.

## Architecture attendue

Privilégier une configuration explicite et typée des sections plutôt qu’une extraction fragile du texte affiché.

Exemple conceptuel :

```ts
const tableOfContents = [
  {
    id: 'qui-est-concerne',
    label: 'Qui est concerné ?',
    level: 2,
  },
];
```

Chaque entrée doit correspondre à un véritable `id` présent sur le heading ciblé.

Il ne doit pas y avoir de lien de sommaire sans cible ni de cible sans identifiant stable.

## Desktop

À partir du breakpoint adapté à la largeur réelle de lecture :

- afficher le sommaire dans une colonne latérale ;
- le rendre sticky sous le header ;
- limiter sa hauteur à l’espace disponible ;
- permettre son défilement interne si nécessaire ;
- indiquer visuellement la section active ;
- ne pas réduire excessivement la largeur de la colonne de texte.

Le sommaire ne doit pas devenir sticky sur une largeur où il compresse le contenu principal.

## Mobile et tablette étroite

Afficher sous le bloc `À retenir` ou juste avant le corps de l’article :

```txt
Dans cet article
```

Le composant doit être repliable.

Utiliser de préférence un composant accessible existant ou un couple natif `<details>/<summary>` si cela correspond au design.

## Navigation

- Le clic doit faire défiler jusqu’à la section.
- Ajouter `scroll-margin-top` aux headings afin que le header fixe ne masque pas le titre.
- Mettre à jour l’état actif via `IntersectionObserver`.
- L’état actif ne doit pas modifier l’URL à chaque mouvement de scroll.
- Le clic peut mettre à jour le fragment `#section-id`.
- Une URL contenant déjà un fragment doit ouvrir la page au bon endroit.
- Respecter `prefers-reduced-motion`.

## Accessibilité

- Le sommaire doit être dans un élément `<nav aria-label="Sommaire de l’article">`.
- Les liens doivent avoir un focus visible.
- La section active peut utiliser `aria-current="location"`.
- Le contrôle mobile doit être utilisable au clavier.
- La taille de cible tactile doit être suffisante.
- Les labels du sommaire doivent rester lisibles et ne pas être tronqués sans solution.

## Critères d’acceptation

- Tous les articles longs affichent un sommaire.
- Tous les articles courts restent sans sommaire.
- Le sticky desktop ne chevauche jamais le header ou le footer.
- Le sommaire mobile est repliable.
- Tous les liens pointent vers une section existante.
- La section active se met à jour pendant la lecture.
- Le chargement direct d’une URL avec fragment fonctionne.
- Aucun décalage de mise en page important n’apparaît au chargement.
- Le sommaire est présent dans le HTML prerenderé.

## Tests

Couvrir :

- la règle d’affichage ;
- la correspondance entre les ids et les liens ;
- le rendu mobile repliable ;
- `aria-current` ;
- la navigation par fragment ;
- l’absence de sommaire sur un article court.

---

# Ticket 3 — Standardiser les blocs « À retenir » et « Sources officielles »

**Priorité : P1**
**Dépendance : Ticket 1**

**Statut : terminé le 2026-07-19**

## Avancement du ticket 3 — 2026-07-19

Terminé :

- création de `src/components/ui/KeyTakeaways.tsx` avec API discriminée `bullets`, `metrics`, `comparison` et `warning` ;
- sémantique HTML explicite : `ul/li` pour `bullets`, `dl/dt/dd` pour `metrics`, réutilisation de `ResponsiveComparisonTable` pour `comparison`, `aside` identifiable pour `warning` ;
- validation explicite en développement : maximum 5 items textuels/metrics/compléments et 2 ou 3 lignes comparées pour `comparison`, sans troncature silencieuse ;
- création de `src/components/ui/ArticleSources.tsx` avec section autonome, H2 exact `Sources officielles`, id stable `sources-officielles`, liste sémantique, `details/summary` au-delà de 3 sources et indication accessible d'ouverture dans un nouvel onglet ;
- migration des 12 articles Actualités vers `KeyTakeaways` et `ArticleSources`, avec données conservées localement dans chaque fichier article près du `tableOfContents` ;
- aucun cas de contenu complémentaire hors composant n'a été nécessaire : les blocs existants rentrent dans l'API sans perte ;
- les cas comparatifs Micro-BIC et résidence principale 90 jours utilisent `ResponsiveComparisonTable`, sans nouveau système concurrent ;
- correction documentaire de `CLAUDE.md` : React 19 au lieu de React 18.

Validations exécutées :

- `npm run typecheck` : OK ;
- `npm run lint` : OK, avec une warning préexistante hors ticket dans `src/pages/SimulationClassement.tsx` sur `gridProgressSummary` ;
- `npm run test:run` : OK, 40 fichiers de tests, 365 tests ;
- `npm run build` : OK, avec warning Vite existant sur la taille d'un chunk ;
- `npm run prerender` : OK, articles Actualités inclus ;
- vérification UTF-8 sans BOM et absence de marqueurs de mojibake sur les 19 fichiers touchés : OK.

Vérification responsive documentée :

- Playwright sur build `dist`, serveur statique éphémère, viewports 390, 768, 1024 et 1440 px ;
- pages testées : Micro-BIC 2026, résidence principale 90 jours, Que faire après classement ;
- contrôles : absence d'overflow horizontal, présence des tableaux comparatifs, longues URLs de sources contenues, section sources présente, bloc repliable présent quand plus de 3 sources.

Limites restantes :

- warning lint préexistante dans `SimulationClassement.tsx`, non traitée dans ce ticket ;
- warning Vite de taille de chunk au build, non liée à la standardisation des articles.

## Objectif

Créer deux composants partagés qui conservent la souplesse des articles tout en donnant au lecteur des repères visuels constants.

---

## Partie A — Composant `KeyTakeaways`

Créer ou consolider un composant capable de gérer quatre variantes :

```ts
type KeyTakeawaysVariant = 'bullets' | 'metrics' | 'comparison' | 'warning';
```

### Variante `bullets`

Pour 3 à 5 informations courtes.

### Variante `metrics`

Pour des seuils, montants, pourcentages ou dates clés.

### Variante `comparison`

Pour comparer deux ou trois situations sans utiliser un grand tableau.

### Variante `warning`

Pour un point de vigilance majeur.

## Règles communes

- Le titre visible reste `À retenir`.
- Une seule idée par item.
- Maximum 5 items.
- Ne pas mettre plusieurs paragraphes dans un item.
- Conserver un contraste suffisant.
- Ne pas utiliser la couleur seule pour transmettre le sens.
- Une icône éventuelle doit être décorative ou posséder un label adapté.
- La variante choisie doit servir le contenu existant, sans réécrire le fond.

Migrer les blocs actuels vers la variante la plus adaptée.

---

## Partie B — Composant `ArticleSources`

Créer ou consolider un composant partagé pour la section `Sources officielles`.

### Comportement attendu

Lorsque l’article contient 3 sources ou moins :

- toutes les afficher normalement.

Lorsque l’article contient plus de 3 sources :

- afficher les 3 premières ;
- placer les autres dans un bloc repliable ;
- utiliser le libellé :

```txt
Afficher les X autres sources
```

Quand le bloc est ouvert :

```txt
Masquer les sources supplémentaires
```

Utiliser de préférence `<details>/<summary>` ou le composant `Accordion` existant si son comportement est plus adapté et accessible.

### Présentation d’une source

Afficher distinctement :

- le nom de l’organisme ;
- le titre du document ou de la page ;
- éventuellement la date ou la nature du texte lorsqu’elle est déjà disponible ;
- une indication d’ouverture externe si le lien ouvre un nouvel onglet.

Exemple :

```txt
Légifrance
Article L. 324-1-1 du Code du tourisme
```

### Contraintes

- Toutes les sources doivent rester présentes dans le DOM.
- Ne pas supprimer ou modifier les URLs.
- Ne pas modifier l’ordre éditorial des trois sources principales.
- Ne pas cacher toutes les sources par défaut.
- Ne pas transformer les sources en citations de presse.
- Ne pas modifier le fond juridique des articles.

## Critères d’acceptation

- Tous les articles utilisent le même composant `KeyTakeaways`.
- Aucun bloc `À retenir` ne dépasse 5 items.
- Les variantes sont cohérentes avec le contenu existant.
- Tous les articles utilisent le même composant de sources.
- Les trois premières sources restent visibles.
- Les sources supplémentaires sont accessibles au clavier.
- Toutes les sources sont présentes dans le HTML prerenderé.
- Les liens externes conservent leurs attributs de sécurité.

## Tests

Couvrir :

- les quatre variantes de `KeyTakeaways` ;
- la limite de 5 items ;
- les articles ayant 0, 2, 3, 4 et 10 sources ;
- l’ouverture et la fermeture du bloc ;
- le libellé dynamique ;
- la présence de toutes les sources dans le DOM.

---

# Ticket 4 — Ajouter les articles connexes et améliorer le footer éditorial

**Priorité : P1**
**Dépendances : Tickets 1 et 3**

**Statut : terminé le 2026-07-20**

## Avancement du ticket 4 — 2026-07-20

Terminé :

- ajout d'un registre central `src/content/articleAuthors.ts`, identifié par `authorId`, utilisé par les métadonnées visibles, le bloc auteur et les données structurées ;
- bascule des données structurées d'article vers `authorId`, avec mise à jour du layout global et du prerender SEO ;
- ajout de `relatedArticleSlugs` dans les métadonnées centrales des 12 articles, avec le mapping éditorial validé et l'ajustement API Meublés vers l'article général 2025-2026 ;
- ajout de `getRelatedArticles(article)` avec sélection manuelle autoritative, fallback uniquement en absence de sélection, exclusion de l'article courant, déduplication et limite à 3 articles ;
- validation des configurations de contenus connexes en test, développement et prerender, avec rendu production tolérant pour éviter une exception visible visiteur ;
- création de `ArticleRelatedArticles` avec structure `section` + `h2` + `ul/li`, liens accessibles, dates `Publié le` / `Mis à jour le`, rail mobile natif sans rotation automatique et grille desktop ;
- création de `ArticleAuthorBlock` compact sans lien auteur, avec monogramme `FG` ;
- branchement des 12 pages d'articles via props typées `relatedArticles` et `author`, sans logique éditoriale implicite dans `ArticleLayout` ;
- conservation de l'ordre de fin d'article : CTA, sources, articles connexes, bloc auteur.

Validations exécutées :

- `npm run typecheck` : OK ;
- `npm run lint` : OK, avec le warning préexistant dans `src/pages/SimulationClassement.tsx` sur `react-hooks/exhaustive-deps` ;
- `npm run test:run` : OK, 43 fichiers de tests et 374 tests passés ;
- `npm run build` : OK, avec le warning Vite existant sur des chunks supérieurs à 500 kB ;
- `npm run prerender` : OK, toutes les routes d'articles Actualités ont été générées ;
- vérification UTF-8 sans BOM et absence de marqueurs de mojibake sur les fichiers touchés : OK.

Limites restantes :

- warning lint préexistante dans `SimulationClassement.tsx`, non traitée dans ce ticket ;
- warning Vite de taille de chunk au build, non lié aux contenus connexes ni au bloc auteur ;
- refonte globale de la page `/actualites`, de `ArticleCard` et du libellé `Lire plus` conservée pour le ticket 5.

Passe de finition du ticket 4 — 2026-07-20 :

- ajout de `relatedSummary` sur les 12 articles avec les phrases courtes validées pour les cartes connexes ;
- les cartes connexes utilisent désormais `relatedSummary`, sans troncature par ellipse ni reprise des résumés longs de liste ;
- padding et typographie des cartes ajustés pour garder des hauteurs homogènes et les CTA alignés ;
- rail mobile corrigé pour conserver une partie de la carte suivante visible sans créer d'overflow horizontal global ;
- bloc auteur compacté, contraste de la biographie renforcé, largeur de lecture limitée sur desktop ;
- photo de Florian Grisorio recadrée proprement depuis la source validée et servie depuis `public/images/authors/florian-grisorio.jpg` ;
- bio auteur mise à jour sans mention du numéro Cofrac.

Validations de la passe de finition :

- `npm run typecheck` : OK ;
- `npm run lint` : OK, avec le warning préexistant dans `src/pages/SimulationClassement.tsx` sur `react-hooks/exhaustive-deps` ;
- `npm run test:run` : OK, 43 fichiers de tests et 374 tests passés ;
- `npm run build` : OK, avec le warning Vite existant sur des chunks supérieurs à 500 kB ;
- `npm run prerender` : OK ;
- vérification Playwright sur build à 390, 1024 et 1440 px : cartes équilibrées, CTA alignés, résumés en 2 à 3 lignes réelles, absence d'overflow horizontal global, carte suivante visible sur mobile.

## Objectif

Éviter que la lecture se termine sur une longue liste de sources suivie brutalement du footer du site.

Ajouter une vraie fin d’article structurée :

1. conclusion et CTA existants ;
2. sources officielles ;
3. articles connexes ;
4. bloc auteur.

## Partie A — Articles connexes

Ajouter un bloc :

```txt
À lire aussi
```

Afficher exactement 3 articles maximum.

### Sélection

Étendre les métadonnées centrales avec une configuration manuelle :

```ts
relatedArticleSlugs?: string[];
```

La sélection manuelle doit être prioritaire afin de conserver une vraie logique éditoriale.

Si aucun article connexe n’est configuré, appliquer un fallback :

1. articles de même catégorie ;
2. puis articles les plus récents ;
3. exclure l’article courant ;
4. ne jamais afficher de doublon.

### Carte

Afficher :

- catégorie ;
- titre ;
- date de publication ou de mise à jour pertinente ;
- résumé très court ;
- lien descriptif.

Le titre de l’article doit être un vrai lien.

Le lien secondaire peut afficher `Lire l’article`, mais son nom accessible doit contenir le titre complet :

```tsx
aria-label={`Lire l’article ${title}`}
```

Éviter les liens `Lire plus`.

### Responsive

Desktop :

- grille de 3 cartes.

Mobile :

- rail horizontal à défilement natif ;
- `scroll-snap` autorisé ;
- aucune rotation automatique ;
- pas de contenu masqué derrière un carrousel obligatoire ;
- le rail doit rester utilisable sans JavaScript spécifique.

Ne pas afficher d’image générique lorsque l’article n’en possède pas.

## Partie B — Bloc auteur sans page auteur

Ajouter sous les contenus associés un bloc compact.

Copy à intégrer :

```txt
Florian Grisorio

Président d’Etoilys, organisme accrédité Cofrac Inspection n°3-2394 pour le classement des meublés de tourisme. Il supervise la veille réglementaire et la rédaction des contenus publiés sur le site.
```

Le rôle et le texte doivent être centralisés dans une petite source de données réutilisable, pas répétés dans chaque article.

Le bloc peut utiliser :

- une photo existante, si elle est disponible et adaptée ;
- sinon un monogramme `FG`.

Ne pas créer de lien vers une page auteur.

Ne pas créer de nouvelle route.

## Critères d’acceptation

- Chaque article affiche jusqu’à 3 contenus connexes.
- L’article courant n’est jamais proposé.
- Aucun doublon n’est affiché.
- Le fallback fonctionne lorsqu’aucune sélection manuelle n’existe.
- Les liens possèdent un nom accessible explicite.
- Le rail mobile ne défile jamais automatiquement.
- Le bloc auteur apparaît sur tous les articles.
- Aucun lien vers une page auteur n’est présent.
- Aucune nouvelle route auteur n’est créée.
- Les articles associés sont disponibles dans le prerender.

## Tests

Couvrir :

- la sélection manuelle ;
- le fallback par catégorie ;
- l’exclusion de l’article courant ;
- l’absence de doublon ;
- le maximum de 3 cartes ;
- le nom accessible des liens ;
- le rendu du bloc auteur sans lien.

---

# Ticket 5 — Repenser la page `/actualites`

**Priorité : P1**

**Statut : terminé le 2026-07-20**

## Avancement du ticket 5 — 2026-07-20

Terminé :

- refonte de `/actualites` avec un article principal affiché uniquement sur l'état `Tous` ;
- sélection de l'article principal par date de publication décroissante, sans propriété `featured` et sans tenir compte de `updatedAt` ;
- ajout de filtres typés `Tous`, `Classement`, `Fiscalité`, `Réglementation`, `Obligations` et `Guides pratiques`, synchronisés avec `?categorie=...` ;
- normalisation des paramètres `categorie` inconnus vers `/actualites` avec navigation `replace` ;
- conservation de la canonical `/actualites`, sans nouvelle route ni injection SEO locale ;
- création de cartes dédiées à la page Actualités, sans modifier `ArticleCard` utilisé sur la home ;
- cartes de liste et carte principale basées sur `excerpt`, pas sur `relatedSummary` ;
- affichage d'une seule date par carte : `Mis à jour le` lorsque `updatedAt` diffère de `publishedAt`, sinon `Publié le` ;
- remplacement de `Lire plus` par `Lire l’article` sur les nouvelles cartes Actualités, avec nom accessible incluant le titre ;
- cartes non entièrement cliquables : titre lien réel et CTA séparé, sans liens imbriqués ;
- état vide exact pour les catégories sans article, avec bouton `Voir toutes les actualités` ;
- règles responsive intégrées : filtres flexibles sans scroll horizontal global attendu, carte principale en une colonne mobile, image à ratio stable, aucune colonne image vide, `priority` seulement sur l'image principale.

Validations exécutées :

- `npm run typecheck` : OK ;
- tests ciblés `npx vitest run src/content/actualitesArticles.test.ts src/pages/Actualites.test.tsx` : OK, 14 tests passés ;
- `npm run lint` : OK, avec le warning préexistant dans `src/pages/SimulationClassement.tsx` sur `react-hooks/exhaustive-deps` ;
- `npm run test:run` : OK, 44 fichiers de tests et 383 tests passés ;
- `npm run build` : OK, avec le warning Vite existant sur des chunks supérieurs à 500 kB ;
- `npm run prerender` : OK, `/actualites` et les articles Actualités ont été générés ;
- vérification UTF-8 sans BOM et absence de marqueurs de mojibake sur les fichiers touchés : OK.

Limites restantes :

- warning lint préexistant dans `SimulationClassement.tsx`, non traité dans ce ticket ;
- warning Vite de taille de chunk au build, non lié à la refonte de `/actualites` ;
- vérification visuelle Playwright aux largeurs 390, 768, 1024 et 1440 px non relancée dans ce ticket.

Passe corrective haut de page — 2026-07-20 :

- introduction sous le H1 remplacée par : `Décryptages, guides pratiques et informations utiles sur le classement et la réglementation des meublés de tourisme.` ;
- hauteur du hero et espacement avant les filtres réduits pour faire remonter l'article principal dans le premier écran ;
- ajout de l'intitulé discret `Explorer les actualités` au-dessus des filtres ;
- suppression du filtre visible `Classement`, tout en conservant la gestion défensive d'une URL directe `?categorie=classement`.

Validations de la passe corrective :

- `npm run typecheck` : OK ;
- tests ciblés `npx vitest run src/pages/Actualites.test.tsx src/content/actualitesArticles.test.ts` : OK, 14 tests passés.

## Objectif

Donner plus de hiérarchie à la page liste sans ajouter un moteur de recherche, une pagination ou une usine à gaz destinée à douze articles.

## Fichiers à inspecter

- page `Actualites`
- `src/content/actualitesArticles.ts`
- composants de cartes existants
- `SmartImage`
- tests de routes et de rendu
- styles de grille et conteneurs existants

## Partie A — Article principal

Sur l’état `Tous`, mettre en avant un article principal.

Ajouter une propriété optionnelle :

```ts
featured?: boolean;
```

Règles :

- un seul article peut être explicitement `featured` ;
- si aucun ne l’est, utiliser l’article publié le plus récemment ;
- si plusieurs articles sont marqués par erreur, échouer en développement ou utiliser une validation testée ;
- ne pas dupliquer l’article principal dans la grille située juste dessous.

Contenu de la carte principale :

- catégorie ;
- H2 ou titre de carte ;
- chapô ou résumé ;
- date ;
- date de mise à jour si pertinente ;
- temps de lecture ;
- image de couverture lorsqu’elle existe ;
- lien explicite vers l’article.

Ne pas créer d’image décorative de remplacement.

## Partie B — Filtres

Ajouter les filtres :

- Tous
- Classement
- Fiscalité
- Réglementation
- Obligations
- Guides pratiques

Utiliser des boutons avec `aria-pressed`, pas des liens déguisés en onglets sans sémantique correcte.

Synchroniser le filtre avec un paramètre :

```txt
/actualites?categorie=fiscalite
```

Règles :

- `Tous` supprime le paramètre ;
- un paramètre inconnu revient à `Tous` ;
- la canonical reste `/actualites` ;
- le filtrage reste côté client ;
- ne pas créer de nouvelle route indexable.

Lorsque la catégorie `Tous` est active :

- afficher la carte principale ;
- afficher les autres articles dans la grille.

Lorsqu’une catégorie spécifique est active :

- masquer la carte principale séparée ;
- afficher tous les articles correspondant au filtre dans la grille, y compris l’article marqué `featured` s’il appartient à la catégorie.

## Partie C — Cartes standards

Chaque carte doit afficher :

- catégorie ;
- titre ;
- résumé ;
- date de publication ;
- `Mis à jour le` si la mise à jour est plus pertinente ;
- temps de lecture ;
- image uniquement si disponible.

Le titre doit être un vrai lien.

Remplacer `Lire plus` par :

```txt
Lire l’article
```

Ajouter un nom accessible comprenant le titre complet.

Éviter de rendre toute la carte cliquable si cela crée des liens imbriqués. Privilégier un lien étendu correctement implémenté ou un titre cliquable accompagné d’un CTA.

## État vide

Lorsqu’une catégorie ne contient aucun article, afficher :

```txt
Aucun article n’est encore publié dans cette catégorie.
```

Puis un bouton :

```txt
Voir toutes les actualités
```

## Critères d’acceptation

- La page `Tous` comporte un article principal clairement identifiable.
- Cet article n’est pas dupliqué dans la grille.
- Les filtres sont synchronisés avec l’URL.
- Le retour arrière du navigateur restaure le bon filtre.
- La canonical ne change pas selon le filtre.
- Les cartes affichent les dates de mise à jour lorsqu’elles existent.
- Aucun lien `Lire plus` ne subsiste.
- Aucun moteur de recherche ou système de pagination n’est ajouté.
- La page reste lisible à 390, 768, 1024 et 1440 px.
- Aucun filtre ne provoque de déplacement brutal ou de débordement horizontal.

## Tests

Couvrir :

- le choix de l’article principal ;
- la validation d’un seul `featured` ;
- l’absence de duplication ;
- tous les filtres ;
- les paramètres inconnus ;
- le bouton `Tous` ;
- l’historique du navigateur ;
- l’état vide ;
- les labels accessibles des liens.

---

# Ticket 6 — Renforcer l’accessibilité et le responsive des composants éditoriaux

**Priorité : P2**
**Dépendances : Tickets 1 à 5**

## Objectif

Faire une passe transversale sur tous les composants utilisés dans les articles et sur la page Actualités.

Ce ticket ne doit pas modifier le design pour le plaisir. Il doit corriger les problèmes concrets d’accessibilité, de navigation clavier et de lisibilité mobile.

## Périmètre

Auditer au minimum :

- shell d’article ;
- sommaire ;
- blocs `À retenir` ;
- sources ;
- cartes d’articles ;
- filtres ;
- articles connexes ;
- bloc auteur ;
- `ResponsiveComparisonTable` ;
- accordéons utilisés dans les articles ;
- CTA ;
- liens externes ;
- composants visibles uniquement sur desktop ou mobile.

## Tableaux

Faire évoluer `ResponsiveComparisonTable` plutôt que créer des composants concurrents.

Il doit permettre :

- un `<caption>` lisible ou visuellement masqué ;
- de vrais `<th>` ;
- `scope="col"` et `scope="row"` selon les cas ;
- une lecture correcte au clavier et au lecteur d’écran ;
- une version mobile sans zoom horizontal excessif ;
- des cellules courtes, sans paragraphes interminables.

Si une version tableau desktop et une version cartes mobile coexistent :

- une seule version doit être exposée aux technologies d’assistance selon le breakpoint ;
- la version masquée doit réellement être retirée du flux et de l’arbre d’accessibilité ;
- éviter que le même contenu soit lu deux fois.

## Headings

- Un seul H1.
- Aucun saut incohérent de niveau.
- Les H2 doivent suivre le H1.
- Les H3 doivent dépendre d’un H2.
- Les titres ne doivent pas être utilisés uniquement pour leur taille visuelle.

## Contrôles interactifs

Garantir :

- focus visible ;
- navigation clavier complète ;
- activation avec Entrée ou Espace lorsque pertinente ;
- taille tactile cible d’environ 44 × 44 px ;
- labels accessibles ;
- absence de `div` cliquable sans rôle ;
- état ouvert/fermé annoncé ;
- `aria-expanded` lorsque nécessaire.

## Responsive

Vérifier spécifiquement :

- absence de scroll horizontal global à 390 px ;
- tableaux ;
- métadonnées d’article ;
- cartes ;
- badges ;
- filtres ;
- sommaire ;
- boutons flottants ;
- longues URLs de sources ;
- longs titres d’articles.

Les longues URLs ne doivent pas dépasser de leur conteneur.

## Mouvement

Respecter `prefers-reduced-motion` pour :

- scroll fluide ;
- barre de progression ;
- apparition du bouton retour en haut ;
- transitions de filtres ;
- accordéons.

## Critères d’acceptation

- Tous les contrôles sont accessibles au clavier.
- Aucun contenu dupliqué n’est lu deux fois à cause des variantes responsive.
- Les tableaux possèdent leurs en-têtes et captions.
- Il n’existe aucun débordement horizontal global sur mobile.
- Les focus restent visibles.
- Les cibles tactiles sont suffisamment grandes.
- Les couleurs ne sont jamais le seul moyen de transmettre une information.
- Les articles restent compréhensibles sans icône.
- Les utilisateurs ayant réduit les animations ne subissent pas de mouvement forcé.

## Tests

Ajouter des tests Testing Library sur :

- les rôles et labels ;
- les états `aria-expanded` et `aria-pressed` ;
- les captions et headers de tableaux ;
- les liens externes ;
- l’absence de duplication accessible ;
- la navigation clavier des principaux composants.

Compléter par une vérification manuelle aux largeurs :

- 390 px ;
- 768 px ;
- 1024 px ;
- 1440 px.

---

# Ticket 7 — Ajouter les utilitaires de lecture

**Priorité : P3**
**Dépendance : Ticket 1**

## Objectif

Ajouter trois aides discrètes :

- progression de lecture ;
- copie du lien ;
- retour en haut.

Ne pas ajouter de barre de partage social.

---

## Partie A — Barre de progression

Ajouter une barre très discrète sous le header fixe.

Règles :

- uniquement sur les pages d’article ;
- progression calculée à partir du contenu principal de l’article, pas du footer complet ;
- largeur de 0 à 100 % ;
- pas de texte visible ;
- composant purement décoratif avec `aria-hidden="true"` ;
- aucun déplacement de layout ;
- couleur issue des tokens existants ;
- désactiver ou simplifier les animations avec `prefers-reduced-motion`.

Le calcul doit être performant :

- listener passif ;
- `requestAnimationFrame` si nécessaire ;
- aucun `setState` inutile à chaque pixel ;
- nettoyage correct au démontage.

## Partie B — Copier le lien

Ajouter un bouton près des métadonnées ou au début de la zone de partage :

```txt
Copier le lien
```

Après succès :

```txt
Lien copié
```

Utiliser le composant `Toast` existant.

Prévoir un fallback propre si `navigator.clipboard` n’est pas disponible.

Le lien copié doit être l’URL canonique de l’article, sans paramètre de tracking inutile.

Ne pas afficher l’URL brute.

## Partie C — Retour en haut

Sur mobile, afficher un bouton flottant après un seuil de défilement raisonnable, par exemple 800 px.

Règles :

- caché avant le seuil ;
- ne pas masquer le CTA, le bandeau cookies ou d’autres actions ;
- zone tactile suffisante ;
- label accessible :

```txt
Retour en haut de l’article
```

- retour au début du contenu éditorial ou au H1 ;
- respecter `prefers-reduced-motion`.

Sur desktop, le bouton peut rester absent puisque le sommaire sticky offre déjà une navigation.

## Critères d’acceptation

- La barre n’apparaît que sur les articles.
- Elle atteint 100 % à la fin du contenu principal.
- Elle ne mesure pas le footer comme du contenu éditorial.
- Le bouton copie la bonne URL.
- Un toast confirme l’action.
- Le fallback clipboard ne provoque pas d’erreur.
- Le bouton retour en haut est mobile uniquement.
- Aucun composant ne recouvre la bannière cookies.
- Aucun décalage de mise en page n’est introduit.

## Tests

Couvrir :

- le calcul de progression avec valeurs bornées ;
- la copie réussie ;
- l’échec clipboard ;
- l’affichage du toast ;
- le seuil du bouton retour en haut ;
- son label accessible ;
- l’absence des utilitaires sur les autres pages.

---

# Ticket 8 — Instrumenter l’expérience Actualités dans PostHog

**Priorité : P3**
**Dépendances : Tickets 2, 4, 5 et 7**

## Objectif

Mesurer si les nouvelles fonctions améliorent réellement la navigation, au lieu de conclure qu’elles sont formidables parce qu’elles ont de jolies bordures arrondies.

## Contraintes générales

- Utiliser exclusivement `src/utils/analytics.ts` et les helpers existants.
- Respecter le consentement analytics actuel.
- Ne jamais envoyer de donnée personnelle.
- Ne pas déclencher d’événement lorsque le consentement requis n’est pas accordé.
- Centraliser les noms et propriétés autant que possible.
- Éviter les événements dupliqués.

## Événements à ajouter

### `article_toc_clicked`

Propriétés :

```ts
{
  article_slug: string;
  article_category: string;
  heading_id: string;
  heading_label: string;
}
```

### `article_related_clicked`

Propriétés :

```ts
{
  article_slug: string;
  target_article_slug: string;
  position: 1 | 2 | 3;
}
```

### `article_source_expanded`

Déclencher uniquement lors de l’ouverture.

Propriétés :

```ts
{
  article_slug: string;
  hidden_source_count: number;
}
```

### `article_cta_clicked`

Propriétés :

```ts
{
  article_slug: string;
  cta_label: string;
  target_path: string;
  cta_position: string;
}
```

Ne pas intercepter indistinctement tous les liens. Identifier explicitement les CTA éditoriaux concernés.

### `article_scroll_75`

Déclencher une seule fois par affichage d’article lorsque 75 % du contenu principal a été lu.

Propriétés :

```ts
{
  article_slug: string;
  article_category: string;
  reading_time_minutes: number;
}
```

### `actualites_filter_used`

Propriétés :

```ts
{
  selected_category: string;
  previous_category: string;
  visible_article_count: number;
}
```

Ne pas déclencher au premier rendu si l’utilisateur n’a effectué aucune action, sauf décision déjà cohérente avec les conventions analytics du projet.

### `article_copy_link_clicked`

Propriétés :

```ts
{
  article_slug: string;
  success: boolean;
}
```

### `article_back_to_top_clicked`

Propriétés :

```ts
{
  article_slug: string;
  scroll_depth_percent: number;
}
```

## Événements explicitement exclus

Ne pas ajouter :

- `article_checklist_printed` ;
- événement d’export PDF ;
- événements propres à un calculateur ;
- événements propres à un arbre de décision ;
- données contenant le nom ou l’email du visiteur.

## Critères d’acceptation

- Tous les événements passent par l’utilitaire analytics existant.
- Aucun événement ne part avant le consentement requis.
- `article_scroll_75` ne se déclenche qu’une fois.
- L’ouverture puis la fermeture des sources ne crée pas plusieurs événements d’ouverture.
- Les propriétés sont cohérentes sur tous les articles.
- Aucun titre complet ou contenu juridique n’est envoyé inutilement.
- Les événements sont documentés dans la documentation analytics existante ou dans un fichier dédié cohérent avec le repo.

## Tests

Mocker l’utilitaire analytics et vérifier :

- le nom de chaque événement ;
- les propriétés ;
- l’absence de déclenchement sans consentement ;
- l’unicité de `article_scroll_75` ;
- l’absence d’événement au chargement du filtre si aucune action n’a eu lieu.

---

# Ticket 9 — Migrer tous les articles et effectuer la QA finale

**Priorité : P1 pour la mise en production**
**Dépendances : Tickets 1 à 8**

## Objectif

Appliquer le nouveau socle à tous les articles existants, supprimer les anciennes implémentations devenues inutiles et vérifier les non-régressions.

## Migration

Pour chaque article actif :

- renseigner sa catégorie ;
- vérifier `publishedAt` et `updatedAt` sans modifier arbitrairement les dates ;
- vérifier le temps de lecture ;
- migrer le header vers le shell commun ;
- ajouter la configuration de sommaire lorsqu’elle est requise ;
- migrer le bloc `À retenir` ;
- migrer les sources ;
- ajouter trois contenus connexes pertinents ;
- afficher le bloc auteur ;
- vérifier le CTA final ;
- conserver l’intégralité de la copy ;
- conserver les liens internes et externes ;
- conserver les tableaux et composants métier existants.

Ne pas profiter de cette migration pour corriger ou enrichir le fond des articles.

## Nettoyage

Supprimer uniquement :

- les composants rendus inutiles par la migration ;
- les styles dupliqués ;
- les anciennes structures identiques recopiées dans chaque article ;
- les métadonnées locales désormais centralisées.

Ne pas supprimer un composant partagé sans avoir vérifié toutes ses utilisations dans le repo.

## QA visuelle

Contrôler chaque article au minimum sur :

- 390 × 844 ;
- 768 × 1024 ;
- 1024 × 768 ;
- 1440 × 900.

Vérifier :

- H1 ;
- métadonnées ;
- chapô ;
- `À retenir` ;
- sommaire ;
- tableaux ;
- accordéons ;
- sources ;
- CTA ;
- articles connexes ;
- auteur ;
- footer ;
- bannière cookies ;
- liens longs ;
- titres longs.

## QA fonctionnelle

Vérifier :

- chaque lien de sommaire ;
- chaque fragment d’URL ;
- chaque filtre ;
- le retour arrière navigateur ;
- chaque article connexe ;
- la copie du lien ;
- le retour en haut ;
- l’ouverture des sources ;
- les événements analytics ;
- la navigation clavier ;
- les liens externes ;
- les routes traduites existantes.

## QA SEO

Vérifier :

- H1 unique ;
- canonical inchangée ;
- `datePublished` cohérente ;
- `dateModified` cohérente ;
- auteur cohérent ;
- `BlogPosting` toujours présent ;
- breadcrumbs JSON-LD conservés ;
- aucun article indexable absent du sitemap ;
- aucune nouvelle route accidentelle ;
- contenu intégral dans le prerender ;
- pas de lien interne cassé.

## QA performance

Vérifier au minimum :

- absence de CLS introduit par la barre de progression, le sommaire ou les images ;
- absence de listener scroll non nettoyé ;
- absence de calcul coûteux répété ;
- pas de dépendance lourde ajoutée ;
- aucune image critique externe introduite ;
- bundle non dégradé de manière disproportionnée.

## Critères d’acceptation

- Tous les articles actifs utilisent le nouveau socle.
- La page Actualités utilise les nouvelles métadonnées.
- Aucun article ne perd de contenu.
- Aucun lien n’est cassé.
- Aucun débordement horizontal global n’apparaît.
- Les tests existants restent verts.
- Les nouveaux tests restent verts.
- Le sitemap et le prerender sont valides.
- Aucune page auteur, checklist imprimable, export PDF ou composant métier spécialisé n’a été ajouté.

## Commandes finales obligatoires

```bash
npm run typecheck
npm run lint
npm run test:run
npm run build
npm run build:seo
npm run seo:sitemap
npm run prerender
```

Fournir à la fin :

1. la liste des fichiers créés ;
2. la liste des fichiers modifiés ;
3. la liste des composants supprimés ;
4. les résultats des commandes ;
5. les éventuelles limites restantes ;
6. plusieurs captures ou une description précise des rendus vérifiés aux quatre largeurs demandées.
