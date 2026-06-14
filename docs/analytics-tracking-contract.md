# Contrat de tracking analytics

Ce contrat décrit le périmètre PostHog v2 pour le site Etoilys.

## Principes

- PostHog n'est initialisé qu'après consentement analytics explicite.
- La clé de consentement locale est `etoilys_analytics_consent`.
- La date du choix est stockée dans `etoilys_analytics_consent_updated_at`.
- Si le stockage local est indisponible, le choix reste appliqué pendant la session navigateur.
- Les seules valeurs autorisées sont `accepted` et `refused`.
- Le choix est considéré comme absent si la valeur est invalide, manquante ou si la date du choix a plus de 6 mois.
- Le lien `Gérer mes cookies` du footer et des pages légales ouvre une modale de préférences permettant de refuser ou d'accepter à nouveau.
- Les impressions, refus et interactions avec la bannière cookies ne sont pas trackés dans PostHog.
- Aucun nom, prénom, email, téléphone, adresse, contenu de message ou saisie libre n'est volontairement envoyé.
- Aucune URL complète n'est envoyée : les chemins sont normalisés au `pathname`, sans query string ni hash.
- Les chemins dynamiques de simulation de classement sont normalisés en `/simulateur/:simulationId`.
- Les montants, capacités, étages et compteurs sont bucketisés quand ils peuvent décrire un logement.
- La sanitisation conserve les propriétés techniques ajoutées par le SDK PostHog, notamment `token`,
  `distinct_id` et les propriétés préfixées par `$`, tout en normalisant les propriétés d'URL connues.
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
- `simulator_started` : première création réussie d'un simulateur.
- `simulator_calculated` : calcul valide d'un simulateur.
- `simulator_resumed` : reprise ou ouverture d'un simulateur de classement existant.
- `simulator_deleted` : suppression réussie d'une simulation de classement.
- `simulator_step_viewed` : affichage utile d'une étape du simulateur de classement.
- `simulator_piece_saved` : ajout ou modification réussie d'une pièce.
- `simulator_piece_deleted` : suppression réussie d'une pièce.
- `simulator_grid_response_saved` : réponse de critère enregistrée.
- `simulator_grid_progress_reached` : jalon de progression atteint dans la grille.
- `simulator_result_requested` : demande explicite de calcul ou recalcul du résultat.
- `simulator_result_blocked` : calcul bloqué par une vérification à compléter.
- `simulator_pdf_exported` : export PDF réussi depuis un rapport à jour.
- `simulator_help_opened` : ouverture d'une aide de critère.

## Propriétés autorisées

- Communes : `source_path`, `destination_path`, `page_type`, `debug_mode`.
- CTA : `cta_id`, `cta_location`.
- Formulaires : `form_name`, `invalid_fields`, `invalid_field_count`, `failure_type`, `field_error_keys`.
- Simulateur taxe de séjour : `simulator`, `city_department`, `nights_bucket`, `nightly_price_bucket`, `occupancy_bucket`, `has_exemptions`, `is_indicative`.
- Simulateur fiscal : `simulator`, `revenue_bucket`, `tmi_rate`, `scope`, `social_threshold_exceeded`, `non_classe_threshold_exceeded`, `savings_bucket`.
- Simulateur de classement, contexte : `simulator`, `requested_category`, `housing_type`, `floor_bucket`, `capacity_bucket`, `entry_point`.
- Simulateur de classement, étapes : `step`, `piece_action`, `piece_type`, `piece_scope`, `piece_count_bucket`.
- Simulateur de classement, grille : `criterion_number`, `criterion_status`, `validation_status`, `progress_bucket`, `remaining_criteria_bucket`, `missing_mandatory_bucket`.
- Simulateur de classement, résultat : `result_outcome`, `has_sleeping_capacity_issue`, `has_bathroom_issue`, `has_missing_criteria`.

## Interdits

- Valeurs exactes de chiffre d'affaires, prix par nuit, téléphone, email, adresse ou message.
- Identifiant de simulation, identifiant de logement, identifiant de pièce ou identifiant de soumission backend.
- Nom de pièce, commentaire de critère, commentaire obligatoire ou saisie libre.
- Valeurs exactes de surface, capacité, étage et compteurs de critères quand un bucket existe.
- URL complète, query string ou hash.
- Valeurs de champs invalides.
- Session Replay en v2.
- Autocapture PostHog en v2.
