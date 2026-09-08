# Framework de déclinaison des pages locales Etoilys

**Version :** 5.0 — 8 septembre 2026
**Projet :** site public Etoilys  
**Usage :** document autonome destiné à ChatGPT et Codex pour auditer, migrer ou créer les pages locales Etoilys, qu’il s’agisse d’une **page ville** ou d’une **page départementale**, selon un modèle CRO commun avec un delta local strictement limité aux informations réellement variables.

---

## 1. Finalité du framework V5

Etoilys publie deux niveaux de landing pages locales :

- des pages **départementales**, par exemple `/classement-meuble-tourisme-dordogne` ;
- des pages **villes / bassins locaux**, par exemple `/classement-meuble-tourisme-bergerac`.

Ces pages répondent à des recherches telles que :

- `classement meublé de tourisme Dordogne` ;
- `organisme classement meublé Dordogne` ;
- `classement meublé de tourisme Bergerac` ;
- `organisme classement meublé Bordeaux` ;
- `faire classer un gîte à Périgueux` ;
- `tarif classement location saisonnière Agen`.

Leur objectif principal est le même : **convertir un propriétaire en demande de classement**, sans supposer qu’il est déjà convaincu de l’intérêt du classement.

Les pages doivent donc servir trois niveaux de maturité :

1. le propriétaire déjà décidé, qui veut vérifier qu’Etoilys intervient chez lui, connaître le prix et agir immédiatement ;
2. le propriétaire intéressé mais hésitant, qui veut comprendre les bénéfices, le prix, le délai et la procédure ;
3. le propriétaire encore peu informé, qui doit comprendre rapidement pourquoi le classement peut présenter un intérêt concret pour son meublé.

Le parcours mental cible reste :

- **pourquoi classer** ;
- **Etoilys intervient-il réellement ici** ;
- **combien cela coûte** ;
- **comment cela se passe** ;
- **pourquoi choisir Etoilys** ;
- **quelle preuve locale concrète confirme la valeur du classement** ;
- **réponses aux dernières objections** ;
- **passage à l’action**.

### Source de vérité à partir de la V5

La V5 remplace la logique qui consistait à faire évoluer séparément un modèle ville et un modèle département.

À partir de la V5 :

- les pages villes et les pages départementales appartiennent au **même système de landing pages locales** ;
- la structure CRO, la hiérarchie visuelle et la copy générique doivent être partagées au maximum ;
- les différences entre ville et département doivent être gérées par configuration ou par quelques modules spécialisés ;
- Bergerac V4 reste la **référence fonctionnelle et visuelle de départ** pour le socle commun ;
- la page Dordogne est la **référence fonctionnelle du cas départemental** une fois migrée vers V5.

L’objectif est qu’une modification future d’un bloc commun — bénéfices, procédure, arguments Etoilys, CTA, hiérarchie, spacing — puisse être faite **une seule fois**.

---

## 2. Principe non négociable : un framework commun, deux scopes

Le framework V5 distingue seulement :

```text
scope = city | department
```

Une page locale ne doit pas recréer sa propre architecture.

Le modèle commun doit gérer autant que possible :

- hero ;
- bloc `Pourquoi classer votre meublé ?` ;
- structure générale de la couverture géographique ;
- affichage des tarifs ;
- procédure ;
- bloc `Pourquoi choisir Etoilys ?` ;
- emplacement de la preuve locale ;
- FAQ ;
- CTA final ;
- alternance des fonds ;
- responsive ;
- accessibilité ;
- conventions SEO techniques.

Les différences ville / département doivent être limitées aux données ou comportements qui changent réellement.

### Interdiction explicite

Ne pas créer durablement :

- un bloc bénéfices ville et un bloc bénéfices département ;
- une procédure ville et une procédure département ;
- un bloc Cofrac ville et un bloc Cofrac département ;
- un composant tarifaire ville et un autre composant tarifaire visuellement équivalent pour les départements ;
- deux systèmes de CTA ;
- deux copies génériques différentes uniquement pour donner l’impression que les pages sont uniques.

Le delta local doit venir des vraies différences de territoire, pas d’une réécriture décorative.

---

## 3. Rôle respectif des pages villes et départementales

Les deux types de pages ont le même objectif commercial mais pas exactement le même niveau de précision.

### 3.1 Page ville

La page ville est la landing la plus transactionnelle et la plus précise.

Elle connaît déjà :

- la ville ou le bassin ;
- la zone de proximité ;
- le tarif applicable ;
- les éventuelles règles locales ;
- les données locales de taxe de séjour ;
- éventuellement un contexte touristique ou réglementaire spécifique.

Elle peut donc afficher directement le tarif et une preuve locale très précise.

### 3.2 Page départementale

La page départementale doit :

- convertir directement lorsqu’un visiteur cherche un organisme dans le département ;
- confirmer la couverture territoriale ;
- permettre de trouver le **tarif exact selon la commune** ;
- servir de hub vers les pages villes lorsqu’elles existent ;
- conserver un contexte départemental utile sans devenir un annuaire ni une brochure touristique.

La page départementale ne doit pas devenir une simple page de redistribution vers les villes. Elle reste une landing page de conversion à part entière.

---

## 4. Structure CRO commune V5

Sauf exception locale réellement utile, l’ordre cible est :

```text
Hero
→ Pourquoi classer ?
→ Votre classement directement dans votre logement
→ Règle locale critique éventuelle
→ Tarifs
→ Votre classement en 3 étapes
→ Pourquoi Etoilys ?
→ Preuve locale
→ Règle locale informative éventuelle
→ FAQ
→ CTA final
```

L’objectif n’est pas d’allonger les pages, mais de mieux hiérarchiser l’information et d’éviter les répétitions.

### 4.1 Hero transactionnel — commun

Le hero doit permettre de comprendre en quelques secondes :

- qu’Etoilys réalise le classement officiel des meublés de tourisme ;
- que le service est disponible dans la zone visée ;
- quelle est l’action principale ;
- qu’il existe un chemin secondaire pour le propriétaire qui veut d’abord estimer son logement ;
- les principales modalités de rassurance confirmées pour la zone.

Le modèle commun conserve deux CTA :

- CTA principal vers la demande de classement ;
- CTA secondaire vers le simulateur de classement.

Les micro-preuves doivent rester courtes et factuelles, par exemple :

- demande rapide ;
- délai moyen d’intervention ;
- absence de frais de déplacement si cette modalité est vraie pour la zone.

Ne pas charger le hero avec :

- détail fiscal ;
- tableau tarifaire complet ;
- longue explication sur le classement ;
- contenu touristique décoratif.

#### Delta ville / département

Ville :

- H1 et intro localisés sur la ville / bassin.

Département :

- H1 et intro localisés sur le département ;
- ne pas ajouter une longue explication de la diversité des secteurs dès le hero.

La différence doit rester essentiellement éditoriale, pas structurelle.

### 4.2 Bloc commun `Pourquoi classer votre meublé ?`

Ce bloc apparaît immédiatement après le hero.

Intro publique commune :

> **Dans un marché de la location saisonnière de plus en plus concurrentiel, le classement ne se résume pas à ses avantages fiscaux : il permet aussi de mieux différencier votre logement et de renforcer son attractivité auprès des voyageurs.**

Le bloc contient exactement trois bénéfices principaux.

**Fiscalité micro-BIC**  
Au régime micro-BIC, un meublé classé bénéficie d’un plafond plus élevé et d’un abattement plus favorable qu’un meublé non classé.

**Taxe de séjour**  
Un meublé classé passe à un tarif fixe selon son nombre d’étoiles. Selon la commune, cela peut réduire sensiblement la taxe de séjour payée par vos voyageurs.

**Gagnez en visibilité auprès des voyageurs**  
Les étoiles offrent un repère officiel reconnu, rassurent au moment de réserver et aident votre annonce à se démarquer pour attirer davantage de voyageurs.

Sous les trois bénéfices, conserver un lien secondaire vers la page générale des avantages du classement.

Ne pas inclure les cotisations sociales dans ce bloc.

Ne pas garantir un résultat commercial non démontré.

#### Delta ville / département

**Aucun.**

Ce bloc doit être le même pour les pages villes et départementales.

### 4.3 Zone d’intervention — composant commun, données différentes

La fonction du bloc est toujours de répondre à :

> **Est-ce qu’un inspecteur Etoilys vient directement chez moi ?**

H2 de référence :

```text
Votre classement directement dans votre logement
```

#### Variante ville

Le bloc affiche :

- la ville ;
- le bassin couvert ;
- une sélection raisonnable de communes proches réellement desservies ;
- la modalité de déplacement si utile ;
- un lien vers le département parent.

Pattern :

> Nos inspecteurs interviennent à **[VILLE]** et dans **[BASSIN]**, **[modalité si confirmée]**, notamment à :

Éviter les longues listes de communes.

#### Variante département

Le bloc affiche :

- plusieurs **secteurs ou bassins commerciaux** du département ;
- pour chaque secteur, une sélection courte de communes représentatives visible par défaut ;
- lorsque la liste complète apporte une vraie valeur, un bouton de type `Voir plus de villes` / `Voir toutes les communes desservies` ;
- les liens vers les pages villes publiées lorsqu’elles existent.

La page départementale ne doit pas afficher d’emblée des dizaines de communes au point de casser le parcours de conversion.

### 4.4 Listes de communes repliables sur les pages départementales

Le compromis V5 est :

- **liste courte visible par défaut** ;
- **liste plus complète disponible dans la page derrière une interaction `Voir plus`** ;
- conserver les communes réellement utiles à la couverture géographique et au SEO local ;
- ne pas transformer la page en liste exhaustive de toutes les communes administratives du département.

Exemple :

```text
Bergeracois et Sud Dordogne
Bergerac · Monbazillac · Eymet · Lalinde · Issigeac
[Voir les autres communes desservies]
```

#### Règle SEO / rendu

Les communes repliées doivent être **présentes dans le HTML/DOM rendu**, y compris dans le prerender.

Le bouton doit uniquement contrôler leur visibilité.

Ne pas faire :

```text
clic Voir plus
→ appel API
→ chargement tardif des communes
```

Faire :

```text
communes déjà rendues
→ interaction uniquement visuelle
```

Cette approche permet de réduire la hauteur visuelle sans retirer l’information du document.

La présence d’une commune dans une liste reste un signal de couverture et peut aider sur de la longue traîne, mais elle ne remplace pas une vraie page ville lorsqu’une intention locale mérite sa propre landing page.

### 4.5 Tarifs — même affichage, deux modes d’entrée

Le bloc tarifaire reste placé **avant la procédure**.

Une fois que le visiteur a compris l’intérêt du classement et vérifié la couverture, il doit pouvoir connaître le coût sans friction inutile.

Le composant d’affichage doit être partagé entre ville et département.

Il doit pouvoir rendre, selon le profil tarifaire :

- tarif standard ;
- qualification TTC ou HT ;
- tarif partenaire / office de tourisme ;
- conditions du tarif partenaire ;
- tarifs dégressifs multi-logements ;
- frais de déplacement ;
- conditions importantes ;
- CTA vers la demande de classement.

#### Page ville : tarif direct

La page ville connaît déjà sa zone tarifaire.

Elle affiche donc directement le composant tarifaire complet.

Exemple conceptuel :

```text
LocalTariffsSection(pricingProfileBergerac)
```

#### Page départementale : résolution par commune

La page départementale affiche d’abord un sélecteur léger :

```text
Commune
[ Bergerac ]
```

Une fois la localisation résolue, elle affiche **exactement le même composant tarifaire** que la page ville correspondante.

Si `Bergerac` renvoie vers le même profil que la page Bergerac, le contenu rendu doit être identique :

- même tarif public ;
- même tarif OT ;
- même note / microcopy portée par le profil ;
- même dégressivité ;
- mêmes frais de déplacement si le profil en déclare ;
- mêmes conditions ;
- même CTA ;
- même présentation.

Il ne doit pas exister une version simplifiée du tarif sur la page départementale.

### 4.6 Procédure — strictement commune

H2 :

```text
Votre classement en 3 étapes
```

Ne pas ajouter de paragraphe introductif générique sous ce H2.

Trois étapes :

1. demande de classement ;
2. organisation de la visite ;
3. inspection et classement.

Conserver un lien secondaire vers `/procedure`.

#### Delta ville / département

**Aucun.**

### 4.7 Bloc commun `Pourquoi choisir Etoilys ?`

Ce bloc reste celui validé en V4.

Il contient exactement trois arguments principaux.

**Des outils pour mieux préparer la catégorie visée**  
Avant la visite, le simulateur Etoilys vous permet de vérifier les principaux critères de la catégorie visée et d’identifier les points à préparer. Vous abordez ainsi la visite avec une vision beaucoup plus claire du niveau attendu.

**100 % spécialisés dans le classement des meublés de tourisme**  
Etoilys se consacre exclusivement au classement des meublés de tourisme. Nos inspecteurs connaissent en profondeur la réglementation, la grille officielle et les points qui font réellement la différence pour atteindre la catégorie visée.

**Organisme accrédité Cofrac Inspection**  
Conserver la référence Cofrac et le lien vers la portée d’accréditation déjà utilisés dans le modèle V4.

Le bloc se termine par un CTA principal vers la demande de classement.

Ne pas réintroduire ici les micro-preuves déjà présentes dans le hero.

#### Delta ville / département

**Aucun.**

### 4.8 Preuve locale — vrai module différenciant

Le bloc local principal est placé après `Pourquoi choisir Etoilys ?` et avant la FAQ, éventuellement suivi d’un module réglementaire local.

Son rôle est de transformer les bénéfices génériques présentés plus haut en **preuve locale concrète**.

#### Variante ville

La ville peut utiliser :

- contexte touristique local ;
- densité ou concurrence de l’offre si pertinente ;
- taxe de séjour locale ;
- exemple classé / non classé ;
- règle locale utile ;
- source officielle.

Le modèle de Bergerac repose notamment sur la taxe de séjour comme preuve concrète.

Bordeaux peut conserver un contexte local et un module réglementaire spécifique si cela apporte une vraie valeur décisionnelle.

#### Variante département

Le département ne doit pas inventer un barème de taxe de séjour unique lorsqu’il existe plusieurs collectivités ou politiques locales.

Le module peut utiliser :

- quelques données départementales réellement utiles sur le marché des meublés de tourisme ;
- 2 ou 3 chiffres maximum si leur valeur commerciale est réelle ;
- un rappel que la taxe de séjour varie selon la commune ;
- un lien vers le simulateur de taxe de séjour ;
- toute donnée départementale fiable qui aide à comprendre l’intérêt du classement.

Éviter les longues statistiques touristiques ou les paragraphes généraux sur le département.

Le bloc départemental doit rester une preuve / mise en contexte, pas devenir une deuxième page d’information touristique.

### 4.9 Règle locale exceptionnelle éventuelle

Une règle locale ne doit être affichée que si elle influence réellement la décision ou les obligations du propriétaire.

Par défaut :

- une règle critique peut apparaître plus haut, après la zone d’intervention ;
- une règle informative reste dans la partie basse, avec le contexte local, avant la FAQ.

Les règles municipales sont beaucoup plus naturelles sur une page ville.

Sur une page départementale, ne pas présenter une règle communale comme si elle valait pour tout le département.

### 4.10 FAQ — composant commun, données locales

La FAQ doit traiter en priorité :

- prix ;
- délai ;
- zone couverte ;
- critères manquants ;
- plusieurs logements ;
- questions réellement propres à la zone.

Ville :

- réponses propres à la commune ou au bassin ;
- éventuelle réglementation locale.

Département :

- comment connaître le tarif dans sa commune ;
- couverture de plusieurs secteurs ;
- plusieurs logements dans des communes différentes ;
- liens vers les pages villes lorsque cela aide réellement.

Ne pas remplir la FAQ avec des variantes SEO de type `gîte`, `Airbnb`, `studio`, `appartement` si elles n’apportent aucune réponse nouvelle.

### 4.11 CTA final — commun

Même structure de CTA final pour les deux scopes.

Seuls les éléments localisés changent :

- `à Bergerac` ;
- `en Dordogne` ;
- éventuelle modalité locale réellement utile.

### 4.12 Hiérarchie visuelle

Alternance de référence :

| Section                      | Fond              |
| ---------------------------- | ----------------- |
| Pourquoi classer             | blanc             |
| Zone d’intervention          | `primary-100`     |
| Tarifs                       | blanc             |
| Votre classement en 3 étapes | `primary-100`     |
| Pourquoi Etoilys             | blanc             |
| Preuve locale                | `primary-100`     |
| FAQ                          | blanc             |
| CTA final                    | gradient existant |

Les grandes sections utilisent une grille principale cohérente, de référence `max-w-6xl`.

La FAQ peut rester plus étroite (`max-w-4xl`).

Conserver une règle verticale commune `py-section`.

Ne pas créer une hiérarchie visuelle différente entre ville et département sans raison fonctionnelle.

---

## 5. Architecture tarifaire V5

Le tarif devient une vraie donnée locale partagée plutôt qu’un texte hardcodé dans une page.

### 5.1 Source de vérité unique

Une page ville et un résultat de recherche depuis une page départementale doivent consommer **la même source de vérité tarifaire**.

Conceptuellement :

```text
PricingProfile
  → tarif public
  → tarif partenaire
  → multi-logements
  → frais de déplacement
  → conditions
```

Puis :

```text
Page Bergerac
  → pricingProfile Bergerac
  → LocalTariffsSection
```

et :

```text
Page Dordogne
  → picker
  → Bergerac
  → pricingProfile dordogne-standard
  → LocalTariffsSection
```

L’objectif est d’empêcher structurellement qu’un même secteur affiche un jour des informations différentes selon la page d’entrée.

### 5.2 Commune comme clé de résolution tarifaire

Décision V5 : le picker public des pages départementales sélectionne une commune du département courant.

Règle technique retenue :

```text
defaultPricingProfileId
+ overrides éventuels par id commune
→ PricingProfile
→ renderer tarifaire partagé
```

Le `defaultPricingProfileId` couvre la politique commerciale majoritaire du département. Les `overrides` permettent de faire évoluer une commune vers un profil spécifique sans refactorer le composant tarifaire ni le picker.

Exemple :

```text
Dordogne
  defaultPricingProfileId: dordogne-standard
  overrides: {}

puis demain :
  overrides:
    24322 → perigueux-profile
    24520 → secteur-bergeracois-profile
```

Le nom de commune sert à la recherche et à l’affichage ; l’identifiant de commune sert à l’override tarifaire.

Cette architecture reste volontairement légère et remplaçable.

### 5.3 Ne pas sur-ingénierer avant la future cartographie EPCI

Etoilys prévoit une future cartographie des EPCI et un mapping géographique plus riche.

La V5 ne doit donc pas construire maintenant :

- une base géographique nationale complète ;
- un nouveau référentiel complexe de communes ;
- un moteur de zones destiné à devenir obsolète immédiatement ;
- une nouvelle dépendance de géocodage sans besoin démontré.

La résolution tarifaire actuelle doit être simple, typée et facilement remplaçable par le futur mapping EPCI.

---

## 6. Picker commune pour les pages départementales

### 6.1 UX cible

Un seul champ :

```text
Commune
```

Le visiteur peut saisir :

- `Bergerac` ;
- une partie du nom de la commune.

Le picker propose des suggestions lisibles, par exemple :

```text
Bergerac
```

Après sélection :

- le champ reste visible ;
- le bloc tarifaire apparaît sous le picker ;
- l’utilisateur peut immédiatement modifier la commune ;
- il peut effectuer plusieurs recherches successives sans recharger la page.

Ne pas faire disparaître le picker après la première sélection.

### 6.2 Réutiliser la base du picker du simulateur taxe de séjour

À la date de la V5, `SimulateurTaxeSejour.tsx` contient déjà une mécanique d’autocomplete avancée :

- normalisation de recherche ;
- suggestions ;
- matching strict ;
- fuzzy matching ;
- navigation clavier ;
- sélection par `Enter` ;
- fermeture par `Escape` ;
- gestion du focus ;
- rôles ARIA de combobox.

Cette mécanique est actuellement intégrée dans la page du simulateur et dépend de son type `TaxeSejourCity`.

La V5 recommande donc :

- d’extraire **uniquement la mécanique générique utile** ;
- de créer un composant ou hook de recherche suffisamment générique pour être réutilisé ;
- de laisser le simulateur taxe continuer à fournir ses propres données ;
- de laisser la tarification locale fournir ses propres données ;
- de ne pas coupler le pricing à la source de données DELTA.

Conceptuellement :

```text
LocalityCombobox / generic search logic
        ↑
        ├── Simulateur taxe de séjour
        └── Tarification pages départementales
```

### 6.3 Le dataset taxe de séjour ne devient pas la source tarifaire

Le dataset du simulateur taxe de séjour contient des informations propres à la fiscalité locale et utilise notamment le code INSEE comme identifiant de commune.

Il ne doit pas devenir la source de vérité du pricing Etoilys.

Le partage doit porter sur **l’UX et la logique de recherche**, pas sur les données métier.

### 6.4 Index de communes du département courant

Le picker d’une page départementale charge uniquement un index léger des communes du département courant.

Format cible :

```text
{
  id,
  label,
  departmentCode
}
```

La source peut être dérivée du pipeline du simulateur de taxe de séjour, mais le fichier chargé par la landing ne doit pas être le dataset fiscal complet.

Pour une page Dordogne :

```text
dataset = communes Dordogne uniquement
résolution = defaultPricingProfileId + overrides éventuels par id commune
autre département = lien générique vers /zones-intervention
```

Le picker ne doit pas résoudre ni rediriger vers un autre département. Si le visiteur cherche une commune absente du dataset courant, la page peut proposer un lien discret vers `/zones-intervention`.

### 6.5 Registre départemental

Le registre central des zones d’intervention doit pouvoir associer un département à son code numérique, par exemple :

```text
Dordogne → 24
Gironde → 33
Lot-et-Garonne → 47
```

L’implémentation exacte doit rester cohérente avec l’architecture réelle du repo.

Ne pas dupliquer ce mapping dans plusieurs composants.

---

## 7. Données variables à fournir

ChatGPT doit produire uniquement les données réellement variables du scope ciblé.

### 7.1 Commun à ville et département

- scope `city` ou `department` ;
- nom public ;
- slug ;
- H1 ;
- meta title ;
- meta description ;
- canonical ;
- libellé de breadcrumb ;
- image de hero, alt, source et crédit ;
- modalités locales confirmées ;
- FAQ locale ;
- données de preuve locale ;
- date de vérification.

### 7.2 Variable ville

- bassin ;
- communes proches ;
- département parent ;
- pricing profile ;
- taxe de séjour locale ;
- exemple local classé / non classé ;
- éventuelle règle municipale ;
- lien retour vers le département parent.

### 7.3 Variable département

- code du département ;
- secteurs / bassins ;
- communes visibles par défaut ;
- communes additionnelles repliées ;
- liens vers les pages villes publiées ;
- default pricing profile et overrides éventuels par commune ;
- preuve locale départementale ;
- éventuelles questions de FAQ propres à la diversité territoriale.

---

## 8. Tarifs Etoilys : règles de gouvernance

Les tarifs sont des données métier sensibles.

Toujours confirmer :

- tarif standard ;
- TTC ou HT ;
- tarif partenaire ;
- conditions du tarif partenaire ;
- tarifs dégressifs ;
- conditions des visites groupées ;
- frais de déplacement ;
- délai moyen d’intervention ;
- délai maximal annoncé ;
- toute autre modalité affichée.

### 8.1 Pas de tarif par défaut hérité d’une autre zone

Ne jamais déduire qu’une zone a les mêmes tarifs qu’une autre simplement parce qu’elle est proche.

### 8.2 Réutilisation volontaire d’un pricing profile

Si Florian confirme que plusieurs communes partagent exactement la même politique tarifaire, elles peuvent pointer vers le même profil.

Cette réutilisation doit être une décision métier explicite, pas une approximation technique.

### 8.3 Affichage identique partout

Une fois le profil choisi, l’affichage doit être identique partout où il est utilisé.

Ne pas conserver une copy locale de prix dans la page ville et une autre dans la page départementale.

---

## 9. Preuve locale et taxe de séjour

### 9.1 Pages villes

La V4 reste la référence :

- préparer les sources officielles ;
- valider les données de taxe de séjour ;
- utiliser si pertinent le scénario standard de comparaison ;
- publier uniquement les montants confirmés ;
- utiliser le bloc comme preuve locale, pas comme deuxième cours général sur la taxe de séjour.

### 9.2 Pages départementales

Ne pas forcer un calcul local unique si le département contient plusieurs barèmes.

Préférer :

- quelques données départementales vérifiées ;
- un renvoi vers le simulateur de taxe de séjour ;
- une phrase claire indiquant que la taxe dépend de la commune ;
- éventuellement des exemples ciblés uniquement s’ils sont clairement présentés comme locaux et non comme départementaux.

---

## 10. Vérification préalable de l’opportunité de publier

### Nouvelle page ville

Vérifier :

- qu’Etoilys intervient réellement dans le secteur ;
- que le département parent existe sur le site ;
- que la ville apporte une intention locale distincte ;
- que les données locales sont suffisamment fiables ;
- que la page ne sera pas une simple substitution de nom ;
- que le bloc local différenciant apporte une vraie valeur ;
- que la zone couverte et les tarifs sont confirmables.

Ne pas recommander une nouvelle page ville si elle n’apporte aucun delta utile par rapport au département.

### Nouvelle page départementale

Vérifier :

- qu’Etoilys intervient réellement dans le département ;
- que la couverture est suffisamment structurée ;
- que les profils tarifaires peuvent être résolus ;
- que la page peut servir de landing à part entière ;
- que le maillage vers les pages villes est cohérent.

---

## 11. Modes de travail

L’exécution du framework doit annoncer un mode :

- `MIGRATION V5 D’UNE PAGE VILLE EXISTANTE` ;
- `MIGRATION V5 D’UNE PAGE DÉPARTEMENTALE EXISTANTE` ;
- `CRÉATION D’UNE NOUVELLE PAGE VILLE` ;
- `CRÉATION D’UNE NOUVELLE PAGE DÉPARTEMENTALE`.

Pour une migration, conserver par défaut les données locales déjà publiées si elles restent exactes.

Ne pas relancer une recherche inutile uniquement parce que le shell change.

---

## 12. Format obligatoire du livrable ChatGPT

### A. Verdict

- intérêt de la page ;
- rôle ville ou département ;
- intervention réelle ;
- risque de cannibalisation ;
- éventuel risque de page satellite.

### B. Dossier de données locales

Pour une ville :

| Champ                   | Valeur | Source | Date | Usage          |
| ----------------------- | ------ | ------ | ---- | -------------- |
| Ville                   |        |        |      | Public         |
| Bassin                  |        |        |      | Public         |
| Département             |        |        |      | Public         |
| EPCI                    |        |        |      | Interne        |
| Communes couvertes      |        |        |      | Public         |
| Tarif / pricing profile |        |        |      | Public         |
| Taxe de séjour          |        |        |      | Interne/public |
| Image                   |        |        |      | Public         |

Pour un département :

| Champ                                          | Valeur | Source | Date | Usage          |
| ---------------------------------------------- | ------ | ------ | ---- | -------------- |
| Département                                    |        |        |      | Public         |
| Code département                               |        |        |      | Technique      |
| Secteurs                                       |        |        |      | Public         |
| Communes visibles                              |        |        |      | Public         |
| Communes repliées                              |        |        |      | Public         |
| Pages villes enfants                           |        |        |      | Public         |
| Pricing profile par défaut / overrides commune |        |        |      | Interne/public |
| Preuve locale                                  |        |        |      | Public         |
| Image                                          |        |        |      | Public         |

### C. Données SEO locales

Fournir uniquement :

- slug ;
- H1 ;
- meta title ;
- meta description ;
- canonical ;
- breadcrumb ;
- relations parent / enfant utiles au maillage.

### D. Paquet de contenu variable

Ne fournir que :

- hero local ;
- couverture ;
- données tarifaires / résolution commune ;
- preuve locale ;
- règles locales éventuelles ;
- FAQ ;
- CTA uniquement si adaptation locale nécessaire.

Ne pas recopier les blocs communs V5.

### E. Questions métier restantes

Une seule série consolidée, uniquement si nécessaire.

### F. Prompt final Codex

Le prompt doit contenir :

- mode de travail ;
- données variables exactes ;
- SEO et maillage ;
- pricing ;
- règles du picker si département ;
- sources ;
- instructions d’industrialisation ;
- validations techniques.

---

## 13. Instructions obligatoires pour Codex

### 13.1 Inspecter l’implémentation réelle

Avant toute modification :

1. lire le présent framework V5 ;
2. inspecter les composants locaux existants ;
3. inspecter la page Bergerac V4 ;
4. inspecter la page départementale cible ;
5. inspecter le registre local central ;
6. inspecter la source de données des villes ;
7. inspecter le bloc tarifaire actuel ;
8. inspecter le picker du simulateur taxe de séjour ;
9. inspecter SEO, sitemap, prerender et breadcrumbs ;
10. décider du refactor minimal permettant de converger vers un seul système local.

### 13.2 Réutiliser le modèle commun

Codex doit :

- centraliser la copy commune ;
- mutualiser les composants lorsqu’ils rendent la même information ;
- ne configurer que le delta réel ;
- conserver les pages non ciblées visuellement stables pendant une migration progressive ;
- éviter une abstraction disproportionnée ;
- ne pas créer un CMS ;
- ne pas imposer de nouveaux fichiers si l’architecture réelle fournit déjà une solution plus simple.

### 13.3 Extraire le bloc tarifaire

À la date de la V5, le bloc tarifaire de `CityLandingPage` contient encore des valeurs partagées directement dans le composant.

Le chantier V5 doit viser :

```text
PricingProfile
→ shared LocalTariffsSection
```

Le même rendu doit pouvoir être appelé :

- directement par une page ville ;
- après résolution du picker sur une page départementale.

### 13.4 Extraire seulement la base utile du picker taxe de séjour

Le simulateur possède déjà une bonne logique de combobox.

Codex doit réutiliser cette logique lorsque cela réduit réellement la duplication, mais ne doit pas :

- brancher le pricing sur les données DELTA ;
- déplacer tout le simulateur dans un composant générique ;
- refondre le simulateur au-delà de ce qui est nécessaire ;
- construire un moteur géographique national dans ce ticket.

### 13.5 Autres départements depuis le picker

Le picker d’une page départementale reste scoped au dataset du département courant.

Ne pas implémenter de résolution ou de redirection inter-départementale depuis ce picker.

Pour les visiteurs dont le meublé se situe ailleurs, ajouter un lien générique vers `/zones-intervention`.

### 13.6 SEO et maillage

Ville :

```text
Accueil > Zones d’intervention > Département > Ville
```

Département :

```text
Accueil > Zones d’intervention > Département
```

Codex doit :

- utiliser le SEO centralisé ;
- conserver canonical auto-référente ;
- maintenir sitemap et prerender ;
- maintenir les relations département / pages villes ;
- ajouter les liens vers les pages villes dans les secteurs correspondants ;
- ne pas créer de version EN/NL dans ce chantier ;
- ne pas créer de faux `LocalBusiness` ;
- ne pas inventer d’agence ou d’adresse locale.

### 13.7 Liste repliable des communes

Sur une page départementale :

- les communes additionnelles doivent exister dans le rendu prerenderé ;
- le bouton ne doit que changer leur état d’affichage ;
- l’accessibilité du bouton doit être correcte (`aria-expanded` ou équivalent) ;
- ne pas charger les communes après clic via réseau ;
- les pages villes publiées peuvent être liées directement depuis cette liste / ces secteurs.

---

## 14. Contrôles éditoriaux

### Commun

- Le hero permet-il de comprendre le service et d’agir immédiatement ?
- `Pourquoi classer` reste-t-il strictement commun ?
- Le tarif arrive-t-il avant la procédure ?
- La procédure reste-t-elle en 3 étapes ?
- `Pourquoi Etoilys` reste-t-il commun ?
- La preuve locale apporte-t-elle vraiment une information locale ?
- La FAQ traite-t-elle les objections plutôt que des variantes lexicales SEO ?
- Le CTA final reste-t-il simple ?

### Page ville

- Le tarif est-il affiché directement ?
- Le pricing profile est-il confirmé ?
- La taxe de séjour / règle locale est-elle correctement limitée à son territoire ?
- Le lien vers le département parent est-il présent ?

### Page départementale

- Les secteurs sont-ils lisibles ?
- Le nombre de communes visible par défaut reste-t-il raisonnable ?
- Les listes complètes utiles restent-elles accessibles via `Voir plus` ?
- Les communes repliées sont-elles réellement rendues ?
- Le picker permet-il plusieurs recherches successives ?
- Un résultat tarifaire utilise-t-il exactement le même composant qu’une page ville ?
- Les communes absentes du dataset courant ne déclenchent-elles aucune résolution tarifaire ?
- Le contexte départemental reste-t-il compact ?

---

## 15. Contrôles techniques

Adapter les commandes aux scripts réels du repo. À défaut :

```bash
npm run typecheck
npm run lint
npm run test:run
npm run seo:sitemap
npm run build
npm run prerender
```

Vérifier notamment :

- H1 unique ;
- canonical ;
- métadonnées ;
- sitemap ;
- prerender ;
- breadcrumbs ;
- maillage ;
- aucune version EN/NL ajoutée par erreur ;
- aucun faux `LocalBusiness` ;
- aucune modification involontaire de la home, du header ou du footer ;
- modules facultatifs absents lorsqu’ils sont vides ;
- absence de duplication durable de la copy commune ;
- absence de duplication du bloc tarifaire ;
- picker clavier / souris / tactile ;
- `aria-autocomplete`, `aria-expanded`, sélection clavier et fermeture correcte ;
- changement successif de commune sans reload ;
- dataset du picker limité au département courant ;
- absence de résolution ou redirection inter-départementale depuis le picker ;
- listes de communes repliées présentes dans le prerender ;
- `aria-expanded` du bouton `Voir plus` ;
- aucun chargement réseau nécessaire au dépliage ;
- responsive 390, 768, 1024 et 1440 px ;
- absence de débordement horizontal ;
- alternance des fonds cohérente ;
- image optimisée et créditée.

---

## 16. Différences autorisées entre ville et département

| Élément                   | Ville                         | Département                             |
| ------------------------- | ----------------------------- | --------------------------------------- |
| Hero                      | ville + bassin                | département                             |
| Pourquoi classer          | commun                        | commun                                  |
| Couverture                | communes proches              | secteurs + communes + pages villes      |
| Liste longue              | généralement inutile          | repliable si utile                      |
| Prix                      | affichage direct              | picker commune puis affichage identique |
| Procédure                 | commune                       | commune                                 |
| Pourquoi Etoilys          | commun                        | commun                                  |
| Preuve locale             | taxe / contexte / règle ville | contexte départemental compact          |
| Règle locale              | facultative                   | généralement absente ou très ciblée     |
| FAQ                       | delta ville                   | delta département                       |
| CTA final                 | commun                        | commun                                  |
| UI / spacing / responsive | commun                        | commun                                  |

Toute différence supplémentaire doit être justifiée par un besoin utilisateur ou métier réel.

---

## 17. Résultat attendu

Le système V5 doit permettre :

- de faire évoluer ville et département ensemble ;
- d’ajouter une nouvelle localité principalement par configuration ;
- d’afficher une politique tarifaire depuis une source unique ;
- de retrouver exactement le même tarif depuis une page ville ou depuis le picker départemental ;
- de conserver les communes utiles au SEO sans rendre la page départementale interminable ;
- d’orienter simplement un utilisateur vers `/zones-intervention` lorsque sa commune n’est pas proposée sur la page départementale courante ;
- de réutiliser l’UX existante du picker taxe de séjour sans mélanger les données métier ;
- de préparer la future cartographie EPCI sans construire aujourd’hui une architecture qui devra être jetée ;
- de conserver les preuves locales réellement utiles ;
- d’éviter les divergences entre pages locales au fil du temps.

La valeur CRO commune vient du même squelette :

```text
Hero
→ Pourquoi classer ?
→ Couverture
→ Tarifs
→ Procédure
→ Pourquoi Etoilys ?
→ Preuve locale
→ FAQ
→ CTA final
```

La valeur SEO locale vient des vraies données du territoire :

- zone couverte ;
- communes ;
- pages enfants / parent ;
- contexte local ;
- données de taxe ou marché lorsqu’elles sont pertinentes ;
- FAQ ;
- métadonnées ;
- image ;
- maillage.

Elle ne doit pas venir d’une réécriture artificielle des blocs communs.

---

## 18. Règle finale de référence

> **V5 = un seul système de landing pages locales. La ville et le département partagent le maximum de structure, de copy et de composants. Ils ne divergent que lorsque la réalité géographique, tarifaire ou réglementaire l’impose réellement.**
