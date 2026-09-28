# Contrat de tracking analytics — v3.2

Version du 28 septembre 2026.

## Mise à jour lot 2 — acquisition et événements consentis

Le lot 2 conserve le plan d'événements existant et n'ajoute aucune collecte avant consentement. Après accord analytics, le contexte d'acquisition assaini est associé à l'ID de session exposé par PostHog avec un stockage local minimal `{ sessionId, acquisition }` : même ID, même acquisition ; nouvel ID, remplacement. Il n'y a pas de TTL, timer ou logique cross-tab maison.

Les événements consentis capturent leur contexte de page avant tout chargement asynchrone du SDK afin que `source_path`, `page_type` et `event_locale` décrivent la page d'interaction réelle. Une sauvegarde inchangée de préférences ne crée pas de pageview ; le pageview de transition n'est admis que lors d'un passage effectif vers l'accord analytics.

Ce contrat sépare strictement la mesure minimale sans cookie après un refus explicite et les analytics détaillés après consentement. Il ne constitue ni une validation juridique, ni une approbation ou certification de la CNIL.

## Mise à jour lot 1 — consentement

Le recueil du consentement repose sur une source de vérité commune côté navigateur, partagée avec la mesure publicitaire. Le lot 1 conserve les clés historiques existantes plutôt que d'introduire un nouveau format de stockage :

- `etoilys_analytics_consent` et `etoilys_analytics_consent_updated_at` pour PostHog ;
- `etoilys_advertising_consent` et `etoilys_advertising_consent_updated_at` pour OpenAI Ads ;
- `etoilys_cookieless_audience_opt_out` pour l'opposition à une éventuelle mesure minimale.

Les choix restent valables 183 jours. Si l'accès au stockage navigateur échoue, le choix utilisateur est appliqué en mémoire pour le document courant afin qu'un refus explicite ne soit pas ignoré au profit d'une ancienne valeur persistée. Il pourra être redemandé lors d'un rechargement si la persistance a réellement échoué.

L'interface ne lit plus `localStorage` pendant le premier rendu hydraté : elle attend la résolution client avant d'afficher la bannière. La fenêtre de préférences applique les changements uniquement au clic sur `Enregistrer mes choix`; fermer la fenêtre annule le brouillon.

## Matrice des états

| État                      | Initialisation PostHog                                            | Collecte autorisée                                                                                |
| ------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Aucun choix               | Non                                                               | Aucune                                                                                            |
| Acceptation               | Oui, mode persistant consenti                                     | Pageviews, acquisition, formulaires, contacts, simulateurs et conversions                         |
| Refus explicite           | Oui uniquement si le flag cookieless est actif et sans opposition | `audience_landed` uniquement                                                                      |
| Retrait après acceptation | Arrêt et réinitialisation                                         | Aucun nouvel événement sur le document courant ; mesure minimale éventuelle au chargement suivant |
| Rechargement avant choix  | Non                                                               | Aucune ; le contexte volatile précédent est perdu                                                 |

Le mode PostHog `cookieless_mode: "on_reject"` ne permet pas de mesurer une personne qui n’a fait aucun choix. Le site renforce cette règle en ne chargeant pas le SDK avant une décision explicite ou la lecture d’un choix encore valide.

## Choix locaux

- `etoilys_analytics_consent` : `accepted` ou `refused` ;
- `etoilys_analytics_consent_updated_at` : date du choix, avec une validité maximale de six mois ;
- `etoilys_cookieless_audience_opt_out` : opposition indépendante à la mesure minimale, sans identifiant ;
- `VITE_ENABLE_COOKIELESS_AUDIENCE=false` : flag de production désactivé par défaut.

Si `localStorage` est indisponible, le choix est appliqué uniquement en mémoire pour le document courant. `?etoilys_internal=1` désactive toute collecte et `?etoilys_analytics_debug=1` ajoute `debug_mode: true` aux seuls événements consentis.

## Contexte d’acquisition volatile

Au bootstrap, le navigateur conserve uniquement en mémoire :

- `utm_source`, `utm_medium`, `utm_campaign` et `utm_content` ;
- le référent initial ;
- la page d’entrée normalisée ;
- la langue.

Rien n’est transmis à PostHog avant consentement. Après acceptation, la classification est enregistrée avec `register_for_session` et se propage aux pageviews et événements. Un rechargement avant acceptation perd volontairement ce contexte.

Après consentement, la première acquisition de la session PostHog est conservée à travers un F5 ou une navigation interne. Une nouvelle campagne reçue dans la même session ne remplace pas silencieusement cette première acquisition. Lorsque PostHog expose un nouvel ID de session, le contexte est recalculé depuis l'entrée courante et remplace l'ancien stockage.

La priorité de classification est : UTM, référent externe, accès direct. Les domaines sont comparés au domaine exact ou à un sous-domaine réel afin d’exclure les domaines trompeurs. Les sources libres sont normalisées, limitées à 64 caractères et rejetées si elles ressemblent à un email ou à un téléphone.

Propriétés de session consenties :

- `acquisition_channel` : `direct`, `generative_ai`, `organic_search`, `paid_search`, `social`, `email`, `referral` ou `campaign` ;
- `acquisition_source` : source normalisée ou domaine référent ;
- `traffic_type` : `paid`, `organic` ou `unknown` ;
- `ai_referrer` : `chatgpt`, `perplexity`, `claude`, `gemini`, `copilot` ou `other`, uniquement pour une source IA ;
- `campaign_name` et `campaign_content`, uniquement depuis `utm_campaign` / `utm_content` assainis ;
- `landing_page` ;
- `locale` : `fr`, `en` ou `nl`.

## Événement d’audience minimale

`audience_landed` est envoyé au maximum une fois par chargement, uniquement après un refus explicite, avec le flag actif et sans opposition.

Propriétés fonctionnelles autorisées :

- `landing_page` : pathname normalisé, sans query ni hash ;
- `locale` : `fr`, `en` ou `nl`.

Le SDK ajoute les propriétés techniques strictement nécessaires au transport cookieless, dont le hash cookieless non persistant et `$geoip_disable`. La sanitisation dédiée supprime URL complète, référent, UTM, campagne, acquisition, navigateur, écran, appareil, géolocalisation et toute autre propriété automatique non indispensable. `referrer_host` est exclu de la v3.

## Événements consentis

- `$pageview` : pageview manuel et pathname normalisé ;
- `contact_clicked` : clic sur le téléphone ou l’email Etoilys, avec `contact_method` égal à `phone` ou `email` ;
- `cta_clicked` : clic sur un CTA déclaré ;
- `form_started`, `form_validation_failed`, `form_submit_attempted`, `form_submit_succeeded`, `form_submit_failed` ;
- `simulator_started`, `simulator_calculated`, `simulator_resumed`, `simulator_deleted` ;
- `simulator_step_viewed`, `simulator_piece_saved`, `simulator_piece_deleted` ;
- `simulator_grid_response_saved`, `simulator_grid_progress_reached` ;
- `simulator_result_requested`, `simulator_result_blocked`, `simulator_pdf_exported`, `simulator_help_opened`.

Les clics de contact ne reconnaissent que `+33 6 49 55 15 40` et `contact@etoilys.fr`. Les coordonnées de tiers, notamment celles de l’hébergeur dans les mentions légales, sont exclues.

Chaque événement consenti porte aussi `source_path`, `page_type` et `event_locale`. `locale` dans les propriétés de session reste la langue de l'entrée ; `event_locale` décrit la langue de la page courante.

## Données interdites

- nom, prénom, email, téléphone, adresse, texte libre ou valeur de formulaire ;
- identifiant de simulation, logement, pièce ou soumission backend ;
- URL complète, query string, hash ou paramètres UTM bruts dans un événement ;
- identifiant de clic publicitaire (`oppref`, `gclid`, `fbclid`, etc.) et valeur de campagne ressemblant à une URL ou à des coordonnées ;
- valeur exacte lorsqu’un bucket existe ;
- autocapture, replay, surveys, pageviews automatiques et dead clicks.

Les chemins dynamiques de classement sont normalisés en `/simulateur/:simulationId`. Les événements non déclarés sont rejetés par `before_send`.

## Séparation des analyses

Les vues « Audience minimale » utilisent exclusivement `audience_landed`, `landing_page` et `locale`. Les vues « Acquisition consentie » utilisent exclusivement les événements consentis et leurs propriétés de session. Il est interdit de diviser des conversions consenties par l’audience cookieless pour produire un taux de conversion.

La procédure d’activation et les contrôles externes sont détaillés dans [Mesure GEO/AEO](../seo/geo-aeo/geo-aeo-measurement.md).

La mesure de conversion publicitaire OpenAI Ads (`lead_created`) est un système entièrement séparé, sans lien de code ni de storage avec ce contrat : voir le [contrat de mesure OpenAI Ads](openai-ads-pixel-contract.md).
