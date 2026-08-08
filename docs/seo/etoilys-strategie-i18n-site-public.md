# Stratégie i18n du site public Etoilys

Date de référence : 24 juin 2026  
Projet : site public Etoilys  
Document destiné à être placé dans le repo, idéalement dans `docs/seo/etoilys-strategie-i18n-site-public.md`.

---

## 1. Objectif du chantier

Etoilys souhaite traduire progressivement son site public afin de mieux servir les propriétaires étrangers qui possèdent ou exploitent un meublé de tourisme en France et souhaitent comprendre le classement officiel.

L'objectif n'est pas d'ajouter un simple bouton de traduction automatique. Le chantier doit être traité comme un vrai projet d'internationalisation : architecture, SEO, routes, contenus, formulaires, sources officielles, ton éditorial et maintenance.

Le site doit rester :

- clair pour un propriétaire non spécialiste ;
- fidèle au positionnement Etoilys ;
- juridiquement et fiscalement prudent ;
- cohérent avec l'architecture technique existante ;
- propre pour Google et les moteurs de recherche ;
- maintenable page par page, sans créer une usine à gaz.

---

## 2. Décisions actées

### 2.1 Langues

Décision :

- phase 1 : anglais uniquement ;
- phase 2 éventuelle : néerlandais, à décider plus tard selon les données réelles.

Le néerlandais ne doit pas être implémenté immédiatement. Il faut néanmoins éviter de coder une architecture limitée à l'anglais seul. L'architecture doit permettre d'ajouter `nl` proprement plus tard.

### 2.2 Langue par défaut

Décision :

- le français reste la langue principale ;
- `/` reste la version française ;
- les versions traduites utilisent un préfixe de langue.

Exemple :

```txt
/                  -> français
/en                -> anglais
/en/contact        -> page contact anglaise
```

Pas de redirection automatique de `/` vers `/en` selon la langue supposée du navigateur. L'utilisateur doit pouvoir choisir sa langue avec un vrai lien visible.

### 2.3 Qualité des URLs

Décision : option propre, toujours.

Les slugs des pages anglaises doivent être traduits lorsque la page est destinée à l'indexation SEO.

Exemples recommandés :

```txt
/classement
/en/furnished-tourist-accommodation-classification

/les-avantages-du-classement
/en/benefits-of-furnished-tourist-accommodation-classification

/procedure
/en/classification-process

/demande-classement
/en/request-a-classification
```

Éviter les URLs du type `/en/classement` pour les pages stratégiques. C'est techniquement plus simple, mais moins propre pour l'utilisateur et moins cohérent avec l'objectif SEO.

### 2.4 Pages à traduire en priorité

Phase 1 : traduire les pages de conversion et de compréhension.

Pages prioritaires :

- Accueil ;
- Classement ;
- Les avantages du classement ;
- Prérequis au classement ;
- Procédure ;
- FAQ ;
- Contact ;
- Demande de classement.

Les formulaires doivent être traduits dès la phase 1. Un utilisateur qui lit le site en anglais ne doit pas arriver sur un formulaire en français.

### 2.5 Actualités / blog

Décision : ne pas traduire toute la rubrique Actualités au départ.

Approche recommandée :

- ne pas traduire les actualités chaudes dans la phase 1 ;
- traduire plus tard seulement les articles evergreen ou stratégiques ;
- privilégier les articles utiles à un propriétaire étranger : classement, fiscalité, taxe de séjour, procédure, obligations générales ;
- éviter les traductions indexées d'articles juridiques très sensibles sans contrôle attentif.

### 2.6 Simulateurs

Les simulateurs ne sont pas prioritaires en phase 1, sauf leurs liens, cartes d'entrée et éventuellement pages d'introduction.

La traduction complète des simulateurs doit être traitée dans une phase dédiée, car elle implique :

- les libellés ;
- les tooltips ;
- les résultats ;
- les messages d'erreur ;
- les textes fiscaux ou réglementaires ;
- les unités, montants et formats ;
- les avertissements utiles.

### 2.7 Formulaires et langue préférée

Décision : les formulaires doivent être traduits.

Quand une demande est envoyée depuis une page anglaise, le front doit idéalement transmettre une information de langue, par exemple :

```ts
preferredLanguage: 'en';
```

Cette information permettra ensuite de savoir que le propriétaire a interagi avec la version anglaise du site. Il n'est pas obligatoire d'automatiser immédiatement tous les emails clients en anglais, mais il faut conserver l'information pour le back-office et les échanges futurs.

### 2.8 Mentions légales et confidentialité

Décision :

- la politique de confidentialité doit être traduite si les formulaires le sont ;
- les mentions légales peuvent être traduites dans une phase suivante ;
- une version anglaise sobre et fidèle est suffisante au départ.

### 2.9 Sources officielles

Décision :

- conserver les liens vers les sources officielles françaises ;
- ne pas inventer de sources anglaises si elles n'existent pas ;
- signaler sobrement que les sources officielles sont en français lorsque c'est pertinent.

Formulation possible, sobre :

```txt
Official French sources are listed at the end of this page.
```

Pas besoin d'ajouter dix lignes de disclaimer. Le site doit rester lisible.

### 2.10 Fiscalité et droit

Décision : rester prudent, mais sans transformer chaque page en consultation fiscale.

Les pages anglaises doivent rappeler de manière courte que les règles expliquées concernent le cadre français et peuvent dépendre de la situation du propriétaire, du logement, de la commune et du régime fiscal choisi.

Exemple de formulation courte :

```txt
These rules apply to furnished tourist accommodation in France and may vary depending on the property, the municipality and the owner's tax situation.
```

À utiliser uniquement lorsque le sujet le justifie. Ne pas multiplier les disclaimers génériques.

### 2.11 Méthode de traduction

Décision : traduction page par page et bloc par bloc, uniquement par IA.

Règles de traduction :

- traduction fidèle à l'original ;
- garder le même ton ;
- coller au maximum au texte français ;
- adapter uniquement lorsque la traduction littérale serait maladroite ou incompréhensible ;
- ne pas enrichir avec des informations non présentes dans la version française ;
- ne pas transformer la copy en texte marketing américain ;
- ne pas simplifier au point de perdre la nuance juridique ou fiscale ;
- ne pas ajouter de longues précautions inutiles.

---

## 3. Principes SEO multilingues

Le chantier doit respecter les bonnes pratiques Google pour les sites multilingues.

### 3.1 URLs distinctes par langue

Chaque version linguistique doit disposer de sa propre URL.

À faire :

```txt
/les-avantages-du-classement
/en/benefits-of-furnished-tourist-accommodation-classification
```

À éviter :

```txt
/les-avantages-du-classement?lang=en
```

À éviter aussi : changer uniquement le contenu selon un cookie ou la langue du navigateur sans URL distincte.

Référence Google :  
https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites

### 3.2 Pas de redirection automatique obligatoire

Ne pas forcer une redirection automatique vers `/en` selon la langue supposée de l'utilisateur.

Il faut plutôt :

- afficher un sélecteur de langue visible ;
- permettre à Google et aux utilisateurs d'accéder à toutes les versions ;
- conserver `/` comme version française.

Référence Google :  
https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites

### 3.3 Hreflang

Chaque page traduite doit déclarer ses équivalents linguistiques via `hreflang`.

Exemple :

```html
<link rel="alternate" hreflang="fr" href="https://www.etoilys.fr/procedure" />
<link rel="alternate" hreflang="en" href="https://www.etoilys.fr/en/classification-process" />
<link rel="alternate" hreflang="x-default" href="https://www.etoilys.fr/procedure" />
```

Règle importante : les déclarations doivent être réciproques. La page française doit pointer vers l'anglaise et l'anglaise doit pointer vers la française.

Référence Google :  
https://developers.google.com/search/docs/specialty/international/localized-versions

### 3.4 Canonical

Chaque page traduite doit avoir une canonical vers elle-même.

Exemple :

```html
<link rel="canonical" href="https://www.etoilys.fr/en/classification-process" />
```

Ne pas mettre la canonical de la page anglaise vers la page française. Les versions traduites ne sont pas des duplicats à canonicaliser vers le français : ce sont des versions linguistiques distinctes.

Référence Google :  
https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

### 3.5 Sitemap

Le sitemap doit intégrer les routes localisées.

Option recommandée : enrichir le sitemap avec les variantes `hreflang`, en listant chaque URL et ses alternatives.

Référence Google :  
https://developers.google.com/search/docs/specialty/international/localized-versions

### 3.6 Langue HTML

Le document doit exposer la bonne langue HTML :

```html
<html lang="fr">
  <html lang="en"></html>
</html>
```

Le site actuel utilise un SEO centralisé. L'implémentation doit donc passer par les mécanismes existants du layout et du SEO centralisé, pas par des injections page par page.

### 3.7 Cohérence de langue dans la page

Une page anglaise doit avoir :

- navigation anglaise ;
- contenu anglais ;
- CTA anglais ;
- formulaires anglais ;
- messages d'erreur anglais ;
- footer anglais ;
- métadonnées anglaises.

Ne pas mélanger français et anglais sur la même page, sauf pour les termes officiels français qui doivent être conservés ou expliqués.

---

## 4. Principes éditoriaux de traduction

### 4.1 Ton à conserver

Les traductions doivent conserver le ton Etoilys :

- clair ;
- simple ;
- professionnel ;
- pédagogique ;
- orienté propriétaire ;
- sérieux sans être lourd ;
- direct sans être agressif.

Le texte anglais ne doit pas devenir plus enthousiaste, plus commercial ou plus vague que le texte français.

### 4.2 Fidélité au texte français

Le texte français reste la source de vérité.

La traduction doit :

- suivre la structure du bloc original ;
- conserver les idées dans le même ordre ;
- conserver les nuances ;
- conserver les dates, montants, seuils, conditions et exceptions ;
- conserver les liens internes équivalents ;
- conserver les sources officielles.

### 4.3 Adaptation minimale quand nécessaire

Il est autorisé d'adapter une tournure lorsque la traduction littérale serait étrange.

Exemple :

```txt
Faire classer son meublé
```

Traduction possible :

```txt
Have your furnished tourist accommodation officially classified
```

Ce n'est pas mot à mot, mais c'est fidèle au sens.

### 4.4 Termes français à conserver ou expliquer

Certains termes doivent rester visibles, car ils désignent des réalités administratives françaises.

Exemples :

| Terme français                     | Traduction / formulation recommandée                       |
| ---------------------------------- | ---------------------------------------------------------- |
| meublé de tourisme                 | furnished tourist accommodation (`meublé de tourisme`)     |
| classement                         | official classification / star rating classification       |
| classement des meublés de tourisme | official classification of furnished tourist accommodation |
| taxe de séjour                     | tourist tax (`taxe de séjour`)                             |
| micro-BIC                          | micro-BIC tax regime                                       |
| régime réel                        | actual expenses tax regime / régime réel                   |
| Atout France                       | Atout France                                               |
| Cofrac                             | Cofrac                                                     |
| organisme accrédité                | accredited inspection body                                 |
| certificat de visite               | inspection certificate                                     |
| décision de classement             | classification decision                                    |
| déclaration en mairie              | declaration to the local town hall                         |
| changement d'usage                 | change of use authorisation                                |
| résidence principale               | main residence                                             |
| résidence secondaire               | second home                                                |

La première occurrence peut expliquer le terme. Ensuite, utiliser la traduction retenue de manière cohérente.

### 4.5 Disclaimers sobres

Ne pas ajouter de longs avertissements partout.

Utiliser seulement des formulations courtes lorsque le sujet est sensible.

Exemple sobre :

```txt
This page explains the French classification process for furnished tourist accommodation.
```

Exemple à éviter :

```txt
This page is not legal, tax, accounting, financial, regulatory or administrative advice and should not be relied upon under any circumstances without consulting a qualified professional...
```

Oui, on a compris. Pas besoin d'écrire les CGU d'une banque suisse.

---

## 5. Architecture technique recommandée

### 5.1 Langues supportées

Créer une configuration centrale des langues.

Exemple :

```ts
export const SUPPORTED_LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'fr';
```

Prévoir la possibilité d'ajouter plus tard :

```ts
'nl';
```

Ne pas hardcoder partout `fr` et `en` directement dans les composants.

### 5.2 Routes localisées

Créer une source de vérité des routes localisées.

Exemple conceptuel :

```ts
export const localizedRoutes = {
  home: {
    fr: '/',
    en: '/en',
  },
  classement: {
    fr: '/classement',
    en: '/en/furnished-tourist-accommodation-classification',
  },
  avantages: {
    fr: '/les-avantages-du-classement',
    en: '/en/benefits-of-furnished-tourist-accommodation-classification',
  },
  prerequis: {
    fr: '/prerequis-au-classement',
    en: '/en/classification-requirements',
  },
  procedure: {
    fr: '/procedure',
    en: '/en/classification-process',
  },
  faq: {
    fr: '/faq',
    en: '/en/faq',
  },
  contact: {
    fr: '/contact',
    en: '/en/contact',
  },
  demandeClassement: {
    fr: '/demande-classement',
    en: '/en/request-a-classification',
  },
};
```

Cette table doit servir :

- au routing ;
- aux liens internes ;
- au language switcher ;
- au SEO ;
- au sitemap ;
- aux tests.

### 5.3 Interface courte : fichiers de traduction

Pour les textes courts d'interface, utiliser des fichiers de traduction.

Exemple :

```txt
src/locales/fr/common.json
src/locales/en/common.json
src/locales/fr/forms.json
src/locales/en/forms.json
src/locales/fr/navigation.json
src/locales/en/navigation.json
```

Contenus concernés :

- navigation ;
- CTA ;
- labels de formulaires ;
- placeholders ;
- messages d'erreur ;
- textes de footer ;
- cookies ;
- libellés courts réutilisés.

### 5.4 Contenus éditoriaux longs : fichiers dédiés par page

Pour les pages longues, éviter de tout mettre dans des JSON de traduction.

Approche recommandée : contenus structurés par page et par langue.

Exemple :

```txt
src/content/pages/home.fr.ts
src/content/pages/home.en.ts
src/content/pages/classement.fr.ts
src/content/pages/classement.en.ts
```

ou :

```txt
src/content/pages/home.ts
```

avec :

```ts
export const homeContent = {
  fr: { ... },
  en: { ... },
};
```

Le choix exact doit être proposé par Codex après inspection du repo. L'objectif est de garder les pages maintenables et lisibles.

### 5.5 SEO centralisé

Le site possède déjà une logique SEO centralisée. Toute évolution i18n doit la respecter.

À faire :

- enrichir `src/content/seoRoutes.ts` pour gérer les routes localisées ;
- ajouter les métadonnées anglaises ;
- ajouter canonical, hreflang et éventuellement `x-default` ;
- adapter les structured data quand la page traduite est indexable ;
- adapter le sitemap ;
- adapter le prerender.

À ne pas faire :

- injecter des balises SEO directement dans chaque page ;
- dupliquer toute la logique SEO dans les composants de page ;
- traiter `/en/*` comme des pages secondaires sans canonical propre.

### 5.6 Language switcher

Ajouter un sélecteur de langue simple dans le header, utilisable desktop et mobile.

Règles :

- afficher `FR` et `EN`, ou `Français` / `English` selon l'espace disponible ;
- le switcher doit renvoyer vers l'équivalent de la page courante quand il existe ;
- si une page n'a pas encore de version anglaise, renvoyer vers `/en` ou masquer l'option selon le choix retenu ;
- ne pas changer la langue uniquement en mémoire ou via cookie ;
- utiliser de vrais liens.

### 5.7 Détection de langue

La langue active doit être déduite de l'URL.

Exemples :

```txt
/procedure -> fr
/en/classification-process -> en
```

Ne pas dépendre uniquement du navigateur ou d'un cookie.

### 5.8 Formulaires

Les formulaires traduits doivent inclure :

- labels traduits ;
- placeholders traduits ;
- messages de validation traduits ;
- messages de succès / erreur traduits ;
- consentement RGPD traduit ;
- `preferredLanguage` dans le payload si possible.

### 5.9 Tests attendus

Ajouter ou adapter des tests pour vérifier :

- les routes françaises existantes fonctionnent toujours ;
- les routes anglaises existent ;
- le header affiche le bon libellé selon la langue ;
- les liens du switcher pointent vers la bonne page équivalente ;
- les pages anglaises ont une canonical propre ;
- les pages traduites ont les bons hreflang ;
- le formulaire de demande en anglais transmet la langue préférée si cette donnée est implémentée ;
- le build, le typecheck, le lint et les tests existants restent verts.

---

## 6. MVP recommandé

### 6.1 Périmètre du MVP anglais

Implémenter uniquement :

- architecture i18n ;
- routes anglaises propres ;
- SEO multilingue ;
- language switcher ;
- traduction de la navigation ;
- traduction du footer ;
- traduction des pages prioritaires ;
- traduction des formulaires Contact et Demande de classement ;
- stockage ou transmission de `preferredLanguage` si possible ;
- sitemap/prerender compatibles.

Pages du MVP :

| Page française                 | Page anglaise recommandée                                        |
| ------------------------------ | ---------------------------------------------------------------- |
| `/`                            | `/en`                                                            |
| `/classement`                  | `/en/furnished-tourist-accommodation-classification`             |
| `/les-avantages-du-classement` | `/en/benefits-of-furnished-tourist-accommodation-classification` |
| `/prerequis-au-classement`     | `/en/classification-requirements`                                |
| `/procedure`                   | `/en/classification-process`                                     |
| `/faq`                         | `/en/faq`                                                        |
| `/contact`                     | `/en/contact`                                                    |
| `/demande-classement`          | `/en/request-a-classification`                                   |

### 6.2 Hors périmètre MVP

À ne pas faire au premier lot :

- traduire tous les articles Actualités ;
- traduire intégralement les simulateurs ;
- créer une version néerlandaise ;
- créer une page de choix de langue complexe ;
- modifier le design global ;
- réécrire la copy française ;
- changer le positionnement éditorial ;
- ajouter des informations juridiques ou fiscales non présentes dans la version française.

---

## 7. Questions ouvertes pour plus tard

À trancher après le MVP :

1. Faut-il ajouter le néerlandais ?
   - Décision à prendre selon Search Console, PostHog, retours clients et données commerciales.

2. Quels articles Actualités traduire ?
   - Priorité aux articles evergreen.
   - Éviter les articles trop datés ou trop locaux.

3. Faut-il traduire les simulateurs ?
   - Oui probablement, mais dans un lot dédié.
   - Prioriser le simulateur fiscal si les propriétaires étrangers posent surtout des questions fiscales.

4. Faut-il traduire les emails automatiques ?
   - Pas obligatoire dès le MVP.
   - Utile si les demandes anglaises deviennent significatives.

5. Faut-il une version néerlandaise complète ou seulement des pages de conversion ?
   - À décider selon le trafic et la demande réelle.

---

## 8. Règles à donner à Codex avant toute implémentation

Avant d'écrire du code, Codex doit inspecter le repo et produire un plan.

Fichiers ou zones à inspecter en priorité :

- `src/AppRoutes.tsx` ;
- `src/components/layout/Header.tsx` ;
- `src/components/layout/Layout.tsx` ;
- `src/components/layout/Footer.tsx` ;
- `src/components/ui` ;
- `src/content/seoRoutes.ts` ;
- `src/content/actualitesArticles.ts` ;
- `src/content/articleStructuredData.ts` ;
- les scripts de sitemap et prerender ;
- les formulaires `Contact` et `DemandeClassement` ;
- les utilitaires de validation de formulaire ;
- les tests existants.

Codex doit ensuite proposer :

1. la structure i18n ;
2. la stratégie de routes ;
3. la stratégie SEO : canonical, hreflang, sitemap, structured data ;
4. la stratégie de contenu : fichiers par page ou objets localisés ;
5. la stratégie de traduction des formulaires ;
6. la stratégie pour `preferredLanguage` ;
7. le plan de migration page par page ;
8. les tests à ajouter ;
9. les risques identifiés.

Codex ne doit pas implémenter directement sans plan préalable, sauf demande explicite.

---

## 9. Contraintes de non-régression

Le chantier ne doit pas casser :

- les routes françaises existantes ;
- le SEO français ;
- les canonical existantes ;
- le sitemap existant ;
- le prerender ;
- les formulaires ;
- le consentement analytics/cookies ;
- les performances ;
- le design global ;
- les composants réutilisables ;
- les scripts de build.

Commandes à exécuter après implémentation :

```bash
npm run typecheck
npm run lint
npm run test:run
npm run build
npm run build:seo
npm run seo:sitemap
npm run prerender
```

---

## 10. Résumé opérationnel

La stratégie retenue est la suivante :

- français par défaut ;
- anglais en premier ;
- néerlandais plus tard seulement si les données le justifient ;
- URLs anglaises propres avec slugs traduits ;
- pas de redirection automatique ;
- vrai SEO multilingue : canonical propre, hreflang, sitemap ;
- formulaires traduits dès le départ ;
- langue préférée transmise ou stockée lorsque possible ;
- traduction page par page, bloc par bloc, fidèle à la version française ;
- pas de réécriture marketing ;
- pas de disclaimers interminables ;
- articles Actualités et simulateurs hors MVP, sauf décision contraire ;
- architecture extensible pour ajouter `nl` plus tard.

---

## 11. Sources utiles

### Documentation projet Etoilys

- `contexte-projet-etoilys.md`
- `Etoilys_guide_redaction_articles_actualites_v3.md`
- `Structure du site.pdf`

### Documentation Google Search Central

- Managing multi-regional and multilingual sites  
  https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites

- Localized versions of your pages / hreflang  
  https://developers.google.com/search/docs/specialty/international/localized-versions

- Canonicalization  
  https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
