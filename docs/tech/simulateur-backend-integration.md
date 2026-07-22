# Intégration backend du simulateur public

## Source du contrat

Le contrat local utilisé pour l’intégration est `docs/data/swagger.json`, généré pour l’API Starsmanager.
Le serveur indiqué par le Swagger est `http://api-dev.etoilys.fr`, mais le proxy frontend cible `https://api-dev.etoilys.fr` pour éviter une redirection HTTP vers HTTPS visible par le navigateur.

## Routage frontend

Le frontend appelle toujours des URLs same-origin sous `/api`.

- `/api/public/forms/contact` et `/api/public/forms/classement` restent routés vers Supabase Edge Functions.
- `/api/public/simulations` et `/api/public/simulations/*` sont routés vers le backend simulateur Etoilys.

En développement, le routage est défini dans `vite.config.ts`.
Le proxy Vite retire l’en-tête `Origin` sur les routes simulateur, afin que le backend ne traite pas les appels serveur-à-serveur comme une requête CORS venant de `localhost`.
En production, le routage est défini dans `vercel.json`.

## Client frontend

Toutes les actions du simulateur public doivent passer par `src/utils/simulatorApi.ts`.
La grille de contrôle affichée dans `/simulateur/:simulationId` est chargée depuis
`GET /public/simulations/modele`; le frontend ne doit pas utiliser de copie locale de la grille
comme fallback runtime.

Le client simulateur applique systématiquement :

- `credentials: 'include'`
- `Accept: application/json`
- `Content-Type: application/json` quand un body JSON est envoyé

Cette règle est importante parce que le backend associe les simulations publiques au navigateur.

Le Swagger ne déclare pas d’enum pour `categorie_demandee`, `type_habitation` ou `etage`.
Les valeurs confirmées pour la création de simulation sont :

- `categorie_demandee` : chaîne `"1*"`, `"2*"`, `"3*"`, `"4*"` ou `"5*"`
- `type_habitation` : chaîne `"INDIVIDUEL"` ou `"COLLECTIF"`
- `etage` : entier, avec `RDC = 0`, `1er = 1`, `2e = 2`, `3e = 3`, `4e ou plus = 4`

La page d’accueil du simulateur est `/simulateur`.
L’interface principale d’une simulation publique est `/simulateur/:simulationId`.
Cette route est volontairement `noindex,follow`, car son contenu dépend du navigateur courant.

## Statuts de simulation

Le frontend attend les statuts publics suivants dans `SimulationPubliqueDto.statut` et
`SimulationPubliqueSummaryDto.statut` :

| Statut         | Sens                                                                                           | Comportement frontend                                                                   |
| -------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `BROUILLON`    | Aucun calcul final valide n’a encore été exécuté.                                              | Aucun résultat n’est hydraté automatiquement.                                           |
| `FAVORABLE`    | Le dernier calcul final exploitable est positif.                                               | Le détail charge `GET /public/simulations/{id}/rapport`.                                |
| `DEFAVORABLE`  | Le dernier calcul final exploitable est négatif.                                               | Le détail charge `GET /public/simulations/{id}/rapport`.                                |
| `A_COMPLETER`  | Le résultat n’est pas exploitable à cause d’informations manquantes ou d’une erreur bloquante. | Le détail charge `GET /public/simulations/{id}/verification`.                           |
| `A_RECALCULER` | Un calcul a déjà été fait, puis la simulation a été modifiée.                                  | Le détail affiche un résultat à recalculer sans hydrater de rapport ni de vérification. |

Les anciens statuts `VERIFIEE_CONFORME` et `VERIFICATION_EN_ECHEC` ne sont plus acceptés par le
client frontend. Un statut inconnu rend la réponse simulateur invalide.

Après un calcul lancé depuis le frontend, le mapping attendu est :

- `POST /public/simulations/{id}/verifier` retourne `false` : statut métier `A_COMPLETER`,
  avec lecture de `/verification`.
- `POST /public/simulations/{id}/verifier` retourne `true`, puis `/rapport.resultat === true` :
  statut métier `FAVORABLE`.
- `POST /public/simulations/{id}/verifier` retourne `true`, puis `/rapport.resultat !== true` :
  statut métier `DEFAVORABLE`.

Pour les pièces, l’interface demande à l’utilisateur le nombre de personnes pouvant dormir dans la pièce.
Le contrat backend disponible porte actuellement cette valeur dans `PieceDto.nombre_lits`.
Quand un nombre de couchages strictement positif est renseigné, le frontend envoie aussi
`literie: true`. Le frontend n’envoie pas `type_literie` tant que l’écran de détail literie n’est
pas défini.
La validation surface/couchages des pièces est calculée côté frontend avant l’enregistrement.
Le frontend bloque uniquement les dépassements de couchages, puis laisse passer les insuffisances
de surface avec une alerte non bloquante. Les champs backend `surface_minimum`,
`surface_minimum_atteinte` et `capacite_lits_atteinte` restent lus comme fallback au chargement
initial lorsque la catégorie demandée n’est pas exploitable côté frontend.

## Endpoints publics simulateur

Endpoints disponibles d’après le Swagger local :

- `GET /public/simulations`
- `GET /public/simulations/modele`
- `POST /public/simulations`
- `GET /public/simulations/{id}`
- `DELETE /public/simulations/{id}`
- `PUT /public/simulations/{id}/typeHabitation/{typeHabitation}`
- `PUT /public/simulations/{id}/etage/{etage}`
- `PUT /public/simulations/{id}/classementDemande/{classement}`
- `PUT /public/simulations/{id}/capaciteAccueil/{capaciteAccueil}`
- `GET /public/simulations/{id}/logement`
- `POST /public/simulations/{id}/pieces`
- `PUT /public/simulations/{id}/pieces/{pieceId}`
- `DELETE /public/simulations/{id}/pieces/{pieceId}`
- `POST /public/simulations/{id}/reponse`
- `POST /public/simulations/{id}/verifier`
- `GET /public/simulations/{id}/verification`
- `GET /public/simulations/{id}/rapport`

## Suppression

Le Swagger expose deux suppressions publiques :

- `DELETE /public/simulations/{id}` pour supprimer une simulation complète associée au navigateur.
- `DELETE /public/simulations/{id}/pieces/{pieceId}` pour supprimer une pièce d'une simulation.

## Erreurs

Les erreurs publiques du simulateur utilisent les schémas Swagger `ApiErrorResponse` ou
`ValidationErrorResponse` :

```json
{
  "code": "TOO_MANY_PUBLIC_SIMULATIONS",
  "message": "Message backend optionnel",
  "fieldErrors": {
    "champ": "Message de validation optionnel"
  }
}
```

Le frontend lit `code`, `message` et `fieldErrors`, mais affiche des messages stables définis côté
frontend. Les codes métier simulateur explicitement gérés sont :

- `TOO_MANY_PUBLIC_SIMULATIONS`
- `LOGEMENT_NOT_MODIFIABLE`
- `PIECE_TYPE_NOT_ALLOWED`
- `TOO_MANY_CORRIDORS`
- `TOO_MANY_LOGGIAS`
- `TOO_MANY_PRIVATE_GARDENS`
- `TOO_MANY_PARKS`
- `INVALID_REQUEST`
- `INVALID_STATE`
- `NOT_FOUND`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `CONFLICT`

Les réponses HTTP `429 Too Many Requests` peuvent être émises par Cloudflare avant le backend
applicatif. Le frontend les traite donc par statut HTTP, même si le body n'est pas au format JSON,
et affiche un message demandant de patienter avant de réessayer.

## Note production

Pour une exposition directe en production, le backend simulateur doit être disponible en HTTPS.
À défaut, le routage same-origin via Vercel doit rester l’entrée publique utilisée par le frontend.
