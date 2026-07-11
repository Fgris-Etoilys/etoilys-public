# Données structurées Etoilys

Document de référence du lot 4 GEO/AEO. Les JSON-LD du site sont générés depuis
`src/content/structuredData.ts`, puis utilisés par `src/components/ui/StructuredData.tsx` et
`scripts/prerender.ts`.

## Entités canoniques

| Entité                  | `@id`                                                         |
| ----------------------- | ------------------------------------------------------------- |
| Organisation            | `https://www.etoilys.fr/#organization`                        |
| Site web                | `https://www.etoilys.fr/#website`                             |
| Service de classement   | `https://www.etoilys.fr/#service-classement-meubles-tourisme` |
| Accréditation Cofrac    | `https://www.etoilys.fr/#cofrac-accreditation-3-2394`         |
| Auteur Florian Grisorio | `https://www.etoilys.fr/#person-florian-grisorio`             |

Le graphe complet n’est pas répété sur toutes les routes :

- accueil français et anglais : `Organization`, `WebSite`, `Service`, `Certification` ;
- `/classement` et son équivalent anglais : `Organization` compacte, `Service`, `Certification` ;
- pages de service ou de contact : `Organization` compacte et `Service` ;
- articles : `BlogPosting`, `Person` compacte et `Organization` compacte ;
- breadcrumbs : script séparé généré depuis `seoRoutes.ts`.

## Identité et profils

`Organization.identifier` contient uniquement les identifiants propres à l’entreprise :

- SIREN `939330809` ;
- SIRET `93933080900012`.

Le numéro Cofrac `3-2394` identifie l’accréditation, pas l’organisation. Il est donc porté par
l’entité `Certification`.

Les profils `sameAs` retenus sont :

- fiche Google Maps officielle ;
- page LinkedIn officielle ;
- fiche Annuaire des entreprises.

Les URLs Google Search avec paramètre `kgmid` sont exclues, car elles ne constituent pas une page de
profil stable.

Le SIRET est aussi exposé avec `iso6523Code: "0009:93933080900012"`. Le numéro de TVA
`FR43939330809` est visible dans les mentions légales, mais il n’est pas repris dans le JSON-LD tant
qu’une preuve officielle ou comptable n’a pas été fournie pour le confirmer.

## Accréditation et service

L’accréditation Cofrac est modélisée par `hasCertification` et une entité `Certification` dédiée :

- `certificationIdentification: "3-2394"` ;
- statut actif Schema.org ;
- validité du `2026-03-01` au `2030-02-28` ;
- URL de l’attestation Cofrac ;
- lien `about` vers l’organisation Etoilys ;
- `issuedBy` représentant le Cofrac.

Aucun objet `DigitalDocument` séparé n’est créé pour la même attestation afin d’éviter deux
représentations concurrentes.

Le service canonique reste unique et général :

`Dordogne, Gironde, Lot-et-Garonne et secteurs proches de Bergerac`

Aucune entité `Offer` n’est publiée tant que les tarifs ne sont pas affichés de façon stable sur le
site.

## Validation

Contrôles automatisés :

- `npm run test:run` ;
- `npm run typecheck` ;
- `npm run build:seo`.

Contrôles externes à effectuer après build ou déploiement :

- valider le graphe complet dans Schema.org Validator ;
- valider l’accueil et quelques articles dans Google Rich Results Test ;
- vérifier qu’aucun avertissement critique n’est introduit.

`Certification` et `hasCertification` servent principalement à enrichir sémantiquement le graphe. Ils
ne garantissent pas l’apparition d’un résultat enrichi Google dédié.
