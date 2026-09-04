# Contrat de mesure OpenAI Ads (Pixel) — v2

Version du 4 septembre 2026 (v2 : ajout de la préservation temporaire de `oppref`, voir section dédiée). Ce contrat couvre exclusivement le Pixel de mesure OpenAI Ads (`src/utils/openAiAds.ts`). Il est indépendant du [contrat analytics PostHog](analytics-tracking-contract.md) : les deux systèmes ne partagent aucun état, aucune clé de storage et aucune finalité commune. Ce document ne constitue ni une validation juridique, ni une approbation ou certification de la CNIL.

## Périmètre

- Mesure Pixel-only. Aucune Conversions API (CAPI), aucun secret serveur, aucun changement backend/Starsmanager.
- Un seul événement de conversion mesuré : `lead_created`, déclenché uniquement par un succès réel de `POST /public/forms/classement` (formulaire de demande de classement).
- `oppref` (attribution de clic publicitaire) est capturé et conservé automatiquement par le SDK OpenAI (cookie first-party `__oppref`) une fois qu'il a pu le lire dans l'URL courante. Etoilys conserve temporairement une copie technique de cette valeur côté navigateur pour garantir qu'elle soit encore présente dans l'URL au moment où le SDK s'exécute, même après une navigation interne ou un rechargement de page — voir la section dédiée « Gestion de `oppref` par Etoilys » plus bas.

## Matrice des états

| État                                         | Script chargé                                | `oaiq("init", ...)`      | `oaiq("consent", ...)`                                   | `lead_created` possible                     |
| -------------------------------------------- | -------------------------------------------- | ------------------------ | -------------------------------------------------------- | ------------------------------------------- |
| Aucun choix publicitaire                     | Non                                          | Non                      | Non                                                      | Non                                         |
| Acceptation                                  | Oui                                          | Oui, une seule fois      | `true` envoyé avant `init`, puis à chaque ré-acceptation | Oui                                         |
| Refus explicite                              | Non (si jamais accepté avant) ou déjà chargé | Non (ou déjà fait)       | `false` envoyé si le SDK existe déjà                     | Non                                         |
| Retrait après acceptation                    | Reste chargé (pas de déchargement)           | Déjà fait, jamais rejoué | `false` envoyé                                           | Non                                         |
| Ré-acceptation après un refus (même session) | Déjà chargé, pas réinjecté                   | Jamais rejoué            | `true` renvoyé seul                                      | Oui                                         |
| Expiration TTL (6 mois)                      | Selon dernier état                           | —                        | —                                                        | Non tant qu'un nouveau choix n'est pas fait |

L'idempotence du chargement/`init` et la transition de l'état `consent` sont deux mécanismes volontairement découplés (voir `src/utils/openAiAds.ts`) : le flag interne qui empêche une seconde injection du SDK n'empêche jamais un futur appel `consent(true)`/`consent(false)`.

## Choix locaux

- `etoilys_advertising_consent` : `accepted` ou `refused` ;
- `etoilys_advertising_consent_updated_at` : date du choix, validité maximale de six mois ;
- `etoilys_ads_debug` : active `debug: true` à l'init, réglé via `?etoilys_ads_debug=1`. Totalement indépendant du flag `etoilys_analytics_debug` de PostHog ;
- `etoilys_openai_ads_oppref` / `etoilys_openai_ads_oppref_captured_at` (`sessionStorage`, pas `localStorage`) : copie technique temporaire de `oppref`, voir section dédiée ci-dessous.

`etoilys_advertising_consent` n'existait pas avant l'introduction de cette finalité : elle est absente pour tous les utilisateurs qui n'ont jamais vu la nouvelle bannière, y compris ceux ayant déjà accepté PostHog. Le code ne lit jamais `etoilys_analytics_consent` pour déterminer ce consentement — aucun opt-in publicitaire implicite n'est possible.

La bannière de consentement se réaffiche tant que l'une des deux finalités (analytics **ou** publicitaire) est indéfinie ou expirée ; ce n'est pas un mécanisme de version dédié, seulement une condition sur les deux valeurs de consentement déjà nécessaires par ailleurs.

## Gestion de `oppref` par Etoilys

**Contexte** : `oppref` est l'identifiant de clic publicitaire OpenAI (équivalent de `gclid`/`fbclid`). Le Help Center officiel OpenAI recommande explicitement de le préserver à travers les redirections et la navigation depuis la landing page. Sur ce site, un clic publicitaire arrive sur une landing (ex. `/classement-meuble-tourisme-dordogne?oppref=XXX`), mais le formulaire de conversion se trouve sur une autre page (`/demande-classement`), atteinte par une navigation interne React Router qui ne propage pas la query string. Sans action côté site, `oppref` serait donc perdu si le consentement publicitaire n'est pas déjà accordé au moment de l'atterrissage.

**Ce qu'OpenAI documente** : le Pixel capture `oppref` depuis l'URL au moment de son exécution et le stocke dans son propre cookie first-party `__oppref` pour le réutiliser sur les pages suivantes. Aucune API JavaScript documentée (`oaiq("init", ...)` / `oaiq("measure", ...)`) ne permet de lui fournir cette valeur autrement qu'en la laissant présente dans l'URL courante. Le moment exact de cette lecture par rapport au chargement du script n'est pas documenté.

**Ce qu'Etoilys fait** :

1. Dès le tout premier chargement réel de page (`initOpenAiAdsPixelIfConsented()`, appelée une fois par `main.tsx`), si l'URL courante contient `oppref`, sa valeur est copiée dans `sessionStorage` (`etoilys_openai_ads_oppref` + un timestamp `etoilys_openai_ads_oppref_captured_at`), **avant même de savoir si l'utilisateur va consentir**. Aucun décodage, aucune interprétation : la valeur est traitée comme une chaîne opaque.
2. Une nouvelle valeur présente dans l'URL écrase toujours l'ancienne (dernier clic publicitaire gagnant).
3. Au moment où le Pixel s'initialise réellement pour la première fois (à l'acceptation du consentement, ou au chargement d'une page si le consentement était déjà acquis) : si `oppref` est déjà dans l'URL courante, rien n'est fait. Sinon, si une valeur valide (non expirée) existe dans `sessionStorage`, elle est réinjectée **transitoirement** dans l'URL via `window.history.replaceState` (jamais `pushState` — aucune entrée d'historique créée, aucune interférence avec React Router) juste avant l'insertion du tag `<script>` du SDK.
4. Au `load` du script (succès) : si une valeur était en attente, `sessionStorage` est purgé ; si Etoilys avait lui-même réinjecté `oppref` dans l'URL, ce paramètre en est retiré (l'URL retrouve son état sans `oppref`, sans jamais toucher au pathname, au hash ni aux autres paramètres).
5. Au `error` du script (échec de chargement) : l'URL est nettoyée de la même façon, mais `sessionStorage` est **conservé** — cela sert principalement à permettre une nouvelle tentative après un véritable rechargement de page, qui réexécute `main.tsx` et relance l'initialisation depuis zéro. Un simple retrait puis ré-acceptation du consentement dans la même session ne relance pas l'injection du script, ce cas n'étant pas géré pour l'instant (voir « Limites connues »).
6. Aucun timeout de secours ne nettoie l'URL automatiquement : si le script ne déclenche jamais ni `load` ni `error`, `oppref` reste visible dans l'URL — préféré à un retrait prématuré qui romprait l'attribution.

**Pourquoi `sessionStorage` et pas `localStorage`/cookie maison** : `sessionStorage` n'est jamais envoyé au serveur, reste limité à l'onglet courant, survit aux navigations internes et à un rechargement de page dans le même onglet, et disparaît naturellement à la fermeture de l'onglet — sans introduire de cookie d'attribution maison alors qu'OpenAI crée déjà le sien (`__oppref`) une fois le Pixel chargé.

**TTL — 30 jours** (`etoilys_openai_ads_oppref_captured_at`, vérifié paresseusement à la lecture) : `oppref` relève de l'attribution click-through, pour laquelle OpenAI utilise la fenêtre de clic configurée dans Ads Manager — 30 jours pour la source « Etoilys | Site web ». Le TTL local s'aligne sur cette fenêtre plutôt que sur la fenêtre view-through (1 jour), non pertinente pour un identifiant de clic. En pratique, `sessionStorage` est de toute façon borné par la durée de vie de l'onglet, largement inférieure à 30 jours dans l'immense majorité des cas.

**Ce qu'Etoilys ne fait jamais** : décoder ou interpréter `oppref`, le logger, le transmettre à PostHog, le transmettre au backend, l'ajouter au payload `lead_created`, ou construire un mécanisme de redirection/tracking serveur autour de lui.

**Limites connues** :

- Le moment exact où le SDK OpenAI lit l'URL n'est pas garanti par la documentation ; le nettoyage sur l'événement `load` du script est une hypothèse raisonnable (comportement standard de ce type de SDK à file d'attente), pas une garantie contractuelle d'OpenAI.
- Entre l'injection et le `load`, `oppref` est visible dans la barre d'adresse ; un clic sur un lien externe pendant cette fenêtre (typiquement quelques centaines de ms) pourrait exceptionnellement le transmettre dans un en-tête `Referer`.
- Un échec de chargement du script (bloqueur de publicité, réseau) conserve `sessionStorage` pour permettre une nouvelle tentative après un **rechargement complet de la page** ; cela ne couvre pas un simple retrait puis ré-acceptation du consentement dans la même session, qui ne relance pas l'injection du script tant que le Pixel a déjà été initialisé une première fois.

## Événement mesuré

```js
oaiq('measure', 'lead_created', { type: 'customer_action' });
```

- Déclenché dans `src/components/forms/DemandeClassementForm.tsx`, immédiatement après `trackFormSubmitSucceeded('demande_classement')`, uniquement si `response.success === true` et `response.data.success === true`.
- Le helper `trackLeadCreatedConversion()` ne reçoit aucun paramètre de l'appelant : il est structurellement impossible de lui faire transporter une donnée de formulaire.
- Protégé par un `try/catch` interne au helper et par un second `try/catch` au point d'appel dans le formulaire : aucune défaillance du SDK OpenAI Ads ne peut empêcher l'affichage du succès métier ni la réinitialisation du formulaire.

## Portée de la garantie « aucune PII »

Le code du site n'envoie explicitement aucun nom, e-mail, téléphone, adresse ou contenu de message à OpenAI Ads dans le payload `lead_created`. Cette garantie porte sur ce que le code du site transmet explicitement, pas sur ce que le SDK peut faire de son côté. Automatic Advanced Matching (AAM), si disponible et activé pour la source « Etoilys | Site web » dans Ads Manager, est un réglage géré par OpenAI, indépendant de ce repo, laissé tel quel sur décision produit pour améliorer la qualité du matching des conversions — s'il est actif, le SDK peut détecter certaines informations client prises en charge directement sur la page et les transmettre séparément à OpenAI sous forme hachée (SHA-256), indépendamment du contenu de l'événement envoyé par le site. Ce document ne prétend donc pas qu'aucune donnée hachée ne peut jamais être ajoutée par le SDK ; seule l'absence de donnée brute (non hachée) explicitement envoyée par le code du site est garantie.

## Ce qui n'est pas fait (hors scope)

- Conversions API, déduplication Pixel+CAPI, `event_id`.
- Advanced matching manuel (`user: { email_sha256, ... }`).
- `opt_out` sur l'événement `lead_created` (la personnalisation utilisateur future n'est pas désactivée).
- Tout décodage, interprétation, log ou transfert de `oppref` vers PostHog, le backend, ou tout autre système que le SDK OpenAI lui-même (la préservation temporaire côté navigateur décrite ci-dessus n'est pas un transfert : la valeur ne quitte jamais le navigateur de l'utilisateur avant que le SDK OpenAI ne la lise).
- Toute modification du contrat de formulaire `POST /public/forms/classement` ou du backend Starsmanager.

## Interaction avec PostHog

`trackFormSubmitSucceeded('demande_classement')` (PostHog, [contrat v3](analytics-tracking-contract.md)) et `trackLeadCreatedConversion()` (OpenAI Ads) sont deux appels indépendants au même success boundary. Ils ne partagent ni état, ni storage, ni logique de consentement. `openAiAds.ts` n'importe rien de `analytics.ts`/`acquisition.ts` et réciproquement. Les propriétés envoyées à PostHog reposent uniquement sur `location.pathname` (jamais `location.search`), donc `oppref` ne peut structurellement pas atteindre un événement PostHog, y compris pendant la fenêtre où il est temporairement présent dans l'URL. La comparaison prévue entre les deux systèmes se fait uniquement au niveau des tableaux de bord respectifs (`lead_created` dans Ads Manager vs `form_submit_succeeded` + `acquisition_source=chatgpt_ads` dans PostHog), jamais en fusionnant les deux mesures.

## Runbook manuel de validation (Ads Manager)

La campagne reste en pause tant que ce runbook n'a pas été exécuté et validé sur un environnement de preview.

1. Déployer sur une preview Vercel avec `VITE_OPENAI_ADS_PIXEL_ID` renseigné.
2. Storage vide, DevTools réseau/console ouverts → vérifier l'absence de tout script `bzrcdn.openai.com` et de `window.oaiq`.
3. Accepter uniquement « Analytics détaillés » → toujours absent.
4. Atterrir avec `?oppref=test123` sur `/classement-meuble-tourisme-dordogne`, naviguer vers `/demande-classement` **sans** accepter la mesure publicitaire, puis accepter sur le formulaire → vérifier dans l'onglet Réseau que l'URL au moment du chargement du script SDK contient bien `oppref=test123`, et qu'elle en est retirée juste après (`?etoilys_ads_debug=1` pour voir `consent(true)` puis `init` en console).
5. Répéter le point 4 puis recharger la page (F5) juste après avoir quitté la landing, avant d'accepter → vérifier que `oppref` est toujours réinjecté à l'acceptation malgré le rechargement.
6. Soumettre une demande de classement de test valide → message de succès.
7. Onglet Réseau : payload `lead_created`/`customer_action`, aucune donnée brute de formulaire (des champs hachés peuvent apparaître si Automatic Advanced Matching est actif — attendu, pas une anomalie).
8. Ads Manager → Conversions → flux d'événements → vérifier l'arrivée de `lead_created` avec une attribution de clic cohérente.
9. Soumission invalide → aucun `lead_created`. Storage vidé, refus explicite, soumission réussie → aucun `lead_created`.
10. Vérifier en parallèle que PostHog reçoit toujours `form_submit_succeeded` avec `acquisition_source=chatgpt_ads`.
11. Uniquement après validation complète et captures datées → lever la pause de la campagne côté Ads Manager.
