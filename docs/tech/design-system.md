# Socle visuel du site public

Le socle ETOILYS-395 porte les primitives premium communes aux pages cœur et aux pages locales V6. Les implémentations courantes Dordogne et Bergerac sont les références locales V6 : Dordogne pour le département, Bergerac pour la ville. Les anciens spikes et SHA ne servent plus que d’historique.

## Mode D'Emploi Durable

### Tokens Et Cadre

- Les variables `--color-*` de `src/index.css` définissent la palette. Tailwind expose `ink`, `muted`, `paper`, `surface`, `surface-neutral`, `surface-warm`, `surface-sage`, `copper`, `ink-hover` et `surface-hover`.
- `container-editorial` fixe la largeur éditoriale commune : 1240 px maximum, marges de 48 px, 32 px jusqu'à 1150 px et 20 px jusqu'à 680 px.
- `editorial-heading`, `editorial-title`, `editorial-link`, `editorial-inline-link`, `editorial-section` et les tons de surface sont des primitives partagées, pas des variantes de route.
- Le focus cuivre reste le comportement par défaut sur fond clair. Les surfaces `ink` utilisent `editorial-focus-inverse`, avec un contour `paper`. Les champs en erreur gardent leurs styles `ui-field-error`.
- `Button` conserve ses variantes, tailles, navigation et événements analytics. Pour changer le rendu d'un CTA, ajouter une classe contextuelle partagée sans changer `variant`, `href` ni le libellé analytics dérivé. Si un changement d'apparence impose de changer `variant`, passer `analyticsId` avec l'identifiant historique calculé. `analyticsId` ne doit jamais être rendu comme attribut DOM ; sans cette prop, le fallback historique complet reste la source de vérité.

### Assets De Marque

- Le logo principal UI est `/logo-etoilys-editorial.svg`. Son cartouche monogramme utilise `#285764` (`ink-hover`), le wordmark `#173D49` (`ink`) et la lettre claire `#FFFDF7`.
- Le cuivre `#A65E36` est réservé aux accents d'interface ; il ne doit pas devenir une couleur principale du logo.
- Les favicons reprennent le monogramme avec un fond `#285764` et un symbole `#FFFDF7`.

### Besoin → Composant → Règle D'Usage

| Besoin                       | Composant ou classe                                | Règle d'usage                                                                                                                                                          |
| ---------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero textuel                 | `PageHero` sans `media`                            | Utiliser pour les pages cœur simples. Le SEO reste centralisé dans `Layout`, pas dans la page.                                                                         |
| Hero compact                 | `PageHero size="compact"`                          | Utiliser pour les pages denses comme FAQ, Prérequis ou Procédure.                                                                                                      |
| Hero avec visuel             | `PageHero` + `EditorialHeroMedia`                  | Réserver aux compositions éditoriales fortes. Garder le slot `media`, les crops via `imageClassName`, et l'image LCP via `SmartImage`.                                 |
| Note de classement           | `ClassificationHeroNote`                           | API actuelle : `lead`, `title`, `caption`. Sert au cartouche commun Home/Dordogne, sans dictionnaire local dans `Home.tsx`.                                            |
| Réassurance hero             | `HeroReassurance`                                  | Liste courte, verticale, coche cuivre, contenu passé par la page.                                                                                                      |
| Navigation de section        | `SectionNav`, ancres, `editorial-anchor`           | Les liens pointent vers des `id` existants. Le décalage sous header passe par `scroll-margin-top` et `--etoilys-header-height`.                                        |
| Trois preuves                | `ProofStrip`                                       | Toujours trois preuves. Fond `paper` dans la primitive, proportions Dordogne, valeur `5` lisible par les lecteurs d'écran.                                             |
| Timeline horizontale         | `Timeline layout="horizontal"`                     | Trois étapes, colonnes dès 681 px, stack compact sous 680 px. Utilisée Home/Dordogne.                                                                                  |
| Timeline verticale           | `Timeline` par défaut                              | Garder pour les procédures détaillées ou parcours longs, sans reprendre le rendu horizontal.                                                                           |
| Carte bénéfice               | `FeatureCard`                                      | Densité Dordogne par défaut, lien aligné en bas. Ne pas ajouter de variante locale pour Home/Dordogne.                                                                 |
| Grille de cartes             | `editorial-feature-grid`                           | Grille de trois cartes bénéfices, gap 22 px desktop, 14 px tablette, une colonne mobile.                                                                               |
| FAQ et listes repliables     | `Accordion`                                        | Single-open, `hidden`, ARIA via `useId`. `density="compact"` reprend la FAQ Dordogne.                                                                                  |
| CTA final                    | `PageCta`                                          | Fond `ink`, focus inverse. `density="compact"` pour la composition Dordogne. Les boutons gardent leurs variantes analytics.                                            |
| Tableau comparatif éditorial | `ResponsiveComparisonTable appearance="editorial"` | Utiliser explicitement l'apparence éditoriale quand le tableau appartient à une page éditoriale. Ce n'est pas encore le défaut global.                                 |
| Article d'actualité          | `ArticleLayout` + composants article               | Garder le shell existant, les ancres et l'ordre éditorial. Les encarts directs utilisent les classes article partagées de `src/index.css`.                             |
| Carte d'actualité            | `ActualitesArticleCard`, `FeaturedActualiteCard`   | Garder une enveloppe `<article>` et un seul `Link` React Router couvrant toute la carte. Le libellé accessible vient du titre ; le CTA visible est un `span`.          |
| Split éditorial              | `editorial-split`                                  | Deux colonnes texte/contenu pour introductions et comparaisons, sans card imbriquée.                                                                                   |
| Faits clés                   | `editorial-facts`                                  | Liste de chiffres ou statuts courts en `dl`, avec séparation horizontale.                                                                                              |
| Notice éditoriale            | `editorial-notice`                                 | Bloc d'attention neutre, bord cuivre.                                                                                                                                  |
| Résultat favorable           | `editorial-positive`                               | Bloc positif, fond `ink/5`, libellé explicite.                                                                                                                         |
| Formulaire éditorial         | `editorial-form`                                   | Enveloppe légère pour les formulaires cœur. Ne pas imposer une densité landing page aux formulaires et simulateurs.                                                    |
| Liens inline                 | `editorial-inline-link`                            | Pour les liens dans les paragraphes. Garde le focus clavier et l'underline lisible.                                                                                    |
| Liens inline article         | `article-inline-link`                              | Pour les liens dans le corps d'un article. Les titres de cartes et liens d'action fixent explicitement `text-ink`/`editorial-link` pour ne pas hériter du bleu global. |
| Liens d'action               | `editorial-link`                                   | Pour les actions secondaires éditoriales avec icône, notamment dans les blocs expertise et procédure.                                                                  |
| Bouton inversé               | `editorial-inverse-button`                         | À combiner avec une variante `Button` existante sur fond sombre. Ne change pas l'analytics.                                                                            |
| Focus fond clair/sombre      | `ui-focus`, `editorial-focus-inverse`              | `ui-focus` donne le cuivre sur clair. `editorial-focus-inverse` donne le contour `paper` sur `ink`. Les règles locales Dordogne ne doivent pas l'écraser.              |

### Actualités Et Articles

- `/actualites` utilise un hero textuel compact et des cartes cliquables sur toute leur surface. Ne pas réintroduire de liens imbriqués dans les cartes : un seul `Link` par carte, dans une enveloppe `<article>`.
- Les titres de cartes actualités, le sommaire, les liens d'articles connexes et les liens inline d'article fixent leurs couleurs via la palette `ink`/`muted`/`copper`. Ils ne doivent pas dépendre du style global `a` historique.
- Le rail de progression de lecture appartient à `ArticleReadingUtilities`. Il se cale sous `--etoilys-header-height`, reste masqué à zéro et mesure uniquement la zone éditoriale principale.
- Les tableaux d'articles passent par `ResponsiveComparisonTable appearance="editorial"` dès que l'API conserve la structure, les données, captions, en-têtes et contenus accessibles. Pour les tableaux denses à cinq colonnes dans une page article avec sommaire, empiler avant desktop large (`xl`) plutôt que masquer un overflow horizontal.
- Le défaut global de `ResponsiveComparisonTable` reste volontairement historique pour les consommateurs non éditoriaux. L'inventaire post-ETOILYS-397 ne conserve aucun `<table>` natif dans `src/pages/actualites/*` ; les vieux tokens restants identifiés sont le style global `a`, le mode par défaut du tableau responsive et les états sémantiques warning/validation hors refonte.

### Exemples Courts

Hero éditorial Home/Dordogne :

```tsx
<PageHero
  eyebrow={content.hero.eyebrow}
  eyebrowMarked
  title={...}
  description={content.hero.description}
  media={
    <EditorialHeroMedia
      assetKey="homeHero"
      alt={content.hero.imageAlt}
      note={<ClassificationHeroNote {...content.hero.photoNote} />}
    />
  }
/>
```

Timeline courte Home/Dordogne :

```tsx
<Timeline
  layout="horizontal"
  steps={content.procedure.steps.map((step, index) => ({ ...step, number: index + 1 }))}
/>
```

CTA final sur fond sombre :

```tsx
<PageCta title={content.finalCta.title} description={content.finalCta.description}>
  <Button
    href={content.finalCta.cta.href}
    variant="primary"
    size="lg"
    className="editorial-inverse-button editorial-hero-cta"
  >
    {content.finalCta.cta.label}
  </Button>
</PageCta>
```

### Simulateurs De Comparaison

Les deux simulateurs utilisent les primitives CSS `simulator-*` de `src/index.css`, avec les tokens existants. Aucun moteur de formulaire ni nouveau jeu de tokens : les calculs, exports et états restent dans leurs domaines.

- `simulator-page` et `simulator-intro` donnent une introduction compacte ; `simulator-workspace` juxtapose saisie et résultat dès 1024 px, puis les ordonne verticalement sur tablette et mobile.
- `simulator-form-panel`, `simulator-fieldset`, `simulator-field-grid` et `simulator-field-unit` composent les champs. Les groupes gardent leurs `fieldset` / `legend`, labels et erreurs associées. `simulator-rate-options` habille des radios natifs : flèches clavier, focus visible et coche de sélection.
- `simulator-result-panel` reçoit le chiffre principal (`simulator-result-value`), puis la comparaison en `dl` (`simulator-comparison`). Les catégories de classement sont une liste de lignes séparées, sans cartes imbriquées.
- `simulator-result-toolbar` et `simulator-tool-link` réduisent le poids visuel des actions `Button` sans changer leurs variantes ni leurs identifiants analytics.
- `simulator-disclosure` habille `details` / `summary` natifs. Garder les avertissements qui influencent la lecture hors des disclosures ; réserver celles-ci au détail du calcul, à la méthode et aux sources. Le tableau existant reste sémantique et bascule selon la largeur disponible du panneau, via une container query.
- Les champs et actions principales offrent au moins 44 px de cible tactile. Les transitions et le défilement des pages respectent `prefers-reduced-motion`.

- `SimulatorNextSteps` partage le CTA final des deux simulateurs : panneau `ink`, demande de classement principale et autre simulateur secondaire. Les variantes historiques des boutons conservent les identifiants analytics ; le texte FR/EN reste centralisé.
- Les exports fiscal et taxe de séjour utilisent `comparisonReportPdf` : synthèse, paramètres, comparaison, méthode et sources. La palette provient des variables CSS du DS, le logo est éditorial ; les fontes PDF natives assurent une lecture hors ligne. Les deux CTA PDF pointent vers le site public, avec les paramètres du dernier calcul pour reprendre la simulation. Le contenu long est paginé, sans couper les lignes du tableau.

## Frontières De Migration

- **ETOILYS-395** : socle premium, pages cœur, Home/Dordogne harmonisées, amorce des enveloppes de formulaires via `editorial-form`.
- **ETOILYS-396** : terminer les formulaires et simulateurs. Ne pas leur imposer la densité visuelle d'une landing page ; préserver leurs exigences d'état, validation, API, Turnstile et accessibilité.
- **ETOILYS-396** couvre aussi les états transverses des outils interactifs : `Toast`, enveloppe Turnstile, combobox/listbox, dialogs, tabs et comparatifs. Les états succès, avertissement et erreur restent sémantiques ; les usages décoratifs ou de marque migrent vers `ink`, `paper`, `surface` et `copper`.
- **ETOILYS-414** : les routes locales publiques Dordogne, Bergerac, Gironde, Bordeaux et Lot-et-Garonne passent par `LocalLandingPageV6` via les wrappers fins `CityLandingPage` / `DepartmentLandingPage`. Voir `docs/tech/local-framework-v6.md`.
- En V6 locale, `editorial-notice` occupe la largeur du conteneur éditorial, avec son texte limité en lecture. Une notice est rendue sur `bg-paper`; la FAQ qui suit bascule sur `bg-surface-neutral` pour conserver l’alternance des surfaces.

### Workspace De Classement

L’export de classement utilise `simulationClassementPdf`, chargé à la demande depuis `simulatorExport`. Il reprend les codes des PDF fiscal et taxe de séjour : logo éditorial, fond `paper`, titres serif, surfaces `sage`, accents `copper` et panneau d’actions `ink`. Les trois exports partagent `getSimulatorPdfPalette`, qui lit les variables CSS et conserve leurs valeurs de repli pour les contrôles hors navigateur. Aucune police ni dépendance supplémentaire.

Le compte rendu comprend une synthèse avec les deux CTA, les scores backend détaillés, les critères obligatoires non validés, les pièces et un relevé complet des réponses par chapitre. Les valeurs absentes restent distinctes de zéro ; les statuts backend priment sur ceux du modèle. Les tableaux répètent leurs en-têtes et évitent de couper les lignes entre deux pages ; chaque page porte la date d’édition, la mention indicative et sa pagination. Le lien de reprise utilise le domaine public et l’identifiant encodé de la simulation ; une mention rappelle que la reprise dépend du navigateur d’origine. Le clic conserve les conditions d’export et l’analytics existants.

Le classement reprend `simulator-page`, `simulator-intro`, les champs natifs, `simulator-tool-link`, `simulator-warning`, `simulator-disclosure` et `simulator-next`. Il conserve une composition propre au parcours long, sans reprendre le split saisie/résultat des simulateurs de comparaison.

- `classement-journey` présente trois tabs libres, avec résumé, sélection et état terminé. Les trois vues restent accessibles sur mobile ; ce rail ne devient pas sticky. Conserver le roving tabIndex, les flèches, Home/End et les associations tab/panel.
- Les fiches `classement-piece` présentent les surfaces et couchages sans sous-cartes. `classement-home-summary` rassemble les quatre indicateurs du logement ; les avertissements restent visibles et non bloquants.
- La grille utilise des rangées `classement-criterion` regroupées par rubrique. Le sommaire reste sticky sur desktop et devient un select natif sur mobile. Les réponses ont une cible de 44 px minimum, une sélection explicite et leurs valeurs métier inchangées.
- L’édition de pièce et l’aide sont des dialogs latéraux sur desktop, des panneaux bas sur mobile. Ils contiennent le focus, se ferment avec Escape, restaurent le focus au déclencheur et bloquent le défilement de la page. Le contenu reste défilable sur petit écran.
- `classement-result` hiérarchise verdict, scores backend et corrections ; les détails ne concurrencent pas le verdict. Le CTA officiel reprend le panneau partagé `simulator-next`.

Ces patterns utilisent uniquement les tokens existants, avec leurs styles dans `src/index.css`. Aucune nouvelle variante de `Button`, aucun changement d’identifiant analytics, aucun moteur de formulaire ou de persistance. Garder les imports CSS au point d’entrée de l’application pour que les composants restent compatibles avec le prérendu Node.

## Compte Rendu Daté Des Validations

### 2026-09-15 - Passe ETOILYS-395

- `npm.cmd run typecheck` : OK sur les passes successives du spike.
- Les validations élargies déjà exécutées pendant la passe post-review incluaient lint et tests ciblés, avec l'avertissement préexistant `src/pages/SimulationClassement.tsx:970 react-hooks/exhaustive-deps`.
- Les tests ciblés historiques couvraient notamment `Accordion`, `ProofStrip`, `core-pages` et le layout Dordogne.
- Certains suivis ont été limités à `typecheck` à la demande explicite ; dans ces cas, Playwright, `build:seo`, `verify:i18n-release` et la suite complète n'ont pas été relancés.

### Points À Surveiller

- Le fallback 404 reste `noindex,follow`.
- Les routes actives doivent rester couvertes par `src/content/seoRoutes.ts`.
- Les images critiques doivent continuer à passer par `SmartImage` et le manifeste d'images.
- Les références visuelles locales sont les pages V6 courantes Dordogne et Bergerac ; les composants restaurés doivent vivre dans les primitives partagées, pas dans de nouveaux forks locaux.
