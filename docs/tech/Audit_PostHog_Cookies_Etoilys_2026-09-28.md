# Étoilys — Audit PostHog, consentement et interfaces cookies

**Date : 28 septembre 2026**  
**Dépôt : `Fgris-Etoilys/etoilys-public` — branche `main`**  
**Révision auditée : `53b01c12e7d36f4d0a94bec03c369c19dc452631`**  
**Nature : audit en lecture seule et spécification de remédiation pour Codex. Aucun changement du dépôt, des campagnes ou des consentements des visiteurs n’a été effectué.**

## 1. Décision proposée

Conserver PostHog et le plan d’événements métier existant. Refaire le noyau de consentement et ses interfaces, corriger les défauts d’attribution et de comptage, puis traiter séparément l’éventuel élargissement de la mesure sans consentement.

L’implémentation n’est pas simplement « trop stricte ». Elle combine une instrumentation métier déjà assez riche, une mesure minimale très limitée, une interface de préférences incohérente et un mécanisme publicitaire qui conserve déjà un identifiant de clic avant l’accord. Desserrer indistinctement les contrôles ne corrigerait ni le flash, ni les doublons, ni les pertes d’attribution.

**Les gains immédiats les plus défendables sont techniques :** une bannière qui ne réapparaît pas à tort, des choix réellement indépendants, une attribution conservée après accord, des événements déclenchés au bon moment et une configuration cohérente entre l’interface, les SDK et les tableaux de bord.

### Arbitrages proposés

| Référence | Arbitrage                                                     | Recommandation                                                                                                                                                                                                                                                                   |
| --------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1        | Gestionnaire maison ou CMP externe                            | Conserver une interface maison légère, inspirée des bons usages des CMP. Ne pas installer une plateforme complète pour deux finalités optionnelles sans besoin supplémentaire.                                                                                                   |
| A2        | Mesure des visiteurs qui n’ont pas accepté                    | Préparer une vraie mesure d’audience limitée pouvant fonctionner dès l’arrivée, **uniquement après qualification documentée de son exemption**. Ne pas simplement activer `always` ou changer le flag actuel.                                                                    |
| A3        | Conservation de `oppref` avant accord                         | Remplacer la persistance préconsentement par un contexte volatile dans le document ; persister seulement après accord publicitaire. Reconnaître la perte possible lors d’un F5 avant accord. C’est un changement d’un arbitrage historique : à valider explicitement.            |
| A4        | Correspondance avancée OpenAI Ads                             | Vérifier le réglage réel. Ne pas désactiver arbitrairement une fonctionnalité déjà approuvée, mais aligner information, consentement et collecte effective. Ne pas ajouter de matching manuel dans ce chantier.                                                                  |
| A5        | Replay et autocapture PostHog                                 | Maintenir désactivés dans les premiers lots. Un replay ciblé et consenti peut être un chantier distinct si une question UX concrète le justifie.                                                                                                                                 |
| A6        | Sens du bouton de refus si une audience exemptée reste active | Le libellé doit refléter le périmètre. Soit « Tout refuser » coupe aussi cette mesure facultative, soit le bouton devient « Refuser les cookies » avec une information claire sur la mesure limitée indépendante. Ne pas afficher une promesse de zéro mesure qui serait fausse. |

A1, les corrections de rendu, l’interface à brouillon et la fiabilisation des événements n’exigent pas d’élargir la collecte. A2 à A6 ne doivent pas être transformés par Codex en décisions implicites.

## 2. Périmètre et niveau de preuve

### Travail effectué

Lecture du bootstrap, du pré-rendu, du layout, du gestionnaire et de ses tests, du module analytics et de son acquisition, du module OpenAI Ads, du point de conversion du formulaire de classement, de la politique de confidentialité française, de sa structure multilingue et des contrats de mesure. Consultation des pages publiques et des documentations officielles React, PostHog, OpenAI, CNIL, W3C, Axeptio et Didomi. Lecture de l’inventaire de conversion du compte Ads Manager Étoilys.

Le dépôt est figé sur le SHA indiqué. Les références R1 à R17 en fin de rapport permettent de retrouver les fichiers. Les constats portent sur les fonctions nommées, pas sur des numéros de ligne susceptibles de changer pendant l’implémentation.

### Limites à conserver dans le compte rendu d’exécution

- Pas de reproduction interactive du F5 en production ni de filmstrip de chargement pendant cet audit. Le mécanisme responsable est établi par la composition pré-rendue et l’initialisation du composant ; la validation visuelle reste à exécuter sur le build de production.
- Pas d’exécution de `typecheck`, Vitest, Playwright ou du build local du dépôt pendant cet audit. Aucun résultat de tests n’est revendiqué.
- Pas d’accès aux événements, tableaux de bord et paramètres du projet PostHog. La valeur du flag **effectivement déployé** n’est pas démontrée par `.env.example`.
- Pas d’audit de l’infrastructure derrière `f.etoilys.fr`, de ses journaux, de la rétention effective ou de tous les traitements serveur.
- Le contenu public récupéré peut provenir d’un cache. En particulier, la version récupérée de `/confidentialite` est plus ancienne que le code audité : elle ne permet pas de conclure que la production actuelle omet OpenAI Ads. Le code français actuel le mentionne bien.
- La revue du funnel est approfondie sur la demande de classement. Les autres formulaires et tous les parcours internes des simulateurs doivent être contrôlés lors de la vérification des appels, sans présumer qu’ils ont tous le même défaut.

**Lecture des qualifications :** « constaté » signifie présent dans le code ou la configuration consultée ; « déduit » décrit une conséquence reproductible attendue, non mesurée en production ; « à vérifier » exige une preuve réseau, SDK ou compte. Ce rapport ne constitue pas une certification juridique de l’implémentation.

## 3. Fonctionnement actuel

### 3.1 Architecture

`main.tsx` appelle `initializeAnalytics()` et `initOpenAiAdsPixelIfConsented()` avant l’hydratation React. Le site utilise un pré-rendu et `hydrateRoot` lorsque le conteneur possède du HTML. `Layout` inclut le gestionnaire de cookies et les trackers de routes et de contacts. [R1, R2, R3]

Les choix PostHog et OpenAI Ads sont enregistrés séparément : une valeur et une date pour chaque finalité. Une opposition supplémentaire concerne l’audience minimale. Les modules disposent aussi de variables en mémoire, mais cette mémoire n’est pas une source de vérité commune à l’interface et aux deux SDK. [R4, R5, R7]

PostHog est importé dynamiquement. L’autocapture, le replay, les surveys et les pageviews automatiques sont désactivés. Le site émet des événements explicites pour les pages, CTA, contacts, formulaires et simulateurs. [R5, R10]

### 3.2 Matrice réellement prévue par le code

| Situation                                       | PostHog                                                                                         | OpenAI Ads                              | Point notable                                                                   |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------- |
| Aucun choix enregistré                          | Pas d’initialisation ni d’événement analytics                                                   | Pas de chargement du Pixel              | `oppref` peut pourtant déjà être copié dans `sessionStorage`.                   |
| Analytics accepté, publicité refusée            | Événements détaillés                                                                            | Pas de nouvelle conversion publicitaire | Les finalités peuvent être distinctes, mais le menu les présente mal.           |
| Publicité acceptée, analytics refusé            | Audience minimale éventuelle seulement                                                          | Pixel et conversion `lead_created`      | Combinaison possible, sans parcours de réglage évident.                         |
| Refus des deux finalités                        | `audience_landed` au plus une fois par document si flag actif et sans opposition                | Pas de conversion permise par le helper | Le refus ne purge pas la copie maison de `oppref`.                              |
| Retrait d’un accord analytics                   | Opt-out, reset et aucun nouvel événement minimal sur le document courant dans la branche prévue | Indépendant                             | L’audience minimale peut reprendre au chargement suivant.                       |
| Refus minimal explicite                         | Pas de nouvel événement minimal autorisé                                                        | Indépendant                             | L’interface ne doit pas exposer une option inactive comme si elle fonctionnait. |
| Choix absent ou expiré pour l’une des finalités | Nouvelle demande de choix                                                                       | Nouvelle demande de choix               | Un ancien accord analytics ne doit jamais devenir un accord publicitaire.       |

La durée applicative des choix est de 183 jours. La mesure minimale est désactivée dans l’exemple d’environnement et son activation est soumise à un dossier de vérification encore indiqué comme incomplet dans la documentation de juillet. Cela ne prouve pas que le flag est actuellement désactivé en production. [R5, R7, R10, R12, R13]

### 3.3 Conversion publicitaire : ce qui fonctionne déjà

Le formulaire de classement appelle le tracking uniquement après les deux validations du résultat API : `response.success` puis `response.data.success`. Le Pixel n’est pas déclenché par un simple clic sur Envoyer. Les appels PostHog et OpenAI sont distincts. Le helper publicitaire n’accepte aucune donnée de formulaire en paramètre et ses erreurs ne doivent pas bloquer le succès métier. À préserver. [R8]

La lecture du compte Ads Manager, le 28 septembre 2026, a confirmé une source web « Etoilys | Site web » et une configuration « Demande de classement envoyée » sur `lead_created`, avec une fenêtre de clic de 30 jours. Le champ de fenêtre après impression retourné vaut 0 : ne pas recopier comme réglage actuel la mention historique d’un jour figurant dans un commentaire du dépôt. Ce retour ne permet pas, à lui seul, de conclure à l’absence de toute fonctionnalité de reporting après impression dans le produit. Aucun événement réel de visiteur n’a été consulté, et le réglage de correspondance avancée n’est pas exposé par les réponses utilisées.

## 4. Constats et corrections

### F01 — Le flash est un défaut de pré-rendu/hydratation, pas un problème de durée de transition

**Priorité : P0. Preuve : constaté dans la structure de rendu ; effet visuel signalé par l’utilisateur.**

`CookieConsentManager` initialise déjà ses états avec des fonctions paresseuses qui lisent les choix. Sur le serveur, le stockage navigateur n’existe pas : les choix sont `null`. `showInitialBanner` devient donc vrai et la bannière est incluse dans le HTML pré-rendu. Lors du premier rendu navigateur, un choix existant rend cette condition fausse. Le HTML affichable avant JavaScript et le premier arbre client divergent. [R1–R4]

**Ne pas demander à Codex de “déplacer la lecture du localStorage dans useState” : c’est déjà le cas.** React demande que le premier rendu client corresponde au rendu serveur ; masquer le warning ne corrige pas cette divergence. [S1]

**Correction prescrite :** introduire un état d’interface `loading` identique côté pré-rendu et premier rendu client. Cet état n’affiche ni bannière ni modale. Une fois l’hydratation effectuée, lire le snapshot de consentement et afficher la bannière seulement si un choix est réellement à demander. Le reste de la page conserve intégralement son pré-rendu.

Une solution locale à deux passages suffit pour le correctif initial. Avec le store commun du lot suivant, un `getServerSnapshot` stable associé à `useSyncExternalStore` peut fournir le même contrat. Ne pas migrer le framework pour cela.

**À exclure :** délai arbitraire de 300 ou 500 ms, `suppressHydrationWarning`, cache CSS du site entier, suppression du pré-rendu SEO, simple remplacement par `useLayoutEffect`.

**Acceptation :** après un choix valide, aucun frame de chargement ne contient la bannière, même avec JavaScript ralenti ; aucune erreur d’hydratation liée aux cookies. Pour un nouveau visiteur, la bannière apparaît une fois l’interface prête, sans bloquer le contenu.

### F02 — Le menu ne permet pas d’enregistrer proprement un choix personnalisé

**Priorité : P0. Preuve : constaté.**

Le switch publicitaire est enregistré immédiatement ; celui de l’audience minimale aussi. La partie analytics n’a pas de switch dédié. Les boutons finaux `Accepter` et `Refuser` modifient ensemble analytics et publicité. Par exemple, décocher la publicité puis cliquer sur `Accepter` la réactive. Fermer la fenêtre ne revient pas sur les modifications déjà faites. [R4]

**Correction prescrite :** deux switches indépendants pour les deux finalités optionnelles, un brouillon local à la modale et un bouton principal **Enregistrer mes choix**. Les changements de switches ne doivent ni écrire dans le stockage ni appeler les SDK avant cette validation. Croix, Échap et clic sur le fond annulent le brouillon. Les actions globales restent explicites et appliquent l’ensemble de leur périmètre.

Ajouter **Personnaliser** au premier niveau. Il doit être possible de choisir analytics oui/publicité non ou l’inverse sans utiliser une fermeture de fenêtre comme pseudo-validation.

### F03 — L’interface expose des détails de développement et une option dont l’activité réelle n’est pas visible

**Priorité : P1. Preuve : constaté.**

Le texte français de l’audience minimale parle d’un « flag de production » désactivé jusqu’à la réalisation de contrôles. Ce texte n’a rien à faire dans une interface client. Par ailleurs, `isCookielessAudienceMeasurementEnabled()` exprime l’absence d’opposition, pas l’activation du flag : une case peut donc être cochée alors que cette mesure n’est pas en service. [R4, R5]

**Correction prescrite :** distinguer `featureAvailable`, `userOptOut` et `effectiveEnabled`. N’afficher une section de mesure limitée que si elle correspond à un dispositif effectivement proposé. Conserver la préférence historique même lorsqu’on masque la section ; ne pas la réactiver silencieusement à l’occasion d’un déploiement. Retirer des écrans le vocabulaire analytics détaillés, document courant, événement, flag, query et hash. Les détails techniques restent dans la documentation développeur.

### F04 — Les protections contre les erreurs de stockage sont incomplètes

**Priorité : P0. Preuve : constaté ; scénarios de panne à tester.**

Deux défauts distincts existent dans `analytics.ts` et `openAiAds.ts`.

**Accès au getter hors du `try`.** `canUseBrowserStorage()` lit `window.localStorage` avant l’entrée dans le `try/catch` de l’appelant. Le même schéma existe pour `sessionStorage` côté publicité. Si le getter lui-même lève une exception, la protection est contournée. Au bootstrap, cela peut aller au-delà d’une simple perte de mesure.

**Ancien accord prioritaire sur un nouveau refus en mémoire.** Les fonctions de lecture privilégient une valeur persistée encore valide. Si un refus est écrit en mémoire mais que `setItem` échoue, un ancien accord stocké peut rester prioritaire à la lecture suivante. L’interface peut afficher un refus alors que le getter de consentement continue à retourner un accord. [R5, R7]

**Correction prescrite :** toutes les opérations de stockage, y compris l’accès à l’objet de stockage, entrent dans une protection commune. Après une action utilisateur, le store mémoire devient immédiatement l’état effectif de ce document, même si la persistance échoue. Les SDK suivent cet état effectif. Un rechargement peut perdre un choix qui n’a pas pu être enregistré, mais le document courant ne doit jamais ignorer un refus explicite pour réutiliser une vieille valeur.

Ne pas “corriger” en prenant systématiquement le plus restrictif de toutes les anciennes valeurs : cela casserait une réacceptation légitime. L’ordre des décisions et la source du snapshot doivent être explicites.

### F05 — Pas de synchronisation complète entre choix, interface et cycle de vie des SDK

**Priorité : P1. Preuve : constaté dans les modules audités.**

Les préférences sont relues à l’ouverture du menu, mais il n’existe pas de mécanisme central qui applique une transition aux deux SDK et à l’interface sur un événement `storage`. Les wrappers relisent déjà le consentement lors de nombreux appels : il serait donc excessif d’affirmer que tout tracking ignore systématiquement un refus effectué dans un autre onglet. En revanche, la mise à jour de l’interface, l’opt-out du SDK déjà chargé et ses nettoyages ne sont pas orchestrés ensemble. [R4, R5, R7, R14]

La fraîcheur contrôle une différence de dates maximale sans rejeter explicitement une date future. Aucun versionnement des finalités n’est attaché aux choix existants. Une modification purement visuelle ne devrait pas réinterroger tous les visiteurs, tandis qu’une finalité matériellement nouvelle ne doit pas hériter d’un ancien accord.

**Correction prescrite :** store commun, notifications dans le même document et sur `storage`, relecture au retour de page/onglet, validation stricte des données, expiration cohérente et migration conservatrice. L’arrêt doit concerner les prochains événements et les travaux asynchrones encore contrôlables ; ne pas promettre de rappeler des requêtes déjà envoyées.

### F06 — L’acquisition est réenregistrée à chaque nouveau document, même après consentement

**Priorité : P1. Preuve : logique constatée ; effet d’attribution à reproduire avec le SDK réel.**

Le contexte d’entrée est volatil. `hasRegisteredConsentedAcquisition` est un booléen du module, remis à zéro à chaque chargement. `registerConsentedAcquisition` réenregistre alors la classification avec `register_for_session`. [R5, R6]

Scénario de contrôle : arrivée avec une campagne, accord analytics, navigation interne vers le formulaire, puis F5. Le nouveau contexte part de l’URL du formulaire, qui ne porte plus nécessairement la campagne, et d’un référent qui dépend du parcours/navigateur. L’ancienne acquisition peut être réécrite en organique/direct, ou au minimum perdre son contexte de campagne et sa page d’entrée. Cette perte **après accord** ne découle pas d’une interdiction de mesurer sans accord.

**Correction prescrite :** persister, après consentement seulement, un contexte d’acquisition assaini associé à la session de mesure. Réutiliser l’entrée initiale lors des rechargements internes de la même session. Renouveler le contexte à la vraie frontière de session. Utiliser les API publiques disponibles dans la version verrouillée du SDK pour aligner cette frontière ; ne pas supposer qu’un onglet ouvert correspond exactement à une session PostHog.

Choix recommandé : première acquisition de la session comme référence. Une nouvelle campagne reçue ensuite peut être conservée séparément comme dernier contact, mais ne doit pas écraser silencieusement la première. Tester navigation, F5, nouvel onglet et expiration de session. Ne pas prolonger artificiellement la durée d’une session pour améliorer les chiffres.

### F07 — Des dimensions utiles restent inutilement pauvres après accord

**Priorité : P1. Preuve : constaté.**

La capture d’entrée ne conserve que `utm_source` et `utm_medium`. Dans `classifyConsentedAcquisition`, les alias IA sont évalués avant le média payant : `utm_source=chatgpt&utm_medium=cpc` devient une source IA sans distinction payante dans le canal. `paid_social` est regroupé avec le social. Les variantes de campagnes ne sont pas disponibles comme dimensions dédiées. [R6]

**Correction prescrite :** séparer la famille de source et le caractère payant. Ajouter `traffic_type` à valeurs bornées (`paid`, `organic`, `unknown`) et une nomenclature de canal explicitement versionnée, ou de nouveaux canaux `paid_ai` et `paid_social`. Recommandation : conserver les anciens champs pour les tableaux de bord historiques et ajouter des champs v2 sans réinterpréter le passé.

Autoriser après accord `campaign_name` et `campaign_content` issus de valeurs normalisées et bornées. Exclure les valeurs ressemblant à des coordonnées, les textes libres, les identifiants de clic et les URL complètes. `utm_term` n’est pas indispensable au premier lot : le laisser hors périmètre tant qu’un besoin précis n’est pas identifié.

**Important : lire les paramètres déjà présents ne signifie pas en ajouter. Ne pas décorer les liens Étoilys avec des UTM et ne pas propager `oppref` dans tous les liens internes.**

### F08 — Plusieurs défauts de contexte et de déduplication faussent les événements

**Priorité : P1. Preuve : constaté / conséquence déduite.**

`acceptAnalyticsConsent()` force un pageview après acceptation, même lorsque l’utilisateur avait déjà accepté et reclique sur `Accepter` dans les préférences. Il ne faut pas transformer chaque validation du menu en nouvelle visite de la page. [R5]

`trackEvent` détermine son contexte de page après une attente d’initialisation. Lors d’une navigation rapide pendant le chargement du SDK, le clic peut hériter du chemin de destination plutôt que de celui sur lequel il a eu lieu. [R5]

Enfin, `getPageType` reconnaît principalement des chemins français. `/en/contact` n’est pas classé comme `/contact`, et les pages d’accueil localisées ne sont pas reconnues par le test `pathname === '/'`. Le `locale` d’acquisition décrit l’entrée, pas nécessairement la langue de chaque événement. [R5, R6]

**Correction prescrite :** ne déclencher le pageview de transition que lors d’un passage effectif de non-consenti à consenti. Capturer synchroniquement un contexte immuable de l’événement avant tout `await`. Ajouter la langue courante de l’événement, distincte de celle de l’entrée. Dériver le type de page du registre de routes localisées existant plutôt que d’empiler des tests de chaînes français.

Ne pas confondre déduplication des effets React avec suppression de vrais retours sur une page. Garder un contrat unique pour les pageviews SPA et les pageviews au changement de consentement.

### F09 — Un formulaire démarré avant accord peut perdre définitivement son événement de démarrage

**Priorité : P1. Preuve : constaté sur le formulaire de demande de classement.**

`hasTrackedFormStarted.current` passe à `true` après l’appel à `trackFormStarted`, même si le consentement absent fait ignorer cet événement. Une acceptation ultérieure ne réarme pas ce marqueur. Le formulaire peut donc envoyer une tentative et un succès consentis sans événement de démarrage disponible pour le funnel. [R8]

**Correction prescrite :** faire correspondre ce marqueur à un démarrage effectivement accepté par le pipeline de mesure, pas à une simple tentative d’appel. Une interaction effectuée après accord doit pouvoir créer le démarrage consenti si aucun démarrage consenti n’a encore été pris en compte. Ne pas rejouer les frappes ni reconstituer rétroactivement le début non consenti.

Le helper peut retourner synchroniquement un statut d’admission dans le pipeline, distinct d’une garantie de livraison réseau. Vérifier les autres marqueurs `hasTracked…` dans les formulaires et simulateurs. Corriger ceux qui présentent réellement le même défaut, sans réécrire leurs règles métier.

### F10 — Le filtre PostHog laisse une surface automatique trop large

**Priorité : P1. Preuve : constaté ; aucune fuite réelle revendiquée.**

Les propriétés métier sont filtrées, mais `sanitizePostHogProperties` autorise largement les clés commençant par `$` et recopie certaines valeurs sans inspection récursive. Des structures imbriquées telles que `$set` ou `$set_once`, si le SDK les fournit, ne sont pas couvertes par la même règle que les propriétés métier. [R5]

**Correction prescrite :** une liste autorisée explicite pour les propriétés SDK utiles, compatible avec le fonctionnement vérifié du SDK ; traiter ou supprimer explicitement les objets imbriqués ; conserver les identifiants techniques de session nécessaires aux analyses consenties. Écrire des tests sur des charges utiles synthétiques avec coordonnées, URL signées et valeurs imbriquées.

Ne pas supprimer au hasard toutes les propriétés `$` : cela pourrait casser les sessions ou d’autres fonctions. Ne pas affirmer que le filtre d’événements protège le replay : celui-ci est désactivé et demanderait son propre contrôle de capture et de transport.

Le choix du host `f.etoilys.fr` et `ui_host` européen ne prouve ni l’absence de logs IP ni toute la configuration d’hébergement. Le filtre JavaScript ne supprime pas les métadonnées reçues par l’infrastructure réseau.

### F11 — Une panne de chargement peut bloquer le tracking jusqu’au prochain rechargement

**Priorité : P1, après les défauts visibles. Preuve : constaté.**

La promesse d’import PostHog conserve son échec en mémoire. Côté OpenAI, l’état “initialisé” est posé après la mise en file et l’injection, avant que le chargement du script ait effectivement réussi ; le contrat reconnaît l’absence de nouvelle tentative dans la même session SPA après échec. [R5, R7, R11]

**Correction prescrite :** distinguer `idle`, `loading`, `ready`, `failed`, conserver l’idempotence et permettre une nouvelle tentative bornée lors d’une action ultérieure autorisée. Remettre à zéro une promesse d’import rejetée. Ne pas créer un intervalle de retry permanent ni une file persistante de comportements préconsentement. Contrôler le consentement effectif après les étapes asynchrones et avant admission d’un événement.

Les exceptions analytics ne doivent jamais casser un formulaire, même lorsque l’accès au stockage ou le chargement du SDK échoue.

### F12 — Les exclusions des visites internes et de développement ne sont pas homogènes

**Priorité : P1. Preuve : constaté.**

PostHog dispose d’exclusions internes et de développement. OpenAI Ads n’applique pas les mêmes exclusions dans son module : si un Pixel est configuré dans un environnement de test, des conversions de test peuvent être admises après accord. Il n’est pas établi que cela se produise actuellement. [R5, R7, R13]

**Correction prescrite :** définir une politique d’environnement commune, tout en gardant les deux consentements indépendants. Par défaut, pas de données de développement ou preview dans les projets de production. Prévoir un projet/Pixel de test ou une admission explicitement contrôlée. Conserver un mode debug local qui ne journalise ni identifiants de clic ni coordonnées.

### F13 — `oppref` est déjà persisté avant accord, et le refus ne purge pas cette copie

**Priorité : arbitrage A3 préalable à toute modification de cette politique. Preuve : constaté.**

`initOpenAiAdsPixelIfConsented` appelle inconditionnellement `captureLandingOppref`. La valeur est copiée dans `sessionStorage` et peut survivre à un F5. `refuseAdvertisingConsent` n’efface pas cette copie. Ce comportement a été consciemment documenté pour sauver l’attribution publicitaire ; ce n’est pas un oubli que Codex doit “corriger” sans signaler le changement. [R7, R11]

Son caractère temporaire et l’absence d’envoi immédiat ne suffisent pas à qualifier ce stockage de strictement nécessaire au service demandé. Le cadre des traceurs ne se limite pas aux cookies HTTP. Il faut traiter ce choix comme un risque à justifier, pas comme une exemption acquise par l’usage de `sessionStorage`. [S2, S3]

**Recommandation :** avant accord, conserver au plus un contexte volatile du document, sans copie de secours persistante ni transfert à PostHog. Après accord, laisser le Pixel utiliser son mécanisme documenté et ne conserver une copie maison que pour une nécessité réelle de chargement. En cas de refus ou retrait, purger le contexte publicitaire maison. Ne pas préserver volontairement un clic refusé pour le ressusciter lors d’un accord ultérieur.

Le passage en mémoire réduit la persistance ; il n’établit pas, à lui seul, une exemption pour n’importe quelle lecture ou utilisation publicitaire d’une URL. Cette préparation doit rester sans transmission publicitaire avant accord et être incluse dans l’analyse de la finalité. Le résultat n’est pas une attribution parfaite : un F5 avant accord peut perdre le contexte. Le justifier techniquement plutôt que promettre simultanément absence de stockage et persistance au rechargement. Une API serveur ne dispense pas, par elle-même, d’analyser le consentement et l’usage publicitaire.

### F14 — La réinjection temporaire dans l’URL repose sur une hypothèse de lecture du SDK

**Priorité : P1 dans le périmètre publicitaire. Preuve : constaté et reconnu dans le contrat.**

La copie de `oppref` est réinjectée par `replaceState`, puis retirée au `load` du script. La documentation interne précise que le moment exact de lecture par le SDK n’est pas garanti. Si aucun événement `load` ou `error` ne survient, la valeur peut rester visible dans l’URL. Le code évite correctement de restaurer une ancienne URL après une navigation SPA ; conserver cette protection. [R7, R11]

**Correction prescrite :** tester le SDK réel et un chargement ralenti. Préférer une API documentée si le fournisseur en expose une au moment de l’implémentation ; ne pas inventer un champ `oppref` pour `init` ou `measure`. À défaut, garder l’adaptateur minimal, documenter sa limite et décider du comportement en cas de chargement abandonné. Ne pas ajouter un timeout de nettoyage au hasard qui ferait perdre le clic avant sa lecture.

### F15 — La fenêtre de préférences n’est pas suffisamment encadrée comme modale

**Priorité : P1 avec la refonte UI. Preuve : protections absentes du composant ; débordements réels non mesurés.**

Le composant déplace le focus vers la fermeture et gère Échap, mais ne réalise pas de confinement du focus, de retour au déclencheur, de neutralisation de l’arrière-plan ou de blocage explicite du scroll. Il ne contient pas non plus de hauteur maximale avec zone scrollable pour les petits écrans. `aria-modal="true"` n’ajoute pas ces comportements. [R4, S7]

**Correction prescrite :** réutiliser une primitive accessible existante si elle est effectivement présente ; sinon construire une petite primitive sur `<dialog>` avec `showModal`, et la tester. Ne pas importer une bibliothèque UI complète pour ce seul écran. Faire défiler le contenu de la modale, pas l’arrière-plan ; garder les actions accessibles ; rendre le focus au déclencheur lorsque celui-ci existe encore.

### F16 — Les tests actuels ne couvrent pas le défaut signalé

**Priorité : P0 pour la non-régression. Preuve : constaté dans le fichier audité.**

`CookieConsentManager.test.tsx` utilise `render` avec des modules analytics/publicité mockés. Les assertions couvrent les libellés et des actions, mais pas la production d’un HTML serveur puis son hydratation avec un consentement persistant. Elles valident également le comportement actuel d’application immédiate des cases. [R9]

**Correction prescrite :** ajouter un test de pré-rendu/hydratation et un test de chargement sur le build pré-rendu ; remplacer les assertions qui figent l’ancien comportement de préférences. Un test qui attend simplement la disparition finale de la bannière ne protège pas contre un flash.

### F17 — La documentation et les textes publics doivent décrire la configuration réellement retenue

**Priorité : P1, bloquante avant mise en service d’un périmètre élargi. Preuve : constaté.**

Le code français actuel contient déjà OpenAI Ads et une information sur la correspondance avancée. Il ne faut donc pas demander d’ajouter une section inexistante en se fondant sur l’ancienne page publique mise en cache. En revanche, la date affichée reste le 10 juillet 2026, des phrases générales sur l’absence de transmission coexistent avec les nuances sur les données hachées, et le texte décrit longuement les mécaniques de tracking. [R15, R16]

Les contrats analytics/GEO ne documentent que `fr` et `en` alors que l’interface comprend aussi `nl`. La documentation GEO maintient des contrôles d’activation non confirmés. Elle doit être mise à jour avec des preuves, pas simplement marquée “terminée”. [R10, R12]

**Correction prescrite :** aligner FR/EN/NL, finalités, durées, stockage, retrait et partenaire publicitaire. Remplacer les promesses absolues par des descriptions exactes. Les durées de choix, de cookies, d’attribution et de conservation serveur sont quatre notions différentes. Vérifier les deux dernières dans les services concernés avant de les publier. Le consentement de traitement du formulaire `privacy-v1` n’est pas le consentement aux traceurs et ne doit pas être fusionné avec lui.

## 5. Ce qu’il est pertinent d’assouplir

### 5.1 Mesurer mieux après accord : oui, dans le premier chantier

La correction d’attribution, des démarrages de formulaire, des doublons et de la langue ne nécessite aucune collecte préconsentement. Ajouter des dimensions de campagne assainies après accord est un choix de produit raisonnable. Il est inutile d’envoyer noms, emails, adresses ou identifiants de simulation pour analyser quelle page mène à une demande.

Préserver les événements métier explicites. Compléter un événement manquant seulement lorsqu’il répond à une question : quel CTA, quel type de page, quel formulaire, quelle étape du simulateur, quel résultat par catégorie. Ne pas activer l’autocapture globale pour éviter de faire cet inventaire.

Le maintien de buckets pour les montants ou caractéristiques individuelles n’est pas en soi une perte commerciale problématique : comparer d’abord le besoin analytique réel avec la granularité déjà disponible.

### 5.2 Une audience limitée dès l’arrivée : piste pertinente, mais autre qualification

La CNIL prévoit une exemption pour certaines mesures d’audience limitées, pour le compte exclusif de l’éditeur et produisant des statistiques anonymes, sans les recoupements incompatibles avec ce périmètre. La configuration effective et les engagements du prestataire comptent ; une certification CNIL n’est pas à revendiquer. [S4]

**Conséquence pour Étoilys :** si le dispositif remplit réellement ce cadre, attendre un refus explicite avant de compter n’est pas une nécessité logique. La règle actuelle « rien tant qu’aucun choix, puis un événement après refus » est un choix restrictif du contrat maison. Sa suppression peut être envisagée dans un dispositif requalifié, pas comme une exception discrète au consentement détaillé.

PostHog distingue `on_reject`, qui attend une décision, et `always`. Son comptage sans cookie utilise un hash serveur incluant IP et user-agent, et demande un réglage serveur du projet. L’absence de cookie ne vaut donc pas validation juridique automatique. Les limites de décompte quotidien et de collision excluent aussi la promesse de visiteurs uniques parfaitement mesurés. [S5]

**Cible recommandée pour ce lot optionnel :** comptages de consultation par chemin normalisé, langue et période, éventuellement dimensions additionnelles précisément justifiées ; pas de rapprochement avec des personnes, des clics publicitaires ou des conversions individuelles. Un pipeline séparé, voire un projet séparé, facilite la preuve de séparation. Éviter de construire une seconde usine analytics sans bénéfice.

L’option existante peut être conservée hors activation élargie pendant la qualification. Ni un `VITE_ENABLE_COOKIELESS_AUDIENCE=true`, ni `cookieless_mode: 'always'`, ni un reverse proxy ne remplacent ce travail.

### 5.3 Connaître toutes les demandes reçues : distinguer le métier de l’attribution

Pour piloter l’activité, la référence doit être le nombre de demandes réellement enregistrées dans le système métier, y compris celles de visiteurs n’ayant pas accepté les traceurs. Une agrégation de ces demandes n’est pas automatiquement un rapprochement publicitaire ; son périmètre et sa base doivent rester ceux du traitement métier concerné.

En revanche, transmettre ces demandes à une régie avec des identifiants pour retrouver leurs auteurs est un autre traitement. Ne pas déguiser une attribution publicitaire en simple comptabilité serveur. Ne pas diviser les conversions d’une population consentie par les visites d’une population cookieless pour annoncer un taux de conversion global.

Un éventuel chantier CAPI doit être distinct : changement backend séparé, mêmes finalités autorisées, secret côté serveur, succès métier confirmé et déduplication avec le Pixel. Son absence aujourd’hui n’est pas un bug du mode Pixel-only. [S6, R11]

### 5.4 Durée, matching et replay : pas de restriction supplémentaire par défaut

Les six mois de conservation des choix sont une bonne pratique recommandée par la CNIL, appréciée au cas par cas, et non un délai légal universel imposé exactement à 183 jours. Conserver le réglage actuel est simple ; l’allonger ne corrigerait pas le flash ni l’attribution. [S8]

La correspondance avancée peut avoir un intérêt de mesure après accord publicitaire. La documentation OpenAI prévoit la détection et le hachage local de champs pris en charge lorsqu’elle est activée. Le réglage effectif n’a pas été obtenu ici. Ne pas assimiler hachage et disparition de tous les enjeux de données personnelles. [S6]

L’option `opt_out` d’un événement OpenAI concerne une personnalisation utilisateur future ; ce n’est pas le bouton de refus de mesure. Ne pas changer cette option par inadvertance dans une refonte de bannière. Maintenir le replay désactivé pour les lots initiaux ; son activation demanderait des objectifs, un périmètre, un masquage et des tests dédiés. [S6, R5, R11]

## 6. Architecture cible minimale

### 6.1 Responsabilités

Créer un petit module `src/utils/consent.ts` comme source de vérité du document. Il lit, valide, migre, mémorise et publie les choix. Garder `analytics.ts` et `openAiAds.ts` comme adaptateurs distincts de collecte. `CookieConsentManager` ne doit plus contenir une politique parallèle de tracking.

Conserver `cookiePreferences.ts` comme point d’ouverture public, ou le faire déléguer au nouveau contrôleur sans casser `CookiePreferencesButton` et les liens du footer. Ne pas créer deux gestionnaires concurrents.

Le découpage conseillé comprend seulement : le store de consentement, les deux adaptateurs existants, la bannière/modale et un fichier de contenus FR/EN/NL. Pas de Redux, de bus distribué ni de serveur de consentement ajouté par défaut.

### 6.2 Schéma proposé

Les noms ci-dessous sont une proposition de contrat à implémenter, pas des API déjà existantes :

```ts
type ConsentStatus = 'accepted' | 'refused';

type PurposeChoice = {
  status: ConsentStatus;
  decidedAt: number;
  policyVersion: string;
};

type ConsentRecordV2 = {
  schemaVersion: 2;
  analytics: PurposeChoice | null;
  advertising: PurposeChoice | null;
  minimalAudienceOptOut: boolean;
};

type ConsentSnapshot =
  | { phase: 'loading' }
  | {
      phase: 'ready';
      record: ConsentRecordV2;
      needsDecision: boolean;
      persistence: 'available' | 'unavailable';
    };
```

Une seule clé JSON nouvelle, par exemple `etoilys_consent_v2`, permet d’enregistrer une décision complète. Les dates restent propres à chaque finalité pour migrer fidèlement les anciennes valeurs. L’expiration effective est calculée selon la politique courante, sans prolonger automatiquement la durée à chaque visite.

### 6.3 Migration obligatoire

Lire les quatre clés historiques de choix et de date, ainsi que l’opposition minimale. Conserver séparément chaque choix valide et sa date. Une valeur absente, invalide ou expirée devient `null` pour cette finalité seulement. Ne jamais faire hériter la publicité du consentement analytics. Ne jamais transformer un refus en accord.

Une modification purement éditoriale ou visuelle ne rend pas un ancien accord invalide par principe. Versionner les changements de finalité, pas chaque déploiement. Ne supprimer les anciennes clés qu’après réussite de la nouvelle écriture. Documenter le rollback : une ancienne version qui ne connaît pas la clé v2 ne doit pas réactiver un ancien accord conservé dans une clé obsolète. La stratégie recommandée est un rollout avec lecture de migration et nettoyage vérifié, puis un rollback vers une version qui sait lire v2, ou un retour explicite à l’état inconnu sans résurrection d’accord.

### 6.4 Application des transitions

Une action publie immédiatement un snapshot mémoire, tente une écriture, puis applique les transitions pertinentes aux adaptateurs. L’échec de persistance ne revient pas à l’ancien accord dans ce document.

Un changement publicitaire seul n’appelle pas l’opt-in analytics et ne génère pas de pageview. Une sauvegarde inchangée ne réinitialise pas les SDK. Un retrait appelle les mécanismes d’arrêt documentés, nettoie le contexte maison concerné et invalide les tâches asynchrones devenues inéligibles.

Pour les promesses d’import et d’initialisation, utiliser un compteur de transition ou un snapshot d’autorisation vérifié après attente. La logique reste locale au document ; pas de file de replay des actions antérieures au consentement.

Le store traite les événements du même document, `storage` et les retours de page. Les dates doivent être finies, cohérentes et non futures. L’interface affiche un choix effectif expiré comme à renouveler ; elle ne prétend pas maintenir un accord parce que le SDK est déjà chargé.

## 7. Copy exacte proposée

Ces textes sont le contenu cible du premier lot, **sans élargissement du périmètre de collecte**. Ils remplacent la copy technique du composant. Ils ne dispensent pas de mettre à jour les informations détaillées de la politique.

### 7.1 Bannière — français

**Titre :** Vos choix de cookies

**Texte :**

> Nous utilisons des cookies pour comprendre comment vous utilisez le site et mesurer l’efficacité de nos publicités. Vous pouvez tout accepter, tout refuser ou choisir ce que vous autorisez.

**Actions :** `Tout refuser` · `Personnaliser` · `Tout accepter`

**Lien secondaire :** `En savoir plus`

Ce lien doit conduire directement aux détails des finalités et outils, pas obliger à parcourir toute une page juridique avant de trouver PostHog et OpenAI Ads. Le premier écran nomme les finalités ; les détails et partenaires restent immédiatement accessibles. [S2]

Ne pas ajouter « Pour une meilleure expérience » sans expliquer le but réel, « cookies délicieux », « anonymes » par réflexe, ni une fausse promesse de personnalisation du site. Étoilys n’a pas besoin d’une mascotte de biscuit.

### 7.2 Modale — français

**Titre :** Vos préférences de cookies

**Introduction :**

> Choisissez ce que vous autorisez. Vous pourrez modifier vos choix à tout moment depuis le bas de page.

| Bloc                   | Description exacte                                                                             | Contrôle                                                           |
| ---------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Essentiels             | Ils permettent au site de fonctionner, de sécuriser les formulaires et de mémoriser vos choix. | Badge `Toujours actifs`, pas de faux switch désactivable.          |
| Améliorer le site      | Comprendre les pages consultées et l’utilisation de nos formulaires et simulateurs.            | Switch analytics. Mention secondaire `Outil utilisé : PostHog`.    |
| Mesurer nos publicités | Savoir si nos publicités donnent lieu à une demande de classement.                             | Switch publicité. Mention secondaire `Outil utilisé : OpenAI Ads`. |

**Bouton principal :** `Enregistrer mes choix`  
**Actions globales secondaires :** `Tout refuser` et `Tout accepter`  
**Lien :** `Politique de confidentialité`  
**Libellé accessible de fermeture :** `Fermer les préférences`  
**Confirmation après enregistrement :** `Vos choix ont été enregistrés.`  
**Confirmation si la persistance échoue :** `Vos choix sont appliqués pour cette visite, mais n’ont pas pu être mémorisés.`

Les statuts visibles des switches sont `Activé` / `Désactivé`. Supprimer les lignes répétées « Consentement détaillé : accepté » : elles ne doivent pas concurrencer le contrôle.

La mention des essentiels décrit les fonctions nécessaires ; l’inventaire technique doit vérifier les mécanismes réellement employés. Ne pas classer `oppref` comme essentiel sous prétexte qu’il aide la publicité.

### 7.3 Détails publicitaires conditionnels

Si le matching automatique est activé et retenu, placer sous une ouverture **Détails** :

> OpenAI Ads peut utiliser une version hachée de certaines coordonnées saisies dans le formulaire pour relier une demande à une publicité. Le détail des données utilisées figure dans notre politique de confidentialité.

Si le matching est désactivé, ne pas afficher cette phrase au conditionnel éternellement : décrire la configuration réelle dans la politique. Ne pas laisser Codex inventer la liste exacte des champs collectés ; elle doit provenir du réglage et du contrôle du SDK.

### 7.4 Variante seulement si une mesure limitée indépendante est activée et qualifiée

Ajouter une section :

**Titre :** Statistiques de fréquentation sans cookies

**Description :**

> Un comptage limité des pages consultées nous aide à suivre la fréquentation du site. Vous pouvez aussi le désactiver.

Afficher cette section uniquement lorsque ce traitement existe réellement. Son switch pilote l’opposition correspondante, distincte du consentement détaillé. La description finale doit correspondre à la collecte retenue : si l’on conserve uniquement `audience_landed`, remplacer « pages consultées » par « pages d’entrée ».

Si cette mesure demeure après le refus des cookies, ajouter au premier niveau :

> Des statistiques limitées, sans cookies, restent actives. Vous pouvez aussi les désactiver dans les préférences.

Dans cette variante, utiliser `Refuser les cookies` et `Accepter les cookies`, ou faire en sorte que `Tout refuser` coupe réellement toutes les mesures facultatives. C’est A6 ; ne pas modifier le sens d’un bouton sans modifier son libellé et ses tests.

### 7.5 Versions anglaise et néerlandaise — socle

Le français reste la langue de discussion du projet ; les textes suivants sont uniquement les traductions à intégrer aux routes existantes.

| Clé                   | English                                                                                                                                              | Nederlands                                                                                                                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bannerTitle           | Your cookie choices                                                                                                                                  | Uw cookiekeuzes                                                                                                                                                                              |
| bannerText            | We use cookies to understand how you use the site and measure the effectiveness of our ads. You can accept all, reject all or choose what you allow. | We gebruiken cookies om te begrijpen hoe u de website gebruikt en om de effectiviteit van onze advertenties te meten. U kunt alles accepteren, alles weigeren of zelf kiezen wat u toestaat. |
| rejectAll             | Reject all                                                                                                                                           | Alles weigeren                                                                                                                                                                               |
| customize             | Customize                                                                                                                                            | Aanpassen                                                                                                                                                                                    |
| acceptAll             | Accept all                                                                                                                                           | Alles accepteren                                                                                                                                                                             |
| learnMore             | Learn more                                                                                                                                           | Meer informatie                                                                                                                                                                              |
| preferencesTitle      | Your cookie preferences                                                                                                                              | Uw cookievoorkeuren                                                                                                                                                                          |
| preferencesIntro      | Choose what you allow. You can change your choices at any time using the link at the bottom of the page.                                             | Kies wat u toestaat. U kunt uw keuzes op elk moment wijzigen via de link onderaan de pagina.                                                                                                 |
| necessaryTitle        | Essential                                                                                                                                            | Noodzakelijk                                                                                                                                                                                 |
| necessaryText         | These help the site work, keep forms secure and remember your choices.                                                                               | Deze zorgen ervoor dat de website werkt, formulieren worden beveiligd en uw keuzes worden onthouden.                                                                                         |
| alwaysActive          | Always active                                                                                                                                        | Altijd actief                                                                                                                                                                                |
| analyticsTitle        | Improve the site                                                                                                                                     | De website verbeteren                                                                                                                                                                        |
| analyticsText         | Understand which pages are viewed and how our forms and simulators are used.                                                                         | Begrijpen welke pagina’s worden bekeken en hoe onze formulieren en simulators worden gebruikt.                                                                                               |
| adsTitle              | Measure our ads                                                                                                                                      | Onze advertenties meten                                                                                                                                                                      |
| adsText               | Understand whether our ads lead to a classification request.                                                                                         | Nagaan of onze advertenties tot een classificatieaanvraag leiden.                                                                                                                            |
| toolLabel             | Tool used                                                                                                                                            | Gebruikte tool                                                                                                                                                                               |
| save                  | Save my choices                                                                                                                                      | Mijn keuzes opslaan                                                                                                                                                                          |
| close                 | Close preferences                                                                                                                                    | Voorkeuren sluiten                                                                                                                                                                           |
| enabled               | On                                                                                                                                                   | Aan                                                                                                                                                                                          |
| disabled              | Off                                                                                                                                                  | Uit                                                                                                                                                                                          |
| confirmation          | Your choices have been saved.                                                                                                                        | Uw keuzes zijn opgeslagen.                                                                                                                                                                   |
| temporaryConfirmation | Your choices apply to this visit, but could not be saved.                                                                                            | Uw keuzes gelden voor dit bezoek, maar konden niet worden opgeslagen.                                                                                                                        |
| details               | Details                                                                                                                                              | Details                                                                                                                                                                                      |
| privacy               | Privacy policy                                                                                                                                       | Privacybeleid                                                                                                                                                                                |

Tout texte conditionnel ajouté pour A2, A4 ou A6 doit également être traduit dans le même commit. Ne jamais laisser un paragraphe français dans le menu anglais ou néerlandais. Ne pas déployer une variante supplémentaire si ses traductions ne sont pas prêtes.

## 8. Direction UI précise

### 8.1 Inspiration retenue, sans achat imposé

La documentation Axeptio montre l’importance de la personnalisation visuelle et du moment d’apparition ; Didomi distingue le premier écran des préférences par finalité et recommande un accès permanent à ces préférences. Ce sont ces principes que l’on reprend, pas leurs slogans, leurs promesses de performance ni l’ensemble de leurs fonctionnalités. Aucun benchmark chiffré de taux d’acceptation n’a été réalisé ici. [S9, S10]

**Décision :** une petite carte cohérente avec l’identité Étoilys et une modale simple. Pas de parcours de trois écrans, de liste de centaines de partenaires, d’installation TCF ou de mur de consentement sans nécessité.

### 8.2 Bannière

Conserver les tokens `surface`, `paper`, `ink`, `muted`, `rounded-editorial` et la hiérarchie typographique du site. Utiliser la police de titre existante sans transformer le bloc en nouvelle section marketing.

Cible proposée : carte en bas d’écran, largeur desktop maximale de 640 à 720 px, marges externes de 24 px, alignement à valider avec les CTA flottants existants. Sur mobile : marges latérales de 16 px, padding interne de 16 à 20 px et prise en compte de la zone de sécurité. Texte courant de 14 à 16 px, interligne confortable ; aucune information essentielle en caractères minuscules.

Les boutons accepter/refuser ont la même taille et une lisibilité comparable. Leur contraste ne doit pas rendre le refus quasi invisible. `Personnaliser` reste immédiatement accessible. Sur petit écran, deux boutons globaux de même largeur peuvent être associés à une action de personnalisation sur sa propre ligne si cela évite des libellés tronqués.

Pas d’overlay bloquant au premier niveau. Pas de prise de focus automatique qui détourne un utilisateur déjà en train de lire ou de remplir un champ. Animation facultative courte à l’entrée, désactivée avec `prefers-reduced-motion`, seulement après résolution du consentement.

Préserver ou remplacer proprement `--etoilys-cookie-banner-offset`. Le `scrollPaddingBottom` existant aide les défilements ciblés mais ne réserve pas à lui seul un espace réel sous tous les contenus. Vérifier que la bannière ne cache ni Envoyer, ni un CTA flottant, ni les contrôles de simulateur.

### 8.3 Préférences

Sur desktop : fenêtre de 560 à 640 px maximum. Sur mobile : panneau adapté au viewport, hauteur maximale basée sur `100dvh`, contenu scrollable et zone d’actions toujours atteignable. Pas de scroll horizontal à 320 px ; vérifier le zoom à 200 %.

Espacer les trois blocs, éviter les encadrés imbriqués. Les outils sont indiqués en second niveau, les statuts ne sont pas répétés en prose. Les descriptions ne dépassent pas quelques lignes. Cible de confort : contrôles et fermeture de 44 × 44 px au moins.

La modale doit confiner le focus, gérer Échap, restituer le focus et empêcher les interactions avec le fond. La fermeture annule le brouillon sans toast de succès. Une sauvegarde valide ferme le panneau avec une annonce discrète `aria-live="polite"` ; pas de seconde fenêtre de confirmation. [S7]

## 9. Plan d’implémentation pour Codex

### Lot 1 — Consentement fiable et nouvelle interface

**Périmètre : site public uniquement.** Corriger F01 à F05, F15 et F16 ; appliquer la copy du socle ; préparer la migration.

Fichiers à modifier ou créer :

- `src/components/layout/CookieConsentManager.tsx` et son test ;
- nouveau `src/utils/consent.ts` et tests unitaires ;
- éventuellement `src/i18n/cookieConsentContent.ts` pour extraire FR/EN/NL ;
- `src/utils/analytics.ts` et `src/utils/openAiAds.ts` pour déléguer le consentement au store ;
- `src/main.tsx` pour l’orchestration idempotente, sans changer le modèle de rendu du site ;
- `src/utils/cookiePreferences.ts` et les boutons existants uniquement si leur contrat doit évoluer ;
- un test de pré-rendu/hydratation et un test navigateur sur le build réel.

Ne pas modifier les calculs des simulateurs, les appels métier, les règles Turnstile, les champs ou le contrat des formulaires. Ne pas changer le flag de mesure minimale ni AAM/replay par commodité. Toute mise à jour A3 doit être identifiée comme telle dans la PR.

### Lot 2 — Acquisition et événements consentis

Corriger F06 à F12. Établir la frontière de session avec la version réellement installée du SDK. Réparer l’attribution après F5, les types de page localisés, les doublons d’acceptation et le démarrage du formulaire. Ajouter uniquement les dimensions retenues de campagne, avec contrat v2/v4 documenté selon la nomenclature choisie.

Préserver les noms d’événements existants lorsque leur sémantique ne change pas. Un nouveau champ est préférable à un changement silencieux du sens d’un ancien champ. Les changements de définition de canal et de funnel doivent avoir une date d’entrée en vigueur dans la documentation et les tableaux de bord.

Une dépendance déclarée avec `^` ne garantit pas la version résolue. Vérifier le lockfile et les types du SDK avant de toucher à `defaults`, à la liste des propriétés techniques ou aux API de session. Ne pas mettre à jour PostHog et modifier toutes les règles de tracking dans une seule PR sans nécessité.

### Lot 3 — Audience indépendante et autres options

Ce lot ne démarre qu’après arbitrages. Pour A2 : préciser données, finalité, destinataire, stockage, opposition, absence de recoupement, rétention et traitement des métadonnées réseau. Confirmer les paramètres PostHog et du proxy, puis seulement activer la variante retenue.

Pour A4 : vérifier le matching réel et tester les charges utiles avant modification de copy. Pour A5 : un replay éventuel nécessite une spécification séparée ; le présent rapport n’autorise pas son activation.

Le backend ne doit pas être ajouté au lot public : un éventuel compteur métier ou CAPI fait l’objet d’un ticket distinct dans son dépôt, avec contrat explicite entre front et back.

### Documentation à livrer dans les mêmes lots

Mettre à jour `docs/tech/analytics-tracking-contract.md`, `docs/tech/openai-ads-pixel-contract.md`, `docs/seo/geo-aeo/geo-aeo-measurement.md`, les textes de confidentialité FR/EN/NL et leurs dates. Conserver la distinction entre conformité envisagée, contrôles exécutés et réglages encore inconnus. Archiver les versions de notice, leur configuration, le code de recueil et des tests datés ; une valeur locale et un timestamp ne constituent pas, à eux seuls, tout le dossier de preuve. Ne pas créer pour autant une journalisation nominative des visiteurs qui refusent.

## 10. Tests de réception obligatoires

### 10.1 Rendu et préférences

| Cas                                            | Résultat attendu                                                                                 |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| HTML pré-rendu sans JavaScript                 | Pas de bannière cookie incluse par défaut ; le contenu principal reste pré-rendu.                |
| Nouvelle visite, JavaScript disponible         | Bannière affichée après résolution ; aucun SDK optionnel admis sans choix.                       |
| Refus valide puis F5, chargement ralenti       | Zéro flash, zéro erreur d’hydratation liée au composant.                                         |
| Accord valide puis F5                          | Pas de bannière ; collecte selon les seules finalités accordées.                                 |
| Ancien choix analytics, publicité absente      | Analytics conservé ; publicité non déduite ; demande de choix cohérente.                         |
| Personnaliser puis analytics oui/publicité non | Aucune application avant Save ; état exact après Save et au F5 suivant.                          |
| Personnaliser puis analytics non/publicité oui | Fonctionnement symétrique, aucune collecte PostHog détaillée.                                    |
| Modifier puis fermer/Échap/fond                | Aucun changement effectif ; retour du focus.                                                     |
| Enregistrer sans rien changer                  | Aucun nouveau pageview ni réinitialisation inutile.                                              |
| Navigations FR/EN/NL                           | Langue correcte, choix identiques, pas de nouveau consentement lié au seul changement de langue. |
| 320 px, 375 px, landscape, zoom 200 %          | Pas de contrôle inaccessible, ni scroll horizontal ou fond encore interactif.                    |
| Clavier et lecteur d’écran                     | Focus contenu, titres/contrôles nommés, fermeture et confirmation compréhensibles.               |

Le test anti-flash doit inspecter l’état **avant** hydratation ou une séquence de frames. Un `waitFor` qui constate une bannière finalement absente ne suffit pas.

### 10.2 Stockage, migration et transitions

Tester getter `localStorage` et getter `sessionStorage` qui lèvent, `getItem` qui lève, `setItem` qui échoue avec un ancien accord déjà présent, JSON invalide, date future, expiration, clés partielles et deux finalités datant de moments différents. Le refus doit rester effectif dans le document après échec d’écriture.

Tester la migration, son échec et la stratégie de rollback. Ne jamais prolonger les dates historiques. Simuler un refus dans un autre onglet, un retour BFCache et un retour d’onglet : interface et adaptateurs doivent converger vers la décision effective, sans autorisation implicite.

Simuler acceptation, chargement SDK ralenti, puis retrait avant fin de chargement. Aucun travail encore en attente ne doit être admis sur la base de l’ancien accord. Tester ensuite une vraie réacceptation sans doubler l’initialisation.

### 10.3 Qualité analytics

| Cas                                                             | Résultat attendu                                                                         |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Pageview initial sous StrictMode et SPA                         | Une occurrence par consultation définie par le contrat, pas une par effet React.         |
| Accord analytics accordé sur une page                           | Un seul pageview de transition pour cette page.                                          |
| Accord déjà actif et nouvelle sauvegarde                        | Aucun pageview supplémentaire dû à la sauvegarde.                                        |
| Arrivée campagne, accord, SPA vers formulaire, F5               | Acquisition initiale conservée dans la même session ; chemin courant distinct.           |
| Nouvelle session                                                | Contexte renouvelé selon le contrat, sans héritage infini.                               |
| Source IA et média payant                                       | Distinction du trafic IA organique et payant.                                            |
| Clic puis navigation pendant import SDK                         | `source_path` reste celui de l’interaction.                                              |
| Formulaire commencé sans accord puis interaction après accord   | Démarrage consenti possible ; aucune reprise de contenu antérieur.                       |
| Échec API ou validation du formulaire                           | Pas de `form_submit_succeeded` ni de `lead_created`.                                     |
| Succès réel du formulaire                                       | Une occurrence logique de chaque événement autorisé, sans fusion des deux consentements. |
| Coordonnées / URL signée / identifiant dans payload synthétique | Valeurs interdites supprimées, y compris objets SDK imbriqués.                           |
| Navigation localisée                                            | `page_type`, langue d’événement et langue d’entrée corrects.                             |
| Import échoué puis nouvelle action autorisée                    | Retry borné possible, sans boucle de chargement.                                         |

### 10.4 Publicité et mesure minimale

Tester les origines PostHog configurées, le proxy et les origines documentées du Pixel (`bzrcdn.openai.com`, `bzr.openai.com`) avec les outils réseau. Ne pas interpréter des appels métier ou Turnstile nécessaires comme une fuite analytics.

Pour OpenAI : sans accord, pas de chargement de Pixel ni de conversion ; selon A3, vérifier aussi l’absence de copie persistante préconsentement. Après retrait, purge maison et arrêt documenté du SDK. Tester `oppref` à l’arrivée, après navigation SPA, lors d’un F5 avant/après accord, sur échec et sur chargement ralenti. Ne pas envoyer d’identifiant de clic réel dans les traces de recette.

Si la mesure minimale reste inactive, aucune case ne prétend qu’elle compte. Si elle est activée : vérifier le flag de build, le réglage serveur requis, la présence réelle des seuls champs autorisés à l’ingestion et le respect de l’opposition. Ne pas mélanger cette population avec les funnels consentis.

Tester les exclusions internes/preview. Aucune soumission réelle en production pour la recette : utiliser une API simulée ou un environnement isolé, sans générer de demande client ni polluer une campagne.

### 10.5 Commandes et livrables de recette

Exécuter les commandes du dépôt :

```sh
npm run typecheck
npm run lint
npm run test:run
npm run build:seo
```

Puis lancer le preview du build pré-rendu et les scénarios Playwright. Ajouter la commande de test navigateur appropriée au dépôt si elle n’existe pas déjà ; ne pas annoncer un script inexistant comme un prérequis actuel.

Livrer un résultat réel pour chaque commande, quelques captures avant/après desktop/mobile, une preuve anti-flash et un relevé réseau expurgé pour inconnu/refus/accord personnalisé/retrait. Toute étape non exécutée reste explicitement “non exécutée”.

## 11. Mise en production et mesure des gains

Faire des PR distinctes pour les lots. D’abord stabiliser l’interface et le consentement, ensuite les dimensions et événements. L’audience indépendante ne s’active qu’après preuve de qualification et recette. Les variables Vite sont intégrées au build : un changement de configuration peut nécessiter un nouveau build/déploiement ; ne pas présenter le flag existant comme un bouton d’arrêt instantané à distance.

Comparer avant/après sans promettre de gain chiffré : stabilité de la bannière, présence d’acquisition sur les événements consentis, proportion de sources `direct` inexpliquées, cohérence démarrage/tentative/succès, absence de doublons et nombre de demandes métier. Documenter les ruptures de définition pour ne pas confondre une meilleure instrumentation avec une hausse réelle d’activité.

La mesure de l’acceptation de la bannière elle-même ne doit pas créer une nouvelle collecte nominative préconsentement. Utiliser les mécanismes de preuve et compteurs agrégés justifiés retenus pour le gestionnaire, ou un protocole de test ; ne pas activer PostHog détaillé avant le choix pour mesurer ce choix.

Ne pas inventer un taux de perte actuel ou une promesse de “+30 % de conversions mesurées” : l’audit n’a pas accès aux historiques PostHog ni aux logs de livraison.

## 12. Consigne autonome à transmettre à Codex

> Lis ce rapport et les fichiers référencés dans le dépôt courant. Compare le SHA actuel au SHA audité ; garde les améliorations intervenues depuis et signale les écarts. Implémente les lots 1 et 2 dans des changements ciblés, après validation des arbitrages applicables. Le rapport est une spécification : ne réinvente pas la copy et ne supprime pas une protection pour faire passer un test.
>
> Corrige le flash au niveau pré-rendu/hydratation, pas par un délai CSS. Fais du consentement une source de vérité commune avec migration des anciens choix et application immédiate en mémoire même si la persistance échoue. Ajoute de vrais choix indépendants et “Enregistrer mes choix”. Préserve le pré-rendu SEO et les parcours métier.
>
> Corrige l’attribution après consentement, les contextes d’événements, les types de page localisés, les doublons d’acceptation et le démarrage du formulaire. Ne rejoue aucune action antérieure au consentement. Garde les événements métier et les exclusions de données sensibles. Pas d’autocapture globale, de replay ou de nouvelle collecte publicitaire dans ces lots.
>
> Ne tranche pas seul les arbitrages A2 à A6. N’élargis pas la mesure minimale, ne modifie pas AAM et ne change pas la conservation préconsentement de `oppref` sans identifier explicitement le choix validé. N’ajoute ni UTM aux liens ni identifiants bruts au tracking. Ne touche pas au backend, aux contrats API, à Turnstile ni au consentement de traitement des formulaires.
>
> Mets à jour les tests et les contrats, exécute typecheck/lint/tests/build pré-rendu et la recette navigateur, puis fournis la liste des changements, les résultats réels, les limites et les contrôles qui restent à faire dans les comptes tiers. Ne merge pas et ne déploie pas automatiquement.

## 13. Références vérifiables

### Dépôt — révision figée

Toutes les références suivantes désignent le même SHA audité. Les extraits effectivement lus et leurs fonctions sont cités dans le corps du rapport.

- **R1 — Bootstrap** : [src/main.tsx](https://github.com/Fgris-Etoilys/etoilys-public/blob/53b01c12e7d36f4d0a94bec03c369c19dc452631/src/main.tsx).
- **R2 — Composition et route tracking** : [Layout.tsx](https://github.com/Fgris-Etoilys/etoilys-public/blob/53b01c12e7d36f4d0a94bec03c369c19dc452631/src/components/layout/Layout.tsx) ; [AnalyticsRouteTracker.tsx](https://github.com/Fgris-Etoilys/etoilys-public/blob/53b01c12e7d36f4d0a94bec03c369c19dc452631/src/components/layout/AnalyticsRouteTracker.tsx).
- **R3 — Pré-rendu et commandes** : [scripts/prerender.ts](https://github.com/Fgris-Etoilys/etoilys-public/blob/53b01c12e7d36f4d0a94bec03c369c19dc452631/scripts/prerender.ts) — imports et configuration, début du fichier ; [package.json](https://github.com/Fgris-Etoilys/etoilys-public/blob/53b01c12e7d36f4d0a94bec03c369c19dc452631/package.json).
- **R4 — Bannière, préférences, états et handlers** : [CookieConsentManager.tsx](https://github.com/Fgris-Etoilys/etoilys-public/blob/53b01c12e7d36f4d0a94bec03c369c19dc452631/src/components/layout/CookieConsentManager.tsx).
- **R5 — Collecte, filtres et consentement analytics** : [src/utils/analytics.ts](https://github.com/Fgris-Etoilys/etoilys-public/blob/53b01c12e7d36f4d0a94bec03c369c19dc452631/src/utils/analytics.ts) — notamment stockage, sanitisation, initialisation, acquisition, `acceptAnalyticsConsent`, `rejectAnalyticsConsent`, `trackPageView`, `trackEvent`.
- **R6 — Acquisition** : [src/utils/acquisition.ts](https://github.com/Fgris-Etoilys/etoilys-public/blob/53b01c12e7d36f4d0a94bec03c369c19dc452631/src/utils/acquisition.ts) — capture, normalisation et priorité de classification.
- **R7 — Publicité** : [src/utils/openAiAds.ts](https://github.com/Fgris-Etoilys/etoilys-public/blob/53b01c12e7d36f4d0a94bec03c369c19dc452631/src/utils/openAiAds.ts).
- **R8 — Point de conversion** : [DemandeClassementForm.tsx](https://github.com/Fgris-Etoilys/etoilys-public/blob/53b01c12e7d36f4d0a94bec03c369c19dc452631/src/components/forms/DemandeClassementForm.tsx) — début du fichier et succès API jusqu’au reset du formulaire.
- **R9 — Tests des préférences** : [CookieConsentManager.test.tsx](https://github.com/Fgris-Etoilys/etoilys-public/blob/53b01c12e7d36f4d0a94bec03c369c19dc452631/src/components/layout/CookieConsentManager.test.tsx).
- **R10 — Contrat analytics** : [docs/tech/analytics-tracking-contract.md](https://github.com/Fgris-Etoilys/etoilys-public/blob/53b01c12e7d36f4d0a94bec03c369c19dc452631/docs/tech/analytics-tracking-contract.md).
- **R11 — Contrat publicitaire** : [docs/tech/openai-ads-pixel-contract.md](https://github.com/Fgris-Etoilys/etoilys-public/blob/53b01c12e7d36f4d0a94bec03c369c19dc452631/docs/tech/openai-ads-pixel-contract.md) — version, matrices, conservation `oppref`, point de conversion, limites et runbook.
- **R12 — Qualification de la mesure minimale** : [docs/seo/geo-aeo/geo-aeo-measurement.md](https://github.com/Fgris-Etoilys/etoilys-public/blob/53b01c12e7d36f4d0a94bec03c369c19dc452631/docs/seo/geo-aeo/geo-aeo-measurement.md).
- **R13 — Exemple d’environnement** : [.env.example](https://github.com/Fgris-Etoilys/etoilys-public/blob/53b01c12e7d36f4d0a94bec03c369c19dc452631/.env.example). Ce fichier ne prouve pas les valeurs de production.
- **R14 — Réouverture** : [src/utils/cookiePreferences.ts](https://github.com/Fgris-Etoilys/etoilys-public/blob/53b01c12e7d36f4d0a94bec03c369c19dc452631/src/utils/cookiePreferences.ts).
- **R15 — Politique FR** : [src/pages/Confidentialite.tsx](https://github.com/Fgris-Etoilys/etoilys-public/blob/53b01c12e7d36f4d0a94bec03c369c19dc452631/src/pages/Confidentialite.tsx).
- **R16 — Structure de localisation de la politique** : [src/content/pages/privacyPolicyContent.tsx](https://github.com/Fgris-Etoilys/etoilys-public/blob/53b01c12e7d36f4d0a94bec03c369c19dc452631/src/content/pages/privacyPolicyContent.tsx) — début du fichier, métadonnées et délégation FR.
- **R17 — Routes existantes** : [src/AppRoutes.tsx](https://github.com/Fgris-Etoilys/etoilys-public/blob/53b01c12e7d36f4d0a94bec03c369c19dc452631/src/AppRoutes.tsx) — imports et routes métier consultés.

### Sources officielles et références de conception

Consultées le 28 septembre 2026. Les recommandations de ce rapport sont des propositions d’architecture Étoilys ; elles ne sont pas présentées comme des prescriptions mot pour mot des fournisseurs.

- **S1 — React, hydrateRoot** : https://react.dev/reference/react-dom/client/hydrateRoot — identité du premier rendu et hydratation.
- **S2 — CNIL, mise en conformité des cookies/traceurs** : https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/comment-mettre-mon-site-web-en-conformite — portée des traceurs, information et choix par finalité.
- **S3 — CNIL, cadre légal** : https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi — distinction consentement/exemptions.
- **S4 — CNIL, solutions de mesure d’audience** : https://www.cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience — configuration, critères et auto-évaluation.
- **S5 — PostHog, cookieless tracking** : https://posthog.com/tutorials/cookieless-tracking — modes et limites techniques.
- **S6 — OpenAI, Measurement Pixel** : https://developers.openai.com/ads/measurement-pixel — consentement, événements, matching, déduplication et stockage du SDK.
- **S7 — W3C WAI, modal dialog pattern** : https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ — comportement clavier, arrière-plan et restitution du focus.
- **S8 — CNIL, conservation d’un refus** : https://www.cnil.fr/fr/cnil-direct/question/cookies-si-jai-refuse-ses-cookies-un-site-web-peut-il-me-redemander-de-les — six mois comme bonne pratique appréciée au cas par cas.
- **S9 — Axeptio, personnalisation et acceptation** : https://support.axeptio.eu/fr/articles/274079-comment-ameliorer-mon-taux-d-acceptation — inspiration de présentation, sans reprise des assertions commerciales.
- **S10 — Didomi, préférences** : https://developers.didomi.io/cmp/web-sdk/consent-notice/preferences — séparation premier niveau/préférences et accès permanent.

**Configuration connectée :** lecture Ads Manager du 28 septembre 2026, compte Étoilys, source web et événement configuré. Aucun changement, aucun secret exporté et aucune consultation de données brutes de conversion de visiteurs.
