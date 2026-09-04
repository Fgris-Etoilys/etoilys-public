# Contrat de mesure OpenAI Ads (Pixel) — v1

Version du 4 septembre 2026. Ce contrat couvre exclusivement le Pixel de mesure OpenAI Ads (`src/utils/openAiAds.ts`). Il est indépendant du [contrat analytics PostHog](analytics-tracking-contract.md) : les deux systèmes ne partagent aucun état, aucune clé de storage et aucune finalité commune. Ce document ne constitue ni une validation juridique, ni une approbation ou certification de la CNIL.

## Périmètre

- Mesure Pixel-only. Aucune Conversions API (CAPI), aucun secret serveur, aucun changement backend/Starsmanager.
- Un seul événement de conversion mesuré : `lead_created`, déclenché uniquement par un succès réel de `POST /public/forms/classement` (formulaire de demande de classement).
- `oppref` (attribution de clic publicitaire) est capturé et conservé automatiquement par le SDK OpenAI (cookie first-party `__oppref`) ; le site n'y touche pas.

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
- `etoilys_advertising_consent_updated_at` : date du choix, validité maximale de six mois (identique au TTL PostHog, mais clé et logique entièrement indépendantes) ;
- `etoilys_ads_debug` : active `debug: true` à l'init, réglé via `?etoilys_ads_debug=1`. Totalement indépendant du flag `etoilys_analytics_debug` de PostHog.

`etoilys_advertising_consent` n'existait pas avant l'introduction de cette finalité : elle est absente pour tous les utilisateurs qui n'ont jamais vu la nouvelle bannière, y compris ceux ayant déjà accepté PostHog. Le code ne lit jamais `etoilys_analytics_consent` pour déterminer ce consentement — aucun opt-in publicitaire implicite n'est possible.

La bannière de consentement se réaffiche tant que l'une des deux finalités (analytics **ou** publicitaire) est indéfinie ou expirée ; ce n'est pas un mécanisme de version dédié, seulement une condition sur les deux valeurs de consentement déjà nécessaires par ailleurs.

## Événement mesuré

```js
oaiq('measure', 'lead_created', { type: 'customer_action' });
```

- Déclenché dans `src/components/forms/DemandeClassementForm.tsx`, immédiatement après `trackFormSubmitSucceeded('demande_classement')`, uniquement si `response.success === true` et `response.data.success === true`.
- Le helper `trackLeadCreatedConversion()` ne reçoit aucun paramètre de l'appelant : il est structurellement impossible de lui faire transporter une donnée de formulaire.
- Protégé par un `try/catch` interne au helper et par un second `try/catch` au point d'appel dans le formulaire : aucune défaillance du SDK OpenAI Ads ne peut empêcher l'affichage du succès métier ni la réinitialisation du formulaire.

## Portée de la garantie « aucune PII »

Le code du site n'envoie explicitement aucun nom, e-mail, téléphone, adresse ou contenu de message à OpenAI Ads. Cette garantie porte sur le code du site uniquement. Automatic Advanced Matching, si disponible et activé pour la source « Etoilys | Site web » dans Ads Manager, est un réglage géré par OpenAI, indépendant de ce repo, laissé tel quel sur décision produit pour améliorer la qualité du matching des conversions.

## Ce qui n'est pas fait (hors scope)

- Conversions API, déduplication Pixel+CAPI, `event_id`.
- Advanced matching manuel (`user: { email_sha256, ... }`).
- `opt_out` sur l'événement `lead_created` (la personnalisation utilisateur future n'est pas désactivée).
- Tout parsing, log ou transfert de `oppref` par le site.
- Toute modification du contrat de formulaire `POST /public/forms/classement` ou du backend Starsmanager.

## Interaction avec PostHog

`trackFormSubmitSucceeded('demande_classement')` (PostHog, [contrat v3](analytics-tracking-contract.md)) et `trackLeadCreatedConversion()` (OpenAI Ads) sont deux appels indépendants au même success boundary. Ils ne partagent ni état, ni storage, ni logique de consentement. La comparaison prévue entre les deux systèmes se fait uniquement au niveau des tableaux de bord respectifs (`lead_created` dans Ads Manager vs `form_submit_succeeded` + `acquisition_source=chatgpt_ads` dans PostHog), jamais en fusionnant les deux mesures.
