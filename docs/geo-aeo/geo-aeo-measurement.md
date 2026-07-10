# Mesure GEO/AEO — audience minimale et acquisition consentie

Référence du 10 juillet 2026. Cette documentation décrit l’implémentation du lot 2.3 et les vérifications encore nécessaires avant activation en production.

## Périmètre

Deux ensembles de données indépendants sont définis :

| Ensemble              | Déclenchement                                  | Données                                                                            |
| --------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------- |
| Audience minimale     | Refus explicite, flag actif, aucune opposition | `audience_landed`, page d’entrée, langue                                           |
| Acquisition consentie | Acceptation explicite                          | Pages, canal, source, référent IA, formulaires, contacts, simulateurs, conversions |

Aucun événement PostHog n’est envoyé en l’absence de choix. L’audience minimale n’est jamais raccordée à une session, une source d’acquisition ou une conversion.

## Dictionnaire utile au GEO/AEO

| Événement ou propriété  | Ensemble                              | Définition                                              |
| ----------------------- | ------------------------------------- | ------------------------------------------------------- |
| `audience_landed`       | Audience minimale                     | Un événement maximal par document après refus explicite |
| `landing_page`          | Les deux, sans raccordement entre eux | Pathname sans query ni hash                             |
| `locale`                | Les deux                              | `fr` ou `en`                                            |
| `$pageview`             | Acquisition consentie                 | Pageview manuel après consentement                      |
| `acquisition_channel`   | Acquisition consentie                 | Canal classé pour la session                            |
| `acquisition_source`    | Acquisition consentie                 | Source normalisée ou domaine référent                   |
| `ai_referrer`           | Acquisition consentie                 | Famille d’assistant IA détectée                         |
| `contact_clicked`       | Acquisition consentie                 | Clic téléphone ou email Etoilys                         |
| `form_submit_succeeded` | Acquisition consentie                 | Formulaire envoyé avec succès                           |
| `simulator_started`     | Acquisition consentie                 | Démarrage utile d’un simulateur                         |

Le dictionnaire complet est disponible dans le [contrat analytics v3](../analytics-tracking-contract.md).

## Classification consentie

1. Une source UTM valide est prioritaire.
2. À défaut, le référent externe est classé en IA générative, moteur organique, réseau social ou referral.
3. À défaut de référent externe, le canal est `direct`.

Les familles IA suivies sont ChatGPT, Perplexity, Claude, Gemini, Copilot et `other`. La comparaison des domaines exige le domaine exact ou un sous-domaine réel ; `chatgpt.com.evil.example` et les formes similaires ne sont pas reconnus. Une source contenant un email ou un téléphone est rejetée.

## Limites de mesure

- Un visiteur qui ignore la bannière n’est pas mesuré par PostHog.
- Les UTM et le référent sont perdus si la page est rechargée avant acceptation.
- Un refus ne permet de connaître ni le canal, ni la campagne, ni le référent IA, ni une conversion.
- Le retrait d’un consentement n’émet rien sur le document courant ; une audience minimale éventuelle ne peut commencer qu’au chargement suivant.
- Les référents sont parfois supprimés par les navigateurs, applications ou assistants.
- ChatGPT reste le seul assistant testé activement dans le panel GEO/AEO ; les autres assistants sont des signaux passifs dans les données consenties.

## Vues PostHog à créer

### Audience minimale

- filtre exclusif : événement `audience_landed` ;
- dimensions autorisées : `landing_page`, `locale` ;
- aucun breakdown par référent, UTM, appareil, profil ou conversion.

### Acquisition consentie

- pageviews et conversions consentis ;
- breakdowns : `acquisition_channel`, `acquisition_source`, `ai_referrer`, `landing_page`, `locale` ;
- conversions : `contact_clicked`, `form_submit_succeeded` et démarrages de simulateur pertinents.

Ne jamais calculer un taux de conversion avec les conversions consenties au numérateur et `audience_landed` au dénominateur.

## Contrôle réseau avant activation

1. Conserver `VITE_ENABLE_COOKIELESS_AUDIENCE=false` dans la configuration de production.
2. Utiliser un projet ou environnement de test configuré comme la production.
3. Effacer les choix locaux puis charger une URL avec UTM : aucun script ni appel PostHog ne doit apparaître sans choix.
4. Refuser : vérifier un seul `audience_landed` et inspecter le payload brut.
5. Confirmer que les seules propriétés fonctionnelles sont `landing_page` et `locale`, que `$geoip_disable` est actif et que le mode/hash cookieless n’est pas persistant.
6. Vérifier dans PostHog les propriétés réellement enregistrées, y compris celles ajoutées côté ingestion.
7. Activer l’opposition depuis les préférences, recharger et confirmer l’absence totale d’appel PostHog minimal.
8. Accepter sur un nouveau chargement avec UTM : contrôler les propriétés de session, le pageview et une conversion.
9. Retirer le consentement : contrôler l’arrêt immédiat, l’absence d’événement sur le document courant et la réinitialisation.
10. Archiver les captures datées sans données personnelles dans ce dossier ou dans le registre de conformité retenu.

## Checklist PostHog et conformité

| Contrôle                                                         | Statut au 10 juillet 2026                | Preuve attendue                                          |
| ---------------------------------------------------------------- | ---------------------------------------- | -------------------------------------------------------- |
| Projet PostHog hébergé dans l’Union européenne                   | À confirmer humainement — bloquant       | Capture des paramètres du projet et host d’ingestion     |
| DPA applicable                                                   | À confirmer humainement — bloquant       | Référence ou copie datée du DPA signé/applicable         |
| Durée de conservation configurée                                 | À confirmer humainement — bloquant       | Capture du réglage effectif                              |
| Absence de réutilisation et d’intégrations tierces incompatibles | À confirmer humainement — bloquant       | Inventaire des intégrations et réglages                  |
| Cookieless Server Hash activé                                    | À confirmer humainement — bloquant       | Capture du réglage projet                                |
| Opposition cookieless fonctionnelle                              | Test unitaire présent ; test live requis | Capture réseau avant/après opposition                    |
| Payload réseau réel de `audience_landed`                         | À confirmer humainement — bloquant       | Export HAR ou capture datée expurgée                     |
| Propriétés réellement enregistrées dans PostHog                  | À confirmer humainement — bloquant       | Capture de l’événement ingéré                            |
| Textes juridiques validés                                        | À confirmer humainement — bloquant       | Validation interne ou conseil juridique daté             |
| Analyse interne des critères d’exemption                         | Non documentée à ce jour — bloquant      | Note datée comparant chaque critère CNIL au réglage réel |

Références officielles :

- [CNIL — solutions pour les outils de mesure d’audience](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies-solutions-pour-les-outils-de-mesure-daudience) ;
- [CNIL — cookies et autres traceurs : que dit la loi ?](https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi).

L’activation de production reste interdite tant que tous les contrôles bloquants ne disposent pas d’une preuve. Le document ne présente pas la configuration comme validée, approuvée ou certifiée par la CNIL.
