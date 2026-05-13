# SEO simulateurs - contenus à fournir

Ce document liste les contenus et validations nécessaires pour finaliser le SEO des pages simulateur. Les emplacements techniques existent avec des placeholders `TODO_CONTENT_VALIDATION_REQUIRED`. Les textes ci-dessous ne sont pas appliqués aux pages tant qu'ils ne sont pas validés.

## 1. Blocs de contenu à fournir

| Route                           | Emplacement exact                          | Nom du bloc                         | Objectif SEO                                                                                         | Objectif UX / conversion                                                | Intention de recherche visée                                                      | Longueur recommandée | Sources officielles à utiliser                                                                   | Contraintes de ton                                        | Erreurs à éviter                                                                                | Placeholder actuellement utilisé                                      | Priorité |
| ------------------------------- | ------------------------------------------ | ----------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | -------- |
| `/simulateur`                   | Sous le hero, avant la grille de démarrage | Méthode du simulateur de classement | Renforcer la pertinence sur les recherches liées au simulateur de classement d'un meublé de tourisme | Expliquer ce que l'outil prépare avant que l'utilisateur commence       | `simulateur classement meublé de tourisme`, `grille classement meublé tourisme`   | 120 à 180 mots       | Atout France, référentiel de classement, guide de contrôle                                       | Factuel, neutre, sans injonction                          | Promesse de classement, conseil personnalisé, confusion entre estimation et décision officielle | Texte validé intégré dans `src/pages/Simulateur.tsx`.                 | Haute    |
| `/simulateur`                   | Sous le formulaire de configuration        | Limites du simulateur de classement | Réduire le risque de contenu trompeur ou assimilé à une décision officielle                          | Clarifier le statut non officiel du résultat avant la suite du parcours | `estimation classement meublé tourisme`, `simulation classement étoiles meublé`   | 80 à 120 mots        | Atout France, guide de contrôle, référentiel de classement                                       | Prudent, informatif, sans recommandation                  | Dire ou laisser entendre que le résultat vaut classement officiel                               | Texte validé intégré dans `src/pages/Simulateur.tsx`.                 | Haute    |
| `/simulateur-taxe-sejour`       | Sous le formulaire de calcul               | Sources et méthode taxe de séjour   | Renforcer la pertinence sur les recherches classé / non classé et taxe de séjour                     | Expliquer la base de calcul avant l'affichage d'un résultat             | `simulateur taxe de séjour meublé classé`, `taxe de séjour meublé non classé`     | 120 à 180 mots       | Service-Public Entreprendre, DELTA / collectivités, Code général des collectivités territoriales | Pédagogique, factuel, sans conseil juridique              | Généraliser abusivement une délibération locale, promettre un montant exact universel           | Texte validé intégré dans `src/pages/SimulateurTaxeSejour.tsx`.       | Haute    |
| `/simulateur-fiscal-classement` | Sous le formulaire fiscal                  | Hypothèses du simulateur fiscal     | Cibler les recherches micro-BIC 2026 liées au classement                                             | Expliquer les paramètres nécessaires avant interprétation               | `simulateur fiscal meublé classé 2026`, `micro-BIC meublé classé non classé 2026` | 120 à 180 mots       | DGFiP, economie.gouv.fr, CGI art. 50-0                                                           | Factuel, prudent, sans optimisation fiscale personnalisée | Promesse d'économie, conseil fiscal, conclusion automatique favorable au classement             | Texte validé intégré dans `src/pages/SimulateurFiscalClassement.tsx`. | Haute    |

## 2. Meta SEO à valider

Les propositions suivantes sont des brouillons de travail. Elles ne sont pas intégrées dans `src/content/seoRoutes.ts` tant qu'elles ne sont pas validées.

| Route                           | Title actuel                                      | Meta description actuelle                                                                                                                   | Title proposé, à valider                | Meta description proposée, à valider    | Intention SEO ciblée                                                   | Remarques                          |
| ------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------- |
| `/simulateur`                   | `Simulateur de classement meublé de tourisme`     | `Estimez gratuitement le classement possible de votre meublé de tourisme à partir de la grille officielle, avant une visite de classement.` | Intégré dans `src/content/seoRoutes.ts` | Intégré dans `src/content/seoRoutes.ts` | Recherche d'un outil d'estimation du classement officiel               | Title et meta description validés. |
| `/simulateur-taxe-sejour`       | `Simulateur de taxe de séjour meublé de tourisme` | `Calculez gratuitement l’écart de taxe de séjour entre un meublé non classé et un meublé classé, selon la commune et le nombre d’étoiles.`  | Intégré dans `src/content/seoRoutes.ts` | Intégré dans `src/content/seoRoutes.ts` | Recherche de calcul de taxe de séjour pour meublé classé ou non classé | Title et meta description validés. |
| `/simulateur-fiscal-classement` | `Simulateur fiscal meublé classé 2026`            | `Comparez gratuitement la fiscalité d’un meublé classé et non classé avec les seuils et abattements micro-BIC 2026.`                        | Intégré dans `src/content/seoRoutes.ts` | Intégré dans `src/content/seoRoutes.ts` | Recherche de comparaison fiscale classé / non classé en 2026           | Title et meta description validés. |

## 3. CTA à valider

| Fichier concerné                                 | Texte actuel                                                                                       | Problème identifié  | Risque SEO / juridique / conversion                                   | Direction de reformulation proposée | Statut |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ------------------- | --------------------------------------------------------------------- | ----------------------------------- | ------ |
| `src/components/simulator/SimulationGridTab.tsx` | `Faites votre demande en ligne et bénéficiez des avantages du classement officiel dès maintenant.` | Formulation validée | Formulation assumée pour le CTA de sortie du simulateur de classement | Conserver le texte actuel           | Validé |

Les CTA fonctionnels comme `Calculer`, `Reprendre`, `Exporter PDF`, `Copier le lien`, `Retour aux pièces` restent considérés comme des libellés d'interface, pas comme des contenus éditoriaux à reformuler en priorité.

## 4. Images éventuelles à fournir

| Page concernée                  | Usage prévu | Sujet recommandé                                                                                               | Format attendu                                                                  | Contraintes de performance                                                                              | Alt text à fournir ou valider                               | Statut                                                                          |
| ------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `/simulateur`                   | OG image    | `gunnar-ridderstrom-4I26owL4-yk-unsplash.jpg`, avec texte OG `Simulateur de classement` / `Meublé de tourisme` | Composition 1200 × 630 px, variantes générées 480 / 768 / 1200 / 1600 / 1920 px | Passage par `npm run images:build`, formats AVIF/WebP/JPG, overlay bleu nuit, logo discret, marge 80 px | Non applicable : image Open Graph non affichée dans la page | Image intégrée dans `src/content/seoRoutes.ts` via `simulateurClassement`       |
| `/simulateur-taxe-sejour`       | OG image    | `pexels-arnaud-32767039.jpg`, avec texte OG `Simulateur taxe de séjour` / `Classé vs non classé`               | Composition 1200 × 630 px, variantes générées 480 / 768 / 1200 / 1600 / 1920 px | Passage par `npm run images:build`, formats AVIF/WebP/JPG, overlay bleu nuit, logo discret, marge 80 px | Non applicable : image Open Graph non affichée dans la page | Image intégrée dans `src/content/seoRoutes.ts` via `simulateurTaxeSejour`       |
| `/simulateur-fiscal-classement` | OG image    | `kelly-sikkema-0oZpRxG5Hkk-unsplash.jpg`, avec texte OG `Simulateur fiscal 2026` / `Classé vs non classé`      | Composition 1200 × 630 px, variantes générées 480 / 768 / 1200 / 1600 / 1920 px | Passage par `npm run images:build`, formats AVIF/WebP/JPG, overlay bleu nuit, logo discret, marge 80 px | Non applicable : image Open Graph non affichée dans la page | Image intégrée dans `src/content/seoRoutes.ts` via `simulateurFiscalClassement` |

## 5. Sources officielles recommandées par page

### `/simulateur`

- Atout France.
- Référentiel de classement des meublés de tourisme.
- Guide de contrôle des meublés de tourisme.

### `/simulateur-taxe-sejour`

- Service-Public Entreprendre.
- DELTA / délibérations des collectivités.
- Code général des collectivités territoriales.

### `/simulateur-fiscal-classement`

- DGFiP.
- economie.gouv.fr.
- Code général des impôts, article 50-0.

## 6. Checklist pour la prochaine passe

- [x] Fournir le texte validé du bloc `Méthode du simulateur de classement`.
- [x] Fournir le texte validé du bloc `Limites du simulateur de classement`.
- [x] Fournir le texte validé du bloc `Sources et méthode taxe de séjour`.
- [x] Fournir le texte validé du bloc `Hypothèses du simulateur fiscal`.
- [x] Valider ou ajuster les titles SEO proposés.
- [x] Valider ou ajuster les meta descriptions proposées.
- [x] Valider la reformulation du CTA identifié dans `SimulationGridTab.tsx`.
- [x] Fournir les images validées si des images dédiées aux simulateurs sont retenues.
- [x] Fournir ou valider les alt texts associés aux images retenues.
