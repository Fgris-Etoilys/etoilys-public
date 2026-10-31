# Routage et bascule des API publiques — ETOILYS-429

Ce runbook accompagne ETOILYS-429 dans l’EPIC 272. Il distingue les validations du dépôt, la recette Preview et la recette Production. Une étape non exécutée reste non validée ; aucune configuration externe ni recette réelle n’est réalisée par les tests.

## Contrat de routage

Les clients frontend gardent `VITE_API_BASE_URL=/api`. Les appels du simulateur conservent `credentials: 'include'` pour les sessions navigateur.

| Environnement      | Source de configuration                  | Backend                                 |
| ------------------ | ---------------------------------------- | --------------------------------------- |
| Vercel Production  | `vercel.ts`, `VERCEL_ENV=production`     | `https://api-prod.etoilys.fr`           |
| Vercel Preview     | `vercel.ts`, `VERCEL_ENV=preview`        | `https://api-dev.etoilys.fr`            |
| Vercel Development | `vercel.ts`, `VERCEL_ENV=development`    | `https://api-dev.etoilys.fr`            |
| Vite local         | `vite.config.ts`, `ETOILYS_API_BASE_URL` | `https://api-dev.etoilys.fr` par défaut |

`vercel.ts` exporte uniquement la configuration Vercel via l’export nommé `config`. La sélection du backend lit exclusivement `process.env.VERCEL_ENV`. Une valeur absente, vide ou inconnue provoque une erreur explicite au chargement : aucun fallback vers une API n’est autorisé.

Les six rewrites Vercel retirent seulement `/api` :

| Source                            | Chemin backend                |
| --------------------------------- | ----------------------------- |
| `/api/public/forms/contact`       | `/public/forms/contact`       |
| `/api/public/forms/classement`    | `/public/forms/classement`    |
| `/api/public/simulations`         | `/public/simulations`         |
| `/api/public/simulations/:path*`  | `/public/simulations/:path*`  |
| `/api/public/communes`            | `/public/communes`            |
| `/api/public/communes/:codeInsee` | `/public/communes/:codeInsee` |

Les paramètres de recherche et sous-chemins sont conservés. Le détail communal accepte un seul segment `codeInsee`. Il n’y a pas de proxy global `/api/*`, de middleware supplémentaire ou de nouvelle route React/SEO.

Le proxy Vite conserve quatre entrées explicites : Contact, Classement, Simulations et Communes. Toutes utilisent la même cible, `changeOrigin: true`, le retrait du préfixe `/api` et le retrait de l’en-tête `Origin`. La cible locale est normalisée sans slash final et `http://api-dev.etoilys.fr` devient HTTPS. Aucune ancienne variable spécifique au simulateur n’est lue.

Vercel transmet `Origin` au backend : le CORS backend doit autoriser l’origine réelle du site. Le retrait local de cet en-tête ne remplace pas cette configuration. Les règles de sécurité, les 404 EN/NL, les documents clients/signatures, le build `npm run build:seo`, la sortie `dist` et le shell `/simulateur/:simulationId` restent en place.

## Validation du dépôt et première Preview

Utiliser Node 22, puis exécuter `npm run lint`, `npm run test:run`, `npm run build:seo`, le contrôle UTF-8 sans BOM/mojibake des fichiers modifiés et enfin `npm run typecheck`. Sous PowerShell, `npm.cmd` peut remplacer `npm` si le script `npm.ps1` est bloqué.

Les commandes locales `dev`, `test:run` et `build:seo` ne nécessitent pas `VERCEL_ENV` : Vite n’importe pas la configuration Vercel et les tests définissent/restaurent explicitement les environnements. Les tests vérifient les destinations, les échecs de chargement, les règles conservées, les proxies Vite et l’absence de mesure de production sur Preview après consentement.

Après les validations locales, utiliser une Preview issue de l’intégration Git habituelle. Vérifier que `vercel.ts` se charge avec `VERCEL_ENV=preview` et que les six destinations sont celles de staging. La disponibilité de cette variable lors de l’évaluation réelle par Vercel reste à confirmer par ce déploiement. Un build local réussi ne constitue pas cette preuve. En cas d’échec, diagnostiquer l’intégration Vercel et conserver l’erreur stricte.

Sur l’alias fixe `etoilys-public-git-dev-scratchones-projects.vercel.app`, vérifier :

1. La destination staging des formulaires, simulations et communes, avec confirmation par les traces backend ; le seul statut HTTP ne distingue pas les environnements.
2. La transmission des paramètres de recherche, notamment une recherche de communes par code postal, et le routage d’un détail INSEE.
3. Turnstile réel, une soumission de chaque formulaire et la réception des emails de recette.
4. La création puis la reprise d’une simulation après rechargement, avec conservation des cookies.
5. L’absence d’initialisation PostHog et d’émission OpenAI Ads de production, même après consentement et succès métier.
6. Les pages FR/EN/NL et leurs 404, ainsi que l’accès direct à une simulation.

Les anciennes simulations créées depuis une Preview contre production deviennent inaccessibles depuis cette Preview après isolation. Aucun fallback vers production ne doit les réintroduire.

## Configuration externe et conditions avant production

Ces vérifications relèvent du déploiement et du backend ; elles ne demandent aucun secret dans le code ni modification Cloudflare par cette intervention.

- Conserver `VITE_API_BASE_URL=/api` et la site key du widget Turnstile actuel pendant la transition.
- Faire autoriser uniquement l’alias fixe `etoilys-public-git-dev-scratchones-projects.vercel.app` sur ce widget, en plus des domaines publics existants. Ne pas ouvrir tous les domaines Preview.
- Vérifier la compatibilité du widget actuel avec les secrets Turnstile des deux environnements Railway et les prérequis Resend.
- Conserver la protection Vercel et `VITE_ALLOW_MEASUREMENT_ON_NON_CANONICAL_HOST=false`. Les Previews ne doivent pas alimenter les projets de mesure de production.
- Vérifier l’exposition des variables système Vercel et la cible du déploiement Production.
- Confirmer le jalon initial ETOILYS-428 avant la promotion vers `main` : backport isolé déployé, CORS effectif, absence d’override contradictoire, smokes formulaires et fonctionnement BO/simulations.

Pendant la fenêtre de rollback, staging doit encore accepter les origines `https://etoilys.fr` et `https://www.etoilys.fr`, le widget actuel et l’ancien contrat des formulaires. Ne pas y déployer le contrat strict ETOILYS-483 avant fermeture explicite de cette fenêtre. La disponibilité de l’API communes ETOILYS-477 en production n’est pas un prérequis de la bascule 429.

## Recette Production

Après la bascule autorisée, sur `https://www.etoilys.fr` :

1. Envoyer un `POST` avec le corps `{}` aux endpoints `/api/public/forms/contact` et `/api/public/forms/classement`, avec `Origin: https://www.etoilys.fr` et `Content-Type: application/json`. Attendre `400` et `errorCode=VALIDATION_FAILED`, jamais `403 CORS`. La validation du payload intervient avant Turnstile et Resend.
2. Confirmer `api-prod` dans la configuration déployée et les traces backend. Un `400` ou un `200` seul ne prouve pas la destination.
3. Effectuer une soumission réelle de chaque formulaire avec des données de recette identifiables. Vérifier le succès UX, Turnstile, la réception effective de l’email interne et de l’accusé prospect. Un `200` ne suffit pas à prouver la réception des emails.
4. Vérifier les événements existants selon les deux consentements indépendants, puis le simulateur et la continuité de sa session.
5. Contrôler le routage des communes ; un `404` reste acceptable tant que 477 n’est pas livré en production.

Consigner séparément les validations du code, la recette Preview et la recette Production, avec le déploiement concerné et les résultats observés. Garder toute étape non exécutée explicitement non validée.

## Rollback et clôture

Pendant la fenêtre de transition, un rollback autorisé ne rétablit vers `https://api-dev.etoilys.fr` que les deux destinations formulaires de Production. Simulations et communes restent sur `https://api-prod.etoilys.fr`. Modifier les deux destinations concernées, adapter leurs assertions et refaire la recette utile sans annuler d’autres évolutions.

Après validation de 429, respecter cet ordre :

1. Le responsable du déploiement ferme explicitement la possibilité de revenir aux formulaires staging.
2. Le nettoyage backend ETOILYS-428 retire les deux origines publiques du CORS staging, en conservant le BO staging et l’alias fixe `dev`.
3. La configuration externe sépare les widgets Turnstile : site key staging sur Vercel Preview, secret correspondant sur Railway staging. La production conserve sa paire site key/secret cohérente.
4. Refaire la recette Preview avant la recette ETOILYS-482/483 et le déploiement du contrat strict 483 sur staging.

Après déploiement de 483 sur staging, le retour des formulaires de production vers `api-dev` est exclu.
