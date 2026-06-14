# Codex prompt — Create a new Etoilys Actualités article

You are working on the public Etoilys website.

Your task is to create and integrate a new article in the **Actualités** section.

Do not just write article text. Modify the necessary project files and reuse the existing article architecture, components, metadata system, SEO system, structured data system, and Actualités listing.

## Project context

Follow the current project conventions.

Important repo facts:

- Frontend: React 19, TypeScript strict, Vite 7.
- Routing: React Router 7 in `src/AppRoutes.tsx`.
- Articles are in `src/pages/actualites`.
- Article list metadata is in `src/content/actualitesArticles.ts`.
- Article structured data is in `src/content/articleStructuredData.ts`.
- SEO routes are centralized in `src/content/seoRoutes.ts`.
- Do not inject SEO directly in article pages.
- Use the existing `<SEO />` system through the centralized route metadata.
- Use `ArticleStructuredData` and the existing structured data pattern.
- Reuse existing UI/article components and styling.
- Keep the page consistent with the existing Actualités articles.
- If a cover image is technically required and no relevant asset exists, use the existing fallback pattern rather than inventing a decorative image.
- Do not add a generic decorative image just to “make it look like a blog”.

Before coding:

1. Inspect existing articles in `src/pages/actualites`.
2. Inspect `src/content/actualitesArticles.ts`.
3. Inspect `src/content/articleStructuredData.ts`.
4. Inspect `src/content/seoRoutes.ts`.
5. Inspect the Actualités list page.
6. Reuse the existing structure and naming conventions.

At the end, provide:

- files modified;
- article route created;
- SEO/structured data/listing updates;
- checks run or not run.

## Editorial guide

Follow `Etoilys_guide_redaction_articles_actualites_v3.md` strictly.

Core rules:

- Write in clear, natural French.
- Target owners of furnished tourist rentals, not lawyers or public officials.
- Be concrete, useful, and practical.
- Answer the main question immediately.
- Date the rules and changes.
- Use official sources for all legal, administrative, or regulatory claims.
- Avoid clickbait.
- Avoid unexplained jargon.
- Avoid cold legalistic phrasing.
- Avoid meta phrases such as:
  - `Nous allons voir dans cet article que...`
  - `Il convient de noter que...`
  - `Le lecteur doit ressortir en ayant compris que...`

- Use direct and affirmative wording when the source allows it.
- Do not soften a known rule with unnecessary wording such as `peut`, `pourrait`, `peut-être`, `il est possible que`, unless there is a real uncertainty.
- When there is a real deployment nuance, explain it clearly instead of pretending everything is already operational everywhere.
- Define technical terms the first time they appear.

Important vocabulary rule:

- Do not write `EPCI` without explaining it.
- Prefer: `les communes et les intercommunalités, c’est-à-dire les regroupements de communes compétents sur certains sujets comme le tourisme`.
- After this first definition, you may use `intercommunalités`.
- Avoid repeating `établissement public de coopération intercommunale`, unless legally necessary.

## Article to create

### H1

`Airbnb, Booking, Abritel : quelles données vont désormais remonter aux communes ?`

### Meta title

`Airbnb, Booking, Abritel : données transmises aux communes | Etoilys`

### Meta description

`API Meublés, plateformes, numéro d’enregistrement, jours loués : voici quelles données sont transmises aux communes et ce que cela change.`

### Slug

`airbnb-booking-abritel-donnees-communes-api-meubles`

### URL

`/actualites/airbnb-booking-abritel-donnees-communes-api-meubles`

### Published date

Use today’s project date if consistent with the existing publication workflow. If the project expects fixed article dates, use `2026-06-14`.

### Updated date

Same as published date at creation.

### Author

Use the existing project author convention. If existing recent articles use `Florian Grisorio`, use `Florian Grisorio`. Do not create a new author convention.

### Type

Use the same article structured data type as the existing Actualités articles unless the existing pattern clearly distinguishes news from evergreen. Default to `BlogPosting` if that is the current project convention.

### Category

`actualites`

### Suggested tags

Use tags only if the existing system supports them:

- `airbnb`
- `booking`
- `abritel`
- `api meubles`
- `meublé de tourisme`
- `numéro d’enregistrement`
- `réglementation`

## Search intent

The article must answer these questions clearly:

- What data do Airbnb, Booking, Abritel and other platforms transmit?
- Who receives these data?
- What is API Meublés?
- Are all communes receiving everything automatically?
- Does this include revenue, payments, or tourist tax?
- What changes for undeclared or incorrectly declared furnished tourist rentals?
- What should owners check now?

This article is a practical regulatory explainer, not a fiscal article and not a duplicate of the existing API Meublés article.

## Editorial angle

The article must explain that the real change is not that platforms suddenly transmit “everything” to “everyone”.

The real change is that API Meublés creates a centralized system allowing communes and intercommunalities that use the system to access activity data transmitted by rental intermediaries.

The article must be concrete:

- listing number;
- precise address;
- listing URLs;
- number of rental days;
- platform-by-platform data;
- consistency checks;
- control of the 120-day limit or locally lowered limit for main residences.

## Reuse and avoid duplication

There is already an article about API Meublés:
`/actualites/api-meubles-declaration-meuble-tourisme`

Do not duplicate it.

This new article must focus on:

- platform data;
- data transmitted to public authorities;
- what communes can check;
- what this changes for owners using Airbnb, Booking, Abritel, or similar platforms.

Link naturally to the existing API Meublés article if useful.

## Internal links to include

Use the real routes in the project.

Required internal links:

1. `/faq`
   - CTA priority 1
   - anchor suggestion: `consulter la FAQ Etoilys`

2. `/simulateur-fiscal-classement`
   - CTA priority 2
   - anchor suggestion: `utiliser le simulateur fiscal classement 2026`

Recommended contextual internal link: 3. `/actualites/api-meubles-declaration-meuble-tourisme`

- anchor suggestion: `comprendre le fonctionnement de l’API Meublés`

Only link to `/demande-classement` if it appears naturally in an existing CTA component pattern. Do not force a commercial CTA. This article is mainly about compliance and data transmission, not directly about requesting a classification.

Do not add a dedicated section about the classification of furnished tourist rentals. The classification does not materially change the data transmission discussed in this article.

## Sources to use and display in a final “Sources officielles” section

Use these official sources. Do not use press or private blogs for sensitive claims.

1. DGE — API Meublés, guichet unique de centralisation des données d’activité des intermédiaires
   https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/lapi-meubles-guichet-unique-de-centralisation

2. Légifrance — article L. 324-2-1 du code du tourisme
   https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000050650350/2026-05-21

3. Légifrance — article R. 324-2-1 du code du tourisme
   https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000053704515/2026-05-19

4. Légifrance — décret n° 2026-196 du 19 mars 2026
   https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053703509

5. Légifrance — décret n° 2026-197 du 19 mars 2026
   https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053703549

6. Service-Public — Mettre en location sa résidence principale
   https://www.service-public.fr/particuliers/vosdroits/F33175

7. Service-Public — Mettre en location sa résidence secondaire
   https://www.service-public.fr/particuliers/vosdroits/F2043

8. economie.gouv.fr — Économie collaborative : comment déclarer vos revenus ?
   https://www.economie.gouv.fr/particuliers/impots-et-fiscalite/gerer-mon-impot-sur-le-revenu/economie-collaborative-comment-declarer-vos-revenus

Use source 8 only to distinguish tax reporting from commune-level API Meublés data. Do not turn this article into a fiscal article.

## Critical legal and editorial cautions

Do not write:

- that communes receive all data automatically everywhere;
- that API Meublés lets communes see rental income or payments;
- that API Meublés is the same thing as tax reporting by platforms;
- that API Meublés is the same thing as tourist tax collection;
- that the classification of a furnished tourist rental avoids data transmission;
- that the classification allows owners to exceed rental duration limits;
- that the article is giving personalized legal or tax advice;
- that all operational details are already fully deployed everywhere if the DGE still describes a phased rollout.

Write clearly:

- communes and intercommunalities must use/request access to the system;
- the national framework exists;
- the DGE describes phased deployment: beta in March 2026 and final version expected in the second half of 2026;
- in the final version, owners will have to request a new national registration number for each furnished tourist rental;
- old local registration numbers will remain usable during a transitional period, then become invalid;
- API Meublés does not track tourist tax payments; the DGE distinguishes this from FARITAS, the experimental tourist tax reporting system running until the end of 2026.

## Required article structure

Keep the structure below. Do not add extra H2 sections unless absolutely necessary.

### H1

`Airbnb, Booking, Abritel : quelles données vont désormais remonter aux communes ?`

### Visible metadata line

Follow the existing article pattern.

It must include:

- publication date;
- author;
- reading time.

### Chapô

Use this content, but adapt to existing article style:

`Depuis 2026, les communes disposent d’un nouvel outil pour contrôler les meublés de tourisme loués via des plateformes comme Airbnb, Booking ou Abritel : l’API Meublés. Concrètement, lorsqu’un logement est loué via une plateforme, l’intermédiaire transmet des données d’activité comme le numéro d’enregistrement, l’adresse du logement, l’URL de l’annonce et le nombre de jours loués. Toutes les communes ne reçoivent pas tout “par magie”, mais le contrôle devient beaucoup plus simple pour celles qui utilisent le dispositif.`

You may slightly rephrase, but keep the meaning and the affirmative wording.

### Bloc “À retenir”

Use 4 to 5 bullets maximum.

Required bullets:

- `Lorsqu’un meublé est loué via Airbnb, Booking, Abritel ou une autre plateforme, l’intermédiaire transmet des données d’activité dans le cadre prévu par l’API Meublés, lorsque la commune ou l’intercommunalité utilise le dispositif.`
- `Les données principales concernent le numéro d’enregistrement, l’adresse du logement, les URL d’annonces et le nombre de jours loués.`
- `Les communes et les intercommunalités, c’est-à-dire les regroupements de communes compétents sur certains sujets comme le tourisme, utilisent ces données pour contrôler les obligations applicables aux meublés.`
- `L’API Meublés rend plus visibles certaines incohérences : faux numéro, ancien numéro devenu invalide, adresse incohérente ou dépassement du plafond de jours pour une résidence principale.`
- `L’API Meublés ne sert pas au suivi des paiements de taxe de séjour, qui relève d’un autre dispositif.`

You may polish the wording, but do not weaken it with unnecessary “peut / pourrait”.

### H2 1 — Pourquoi les données des plateformes remontent-elles aux communes ?

Explain:

- rental platforms made local control more complex;
- before API Meublés, each commune often had to exchange separately with each intermediary;
- the DGE describes API Meublés as a single centralizing system for activity data from rental intermediaries;
- the purpose is to help communes and intercommunalities control local obligations and understand rental activity.

Keep it practical. Do not write a full institutional history.

### H2 2 — Quelles plateformes sont concernées ?

Explain:

- the mechanism is not limited to Airbnb;
- it covers rental intermediaries for furnished tourist rentals;
- Airbnb, Booking and Abritel are obvious examples, but the legal mechanism is broader;
- avoid implying that direct bookings through the owner’s own website are platform-transmitted data; handle direct bookings separately if mentioned.

Concrete wording to include or adapt:

`Le texte ne vise pas seulement Airbnb. Il concerne plus largement les intermédiaires qui prêtent leur concours à la mise en location d’un meublé de tourisme. En pratique, cela vise les grandes plateformes de réservation, mais aussi tout acteur entrant dans ce rôle d’intermédiaire.`

### H2 3 — Quelles données sont transmises ?

This is the core section. Include a simple, mobile-friendly table.

Required table columns:

- `Donnée`
- `Exemple concret`
- `Pourquoi c’est important`

Required rows:

1. `Numéro d’enregistrement`
   - example: `Le numéro affiché sur l’annonce`
   - importance: `Vérifier que le logement est bien déclaré`

2. `URL de l’annonce`
   - example: `Lien Airbnb, Booking, Abritel`
   - importance: `Relier une annonce en ligne à un logement`

3. `Adresse précise`
   - example: `Adresse du meublé`
   - importance: `Identifier le bien concerné`

4. `Nombre de jours loués`
   - example: `Jours loués via chaque plateforme`
   - importance: `Contrôler les plafonds de location`

5. `Données du loueur, si connues`
   - example: `Nom, SIRET, email, adresse`
   - importance: `Identifier le loueur ou le déclarant`

6. `Statut du logement, si connu`
   - example: `Résidence principale ou non`
   - importance: `Vérifier les règles de durée applicables`

Do not include a row about classification. It distracts from the article’s main point.

After the table, add 2 or 3 short paragraphs explaining:

- some data are mandatory in the transmission;
- other data are transmitted if the intermediary knows them;
- the goal is to make the link between a listing, a property, a registration number and rental activity.

### H2 4 — Est-ce que les communes verront aussi vos revenus, vos paiements ou la taxe de séjour ?

Answer clearly.

Required message:

- API Meublés is not a tool for tracking rental income;
- API Meublés is not a payment tracking tool;
- API Meublés is not the tourist tax collection system;
- the DGE distinguishes API Meublés from FARITAS, the experimental system for digital tourist tax reporting until the end of 2026;
- platforms may transmit tax-related information to tax authorities under other rules, but this is separate from the data transmitted to communes through API Meublés.

Suggested wording:

`Autrement dit, API Meublés sert d’abord à contrôler l’existence, l’adresse, les annonces et l’activité déclarée des meublés de tourisme. Ce n’est pas l’outil qui calcule votre impôt, ni celui qui suit le paiement de votre taxe de séjour.`

### H2 5 — Depuis quand et à quel rythme les données sont-elles transmises ?

Explain:

- the decrees of 19 March 2026 created the API Meublés framework;
- the DGE describes beta deployment in early March 2026 and a final version expected in the second half of 2026;
- in the final version, owners will need to register their furnished tourist rentals through the national teleservice;
- all owners will have to request a new national registration number for each furnished tourist rental;
- old local registration numbers will remain usable during a transitional period, then become invalid;
- platform/intermediary transmissions are monthly for most intermediaries and quarterly for certain small structures under the regulatory conditions.

Use affirmative wording for the NER requirement:

- Write: `Les loueurs devront demander un nouveau numéro d’enregistrement national.`
- Do not write: `Les loueurs pourraient devoir demander...`
- Do not write: `si un nouveau numéro devient obligatoire...`

Be careful on timing:

- The principle is clear.
- Fine operational details of final rollout may still depend on DGE deployment information.
- Phrase the timing without inventing an exact launch date if the source does not provide one.

### H2 6 — Ce que cela change pour les logements non déclarés ou mal déclarés

This section is required.

Goal:
Explain, without hysteria, that fraudulent or sloppy practices become easier to detect.

Tone:
Firm, factual, not dramatic. No insults in the article.

Explain:

- API Meublés does not create all obligations; many already existed;
- what changes is the ability to match and compare data;
- communes can more easily compare registration number, address, online listing, rental days, main residence status, and platform-by-platform data;
- using several platforms to spread rental days becomes less invisible;
- false or inconsistent registration information becomes riskier;
- old local numbers will become invalid after the transition to the national registration number.

Include this idea, polished:

`Le changement le plus concret concerne les logements non déclarés, mal déclarés ou déclarés avec des informations incohérentes. Avant, une commune devait souvent demander des informations plateforme par plateforme. Avec API Meublés, les données d’activité sont centralisées autour du numéro d’enregistrement. Cela rend plus visibles les annonces sans numéro là où il est obligatoire, les faux numéros, les anciens numéros devenus invalides, les adresses incohérentes ou les dépassements de durée pour les résidences principales.`

Mention sanctions only soberly:

- If you mention sanctions, cite the relevant official source.
- Do not turn the article into a sanctions article.
- Keep the focus on practical compliance.

### H2 7 — Ce que cela change concrètement pour un propriétaire

Use a checklist.

Required checklist:

- Vérifier que le numéro d’enregistrement affiché sur chaque annonce est correct.
- Vérifier que l’adresse du logement est cohérente entre la déclaration, les plateformes et les annonces.
- Demander le nouveau NER national quand la version finale du téléservice sera ouverte.
- Remplacer l’ancien numéro pendant la période transitoire, avant qu’il ne devienne invalide.
- Suivre le nombre de jours loués, surtout pour une résidence principale.
- Ne pas supposer que “si la plateforme accepte l’annonce, tout est conforme”.
- Garder aussi une trace des locations en direct, car la commune peut demander au loueur le nombre de jours loués.

Do not add:

- a section about classification;
- a section called “Les erreurs fréquentes à éviter”.

### Conclusion

Use the meaning below, polished:

`Le changement n’est pas que les plateformes transmettent “plus de données pour le plaisir”. Le vrai changement, c’est que les communes disposent d’un outil plus simple pour rapprocher les annonces, les numéros d’enregistrement, les adresses et les jours loués. Pour un propriétaire, la bonne réaction est donc de vérifier la cohérence de ses annonces, de suivre ses jours de location et de rester au clair sur les obligations locales.`

### Final CTA

Use a discreet CTA block consistent with the current article design.

CTA order:

1. FAQ first:
   - label: `Consulter la FAQ`
   - route: `/faq`

2. Fiscal simulator second:
   - label: `Utiliser le simulateur fiscal classement 2026`
   - route: `/simulateur-fiscal-classement`

Do not use “Demander mon classement” as the primary CTA for this article.

## Sources section

Add a final section titled:

`Sources officielles`

List the official sources used. Keep source labels readable for humans.

Do not cite press articles or private blogs.

## Technical tasks

1. Create the article page using the existing article pattern in `src/pages/actualites`.
2. Add the article route in `src/AppRoutes.tsx` if needed by the current routing pattern.
3. Add the article metadata to `src/content/actualitesArticles.ts`.
4. Add SEO route metadata to `src/content/seoRoutes.ts`.
5. Add structured data to `src/content/articleStructuredData.ts`.
6. Add or update any required article slug mapping if the project uses one.
7. Ensure the article appears on `/actualites`.
8. Ensure links are real `<a href>` / router links as used by the existing codebase.
9. Ensure the article uses the current layout and responsive styles.
10. Do not manually inject JSON-LD in the page.
11. Do not manually inject SEO tags in the page.
12. Do not create unnecessary new components.
13. Reuse existing table/card/CTA components if available.
14. Keep TypeScript strict clean.
15. Keep lint/build constraints in mind.

## Checks to run

Run these if available and not too expensive:

- `npm run typecheck`
- `npm run lint`
- `npm run test:run`
- `npm run build`

If you do not run one of them, say why.

## Final response expected

After implementation, report:

- created article URL;
- files modified;
- key editorial choices;
- sources included;
- checks run and results;
- any issue or uncertainty.
