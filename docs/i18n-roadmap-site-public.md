# Roadmap i18n - Site public Etoilys

Document de suivi pour découper et implémenter progressivement la version anglaise du site public Etoilys.

Source de vérité stratégique : `docs/etoilys-strategie-i18n-site-public.md`.

## 1. Objectif

Ajouter une version anglaise native du site public Etoilys, maintenable, propre pour le SEO et fidèle à la version française.

Le chantier doit conserver le français comme langue par défaut, préserver toutes les routes françaises existantes, ajouter des URLs anglaises propres avec slugs traduits, et permettre l'ajout futur du néerlandais sans reconstruire l'architecture.

La traduction doit rester factuelle, sobre et bloc par bloc. Elle ne doit pas transformer la copy en argumentaire marketing, ni ajouter d'informations juridiques ou fiscales absentes de la version française.

## 2. Décisions actées

- [x] Le français reste la langue principale.
- [x] `/` reste la version française.
- [x] La phase 1 concerne uniquement l'anglais.
- [x] Le néerlandais pourra venir plus tard, mais il n'est pas dans le MVP.
- [x] L'architecture doit rester extensible pour ajouter `nl`.
- [x] Les URLs anglaises doivent utiliser des slugs traduits, pas des URLs du type `/en/classement`.
- [x] Aucune redirection automatique vers `/en` selon la langue du navigateur.
- [x] Un vrai sélecteur de langue visible est nécessaire.
- [x] Les formulaires Contact et Demande de classement doivent être traduits dès le MVP.
- [x] Les demandes envoyées depuis la version anglaise doivent transmettre `preferredLanguage: "en"` dans le MVP.
- [x] Les simulateurs complets ne sont pas dans le MVP.
- [x] Les Actualités ne sont pas dans le MVP.
- [x] La politique de confidentialité doit être traduite si les formulaires sont traduits.
- [x] Les mentions légales peuvent être traduites dans une phase suivante.
- [x] Les sources officielles françaises restent disponibles ; ne pas inventer de sources anglaises.
- [x] Les disclaimers restent sobres.
- [x] La traduction se fait page par page, bloc par bloc, à partir du français.
- [x] Pour les routes sans équivalent anglais, le sélecteur de langue masque ou désactive l'option EN ; pas de fallback automatique vers `/en/` par défaut.
- [x] Sur la home EN, ne pas afficher les derniers articles Actualités FR pendant le MVP ; les remplacer par des liens de service EN.
- [x] Aucun message d'erreur visible par l'utilisateur sur une page EN ne doit rester en français.
- [x] Pour le MVP, stocker `preferredLanguage` dans `payload_json` et l'afficher dans la notification email interne, sans colonne dédiée.
- [x] `/en/privacy-policy` doit être une traduction complète, sobre et fidèle de la politique de confidentialité française.
- [x] Le sitemap doit inclure les routes EN indexables du MVP et leurs alternatives `hreflang` réciproques dès le Lot 2.

## 3. Périmètre MVP anglais

| Page FR                        | Page EN recommandée                                              | Priorité                    | Statut |
| ------------------------------ | ---------------------------------------------------------------- | --------------------------- | ------ |
| `/`                            | `/en/`                                                           | MVP                         | [ ]    |
| `/classement`                  | `/en/furnished-tourist-accommodation-classification`             | MVP                         | [ ]    |
| `/les-avantages-du-classement` | `/en/benefits-of-furnished-tourist-accommodation-classification` | MVP                         | [ ]    |
| `/prerequis-au-classement`     | `/en/classification-requirements`                                | MVP                         | [ ]    |
| `/procedure`                   | `/en/classification-process`                                     | MVP                         | [ ]    |
| `/faq`                         | `/en/faq`                                                        | MVP                         | [ ]    |
| `/contact`                     | `/en/contact`                                                    | MVP                         | [ ]    |
| `/demande-classement`          | `/en/request-a-classification`                                   | MVP                         | [ ]    |
| `/confidentialite`             | `/en/privacy-policy`                                             | MVP si formulaires traduits | [ ]    |

Sur la home EN, ne pas afficher les derniers articles Actualités FR tant qu'aucun article evergreen anglais n'est publié. Remplacer ce bloc par des liens de service EN, par exemple : procédure, avantages du classement, FAQ et demande de classement.

Pages françaises à conserver sans changement pendant le MVP :

- [ ] Toutes les routes françaises existantes.
- [ ] Les pages locales départementales.
- [ ] Les simulateurs.
- [ ] Les Actualités.
- [ ] Les mentions légales.
- [ ] La page Recrutement.

## 4. Hors périmètre MVP

- [ ] Traduction complète des simulateurs.
- [ ] Traduction des Actualités.
- [ ] Version néerlandaise.
- [ ] Traduction des pages locales départementales.
- [ ] Traduction de `zones-intervention`.
- [ ] Traduction de `recrutement`.
- [ ] Traduction des mentions légales, sauf décision dédiée.
- [ ] Changement du design global.
- [ ] Réécriture de la copy française.
- [ ] Refonte des formulaires.
- [ ] Modification backend non nécessaire au stockage minimal de la langue.
- [ ] Ajout d'une dépendance i18n sans besoin démontré.

## 5. Audit technique initial

Constats déjà vérifiés dans le repo :

- [x] Les routes sont déclarées dans `src/AppRoutes.tsx`, sous `src/components/layout/Layout.tsx`.
- [x] `src/App.tsx` utilise `BrowserRouter`.
- [x] Le SEO est centralisé via `src/content/seoRoutes.ts`, `src/components/ui/SEO.tsx`, `Layout`, `scripts/generate-sitemap.ts` et `scripts/prerender.ts`.
- [x] `SEO` ne gère pas encore `hreflang`.
- [x] `SEO` ne modifie pas encore `document.documentElement.lang`.
- [x] `index.html` porte actuellement `<html lang="fr">`.
- [x] Aucun package i18n n'est installé dans `package.json`.
- [x] Le sitemap est généré depuis `getIndexablePaths()`, sans alternatives `hreflang`.
- [x] Le prerender reconstruit les balises SEO et devra aussi être adapté.
- [x] Les formulaires publics sont `ContactForm` et `DemandeClassementForm`.
- [x] Les validations frontend sont dans `src/utils/formValidation.ts`.
- [x] Les appels formulaires passent par `src/utils/api.ts`.
- [x] Les Edge Functions reconstruisent explicitement leurs payloads et ne persistent pas encore `preferredLanguage`.
- [x] La table Supabase `form_submissions` contient `payload_json`, exploitable pour stocker la langue sans migration SQL dédiée si le champ reste dans ce JSON.
- [x] Les tests existants couvrent déjà routes, gouvernance SEO, liens légaux de formulaires et images critiques.

Checklist à reprendre au début du Lot 0 :

- [x] Relire `docs/etoilys-strategie-i18n-site-public.md`.
- [x] Relire `docs/contexte-projet-etoilys.md`.
- [x] Relire `docs/seo-structurant-workflow.md`.
- [x] Vérifier que la liste des routes actives n'a pas changé depuis cette roadmap.
- [x] Vérifier que le sitemap est toujours généré depuis `src/content/seoRoutes.ts`.
- [x] Vérifier que les contrats Supabase des formulaires n'ont pas évolué.

## 6. Architecture i18n proposée

Approche recommandée : socle i18n léger, typé, sans dépendance i18n pour le MVP, sauf besoin découvert pendant l'implémentation.

Créer une source centrale pour les locales :

- [x] Créer `src/i18n/locales.ts`.
- [x] Définir `DEFAULT_LOCALE = "fr"`.
- [x] Définir `SUPPORTED_LOCALES = ["fr", "en"] as const`.
- [x] Exporter le type `Locale`.
- [x] Prévoir une extension future à `nl`.
- [x] Éviter les hardcodes dispersés de `fr` et `en`.

Créer une table centrale des routes localisées :

- [x] Créer une table `localizedRoutes` avec des IDs stables : `home`, `classement`, `avantages`, `prerequis`, `procedure`, `faq`, `contact`, `demandeClassement`, `confidentialite`.
- [x] Stocker pour chaque ID le path FR et le path EN.
- [ ] Utiliser cette table pour le routing, les liens internes, le language switcher, le SEO, le sitemap et les tests.
- [x] Prévoir un comportement explicite pour les routes sans équivalent anglais.

Helpers attendus :

- [x] `getLocaleFromPath(pathname)` : déduit `fr` ou `en` depuis l'URL.
- [x] `getRouteIdFromPath(pathname)` : retrouve l'ID de page localisée.
- [x] `getLocalizedPath(routeId, locale)` : retourne le path cible.
- [x] `getLocalizedPathFromPathname(pathname, targetLocale)` : retourne le chemin localisé si un équivalent existe, sinon `null`.
- [x] `getAlternateLocaleLinks(pathname, baseUrl)` : retourne les alternatives de langue absolues pour préparer le SEO, le sitemap et le prerender sans les brancher pendant le Lot 1.
- [x] `isLocalizedRoute(pathname)` : distingue les routes MVP traduites des autres routes.

Contenu et traductions :

- [ ] Utiliser des objets TypeScript structurés pour les pages longues plutôt qu'un gros JSON global.
- [ ] Regrouper les textes courts d'interface par domaine : navigation, footer, formulaires, messages, CTA.
- [ ] Garder les contenus longs page par page pour faciliter la traduction bloc par bloc.
- [ ] Préserver les composants UI existants.

Fichiers probables :

- `src/i18n/locales.ts`
- `src/i18n/localizedRoutes.ts`
- `src/i18n/routeHelpers.ts`
- `src/content/seoRoutes.ts`
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/ui/SEO.tsx`

Critères d'acceptation :

- [x] Les locales sont typées.
- [x] Les chemins FR/EN du MVP sont définis à un seul endroit.
- [x] Les helpers sont testables sans rendre l'application.
- [x] Les helpers permettent de détecter proprement l'absence d'équivalent localisé, sans fallback automatique.
- [x] Les helpers préparent les alternatives `hreflang` sans couplage au SEO, au sitemap ou au prerender.
- [x] L'ajout futur de `nl` ne nécessite pas de refonte.

## 7. Routing localisé

Stratégie attendue :

- [ ] Conserver toutes les routes françaises existantes.
- [ ] Ajouter les routes anglaises MVP sous `/en/`.
- [ ] Utiliser des slugs anglais propres.
- [ ] Garder la route inconnue `*` avec le fallback `noindex,follow`.
- [ ] Ne pas rediriger automatiquement `/` vers `/en`.
- [ ] Gérer les liens internes par la table `localizedRoutes`.
- [ ] Prévoir les équivalents de page pour le language switcher.
- [ ] Pour une route sans équivalent anglais, masquer ou désactiver l'option EN dans le language switcher.
- [ ] Ne pas utiliser `/en/` comme fallback automatique. Un fallback vers `/en/` n'est autorisé que pour un cas précis explicitement documenté.

Fichiers probables :

- `src/AppRoutes.tsx`
- `src/i18n/localizedRoutes.ts`
- `src/i18n/routeHelpers.ts`
- `src/test/routes.test.tsx`

Dépendances :

- Lot 1 doit fournir les locales et la table de routes.
- Lot 2 doit synchroniser routing, SEO, sitemap et prerender.

Critères d'acceptation :

- [ ] Les routes françaises existantes rendent toujours les mêmes pages.
- [ ] Les routes anglaises MVP rendent les pages prévues.
- [ ] Les routes hors MVP ne sont pas exposées artificiellement en anglais.
- [ ] Les routes sans équivalent anglais ne déclenchent pas de fallback automatique vers `/en/`.
- [ ] La 404 reste disponible et `noindex,follow`.

## 8. SEO multilingue

Le SEO doit rester centralisé. Ne pas injecter de SEO directement dans `src/pages/*`.

Tâches :

- [x] Étendre `SeoRouteConfig` pour supporter la locale, les alternatives ou un ID de route localisée.
- [x] Ajouter les métadonnées anglaises dans `src/content/seoRoutes.ts` ou une structure équivalente centralisée.
- [x] Ajouter un état explicite de disponibilité des contenus EN, par exemple `EN_CONTENT_READY = false` tant que le Lot 5 n'est pas livré.
- [x] Garder les routes EN MVP en `noindex,follow` et hors sitemap tant que les contenus anglais ne sont pas prêts.
- [x] Chaque page anglaise doit avoir une canonical vers elle-même.
- [ ] Chaque page française traduite doit référencer son alternative anglaise via `hreflang`.
- [ ] Chaque page anglaise doit référencer son alternative française via `hreflang`.
- [x] Ne jamais exposer de `hreflang` depuis une page FR vers une page EN `noindex`.
- [x] Générer les alternates EN uniquement lorsque la version EN est indexable.
- [x] Ajouter `x-default`, probablement vers la version française.
- [x] Exposer la bonne langue HTML : `fr` ou `en`.
- [x] Adapter les breadcrumbs JSON-LD aux libellés anglais sur routes anglaises.
- [x] Garder Home et 404 sans `BreadcrumbList`.
- [x] Mettre à jour le sitemap pour inclure les routes anglaises indexables.
- [x] Ajouter les alternatives `hreflang` réciproques dans le sitemap dès le Lot 2.
- [x] Tester dès le Lot 2 l'infrastructure sitemap/hreflang, même si les URLs EN restent filtrées tant que `EN_CONTENT_READY = false`.
- [x] Ne pas livrer de sitemap intermédiaire avec seulement les URLs EN sans alternatives `hreflang`, sauf blocage technique documenté.
- [x] Adapter `scripts/prerender.ts`, car il reconstruit le head SEO indépendamment du composant React.
- [x] Marquer les liens `hreflang` prerendered comme gérés par le SEO afin que `SEO.tsx` puisse les nettoyer sans doublon à l'hydratation.
- [x] Vérifier qu'il n'existe toujours qu'un seul injecteur `<SEO />` dans le layout.

Fichiers probables :

- `src/content/seoRoutes.ts`
- `src/components/ui/SEO.tsx`
- `src/components/layout/Layout.tsx`
- `scripts/generate-sitemap.ts`
- `scripts/prerender.ts`
- `src/test/seo-governance.test.ts`

Critères d'acceptation :

- [x] Canonical FR inchangées.
- [x] Canonical EN auto-référentes sur les routes EN techniques.
- [x] Routes EN MVP `noindex,follow` tant que `EN_CONTENT_READY = false`.
- [x] Aucun `hreflang` FR -> EN n'est exposé tant que la route EN correspondante est `noindex`.
- [x] `hreflang` réciproques présents en SPA et en prerender dès que les deux versions sont indexables.
- [x] `x-default` présent sur les paires traduites dès que les deux versions sont indexables.
- [x] `<html lang>` correct après navigation SPA et dans les fichiers prerendus.
- [x] Sitemap aligné avec les routes indexables et enrichi avec les alternatives `hreflang` réciproques.
- [x] Aucune route `noindex` dans le sitemap.
- [x] Aucun doublon de liens `hreflang` après hydratation d'une page prerendered.
- [ ] Tout report du `hreflang` sitemap documente la raison exacte, les fichiers impactés, le comportement temporaire et la tâche de suivi.

## 9. Layout, navigation, footer et language switcher

Tâches :

- [ ] Traduire le header en anglais pour les routes EN.
- [ ] Traduire le footer en anglais pour les routes EN.
- [ ] Traduire les CTA globaux.
- [ ] Ajouter un sélecteur de langue visible desktop et mobile.
- [ ] Le switcher doit pointer vers la page équivalente quand elle existe.
- [ ] Si l'équivalent n'existe pas, masquer ou désactiver proprement l'option de langue indisponible.
- [ ] Le fallback vers `/en/` n'est autorisé que si ce comportement est explicitement documenté pour un cas précis.
- [ ] Le comportement doit être identique en desktop et en mobile.
- [ ] Ne pas casser le menu mobile.
- [ ] Conserver les tokens Tailwind et composants existants.
- [ ] Ne pas modifier le design global au-delà du strict nécessaire.

Fichiers probables :

- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Layout.tsx`
- `src/i18n/localizedRoutes.ts`
- `src/i18n/navigationContent.ts`

Critères d'acceptation :

- [ ] Navigation FR inchangée sur routes FR.
- [ ] Navigation EN cohérente sur routes EN.
- [ ] Switcher utilisable au clavier.
- [ ] Switcher visible en desktop et mobile.
- [ ] Les liens du switcher sont de vrais liens React Router.
- [ ] Les routes sans équivalent EN ne renvoient pas automatiquement vers `/en/`.
- [ ] Le comportement indisponible/masqué est couvert par tests desktop et mobile.
- [ ] Aucun chevauchement ou débordement visible dans le header mobile.

## 10. Formulaires

Tâches :

- [ ] Traduire le formulaire Contact.
- [ ] Traduire le formulaire Demande de classement.
- [ ] Traduire labels, placeholders, erreurs, succès, CTA et textes d'aide.
- [ ] Traduire le lien et le libellé de consentement RGPD.
- [ ] Le lien confidentialité doit pointer vers `/en/privacy-policy` depuis les formulaires EN.
- [ ] Adapter `validateContactForm` et `validateDemandeClassementForm` pour retourner des messages localisés, ou séparer validation et messages.
- [ ] Prévoir l'envoi de `preferredLanguage: "en"` depuis les pages anglaises.
- [ ] Adapter les Edge Functions pour stocker `preferredLanguage` dans `payload_json` et l'afficher dans les notifications email.
- [ ] Ne pas créer de colonne dédiée `preferredLanguage` dans le MVP.
- [ ] N'envisager une colonne dédiée que dans un lot ultérieur si un besoin de filtrage, reporting, back-office ou automatisation apparaît.
- [ ] Localiser tous les messages d'erreur visibles par l'utilisateur sur les pages EN.
- [ ] Mapper côté front les erreurs backend attendues vers des messages localisés si possible.
- [ ] Afficher un message générique localisé pour les erreurs backend imprévues.
- [ ] Laisser les logs et notifications internes techniques ou en français si nécessaire.
- [ ] Ne pas ajouter une migration SQL si le stockage JSON suffit.
- [ ] Si une colonne dédiée devient nécessaire, documenter et créer une migration dédiée dans un lot séparé.
- [ ] Ne pas casser les formulaires français.

Fichiers probables :

- `src/components/forms/ContactForm.tsx`
- `src/components/forms/DemandeClassementForm.tsx`
- `src/utils/formValidation.ts`
- `src/utils/api.ts`
- `supabase/functions/public-forms-contact/index.ts`
- `supabase/functions/public-forms-classement/index.ts`
- `supabase/functions/_shared/formSubmission.ts`
- `src/test/forms-legal-links.test.tsx`

Critères d'acceptation :

- [ ] Les formulaires FR restent identiques fonctionnellement.
- [ ] Les formulaires EN affichent tous les textes en anglais.
- [ ] Les erreurs frontend sont localisées.
- [ ] Aucun message d'erreur visible sur page EN ne reste en français.
- [ ] Les erreurs backend attendues sont mappées vers des messages EN ou remplacées par un message générique EN.
- [ ] Le payload EN contient `preferredLanguage: "en"`.
- [ ] `preferredLanguage` est stocké dans `payload_json`.
- [ ] La notification interne mentionne la langue préférée.

## 11. Traduction des pages MVP

Règle générale pour chaque page :

- [ ] Identifier les blocs de contenu français.
- [ ] Créer ou compléter la structure de contenu anglaise.
- [ ] Traduire bloc par bloc fidèlement.
- [ ] Adapter uniquement les formulations maladroites en anglais.
- [ ] Ne pas ajouter d'informations absentes de la version française.
- [ ] Conserver les sources officielles françaises.
- [ ] Ajouter une mention sobre si une source officielle est en français.
- [ ] Vérifier les liens internes.
- [ ] Vérifier les CTA.
- [ ] Vérifier les métadonnées SEO anglaises.
- [ ] Vérifier la conformité éditoriale : pas de promesse business, pas de conseil personnalisé.

### Page : Accueil

- [ ] Traduire hero, CTA, cartes de bénéfices, blocs de preuve, derniers liens utiles.
- [ ] Ne pas afficher les derniers articles Actualités FR sur la home EN.
- [ ] Remplacer le bloc Actualités par des liens de service EN tant qu'aucun article evergreen anglais n'est publié.
- [ ] Vérifier l'image LCP et les textes alternatifs.

### Page : Classement

- [ ] Traduire les définitions du classement.
- [ ] Conserver Atout France, Cofrac et les sources françaises.
- [ ] Garder la terminologie `furnished tourist accommodation`.

### Page : Avantages du classement

- [ ] Traduire fiscalité, taxe de séjour, repère officiel et ANCV avec prudence.
- [ ] Ne pas ajouter de bénéfice non présent en français.
- [ ] Éviter les promesses de revenus, réservations ou performance.

### Page : Prérequis

- [ ] Traduire les critères minimaux.
- [ ] Garder le vocabulaire technique stable.
- [ ] Ne pas transformer les prérequis en recommandations personnalisées.

### Page : Procédure

- [ ] Traduire les étapes.
- [ ] Conserver les délais, documents et références.
- [ ] Vérifier les liens vers PDF ou sources officielles.

### Page : FAQ

- [ ] Traduire les questions/réponses MVP.
- [ ] Conserver les sources officielles.
- [ ] Vérifier la lisibilité des termes français officiels.

### Page : Contact

- [ ] Traduire les textes de page.
- [ ] Utiliser le formulaire Contact EN.
- [ ] Vérifier téléphone, email et adresse.

### Page : Demande de classement

- [ ] Traduire les textes de page.
- [ ] Utiliser le formulaire Demande de classement EN.
- [ ] Transmettre `preferredLanguage: "en"`.

### Page : Confidentialité

- [ ] Traduire complètement, sobrement et fidèlement la politique de confidentialité française.
- [ ] Adapter uniquement lorsque nécessaire pour la lisibilité anglaise.
- [ ] Conserver les données business alignées avec la version française.
- [ ] Vérifier que le texte couvre les formulaires EN.

## 12. Règles de traduction à respecter

- [ ] Le français reste la source de vérité.
- [ ] Traduction fidèle, page par page, bloc par bloc.
- [ ] Même ton que la version française.
- [ ] Pas de réécriture marketing.
- [ ] Pas d'ajout juridique ou fiscal non présent dans le texte français.
- [ ] Pas de longs disclaimers.
- [ ] Pas de promesse de résultat business.
- [ ] Pas de recommandation personnalisée aux propriétaires.
- [ ] Sources officielles françaises conservées.
- [ ] Signaler sobrement les sources en français lorsque pertinent.

Terminologie à stabiliser :

| Terme FR                           | Formulation EN de référence                                |
| ---------------------------------- | ---------------------------------------------------------- |
| classement des meublés de tourisme | official classification of furnished tourist accommodation |
| meublé de tourisme                 | furnished tourist accommodation (`meublé de tourisme`)     |
| classement                         | official classification / star rating classification       |
| taxe de séjour                     | tourist tax (`taxe de séjour`)                             |
| micro-BIC                          | micro-BIC tax regime                                       |
| régime réel                        | actual expenses tax regime / `régime réel`                 |
| Atout France                       | Atout France                                               |
| Cofrac                             | Cofrac                                                     |
| organisme accrédité                | accredited inspection body                                 |
| certificat de visite               | inspection certificate                                     |
| décision de classement             | classification decision                                    |
| déclaration en mairie              | declaration to the local town hall                         |
| changement d'usage                 | change of use authorisation                                |
| résidence principale               | main residence                                             |
| résidence secondaire               | second home                                                |

## 13. Tests et contrôles qualité

Tests à prévoir pendant l'implémentation :

- [ ] Ajouter ou adapter les tests de routes localisées.
- [ ] Tester les liens du language switcher.
- [ ] Tester que le language switcher masque ou désactive l'option EN sur les routes sans équivalent.
- [ ] Tester que le language switcher ne fallback pas automatiquement vers `/en/`.
- [ ] Tester que les routes françaises fonctionnent toujours.
- [ ] Tester que les routes anglaises existent.
- [ ] Tester les canonical anglaises.
- [ ] Tester les `hreflang` réciproques.
- [ ] Tester les alternatives `hreflang` dans le sitemap dès le Lot 2.
- [ ] Tester `x-default`.
- [ ] Tester `<html lang="fr">` et `<html lang="en">`.
- [ ] Tester les breadcrumbs JSON-LD EN.
- [ ] Tester les formulaires en français.
- [ ] Tester les formulaires en anglais.
- [ ] Tester `preferredLanguage`.
- [ ] Tester que les erreurs visibles sur pages EN sont localisées.
- [ ] Vérifier le sitemap, y compris les alternatives `hreflang` réciproques.
- [ ] Vérifier le prerender.
- [ ] Vérifier qu'aucune route anglaise indexable ne manque dans le SEO.
- [ ] Vérifier qu'aucune route `noindex` ne part dans le sitemap.
- [ ] Vérifier qu'aucune page n'importe `SEO` directement.
- [ ] Vérifier qu'il n'existe qu'un seul injecteur `<SEO />`.
- [ ] Vérifier l'absence de scripts JSON-LD dupliqués après navigation SPA.
- [ ] Vérifier l'absence de BOM et de marqueurs de mojibake dans les fichiers modifiés.

Commandes à prévoir :

```bash
npm run typecheck
npm run lint
npm run test:run
npm run build
npm run seo:sitemap
npm run prerender
npm run build:seo
```

Si une commande échoue à cause d'un problème existant non lié à l'i18n, documenter précisément :

- [ ] la commande lancée ;
- [ ] l'erreur ;
- [ ] le fichier concerné ;
- [ ] pourquoi l'erreur est considérée hors périmètre ;
- [ ] la correction recommandée.

## 14. Découpage recommandé en lots

### Lot 0 - Préparation et inventaire

Dépendances : aucune.

Fichiers probables à lire :

- `docs/etoilys-strategie-i18n-site-public.md`
- `docs/contexte-projet-etoilys.md`
- `docs/seo-structurant-workflow.md`
- `src/AppRoutes.tsx`
- `src/content/seoRoutes.ts`
- `src/components/layout/*`
- `src/components/forms/*`
- `scripts/generate-sitemap.ts`
- `scripts/prerender.ts`

Checklist :

- [x] Confirmer la stratégie technique.
- [x] Confirmer la liste des routes MVP.
- [x] Identifier les composants qui contiennent du texte global.
- [x] Identifier les textes courts réutilisables.
- [x] Identifier les pages à traduire bloc par bloc.
- [x] Confirmer les tests existants à étendre.
- [x] Lister les questions ouvertes restantes.

Critères d'acceptation :

- [x] Le périmètre MVP est confirmé.
- [x] Les risques backend/formulaires sont identifiés.
- [x] Le Lot 1 peut être implémenté sans décision restante.

### Lot 1 - Socle i18n technique

Dépendances : Lot 0.

Checklist :

- [x] Créer la configuration des locales.
- [x] Créer la table centrale des routes localisées.
- [x] Créer les helpers de locale et de route.
- [x] Créer `getLocalizedPathFromPathname(pathname, targetLocale)` pour retourner le chemin équivalent ou `null` sans fallback automatique.
- [x] Créer `getAlternateLocaleLinks(pathname, baseUrl)` pour préparer les alternatives absolues `hreflang` sans branchement SEO/sitemap/prerender.
- [x] Ajouter des tests unitaires pour les helpers.
- [x] Ne pas ajouter de dépendance i18n.

Critères d'acceptation :

- [x] Les chemins FR/EN du MVP sont typés.
- [x] Les helpers couvrent `/`, `/en/`, les slugs EN et les routes inconnues.
- [x] Les helpers retournent `null` quand une route n'a pas d'équivalent dans la langue cible.
- [x] Les alternatives de langue sont produites par un helper pur, testable sans rendu React.
- [x] `npm run typecheck` passe.

### Lot 2 - Routing, SEO, sitemap et prerender

Dépendances : Lot 1.

Checklist :

- [x] Ajouter les routes anglaises MVP.
- [x] Ajouter les métadonnées anglaises techniques, limitées au SEO et aux breadcrumbs JSON-LD.
- [x] Ajouter un gating explicite d'indexation EN, avec `EN_CONTENT_READY = false` à la fin du Lot 2.
- [x] Implémenter canonical EN.
- [x] Implémenter `hreflang` réciproques.
- [x] Implémenter `x-default`.
- [x] Adapter `<html lang>`.
- [x] Adapter breadcrumbs JSON-LD.
- [x] Adapter le sitemap avec les routes EN indexables et leurs alternatives `hreflang` réciproques, mais filtrer les URLs EN tant que `EN_CONTENT_READY = false`.
- [ ] Documenter tout report du `hreflang` sitemap avec raison exacte, fichiers impactés, comportement temporaire et tâche de suivi.
- [x] Adapter prerender.
- [x] Aligner le marquage des liens `hreflang` entre prerender et SPA pour éviter les doublons après hydratation.
- [x] Étendre les tests de gouvernance SEO.

Critères d'acceptation :

- [x] Routes FR non régressées.
- [x] Routes EN MVP techniques présentes et `noindex,follow`.
- [x] Routes EN absentes du sitemap tant que `EN_CONTENT_READY = false`.
- [x] Sitemap aligné avec les routes indexables et prêt à être enrichi avec les alternatives `hreflang` réciproques dès activation EN.
- [x] Prerender contient canonical, `hreflang` et `lang` corrects.
- [x] Les liens `hreflang` prerendered sont nettoyables par `SEO.tsx` après hydratation.

### Lot 3 - Layout global et language switcher

Dépendances : Lot 1 et idéalement Lot 2.

Checklist :

- [ ] Traduire le header.
- [ ] Traduire le footer.
- [ ] Traduire les CTA globaux.
- [ ] Ajouter le language switcher desktop.
- [ ] Ajouter le language switcher mobile.
- [ ] Tester les liens équivalents.
- [ ] Masquer ou désactiver l'option EN sur les routes sans équivalent.
- [ ] Ne documenter un fallback vers `/en/` que pour un cas précis explicitement choisi.

Critères d'acceptation :

- [ ] Le switcher est visible et accessible.
- [ ] Le menu mobile fonctionne toujours.
- [ ] Les liens FR/EN pointent vers les équivalents attendus.
- [ ] Les routes sans équivalent EN ne renvoient pas automatiquement vers `/en/`.
- [ ] Le comportement est cohérent en desktop et en mobile.

### Lot 4 - Formulaires et `preferredLanguage`

Dépendances : Lots 1 à 3.

Checklist :

- [ ] Localiser ContactForm.
- [ ] Localiser DemandeClassementForm.
- [ ] Localiser les messages de validation.
- [ ] Localiser les messages de succès et d'erreur frontend.
- [ ] Envoyer `preferredLanguage`.
- [ ] Adapter les Edge Functions pour stocker `preferredLanguage` dans `payload_json`.
- [ ] Ajouter la langue dans les notifications email internes.
- [ ] Mapper côté front les erreurs backend attendues vers des messages localisés quand c'est possible.
- [ ] Afficher un message générique localisé pour les erreurs backend imprévues.
- [ ] Ne pas créer de colonne dédiée `preferredLanguage` dans le MVP.
- [ ] Tester les liens vers la confidentialité FR/EN.

Critères d'acceptation :

- [ ] Les formulaires FR restent fonctionnels.
- [ ] Les formulaires EN sont cohérents.
- [ ] Aucun message d'erreur visible sur page EN ne reste en français.
- [ ] `preferredLanguage: "en"` est présent pour les soumissions EN.
- [ ] `preferredLanguage` est stocké dans `payload_json` et mentionné dans l'email interne.
- [ ] Aucun contournement frontend permanent ne masque un contrat backend manquant.

### Lot 5 - Pages de contenu MVP

Dépendances : Lots 1 à 4.

Checklist :

- [ ] Accueil.
- [ ] Classement.
- [ ] Avantages du classement.
- [ ] Prérequis.
- [ ] Procédure.
- [ ] FAQ.
- [ ] Contact.
- [ ] Demande de classement.
- [ ] Confidentialité.
- [ ] Home EN sans bloc derniers articles Actualités FR ; utiliser des liens de service EN tant qu'aucun article evergreen EN n'est publié.
- [ ] `/en/privacy-policy` complète, sobre et fidèle à la version française.
- [ ] Activer l'indexation EN uniquement après validation complète des contenus anglais.
- [ ] Repasser `EN_CONTENT_READY` ou l'équivalent à `true` seulement quand aucune page EN MVP ne contient encore de contenu français.
- [ ] Vérification des liens internes.
- [ ] Vérification des sources.
- [ ] Vérification conformité éditoriale.

Critères d'acceptation :

- [ ] Chaque page EN est entièrement traduite.
- [ ] Les sources officielles restent disponibles.
- [ ] Aucun contenu juridique/fiscal nouveau n'est ajouté.
- [ ] La terminologie est cohérente.

### Lot 6 - QA complète et release

Dépendances : Lots 1 à 5.

Checklist :

- [ ] Lancer `npm run typecheck`.
- [ ] Lancer `npm run lint`.
- [ ] Lancer `npm run test:run`.
- [ ] Lancer `npm run build`.
- [ ] Lancer `npm run seo:sitemap`.
- [ ] Lancer `npm run prerender`.
- [ ] Lancer `npm run build:seo`.
- [ ] Vérifier responsive desktop/mobile.
- [ ] Vérifier no-regression FR.
- [ ] Vérifier sitemap et prerender EN.
- [ ] Vérifier que les URLs EN apparaissent dans le sitemap uniquement après activation explicite de l'indexation EN.
- [ ] Vérifier JSON-LD sans doublon.
- [ ] Préparer les notes de release.

Critères d'acceptation :

- [ ] Toutes les validations passent ou les écarts sont documentés.
- [ ] Les routes FR et EN du MVP sont prêtes à publier.
- [ ] Aucun changement hors périmètre n'a été introduit.

### Lot post-MVP

- [ ] Simulateurs.
- [ ] Actualités evergreen.
- [ ] Mentions légales.
- [ ] Emails automatiques.
- [ ] Pages locales.
- [ ] Néerlandais si les données le justifient.

## 15. Risques

- [ ] Divergence entre `SEO` SPA et `scripts/prerender.ts`, car les deux reconstruisent le head.
- [ ] Oubli d'une route EN dans `SEO_ROUTES`, le sitemap ou le prerender.
- [ ] `hreflang` non réciproques entre FR et EN.
- [ ] Sitemap livré avec URLs EN mais sans alternatives `hreflang` réciproques.
- [ ] `html lang` correct en SPA mais absent ou incorrect en prerender.
- [ ] Textes globaux encore en français dans header, footer, cookies, formulaires ou erreurs.
- [ ] Erreurs backend affichées telles quelles en français sur une page EN.
- [ ] Formulaires EN envoyant une langue non persistée côté Edge Function.
- [ ] `preferredLanguage` envoyé par le front mais absent de `payload_json` ou de la notification interne.
- [ ] Home EN pointant vers des articles Actualités FR non traduits.
- [ ] Traductions trop marketing ou trop libres.
- [ ] Ajout de contenu juridique/fiscal non présent dans la version française.
- [ ] Sitemap incluant une route `noindex` par erreur.
- [ ] Language switcher envoyant vers `/en/` sur une route sans équivalent au lieu de masquer ou désactiver l'option EN.
- [ ] Régression du menu mobile avec le language switcher.
- [ ] Tests existants trop orientés routes FR et à adapter proprement.

## 16. Questions tranchées

- [x] Routes sans équivalent anglais : masquer ou désactiver l'option EN dans le language switcher.
- [x] Fallback vers `/en/` : interdit par défaut, autorisé seulement pour un cas précis explicitement documenté.
- [x] Home EN : ne pas afficher les derniers articles Actualités FR pendant le MVP.
- [x] Home EN : remplacer le bloc Actualités par des liens de service EN tant qu'aucun article evergreen anglais n'est publié.
- [x] Erreurs visibles utilisateur : toutes les erreurs affichées sur page EN doivent être localisées.
- [x] Erreurs backend attendues : mapper côté front vers des messages localisés si possible.
- [x] Erreurs backend imprévues : afficher un message générique localisé.
- [x] Logs et notifications internes : peuvent rester techniques ou en français.
- [x] `preferredLanguage` MVP : stocker dans `payload_json` et l'afficher dans la notification email interne.
- [x] Colonne dédiée `preferredLanguage` : hors MVP, seulement si un besoin de filtrage, reporting, back-office ou automatisation apparaît.
- [x] Politique de confidentialité EN : traduction complète, sobre et fidèle de la version française, couvrant les formulaires EN.
- [x] Sitemap Lot 2 : inclure les routes EN indexables du MVP et les alternatives `hreflang` réciproques.
- [x] Report du `hreflang` sitemap : autorisé uniquement en cas de blocage technique documenté.

Points restant à décider après le MVP :

- [ ] Quels articles Actualités evergreen traduire en anglais.
- [ ] Opportunité d'une colonne dédiée `preferredLanguage` selon les besoins back-office réels.
- [ ] Opportunité d'une version néerlandaise selon les données de trafic et demandes clients.

## 17. Contraintes importantes

Ne pas faire pendant les lots MVP :

- [ ] Pas de redirection automatique navigateur.
- [ ] Pas de traduction automatique massive sans relecture bloc par bloc.
- [ ] Pas de modification des routes françaises existantes.
- [ ] Pas de changement du SEO français non nécessaire.
- [ ] Pas de SEO injecté dans `src/pages/*`.
- [ ] Pas de refonte design.
- [ ] Pas d'ajout de dépendance sans justification.
- [ ] Pas de suppression de routes françaises.
- [ ] Pas de traduction complète des simulateurs.
- [ ] Pas de traduction des Actualités.
- [ ] Pas de version néerlandaise.
- [ ] Pas de modification backend au-delà du besoin `preferredLanguage` des formulaires.

## 18. Prochaine action recommandée

Commencer par le Lot 0, puis implémenter le Lot 1 dans une session dédiée.

Prompt de reprise conseillé :

```txt
Implémente le Lot 1 de docs/i18n-roadmap-site-public.md. Ne traduis pas encore les pages. Crée uniquement le socle i18n technique, la table des routes localisées, les helpers de route testés, `getLocalizedPathFromPathname(pathname, targetLocale)` et `getAlternateLocaleLinks(pathname, baseUrl)`. Ne modifie pas AppRoutes, SEO, sitemap, prerender, Header, Footer, formulaires ni contenu de pages.
```

Avant le Lot 1 :

- [ ] Relire cette roadmap.
- [ ] Vérifier que `docs/etoilys-strategie-i18n-site-public.md` n'a pas changé.
- [ ] Vérifier l'état git.
- [ ] Confirmer que le MVP anglais reste limité aux 9 routes listées.

## 19. Fichiers inspectés pour préparer cette roadmap

- `CLAUDE.md`
- `tailwind.config.js`
- `package.json`
- `docs/etoilys-strategie-i18n-site-public.md`
- `docs/contexte-projet-etoilys.md`
- `docs/seo-structurant-workflow.md`
- `src/App.tsx`
- `src/AppRoutes.tsx`
- `src/components/layout/Layout.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/ui/SEO.tsx`
- `src/components/ui/StructuredData.tsx`
- `src/content/seoRoutes.ts`
- `scripts/generate-sitemap.ts`
- `scripts/prerender.ts`
- `src/components/forms/ContactForm.tsx`
- `src/components/forms/DemandeClassementForm.tsx`
- `src/utils/formValidation.ts`
- `src/utils/api.ts`
- `src/pages/Home.tsx`
- `src/pages/Classement.tsx`
- `src/pages/PourquoiClasser.tsx`
- `src/pages/Prerequis.tsx`
- `src/pages/Procedure.tsx`
- `src/pages/FAQ.tsx`
- `src/pages/Contact.tsx`
- `src/pages/DemandeClassement.tsx`
- `src/pages/Confidentialite.tsx`
- `src/test/seo-governance.test.ts`
- `src/test/routes.test.tsx`
- `src/test/forms-legal-links.test.tsx`
- `src/test/cwv-images.test.tsx`
- `supabase/functions/_shared/formSubmission.ts`
- `supabase/functions/public-forms-contact/index.ts`
- `supabase/functions/public-forms-classement/index.ts`
- `supabase/migrations/20260325190000_create_form_submissions.sql`
