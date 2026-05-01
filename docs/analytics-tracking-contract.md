# Contrat de tracking analytics

Ce contrat décrit le périmètre PostHog v1 pour le site Etoilys.

## Principes

- PostHog n'est initialisé qu'après consentement analytics explicite.
- La clé de consentement locale est `etoilys_analytics_consent`.
- La date du choix est stockée dans `etoilys_analytics_consent_updated_at`.
- Les seules valeurs autorisées sont `accepted` et `refused`.
- Le choix est considéré comme absent si la valeur est invalide, manquante ou si la date du choix a plus de 6 mois.
- Le lien `Gérer mes cookies` du footer et des pages légales ouvre une modale de préférences permettant de refuser ou d'accepter à nouveau.
- Les impressions, refus et interactions avec la bannière cookies ne sont pas trackés dans PostHog.
- Aucun nom, prénom, email, téléphone, adresse, contenu de message ou saisie libre n'est volontairement envoyé.
- Aucune URL complète n'est envoyée : les chemins sont normalisés au `pathname`, sans query string ni hash.
- Les montants et métriques sensibles sont bucketisés.
- `?etoilys_internal=1` désactive totalement la capture analytics pour le navigateur.
- `?etoilys_analytics_debug=1` ajoute `debug_mode: true` aux événements envoyés, sans contourner le consentement.

## Événements autorisés

- `$pageview` : pageview manuel, avec chemin normalisé uniquement.
- `cta_clicked` : clic sur un bouton CTA existant.
- `form_started` : première interaction avec un formulaire.
- `form_validation_failed` : validation frontend échouée.
- `form_submit_attempted` : tentative de soumission API.
- `form_submit_succeeded` : soumission acceptée.
- `form_submit_failed` : soumission refusée ou erreur API.
- `simulator_started` : première interaction avec un simulateur.
- `simulator_calculated` : calcul valide d'un simulateur.

## Propriétés autorisées

- Communes : `source_path`, `destination_path`, `page_type`, `debug_mode`.
- CTA : `cta_id`, `cta_location`.
- Formulaires : `form_name`, `invalid_fields`, `invalid_field_count`, `failure_type`, `field_error_keys`.
- Simulateur taxe de séjour : `simulator`, `city_department`, `nights_bucket`, `nightly_price_bucket`, `occupancy_bucket`, `has_exemptions`, `is_indicative`.
- Simulateur fiscal : `simulator`, `revenue_bucket`, `tmi_rate`, `scope`, `social_threshold_exceeded`, `non_classe_threshold_exceeded`, `savings_bucket`.

## Interdits

- Valeurs exactes de chiffre d'affaires, prix par nuit, téléphone, email, adresse ou message.
- Valeurs de champs invalides.
- Identifiants de soumission backend.
- Session Replay en v1.
- Autocapture PostHog en v1.
