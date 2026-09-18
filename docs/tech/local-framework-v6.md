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
- La description hero département commune vit dans `LOCAL_V6_DEPARTMENT_HERO_DESCRIPTION` (`src/content/local/v6Pages.tsx`).
- Les index hero département vivent dans `LOCAL_V6_DEPARTMENT_HERO_INDEXES`. Ils sont territoriaux, pas photographiques.
- En `city`, le H2 de zone doit rester court, naturel et explicitement territorial. Privilégier quand c’est pertinent une formulation du type `Où intervenons-nous autour de [ville] ?`. Ne pas chercher à bourrer ce H2 de mots-clés : le H1, l’intro, les communes et le maillage portent déjà le contexte SEO local. La formulation peut varier lorsque la géographie réelle ne correspond pas à un simple périmètre autour de la ville.
- Les contenus riches de FAQ sont des `ReactNode` pour préserver les liens internes, les ancres et les liens externes avec leurs attributs. Les villes réutilisent `src/content/local/cities/sharedCityFaq.ts` ; les départements réutilisent `dordogneQuestions` via `buildDepartmentFaqItems` dans `v6Pages.tsx`.
- Les CTA gardent leur `variant` de tracking ; les ajustements visuels passent par `className`.
- Les espaces insécables de ponctuation française visibles dans les titres rendus sont gérés par `formatFrenchTitle` dans `LocalLandingPageV6.tsx`.

## Pricing

Les montants et conditions restent dans `src/content/local/pricing.ts`. Le département résout le profil via le picker de communes existant ; la ville affiche directement son profil. Les IDs métier (`dordogne-standard`, `gironde-standard`, `lot-et-garonne-standard`, `bordeaux-standard`) restent indépendants même si leurs valeurs initiales partagent une base interne.

## Consommateurs

V6 active :

- Dordogne : `DORDOGNE_LOCAL_LANDING_PAGE_V6`, golden master courant.
- Bergerac : `BERGERAC_LOCAL_LANDING_PAGE_V6`, golden master ville.
- Gironde : `GIRONDE_LOCAL_LANDING_PAGE_V6`.
- Bordeaux : `BORDEAUX_LOCAL_LANDING_PAGE_V6`.
- Lot-et-Garonne : `LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6`.
- Lot : `LOT_LOCAL_LANDING_PAGE_V6`.

Les routes publiques importent les wrappers fins `CityLandingPage` ou `DepartmentLandingPage`, pas directement `LocalLandingPageV6`.

## Garde-fous

Ne pas modifier les tarifs, calculs, URLs, SEO centralisé ou assets LCP/OG pendant une migration V6. Toute nouvelle page locale doit fournir une config complète typée, une route fine, une entrée SEO et les tests minimaux de rendu, maillage, pricing et CTA.

- Hero : le suffixe géographique du H1 est mis en cuivre avec `highlightedTitleText`. Ce champ correspond actuellement à un suffixe du titre. Le CTA principal reprend le motif Dordogne avec flèche. L’action secondaire est un lien éditorial vers le tarif, jamais un deuxième gros CTA vers le simulateur.
- Hero département : `image.caption` décrit le lieu photographié ; `image.index` reste un repère de territoire au format code + destination, par exemple `24 / LE PÉRIGORD`, `33 / LA GIRONDE`, `47 / LOT-ET-GARONNE`. Ne pas y répéter le lieu de la photo.
- Crop hero : chaque config définit un point focal pertinent via `image.className`, puis le vérifie en desktop, tablette et mobile.
- Tarifs : city et department affichent le même bloc explicatif avec les trois garanties Etoilys et le lien procédure ; seule la partie droite diffère (`mode: 'direct'` ou `mode: 'picker'`).
- Pricing `direct` : pas de divider de résultat ni de note tarifaire dupliquée dans le panneau ville.
- Pricing `picker` : le divider et la note tarifaire sont conservés après sélection, car ils séparent le formulaire du résultat.
- Module local : il est facultatif. Ne pas imposer de surtitre générique `CONTEXTE LOCAL`. Garder un rythme titre -> texte cohérent avec les autres introductions de section ; sur desktop, la partie éditoriale reste plus large que la preuve ou carte chiffrée. `highlightedTitleText` correspond actuellement à un suffixe du titre mis en cuivre.
- Notice locale : utiliser `localNotice` pour une notice réglementaire ou éditoriale placée après le module local et avant la FAQ. Garder le motif `editorial-notice`; ne pas ajouter de moteur de sections. Le fond de la notice est `bg-paper`; quand une notice existe, la FAQ suivante passe sur `bg-surface-neutral`.
- Index communes : générer les index départementaux depuis `scripts/build-taxe-sejour-dataset.ts` et la source INSEE/taxe de séjour, puis référencer le JSON par le picker. Ne pas maintenir manuellement `public/data/communes-*-index.v1.json`.
- Images : une page locale ne réutilise pas par défaut le même asset pour le hero et l’expertise. `image.caption` et `expertise.image.caption` sont obligatoires dans la config V6 locale. La caption décrit le lieu photographié ; l’index département reste le repère territorial (`24 / LE PÉRIGORD`, `33 / LA GIRONDE`, `47 / LOT-ET-GARONNE`). Documenter le crédit/licence dans la config quand l’asset n’est pas propriétaire. Les libellés actifs sont Saint-Émilion + Arcachon pour la Gironde, place de la Bourse pour le hero Bordeaux, Nérac + Monflanquin pour le Lot-et-Garonne.
- CTA final : reprendre le motif et la copy du département parent au lieu d’inventer une nouvelle formulation pour chaque ville, mais conserver le `Button.variant` analytics historique d’une page existante.
- FAQ : toutes les pages V6 incluent le socle FAQ commun ajouté automatiquement par `LocalLandingPageV6`. Les départements utilisent en plus le socle métier commun de `v6Pages.tsx` avec une première question de couverture territoriale et, si utile, une question locale avant les deux FAQ automatiques. Les villes utilisent le socle riche `sharedCityFaq.ts`; ne pas réécrire des liens en markdown ni déclencher une réponse riche par comparaison de texte de question.
- Une migration V6 ne doit jamais appauvrir un motif validé simplement parce qu’un nouveau scope utilise moins de données.
- Les anciennes données tourisme/statistiques inventoriées pendant une migration peuvent rester dans les fichiers de contenu source si elles gardent une utilité éditoriale future, mais elles ne sont pas réexportées ni rendues en V6 sans motif V6 validé.

## Traçabilité Images Locales

La source technique reste `scripts/images-build.mjs` pour l’asset local et `src/content/local/v6Pages.tsx` pour le crédit affiché. Cette table ne duplique pas le manifeste généré ; elle donne seulement la trace éditoriale.

| Page           | Usage     | Asset key                    | Fichier source                   | Lieu/caption                                   | Trace                                                                    |
| -------------- | --------- | ---------------------------- | -------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------ |
| Dordogne       | Hero      | `dordogneLaRoqueGageac`      | source pipeline images           | La Roque-Gageac, Dordogne                      | Asset propriétaire/local déjà validé.                                    |
| Dordogne       | Expertise | `dordogneLandscape`          | source pipeline images           | Les pierres du Périgord                        | Asset propriétaire/local déjà validé.                                    |
| Bergerac       | Hero      | `bergeracHero`               | source pipeline images           | Quai Cyrano, Bergerac                          | Wikimedia Commons, Benjamin Smith, CC BY-SA 4.0.                         |
| Bergerac       | Expertise | `bergeracSaintJacquesCyrano` | source pipeline images           | Église Saint-Jacques, Bergerac                 | Wikimedia Commons, JGS25, CC BY-SA 4.0.                                  |
| Gironde        | Hero      | `girondeHero`                | source pipeline images           | Saint-Émilion, Gironde                         | Unsplash, Axel Delansorne.                                               |
| Gironde        | Expertise | `girondeTerritory`           | source pipeline images           | Front de mer d’Arcachon                        | Unsplash, Árpád Czapp.                                                   |
| Bordeaux       | Hero      | `bordeauxHero`               | source pipeline images           | Place de la Bourse, Bordeaux                   | Pexels, Miguel Cuenca.                                                   |
| Bordeaux       | Expertise | `bordeauxExpertise`          | source pipeline images           | Tramway devant la place de la Bourse, Bordeaux | Pexels, Charl Durand.                                                    |
| Lot-et-Garonne | Hero      | `lotEtGaronneHero`           | `AdobeStock_1364523535.jpeg`     | Nérac, Lot-et-Garonne                          | Adobe Stock ID 1364523535 ; fiche publique exacte non confirmée.         |
| Lot-et-Garonne | Expertise | `lotEtGaronneTerritory`      | source pipeline images           | Monflanquin, Lot-et-Garonne                    | Pexels, D Goth.                                                          |
| Lot            | Hero      | `lotHero`                    | `pexels-tyvalloire-35860040.jpg` | Saint-Cirq-Lapopie, Lot                        | Pexels ; fiche publique exacte non retrouvée, lieu vérifié visuellement. |
| Lot            | Expertise | `lotRocamadour`              | `rocamadour-2025-114909.jpg`     | Rocamadour, Lot                                | Wikimedia Commons, Franck-fnba, CC BY-SA 4.0.                            |

Checklist nouvelle page locale :

1. Ajouter ou réutiliser une config V6 typée dans `src/content/local/v6Pages.tsx`.
2. Brancher la route sur le wrapper fin `CityLandingPage` ou `DepartmentLandingPage`.
3. Ajouter l’entrée `src/content/local/registry.ts` pour publier la hiérarchie locale et nourrir les données structurées.
4. Ajouter l’entrée SEO centralisée, le `lcpImageKey`, les `lcpImageSizes` et le sitemap généré si la route est publique.
5. Déclarer les images locales dans `scripts/images-build.mjs`, lancer `npm run images:build`, puis vérifier `npm run images:check`.
6. Renseigner des captions média non vides et distinguer caption photographique / index territorial.
7. Pour un département, générer l’index communes depuis la source INSEE/taxe de séjour et définir un `PricingProfileId` métier propre.
8. Pour une ville, réutiliser `sharedCityFaq.ts` pour le socle FAQ riche, puis ajouter uniquement les questions vraiment locales.
9. Préserver les `variant` CTA analytics historiques quand une page est migrée.
10. Couvrir par tests le rendu V6, le pricing, les liens FAQ, les CTA analytics, l’ordre FAQ et les données structurées locales dérivées de la registry.

## Exemples Minimaux

Les snippets ci-dessous sont des exemples abrégés / pseudo-code pour illustrer le contrat. Ils ne sont pas du code copy-pastable.

```tsx
const CITY_V6: LocalLandingPageV6CityConfig = {
  ...COMMON_LOCAL_V6,
  layoutVersion: 'v6',
  scope: 'city',
  city: 'Bergerac',
  hero: {
    ...COMMON_LOCAL_V6.hero,
    eyebrow: 'Bergerac et le Bergeracois',
    title: 'Classement de meublé de tourisme à Bergerac et dans le Bergeracois',
    highlightedTitleText: 'à Bergerac et dans le Bergeracois',
    image: {
      ...COMMON_LOCAL_V6.hero.image,
      assetKey: 'bergeracHero',
      sizes: getSeoRouteConfig(path).lcpImageSizes,
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
    parentLink: { href: '/classement-meuble-tourisme-dordogne', label: 'Voir la Dordogne' },
  },
  pricing: {
    mode: 'direct',
    title: 'Combien coûte le classement d’un meublé à Bergerac ?',
    pricingProfileId: 'dordogne-standard',
    checklist,
    procedureLink,
  },
};
```

```tsx
const DEPARTMENT_V6: LocalLandingPageV6DepartmentConfig = {
  ...COMMON_LOCAL_V6,
  layoutVersion: 'v6',
  scope: 'department',
  departmentId: 'dordogne',
  hero: {
    ...COMMON_LOCAL_V6.hero,
    title: 'Classement de gîtes et meublés de tourisme en Dordogne',
    highlightedTitleText: 'en Dordogne',
    image: {
      ...COMMON_LOCAL_V6.hero.image,
      assetKey: 'dordogneLaRoqueGageac',
      sizes: getSeoRouteConfig(path).lcpImageSizes,
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
    checklist,
    procedureLink,
  },
};
```
