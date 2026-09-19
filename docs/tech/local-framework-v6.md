# Framework local V6

ETOILYS-414 termine la migration des pages locales publiques vers V6 sans créer de V7 ni moteur de sections arbitraires. La V6 consomme les primitives 395 documentées dans `docs/tech/design-system.md`; les wrappers `CityLandingPage` et `DepartmentLandingPage` restent des délégations fines vers `LocalLandingPageV6`.

## Composition

`LocalLandingPageV6` est la seule composition locale partagée. Les wrappers existants `CityLandingPage` et `DepartmentLandingPage` y délèguent directement.

Ordre V6 :

1. hero transactionnel `PageHero` + `EditorialHeroMedia` + `ClassificationHeroNote` + `HeroReassurance` ;
2. `ProofStrip` ;
3. bénéfices communs via trois `FeatureCard` ;
4. zone d’intervention ;
5. tarifs ;
6. procédure courte avec `Timeline layout="horizontal"` ;
7. expertise Etoilys ;
8. module local facultatif ;
9. notice éditoriale locale facultative ;
10. FAQ compacte ;
11. CTA final `PageCta density="compact"`.

## Données variables

Les types V6 sont des unions discriminées dans `src/content/local/types.ts` :

- `scope: 'department'` impose une zone par secteurs et un pricing `mode: 'picker'`.
- `scope: 'city'` impose une zone par communes proches et un pricing `mode: 'direct'`. Le module local et la notice éditoriale restent facultatifs, par exemple pour une comparaison de taxe de séjour ou une notice réglementaire quand elle apporte un vrai contexte local.
- La description hero département commune vit dans `LOCAL_V6_DEPARTMENT_HERO_DESCRIPTION` (`src/content/local/sharedLocalContent.tsx`).
- Les index hero département vivent dans `LOCAL_V6_DEPARTMENT_HERO_INDEXES`. Ils sont territoriaux, pas photographiques.
- En `city`, le H2 de zone doit rester court, naturel et explicitement territorial. Privilégier quand c’est pertinent une formulation du type `Où intervenons-nous autour de [ville] ?`. Ne pas chercher à bourrer ce H2 de mots-clés : le H1, l’intro, les communes et le maillage portent déjà le contexte SEO local. La formulation peut varier lorsque la géographie réelle ne correspond pas à un simple périmètre autour de la ville.
- Les contenus riches de FAQ sont des `ReactNode` pour préserver les liens internes, les ancres et les liens externes avec leurs attributs. Les villes réutilisent `src/content/local/cities/sharedCityFaq.ts` ; les départements assemblent une question de couverture territoriale avec `DEPARTMENT_LOCAL_V6_FAQ_ITEMS` via `buildDepartmentFaqItems` dans `src/content/local/sharedLocalContent.tsx`.
- Les CTA gardent leur `variant` de tracking ; les ajustements visuels passent par `className`.
- Les espaces insécables de ponctuation française visibles dans les titres rendus sont gérés par `formatFrenchTitle` dans `LocalLandingPageV6.tsx`.

## Registre local

`src/content/local/registry.ts` est le catalogue local unique pour les métadonnées non React. Il porte les départements, les villes et les destinations publiables : identité, type (`department`, `city` ou `destination`), code département, région, URL, statut, ordre, mode de couverture, données hub et métadonnées SEO locales.

- Les routes React restent explicites dans `AppRoutes.tsx`.
- Les enfants locaux (`city` ou `destination`) sont dérivés de `parentId` + `status`, sans liste parallèle à maintenir dans les départements.
- Publication effective : un département est public si son entrée est `published` ; un enfant local est public seulement si son entrée est `published` et si son parent existe, est un département et est lui-même `published`.
- Un brouillon, un enfant local orphelin ou un enfant local rattaché à un parent brouillon n’est pas listé, indexable, pré-rendu, soumis à IndexNow, ni rendu comme landing publique ; une route encore déclarée affiche la 404 tant que l’entrée registry n’est pas effectivement publiée.
- `departmentCode` est une chaîne opaque. Ne pas le convertir en nombre : `01`, `2A`, `2B` et `971` sont des codes valides pour le contrat.
- Le lookup par code département retourne exclusivement une entrée département. Les villes et destinations peuvent partager le même code sans devenir une cible de lookup cartographique.
- Le registre reste indépendant des configs V6 React : pas d’import de `v6Pages.tsx`, pas de contenu JSX.
- `hubDescription` est un contenu éditorial spécifique à chaque département. Il présente le territoire, pas la couverture opérationnelle d’Etoilys : ne pas le générer depuis un template du type `Etoilys intervient dans…`.
- Un bon `hubDescription` comporte généralement deux phrases courtes : la première fait ressortir l’identité géographique ou touristique du département ; la seconde apporte, quand c’est naturel, un angle sur les séjours, gîtes, maisons de vacances ou meublés de tourisme. Varier la construction entre départements et éviter les slogans touristiques génériques, le keyword stuffing et les formulations interchangeables.

## Pricing

Les montants et conditions restent dans `src/content/local/pricing.ts`. Le département résout le profil via le picker de communes existant ; la ville affiche directement son profil. Les profils tarifaires sont discriminés par `kind` : `flat` conserve le tarif public unique historique avec éventuel partenaire et multi-logements, tandis que `tiered` affiche plusieurs lignes par typologie et une offre conditionnelle facultative. Les IDs métier (`aveyron-standard`, `dordogne-standard`, `gironde-standard`, `lot-standard`, `lot-et-garonne-standard`, `bordeaux-standard`) restent indépendants même si leurs valeurs partagent une base interne.

## Consommateurs

V6 active :

- Dordogne : `DORDOGNE_LOCAL_LANDING_PAGE_V6` dans `src/content/local/departments/dordognePage.tsx`.
- Bergerac : `BERGERAC_LOCAL_LANDING_PAGE_V6` dans `src/content/local/cities/bergeracPage.tsx`.
- Gironde : `GIRONDE_LOCAL_LANDING_PAGE_V6` dans `src/content/local/departments/girondePage.tsx`.
- Bordeaux : `BORDEAUX_LOCAL_LANDING_PAGE_V6` dans `src/content/local/cities/bordeauxPage.tsx`.
- Bassin d’Arcachon : `BASSIN_ARCACHON_LOCAL_LANDING_PAGE_V6` dans `src/content/local/destinations/bassinArcachonPage.tsx`.
- Lot-et-Garonne : `LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6` dans `src/content/local/departments/lotEtGaronnePage.tsx`.
- Lot : `LOT_LOCAL_LANDING_PAGE_V6` dans `src/content/local/departments/lotPage.tsx`.
- Aveyron : `AVEYRON_LOCAL_LANDING_PAGE_V6` dans `src/content/local/departments/aveyronPage.tsx`.

`src/content/local/v6Pages.tsx` reste un point de réexport compat uniquement. Il ne doit plus contenir les configurations.

Les routes publiques importent les wrappers fins `CityLandingPage`, `DestinationLandingPage` ou `DepartmentLandingPage`, pas directement `LocalLandingPageV6`.

Le hub `/zones-intervention`, les entrées SEO locales, le sitemap, le pré-rendu, les index de communes et IndexNow consomment le registre pour éviter les listes locales divergentes. Le hub affiche les régions empilées verticalement. Chaque région contient sa grille de cartes départementales (`xl:grid-cols-3`, `md:grid-cols-2`, une colonne mobile). Une carte départementale n’est pas interactive elle-même : seul le bloc principal est un `Link` vers le département, extensible dans la carte, et le pied teinté non rétractable contient les liens enfants locaux séparés quand il existe des enfants publiés. Les pieds s’alignent par ligne sans hauteur fixe ni mesure JavaScript.

## Garde-fous

Ne pas modifier les tarifs, calculs, URLs, SEO centralisé ou assets LCP/OG pendant une migration V6. Toute nouvelle page locale doit fournir une config complète typée, une route fine, une entrée registry et les tests minimaux de rendu, maillage, pricing et CTA.

- Les pages locales et le hub ont un fil d’Ariane visible discret en plus du `BreadcrumbList` JSON-LD. Ce fil est rendu par `PageHero`, dans le fond du hero, au-dessus du contenu principal. Il ne doit pas redevenir une barre autonome dans `Layout`. Les autres familles de pages restent sans breadcrumb UI.
- Hero : le suffixe géographique du H1 est mis en cuivre avec `highlightedTitleText`. Ce champ correspond actuellement à un suffixe du titre. Le CTA principal reprend le motif Dordogne avec flèche. L’action secondaire est un lien éditorial vers le tarif, jamais un deuxième gros CTA vers le simulateur.
- Hero département : `image.caption` décrit le lieu photographié ; `image.index` reste un repère de territoire au format code + destination, par exemple `24 / LE PÉRIGORD`, `33 / LA GIRONDE`, `47 / LOT-ET-GARONNE`. Ne pas y répéter le lieu de la photo.
- Crop hero : chaque config définit un point focal pertinent via `image.className`, puis le vérifie en desktop, tablette et mobile.
- Tarifs : city et department affichent le même bloc explicatif avec les trois garanties Etoilys et le lien procédure ; seule la partie droite diffère (`mode: 'direct'` ou `mode: 'picker'`).
- Pricing `direct` : pas de divider de résultat ni de note tarifaire dupliquée dans le panneau ville.
- Pricing `picker` : le divider et la note tarifaire sont conservés après sélection, car ils séparent le formulaire du résultat.
- Module local : il est facultatif. Ne pas imposer de surtitre générique `CONTEXTE LOCAL`. Garder un rythme titre -> texte cohérent avec les autres introductions de section ; sur desktop, la partie éditoriale reste plus large que la preuve ou carte chiffrée. `highlightedTitleText` correspond actuellement à un suffixe du titre mis en cuivre.
- Notice locale : utiliser `localNotice` pour une notice réglementaire ou éditoriale placée après le module local et avant la FAQ. Garder le motif `editorial-notice`; ne pas ajouter de moteur de sections. Le fond de la notice est `bg-paper`; quand une notice existe, la FAQ suivante passe sur `bg-surface-neutral`.
- Index communes : générer les index départementaux depuis `scripts/build-taxe-sejour-dataset.ts` et la source INSEE/taxe de séjour. La liste des index à produire vient du registre. Ne pas maintenir manuellement `public/data/communes-*-index.v1.json`.
- Images : une page locale ne réutilise pas par défaut le même asset pour le hero et l’expertise. `image.caption` et `expertise.image.caption` sont obligatoires dans la config V6 locale. La caption décrit le lieu photographié ; l’index département reste le repère territorial (`24 / LE PÉRIGORD`, `33 / LA GIRONDE`, `47 / LOT-ET-GARONNE`). La provenance/licence d’un asset externe doit toujours être documentée dans la table de traçabilité. Le champ `credit` de la config V6 est nécessaire lorsqu’une attribution visible est requise ; ne pas forcer de crédit visible pour Pexels lorsque la licence ne l’exige pas. Les libellés actifs sont Saint-Émilion + Arcachon pour la Gironde, place de la Bourse pour le hero Bordeaux, Nérac + Monflanquin pour le Lot-et-Garonne.
- CTA final : reprendre le motif et la copy du département parent au lieu d’inventer une nouvelle formulation pour chaque ville, mais conserver le `Button.variant` analytics historique d’une page existante.
- FAQ : toutes les pages V6 incluent le socle FAQ commun ajouté automatiquement par `LocalLandingPageV6`. Les départements utilisent en plus le socle métier commun neutre `DEPARTMENT_LOCAL_V6_FAQ_ITEMS` avec une première question de couverture territoriale et, si utile, une question locale avant les deux FAQ automatiques. Ne pas fabriquer le socle commun avec un `slice` d’une FAQ territoriale. Les villes utilisent le socle riche `sharedCityFaq.ts`; ne pas réécrire des liens en markdown ni déclencher une réponse riche par comparaison de texte de question.
- Maillage département : `communeLinks` associe une commune rendue à une entrée locale enfant. La déduplication des liens complémentaires se fait uniquement à partir des communes réellement présentes dans la section, visibles ou repliées, et dont la destination registry est effectivement publiée. Une association inutilisée ne doit pas masquer le lien complémentaire d’un enfant local publié.
- Une migration V6 ne doit jamais appauvrir un motif validé simplement parce qu’un nouveau scope utilise moins de données.
- Les anciennes données tourisme/statistiques inventoriées pendant une migration peuvent rester dans les fichiers de contenu source si elles gardent une utilité éditoriale future, mais elles ne sont pas réexportées ni rendues en V6 sans motif V6 validé.
- Recette corrective ETOILYS-415 du 18 septembre 2026 : build preview vérifié en 390, 768, 1024 et 1440 px sur le hub, Bergerac, Dordogne et Lot ; Bordeaux vérifié pour le breadcrumb court et le lien Gironde ; une page générale et un article vérifiés sans breadcrumb UI supplémentaire.

## Traçabilité Images Locales

La source technique reste `scripts/images-build.mjs` pour l’asset local et le fichier de config territoire (`src/content/local/departments/*Page.tsx` ou `src/content/local/cities/*Page.tsx`) pour le crédit affiché. Cette table ne duplique pas le manifeste généré ; elle donne seulement la trace éditoriale.

| Page              | Usage     | Asset key                    | Fichier source                           | Lieu/caption                                        | Trace                                                                    |
| ----------------- | --------- | ---------------------------- | ---------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------ |
| Dordogne          | Hero      | `dordogneLaRoqueGageac`      | source pipeline images                   | La Roque-Gageac, Dordogne                           | Asset propriétaire/local déjà validé.                                    |
| Dordogne          | Expertise | `dordogneLandscape`          | source pipeline images                   | Les pierres du Périgord                             | Asset propriétaire/local déjà validé.                                    |
| Bergerac          | Hero      | `bergeracHero`               | source pipeline images                   | Quai Cyrano, Bergerac                               | Wikimedia Commons, Benjamin Smith, CC BY-SA 4.0.                         |
| Bergerac          | Expertise | `bergeracSaintJacquesCyrano` | source pipeline images                   | Église Saint-Jacques, Bergerac                      | Wikimedia Commons, JGS25, CC BY-SA 4.0.                                  |
| Gironde           | Hero      | `girondeHero`                | source pipeline images                   | Saint-Émilion, Gironde                              | Unsplash, Axel Delansorne.                                               |
| Gironde           | Expertise | `girondeTerritory`           | source pipeline images                   | Front de mer d’Arcachon                             | Unsplash, Árpád Czapp.                                                   |
| Bordeaux          | Hero      | `bordeauxHero`               | source pipeline images                   | Place de la Bourse, Bordeaux                        | Pexels, Miguel Cuenca.                                                   |
| Bordeaux          | Expertise | `bordeauxExpertise`          | source pipeline images                   | Jardin Public, Bordeaux                             | Wikimedia Commons, Marc Ryckaert (MJJR), CC BY 3.0.                      |
| Bassin d’Arcachon | Hero      | `bassinArcachonHero`         | `bassin-arcachon-cabanes-tchanquees.jpg` | Cabanes tchanquées, île aux Oiseaux                 | Wikimedia Commons, Grand Parc - Bordeaux, France, CC BY 2.0.             |
| Bassin d’Arcachon | Expertise | `bassinArcachonDunePilat`    | `bassin-arcachon-dune-pilat.jpg`         | Entrée du bassin d’Arcachon depuis la dune du Pilat | Wikimedia Commons, Franck-fnba, CC BY-SA 4.0.                            |
| Lot-et-Garonne    | Hero      | `lotEtGaronneHero`           | `AdobeStock_1364523535.jpeg`             | Nérac, Lot-et-Garonne                               | Adobe Stock ID 1364523535 ; fiche publique exacte non confirmée.         |
| Lot-et-Garonne    | Expertise | `lotEtGaronneTerritory`      | source pipeline images                   | Monflanquin, Lot-et-Garonne                         | Pexels, D Goth.                                                          |
| Lot               | Hero      | `lotHero`                    | `pexels-tyvalloire-35860040.jpg`         | Saint-Cirq-Lapopie, Lot                             | Pexels ; fiche publique exacte non retrouvée, lieu vérifié visuellement. |
| Lot               | Expertise | `lotRocamadour`              | `rocamadour-2025-114909.jpg`             | Rocamadour, Lot                                     | Wikimedia Commons, Franck-fnba, CC BY-SA 4.0.                            |
| Aveyron           | Hero      | `aveyronHero`                | `belcastel-4-kallerna-wikimedia.jpg`     | Belcastel, Aveyron                                  | Wikimedia Commons, Kallerna, CC BY-SA 4.0.                               |
| Aveyron           | Expertise | `aveyronTerritory`           | `joran-quinten-wYzuwwLKmGM-unsplash.jpg` | Conques-en-Rouergue, Aveyron                        | Unsplash, Joran Quinten, licence Unsplash.                               |

Checklist nouvelle page locale :

À renseigner manuellement :

1. Ajouter l'ID dans `DepartmentAreaId`, `CityAreaId` ou `DestinationAreaId` (`src/content/local/types.ts`) et, seulement si nécessaire, la région dans `RegionId` + `DEPARTMENT_REGIONS`.
2. Créer une config V6 typée dans `src/content/local/departments/*Page.tsx`, `src/content/local/cities/*Page.tsx` ou `src/content/local/destinations/*Page.tsx`; `v6Pages.tsx` ne sert qu’au réexport compat.
3. Brancher une route explicite dans `src/AppRoutes.tsx` via `DepartmentLandingPage`, `CityLandingPage` ou `DestinationLandingPage`.
4. Ajouter l’entrée `src/content/local/registry.ts` avec `kind`, `id`, `path`, `departmentCode` opaque, région, parent éventuel, statut, ordre, hub, SEO, images LCP/OG et `coverageMode` pour un département. Le `hubDescription` doit rester éditorial et spécifique au territoire : pas de template de couverture opérationnelle, généralement deux phrases courtes, une identité géographique/touristique puis un angle séjour/gîte/meublé si pertinent.
5. Pour un département, ajouter l’index territorial dans `LOCAL_V6_DEPARTMENT_HERO_INDEXES`, le `PricingProfileId` métier dans `pricing.ts`, puis l’index communes registry si le picker doit être alimenté.
6. Déclarer les images locales dans `scripts/images-build.mjs`, lancer `npm run images:build`, puis vérifier `npm run images:check`.
7. Renseigner des captions média non vides et distinguer caption photographique / index territorial.
8. Pour une ville, réutiliser `sharedCityFaq.ts` pour le socle FAQ riche, puis ajouter uniquement les questions vraiment locales.
9. Préserver les `variant` CTA analytics historiques quand une page est migrée.
10. Couvrir par tests le rendu V6, le pricing, les liens FAQ, les CTA analytics, l’ordre FAQ, la publication registry, les breadcrumbs et les données structurées locales dérivées du registre.

Dérivé automatiquement depuis le registre :

- Hub `/zones-intervention`, régions masquées si vides, cartes départementales et liens villes enfants publiés.
- SEO local dans `src/content/seoRoutes.ts`, breadcrumbs JSON-LD et breadcrumbs visibles via `PageHero`.
- Sitemap et pré-rendu via `getIndexablePaths()` / `getPrerenderPaths()`.
- Index communes produits par `scripts/build-taxe-sejour-dataset.ts` pour les départements publiés qui déclarent `communeIndex`.
- Sélection IndexNow locale par les chemins génériques de `scripts/indexnow-submit.ts`, sans mapping par territoire.

Ne pas créer de donnée Aveyron avant la page dédiée : une fixture de test doit rester locale au test et ne jamais entrer dans le registre de production.

## Contrat carte future

La future carte de France consommera le même registre que la liste du hub. La jointure se fera par `departmentCode`, jamais par libellé affiché ni URL reconstruite.

- Un code absent renvoie une absence exploitable, sans faux lien ni exception visible.
- Un département ne devient cliquable que si son entrée département est publiée.
- Le mode de couverture (`department`, `sectors`, `on-request`) décrit la promesse éditoriale sans inventer de frontière opérationnelle stricte.
- Les géométries SVG/GeoJSON seront un asset séparé. Le registre ne contient pas de coordonnées, paths SVG, couleurs, état de survol ou dépendance cartographique.
- La liste compacte reste présente dans le HTML pré-rendu, utilisable au clavier et sur mobile après l’ajout de la carte.

## Exemples Minimaux

Les snippets ci-dessous sont des exemples abrégés / pseudo-code pour illustrer le contrat. Ils ne sont pas du code copy-pastable.

```tsx
const CITY_V6: LocalLandingPageV6CityConfig = {
  layoutVersion: 'v6',
  scope: 'city',
  localEntryId: 'bergerac',
  city: 'Bergerac',
  hero: {
    eyebrow: 'Bergerac et le Bergeracois',
    title: 'Classement de meublé de tourisme à Bergerac et dans le Bergeracois',
    highlightedTitleText: 'à Bergerac et dans le Bergeracois',
    image: {
      assetKey: 'bergeracHero',
    },
    primaryAction: {
      href: '/demande-classement',
      variant: 'white',
      className: 'editorial-dark-button',
      label: (
        <>
          Demander mon classement <ArrowUpRight />
        </>
      ),
    },
    secondaryAction: { href: '#tarifs', variant: 'secondary', label: 'Connaître mon tarif' },
  },
  serviceArea: {
    title: 'Où intervenons-nous autour de Bergerac ?',
    intro: 'Nos inspecteurs interviennent à Bergerac et dans le Bergeracois.',
    communes: ['Bergerac'],
    parentLink: { localEntryId: 'dordogne', label: 'Voir la Dordogne' },
  },
  pricing: {
    mode: 'direct',
    title: 'Combien coûte le classement d’un meublé à Bergerac ?',
    pricingProfileId: 'dordogne-standard',
  },
};
```

```tsx
const DEPARTMENT_V6: LocalLandingPageV6DepartmentConfig = {
  layoutVersion: 'v6',
  scope: 'department',
  departmentId: 'dordogne',
  hero: {
    title: 'Classement de gîtes et meublés de tourisme en Dordogne',
    highlightedTitleText: 'en Dordogne',
    image: {
      assetKey: 'dordogneLaRoqueGageac',
    },
    primaryAction: {
      href: '/demande-classement',
      variant: 'primary',
      label: (
        <>
          Demander mon classement <ArrowUpRight />
        </>
      ),
    },
    secondaryAction: {
      href: '#department-pricing-locality',
      variant: 'secondary',
      label: 'Connaître mon tarif',
    },
  },
  serviceArea: {
    title: 'Dans quelles communes de Dordogne intervenons-nous ?',
    intro: 'Nos inspecteurs interviennent par secteurs.',
    sectors,
    communeLinks: { Bergerac: { localEntryId: 'bergerac', label: 'Bergerac →' } },
    parentLink: { href: '/zones-intervention', label: 'Voir toutes nos zones' },
  },
  pricing: {
    mode: 'picker',
    title: 'Quel tarif pour classer votre meublé en Dordogne ?',
    intro: 'Indiquez la commune de votre logement.',
    picker: {
      title: 'Votre commune',
      intro: 'Indiquez la commune de votre logement.',
      inputLabel: 'Commune du meublé',
      placeholder: 'Ex. Sarlat-la-Canéda',
      communeIndexUrl: '/data/communes-dordogne-index.v1.json',
      defaultPricingProfileId: 'dordogne-standard',
      overrides: {},
    },
  },
};
```
