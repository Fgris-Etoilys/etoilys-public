# Framework local V6

ETOILYS-414 termine la migration des pages locales publiques vers V6 sans créer de V7 ni moteur de sections arbitraires. La V6 consomme les primitives 395 documentées dans `docs/tech/design-system.md`; les wrappers `CityLandingPage`, `DestinationLandingPage` et `DepartmentLandingPage` restent des délégations fines vers `LocalLandingPageV6`.

## Composition

`LocalLandingPageV6` est la seule composition locale partagée. Les wrappers existants `CityLandingPage`, `DestinationLandingPage` et `DepartmentLandingPage` y délèguent directement.

Ordre V6 :

1. hero transactionnel `PageHero` + `EditorialHeroMedia` + `ClassificationHeroNote` + `HeroReassurance` ;
2. `ProofStrip` ;
3. bénéfices communs via trois `FeatureCard` ;
4. zone d’intervention ;
5. tarifs ;
6. procédure courte avec `Timeline layout="horizontal"` ;
7. expertise Etoilys ;
8. module territorial obligatoire pour un département, module fiscal facultatif pour une ville/destination ;
9. notice éditoriale locale facultative ;
10. FAQ compacte ;
11. CTA final `PageCta density="compact"`.

## Données variables

Les types V6 sont des unions discriminées dans `src/content/local/types.ts` :

- `scope: 'department'` impose une zone par secteurs, un pricing `mode: 'picker'` et un `localModule: LocalV6TerritorialModule` obligatoire. Son omission empêche la compilation ; la base commune ne porte pas cette obligation.
- `scope: 'city'` impose une zone par communes proches et un pricing `mode: 'direct'`. Le module local et la notice éditoriale restent facultatifs, par exemple pour une comparaison de taxe de séjour ou une notice réglementaire quand elle apporte un vrai contexte local.
- `scope: 'destination'` impose un parent département, une zone par liste de communes et un pricing `mode: 'direct'`. Le module local et la notice éditoriale restent facultatifs comme pour une ville.
- La description hero département commune vit dans `LOCAL_V6_DEPARTMENT_HERO_DESCRIPTION` (`src/content/local/sharedLocalContent.tsx`).
- Les index hero département vivent dans `LOCAL_V6_DEPARTMENT_HERO_INDEXES`. Ils sont territoriaux, pas photographiques.
- En `city`, le H2 de zone doit rester court, naturel et explicitement territorial. Privilégier quand c’est pertinent une formulation du type `Où intervenons-nous autour de [ville] ?`. Ne pas chercher à bourrer ce H2 de mots-clés : le H1, l’intro, les communes et le maillage portent déjà le contexte SEO local. La formulation peut varier lorsque la géographie réelle ne correspond pas à un simple périmètre autour de la ville.
- Les contenus riches de FAQ sont des `ReactNode` pour préserver les liens internes, les ancres et les liens externes avec leurs attributs. Les villes et destinations peuvent réutiliser le socle générique riche actuellement contenu dans `src/content/local/cities/sharedCityFaq.ts` ; les départements assemblent une question de couverture territoriale avec `DEPARTMENT_LOCAL_V6_FAQ_ITEMS` via `buildDepartmentFaqItems` dans `src/content/local/sharedLocalContent.tsx`.
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

## Zone d’intervention et module territorial (P1.1)

La zone d’intervention et le module territorial ont deux rôles distincts.

### Zone d’intervention

La section zone d’intervention porte le maillage interne département -> pages filles. Les enfants locaux (`city` ou `destination`) sont dérivés automatiquement du registry via `getPublishedLocalChildEntriesForDepartment`, uniquement quand l’enfant et son parent sont effectivement publiés, et dans l’ordre `displayOrder`. Les liens internes restent suivis, rendus au pré-rendu, et les communes des secteurs restent du texte simple sans `communeLinks`.

Le sous-bloc de navigation utilise le libellé localisé `serviceArea.localPagesLabel` fourni par chaque département, par exemple `Nos pages locales en Gironde`. Ce libellé n’est pas un H2, reste un petit intitulé de navigation et n’est rendu que lorsqu’au moins une page fille publiée existe. Sans enfant publié, aucun bloc vide n’est affiché.

### Module territorial

Une page locale publiée doit apporter une valeur territoriale propre, mais la structure d’affichage reste commune. **Tous les départements V6 doivent renseigner** `localModule` avec `type: 'territorial-service'`, y compris les futurs départements ; les villes et destinations conservent leur variante `tax-comparison` facultative.

Le module territorial apporte de l’information locale autonome : ressources administratives ou institutionnelles vérifiables, sources consultables et démarches réellement propres au territoire. Il ne doit pas dupliquer mécaniquement le maillage interne déjà rendu dans la zone d’intervention. Le type `{ label, localEntryId }` reste disponible pour un futur cas réellement utile, mais un lien interne ne doit être utilisé que s’il apporte autre chose que la simple répétition d’une page fille déjà listée plus haut.

Le contrat `LocalV6TerritorialModule` porte un `title` (H2), une `intro` de une à deux phrases et `items`, un tuple de **deux ou trois** informations. Chaque item contient `title` (H3), `body` (texte court) et un `link` facultatif : `{ label, localEntryId }` pour une ville/destination du registre, ou `{ label, href, nofollow? }` pour une ressource HTTPS. Aucun JSX ni choix de mise en page dans ces données. Le renderer reçoit le `departmentId` courant : un lien local n’est rendu que si l’entrée existe, est une ville/destination effectivement publiée et vérifie `entry.parentId === departmentId`. Un enfant brouillon, orphelin, rattaché à un parent brouillon ou à un autre département ne produit aucun lien ; le texte de l’item reste présent.

`LocalV6TerritorialModuleSection`, dans la composition V6, réutilise les surfaces, titres, liens et espacements éditoriaux. Les informations sont des lignes séparées, empilées sur mobile, sans cartes ni interaction. Le bloc reste après l’expertise et avant la notice éventuelle, la FAQ et le CTA final ; tout son contenu est présent au pré-rendu.

Une bonne information aide le propriétaire à agir : retrouver sa collectivité de taxe de séjour, comprendre un suivi départemental des attestations, actualiser une fiche touristique ou consulter une ressource institutionnelle locale. Vérifier la source actuelle avant publication, ne pas inventer de contenu pour obtenir un lien externe, et ne pas confondre le suivi départemental avec la réalisation de la visite Etoilys.

Si le texte s’appuie directement sur une ressource institutionnelle précise, le lecteur doit pouvoir la consulter. Une source concurrente peut rester visible en `nofollow` lorsqu’elle est réellement utile ; ne pas cacher systématiquement les sources en commentaire. Un OT/ADT peut fournir une ressource neutre : examiner la page de destination, pas seulement le nom de l’organisme. Aucun couple obligatoire `source`/`cta` n’est ajouté au modèle.

Sont exclus : statistiques de fréquentation, paysages, listes de mots-clés, promesses de présence ou partenariat non vérifiées, paraphrases interchangeables des bénéfices nationaux et CTA commerciaux supplémentaires. Deux informations solides suffisent. Pour ajouter un département, renseigner ce module dans sa config sans modifier le renderer.

Exemple de valeur `localModule` (les autres champs de la page restent inchangés) :

```ts
localModule: {
  type: 'territorial-service',
  title: 'Après le classement de votre meublé dans le Lot',
  intro: 'Dans le Lot, le suivi des attestations et la mise à jour des fiches touristiques sont deux démarches distinctes après le classement.',
  items: [
    {
      title: 'Le suivi départemental des attestations',
      body: 'Lot Tourisme suit et enregistre les attestations après les visites des différents organismes, y compris privés accrédités. Ce suivi est distinct de la visite Etoilys.',
      link: {
        label: 'Consulter la source de Lot Tourisme',
        href: 'https://www.tourisme-lot.com/app/uploads/lot-tourisme/2025/12/251105-Plan-actions-2026-CA.pdf',
      },
    },
    {
      title: 'Actualiser votre fiche touristique',
      body: 'L’Extranet VIT permet de mettre à jour votre offre toute l’année ; votre office de tourisme peut vous accompagner.',
    },
  ],
}
```

Les liens externes du module s’ouvrent dans un nouvel onglet avec `target="_blank"`. Un lien follow normal rend `rel="noopener noreferrer"`. Un lien avec `nofollow: true` rend `rel="nofollow noopener noreferrer"`. Aucun `rel` libre n’est accepté en config. Les liens internes vers les pages Etoilys restent dans l’onglet courant, suivis, et ne reçoivent pas `noopener`, `noreferrer` ou `nofollow`.

## Pricing

Les montants et conditions restent dans `src/content/local/pricing.ts`. Le département résout le profil via le picker de communes existant ; la ville et la destination affichent directement leur profil. Les profils tarifaires sont discriminés par `kind` : `flat` conserve le tarif public unique historique avec éventuel partenaire et multi-logements, tandis que `tiered` affiche plusieurs lignes par typologie et une offre conditionnelle facultative. Les IDs métier (`aveyron-standard`, `dordogne-standard`, `gironde-standard`, `lot-standard`, `lot-et-garonne-standard`, `bordeaux-standard`) restent indépendants même si leurs valeurs partagent une base interne.

## Consommateurs

V6 active :

- Dordogne : `DORDOGNE_LOCAL_LANDING_PAGE_V6` dans `src/content/local/departments/dordognePage.tsx`.
- Bergerac : `BERGERAC_LOCAL_LANDING_PAGE_V6` dans `src/content/local/cities/bergeracPage.tsx`.
- Gironde : `GIRONDE_LOCAL_LANDING_PAGE_V6` dans `src/content/local/departments/girondePage.tsx`.
- Bordeaux : `BORDEAUX_LOCAL_LANDING_PAGE_V6` dans `src/content/local/cities/bordeauxPage.tsx`.
- Bassin d’Arcachon : `BASSIN_ARCACHON_LOCAL_LANDING_PAGE_V6` dans `src/content/local/destinations/bassinArcachonPage.tsx`.
- Cahors et Vallée du Lot : `CAHORS_VALLEE_LOT_LOCAL_LANDING_PAGE_V6` dans `src/content/local/destinations/cahorsValleeLotPage.tsx`.
- Vallée de la Dordogne : `VALLEE_DORDOGNE_LOCAL_LANDING_PAGE_V6` dans `src/content/local/destinations/valleeDordognePage.tsx`.
- Figeac et Grand-Figeac : `FIGEAC_GRAND_FIGEAC_LOCAL_LANDING_PAGE_V6` dans `src/content/local/destinations/figeacGrandFigeacPage.tsx`.
- Lacanau et Médoc Atlantique : `MEDOC_ATLANTIQUE_LOCAL_LANDING_PAGE_V6` dans `src/content/local/destinations/medocAtlantiquePage.tsx`.
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
- Sources hero : les images rendues dans `EditorialHeroMedia` / `PageHero` doivent partir d'une source proche du cadre réel du composant, pas d'un panorama large recadré seulement par `object-cover`. Pour la Home et les pages locales V6, viser une source hero autour de `1.1` à `1.25`, ne pas dépasser le seuil automatique de `1.3` et fournir au minimum `1600x1200` px pour les sources non legacy. Si l'image originale est plus large, créer une source dérivée recadrée dédiée au hero dans `src/assets/seo-images/source/`, garder la même asset key et le même `outputName`, puis régénérer le pipeline normal. Les heroes Home et pages locales V6 ne doivent pas afficher de crédit photo visible ; la provenance/licence reste documentée dans la table de traçabilité. Les rares sources historiques au-dessus du seuil ou sous les dimensions minimales doivent être listées explicitement dans l'allowlist legacy de `scripts/images-build.mjs`, avec validation visuelle préalable, et retraitées si un problème de netteté est constaté.
- Tarifs : city, destination et department affichent le même bloc explicatif avec les trois garanties Etoilys et le lien procédure ; seule la partie droite diffère (`mode: 'direct'` ou `mode: 'picker'`).
- Pricing `direct` : pas de divider de résultat ni de note tarifaire dupliquée dans le panneau ville.
- Pricing `picker` : le divider et la note tarifaire sont conservés après sélection, car ils séparent le formulaire du résultat.
- Module local : `territorial-service` obligatoire pour un département, `tax-comparison` facultatif pour une ville/destination. Ne pas imposer de surtitre générique `CONTEXTE LOCAL`. Garder un rythme titre -> texte cohérent avec les autres introductions de section ; sur desktop, la partie éditoriale reste plus large que la preuve ou carte chiffrée. `highlightedTitleText`, réservé à la variante fiscale, correspond actuellement à un suffixe du titre mis en cuivre. Après l’expertise, les départements utilisent `surface-sage -> paper -> neutral` sans notice, ou `surface-sage -> paper -> neutral -> paper` avec notice. Les villes/destinations gardent le module fiscal sur `bg-surface-neutral`.
- Notice locale : utiliser `localNotice` pour une notice réglementaire ou éditoriale placée après le module local et avant la FAQ. Garder le motif `editorial-notice`; ne pas ajouter de moteur de sections. Pour une ville/destination avec module fiscal, la notice reste sur `bg-paper` et la FAQ suivante passe sur `bg-surface-neutral`. Pour un département avec module territorial, la notice passe sur `bg-surface-neutral` et la FAQ suivante sur `bg-paper`.
- Index communes : générer les index départementaux depuis `scripts/build-taxe-sejour-dataset.ts` et la source INSEE/taxe de séjour. La liste des index à produire vient du registre. Ne pas maintenir manuellement `public/data/communes-*-index.v1.json`.
- Images : une page locale ne réutilise pas par défaut le même asset pour le hero et l’expertise. `image.caption` et `expertise.image.caption` sont obligatoires dans la config V6 locale. La caption décrit le lieu photographié ; l’index département reste le repère territorial (`24 / LE PÉRIGORD`, `33 / LA GIRONDE`, `47 / LOT-ET-GARONNE`). La provenance/licence d’un asset externe doit toujours être documentée dans la table de traçabilité. Le champ `credit` est réservé aux images hors hero lorsqu’une attribution visible est requise ; ne pas ajouter de crédit visible sur `hero.image`. Le hero est aussi l’image OG de la page (`seo.ogImageKey`) : son alt est déclaré une seule fois dans `src/content/imageAltText.ts`, puis référencé par la config (`hero.image.alt: IMAGE_ALT_TEXT.<clé>.fr`), qui l’expose à la fois dans la page et dans `og:image:alt`. Les alts des images d’expertise restent dans la config V6. La trace éditoriale peut vivre dans `src/content/local/departments/*Page.tsx`, `src/content/local/cities/*Page.tsx` ou `src/content/local/destinations/*Page.tsx`. Les libellés actifs sont Saint-Émilion + Arcachon pour la Gironde, place de la Bourse pour le hero Bordeaux, Nérac + Monflanquin pour le Lot-et-Garonne.
- CTA final : reprendre le motif et la copy du département parent au lieu d’inventer une nouvelle formulation pour chaque ville, mais conserver le `Button.variant` analytics historique d’une page existante.
- FAQ : toutes les pages V6 incluent le socle FAQ commun ajouté automatiquement par `LocalLandingPageV6`. Les départements utilisent en plus le socle métier commun neutre `DEPARTMENT_LOCAL_V6_FAQ_ITEMS` avec une première question de couverture territoriale et, si utile, une question locale avant les deux FAQ automatiques. Ne pas fabriquer le socle commun avec un `slice` d’une FAQ territoriale. Les villes utilisent le socle riche `sharedCityFaq.ts`; ne pas réécrire des liens en markdown ni déclencher une réponse riche par comparaison de texte de question.
- Maillage département : les communes des secteurs sont du texte simple, visibles ou repliées. Toutes les pages enfants publiées (villes et destinations) sont regroupées dans une seule navigation sous les secteurs, avec la même présentation `local-v6-commune-list`. Le registre fournit les liens, leurs libellés (`departmentLabel`, puis `hubLabel`, puis `name`) et leur ordre `displayOrder` ; aucune association manuelle commune/page ni déduplication à maintenir. Sans enfant publié, aucune navigation vide. Appliquer cette règle à tous les départements.
- Une migration V6 ne doit jamais appauvrir un motif validé simplement parce qu’un nouveau scope utilise moins de données.
- Les anciennes données tourisme/statistiques inventoriées pendant une migration peuvent rester dans les fichiers de contenu source si elles gardent une utilité éditoriale future, mais elles ne sont pas réexportées ni rendues en V6 sans motif V6 validé.
- Recette corrective ETOILYS-415 du 18 septembre 2026 : build preview vérifié en 390, 768, 1024 et 1440 px sur le hub, Bergerac, Dordogne et Lot ; Bordeaux vérifié pour le breadcrumb court et le lien Gironde ; une page générale et un article vérifiés sans breadcrumb UI supplémentaire.

## Traçabilité Images Locales

La source technique reste `scripts/images-build.mjs` pour l’asset local et le fichier de config territoire (`src/content/local/departments/*Page.tsx`, `src/content/local/cities/*Page.tsx` ou `src/content/local/destinations/*Page.tsx`) pour les crédits affichés hors hero. Cette table ne duplique pas le manifeste généré ; elle donne seulement la trace éditoriale, y compris pour les heroes sans crédit visible.

| Page                    | Usage     | Asset key                    | Fichier source                                                  | Lieu/caption                                        | Trace                                                                                                              |
| ----------------------- | --------- | ---------------------------- | --------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Dordogne                | Hero      | `dordogneLaRoqueGageac`      | source pipeline images                                          | La Roque-Gageac, Dordogne                           | Asset propriétaire/local déjà validé.                                                                              |
| Dordogne                | Expertise | `dordogneLandscape`          | source pipeline images                                          | Les pierres du Périgord                             | Asset propriétaire/local déjà validé.                                                                              |
| Bergerac                | Hero      | `bergeracHero`               | `bergerac-view-late-afternoon-hero-crop.jpg`                    | Quai Cyrano, Bergerac                               | Wikimedia Commons, Benjamin Smith, CC BY-SA 4.0 ; source dérivée recadrée depuis l'original.                       |
| Bergerac                | Expertise | `bergeracSaintJacquesCyrano` | source pipeline images                                          | Église Saint-Jacques, Bergerac                      | Wikimedia Commons, JGS25, CC BY-SA 4.0.                                                                            |
| Gironde                 | Hero      | `girondeHero`                | `axel-delansorne-fSpupJ0C95E-hero-crop.jpg`                     | Saint-Émilion, Gironde                              | Unsplash, Axel Delansorne ; source dérivée recadrée depuis l'original.                                             |
| Gironde                 | Expertise | `girondeTerritory`           | source pipeline images                                          | Front de mer d’Arcachon                             | Unsplash, Árpád Czapp.                                                                                             |
| Bordeaux                | Hero      | `bordeauxHero`               | source pipeline images                                          | Place de la Bourse, Bordeaux                        | Pexels, Miguel Cuenca.                                                                                             |
| Bordeaux                | Expertise | `bordeauxExpertise`          | source pipeline images                                          | Jardin Public, Bordeaux                             | Wikimedia Commons, Marc Ryckaert (MJJR), CC BY 3.0.                                                                |
| Bassin d’Arcachon       | Hero      | `bassinArcachonHero`         | `bassin-arcachon-cabanes-tchanquees-hero-crop.jpg`              | Cabanes tchanquées, île aux Oiseaux                 | Wikimedia Commons, Grand Parc - Bordeaux, France, CC BY 2.0 ; source dérivée recadrée depuis l'original.           |
| Bassin d’Arcachon       | Expertise | `bassinArcachonDunePilat`    | `bassin-arcachon-dune-pilat.jpg`                                | Entrée du bassin d’Arcachon depuis la dune du Pilat | Wikimedia Commons, Franck-fnba, CC BY-SA 4.0.                                                                      |
| Médoc Atlantique        | Hero      | `medocAtlantiqueHero`        | `medoc-atlantique-etang-lacanau.jpg`                            | Étang de Lacanau                                    | Wikimedia Commons, Paternel 1, CC BY-SA 4.0.                                                                       |
| Médoc Atlantique        | Expertise | `medocAtlantiqueExpertise`   | `medoc-atlantique-carcans-plage.jpg`                            | Océan Atlantique depuis la dune à Carcans-Plage     | Wikimedia Commons, Michel VENOT, CC BY-SA 3.0.                                                                     |
| Lot-et-Garonne          | Hero      | `lotEtGaronneHero`           | `AdobeStock_1364523535.jpeg`                                    | Nérac, Lot-et-Garonne                               | Adobe Stock ID 1364523535 ; fiche publique exacte non confirmée.                                                   |
| Lot-et-Garonne          | Expertise | `lotEtGaronneTerritory`      | source pipeline images                                          | Monflanquin, Lot-et-Garonne                         | Pexels, D Goth.                                                                                                    |
| Lot                     | Hero      | `lotHero`                    | `pexels-tyvalloire-35860040.jpg`                                | Saint-Cirq-Lapopie, Lot                             | Pexels ; fiche publique exacte non retrouvée, lieu vérifié visuellement.                                           |
| Lot                     | Expertise | `lotRocamadour`              | `rocamadour-2025-114909.jpg`                                    | Rocamadour, Lot                                     | Wikimedia Commons, Franck-fnba, CC BY-SA 4.0.                                                                      |
| Cahors et Vallée du Lot | Hero      | `cahorsValleeLotHero`        | `cahors-vue-pano-hero-crop-velvet-wikimedia.jpg`                | Cahors depuis le Mont Saint-Cyr                     | Wikimedia Commons, Velvet, CC BY-SA 4.0 ; source dérivée recadrée depuis l’original.                               |
| Cahors et Vallée du Lot | Expertise | `cahorsValleeLotDouelle`     | `riviere-lot-douelle-arbref-wikimedia.jpg`                      | Rivière Lot à Douelle, près de Cahors               | Wikimedia Commons, Arbref, CC BY-SA 4.0.                                                                           |
| Figeac et Grand-Figeac  | Hero      | `figeacGrandFigeacHero`      | `figeac-place-ecritures-hero-crop-go69-wikimedia.jpg`           | Place des Écritures, Figeac                         | Wikimedia Commons, GO69, CC BY-SA 4.0 ; source dérivée recadrée depuis `Figeac (46) Place des Écritures - 02.jpg`. |
| Figeac et Grand-Figeac  | Expertise | `figeacGrandFigeacCajarc`    | `lot-river-cajarc-krzysztof-golik-wikimedia.jpg`                | Le Lot à Cajarc, dans le bassin de Figeac           | Wikimedia Commons, Krzysztof Golik, CC BY-SA 4.0.                                                                  |
| Vallée de la Dordogne   | Hero      | `valleeDordogneHero`         | `vallee-dordogne-river-hero-crop-krzysztof-golik-wikimedia.jpg` | Dordogne entre Lacave et Pinsac                     | Wikimedia Commons, Krzysztof Golik, CC BY-SA 4.0 ; source dérivée recadrée depuis `Dordogne_River_01.jpg`.         |
| Vallée de la Dordogne   | Expertise | `valleeDordogneBelcastel`    | `vallee-dordogne-belcastel-sonja-van-acolyen-unsplash.jpg`      | Belcastel, Lacave, Vallée de la Dordogne            | Unsplash, Sonja Van Acolyen, licence Unsplash.                                                                     |
| Aveyron                 | Hero      | `aveyronHero`                | `belcastel-4-kallerna-wikimedia.jpg`                            | Belcastel, Aveyron                                  | Wikimedia Commons, Kallerna, CC BY-SA 4.0.                                                                         |
| Aveyron                 | Expertise | `aveyronTerritory`           | `joran-quinten-wYzuwwLKmGM-unsplash.jpg`                        | Conques-en-Rouergue, Aveyron                        | Unsplash, Joran Quinten, licence Unsplash.                                                                         |

Checklist nouvelle page locale :

À renseigner manuellement :

1. Ajouter l'ID dans `DepartmentAreaId`, `CityAreaId` ou `DestinationAreaId` (`src/content/local/types.ts`) et, seulement si nécessaire, la région dans `RegionId` + `DEPARTMENT_REGIONS`.
2. Créer une config V6 typée dans `src/content/local/departments/*Page.tsx`, `src/content/local/cities/*Page.tsx` ou `src/content/local/destinations/*Page.tsx`; `v6Pages.tsx` ne sert qu’au réexport compat. Pour un département, fournir obligatoirement un module territorial de deux ou trois items sourcés.
3. Brancher une route explicite dans `src/AppRoutes.tsx` via `DepartmentLandingPage`, `CityLandingPage` ou `DestinationLandingPage`.
4. Ajouter l’entrée `src/content/local/registry.ts` avec `kind`, `id`, `path`, `departmentCode` opaque, région, parent éventuel, statut, ordre, hub, SEO, images LCP/OG et `coverageMode` pour un département. Le `hubDescription` doit rester éditorial et spécifique au territoire : pas de template de couverture opérationnelle, généralement deux phrases courtes, une identité géographique/touristique puis un angle séjour/gîte/meublé si pertinent.
5. Pour un département, ajouter l’index territorial dans `LOCAL_V6_DEPARTMENT_HERO_INDEXES`, le `PricingProfileId` métier dans `pricing.ts`, puis l’index communes registry si le picker doit être alimenté.
6. Déclarer les images locales dans `scripts/images-build.mjs`, utiliser une source hero dédiée sous le ratio `1.3` et d'au moins `1600x1200`, lancer `npm run images:build`, puis vérifier `npm run images:check`.
7. Renseigner des captions média non vides et distinguer caption photographique / index territorial.
8. Pour une ville, réutiliser `sharedCityFaq.ts` pour le socle FAQ riche, puis ajouter uniquement les questions vraiment locales.
9. Préserver les `variant` CTA analytics historiques quand une page est migrée.
10. Couvrir par tests le rendu V6, le pricing, les liens FAQ, les CTA analytics, l’ordre FAQ, la publication registry, les breadcrumbs et les données structurées locales dérivées du registre.

Dérivé automatiquement depuis le registre :

- Hub `/zones-intervention`, régions masquées si vides, cartes départementales et liens enfants locaux publiés.
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
  localModule: territorialModule, // Obligatoire : territorial-service avec deux ou trois items.
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
