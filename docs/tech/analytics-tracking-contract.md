# Contrat de tracking analytics — v3.3

Version du 29 septembre 2026.

## Mise à jour lot 3 — cookieless séparé, replay consenti et autocapture limitée

Le lot 3 sépare physiquement les deux populations PostHog :

- l'instance principale est exclusivement dédiée aux analytics détaillés consentis ;
- l'instance nommée `etoilys_cookieless_audience` est active dès l'arrivée lorsque `VITE_ENABLE_COOKIELESS_AUDIENCE=true`, sauf opposition `etoilys_cookieless_audience_opt_out=true`.

L'instance cookieless utilise `cookieless_mode: "always"` et `persistence: "memory"`. Elle envoie uniquement `audience_landed`, au maximum une fois par document, avec `landing_page`, `locale` et `$geoip_disable`. Elle n'active ni attribution campagne détaillée, ni rapprochement avec les conversions, ni replay, ni autocapture.

L'instance principale n'utilise plus `cookieless_mode: "on_reject"` et n'envoie jamais `audience_landed`. Elle ne collecte les pageviews, événements métier, replay et autocapture limitée qu'après acceptation analytics. Un refus ou retrait analytics n'active donc aucun événement supplémentaire sur l'instance principale.

Une opposition cookieless enregistrée empêche les mesures suivantes. Elle ne peut pas annuler un `audience_landed` déjà envoyé au chargement du document avant l'opposition.

## Mise à jour lot 2 — acquisition et événements consentis

Le lot 2 conserve le plan d'événements existant et n'ajoute aucune collecte avant consentement. Après accord analytics, le contexte d'acquisition assaini est associé à l'ID de session exposé par PostHog avec un stockage local minimal `{ sessionId, acquisition }` : même ID, même acquisition ; nouvel ID, remplacement. Il n'y a pas de TTL, timer ou logique cross-tab maison.

Les événements consentis capturent leur contexte de page avant tout chargement asynchrone du SDK afin que `source_path`, `page_type` et `event_locale` décrivent la page d'interaction réelle. Une sauvegarde inchangée de préférences ne crée pas de pageview ; le pageview de transition n'est admis que lors d'un passage effectif vers l'accord analytics.

Ce contrat sépare strictement la mesure minimale sans cookie et les analytics détaillés après consentement. Il ne constitue ni une validation juridique, ni une approbation ou certification de la CNIL.

## Mise à jour lot 1 — consentement

Le recueil du consentement repose sur une source de vérité commune côté navigateur, partagée avec la mesure publicitaire. Le lot 1 conserve les clés historiques existantes plutôt que d'introduire un nouveau format de stockage :

- `etoilys_analytics_consent` et `etoilys_analytics_consent_updated_at` pour PostHog ;
- `etoilys_advertising_consent` et `etoilys_advertising_consent_updated_at` pour OpenAI Ads ;
- `etoilys_cookieless_audience_opt_out` pour l'opposition à une éventuelle mesure minimale.

Les choix restent valables 183 jours. Si l'accès au stockage navigateur échoue, le choix utilisateur est appliqué en mémoire pour le document courant afin qu'un refus explicite ne soit pas ignoré au profit d'une ancienne valeur persistée. Il pourra être redemandé lors d'un rechargement si la persistance a réellement échoué.

L'interface ne lit plus `localStorage` pendant le premier rendu hydraté : elle attend la résolution client avant d'afficher la bannière. La fenêtre de préférences applique les changements uniquement au clic sur `Enregistrer mes choix`; fermer la fenêtre annule le brouillon.

## Matrice des états

| État                      | Initialisation PostHog                                                               | Collecte autorisée                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Aucun choix               | Instance cookieless seule si flag actif et sans opposition ; instance principale non | `audience_landed` uniquement sur l'instance cookieless                                          |
| Acceptation               | Instance principale oui, mode persistant consenti                                    | Pageviews, acquisition, formulaires, contacts, simulateurs, conversions, replay et clics utiles |
| Refus explicite           | Instance principale non                                                              | Aucun événement détaillé ; pas de second `audience_landed` sur le document courant              |
| Retrait après acceptation | Arrêt et réinitialisation de l'instance principale                                   | Aucun nouvel événement détaillé sur le document courant                                         |
| Rechargement avant choix  | Instance cookieless seule si flag actif et sans opposition                           | Un nouvel `audience_landed` limité au document courant                                          |

Le mode PostHog `cookieless_mode: "on_reject"` n'est plus utilisé par l'instance principale. La couverture d'arrivée repose uniquement sur l'instance cookieless séparée en `cookieless_mode: "always"`.

## Choix locaux

- `etoilys_analytics_consent` : `accepted` ou `refused` ;
- `etoilys_analytics_consent_updated_at` : date du choix, avec une validité maximale de six mois ;
- `etoilys_cookieless_audience_opt_out` : opposition indépendante à la mesure minimale, sans identifiant ;
- `VITE_ENABLE_COOKIELESS_AUDIENCE=true` : active l'instance cookieless séparée lorsque l'environnement de mesure est autorisé.

Si `localStorage` est indisponible, le choix est appliqué uniquement en mémoire pour le document courant. `?etoilys_internal=1` désactive toute collecte et `?etoilys_analytics_debug=1` ajoute `debug_mode: true` aux seuls événements consentis.

## Contexte d’acquisition volatile

Au bootstrap, le navigateur conserve uniquement en mémoire :

- `utm_source`, `utm_medium`, `utm_campaign` et `utm_content` ;
- le référent initial ;
- la page d’entrée normalisée ;
- la langue.

Aucune attribution détaillée n’est transmise à l’instance PostHog principale avant consentement. L'instance cookieless ne reçoit pas ce contexte et ne conserve que la page d'entrée et la langue. Après acceptation, la classification est enregistrée avec `register_for_session` et se propage aux pageviews et événements consentis. Un rechargement avant acceptation perd volontairement ce contexte.

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

`audience_landed` est envoyé par l'instance `etoilys_cookieless_audience` au maximum une fois par document, dès l'arrivée, avec le flag actif et sans opposition. Un refus ou une opposition exprimés après cet envoi empêchent les mesures suivantes mais ne suppriment pas rétroactivement l'événement déjà transmis.

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
- `simulator_result_requested`, `simulator_result_blocked`, `simulator_pdf_exported`, `simulator_help_opened` ;
- `$autocapture` : clics consentis uniquement, limités par les allowlists natives du SDK aux liens, boutons, éléments `role="button"` et éléments explicitement marqués `data-ph-autocapture="true"`.

Les clics de contact ne reconnaissent que `+33 6 49 55 15 40` et `contact@etoilys.fr`. Les coordonnées de tiers, notamment celles de l’hébergeur dans les mentions légales, sont exclues.

Chaque événement consenti porte aussi `source_path`, `page_type` et `event_locale`. `locale` dans les propriétés de session reste la langue de l'entrée ; `event_locale` décrit la langue de la page courante.

## Replay et autocapture consentis

Le replay est activé uniquement sur l'instance principale, après consentement analytics. Le code configure `disable_session_recording: false` et `maskAllInputs: true`; le réglage projet PostHog doit confirmer que 100 % des sessions consenties sont éligibles au replay avant activation production.

Les zones Turnstile sont bloquées dans le replay (`.inquiry-turnstile`, `.cf-turnstile`, `.ph-block`, `[data-replay-block="true"]`). Les valeurs et résultats sensibles sont masqués ou exclus via `.simulator-result-value`, `.simulator-comparison`, `.simulator-facts`, `.classement-result-scores`, `.classement-result-diagnostic`, `[data-analytics-sensitive="true"]` et `[data-replay-mask="true"]`. La structure, les labels, boutons, erreurs et étapes utiles restent visibles.

L'autocapture est limitée aux clics utiles par les options natives du SDK : `dom_event_allowlist: ["click"]`, allowlists d'éléments/sélecteurs, ignorelist sensible, et `capture_copied_text: false`. Aucun listener DOM maison n'est ajouté. `before_send` n'autorise que `$autocapture` et les événements métier déclarés, puis supprime toute propriété hors contrat ou sensible.

## Données interdites

- nom, prénom, email, téléphone, adresse, texte libre ou valeur de formulaire ;
- identifiant de simulation, logement, pièce ou soumission backend ;
- URL complète, query string, hash ou paramètres UTM bruts dans un événement ;
- identifiant de clic publicitaire (`oppref`, `gclid`, `fbclid`, etc.) et valeur de campagne ressemblant à une URL ou à des coordonnées ;
- valeur exacte lorsqu’un bucket existe ;
- surveys, pageviews automatiques et dead clicks.

Les chemins dynamiques de classement sont normalisés en `/simulateur/:simulationId`. Les événements non déclarés sont rejetés par `before_send`.

## Séparation des analyses

Les vues « Audience minimale » utilisent exclusivement `audience_landed`, `landing_page` et `locale`. Les vues « Acquisition consentie » utilisent exclusivement les événements consentis et leurs propriétés de session. Il est interdit de diviser des conversions consenties par l’audience cookieless pour produire un taux de conversion.

La procédure d’activation et les contrôles externes sont détaillés dans [Mesure GEO/AEO](../seo/geo-aeo/geo-aeo-measurement.md).

La mesure de conversion publicitaire OpenAI Ads (`lead_created`) est un système entièrement séparé, sans lien de code ni de storage avec ce contrat : voir le [contrat de mesure OpenAI Ads](openai-ads-pixel-contract.md).
