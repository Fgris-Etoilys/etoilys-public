# Simulateur public — parcours FACTUELLE (ETOILYS-436 / 437)

EPIC ETOILYS-427. Contrats backend 430/431/432/443/452 (`docs/data/swagger.json`, routes publiques `/public/simulations/{id}/faits`).
Ce document décrit l’onglet Pièces livré par 436, puis les paramètres (dont Studio), la Grille, la vérification, la comparaison et le PDF livrés par 437.

## Mode de grille

- Le backend attribue le mode à la création et ne le change jamais : `grille.mode_grille` vaut `LEGACY` ou `FACTUELLE` (`GET /public/simulations/{id}`).
- `resolveGridMode` (`src/utils/simulatorApi.ts`) : un mode absent est traité comme `LEGACY` (backend antérieur au déploiement FACTUELLE) ; une valeur inconnue rend la simulation indisponible, sans aucune mutation.
- Le parcours LEGACY est inchangé (formulaires, WC, reprise, résultat, PDF). Seule différence : la simulation est lue avant `/logement` pour connaître le mode.
- En FACTUELLE, `SimulationClassement` n’appelle aucune route réservée à LEGACY (`/logement`, `/pieces`, `/reponse`, `/rapport`). `/modele`, `/verifier` et `/verification` sont partagés (432).
- Studio est toujours demandé à la création (Oui/Non sans présélection) ; une création LEGACY le stocke sans effet. L’activation des créations FACTUELLE dépend du flag backend `GRILLE_FACTUELLE_ENABLED` et de la recette intégrée des versions candidates, jamais du seul merge. Les Preview Vercel pointent sur `api-prod` : la recette FACTUELLE se fait uniquement sur un environnement relié au backend dev/staging.

## Routes et état

| Usage                                            | Route                                                      | Client                               |
| ------------------------------------------------ | ---------------------------------------------------------- | ------------------------------------ |
| Faits                                            | `GET /faits`                                               | `getFaits`                           |
| Catalogue (types, profils, pas, minima, formats) | `GET /faits/catalogue`                                     | `getFaitsCatalogue`                  |
| Pièce                                            | `POST /faits/pieces`, `PUT/DELETE /faits/pieces/{pieceId}` | `create/update/deleteFactuellePiece` |
| Ordre des salles d’eau                           | `PUT /faits/ordre-sanitaires` (liste complète)             | `reorderSanitaires`                  |

- Accès propriétaire : cookie HttpOnly du navigateur, transmis par `credentials: 'include'` comme pour LEGACY.
- `useFactuelleSimulation` (`src/hooks`) porte faits, catalogue et évaluation. Au chargement : simulation (avec `grille.evaluation`), puis faits et catalogue en parallèle. Les mutations renvoient faits + évaluation canoniques, appliqués sans GET supplémentaire. Un PUT de paramètre (`mutateParameters`) renvoie aussi l’évaluation recalculée. La relecture canonique (`refresh`) recharge la simulation (paramètres, statut, `grille.evaluation`) et les faits, et transmet la simulation à la page.
- Parseurs (`src/utils/simulatorFactuelle.types.ts`) : une réponse incompatible est rejetée, sans repli LEGACY ; les champs additifs sont conservés.

## Concurrence et issues incertaines

- Un verrou unique sérialise les écritures FACTUELLE : pièces, ordre sanitaire et paramètres (`mutateParameters`). Pas de double soumission ; les paramètres sont désactivés pendant une écriture de pièce ou tant qu’une actualisation est requise, et les actions de pièce pendant une sauvegarde de paramètre.
- Les réponses arrivées après un changement de simulation sont ignorées (session du hook et garde de chargement de la page).
- Refus certain (4xx) : rien n’a été écrit ; la fenêtre reste ouverte avec le brouillon. Les `fieldErrors` backend (chemins Java camelCase) sont rattachés aux champs (`mapServerFieldErrors`, index de couchage résolu par le payload envoyé).
- Issue incertaine (réseau, 5xx, réponse illisible), pour une pièce comme pour un paramètre : relecture canonique (simulation + `/faits`), jamais de rejeu automatique ; paramètres, statut et évaluation sont réconciliés depuis le backend. Pour une création, les pièces apparues depuis l’envoi sont listées sans deviner laquelle a été créée, et Ajouter reste bloqué jusqu’à « J’ai vérifié la liste ». Si la relecture échoue, les écritures restent bloquées jusqu’à « Actualiser les pièces ».

## Onglet Pièces

- Sections Pièces intérieures / Salles d’eau / Extérieurs, une seule visible, avec compteurs. Libellé « Pièces intérieures » (comme le BO) : la section contient aussi cuisine et dégagements, alors que le récapitulatif compte les pièces d’habitation qualifiées par le backend.
- Cartes : coche seule si aucun besoin `PIECE` manquant pour la pièce, sinon « À compléter ». La complétude vient des besoins backend (union des cinq catégories), jamais d’un calcul local ; elle est distincte des alertes de conformité.
- Alerte de carte unique (`pieceAlert`), issue du backend, par priorité : exclusion des pièces d’habitation (`qualifications_pieces`), puis plafond de couchages (`alertes_pieces` de la catégorie demandée), puis minimum local (`minima_locaux`).
- Récapitulatif : `evaluation.surfaces` de la catégorie demandée uniquement (surface totale, minimum global, pièces d’habitation, couchages comptés) et diagnostic de moyenne avec les pièces concernées. Aucun seuil n’est recalculé.
- Salles d’eau : priorité par `rang_type`, Monter/Descendre envoient la liste complète, sans mise à jour optimiste. Badge « Prise en compte / Supplémentaire » déduit des besoins sanitaires de la catégorie demandée.
- Extérieurs et couloirs : un exemplaire par type (types proposés filtrés, refus backend `TOO_MANY_*` affichés).

## Fenêtre Pièce

- `FactuellePieceModal` sur `SimulatorDialog` : brouillon local (`factuellePieceDraft.ts`) initialisé une fois ; aucun appel réseau à l’ouverture, pendant la saisie ou sur Annuler ; Ajouter/Sauvegarder déclenche une seule mutation. Pas de prévisualisation (`/faits/pieces/previsualisation` supprimée par 452).
- Champs stables selon le type (`visibleInspectionFields`), jamais pilotés par les besoins recalculés ; un champ ciblé ou manquant masqué pour le type est révélé.
- Oui/Non sans présélection, réponse retirable ; `null`, `false` et `true` sont préservés. Un compteur vide est inconnu, zéro est une réponse. Sèche-cheveux initialisé à 0 et « Baignoire sabot » à Non dans une salle d’eau (parité BO).
- Couchages : types, profils, valeurs initiales, minima, pas et formats du catalogue ; une ligne ouverte à la fois, complète avant Valider ou Sauvegarder (parité BO 451) ; doublons de configuration refusés. Sur les cinq types compatibles, les lignes restent saisissables et ne sont jamais retirées quelle que soit la surface ou l’ouvrant ; leur prise en compte relève du backend. En création, un type incompatible bloque l’ajout et la sauvegarde tant que des lignes existent. En modification, le type est immuable (règle backend).
- Douche/baignoire présente : protection et « Dimensions supérieures ? » requises, mesures si Oui. L’avertissement de dimensions non confirmées (≤ 6 400 / 12 750 cm²) est informatif ; la cotation reste backend. C37/C38/C43/C52 restent dans la Grille.
- Navigation : `FactuellePiecesTab` reçoit `target { requestId, piece_id, champ, num_critere?, section? }`. Une pièce existante s’ouvre sur le champ ciblé (surbrillance, défilement, focus) ; sans pièce, la section s’ouvre et l’action d’ajout prend le focus. La clé opaque `cle` des besoins n’est jamais analysée.

## Paramètres, Grille, résultats et PDF (437)

- Paramètres : Studio dans le panneau en FACTUELLE (`PUT /studio`). Un changement de capacité relit `/faits/catalogue` (minima C63/C64) sous le verrou ; `refresh()` relit aussi le catalogue. Le verrou unique refuse toute écriture pendant une relecture et pendant la vérification (`exclusive`).
- Grille (`FactuelleGridTab`) : chapitres, aides et sommaire du simulateur (primitives exportées de `SimulationGridTab`, rendu LEGACY inchangé). Projection par critère dans `src/utils/factuelleGrille.ts`, à parité BO : manuels Oui/Non/NA (si le modèle l’autorise) et retrait ; automatiques non cliquables avec badge Auto, « Renseigner » tant qu’un besoin manque, puis crayon pour les blocs globaux ; dérogation NA C15/C16/C19/C26 par bascule « Non applicable » (liste codée en miroir de `SaisieCritere.autoriseNaAutomatique`, aucun champ backend ne l’expose). Mention « Pour la catégorie X★ » quand le besoin concerne d’autres catégories. `changements_cascade` : toast info après succès, sans action.
- Modales de faits globaux (`FactuelleGlobalDialog`, brouillons dans `src/utils/factuelleGlobaux.ts`) : C18/C19, C25/C26, C101, cuisson, four/micro-ondes (`configuration`, `choix_combine` seulement), chauffage (`etat`, `types`, `autre` ; jamais `motif_inspection` ni `appreciation_commune`), mesures énergie/eau (ordre du catalogue), inventaires C63/C64/C65 (toutes les cases envoyées). Annuler n’écrit rien ; un brouillon inchangé ferme sans appel, sauf un inventaire jamais enregistré ou C63/C64 quand la capacité actuelle diffère de `capacite_constatee`. Aucune reconfirmation automatique (arbitrage 443).
- Résultat (`useFactuelleResult`, `FactuelleResultPanel`) : `POST /verifier` → `false` : `/verification` (blocages regroupés, navigation exacte vers paramètre, pièce, bloc ou critère) ; `true` : `/comparaison` (cinq sélecteurs, un détail, catégorie demandée par défaut). 409 `GRILLE_FACTUELLE_INCOMPLETE` → une seule relecture de `/verification`. Reprise : FAVORABLE/DEFAVORABLE → `/comparaison`, A_COMPLETER → `/verification`, A_RECALCULER → à recalculer. Toute mutation invalide le résultat ; consulter ou exporter n’écrit rien. Les déficits viennent d’une seule fonction (`pointsManquants`, `src/utils/factuelleResultats.ts`) partagée par sélecteur, détail et PDF ; la cible à la carte inclut déjà la compensation.
- PDF : `buildFactuellePdfInput` (`src/utils/simulationClassementFactuellePdf.ts`) fige au clic l’entrée consultée (titre « RÉSULTAT : X ÉTOILES », modèle, réponses, rapport, ONC) ; la catégorie demandée reste un paramètre. Couchages déclarés par pièce (`total_places`) et comptabilisés (`surfaces.nombre_couchages`, pièce d’habitation reconnue) sont distingués, sans recalcul. Sans `factuelle`, le PDF LEGACY est inchangé.

## Tests

- `src/hooks/__tests__/useFactuelleSimulation.test.ts` : verrou, refus, issues incertaines (pièce et paramètre) sans rejeu, réponses tardives (pièce et paramètre).
- `src/pages/SimulationClassementFactuelle.test.tsx` : isolation des modes, brouillon local, erreurs, création incertaine, plafond, réordre, paramètres, a11y de la fenêtre.
- `src/components/simulator/factuelle/FactuellePiecesTab.test.tsx` : navigation ciblée.
- `src/utils/__tests__/factuellePieceDraft.test.ts`, `factuellePieces.test.ts`, `src/utils/simulatorFactuelleApi.test.ts`.
- 437 : `src/hooks/__tests__/useFactuelleResult.test.ts` (verrou, 409, reprise périmée, catalogue), `src/utils/__tests__/factuelleGrille.test.ts`, `factuelleGlobaux.test.ts`, `factuelleResultats.test.ts`, `simulationClassementFactuellePdf.test.ts`, et le bloc « Grille et résultats FACTUELLE » de `SimulationClassementFactuelle.test.tsx`.
