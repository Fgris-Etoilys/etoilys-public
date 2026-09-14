# Socle visuel du site public

Le socle ETOILYS-394 reprend la direction Dordogne. Les composants partagés utilisent cette apparence par défaut, sans option de thème ni condition de route.

## Tokens et primitives

- Les variables `--color-*` de `src/index.css` définissent les couleurs. Tailwind expose `ink`, `muted`, `paper`, `surface`, `copper`, `ink-hover` et `surface-hover`, avec les modificateurs d’opacité habituels.
- `rounded-control` (4 px) et `rounded-editorial` (6 px) servent aux boutons et cartes/champs. Les anciens tokens restent disponibles pour les pages encore à migrer.
- `container-editorial` reprend la largeur Dordogne : 1240 px maximum, marges de 48 px, 32 px jusqu’à 1150 px et 20 px jusqu’à 680 px. `container-adaptive` reste disponible pour les mises en page existantes.
- `editorial-heading`, `editorial-section` et `editorial-link` exposent les styles éditoriaux. Les titres des pages existantes ne sont pas redimensionnés globalement.
- `ui-focus` fournit le focus clavier cuivre. `ui-field` et `ui-field-error` regroupent les styles des champs et de leurs erreurs.

## Composants et shell

`Button` conserve ses variantes, tailles, navigation et événements analytics. Les CTA Dordogne gardent leurs ajustements dimensionnels locaux. `Card` n’est plus déplacée au survol.

Les champs conservent leurs propriétés et les attributs ARIA fournis par leurs appelants. Leurs labels et messages sont associés en interne ; les formulaires n’ont pas besoin de modifier leurs usages.

Le Header et le Footer sont uniques. Le Footer utilise les contenus FR/EN/NL de `layoutContent`. Le lien d’évitement cible `main-content` ; le décalage du contenu et du menu mobile utilise la hauteur mesurée du Header.

## Migration suivante

### Pages cœur métier — ETOILYS-395

La Home, Classement, Avantages, Prérequis, Procédure et FAQ utilisent le socle éditorial dans leurs variantes FR/EN/NL. Cette migration part directement d’ETOILYS-394, sans attendre le framework local V6 d’ETOILYS-398.

- `PageHero` présente uniquement un titre et une description sur fond `paper`. La Home conserve son hero photo pleine largeur, son image LCP, ses contenus et ses deux CTA.
- `PageCta` compose un titre, une description et des enfants sur fond `ink`. Le CTA clair de la FAQ reste local ; aucune variante de page n’est ajoutée au composant.
- `editorial-title` complète la typographie des héros. `editorial-inline-link` conserve le flux des liens dans les paragraphes et leur focus clavier. `editorial-inverse-button` adapte un bouton secondaire au fond sombre sans changer sa variante, utilisée dans son identifiant analytics.
- `FeatureCard`, `Timeline`, `Accordion` et `ArticleCard` utilisent la palette partagée. L’ancienne propriété `iconColor` de `FeatureCard` est supprimée. Les autres consommateurs (départements et Recrutement) reçoivent aussi cette apparence, sans migration de leur structure.
- Les accordéons gardent un seul panneau ouvert par groupe. Les réponses restent montées dans le DOM ; `hidden` retire les panneaux fermés de l’affichage, de l’arbre d’accessibilité et du parcours clavier. Les associations ARIA utilisent `useId` et l’index ; Enter/Espace restent gérés nativement par les boutons.
- Les couleurs sémantiques utiles aux avertissements et comparaisons sont conservées. Les routes, contenus métier, données SEO, variantes analytics et images restent inchangés.

Les tests ciblés sont `src/components/ui/Accordion.test.tsx` et `src/test/core-pages.test.tsx`. Contrôler les 18 routes à 390, 768, 1024 et 1440 px, ainsi que les consommateurs partagés. Pour une validation i18n locale ou de preview, définir `I18N_RELEASE_BASE_URL` sur l’environnement contenant le build à vérifier. Le typecheck exécuté par `build:seo` suffit, sans relance après ce build.

Lors du contrôle de référence ETOILYS-395 sur `913becf`, l’erreur d’hydratation React #418 déjà documentée ci-dessous est également reproduite sur les pages cœur métier FR/EN/NL. Elle préexiste à cette migration.

### Pages locales et formulaires

Les règles de contenu `.dd-*`, notamment la variante `isDordogne` du pricing, sont une dette à supprimer dans **ETOILYS-398**. Ne pas ajouter de nouvelle exception de route. La migration des formulaires/simulateurs relève d’ETOILYS-396.

## Validation

Exécuter `npm run lint`, `npm run test:run`, `npm run verify:i18n-release`, puis `npm run build:seo` (typecheck inclus). `verify:i18n-release` contrôle par défaut le site déployé ; il ne valide pas les modifications locales. Comparer la Dordogne à 390, 768, 1024 et 1440 px, puis les parcours du shell en FR/EN/NL.

Lors de cette extraction, une erreur React d’hydratation #418 a été reproduite sur la Dordogne prérendue, également dans un build isolé de la référence `e66446c`. Elle préexiste au nouveau shell et reste à traiter séparément.
