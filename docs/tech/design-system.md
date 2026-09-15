# Socle visuel du site public

Le socle ETOILYS-395 porte les primitives premium communes aux pages cœur et à la page Dordogne. La page Dordogne du commit `913becf` reste la référence visuelle de la direction artistique ; l'implémentation courante du spike reste la référence d'architecture et d'API.

## Mode D'Emploi Durable

### Tokens Et Cadre

- Les variables `--color-*` de `src/index.css` définissent la palette. Tailwind expose `ink`, `muted`, `paper`, `surface`, `surface-neutral`, `surface-warm`, `surface-sage`, `copper`, `ink-hover` et `surface-hover`.
- `container-editorial` fixe la largeur éditoriale commune : 1240 px maximum, marges de 48 px, 32 px jusqu'à 1150 px et 20 px jusqu'à 680 px.
- `editorial-heading`, `editorial-title`, `editorial-link`, `editorial-inline-link`, `editorial-section` et les tons de surface sont des primitives partagées, pas des variantes de route.
- Le focus cuivre reste le comportement par défaut sur fond clair. Les surfaces `ink` utilisent `editorial-focus-inverse`, avec un contour `paper`. Les champs en erreur gardent leurs styles `ui-field-error`.
- `Button` conserve ses variantes, tailles, navigation et événements analytics. Pour changer le rendu d'un CTA, ajouter une classe contextuelle partagée sans changer `variant`, `href` ni le libellé analytics dérivé.

### Besoin → Composant → Règle D'Usage

| Besoin                       | Composant ou classe                                | Règle d'usage                                                                                                                                             |
| ---------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero textuel                 | `PageHero` sans `media`                            | Utiliser pour les pages cœur simples. Le SEO reste centralisé dans `Layout`, pas dans la page.                                                            |
| Hero compact                 | `PageHero size="compact"`                          | Utiliser pour les pages denses comme FAQ, Prérequis ou Procédure.                                                                                         |
| Hero avec visuel             | `PageHero` + `EditorialHeroMedia`                  | Réserver aux compositions éditoriales fortes. Garder le slot `media`, les crops via `imageClassName`, et l'image LCP via `SmartImage`.                    |
| Note de classement           | `ClassificationHeroNote`                           | API actuelle : `lead`, `title`, `caption`. Sert au cartouche commun Home/Dordogne, sans dictionnaire local dans `Home.tsx`.                               |
| Réassurance hero             | `HeroReassurance`                                  | Liste courte, verticale, coche cuivre, contenu passé par la page.                                                                                         |
| Navigation de section        | `SectionNav`, ancres, `editorial-anchor`           | Les liens pointent vers des `id` existants. Le décalage sous header passe par `scroll-margin-top` et `--etoilys-header-height`.                           |
| Trois preuves                | `ProofStrip`                                       | Toujours trois preuves. Fond `paper` dans la primitive, proportions Dordogne, valeur `5` lisible par les lecteurs d'écran.                                |
| Timeline horizontale         | `Timeline layout="horizontal"`                     | Trois étapes, colonnes dès 681 px, stack compact sous 680 px. Utilisée Home/Dordogne.                                                                     |
| Timeline verticale           | `Timeline` par défaut                              | Garder pour les procédures détaillées ou parcours longs, sans reprendre le rendu horizontal.                                                              |
| Carte bénéfice               | `FeatureCard`                                      | Densité Dordogne par défaut, lien aligné en bas. Ne pas ajouter de variante locale pour Home/Dordogne.                                                    |
| Grille de cartes             | `editorial-feature-grid`                           | Grille de trois cartes bénéfices, gap 22 px desktop, 14 px tablette, une colonne mobile.                                                                  |
| FAQ et listes repliables     | `Accordion`                                        | Single-open, `hidden`, ARIA via `useId`. `density="compact"` reprend la FAQ Dordogne.                                                                     |
| CTA final                    | `PageCta`                                          | Fond `ink`, focus inverse. `density="compact"` pour la composition Dordogne. Les boutons gardent leurs variantes analytics.                               |
| Tableau comparatif éditorial | `ResponsiveComparisonTable appearance="editorial"` | Utiliser explicitement l'apparence éditoriale quand le tableau appartient à une page éditoriale. Ce n'est pas encore le défaut global.                    |
| Split éditorial              | `editorial-split`                                  | Deux colonnes texte/contenu pour introductions et comparaisons, sans card imbriquée.                                                                      |
| Faits clés                   | `editorial-facts`                                  | Liste de chiffres ou statuts courts en `dl`, avec séparation horizontale.                                                                                 |
| Notice éditoriale            | `editorial-notice`                                 | Bloc d'attention neutre, bord cuivre.                                                                                                                     |
| Résultat favorable           | `editorial-positive`                               | Bloc positif, fond `ink/5`, libellé explicite.                                                                                                            |
| Formulaire éditorial         | `editorial-form`                                   | Enveloppe légère pour les formulaires cœur. Ne pas imposer une densité landing page aux formulaires et simulateurs.                                       |
| Liens inline                 | `editorial-inline-link`                            | Pour les liens dans les paragraphes. Garde le focus clavier et l'underline lisible.                                                                       |
| Liens d'action               | `editorial-link`                                   | Pour les actions secondaires éditoriales avec icône, notamment dans les blocs expertise et procédure.                                                     |
| Bouton inversé               | `editorial-inverse-button`                         | À combiner avec une variante `Button` existante sur fond sombre. Ne change pas l'analytics.                                                               |
| Focus fond clair/sombre      | `ui-focus`, `editorial-focus-inverse`              | `ui-focus` donne le cuivre sur clair. `editorial-focus-inverse` donne le contour `paper` sur `ink`. Les règles locales Dordogne ne doivent pas l'écraser. |

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

## Frontières De Migration

- **ETOILYS-395** : socle premium, pages cœur, Home/Dordogne harmonisées, amorce des enveloppes de formulaires via `editorial-form`.
- **ETOILYS-396** : terminer les formulaires et simulateurs. Ne pas leur imposer la densité visuelle d'une landing page ; préserver leurs exigences d'état, validation, API, Turnstile et accessibilité.
- **ETOILYS-398** : industrialiser les compositions locales, pricing et pages départementales encore spécifiques. Elles doivent consommer les primitives 395 au lieu de recréer des équivalents `.dd-*`.

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
- La page Dordogne `913becf` guide la finesse visuelle, mais les composants restaurés doivent vivre dans les primitives partagées, pas dans de nouveaux forks locaux.
