# Socle visuel du site public

Le socle ETOILYS-394 reprend la direction Dordogne. Les composants partagés utilisent cette apparence par défaut, sans option de thème ni condition de route.

## Tokens et primitives

- Les variables `--color-*` de `src/index.css` définissent les couleurs. Tailwind expose `ink`, `muted`, `paper`, `surface`, `surface-neutral`, `surface-warm`, `surface-sage`, `copper`, `ink-hover` et `surface-hover`, avec les modificateurs d’opacité habituels.
- `rounded-control` (4 px) et `rounded-editorial` (6 px) servent aux boutons et cartes/champs. Les anciens tokens restent disponibles pour les pages encore à migrer.
- Les tons `surface-neutral`, `surface-warm` et `surface-sage` portent les nuances éditoriales Dordogne pour les sections zone d’intervention, process/timeline et expertise, sans token nommé par route.
- `container-editorial` reprend la largeur Dordogne : 1240 px maximum, marges de 48 px, 32 px jusqu’à 1150 px et 20 px jusqu’à 680 px. `container-adaptive` reste disponible pour les mises en page existantes.
- `editorial-heading`, `editorial-section` et `editorial-link` exposent les styles éditoriaux. Les titres des pages existantes ne sont pas redimensionnés globalement.
- `ui-focus` fournit le focus clavier cuivre. `ui-field` et `ui-field-error` regroupent les styles des champs et de leurs erreurs.

## Composants et shell

`Button` conserve ses variantes, tailles, navigation et événements analytics. Les dimensions des CTA Dordogne sont portées par les primitives partagées. `Card` n’est plus déplacée au survol.

Les champs conservent leurs propriétés et les attributs ARIA fournis par leurs appelants. Leurs labels et messages sont associés en interne ; les formulaires n’ont pas besoin de modifier leurs usages.

Le Header et le Footer sont uniques. Le Footer utilise les contenus FR/EN/NL de `layoutContent`. Le lien d’évitement cible `main-content` ; le décalage du contenu et du menu mobile utilise la hauteur mesurée du Header.

## Migration suivante

### Pages cœur métier — ETOILYS-395

La Home, Classement, Avantages, Prérequis, Procédure et FAQ utilisent le socle éditorial dans leurs variantes FR/EN/NL. Cette migration part directement d’ETOILYS-394, sans attendre le framework local V6 d’ETOILYS-398. La page Dordogne de `913becf` reste la référence visuelle de la direction artistique : les primitives partagées conservent désormais sa finesse plutôt que des variantes locales.

- `PageHero` reste le shell de hero. Il accepte un slot `media`, un surtitre, `eyebrowMarked` pour le point cuivre des heroes Home/Dordogne, et des enfants pour les CTA, réassurances ou sommaires. Il ne porte pas de logique locale ou métier.
- `EditorialHeroMedia` porte la géométrie photo partagée issue de Dordogne : grand arrondi supérieur gauche, autres coins discrets, caption optionnelle, note superposée et index décoratif optionnel. Les crops restent passés par `imageClassName`.
- `ClassificationHeroNote` unifie le cartouche “1 à 5 étoiles” de la Home et de Dordogne avec une hiérarchie `lead`, `title`, `caption`, la mini-card chaude et l’overlay issus de `913becf`. `HeroReassurance` reprend par défaut l’ancien motif Dordogne : liste verticale, 12 px, espacement court et coche cuivre.
- `ProofStrip` unifie les bandeaux de preuves Home/Dordogne sur les proportions de l’ancien Dordogne : colonnes `1fr / .8fr / 1fr` sur desktop, premier item pleine largeur puis deux colonnes sur mobile, icône ou grande valeur Playfair lisible par les lecteurs d’écran.
- `PageCta` compose un texte et une colonne d’actions sur fond `ink`, empilés sur mobile. Il accepte `eyebrow` et `density="compact"` pour retrouver la densité du CTA final Dordogne sans CSS local. `editorial-inverse-button` donne une surface ivoire au CTA final Dordogne tout en conservant `Button variant="primary"` et donc l’identifiant analytics historique.
- `editorial-title` complète la typographie des héros. `editorial-inline-link` conserve le flux des liens dans les paragraphes et leur focus clavier. `editorial-inverse-button` adapte un bouton secondaire au fond sombre sans changer sa variante, utilisée dans son identifiant analytics.
- `FeatureCard`, `Timeline`, `Accordion` et `ArticleCard` utilisent la palette partagée. `FeatureCard` reprend par défaut la densité exacte des anciennes cartes bénéfices Dordogne, liens bas inclus, sans variante locale : desktop validé à 30 px / titre 21 px, 681-899 px à 22 px / titre 18 px, mobile à 26 px / titre 18 px. `Timeline layout="horizontal"` reprend le rendu `913becf` dès 681 px : colonnes égales, numéros Playfair vert-gris et séparateurs fins, puis stack vertical compact sous 680 px. Les autres consommateurs (Home, Avantages, pages départementales et Recrutement) reçoivent aussi cette apparence.
- Les accordéons gardent un seul panneau ouvert par groupe. Les réponses restent montées dans le DOM ; `hidden` retire les panneaux fermés de l’affichage, de l’arbre d’accessibilité et du parcours clavier. Les associations ARIA utilisent `useId` et l’index ; Enter/Espace restent gérés nativement par les boutons. `density="compact"` sert uniquement à reprendre la densité FAQ Dordogne dans la primitive partagée.
- Les avertissements éditoriaux emploient le cuivre, les résultats favorables un fond `ink/5`, avec des libellés explicites. Les erreurs de formulaire gardent leur sémantique d’alerte. Les routes, chiffres métier, variantes analytics et image LCP restent conservés.

Les tests ciblés sont `src/components/ui/Accordion.test.tsx` et `src/test/core-pages.test.tsx`. Contrôler les 18 routes à 390, 768, 1024 et 1440 px, ainsi que les consommateurs partagés. Pour une validation i18n locale ou de preview, définir `I18N_RELEASE_BASE_URL` sur l’environnement contenant le build à vérifier. Le typecheck exécuté par `build:seo` suffit, sans relance après ce build.

Lors du contrôle de référence ETOILYS-395 sur `913becf`, l’erreur d’hydratation React #418 déjà documentée ci-dessous est également reproduite sur les pages cœur métier FR/EN/NL. Elle préexiste à cette migration.

### Pages locales et formulaires

Les règles `.dd-*` restantes sont réservées aux compositions vraiment locales : pricing, service area, tarif par commune et ajustements de section territoriale. La variante `isDordogne` du pricing, le framework des pages locales, les secteurs/communes, les configs départementales et le pricing par commune restent explicitement délégués à **ETOILYS-398**. Ne pas ajouter de nouvelle exception de route. La migration des formulaires/simulateurs relève d’ETOILYS-396.

## Validation

Passe post-review ETOILYS-395 sur `spike/ETOILYS-395-premium-polish`. Le hash exact du commit final est communiqué dans le rapport de livraison : l'écrire ici avant commit modifierait ce hash.

Résultats réels de cette passe :

- `npm.cmd run lint` : OK, avec l'avertissement préexistant `src/pages/SimulationClassement.tsx:970 react-hooks/exhaustive-deps`.
- `npm.cmd run typecheck` : OK.
- Tests ciblés : `npx.cmd vitest run src/components/layout/DordogneLayout.test.tsx src/test/core-pages.test.tsx src/components/ui/Accordion.test.tsx src/components/ui/ProofStrip.test.tsx` : OK, 4 fichiers / 43 tests.
- Re-test ciblé après correction TypeScript : `npx.cmd vitest run src/components/layout/DordogneLayout.test.tsx` : OK, 1 fichier / 3 tests.
- Follow-up Home ProofStrip : `npm.cmd run typecheck` OK, `npx.cmd vitest run src/test/core-pages.test.tsx` OK, 1 fichier / 36 tests, puis `npm.cmd run lint` OK avec le même avertissement préexistant.
- Non relancés à la demande : `npm run test:run`, `npm run build:seo`, Playwright et `verify:i18n-release`.

Les tests Dordogne couvrent le comportement single-open de l'Accordion, le CTA hero blanc, la valeur lisible de `ProofStrip`, et les deux CTA Dordogne vers `/demande-classement` avec `cta_primary_demande_classement`. Les fichiers modifiés ont été vérifiés en UTF-8 sans BOM ni mojibake avant livraison.
