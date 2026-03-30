# Audit SEO 2026 (Repo-Only) — Etoilys

Date d'audit: 2026-03-30  
Perimetre: audit technique et contenu **uniquement a partir du repo** (pas de crawl prod)  
Stack: React 19 + Vite + TypeScript + React Router (SPA)

## A) Executive Summary

- Le socle SEO existe (composant SEO, maillage interne correct, articles avec JSON-LD) mais la couverture est partielle.
- 9 routes stratégiques sur 16 n'injectent pas de balises SEO (title/description/og/canonical).
- Aucun `robots.txt` ni `sitemap.xml` detecte dans `public/`, ce qui limite la gouvernance crawl/indexation.
- Le `favicon` configure (`/vite.svg`) est absent du repo, et l'image OG par defaut (`/og-image.jpg`) n'existe pas.
- Le composant SEO injecte `meta keywords` (non utilise par Google pour le ranking).
- La page 404 SPA a un title/description mais pas de `noindex` dedie (risque soft-404 indexable selon rendu/hosting).
- Structured data present sur 4 articles (BlogPosting), mais pas de schema Organization/WebSite/Breadcrumb global.
- Heuristiques CWV: fort risque LCP/CLS (images hero lourdes, dimensions non explicites, absence de `loading/decoding/fetchpriority`).
- Score global estime: **56/100** (non-verifiable sur donnees terrain CrUX/GSC).
- Priorite immediate: couverture SEO par route + fichiers robots/sitemap + hygiene assets SEO + optimisation images critiques.

## B) Score SEO Global

| Axe                                   | Score (/100) | Justification courte                                                            |
| ------------------------------------- | -----------: | ------------------------------------------------------------------------------- |
| Crawl & Indexation                    |           42 | Pas de `robots.txt`, pas de sitemap, contraintes SPA JS-only a monitorer        |
| On-page (titles/meta/Hn/canonical)    |           48 | Couverture SEO partielle (7/16 routes), title pattern perfectible, canonical JS |
| Donnees structurees                   |           55 | BlogPosting present sur articles, mais couverture schema insuffisante hors blog |
| Performance / CWV (heuristiques repo) |           50 | Images hero lourdes, pas d'attributs de chargement/dimensions sur images        |
| Architecture & maillage interne       |           78 | Navigation interne robuste via `<Link>`/`<a href>`                              |
| SEO local / business trust            |           63 | Pages legales/contact presentes, mais signaux schema business incomplets        |

**Score global estime: 56/100**  
Note: sans donnees Search Console/CrUX ni crawl prod, ce score est une estimation structurelle.

## C) Findings detailles

| ID    | Gravite | Categorie               | Observation                                                                                                    | Preuve (repo)                                                                                                                                                                                                       | Risque SEO                                                                                      | Recommandation                                                                                              |
| ----- | ------- | ----------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| F-001 | Haute   | On-page coverage        | 9 routes indexables n'ont pas le composant SEO.                                                                | `src/App.tsx` (routes, lignes 28-61) + absence `<SEO` dans `src/pages/Classement.tsx`, `Contact.tsx`, `Actualites.tsx`, `PourquoiClasser.tsx`, `Prerequis.tsx`, `Procedure.tsx`, `FAQ.tsx`, `DemandeClassement.tsx` | Titles/descriptions/canonical incomplets selon route, snippets faibles, ambiguite de pertinence | Appliquer `<SEO>` a toutes les pages indexables avec templates title/description par intention de recherche |
| F-002 | Haute   | Crawl & Indexation      | Aucun `robots.txt` et aucun `sitemap.xml` dans `public/`.                                                      | `public/` contient uniquement 4 fichiers: `Inspection_RVB.jpg`, `Logo complet - site web copy.svg`, `Logo complet - site web.svg`, `Référentiel...pdf`                                                              | Decouverte d'URLs moins fiable, governance crawl inexistante                                    | Ajouter `public/robots.txt` et `public/sitemap.xml` (ou sitemap genere), inclure `Sitemap:` dans robots     |
| F-003 | Haute   | Assets SEO              | `favicon` pointe vers `/vite.svg` absent du repo.                                                              | `index.html:5` + aucun `vite.svg` trouve                                                                                                                                                                            | Favicon manquant dans SERP/navigateur, signal qualite degrade                                   | Remplacer par un favicon existant (`/favicon.svg` ou `.ico`) et verifier rendu Search                       |
| F-004 | Haute   | Social/Preview          | Image OG par defaut configuree sur `/og-image.jpg` absente.                                                    | `src/components/ui/SEO.tsx:16` + aucun `og-image.jpg` dans `public/`                                                                                                                                                | Previews sociaux incoherents, CTR potentiellement degrade                                       | Ajouter un asset OG reel (1200x630) et referencer une URL existante                                         |
| F-005 | Moyenne | On-page quality         | Title concatene un suffixe marque fixe, alors que certaines pages incluent deja "Etoilys" dans le titre passe. | `src/components/ui/SEO.tsx:13` + `src/pages/Home.tsx:54` + `src/pages/actualites/MicroBic2026.tsx:42`                                                                                                               | Titres trop longs/redondants, snippets title moins lisibles                                     | Standardiser: titre de page sans marque + suffixe unique au composant, avec controle longueur               |
| F-006 | Moyenne | Meta tags               | Usage de `meta keywords` dans le composant SEO.                                                                | `src/components/ui/SEO.tsx:23`                                                                                                                                                                                      | Pas de benefice SEO Google; maintenance inutile                                                 | Retirer `keywords` et se concentrer sur title, description, canonical, robots, OG/Twitter                   |
| F-007 | Moyenne | 404 management          | Page NotFound a du SEO mais pas de meta robots `noindex` dedie.                                                | `src/pages/NotFound.tsx:8-11` et pas de support robots dans `SEO.tsx`                                                                                                                                               | Risque d'indexation de soft-404 selon rendu et reponses serveur                                 | Ajouter support `robots` dans composant SEO et `noindex,follow` sur 404                                     |
| F-008 | Moyenne | Structured Data         | JSON-LD present uniquement sur articles, pas de schema global Organization/WebSite/Breadcrumb.                 | Recherche `application/ld+json` uniquement dans `src/pages/actualites/*`                                                                                                                                            | Couverture rich results limitee, signaux entite business incomplets                             | Ajouter schema global (Organization/WebSite) au layout + BreadcrumbList sur pages profondes                 |
| F-009 | Moyenne | Structured Data quality | Le logo schema pointe vers `https://etoilys.fr/logo.png` non present dans assets connus.                       | `src/pages/actualites/*` lignes `logo: ... /logo.png` + absence de `logo.png` dans `public/`                                                                                                                        | Validation schema partielle, baisse de fiabilite des donnees structurees                        | Aligner `logo.url` sur un asset reel public stable                                                          |
| F-010 | Moyenne | Performance / CWV       | Images importantes sans `width/height/loading/decoding/fetchpriority`.                                         | Aucune occurrence de `loading=`, `decoding=`, `width=`, `height=` dans `src/pages`/`src/components`; images hero dans `Home.tsx` et `PourquoiClasser.tsx`                                                           | Risque LCP/CLS/INP degrade, experience mobile impactee                                          | Definir dimensions, lazy-load hors above-the-fold, optimiser formats/poids, prioriser image hero            |
| F-011 | Basse   | Crawlability interne    | Le maillage interne est globalement crawlable via `<Link>` et `<a href>`.                                      | Nombreuses occurrences dans `Header.tsx`, `Footer.tsx`, `ArticleCard.tsx`, pages articles                                                                                                                           | Bon signal; faible risque actuel                                                                | Conserver ce pattern, ajouter breadcrumbs internes pour profondeur informative                              |
| F-012 | Basse   | SPA indexing risk       | Site en BrowserRouter + meta injectees JS; statut HTTP deep-link/non-200 non verifiable ici.                   | `src/App.tsx:1` (`BrowserRouter`) + perimetre repo-only                                                                                                                                                             | Potentiel ecart entre audit repo et comportement bot prod                                       | Verifier en prod: status codes, rendu source, inspection URL Search Console                                 |

## D) Plan d'action priorise (90 jours)

### Quick wins (0-2 semaines)

| Action                                                                 | Impact (1-5) | Confiance (1-5) | Effort (1-5) |  ICE | Dependances               | KPI de validation                                            |
| ---------------------------------------------------------------------- | -----------: | --------------: | -----------: | ---: | ------------------------- | ------------------------------------------------------------ |
| Etendre `<SEO>` a toutes les pages indexables (16/16 routes)           |            5 |               5 |            2 | 12.5 | Aucune                    | 100% routes avec title+description+canonical                 |
| Ajouter `robots.txt` et `sitemap.xml`                                  |            5 |               5 |            2 | 12.5 | Inventaire final des URLs | Fichiers servis en prod, sitemap detecte dans Search Console |
| Corriger favicon (`/vite.svg`) et ajouter `og-image.jpg` reel          |            4 |               5 |            1 | 20.0 | Choix assets finaux       | Favicon visible, cards sociales valides (test OpenGraph)     |
| Ajouter `robots` optionnel au composant SEO + `noindex,follow` sur 404 |            4 |               4 |            2 |  8.0 | Mise a jour composant SEO | 404 non indexee (inspection URL)                             |
| Retirer `meta keywords` du composant SEO                               |            2 |               5 |            1 | 10.0 | Aucune                    | Meta keywords absent sur toutes les pages                    |

### Moyen terme (3-6 semaines)

| Action                                                          | Impact (1-5) | Confiance (1-5) | Effort (1-5) | ICE | Dependances                          | KPI de validation                                       |
| --------------------------------------------------------------- | -----------: | --------------: | -----------: | --: | ------------------------------------ | ------------------------------------------------------- |
| Standardiser templates title/description par type de page       |            4 |               4 |            2 | 8.0 | Couverture SEO complete              | Longueur title/description conforme et non dupliquee    |
| Ajouter schema `Organization` + `WebSite` global                |            4 |               4 |            2 | 8.0 | Asset logo stable public             | Validation Rich Results sans erreur critique            |
| Ajouter `BreadcrumbList` sur pages de niveau >1                 |            3 |               4 |            2 | 6.0 | Pattern breadcrumbs UI               | Breadcrumbs eligibles + meilleure comprehension IA/SERP |
| Harmoniser JSON-LD articles (logo valide, dates, author, image) |            3 |               4 |            2 | 6.0 | Asset logo + conventions editoriales | 0 erreur schema sur pages articles                      |

### Structurant (7-12 semaines)

| Action                                                                                  | Impact (1-5) | Confiance (1-5) | Effort (1-5) | ICE | Dependances                            | KPI de validation                               |
| --------------------------------------------------------------------------------------- | -----------: | --------------: | -----------: | --: | -------------------------------------- | ----------------------------------------------- |
| Optimiser images critiques (LCP): formats, tailles, priorisation above-the-fold         |            5 |               4 |            3 | 6.7 | Inventaire assets + design constraints | LCP p75 mobile < 2.5s (CrUX/GSC)                |
| Ajouter attributs `width/height`, `loading`, `decoding`, `fetchpriority` selon contexte |            4 |               4 |            3 | 5.3 | Refacto composants image               | Reduction CLS (objectif < 0.1)                  |
| Etudier prerender/SSR selective pour pages SEO critiques (si necessaire)                |            4 |               3 |            4 | 3.0 | Decision architecture Vite/hosting     | Gain indexation initiale + rendu source enrichi |
| Integrer IndexNow (complement Bing) au workflow publication contenus                    |            2 |               3 |            2 | 3.0 | Endpoint/automatisation deploy         | URLs nouvelles recrawlees plus vite cote Bing   |

## E) Checklist de validation post-implementation

### Tests techniques

- [ ] Chaque route indexable rend `title`, `meta description`, `canonical` valides.
- [ ] `robots.txt` expose au moins `User-agent: *`, regles crawl voulues, et `Sitemap:`.
- [ ] `sitemap.xml` reference toutes les URLs canoniques indexables, sans 404.
- [ ] Page 404 rend `noindex,follow`.
- [ ] Favicon et image OG resolves (HTTP 200).
- [ ] Structured data validee (Google Rich Results Test / validator schema).

### Search Console / Indexation (a mesurer)

- [ ] Soumission sitemap dans GSC.
- [ ] Controle couverture indexation (Exclues vs Valides).
- [ ] Inspection URL de 5 pages critiques + 1 article.
- [ ] Controle snippets title/description reels en SERP.

### Monitoring performance / CWV (a mesurer)

- [ ] Baseline CWV avant/apres (LCP, INP, CLS).
- [ ] Suivi LCP mobile p75 et CLS p75.
- [ ] Verification poids des images hero et timings de chargement.

## Standards SEO 2026 utilises (sources)

- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- JavaScript SEO basics: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Build a sitemap: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Canonicalization: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Links crawlable: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Supported meta tags: https://developers.google.com/search/docs/crawling-indexing/special-tags
- Snippets metadata: https://developers.google.com/search/docs/appearance/snippet
- Structured data intro: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Page experience: https://developers.google.com/search/docs/appearance/page-experience
- Core Web Vitals: https://web.dev/articles/vitals
- Robots.txt creation: https://developers.google.com/crawling/docs/robots-txt/create-robots-txt
- IndexNow (Bing): https://www.bing.com/indexnow
