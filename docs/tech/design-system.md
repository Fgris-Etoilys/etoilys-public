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

- `PageHero` accepte une image optionnelle et des enfants. La Home compose ainsi un hero en deux colonnes, avec sa photo LCP sans voile ; les autres pages peuvent y ajouter un sommaire ou leurs repères essentiels. Les `sizes` de la Home viennent de la configuration SEO pour rester identiques au preload.
- `PageCta` compose un texte et une colonne d’actions sur fond `ink`, empilés sur mobile. Le CTA clair de la FAQ reste local. `editorial-inverse-button` donne une surface ivoire au CTA principal sur fond sombre sans changer son identifiant analytics.
- `editorial-title` complète la typographie des héros. `editorial-inline-link` conserve le flux des liens dans les paragraphes et leur focus clavier. `editorial-inverse-button` adapte un bouton secondaire au fond sombre sans changer sa variante, utilisée dans son identifiant analytics.
- `FeatureCard`, `Timeline`, `Accordion` et `ArticleCard` utilisent la palette partagée. L’ancienne propriété `iconColor` de `FeatureCard` est supprimée. Les autres consommateurs (départements et Recrutement) reçoivent aussi cette apparence, sans migration de leur structure.
- Les accordéons gardent un seul panneau ouvert par groupe. Les réponses restent montées dans le DOM ; `hidden` retire les panneaux fermés de l’affichage, de l’arbre d’accessibilité et du parcours clavier. Les associations ARIA utilisent `useId` et l’index ; Enter/Espace restent gérés nativement par les boutons.
- Les avertissements éditoriaux emploient le cuivre, les résultats favorables un fond `ink/5`, avec des libellés explicites. Les erreurs de formulaire gardent leur sémantique d’alerte. Les routes, chiffres métier, variantes analytics et image LCP restent conservés.

Les tests ciblés sont `src/components/ui/Accordion.test.tsx` et `src/test/core-pages.test.tsx`. Contrôler les 18 routes à 390, 768, 1024 et 1440 px, ainsi que les consommateurs partagés. Pour une validation i18n locale ou de preview, définir `I18N_RELEASE_BASE_URL` sur l’environnement contenant le build à vérifier. Le typecheck exécuté par `build:seo` suffit, sans relance après ce build.

Lors du contrôle de référence ETOILYS-395 sur `913becf`, l’erreur d’hydratation React #418 déjà documentée ci-dessous est également reproduite sur les pages cœur métier FR/EN/NL. Elle préexiste à cette migration.

### Pages locales et formulaires

Les règles de contenu `.dd-*`, notamment la variante `isDordogne` du pricing, sont une dette à supprimer dans **ETOILYS-398**. Ne pas ajouter de nouvelle exception de route. La migration des formulaires/simulateurs relève d’ETOILYS-396.

## Validation

La deuxième passe du spike a été validée uniquement par `npm run typecheck`, conformément au périmètre demandé. Les tests, le lint, les builds et les contrôles navigateur n’ont pas été relancés ; aucun asset ni manifeste d’image n’a été généré. Les résultats détaillés ci-dessous correspondent à la première passe.

### Spike premium depuis ETOILYS-395

La branche `spike/ETOILYS-395-premium-polish` part de `fe12aad` sur `feat/ETOILYS-395-core-pages-redesign`.

- `SectionNav` compose des ancres natives, nommées et accessibles, pour Avantages, Prérequis et FAQ. Les cibles utilisent `editorial-anchor`, décalé selon la hauteur du header.
- `editorial-split` partage la grille titre/contenu ; `editorial-facts`, `editorial-notice`, `editorial-positive` et `editorial-form` restent des classes de présentation sans logique métier.
- `FeatureCard` réserve une typographie sans-serif aux titres des petites cartes et garde leurs liens alignés en bas. Les liens internes passent par le routeur, les ancres de section restent natives et les liens externes ouvrent un nouvel onglet. `Timeline` utilise une liste ordonnée et des numéros cuivre ; `Accordion` conserve son comportement avec une présentation à filets et un signe plus.
- `ResponsiveComparisonTable appearance="editorial"` réutilise la même structure et les mêmes données pour les cartes mobiles et les tableaux desktop. Ses autres consommateurs conservent leurs réglages actuels. Aucun tableau métier n’est dupliqué dans une page pour gérer le responsive.
- La Home présente successivement le hero, un bandeau de preuves compact, les bénéfices avec leurs actions, une section d’expertise illustrée, trois étapes titrées, les actualités ou liens localisés, puis le CTA. Le bloc de présence locale est supprimé. L’image du hero est conservée ; la section d’expertise réutilise la photo de salon déjà disponible sous la clé `articleDpeMeublesTourisme`, avec un texte alternatif adapté.
- `PageHero` accepte un titre composé, un surtitre et une carte superposée optionnels. Sa taille `compact` réduit les introductions de FAQ, Prérequis et Procédure ainsi que l’espace avant leur premier contenu. La carte du hero revient dans le flux sur mobile, avec un léger chevauchement de l’image.
- `Timeline layout="horizontal"` présente les trois étapes de la Home en colonnes sur desktop, empilées sur mobile. La présentation verticale est conservée par défaut. La métadonnée optionnelle `meta` rattache les délais et repères à leurs étapes sur Procédure ; le bloc récapitulatif séparé est supprimé.
- Avantages présente trois bénéfices principaux immédiatement visibles et réserve les accordéons aux trois arguments secondaires. Les textes et données réglementaires restent conservés. Les Prérequis alternent checklist, contenu éditorial, détails et points bloquants.
- `editorial-eyebrow`, `editorial-proof-strip`, `editorial-media-split` et les classes de présentation des images partagent le vocabulaire Dordogne sans condition de route. `ArticleCard.imageSizes` permet d’annoncer la largeur des deux cartes égales de la Home tout en conservant le défaut de la grille d’actualités.
- Les Prérequis commencent par la checklist ; les explications des critères restent montées dans les accordéons. Les pages conservent les contenus FR/EN/NL, y compris les sources et réserves fiscales.
- Le footer regroupe le lien des zones avec les liens d’entreprise et augmente les tailles de texte. Le logo existant reçoit uniquement un traitement de couleur CSS partagé ; le fichier source reste disponible.
- La demande de classement et les enveloppes des deux formulaires utilisent les primitives communes. Validation, consentement, Turnstile, API et analytics restent inchangés. Leur migration fonctionnelle reste hors de ce spike.
- La Dordogne conserve sa composition validée. Ses liens de cartes s’alignent en bas et le lien de tarif du hero cible directement le champ commune.

Les tests des pages cœur vérifient aussi les cibles des sommaires et la présence de toutes les valeurs des comparatifs dans les deux présentations, sans figer les textes éditoriaux.

Contrôles du spike : 539 tests réussis ; tests ciblés des comparatifs, ancres et CTA relancés après ajustements ; `build:seo` réussi (typecheck et 54 pages prérendues). Le lint conserve uniquement l’avertissement préexistant de `SimulationClassement.tsx:970`. Les 18 routes cœur ont été parcourues à 390, 768, 1024 et 1440 px : un H1, bonne langue et aucun débordement horizontal. Dordogne et Demande ont aussi été contrôlées aux quatre largeurs ; menu mobile, navigation vers la demande, accordéons au clavier et sélection du tarif de Périgueux fonctionnent. Les CTA français des pages cœur reprennent « Demander mon classement ».

Le contrôle `verify:i18n-release` a réussi contre le site déployé (sa cible par défaut). La validation locale repose séparément sur les 54 fichiers prérendus : langue, H1 unique, canonical unique et cibles d’ancres. Les fichiers modifiés ont été vérifiés en UTF-8 sans BOM ni mojibake. Aucun formulaire réel n’a été envoyé.

Exécuter `npm run lint`, `npm run test:run`, `npm run verify:i18n-release`, puis `npm run build:seo` (typecheck inclus). `verify:i18n-release` contrôle par défaut le site déployé ; il ne valide pas les modifications locales. Comparer la Dordogne à 390, 768, 1024 et 1440 px, puis les parcours du shell en FR/EN/NL.

Lors de cette extraction, une erreur React d’hydratation #418 a été reproduite sur la Dordogne prérendue, également dans un build isolé de la référence `e66446c`. Elle préexiste au nouveau shell et reste à traiter séparément.
