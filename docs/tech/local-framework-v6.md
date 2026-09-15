# Framework local V6

ETOILYS-398 industrialise les pages locales sans créer un deuxième système visuel. La V6 consomme les primitives 395 documentées dans `docs/tech/design-system.md` et garde les renderers V4/V5 pour les pages qui seront migrées dans ETOILYS-414.

## Composition

`LocalLandingPageV6` est la seule composition V6 partagée. Les wrappers existants `CityLandingPage` et `DepartmentLandingPage` y délèguent uniquement quand `layoutVersion: 'v6'`.

Ordre V6 :

1. hero transactionnel `PageHero` + `EditorialHeroMedia` + `ClassificationHeroNote` + `HeroReassurance` ;
2. `ProofStrip` ;
3. bénéfices communs via trois `FeatureCard` ;
4. zone d’intervention ;
5. tarifs ;
6. procédure courte avec `Timeline layout="horizontal"` ;
7. expertise Etoilys ;
8. module local facultatif ;
9. FAQ compacte ;
10. CTA final `PageCta density="compact"`.

## Données variables

Les types V6 sont des unions discriminées dans `src/content/local/types.ts` :

- `scope: 'department'` impose une zone par secteurs et un pricing `mode: 'picker'`.
- `scope: 'city'` impose une zone par communes proches et un pricing `mode: 'direct'`. Le module local reste facultatif, par exemple pour une comparaison de taxe de séjour quand elle apporte un vrai contexte local.
- Les contenus riches de FAQ sont des `ReactNode` pour préserver les liens internes, les ancres et les liens externes avec leurs attributs.
- Les CTA gardent leur `variant` de tracking ; les ajustements visuels passent par `className`.

## Pricing

Les montants et conditions restent dans `src/content/local/pricing.ts`. Le département résout le profil via le picker de communes existant ; la ville affiche directement son profil. Le composant partagé `LocalPricingProfileSummary` rend les deux cas pour éviter une copie entre ville et département.

## Consommateurs

V6 active dans ce ticket :

- Dordogne : `DORDOGNE_LOCAL_LANDING_PAGE_V6`, golden master courant.
- Bergerac : `BERGERAC_LOCAL_LANDING_PAGE_V6`, pilote ville.

Legacy conservé pour ETOILYS-414 :

- Bordeaux : `CityLandingPage` V4.
- Gironde : `DepartmentLandingPage` legacy.
- Lot-et-Garonne : `DepartmentLandingPage` legacy.
- `DORDOGNE_DEPARTMENT_PAGE` V5 reste disponible comme donnée legacy, mais ne pilote plus la route Dordogne.

## Garde-fous

Ne pas modifier les tarifs, calculs, URLs, SEO centralisé ou assets LCP/OG pendant une migration V6. Toute nouvelle page locale doit fournir une config complète typée, une route fine, une entrée SEO et les tests minimaux de rendu, maillage, pricing et CTA.
