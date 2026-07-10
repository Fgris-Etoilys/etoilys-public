# Roadmap GEO / AEO — Site public Etoilys

Date de référence : 10 juillet 2026  
Projet : site public Etoilys  
Document de suivi destiné à être utilisé avec Codex et intégré dans le repo sous `docs/geo-aeo/roadmap-geo-aeo-site-public-etoilys.md`.

---

## 1. Objectif du chantier

Améliorer la capacité d’Etoilys à être :

- identifié correctement par les moteurs de recherche et les assistants IA ;
- cité comme source fiable sur le classement des meublés de tourisme ;
- recommandé sur les requêtes commerciales locales pertinentes ;
- distingué sans ambiguïté des autres organismes ;
- mesuré jusqu’à la conversion réelle : visite, formulaire, appel ou demande de classement.

Le chantier ne consiste pas à créer un « SEO spécial ChatGPT » séparé du reste. Il vise surtout à renforcer :

1. la cohérence de l’identité publique d’Etoilys ;
2. les preuves externes de légitimité ;
3. la qualité des contenus citables ;
4. les données structurées et les signaux techniques utiles ;
5. la mesure des citations et des conversions issues des IA.

---

## 2. État initial

### Score de diagnostic au 10 juillet 2026

| Dimension                                     |      Score | Diagnostic                                     |
| --------------------------------------------- | ---------: | ---------------------------------------------- |
| Accessibilité technique                       |      19/20 | Excellent                                      |
| Contenus citables                             |      22/25 | Très bon                                       |
| Identification et crédibilité de l’entreprise |      15/20 | Bon, mais perfectible                          |
| Réputation et confirmations externes          |       9/20 | Principal point faible                         |
| Mesure des performances IA                    |       7/15 | À construire                                   |
| **Total**                                     | **72/100** | **Base solide, autorité externe insuffisante** |

### Points déjà acquis

- [x] Le site fournit du HTML exploitable sans dépendre uniquement du JavaScript.
- [x] Les pages publiques utiles sont en `index,follow`.
- [x] Les URLs canoniques sont présentes.
- [x] Le sitemap XML est accessible.
- [x] Les versions françaises et anglaises utilisent des liens `hreflang`.
- [x] Le `robots.txt` n’interdit pas les principaux robots de recherche et d’IA.
- [x] Le sitemap est déclaré dans le `robots.txt`.
- [x] Des données structurées `Organization`, `WebSite`, `BlogPosting`, `Person` et `BreadcrumbList` existent déjà.
- [x] Les articles comportent des dates, des auteurs et des sources officielles.
- [x] Les pages locales répondent déjà à des requêtes commerciales en Dordogne, Gironde et Lot-et-Garonne.
- [x] Les contenus récents sont indexés rapidement.
- [x] Etoilys dispose de preuves institutionnelles fortes via Atout France et le Cofrac.
- [x] Des clients déclarent déjà avoir trouvé Etoilys via ChatGPT.

---

## 3. Légende de pilotage

Chaque tâche porte un responsable probable :

- **`[CODEX]`** : tâche réalisable principalement dans le repo.
- **`[HUMAIN]`** : action externe, administrative, commerciale ou nécessitant un accès non disponible à Codex.
- **`[MIXTE]`** : préparation ou implémentation par Codex, avec validation ou configuration manuelle.
- **`[DÉCISION]`** : arbitrage préalable de Florian nécessaire.

Règle de suivi :

- ne cocher une tâche que lorsqu’une preuve de réalisation existe ;
- documenter les décisions prises dans le repo ;
- ajouter sous la tâche un lien, une capture, un ticket ou un commit lorsque c’est utile ;
- ne pas transformer cette roadmap en inventaire de micro-optimisations GEO décoratives.

---

# Lot 0 — Baseline, gouvernance et critères de succès

## Objectif

Créer une base mesurable avant les modifications, éviter les actions dispersées et conserver une trace des décisions.

### Tâches

- [x] **`[MIXTE]`** Créer dans le repo le document `docs/geo-aeo/roadmap-geo-aeo-site-public-etoilys.md` à partir de cette roadmap.
- [x] **`[CODEX]`** Ajouter une section GEO/AEO dans la documentation projet principale ou un lien vers cette roadmap.
- [x] **`[CODEX]`** Inventorier les composants, fichiers et scripts concernés :
  - données structurées ;
  - SEO centralisé ;
  - sitemap ;
  - IndexNow ;
  - analytics/PostHog ;
  - pages d’identité ;
  - articles et auteurs ;
  - pages locales ;
  - pages anglaises.
- [x] **`[MIXTE]`** Créer un fichier de baseline, par exemple `docs/geo-aeo/geo-aeo-baseline-2026-07.md`, contenant :
  - score initial 72/100 ;
  - nombre d’URLs indexables ;
  - nombre de pages locales ;
  - nombre d’articles ;
  - nombre d’avis Google visibles ;
  - nombre de mentions partenaires identifiées ;
  - état des profils externes ;
  - état de la mesure des référents IA.
- [x] **`[MIXTE]`** Constituer et dater un panel de 15 à 30 requêtes tests représentatives.
  - ChatGPT réalise la sélection, l’exécution initiale, la collecte des résultats et la baseline.
  - Décision du 10 juillet 2026 : ChatGPT est le seul assistant testé activement. Claude, Gemini, Perplexity et Copilot ne nécessitent pas de vérification manuelle ; leurs référents restent observés passivement s’ils apparaissent dans les analytics.

- [x] **`[MIXTE]`** Tester les 20 requêtes du panel dans ChatGPT avec recherche web.
  - ChatGPT documente les URLs Etoilys, les sources dominantes, la visibilité et le diagnostic observés.
  - Aucun test manuel d’un autre assistant n’est requis pour clôturer le lot 0.

- [x] **`[CODEX]`** Stocker le panel et les résultats dans un format versionné, par exemple :
  - `docs/geo-aeo/geo-aeo-query-panel.md`
  - `docs/geo-aeo/tests/2026-07-10.md`

- [x] **`[DÉCISION]`** Ne pas imposer de vérification manuelle dans les autres interfaces propriétaires pour le panel actif.
- [x] **`[MIXTE]`** Définir les métriques de succès à suivre chaque mois :
  - sessions issues de ChatGPT, Perplexity, Claude, Gemini et Copilot ;
  - formulaires issus de ces sessions ;
  - demandes de classement issues de ces sessions ;
  - appels déclarés comme provenant d’une IA ;
  - pages Etoilys citées dans Bing AI Performance ou outils équivalents ;
  - nombre de mentions partenaires ;
  - volume et note des avis Google ;
  - cohérence des données d’entreprise sur les sources externes.

Preuves du lot 0 :

- [baseline datée](geo-aeo-baseline-2026-07.md) ;
- [panel v1 de 20 requêtes](geo-aeo-query-panel.md) ;
- [résultats du 10 juillet 2026](tests/2026-07-10.md) ;
- section « Gouvernance GEO / AEO » du `README.md`.

### Critères d’acceptation

- [x] Une baseline datée est disponible.
- [x] Les requêtes tests sont documentées.
- [x] Les indicateurs mensuels sont définis.
- [x] Toute future évolution peut être comparée à l’état du 10 juillet 2026.

---

# Lot 1 — Corriger et verrouiller l’identité publique d’Etoilys

## Objectif

Supprimer les contradictions entre les sources institutionnelles et empêcher une IA de restituer une ancienne dénomination ou un mauvais numéro.

## 1.1 Correction Cofrac — priorité absolue

- [ ] **`[HUMAIN]`** Contacter le Cofrac pour demander simultanément la correction :
  - du numéro actuellement affiché : `07 85 33 68 82` ;
  - vers le numéro de référence : `06 49 55 15 40` ;
  - de la dénomination `SAS ETOILYS` si elle doit être remplacée ;
  - de toute autre information obsolète repérée dans la fiche.
- [ ] **`[HUMAIN]`** Obtenir une confirmation écrite de prise en compte.
- [ ] **`[HUMAIN]`** Vérifier la publication effective de la nouvelle fiche ou attestation.
- [ ] **`[HUMAIN]`** Archiver la preuve de correction dans la documentation interne.

## 1.2 Référentiel canonique des informations d’entreprise

- [ ] **`[DÉCISION]`** Valider une fois pour toutes les valeurs canoniques :
  - nom commercial ;
  - dénomination légale ;
  - forme juridique ;
  - SIREN/SIRET ;
  - adresse ;
  - téléphone ;
  - email ;
  - URL du site ;
  - numéro d’accréditation ;
  - formulation officielle de l’accréditation ;
  - zone d’intervention.
- [ ] **`[CODEX]`** Créer ou consolider une source de vérité unique dans le repo pour ces informations.
- [ ] **`[CODEX]`** Éliminer les duplications dispersées dans les composants et contenus lorsque c’est raisonnable.
- [ ] **`[CODEX]`** Ajouter des tests empêchant la réapparition d’un ancien téléphone, d’une ancienne dénomination ou d’une mauvaise mention Cofrac dans le site.
- [ ] **`[CODEX]`** Ajouter une recherche automatisée ou un test statique sur les anciennes valeurs connues.

## 1.3 Audit des profils et registres externes

- [ ] **`[HUMAIN]`** Vérifier la cohérence des informations sur :
  - Cofrac ;
  - Atout France ;
  - Google Business Profile ;
  - Bing Places ;
  - LinkedIn ;
  - Annuaire des entreprises ;
  - profils d’offices de tourisme ;
  - annuaires partenaires ;
  - éventuelles pages de conciergeries ou agences.
- [ ] **`[HUMAIN]`** Corriger les divergences identifiées.
- [ ] **`[MIXTE]`** Créer un tableau de suivi des profils externes dans `docs/identite-publique-etoilys.md` avec :
  - plateforme ;
  - URL ;
  - données affichées ;
  - statut ;
  - date de dernière vérification ;
  - prochaine vérification prévue.

### Critères d’acceptation

- [ ] Le Cofrac affiche les bonnes informations.
- [ ] Le site utilise une source de vérité unique pour les données d’entreprise.
- [ ] Aucun ancien numéro ou ancienne dénomination connue ne subsiste dans le repo.
- [ ] Les principales sources externes présentent des données cohérentes.

---

# Lot 2 — Instrumenter les citations et les conversions issues des IA

## Objectif

Passer des impressions anecdotiques à une mesure exploitable, sans prétendre mesurer ce que les plateformes ne rendent pas observable.

## 2.1 Bing Webmaster Tools et AI Performance

- [ ] **`[HUMAIN]`** Vérifier que le domaine Etoilys est correctement ajouté et validé dans Bing Webmaster Tools.
- [ ] **`[HUMAIN]`** Activer ou consulter le rapport AI Performance disponible pour le domaine.
- [ ] **`[HUMAIN]`** Exporter une première baseline :
  - pages citées ;
  - requêtes ou formulations associées ;
  - évolution temporelle ;
  - pays ou langues lorsque disponibles.
- [ ] **`[MIXTE]`** Documenter les enseignements dans `docs/geo-aeo-measurement.md`.

## 2.2 Google Search Console

- [ ] **`[HUMAIN]`** Vérifier les rapports disponibles liés aux expériences ou recherches génératives.
- [ ] **`[HUMAIN]`** Conserver une capture ou un export de baseline lorsqu’un rapport dédié est disponible.
- [ ] **`[HUMAIN]`** Ne pas inventer de segmentation « IA » si Google ne fournit pas réellement cette donnée dans le compte.

## 2.3 PostHog — audience cookieless et acquisition consentie

- [x] **`[CODEX]`** Auditer la collecte actuelle des référents et paramètres UTM.
- [x] **`[CODEX]`** Conserver uniquement en mémoire volatile, avant consentement, les signaux suivants :
  - `utm_source=chatgpt.com` ;
  - référent ChatGPT ;
  - référent Perplexity ;
  - référent Claude ;
  - référent Gemini ;
  - référent Copilot.
- [x] **`[CODEX]`** Documenter que ce contexte est perdu après un rechargement sans choix et n’est transmis qu’après acceptation.
- [x] **`[CODEX]`** Définir une fonction canonique de classification des sources IA, des moteurs, des campagnes et des référents.
- [x] **`[CODEX]`** Ajouter après consentement des propriétés analytics non sensibles :
  - `acquisition_channel = "generative_ai"` ;
  - `ai_referrer = "chatgpt" | "perplexity" | "claude" | "gemini" | "copilot" | "other"` ;
  - `landing_page` ;
  - `locale`.
- [x] **`[CODEX]`** Relier ces propriétés aux événements de conversion déjà suivis :
  - soumission Contact ;
  - demande de classement ;
  - clic téléphone ;
  - clic email ;
  - démarrage de simulateur, si pertinent.
- [x] **`[CODEX]`** Implémenter `audience_landed` après refus explicite, limité à `landing_page` et `locale`, derrière `VITE_ENABLE_COOKIELESS_AUDIENCE=false`.
- [x] **`[CODEX]`** Ajouter une opposition indépendante à la mesure minimale dans les préférences.
- [x] **`[CODEX]`** Documenter la matrice des états, les deux ensembles de vues et les contrôles préalables dans `docs/geo-aeo/geo-aeo-measurement.md`.
- [x] **`[CODEX]`** Ajouter des tests unitaires sur la classification, les domaines trompeurs, le consentement, le refus, l’opposition et le payload minimal.
- [ ] **`[HUMAIN]`** Configurer et prouver l’hébergement UE, le DPA, la rétention, les intégrations et Cookieless Server Hash.
- [ ] **`[HUMAIN]`** Valider les textes juridiques et documenter l’analyse interne des critères d’exemption.
- [ ] **`[HUMAIN]`** Contrôler le payload réseau et les propriétés ingérées en conditions réelles.
- [ ] **`[HUMAIN]`** Créer deux ensembles de vues séparés « Audience minimale » et « Acquisition consentie ».
- [ ] **`[HUMAIN]`** Activer le flag cookieless uniquement lorsque tous les contrôles bloquants disposent d’une preuve.

## 2.4 Attribution déclarative

- [ ] **`[DÉCISION]`** Décider s’il faut ajouter au formulaire une question facultative du type « Comment avez-vous connu Etoilys ? ».
- [ ] **`[CODEX]`** Si validé, intégrer une réponse simple et exploitable sans alourdir la conversion :
  - Google ;
  - ChatGPT ou autre assistant IA ;
  - office de tourisme ;
  - partenaire ;
  - recommandation ;
  - autre.
- [ ] **`[CODEX]`** Transmettre la valeur au backend ou dans `payload_json`.
- [ ] **`[HUMAIN]`** Former les personnes qui répondent au téléphone à noter la source déclarée par le prospect.

### Critères d’acceptation

- [ ] Les principaux référents IA sont identifiés dans PostHog.
- [ ] Les conversions peuvent être reliées à une session issue d’une IA lorsqu’un signal existe.
- [ ] Une baseline Bing ou équivalente est archivée.
- [ ] Aucune donnée non disponible n’est présentée comme mesurée.

---

# Lot 3 — Sitemap, fraîcheur et IndexNow

## Objectif

Rendre les mises à jour immédiatement compréhensibles par les moteurs et éviter les dates artificielles.

## 3.1 Audit de l’existant

- [x] **`[CODEX]`** Auditer le script IndexNow déjà présent dans le repo avant toute nouvelle implémentation.
- [x] **`[CODEX]`** Auditer la génération actuelle du sitemap.
- [x] **`[CODEX]`** Vérifier si chaque URL reçoit un `<lastmod>` :
  - exact ;
  - stable ;
  - issu d’une vraie date de modification ;
  - non régénéré artificiellement à chaque build.
- [x] **`[CODEX]`** Vérifier le traitement des pages FR, EN, locales et des articles.

## 3.2 Lastmod exact

- [x] **`[CODEX]`** Définir une source fiable de `lastmod` selon le type de page.
- [x] **`[CODEX]`** Pour les articles, utiliser la vraie date `updatedDate` ou équivalent.
- [x] **`[CODEX]`** Pour les pages statiques, utiliser une date de contenu explicite ou une source contrôlée.
- [x] **`[CODEX]`** Ne pas utiliser la date du build comme date de modification de toutes les pages.
- [x] **`[CODEX]`** Ajouter des tests sur le format et la cohérence des dates.
- [x] **`[CODEX]`** Vérifier que le sitemap final reste valide.

## 3.3 IndexNow

- [x] **`[CODEX]`** Vérifier que la clé publique IndexNow est servie correctement.
- [x] **`[CODEX]`** Vérifier que le script soumet seulement les URLs modifiées ou publiées.
- [x] **`[CODEX]`** Éviter une soumission massive inutile à chaque déploiement si aucun contenu n’a changé.
- [x] **`[CODEX]`** Ajouter une commande documentée pour :
  - soumettre une URL ;
  - soumettre une liste d’URLs ;
  - vérifier les erreurs.
- [x] **`[MIXTE]`** Intégrer l’appel au workflow de publication si cela reste fiable et observable.
- [x] **`[CODEX]`** Journaliser les succès et échecs sans exposer de secret.

### Critères d’acceptation

- [x] Les `<lastmod>` reflètent les vraies modifications.
- [x] Le build ne donne pas artificiellement la date du jour à toutes les pages.
- [x] IndexNow fonctionne et son usage est documenté.
- [x] Une publication ou une mise à jour d’article peut déclencher une soumission propre.

### Preuves

- `npm run seo:sitemap` : 39 URLs générées avec `<lastmod>`.
- `npm run test:run` : 276 tests passés.
- `npm run typecheck` : OK.
- `INDEXNOW_DRY_RUN=1 npm run indexnow:submit` validé sur URL unique, liste, fichiers modifiés et diff sitemap.

---

# Lot 4 — Renforcer l’entité Etoilys dans les données structurées

## Objectif

Aider les moteurs à relier sans ambiguïté l’organisation, ses services, ses auteurs, ses pages et ses profils officiels.

## 4.1 Audit du graphe actuel

- [ ] **`[CODEX]`** Inventorier tous les JSON-LD produits par le site.
- [ ] **`[CODEX]`** Identifier :
  - les `@id` absents ou instables ;
  - les informations dupliquées ;
  - les entités non reliées ;
  - les URLs non canoniques ;
  - les logos ou images inadaptés ;
  - les incohérences FR/EN.
- [ ] **`[CODEX]`** Vérifier le rendu final dans le HTML prerenderé, pas seulement dans React.

## 4.2 Organisation canonique

- [ ] **`[CODEX]`** Définir un `@id` stable pour Etoilys, par exemple une URL canonique avec fragment.
- [ ] **`[CODEX]`** Ajouter ou confirmer :
  - `name` ;
  - `legalName` si pertinent ;
  - `description` ;
  - `url` ;
  - `logo` ;
  - `image` ;
  - `telephone` ;
  - `email` ;
  - `address` ;
  - `foundingDate` ;
  - identifiant SIREN/SIRET correctement modélisé ;
  - `sameAs` vers les profils officiels validés ;
  - `areaServed`.
- [ ] **`[DÉCISION]`** Valider la représentation exacte du numéro d’accréditation dans le graphe.
- [ ] **`[CODEX]`** Relier l’organisation à la page institutionnelle lorsqu’elle existe.
- [ ] **`[CODEX]`** Relier les pages de service à l’organisation via un graphe cohérent.

## 4.3 Services

- [ ] **`[CODEX]`** Évaluer l’intérêt d’une entité `Service` canonique pour le classement des meublés de tourisme.
- [ ] **`[CODEX]`** Si retenu, renseigner de façon sobre :
  - fournisseur ;
  - zone desservie ;
  - type de service ;
  - URL de la page principale ;
  - éventuelles offres uniquement si les tarifs sont publiés et exacts.
- [ ] **`[CODEX]`** Ne pas multiplier les schémas par commune ou créer des entités artificielles sans valeur.

## 4.4 Validation

- [ ] **`[CODEX]`** Ajouter des tests de structure et de cohérence.
- [ ] **`[MIXTE]`** Vérifier les pages principales avec les validateurs adaptés.
- [ ] **`[CODEX]`** Documenter les choix dans `docs/structured-data-etoilys.md`.

### Critères d’acceptation

- [ ] Etoilys possède un `@id` stable.
- [ ] Les articles, auteurs, services et pages institutionnelles pointent vers des entités cohérentes.
- [ ] Les profils `sameAs` ont été vérifiés humainement.
- [ ] Les données structurées ne contiennent ni promesse commerciale inventée ni donnée non publique.

---

# Lot 5 — Créer une page institutionnelle « Qui sommes-nous ? »

## Objectif

Fournir une page canonique qui explique clairement qui est Etoilys, pourquoi l’entreprise est légitime et comment elle travaille.

## 5.1 Cadrage

- [ ] **`[DÉCISION]`** Valider la route française :
  - `/qui-sommes-nous` ;
  - ou `/etoilys` ;
  - ou réactivation adaptée de `/notre-equipe`.
- [ ] **`[DÉCISION]`** Décider si cette page doit entrer immédiatement dans la navigation principale.
- [ ] **`[DÉCISION]`** Décider du périmètre anglais :
  - traduction dans le même lot ;
  - ou dette documentée pour une phase ultérieure.

## 5.2 Contenu attendu

- [ ] **`[MIXTE]`** Rédiger et valider un contenu comprenant :
  - rôle d’Etoilys ;
  - activité de classement officiel des meublés de tourisme ;
  - histoire de l’entreprise ;
  - dirigeants et personnes intervenant dans l’activité ;
  - accréditation Cofrac Inspection n°3-2394 ;
  - lien vers la portée ou attestation officielle ;
  - méthode de travail ;
  - étapes générales d’intervention ;
  - zones réellement couvertes ;
  - coordonnées officielles ;
  - liens vers les profils externes officiels ;
  - lien vers la politique éditoriale ;
  - lien vers les pages auteur.
- [ ] **`[HUMAIN]`** Valider chaque information relative :
  - aux fonctions ;
  - à l’accréditation ;
  - aux inspecteurs ;
  - aux responsabilités ;
  - à la zone couverte.
- [ ] **`[CODEX]`** Intégrer la page dans l’architecture existante.
- [ ] **`[CODEX]`** Ajouter les métadonnées SEO, canonical, sitemap et prerender.
- [ ] **`[CODEX]`** Ajouter les données structurées institutionnelles.
- [ ] **`[CODEX]`** Ajouter des liens vers cette page depuis :
  - footer ;
  - articles ;
  - pages de service pertinentes ;
  - données structurées.
- [ ] **`[CODEX]`** Ajouter les tests de route, SEO, navigation et contenu critique.

### Critères d’acceptation

- [ ] Une page institutionnelle unique et complète existe.
- [ ] L’accréditation est formulée exactement.
- [ ] La zone d’intervention est cohérente avec les pages locales.
- [ ] Les moteurs disposent d’une URL canonique pour identifier Etoilys.

---

# Lot 6 — Créer les pages auteur et la politique éditoriale

## Objectif

Relier les contenus à des personnes identifiables et rendre explicite la méthode de vérification des articles.

## 6.1 Modèle auteur

- [ ] **`[DÉCISION]`** Valider la liste des auteurs réellement publiés :
  - Florian Grisorio ;
  - Rédaction Etoilys ;
  - autres auteurs ou relecteurs éventuels.
- [ ] **`[DÉCISION]`** Décider si `Rédaction Etoilys` reste une entité éditoriale ou si les articles doivent être attribués à une personne.
- [ ] **`[CODEX]`** Créer un modèle de données auteur typé et centralisé.
- [ ] **`[CODEX]`** Ajouter pour chaque auteur les champs pertinents :
  - nom ;
  - fonction ;
  - courte biographie ;
  - photo ou avatar validé ;
  - domaines de compétence ;
  - profils officiels ;
  - URL canonique ;
  - éventuellement rôle de relecture.

## 6.2 Page auteur Florian Grisorio

- [ ] **`[MIXTE]`** Rédiger une biographie factuelle et vérifiable.
- [ ] **`[HUMAIN]`** Valider la fonction exacte, l’expérience mentionnée et les profils externes.
- [ ] **`[CODEX]`** Créer la route et la page auteur.
- [ ] **`[CODEX]`** Lister les articles de l’auteur.
- [ ] **`[CODEX]`** Relier les `BlogPosting` à l’entité `Person`.
- [ ] **`[CODEX]`** Ajouter canonical, sitemap, prerender et tests.

## 6.3 Politique éditoriale

- [ ] **`[MIXTE]`** Créer une page courte expliquant :
  - les sources officielles prioritaires ;
  - la manière dont les règles sont datées ;
  - la distinction entre règle nationale et locale ;
  - la fréquence de vérification ;
  - la procédure de correction ;
  - la différence entre information générale et conseil juridique ou fiscal personnalisé.
- [ ] **`[CODEX]`** Ajouter la route, le SEO et les liens depuis les articles.
- [ ] **`[CODEX]`** Ajouter un composant réutilisable indiquant la date de dernière vérification lorsque cette donnée existe réellement.
- [ ] **`[CODEX]`** Ne pas afficher une fausse date de vérification calculée au build.

## 6.4 Migration des articles

- [ ] **`[CODEX]`** Relier tous les articles existants à une entité auteur valide.
- [ ] **`[CODEX]`** Vérifier la cohérence entre :
  - auteur visible ;
  - métadonnées ;
  - JSON-LD ;
  - page auteur.
- [ ] **`[CODEX]`** Ajouter des tests empêchant un article indexable sans auteur valide.

### Critères d’acceptation

- [ ] Chaque article indexable pointe vers un auteur ou une entité éditoriale définie.
- [ ] Une politique éditoriale publique est accessible.
- [ ] Les dates de vérification affichées sont réelles.
- [ ] Les données structurées correspondent au contenu visible.

---

# Lot 7 — Désambiguïser toutes les données fiscales et temporelles

## Objectif

Éviter qu’un moteur prélève un chiffre juste dans un contexte et le restitue comme vérité générale.

## 7.1 Audit transversal

- [ ] **`[CODEX]`** Rechercher dans le repo toutes les occurrences de :
  - `77 700` ;
  - `83 600` ;
  - `71 %` ;
  - `50 %` ;
  - `30 %` ;
  - `15 000` ;
  - `188 700` ;
  - `2025` ;
  - `2026` ;
  - `2027`.
- [ ] **`[MIXTE]`** Classer chaque occurrence :
  - correcte et datée ;
  - correcte mais ambiguë ;
  - obsolète ;
  - hors contexte fiscal.
- [ ] **`[HUMAIN]`** Valider les règles fiscales sensibles avant modification.

## 7.2 Corrections

- [ ] **`[CODEX]`** Remplacer les formulations ambiguës par des formulations explicitement datées, notamment :
  - revenus 2025 déclarés en 2026 ;
  - revenus 2026 déclarés en 2027.
- [ ] **`[CODEX]`** Vérifier les pages :
  - avantages du classement ;
  - simulateur fiscal ;
  - FAQ ;
  - articles micro-BIC ;
  - page classement ;
  - pages locales ;
  - contenus anglais concernés.
- [ ] **`[CODEX]`** Aligner les tableaux, encadrés, FAQ, métadonnées et données structurées.
- [ ] **`[CODEX]`** Ajouter des tests ou fixtures empêchant le retour d’anciens paramètres connus.
- [ ] **`[CODEX]`** Vérifier que les snippets et résumés ne coupent pas l’information temporelle essentielle.

### Critères d’acceptation

- [ ] Chaque seuil fiscal sensible est accompagné de sa période d’application.
- [ ] Aucun ancien abattement ou plafond n’est présenté comme actuel.
- [ ] Les versions FR et EN ne se contredisent pas.
- [ ] Les simulateurs et articles utilisent la même source de vérité lorsque cela est possible.

---

# Lot 8 — Réputation locale, profils et avis clients

## Objectif

Créer des confirmations externes authentiques et visibles, principal levier restant identifié par l’audit.

## 8.1 Google Business Profile

- [ ] **`[HUMAIN]`** Vérifier l’état public de la fiche.
- [ ] **`[HUMAIN]`** Vérifier :
  - catégorie ;
  - nom ;
  - téléphone ;
  - site ;
  - zone desservie ;
  - horaires ;
  - description ;
  - photos ;
  - services ;
  - lien de prise de contact.
- [ ] **`[HUMAIN]`** Corriger les incohérences.
- [ ] **`[HUMAIN]`** Définir une procédure de réponse aux avis.

## 8.2 Bing Places

- [ ] **`[HUMAIN]`** Revendiquer ou mettre à jour la fiche Bing Places.
- [ ] **`[HUMAIN]`** Aligner strictement les informations avec la source canonique.
- [ ] **`[HUMAIN]`** Vérifier l’affichage public final.

## 8.3 Collecte d’avis

- [ ] **`[DÉCISION]`** Valider le moment d’envoi de la demande d’avis :
  - après envoi de la décision ;
  - après clôture du dossier ;
  - autre moment défini.
- [ ] **`[MIXTE]`** Préparer un modèle d’email court et non orienté.
- [ ] **`[CODEX]`** Si pertinent, intégrer le déclenchement dans les emails ou le back-office, dans un ticket séparé du site public.
- [ ] **`[HUMAIN]`** Demander des avis authentiques sans imposer le contenu.
- [ ] **`[HUMAIN]`** Ne jamais conditionner une contrepartie à un avis positif.
- [ ] **`[HUMAIN]`** Encourager les retours portant naturellement sur :
  - réactivité ;
  - clarté ;
  - qualité des échanges ;
  - respect des délais ;
  - simplicité de la procédure.
- [ ] **`[HUMAIN]`** Suivre mensuellement :
  - nombre d’avis ;
  - note moyenne ;
  - thèmes récurrents ;
  - réponses apportées.

### Critères d’acceptation

- [ ] Google Business Profile et Bing Places sont cohérents avec les sources officielles.
- [ ] Un processus durable de demande d’avis existe.
- [ ] Les avis ne sont ni achetés, ni rédigés à la place des clients, ni orientés vers une promesse de classement.

---

# Lot 9 — Obtenir des mentions partenaires réelles

## Objectif

Faire confirmer par des tiers crédibles qu’Etoilys intervient réellement dans ses zones et réalise le classement officiel des meublés.

## 9.1 Ciblage

- [ ] **`[HUMAIN]`** Constituer une liste priorisée de partenaires potentiels :
  - offices de tourisme ;
  - agences de location saisonnière ;
  - conciergeries ;
  - gestionnaires de gîtes ;
  - agences immobilières spécialisées ;
  - réseaux locaux de propriétaires ;
  - partenaires institutionnels.
- [ ] **`[HUMAIN]`** Prioriser les organismes disposant d’un vrai site indexable.
- [ ] **`[HUMAIN]`** Écarter les annuaires SEO sans audience ni crédibilité.

## 9.2 Kit partenaire

- [ ] **`[MIXTE]`** Créer une page ou un document partenaire comprenant :
  - description courte d’Etoilys ;
  - métier ;
  - zone ;
  - accréditation ;
  - coordonnées ;
  - lien vers le site ;
  - logo autorisé ;
  - formulation recommandée mais non imposée.
- [ ] **`[HUMAIN]`** Valider la formulation institutionnelle.
- [ ] **`[CODEX]`** Si une page partenaire publique est créée, l’intégrer proprement sans en faire une page artificielle à backlinks.

## 9.3 Prospection et suivi

- [ ] **`[HUMAIN]`** Contacter les partenaires prioritaires.
- [ ] **`[HUMAIN]`** Chercher d’abord de vraies collaborations utiles :
  - page partenaires ;
  - annuaire de professionnels ;
  - ressource propriétaire ;
  - intervention ou contenu commun ;
  - recommandation pratique.
- [ ] **`[HUMAIN]`** Obtenir une première cible de 5 mentions réelles.
- [ ] **`[HUMAIN]`** Étendre ensuite vers 10 mentions de qualité.
- [ ] **`[HUMAIN]`** Vérifier que les mentions publiques comportent idéalement :
  - Etoilys ;
  - classement des meublés de tourisme ;
  - zone d’intervention ;
  - accréditation ou statut ;
  - lien vers une page pertinente.
- [ ] **`[MIXTE]`** Maintenir un registre `docs/mentions-partenaires.md` :
  - partenaire ;
  - URL ;
  - date ;
  - zone ;
  - texte utilisé ;
  - statut du lien ;
  - dernière vérification.

### Critères d’acceptation

- [ ] Au moins 5 mentions partenaires réelles sont publiques et indexables.
- [ ] L’objectif suivant de 10 mentions est planifié.
- [ ] Les mentions proviennent de partenaires pertinents, pas de fermes de liens.
- [ ] Les informations publiées sont exactes.

---

# Lot 10 — Produire des contenus propriétaires issus du terrain

## Objectif

Publier des informations qu’un concurrent ne peut pas simplement réécrire à partir des mêmes textes officiels.

## 10.1 Gouvernance des données

- [ ] **`[HUMAIN]`** Identifier les données qu’Etoilys peut publier légalement et utilement.
- [ ] **`[HUMAIN]`** Vérifier :
  - anonymisation ;
  - confidentialité ;
  - conformité contractuelle ;
  - taille minimale d’échantillon ;
  - risque de réidentification ;
  - exactitude statistique.
- [ ] **`[DÉCISION]`** Définir les périodes et zones publiables.
- [ ] **`[MIXTE]`** Rédiger une méthodologie publique courte pour chaque étude.

## 10.2 Premiers sujets recommandés

- [ ] **`[MIXTE]`** Étudier un article sur les critères le plus souvent manquants avant la visite.
- [ ] **`[MIXTE]`** Étudier un article sur les catégories d’étoiles réellement demandées.
- [ ] **`[MIXTE]`** Étudier un article sur les délais moyens observés, sans les transformer en garantie contractuelle.
- [ ] **`[MIXTE]`** Étudier un baromètre annuel :
  - Dordogne ;
  - Gironde ;
  - Lot-et-Garonne.
- [ ] **`[MIXTE]`** Étudier un article sur les erreurs fréquentes après l’obtention du classement.
- [ ] **`[MIXTE]`** Étudier une FAQ enrichie par les vraies questions reçues par téléphone ou email.

## 10.3 Implémentation éditoriale

- [ ] **`[CODEX]`** Réutiliser l’architecture Actualités existante.
- [ ] **`[CODEX]`** Ajouter :
  - auteur ;
  - date de publication ;
  - date de mise à jour ;
  - méthodologie ;
  - taille d’échantillon ;
  - période étudiée ;
  - limites de l’analyse ;
  - sources externes éventuelles.
- [ ] **`[CODEX]`** Créer des tableaux ou graphiques seulement lorsqu’ils améliorent réellement la compréhension.
- [ ] **`[CODEX]`** Relier les articles aux pages de service pertinentes.
- [ ] **`[CODEX]`** Ajouter les tests SEO et structurés habituels.

### Critères d’acceptation

- [ ] Au moins un contenu propriétaire est publié avec une méthodologie explicite.
- [ ] Les données sont anonymisées et validées.
- [ ] Les conclusions ne dépassent pas ce que l’échantillon permet d’affirmer.
- [ ] Le contenu apporte une information introuvable dans les simples textes officiels.

---

# Lot 11 — Renforcer la présence anglophone locale

## Objectif

Capitaliser sur la bonne visibilité de la version anglaise et répondre précisément aux propriétaires étrangers situés en Dordogne.

## 11.1 Cadrage

- [ ] **`[DÉCISION]`** Valider la création d’une page anglaise locale Dordogne.
- [ ] **`[DÉCISION]`** Valider la route, par exemple :
  - `/en/furnished-tourist-accommodation-classification-dordogne`.
- [ ] **`[DÉCISION]`** Décider si Gironde et Lot-et-Garonne doivent suivre immédiatement ou après mesure de la première page.

## 11.2 Contenu

- [ ] **`[MIXTE]`** Préparer une traduction/adaptation fidèle de la page Dordogne :
  - classement officiel en France ;
  - intervention locale ;
  - principales zones couvertes ;
  - visite sur place ;
  - procédure ;
  - accréditation ;
  - contact en anglais ;
  - sources officielles françaises si pertinentes.
- [ ] **`[HUMAIN]`** Vérifier la précision de la zone géographique.
- [ ] **`[CODEX]`** Réutiliser les composants et l’architecture i18n existants.
- [ ] **`[CODEX]`** Ajouter :
  - route ;
  - contenu ;
  - SEO ;
  - canonical ;
  - `hreflang` réciproque ;
  - sitemap ;
  - prerender ;
  - navigation interne adaptée ;
  - tests.
- [ ] **`[CODEX]`** Ne pas ajouter de liens anglais vers des routes françaises sans décision documentée.

## 11.3 Mesure

- [ ] **`[HUMAIN]`** Suivre les impressions et clics sur les requêtes anglaises.
- [ ] **`[HUMAIN]`** Suivre les leads anglophones.
- [ ] **`[DÉCISION]`** Décider après données réelles s’il faut créer les pages Gironde et Lot-et-Garonne.

### Critères d’acceptation

- [ ] Une page Dordogne anglaise indexable et cohérente existe.
- [ ] Les alternatives linguistiques sont réciproques.
- [ ] Aucun contenu juridique ou fiscal n’a été enrichi sans équivalent ou validation.
- [ ] La création d’autres pages locales EN dépend des résultats, pas d’une logique de clonage massif.

---

# Lot 12 — Arbitrer une page tarifaire centrale

## Objectif

Décider explicitement si Etoilys souhaite être cité sur les requêtes de prix et de comparaison tarifaire.

## 12.1 Décision commerciale

- [ ] **`[DÉCISION]`** Choisir entre :
  - publier des tarifs centraux ;
  - publier une fourchette ;
  - publier seulement les facteurs de prix ;
  - ne publier aucun tarif.
- [ ] **`[DÉCISION]`** Valider les montants et conditions actuels :
  - visite standard ;
  - visite groupée ;
  - déplacement ;
  - cas hors zone ;
  - date d’application ;
  - TTC/HT selon le public.
- [ ] **`[HUMAIN]`** Vérifier la cohérence avec la facturation réelle et les offres partenaires.

## 12.2 Option A — Page tarifaire publiée

- [ ] **`[CODEX]`** Créer une page tarifaire centrale sans ajouter les prix sur toutes les pages locales.
- [ ] **`[CODEX]`** Expliquer clairement :
  - ce qui est inclus ;
  - les conditions des visites groupées ;
  - la validation du prix avant engagement ;
  - les cas particuliers ;
  - la date de validité.
- [ ] **`[CODEX]`** Ajouter les liens internes pertinents.
- [ ] **`[CODEX]`** Ajouter SEO, sitemap, prerender, données structurées raisonnables et tests.
- [ ] **`[CODEX]`** Prévoir une source de vérité évitant des prix divergents.

## 12.3 Option B — Pas de prix publié

- [ ] **`[MIXTE]`** Documenter la décision et sa conséquence :
  - Etoilys sera moins facilement cité sur les requêtes « prix » ou « moins cher ».
- [ ] **`[CODEX]`** Vérifier que la copy actuelle explique au moins quand et comment le prix est confirmé.
- [ ] **`[CODEX]`** Ne pas créer de balisage `Offer` ou de données tarifaires incomplètes.

### Critères d’acceptation

- [ ] La décision tarifaire est explicite et documentée.
- [ ] Les prix affichés, s’il y en a, sont exacts et centralisés.
- [ ] Le site ne laisse pas croire qu’un prix est universel s’il dépend des conditions.

---

# Lot 13 — QA GEO/AEO et tests de non-régression

## Objectif

Vérifier que les améliorations sont techniquement correctes, visibles et cohérentes sur l’ensemble du site.

## 13.1 Tests automatisés

- [ ] **`[CODEX]`** Ajouter ou renforcer les tests sur :
  - données d’entreprise canoniques ;
  - auteurs ;
  - données structurées ;
  - canonical ;
  - `hreflang` ;
  - sitemap ;
  - `lastmod` ;
  - routes institutionnelles ;
  - pages anglaises ;
  - anciens numéros ou anciens seuils ;
  - analytics des référents IA.
- [ ] **`[CODEX]`** Vérifier :
  - `npm run typecheck` ;
  - `npm run lint` ;
  - `npm run test:run` ;
  - `npm run build` ;
  - `npm run build:seo` ;
  - `npm run seo:sitemap` ;
  - `npm run prerender`.

## 13.2 QA HTML final

- [ ] **`[CODEX]`** Inspecter le HTML prerenderé des pages prioritaires.
- [ ] **`[CODEX]`** Vérifier la présence et la cohérence :
  - titre ;
  - meta description ;
  - canonical ;
  - robots ;
  - auteur ;
  - dates ;
  - JSON-LD ;
  - liens internes ;
  - informations d’entreprise ;
  - version linguistique.
- [ ] **`[MIXTE]`** Vérifier quelques pages live après déploiement.

## 13.3 QA externe

- [ ] **`[HUMAIN]`** Vérifier que les moteurs voient les nouvelles pages.
- [ ] **`[HUMAIN]`** Contrôler l’évolution des requêtes tests de baseline.
- [ ] **`[HUMAIN]`** Contrôler les citations et formulations observées sans chercher à influencer artificiellement les réponses.
- [ ] **`[HUMAIN]`** Vérifier que les coordonnées restituées sont correctes.
- [ ] **`[HUMAIN]`** Noter les erreurs factuelles pour correction.

### Critères d’acceptation

- [ ] Tous les contrôles CI passent.
- [ ] Le HTML final contient les données attendues.
- [ ] Les nouvelles pages sont accessibles, indexables et reliées.
- [ ] Les coordonnées et informations critiques sont correctes dans les tests externes.

---

# Lot 14 — Suivi mensuel et amélioration continue

## Objectif

Transformer le chantier en routine légère plutôt qu’en refonte ponctuelle oubliée après trois semaines.

## 14.1 Revue mensuelle

- [ ] **`[HUMAIN]`** Relever les leads déclarés comme provenant d’une IA.
- [ ] **`[HUMAIN]`** Consulter le tableau PostHog « Acquisition IA ».
- [ ] **`[HUMAIN]`** Consulter Bing AI Performance ou l’outil disponible.
- [ ] **`[HUMAIN]`** Vérifier les pages les plus citées.
- [ ] **`[HUMAIN]`** Vérifier les requêtes qui ne citent pas Etoilys alors qu’elles sont commercialement pertinentes.
- [ ] **`[HUMAIN]`** Contrôler les avis et mentions partenaires.
- [ ] **`[HUMAIN]`** Contrôler les coordonnées publiques principales.
- [ ] **`[MIXTE]`** Documenter les changements importants dans un journal mensuel.

## 14.2 Revue trimestrielle

- [ ] **`[MIXTE]`** Rejouer le panel de requêtes tests.
- [ ] **`[MIXTE]`** Réévaluer la grille de score sur 100.
- [ ] **`[MIXTE]`** Comparer :
  - visibilité ;
  - citations ;
  - trafic ;
  - conversions ;
  - réputation ;
  - autorité externe.
- [ ] **`[DÉCISION]`** Prioriser le trimestre suivant selon les données réelles.
- [ ] **`[MIXTE]`** Auditer les contenus sensibles devenus potentiellement obsolètes.

## 14.3 Cibles indicatives

Ces objectifs servent de repères, pas de garanties :

- [ ] Atteindre 0 incohérence critique sur les données officielles.
- [ ] Obtenir au moins 5 mentions partenaires réelles, puis 10.
- [ ] Mettre en place une collecte régulière d’avis authentiques.
- [ ] Identifier les conversions issues des IA lorsqu’un référent ou une déclaration existe.
- [ ] Publier au moins un contenu propriétaire solide.
- [ ] Faire progresser la note interne de 72/100 vers 80+/100 après mesure.

---

# 15. Ordre d’exécution recommandé

## Phase 1 — Urgent et fondation

- [ ] Lot 0 — Baseline et gouvernance.
- [ ] Lot 1 — Cohérence Cofrac et identité publique.
- [ ] Lot 2 — Mesure des citations et conversions.
- [x] Lot 3 — Sitemap, `lastmod` et IndexNow.
- [ ] Lot 7 — Désambiguïsation fiscale et temporelle.

## Phase 2 — Entité et confiance

- [ ] Lot 4 — Données structurées.
- [ ] Lot 5 — Page institutionnelle.
- [ ] Lot 6 — Pages auteur et politique éditoriale.
- [ ] Lot 8 — Profils et avis.

## Phase 3 — Autorité externe et différenciation

- [ ] Lot 9 — Mentions partenaires.
- [ ] Lot 10 — Contenus propriétaires.
- [ ] Lot 11 — Page locale anglaise Dordogne.
- [ ] Lot 12 — Arbitrage tarifaire.

## Phase 4 — Contrôle et routine

- [ ] Lot 13 — QA et non-régression.
- [ ] Lot 14 — Suivi mensuel et trimestriel.

---

# 16. Ce qui n’est pas recommandé

- [ ] Ne pas créer un `llms.txt` comme priorité tant qu’aucun besoin concret n’est démontré.
- [ ] Ne pas produire des dizaines de pages clonées « classement meublé + commune ».
- [ ] Ne pas acheter de faux avis, mentions ou backlinks.
- [ ] Ne pas rédiger des témoignages à la place des clients.
- [ ] Ne pas réécrire tout le site dans un style télégraphique prétendument conçu pour les IA.
- [ ] Ne pas publier vingt articles génériques par mois.
- [ ] Ne pas multiplier les schémas JSON-LD inutiles.
- [ ] Ne pas afficher de dates de mise à jour artificielles.
- [ ] Ne pas créer de statistiques propriétaires sans méthodologie ni échantillon suffisant.
- [ ] Ne pas présenter le classement comme garantissant une catégorie d’étoiles.
- [ ] Ne pas utiliser des pages partenaires comme simple prétexte à l’échange de liens.
- [ ] Ne pas faire de promesse de visibilité ou de recommandation par une IA.

---

# 17. Definition of Done globale

Le chantier GEO/AEO peut être considéré comme correctement déployé lorsque :

- [ ] les informations Cofrac et les principales sources externes sont cohérentes ;
- [ ] le repo possède une source canonique pour l’identité Etoilys ;
- [ ] une page institutionnelle et des pages auteur identifient clairement l’entité et les rédacteurs ;
- [ ] les données structurées relient correctement organisation, services, auteurs et articles ;
- [ ] les seuils et dates sensibles sont désambiguïsés sur tout le site ;
- [ ] les mises à jour sont correctement reflétées dans le sitemap et IndexNow ;
- [ ] les référents IA et leurs conversions sont suivis lorsque la donnée est disponible ;
- [ ] Google Business Profile et Bing Places sont propres ;
- [ ] un processus de collecte d’avis authentiques est actif ;
- [ ] au moins 5 mentions partenaires crédibles sont en ligne ;
- [ ] au moins un contenu propriétaire de qualité est publié ;
- [ ] une routine mensuelle de suivi existe ;
- [ ] les tests et builds passent sans régression ;
- [ ] les progrès sont évalués sur des conversions réelles, pas uniquement sur des scores d’outils GEO.
