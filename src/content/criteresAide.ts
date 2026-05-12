/**
 * Données d'aide pour les critères de la grille de contrôle
 * Extraites du fichier legacy grille-de-controle.js
 */

export interface CritereAide {
  numero: number;
  titre: string;
  description: string;
  description_suite?: string;
  non_applicabilite: string | null;
  notes: string | null;
  illustration?: string;
}

export type CriteresAides = Record<string, CritereAide>;

export const criteresAides: CriteresAides = {
  '1': {
    numero: 1,
    titre:
      "Surface totale minimum (cuisine et coin cuisine compris) du logement meublé hors salle d'eau et toilettes",
    description: `Méthodologie d'évaluation :
Ne sont prises en compte que les superficies existantes sous une hauteur de plafond de 1m80. Une pièce d'habitation doit comporter un ouvrant sur l'extérieur.
Pour les catégories 1*,2* et 3* seulement, et pour les logements T2 et plus, les surfaces habitables requises peuvent être globalisées (réparties différemment par pièce) hors sanitaires dans la limite de 7m² minimum.`,
    non_applicabilite: null,
    notes: null,
  },
  '2': {
    numero: 2,
    titre: 'Surface totale majorée',
    description: `Méthodologie d'évaluation :
Bonification de 1 point par tranche de 20 % de surface supplémentaire (de 1 à 5 points). Ne sont prises en compte que les superficies existantes sous une hauteur de plafond de 1m80. Une pièce d'habitation doit comporter un ouvrant sur l'extérieur.
Le critère peut être validé indépendamment du précédent.
Pour les catégories 4* et 5* ce critère peut être validé même si le critère 1 « Surface totale minimum » n'est pas validé. En effet, en 4* et 5*, dès lors que les surfaces ne peuvent pas être globalisées et que les surfaces des chambres supplémentaires sont des surfaces minimum, si une chambre ne respecte pas ce minimum mais que le reste du logement représente une surface majorée, alors ce critère peut être validé selon la méthodologie des points de bonification.`,
    non_applicabilite: null,
    notes: null,
  },
  '3': {
    numero: 3,
    titre: "Prise de courant libre dans chaque pièce d'habitation",
    description: `Méthodologie d'évaluation :
Vérification sur place. Salle(s) d'eau comprise(s).
Une prise de courant libre est une prise non utilisée de manière permanente pour le fonctionnement d'un autre appareil électrique du logement. Les multiprises ne permettent pas de valider le critère.`,
    non_applicabilite: null,
    notes:
      'Si cette même prise libre est située dans la chambre, elle servira également à valider le critère 35.',
  },
  '4': {
    numero: 4,
    titre: 'Tous les éclairages du logement fonctionnent et sont en bon état',
    description: `Méthodologie d'évaluation :
Vérification de l'état et du fonctionnement des éclairages dans toutes les pièces du logement (y compris sanitaires, cuisine ou coin cuisine).`,
    non_applicabilite: null,
    notes: null,
  },
  '5': {
    numero: 5,
    titre: "Mise à disposition d'un téléphone privatif à l'intérieur du logement",
    description: `Méthodologie d'évaluation :
Vérification de l'état et du fonctionnement du téléphone sur place.
Le choix par le propriétaire du type de téléphone (fixe, sans fil, mobile à carte etc…) payant ou gratuit est libre. Téléphone commun à plusieurs logements non accepté.`,
    non_applicabilite:
      'Sauf impossibilité technique (ex : zones blanches justifiées) : alors le critère est non applicable.',
    notes: null,
  },
  '6': {
    numero: 6,
    titre: 'Accès internet par un réseau local sans fil (WiFi)',
    description: `Méthodologie d'évaluation :
L'offre de WiFi peut se faire à l'aide d'une box classique, d'un routeur ou d'un boîtier mobile.
La mise à disposition d'une clé 3G est acceptée. Toutefois, le propriétaire doit informer le client de cette possibilité.
Les cas « d'impossibilité technique » tels que mentionnés dans la colonne précisions font référence à l'impossibilité d'accéder techniquement aux offres classiques du marché.`,
    non_applicabilite:
      'Sauf impossibilité technique (ex : zones blanches justifiées) : alors le critère est non applicable.',
    notes: null,
  },
  '7': {
    numero: 7,
    titre: 'Accès internet filaire avec câble fourni',
    description: `Méthodologie d'évaluation :
Vérification de l'installation d'une connexion Internet par câble filaire, câble fourni.`,
    non_applicabilite:
      'Sauf impossibilité technique (ex : zones blanches justifiées) : alors le critère est non applicable.',
    notes:
      "Si le logement dispose d'une connexion Wifi et que cela est constaté lors de la visite de contrôle, alors une connexion filaire n'est pas nécessaire.",
  },
  '8': {
    numero: 8,
    titre: 'Télévision à écran plat avec télécommande',
    description: `Méthodologie d'évaluation :
Vérification sur place de l'état de fonctionnement de la télévision à écran plat et de la télécommande.`,
    non_applicabilite: null,
    notes:
      "Si une télévision écran plat est remplacée par un vidéoprojecteur fixé au plafond, avec télécommande, diffusant les chaînes de télévision via une box, cet équipement peut être accepté en remplacement, à condition que l'image projetée soit de qualité suffisante, sur une surface adaptée, et que l'ensemble soit pleinement fonctionnel pour les clients. Dans ce cas, le vidéoprojecteur est bien considéré comme remplissant la fonction de télévision.\n\nEnfin, pour valider le critère, le client ne doit pas avoir à apporter d'équipement supplémentaire pour pouvoir profiter de l'offre de télévision.",
  },
  '9': {
    numero: 9,
    titre: "Accès à des chaînes supplémentaires à l'offre de la TNT",
    description: `Méthodologie d'évaluation :
Vérification sur place de l'accès aux chaînes supplémentaires à l'offre de la TNT. Les chaînes supplémentaires peuvent être fournies via les bouquets TV, applications, TV à la demande, box…`,
    non_applicabilite: null,
    notes: null,
  },
  '10': {
    numero: 10,
    titre: "Possibilité d'accéder à au moins deux chaînes internationales",
    description: `Méthodologie d'évaluation :
Vérification sur place de l'accès à au moins deux chaînes internationales. La TNT valide ce critère si au moins deux chaînes internationales sont présentes dans le bouquet.`,
    non_applicabilite: null,
    notes:
      "Une chaine internationale est une chaine diffusée à travers le monde, quelle que soit la localisation d'une personne.\n\nPar exemple : BBC World News, France 24, TV5 Monde, CNN International, Africanews, Al Jazeera, Bein Sport, Disney Channel, etc. (la liste est non exhaustive).\n\nLa chaine doit diffuser de l'actualité, divertissement, etc. internationale et être disponible dans un certain nombre de pays, la langue utilisée n'est pas spécifiée.\n\nLes chaines en langues étrangères sont tolérées.",
  },
  '11': {
    numero: 11,
    titre: 'Radio',
    description: `Méthodologie d'évaluation :
Vérification sur place. Le fonctionnement est vérifié lors du contrôle du logement. Il s'agit de radios émises sur les fréquences FM. Radio FM sur télévision acceptée ou support multimédia équivalent (chaîne hi-fi, poste de radio, radio réveil…).`,
    non_applicabilite: null,
    notes: null,
  },
  '12': {
    numero: 12,
    titre: 'Enceinte connectée',
    description: `Méthodologie d'évaluation :
Enceinte connectée de type enceinte bluetooth, sans fil, avec sortie pour prise jack, station d'accueil…`,
    non_applicabilite: null,
    notes: null,
  },
  '13': {
    numero: 13,
    titre: "Mise à disposition d'un système de lecture de vidéos",
    description: `Méthodologie d'évaluation :
Le système peut être proposé par différents équipements (service de vidéos à la demande, plateforme de streaming, appareil de streaming multi-médias, passerelle multi-médias…). Les services de VOD ou de plateformes de streaming doivent être ouverts et le visionnage accessible aux locataires.`,
    non_applicabilite: null,
    notes:
      "Un lecteur DVD ne permet pas de valider ce critère.\n\nUn vidéoprojecteur ne permet pas de valider ce critère, si le client doit apporter son propre support de diffusion (ordinateur, etc.).\n\nLe Chromecast est accepté pour valider ce critère. Le système de vidéo à la demande (VOD) également.\n\nLes plateformes de streaming doivent disposer d'un abonnement ouvert à la clientèle, le client ne doit pas devoir rentrer ses propres codes.",
  },
  '14': {
    numero: 14,
    titre:
      'Occultation opaque : extérieure ou intérieure dans chaque pièce comportant un couchage principal',
    description: `Méthodologie d'évaluation :
Vérification sur place. Le dispositif doit être extérieur (volets, volets roulants, persiennes…) et / ou intérieur (rideaux, double-rideaux…). Il s'agit de vérifier le dispositif dans chaque pièce comportant un couchage principal ou à toutes les fenêtres de la pièce d'habitation dans le cas d'un studio. Le dispositif doit couvrir toute la surface vitrée pour valider le critère.`,
    non_applicabilite: null,
    notes: null,
  },
  '15': {
    numero: 15,
    titre: 'Le logement est équipé de double vitrage',
    description: `Méthodologie d'évaluation :
Vérification sur place. Le système de double vitrage doit être effectif sur chaque fenêtre présente dans chaque pièce comportant un couchage principal ou à toutes les fenêtres de la pièce d'habitation dans le cas d'un studio. La présence d'un dispositif répondant à des exigences égales ou supérieures permet de valider le critère (double fenêtrage, triple vitrage…).`,
    non_applicabilite:
      "Ce critère est non applicable en cas d'impossibilité architecturale et/ ou impossibilité locale justifiée.",
    notes: null,
  },
  '16': {
    numero: 16,
    titre: "Existence d'un système de chauffage en état de fonctionnement",
    description: `Méthodologie d'évaluation :
Vérification de l'existence d'un chauffage en état de fonctionnement par tout moyen de preuve, tel par exemple qu'un carnet d'entretien ou une attestation établie par un professionnel qualifié.

Un système de chauffage doit être présent dans toutes les pièces d'habitation y compris la (ou les) salle(s) d'eau. Un système global qui chauffe toutes les pièces ou plusieurs pièces est accepté (ex : mezzanine ouverte, salle d'eau ouverte sur chambre...).

Tout moyen de chauffage (central, électrique, poêle à bois, granulés, autre…). Les chauffages mobiles d'appoint ne sont pas acceptés pour valider le critère.`,
    non_applicabilite:
      'Sauf exception justifiée par le climat (DROM-TOM) : alors, le critère est non applicable.',
    notes:
      "L'intégralité des systèmes de chauffage doit être vérifiée par tout moyen. Si le fonctionnement d'un chauffage ne peut pas être testé directement sur place, un carnet d'entretien ou une attestation établie par un professionnel qualifié doit être exigé.",
  },
  '17': {
    numero: 17,
    titre:
      "Existence d'un système de climatisation et / ou de rafraîchissement d'air en état de fonctionnement",
    description: `Méthodologie d'évaluation :
Vérification de l'existence d'un système de climatisation et/ou de rafraîchissement d'air en état de fonctionnement par tout moyen de preuve, tel par exemple qu'un carnet d'entretien ou une attestation établie par un professionnel qualifié.

Les systèmes de ventilation d'air de type ventilateur (fixe ou mobile) ne sont pas considérés comme des systèmes de rafraîchissement d'air, et ne valident donc pas le critère.

L'équipement doit être proposé a minima dans une pièce de vie commune et une chambre (sauf pour les studios) pour valider le critère. A vérifier par tout moyen.`,
    non_applicabilite:
      "Sauf Saint Pierre et Miquelon et haute montagne (>1000 mètres d'altitude) : alors, le critère est non applicable.",
    notes:
      "Le fonctionnement du système de climatisation doit être vérifié dans les pièces requises pour la validation du critère (pièce de vie commune et chambre). Le bon fonctionnement constaté dans l'une de ces pièces ne permet pas de présumer du fonctionnement dans l'autre.",
  },
  '18': {
    numero: 18,
    titre: 'Machine à laver le linge pour les logements de 4 personnes et plus',
    description: `Méthodologie d'évaluation :
Vérification sur place. Pour les catégories 1* et 2*, équipement pouvant être commun à plusieurs logements, avec accès indépendant, libre et gratuit.
Pour les catégories 3, 4 et 5 étoiles, lave-linge privatif obligatoire - tolérance dans un local privatif extérieur au logement. Les appareils combinés « machine à laver / sèche-linge électrique » sont acceptés. Dans ce cas, les critères 18 et 19 se cumulent. Pour le critère 18, les équipements de type « mini lave-linge (< ou = 3 kilos) » ne sont pas acceptés.`,
    non_applicabilite:
      "Dans le cas d'un logement de moins de 4 personnes, le critère est non applicable.",
    notes: null,
  },
  '19': {
    numero: 19,
    titre: 'Sèche-linge électrique pour les logements de 6 personnes et plus',
    description: `Méthodologie d'évaluation :
Pour les catégories 1, 2 et 3 étoiles, équipement pouvant être commun à plusieurs logements avec accès indépendant et accessible librement et gratuitement.
Pour les catégories 4 et 5 étoiles, sèche-linge privatif obligatoire - tolérance dans un local privatif extérieur au logement. Les appareils combinés « machine à laver / sèche-linge électrique » sont acceptés. Dans ce cas, les critères 18 et 19 se cumulent.`,
    non_applicabilite:
      "Sauf exception justifiée par le climat (DROM-TOM). Dans le cas d'un logement de moins de 6 personnes, le critère est non applicable.",
    notes: null,
  },
  '20': {
    numero: 20,
    titre: "Etendoir ou séchoir à linge à l'intérieur du logement",
    description: `Méthodologie d'évaluation :
Vérification sur place de la présence d'un étendoir ou séchoir à linge à l'intérieur du logement. L'équipement peut être fixe ou mobile. Dans le cas d'un équipement fixe, celui-ci doit être à l'intérieur du logement. La présence d'un équipement fixe extérieur ou d'un sèche-linge ne valide pas ce critère.`,
    non_applicabilite: null,
    notes: null,
  },
  '21': {
    numero: 21,
    titre:
      'Ustensiles de ménage appropriés au logement (minimum : un seau et un balai à brosse avec serpillière ou un balai de lavage à franges avec seau et presse, aspirateur ou équipement équivalent)',
    description: `Méthodologie d'évaluation :
Vérification sur place. Les ustensiles de ménage requis sont présents à l'intérieur du logement et non mis à disposition sur demande.`,
    non_applicabilite: null,
    notes: null,
  },
  '22': {
    numero: 22,
    titre: 'Fer et table à repasser',
    description: `Méthodologie d'évaluation :
Vérification sur place. Le fer et la table à repasser sont présents à l'intérieur du logement et non mis à disposition sur demande. Ces équipements sont privatifs et non communs à plusieurs logements. Un système équivalent valide le critère (ex : centrale vapeur, défroisseur, nappe de repassage, station de pressing, presse à repasser…).`,
    non_applicabilite: null,
    notes: 'Un défroisseur permet de valider le critère.',
  },
  '23': {
    numero: 23,
    titre: 'Placards ou éléments de rangement dans le logement',
    description: `Méthodologie d'évaluation :
Vérification sur place. Si présence de penderie, alors celle-ci doit être équipée de cintres de qualité non dépareillés. Les cintres métalliques « pressing » ne sont pas acceptés pour valider le critère. Le critère est réputé acquis si présence d'un dressing, compté comme un élément de rangement commun.`,
    non_applicabilite: 'Le critère est non applicable en 3*, 4* et 5*.',
    notes: null,
  },
  '24': {
    numero: 24,
    titre: "Placards ou éléments de rangement dans chaque pièce d'habitation",
    description: `Méthodologie d'évaluation :
Vérification sur place. Obligatoire dans chaque pièce d'habitation pour les catégories 3*, 4* et 5*.
Si présence de penderie, alors celle-ci doit être équipée de cintres de qualité non dépareillés. Les cintres métalliques « pressing » ne sont pas acceptés pour valider le critère. Le critère est réputé acquis si présence d'un dressing, compté comme un élément de rangement commun. Si le rangement est réservé à une pièce mais situé à proximité immédiate, cette configuration valide le critère.`,
    non_applicabilite: null,
    notes: null,
  },
  '25': {
    numero: 25,
    titre: "Présence d'une table et d'assises correspondant à la capacité d'accueil du logement",
    description: `Méthodologie d'évaluation :
Vérification sur place. Il s'agit de vérifier l'existence d'une table et d'assises correspondant à la capacité d'accueil du logement.`,
    non_applicabilite: null,
    notes:
      "A partir de 2*, les assises sans dossier (poufs, tabourets, banquettes sans dossier, etc.) ne permettent pas de valider ce critère.\n\nCe critère fait référence à une table à manger. Il est donc nécessaire qu'une seule et même table correspondant à la capacité d'accueil du logement soit présente pour valider le critère.",
  },
  '26': {
    numero: 26,
    titre: "Présence d'un canapé ou fauteuil(s) adapté(s) à la capacité d'accueil",
    description: `Méthodologie d'évaluation :
Le critère devient non applicable s'il n'y a pas de séjour (espace salon). Canapé convertible accepté pour les catégories 1*, 2* et 3*.

Pour les logements 4* et 5*, les canapés convertibles seuls ne sont pas acceptés pour valider ce critère. Il convient de constater la présence d'un canapé supplémentaire ou la présence d'un fauteuil supplémentaire a minima.

Le critère est rendu applicable pour les coins salon. Le nombre d'assises doit correspondre à la capacité d'accueil du logement, plafonné à 7 personnes.`,
    non_applicabilite: "Le critère devient non applicable s'il n'y a pas de séjour (espace salon).",
    notes:
      "Pour les 4 et 5*, il est nécessaire que le canapé convertible ne soit pas la seule assise dans le salon, un fauteuil en plus avec une capacité totale d'accueil correspondant à celle du logement permet de valider le critère.",
  },
  '27': {
    numero: 27,
    titre: "Présence d'une table basse",
    description: `Méthodologie d'évaluation :
Vérification sur place.`,
    non_applicabilite: 'Le critère devient non applicable dans le cas de studios.',
    notes: null,
  },
  '28': {
    numero: 28,
    titre: 'Respect des dimensions du (ou des) lit(s)',
    description: `Méthodologie d'évaluation :
Vérification sur place des dimensions.
Tolérance pour :
- lits superposés (80cm x 190cm) pour toutes les catégories de classement
- lits escamotables (80cm x 190cm) pour les studios uniquement, pour toutes les catégories de classement
- lits gigognes (80cm x 190cm)
- lits jumeaux (80cm x 190cm) pouvant être assemblés en lit double de 160 cm. Dans le cas de lits jumelés joints permettant le couchage de 2 personnes, l'ensemble de la literie ainsi que le système de jumelage des deux lits doivent être appropriés (présence d'un matelas sur deux sommiers joints, présence d'un cale-matelas, présence d'un sur-matelas…). Les attaches simples type velcros ne sont pas acceptés dans ce cas.
- canapé-lits convertibles toutes sortes (130cm x 190cm) - uniquement pour les studios de catégorie 1* et 2*.
Pour les catégories 3*, 4* et 5*, les canapés convertibles sont acceptés uniquement lorsqu'ils respectent les dimensions indiquées dans la grille de classement selon le niveau de classement demandé.
Les sommiers en mailles métalliques souples ne sont pas admis.`,
    non_applicabilite: null,
    notes:
      "Concernant la tolérance précisée pour les lits escamotables, celle-ci ne fait référence qu'aux lits pour 1 personne.\n\nPour les lits 2 personnes, si le lit escamotable est le lit principal, aucune tolérance n'est appliquée.\n\nS'il s'agit d'un lit additionnel, conformément à l'interprétation donnée pour les canapé-lits convertibles, une tolérance (130cmx190cm) peut s'appliquer pour les studios de catégorie 1* et 2* uniquement. Pour les catégories 3*, 4* et 5*, les dimensions minimales exigées doivent être respectées.",
    illustration: '/images/illustrations/notes_crit_28.jpg',
  },
  '29': {
    numero: 29,
    titre: 'Matelas haute densité et / ou avec une épaisseur de qualité',
    description: `Méthodologie d'évaluation :
Vérification sur place. La densité doit être supérieure à 30 kg/m3 ou équivalent. Si la densité n’est pas vérifiable, l'épaisseur doit être minimum de 21 cm. Les matelas à ressorts ou mini-ressorts ensachés ainsi que les matelas à mémoire de forme valident le critère. Vérifier les fiches techniques du matériel ou les factures si possible. Si le loueur n’a pas conservé de fiche technique, une attestation du fournisseur peut être acceptée.`,
    non_applicabilite: 'Ce critère ne s’applique pas aux convertibles.',
    notes: null,
  },
  '30': {
    numero: 30,
    titre: "Présence d'oreiller(s) en quantité suffisante",
    description: `Méthodologie d'évaluation :
Vérification sur place. Un oreiller par personne est exigé pour les catégories 1* et 2*. Deux oreillers par personne sont exigés pour les catégories 3*, 4* et 5*. Les traversins peuvent être présents mais ne seront pas pris en compte comme des oreillers pour le classement.`,
    non_applicabilite: null,
    notes: null,
  },
  '31': {
    numero: 31,
    titre:
      'Deux couvertures ou une couette par lit - couette obligatoire pour les catégories 3*, 4* et 5*',
    description: `Méthodologie d'évaluation :
Vérification sur place. Pour les catégories 1* et 2*, deux couvertures ou une couette sont/est exigées/exigée. Pour les catégories 3*, 4* et 5*, la présence d’une couette est exigée.`,
    non_applicabilite: 'Les plaids sont autorisés pour valider le critère dans les DROM-TOM.',
    notes: null,
  },
  '32': {
    numero: 32,
    titre: 'Matelas et oreillers protégés par des alaises ou des housses amovibles',
    description: `Méthodologie d'évaluation :
Vérification sur place. Vérifier l'existence d'une alèse ou housse de protection sur tous les matelas du logement visité. Vérifier également l'existence d'une sous-taie ou housse de protection sur les oreillers du logement visité. Les protections faites intégralement en plastique ne sont pas acceptées. Les matelas et les oreillers doivent être protégés pour valider le critère.`,
    non_applicabilite: null,
    notes:
      'Les alèses et housses de protection doivent être installées sur les matelas et oreillers au moment de la visite. Leur simple présence dans une armoire ou un rangement ne permet pas de valider le critère.',
  },
  '33': {
    numero: 33,
    titre: 'Eclairage en-tête de lit par personne avec interrupteur individuel',
    description: `Méthodologie d'évaluation :
Vérification sur place de l'existence et du fonctionnement de l'éclairage dans les chambres du logement visité.

Le critère s'applique uniquement pour les couchages principaux situés dans la (ou les) chambre(s) du logement (les lits d'appoints ne sont pas concernés).

Dans le cas d'un lit double dans les chambres, l'équipement doit être constaté des deux côtés du lit pour valider le critère. Une lampe de chevet commune est acceptée entre deux lits individuels avec table de chevet centrale.

Dans le cas d'un logement de type studio, l'équipement devra être constaté à proximité immédiate du couchage lorsqu'il s'agit d'un canapé convertible, au moins d'un côté, pour valider le critère.

S'il existe une liseuse par personne, alors le critère est validé.`,
    non_applicabilite: null,
    notes:
      "C'est l'éclairage en tête de lit qui doit être indépendant de l'éclairage central/principal de la pièce. L'interrupteur peut être présent au milieu du lit, s'il se trouve d'un côté du lit seulement, le critère ne peut pas être validé. Si 2 interrupteurs (un de chaque côté du lit) le critère est validé.\n\nUn néon présent le long de la tête de lit peut valider ce critère s'il éclaire les 2 parties.",
  },
  '34': {
    numero: 34,
    titre: "Interrupteur ou système de commande de l'éclairage central près du lit",
    description: `Méthodologie d'évaluation :
Vérification sur place. Il peut s'agir d'un va-et-vient, d'une télécommande…

Le va-et-vient doit commander l'éclairage principal du logement dans le cas d'un studio ou de chaque chambre dans le cas d'un appartement de plusieurs pièces. Le va-et-vient doit permettre d'éteindre l'éclairage de la pièce depuis le lit. Il peut s'agir de l'éclairage central ou des appliques lorsqu'il y en a.

Le critère s'applique uniquement pour les couchages principaux situés dans la (ou les) chambre(s) du logement (les lits d'appoints ne sont pas concernés).

Dans le cas d'un logement de type studio, l'équipement devra être constaté à proximité immédiate du couchage et, lorsqu'il s'agit d'un canapé convertible, au moins d'un côté, pour valider le critère.`,
    non_applicabilite: null,
    notes:
      "Un système d'allumage, extinction avec système de claquage des mains peut permettre de valider ce critère.",
  },
  '35': {
    numero: 35,
    titre: "Présence d'une prise de courant libre située près du lit",
    description: `Méthodologie d'évaluation :
Vérification sur place. Une multiprise ou une fiche multiple ne valide pas le critère. Une prise USB murale peut valider le critère.`,
    non_applicabilite: null,
    notes: null,
  },
  '36': {
    numero: 36,
    titre: "Présence d'une table de chevet par personne",
    description: `Méthodologie d'évaluation :
Vérification sur place. La présence d'une tablette, niche, tabouret tête de lit etc… valide le critère si cela permet la même fonction qu'une table de chevet. Une table de chevet centrale commune est acceptée si deux lits individuels.

Absence de table tolérée pour les lits superposés. Le critère s'applique uniquement pour les couchages principaux situés dans la (ou les) chambre(s) du logement (les lits d'appoints ne sont pas concernés).

Pour valider le critère, l'équipement se situe à proximité immédiate du couchage et au moins d'un côté, lorsqu'il s'agit d'un canapé convertible.`,
    non_applicabilite: null,
    notes: null,
  },
  '37': {
    numero: 37,
    titre: "Une salle d'eau privative dans un espace clos et aéré intérieur au logement",
    description: `Méthodologie d'évaluation :
Vérification sur place. La salle d'eau doit être intérieure et dédiée au logement avec un dispositif d'aération (exemple : ouvrant sur l'extérieur, ventilation mécanique…).

Une salle d'eau ouverte dans la chambre (implantation dans la chambre elle-même sans cloison totale) est tolérée uniquement pour les studios et les logements de 1 chambre accueillant 2 personnes maximum.

Une salle d'eau sans accès indépendant valide le critère. Par exemple : une salle d'eau totalement cloisonnée mais donnant sur une chambre. Si toutes les chambres ont une salle d'eau, alors le critère est validé.`,
    non_applicabilite: null,
    notes: null,
  },
  '38': {
    numero: 38,
    titre: "Une salle d'eau privative avec accès indépendant dans un espace intérieur au logement",
    description: `Méthodologie d'évaluation :
Vérification sur place. La salle d'eau doit être intérieure et dédiée au logement avec accès indépendant et un dispositif d'aération (exemple : ouvrant sur l'extérieur, ventilation mécanique…).

Pour valider ce critère, la salle d'eau ne doit pas donner exclusivement sur une chambre. Une salle d'eau ouverte dans la chambre (implantation dans la chambre elle-même sans cloison totale) est tolérée uniquement pour les studios et les logements de 1 chambre accueillant 2 personnes maximum.

Si toutes les chambres ont une salle d'eau, alors le critère est validé.`,
    non_applicabilite: null,
    notes: null,
  },
  '39': {
    numero: 39,
    titre:
      "Présence d'une salle d'eau ainsi équipée : un lavabo avec eau chaude, une douche et / ou une baignoire (équipée d'une douchette) avec pare-douche ; une baignoire et une douche",
    description: `Méthodologie d'évaluation :
Vérification sur place des installations. Plusieurs cas de figure peuvent se présenter :
- une salle d'eau équipée d'une douche seulement
- une salle d'eau équipée d'une baignoire seulement (dans ce cas, la baignoire doit être équipée d'une douchette et d'un pare-douche)
- une salle d'eau équipée d'une baignoire et d'une douche

Les rideaux de douche sont acceptés uniquement pour les catégories 1* et 2*. Pour les catégories 1* et 2*, baignoire sabot équipée d'une douche avec pare-douche tolérée en lieu et place de la douche.

Les rideaux de douche ou pare-douche ne sont pas obligatoires sur les aménagements tels que les baignoires sur pied, les baignoires d'angle, les balnéo, les baignoires îlots...`,
    non_applicabilite:
      "Il n'y a pas de minimum requis pour la taille des douches et baignoires pour les catégories 1*, 2* et 3*. Ce critère est non applicable pour les catégories 4* et 5*.",
    notes:
      "L'absence de paroi de douche (ou mur séparant la douche du reste de la salle d'eau) est tolérée dans le cas où l'ensemble de la salle de bain, et du logement dans son ensemble, est adapté PMR. Dans le cas contraire, le critère doit être invalidé.",
  },
  '40': {
    numero: 40,
    titre:
      "Présence d'une salle d'eau ainsi équipée : un lavabo avec eau chaude, une douche (dimensions supérieures au standard) et / ou une baignoire (équipée d'une douchette) avec pare-douche (dimensions supérieures au standard) ; une baignoire et une douche",
    description: `Méthodologie d'évaluation :
Vérification sur place des installations et des dimensions requises. Les rideaux de douche sont acceptés uniquement pour les catégories 1* et 2*. Pour les catégories 1* et 2*, baignoire sabot équipée d'une douche avec pare-douche tolérée en lieu et place de la douche.

Les rideaux de douche ou pare-douche ne sont pas obligatoires sur les aménagements tels que les baignoires sur pied, les baignoires d'angle, les balnéo, les baignoires îlots...

Dimensions standard :
- Dimension douche standard = 80 cm x 80 cm
- Dimension baignoire standard = 170 cm x 75 cm

Des dimensions différentes mais totalisant une surface supérieure aux dimensions standards valident le critère (ex. : 70cm x 95 cm). La forme de l'équipement est laissée libre (rectangle, carré, ¼ de rond…). Dans la pratique, les mesures se prennent avec les bords.`,
    non_applicabilite: null,
    notes:
      "Les douches ou baignoires à angle rond valident le critère par leur largeur et longueur (le diamètre) si elles sont supérieures à celles requises dans le critère.\n\nSi présence des 2 équipements (douche et baignoire), le critère est invalidé si l'un des équipements à des dimensions n'étant pas supérieures au standard.",
  },
  '41': {
    numero: 41,
    titre:
      "Un WC (avec cuvette, abattant, chasse d'eau, dérouleur et poubelle) privatif intérieur au logement",
    description: `Méthodologie d'évaluation :
Vérification sur place des installations et des équipements exigés.

Les toilettes sèches sont acceptées.

Si toutes les chambres sont équipées de WC privatifs, alors le critère est validé.`,
    non_applicabilite: null,
    notes:
      "Si un appartement a un WC qui lui est privatif mais est à l'extérieur de l'appartement sur le palier de son étage, le classement est possible en invalidant le critère obligatoire 41.\n\nLe WC doit être à usage exclusif du meublé de tourisme.",
  },
  '42': {
    numero: 42,
    titre:
      "Un WC (avec cuvette, abattant, chasse d'eau, dérouleur et poubelle) privatif intérieur au logement indépendant de la salle d'eau",
    description: `Méthodologie d'évaluation :
Vérification sur place des installations et des équipements exigés.

Les toilettes sèches sont acceptées.

Si toutes les chambres sont équipées de WC privatifs, alors le critère est validé.`,
    non_applicabilite: null,
    notes:
      'Si des WC sont situés dans une salle de bain, avec une porte fermée, cela ne répond pas à la définition de WC indépendants de la salle de bain.\n\nLe but étant que si la salle de bain est occupée, les WC soient quand-même accessibles.',
  },
  '43': {
    numero: 43,
    titre:
      "Une deuxième salle d'eau privative dans un espace clos et aéré intérieur au logement avec accès indépendant",
    description: `Méthodologie d'évaluation :
Vérification sur place. La salle d'eau doit être intérieure et dédiée au logement avec accès indépendant et un dispositif d'aération (exemple : ouvrant sur l'extérieur, ventilation mécanique…).

Le critère peut être validé si cette deuxième salle d'eau n'a pas d'accès indépendant, uniquement si la première salle d'eau (jusqu'à 6 personnes en 1*, 2*, 3* et 4*, et jusqu'à 4 personnes en 5*) a bien un accès indépendant.

Si toutes les chambres sont équipées de salles d'eau, alors le critère est validé.`,
    non_applicabilite:
      'Pour les logements de moins de 7 personnes, ce critère est non applicable en 1,2,3,4*. Pour les logements de moins de 5 personnes, ce critère est non applicable en 5*.',
    notes:
      "Interprétation valable pour les critères 43 à 45.\n\nLes critères 43, 44 et 45 sont à considérer indépendamment. Le critère 43 peut être validé si cette deuxième salle d'eau n'a pas d'accès indépendant, uniquement si la première salle d'eau (jusqu'à 6 personnes en 1*, 2*, 3* et 4*, et jusqu'à 4 personnes en 5*) a bien un accès indépendant. Si toutes les chambres sont équipées de salles d'eau, alors le critère est validé.\n\nPour la seconde salle de bain, les WC peuvent en effet se trouver dans la salle de bain pour valider le critère.",
  },
  '44': {
    numero: 44,
    titre:
      "Présence d'une salle d'eau ainsi équipée : - un lavabo avec eau chaude - une douche et / ou une baignoire (équipée d'une douchette) avec pare-douche ; une baignoire et une douche",
    description: `Méthodologie d'évaluation :
Vérification sur place des installations.

Équipements acceptés :
- Les rideaux de douche sont acceptés uniquement pour les catégories 1* et 2*
- Pour les catégories 1* et 2*, baignoire sabot équipée d'une douche avec pare-douche tolérée en lieu et place de la douche
- Les rideaux de douche ou pare-douche ne sont pas obligatoires sur les aménagements tels que les baignoires sur pied, les baignoires d'angle, les balnéo, les baignoires îlots...

Pour les catégories 4* et 5* étoiles, les dimensions doivent être supérieures aux dimensions standard :
- Dimension douche standard = 80 cm x 80 cm
- Dimension baignoire standard = 170 cm x 75 cm

Des dimensions différentes mais totalisant une surface supérieure aux dimensions standard valident le critère (ex. : 70cm x 95 cm). La forme de l'équipement est laissée libre (rectangle, carré, ¼ de rond…).`,
    non_applicabilite:
      'Pour les logements de moins de 7 personnes, ce critère est non applicable en 1,2,3,4*. Pour les logements de moins de 5 personnes, ce critère est non applicable en 5*.',
    notes:
      "Interprétation valable pour les critères 43 à 45.\n\nLes critères 43, 44 et 45 sont à considérer indépendamment. Le critère 43 peut être validé si cette deuxième salle d'eau n'a pas d'accès indépendant, uniquement si la première salle d'eau (jusqu'à 6 personnes en 1*, 2*, 3* et 4*, et jusqu'à 4 personnes en 5*) a bien un accès indépendant. Si toutes les chambres sont équipées de salles d'eau, alors le critère est validé.\n\nPour la seconde salle de bain, les WC peuvent en effet se trouver dans la salle de bain pour valider le critère.",
  },
  '45': {
    numero: 45,
    titre:
      "Un WC (avec cuvette, abattant, chasse d'eau, dérouleur et poubelle) privatif intérieur au logement",
    description: `Méthodologie d'évaluation :
Vérification sur place des installations et des équipements exigés.

Les toilettes sèches sont acceptées.

Si toutes les chambres sont équipées de WC privatifs, alors le critère est validé.`,
    non_applicabilite:
      'Pour les logements de moins de 7 personnes, ce critère est non applicable en 1,2,3,4*. Pour les logements de moins de 5 personnes, ce critère est non applicable en 5*.',
    notes:
      "Interprétation valable pour les critères 43 à 45.\n\nLes critères 43, 44 et 45 sont à considérer indépendamment. Le critère 43 peut être validé si cette deuxième salle d'eau n'a pas d'accès indépendant, uniquement si la première salle d'eau (jusqu'à 6 personnes en 1*, 2*, 3* et 4*, et jusqu'à 4 personnes en 5*) a bien un accès indépendant. Si toutes les chambres sont équipées de salles d'eau, alors le critère est validé.\n\nPour la seconde salle de bain, les WC peuvent en effet se trouver dans la salle de bain pour valider le critère.",
  },
  '46': {
    numero: 46,
    titre: 'Deux points lumineux dont un au-dessus du lavabo',
    description: `Méthodologie d'évaluation :
Vérification sur place. La salle de bain doit être dotée d'un éclairage principal en plus d'un éclairage situé au-dessus du lavabo, soit au moins deux éclairages pour valider le critère.

Si l'éclairage principal est suffisant pour la partie lavabo, alors le critère est validé sans besoin d'éclairage supplémentaire.`,
    non_applicabilite: null,
    notes: null,
  },
  '47': {
    numero: 47,
    titre: "Présence de produits d'accueil",
    description: `Méthodologie d'évaluation :
Vérification sur place. Il s'agit de constater au minimum un savon ou un gel douche + du shampoing dans toutes les salles d'eau.

Le shampoing-douche est accepté pour valider le critère.`,
    non_applicabilite: null,
    notes: null,
  },
  '48': {
    numero: 48,
    titre: 'Une prise de courant libre à proximité du miroir',
    description: `Méthodologie d'évaluation :
Vérification sur place. La prise de courant libre doit permettre de brancher un équipement électrique devant un miroir.`,
    non_applicabilite: null,
    notes:
      'La prise peut se situer hors de la salle de bain, mais elle doit être accessible sans rallonge depuis le lavabo.',
  },
  '49': {
    numero: 49,
    titre: 'Patère(s) ou porte-serviettes',
    description: `Méthodologie d'évaluation :
Vérification sur place. La présence d'un sèche serviettes chauffant valide ce critère.

Le nombre de patères ou la forme du porte-serviettes n'est pas précisé.`,
    non_applicabilite: null,
    notes: null,
  },
  '50': {
    numero: 50,
    titre: 'Sèche-serviettes électrique',
    description: `Méthodologie d'évaluation :
Vérification sur place de l'existence et du fonctionnement de l'équipement.

Le sèche-serviettes doit être chauffant. L'équipement peut être mobile ou fixe.`,
    non_applicabilite: null,
    notes: null,
  },
  '51': {
    numero: 51,
    titre: 'Miroir de salle de bain',
    description: `Méthodologie d'évaluation :
Vérification sur place.

Dans le cas d'un miroir en pied dans la salle de bain, les critères 51 et 52 sont validés.`,
    non_applicabilite: null,
    notes: null,
  },
  '52': {
    numero: 52,
    titre: 'Miroir en pied',
    description: `Méthodologie d'évaluation :
Vérification sur place.

Le miroir en pied peut être situé dans le salon ou l'entrée.`,
    non_applicabilite: null,
    notes:
      "Les miroirs sur porte coulissante permettent de valider le critère, s'ils font la taille entière de la porte (de haut en bas).\n\nIl n'y a pas de taille minimum à respecter, il est seulement nécessaire que ce miroir soit disposé de telle façon et respectent des mesures permettant à la clientèle de s'y observer en totalité.",
  },
  '53': {
    numero: 53,
    titre: 'Tablette sous miroir, plan vasque ou étagère proche du miroir',
    description: `Méthodologie d'évaluation :
Vérification sur place.

Il s'agit de vérifier la présence d'un petit espace libre pour permettre de poser un petit nécessaire à proximité du miroir.`,
    non_applicabilite: null,
    notes: null,
  },
  '54': {
    numero: 54,
    titre: 'Espace(s) de rangement supplémentaire(s)',
    description: `Méthodologie d'évaluation :
Vérification sur place. Hors équipement exigé au critère 53 (tablette sous miroir, plan vasque et étagère proche du miroir).

Si présence d'un meuble de rangement, de plusieurs étagères, tiroirs, meuble sous vasque ou autre système, le critère est validé.`,
    non_applicabilite: null,
    notes: null,
  },
  '55': {
    numero: 55,
    titre: 'Sèche-cheveux électrique en nombre suffisant',
    description: `Méthodologie d'évaluation :
Vérification sur place.

Exigences selon la capacité d'accueil :
- Un sèche-cheveux est exigé dans les logements jusqu'à 6 personnes inclus
- Un deuxième sèche-cheveux est exigé dans le logement à partir de 7 personnes

L'équipement doit bien être présent sur place et non sur demande.`,
    non_applicabilite: null,
    notes: null,
  },
  '56': {
    numero: 56,
    titre: 'Evier avec robinet mélangeur ou mitigeur',
    description: `Méthodologie d'évaluation :
Vérification sur place de l'existence et du fonctionnement de l'équipement.

Vérifier la possibilité d'obtenir de l'eau froide et de l'eau chaude.`,
    non_applicabilite: null,
    notes: null,
  },
  '57': {
    numero: 57,
    titre: 'Nombre de foyers respectés',
    description: `Méthodologie d'évaluation :
Vérification sur place de l'existence et du fonctionnement de l'équipement.`,
    description_suite: `Pour les exigences d'une plaque à 4 foyers, si le logement est équipé d'une plaque à induction, à gaz ou vitrocéramique à 3 foyers, alors le critère est réputé acquis.`,
    non_applicabilite: null,
    notes:
      "Si la plaque ne dispose pas du nombre de foyers minimum, l'exploitant peut ajouter des plaques \"portables\" à condition que ces plaques soient installées et visibles à l'arrivée du client et qu'elles ne soient pas rangées dans un placard ou autre.",
    illustration: '/images/illustrations/notes_crit_57.jpg',
  },
  '58': {
    numero: 58,
    titre: 'Plaque vitrocéramique, à induction ou à gaz',
    description: `Méthodologie d'évaluation :
Vérification sur place de l'existence et du fonctionnement de l'équipement.

Pour valider le critère, le nombre de foyers doit correspondre aux exigences du critère 57 avec la tolérance :
- Minimum 2 foyers pour les catégories 1* et 2* pour les logements jusqu'à 4 personnes inclus
- Au minimum 3 foyers pour les autres catégories de classement et les logements de 5 personnes et plus.`,
    non_applicabilite: null,
    notes: null,
  },
  '59': {
    numero: 59,
    titre: 'Four ou mini-four',
    description: `Méthodologie d'évaluation :
Vérification sur place de l'existence et du fonctionnement de l'équipement.

Catégories 1* et 2* :
- Si le four est équipé d'une fonction « micro-ondes », alors le critère 60 est réputé acquis.

Catégories 3*, 4* et 5* :
- Le four (ou mini-four) et le micro-ondes doivent être des équipements à part.

Pour toutes les catégories et à partir de 5 personnes :
- L'équipement doit avoir une capacité minimum de 45 litres.`,
    non_applicabilite: null,
    notes: null,
  },
  '60': {
    numero: 60,
    titre: 'Four à micro-ondes',
    description: `Méthodologie d'évaluation :
Vérification sur place de l'existence et du fonctionnement de l'équipement.

Catégories 1* et 2* :
- Si le four micro-ondes est équipé d'une fonction « four combiné » ou « fonction grill », alors le critère 59 est réputé acquis.

Catégories 3*, 4* et 5* :
- Le four (ou mini-four) et le micro-ondes doivent être des équipements à part.`,
    non_applicabilite: null,
    notes: null,
  },
  '61': {
    numero: 61,
    titre: 'Ventilation ou ventilation mécanique contrôlée',
    description: `Méthodologie d'évaluation :
Vérification sur place. La ventilation a pour but de renouveler l'air ambiant.

Il est entendu par « ventilation » seule, une aération naturelle dans la cuisine ou le coin cuisine.

Ce renouvellement d'air peut s'effectuer à l'aide d'une ventilation par aération naturelle (par exemple ouvrant sur l'extérieur) ou par ventilation mécanique.`,
    non_applicabilite: null,
    notes: null,
  },
  '62': {
    numero: 62,
    titre: 'Hotte aspirante',
    description: `Méthodologie d'évaluation :
Vérification sur place de l'existence et du fonctionnement de l'équipement.

Une hotte aspirante est un équipement qui permet d'évacuer les émanations d'une cuisine grâce à un dispositif électrique.

La hotte aspirante peut être de différentes sortes : encastrable, tiroir ou casquette... Le type de hotte aspirante en termes de design est libre.`,
    non_applicabilite: null,
    notes: null,
  },
  '63': {
    numero: 63,
    titre: 'Quantité de vaisselle de table non dépareillée, minimum par personne',
    description: `Méthodologie d'évaluation :
Vérification sur place. Vaisselle non dépareillée obligatoire, rangée dans un range couverts.

Quantité à vérifier en fonction de la capacité d'accueil du logement.

La vaisselle doit être, dans son intégralité, propre et en bon état.`,
    non_applicabilite: null,
    notes: null,
  },
  '64': {
    numero: 64,
    titre: 'Vaisselle supplémentaire : 1 coupe à champagne, 1 verre à apéritif par personne',
    description: `Méthodologie d'évaluation :
Vérification sur place. Le verre à apéritif peut être adapté.

Exemples : verre à bière, punch ou autre apéritif.

Quantité à vérifier en fonction de la capacité d'accueil du logement. La vaisselle doit être, dans son intégralité, propre et en bon état.`,
    non_applicabilite: null,
    notes:
      'Les 2 équipements doivent être présents pour valider le critère : 1 coupe à champagne ET 1 verre à apéritif par personne.',
  },
  '65': {
    numero: 65,
    titre: 'Equipement minimum pour la préparation des repas',
    description: `Méthodologie d'évaluation :
Vérification sur place. Tous les équipements doivent être propres et en bon état.`,
    non_applicabilite: null,
    notes: null,
  },
  '66': {
    numero: 66,
    titre: 'Au moins deux équipements de petit-électroménager',
    description: `Méthodologie d'évaluation :
Vérification sur place de la présence d'au moins deux équipements de petit-électroménager.

Exemples d'équipements acceptés :
- Balance électronique, mixeur plongeant, hachoir électrique, friteuse
- Appareil à raclette ou à fondue, plancha, crêpière électrique
- Machine à sodas, presse agrumes électrique ou extracteur de jus
- Machine à pain, yaourtière, gaufrier, blender…

La liste des équipements est non exhaustive.

Les machines à café ne valident pas ce critère et sont concernées aux critères 68 et 69.`,
    non_applicabilite: null,
    notes: null,
  },
  '67': {
    numero: 67,
    titre: 'Autocuiseur ou cuit-vapeur ou robot de cuisine multifonctions',
    description: `Méthodologie d'évaluation :
Vérification sur place.

Si un robot de cuisine multifonctions est constaté, alors le critère 66 est également validé.

La présence d'un autocuiseur ou cuit-vapeur valide bien le critère 67 mais ne valide pas le critère 66.`,
    non_applicabilite: null,
    notes: null,
  },
  '68': {
    numero: 68,
    titre: 'Cafetière',
    description: `Méthodologie d'évaluation :
Vérification sur place.

Types acceptés : Cafetière électrique (cafetière filtre, percolateur…) ou mécanique (cafetière à l'italienne, à piston…).`,
    non_applicabilite: null,
    notes: null,
  },
  '69': {
    numero: 69,
    titre: 'Machine à expresso',
    description: `Méthodologie d'évaluation :
Vérification sur place.

La présence d'une machine à expresso valide également le critère 68.`,
    non_applicabilite: null,
    notes: null,
  },
  '70': {
    numero: 70,
    titre: 'Bouilloire',
    description: `Méthodologie d'évaluation :
Vérification sur place. Une bouilloire adaptée au système de cuisson (vitrocéramique, gaz, induction…) valide le critère.

Cette précision signifie que la bouilloire n'est pas nécessairement reliée au système électrique.

La possibilité de faire couler de l'eau chaude depuis une machine à expresso ne valide pas le critère.`,
    non_applicabilite: null,
    notes: null,
  },
  '71': {
    numero: 71,
    titre: 'Grille-pain',
    description: `Méthodologie d'évaluation :
Vérification sur place. La forme et le design sont libres.

Un four (ou mini-four) et une machine à sandwich/gaufrier avec la fonction toaster ne valident pas le critère grille-pain.`,
    non_applicabilite: null,
    notes: null,
  },
  '72': {
    numero: 72,
    titre: 'Lave-vaisselle pour les logements à partir de 2 personnes',
    description: `Méthodologie d'évaluation :
Vérification sur place.

Le critère ne précise pas de minimum de capacité en nombre de couverts, un mini lave-vaisselle ou un lave-vaisselle compact sont acceptés.`,
    non_applicabilite: 'Le critère est non applicable pour les logements de 1 personne.',
    notes: null,
  },
  '73': {
    numero: 73,
    titre: 'Lave-vaisselle de 6 couverts ou plus pour les logements à partir de 4 personnes',
    description: `Méthodologie d'évaluation :
Vérification sur place.

La capacité du lave-vaisselle doit être de 6 couverts ou plus pour valider ce critère.`,
    non_applicabilite: 'Le critère est non applicable pour les logements de 3 personnes et moins.',
    notes:
      "Pour déterminer la capacité du lave-vaisselle, vérifier en priorité l'étiquette énergie où le nombre de couverts est indiqué avec un pictogramme dédié. À défaut, consulter la plaque signalétique de l'appareil (située sur le bord de la porte) ou la notice d'utilisation. Si aucun de ces documents n'est disponible, relever le numéro de modèle sur la plaque signalétique pour rechercher les caractéristiques techniques en ligne ou contacter le fabricant.",
  },
  '74': {
    numero: 74,
    titre: 'Réfrigérateur avec compartiment conservateur',
    description: `Méthodologie d'évaluation :
Vérification sur place.

Exigences de capacité :
- L'exigence minimum est de 110 litres pour deux personnes et 10 litres en plus par occupant supplémentaire.

Équipements combinés :
- Les équipements combinés « réfrigérateur-congélateur ou compartiment congélateur » sont acceptés pour toutes les catégories
- Dans ce cas, la partie seule du réfrigérateur doit bien être d'au moins 110 litres pour deux personnes et 10 litres en plus par occupant supplémentaire.

Spécificité studios :
- Pour les studios uniquement, l'exigence est de 80L (partie réfrigérée, hors compartiment) pour deux personnes et 10L en plus par occupant supplémentaire.`,
    non_applicabilite: null,
    notes:
      "Pour déterminer la capacité du réfrigérateur, vérifier en priorité l'étiquette énergie qui indique le volume en litres (accessible via le QR code pour les appareils récents). À défaut, consulter la plaque signalétique située à l'intérieur de l'appareil (généralement derrière le bac à légumes, sur un flanc intérieur en haut, ou en bas à gauche). La capacité à prendre en compte est le volume net (ou volume utile) de la partie réfrigérée uniquement, hors compartiment congélateur. Si aucune information n'est disponible sur place, relever le numéro de modèle pour rechercher les caractéristiques techniques en ligne.",
  },
  '75': {
    numero: 75,
    titre: "Présence d'un congélateur ou compartiment congélateur",
    description: `Méthodologie d'évaluation :
Vérification sur place.`,
    non_applicabilite: null,
    notes: null,
  },
  '76': {
    numero: 76,
    titre: 'Poubelle fermée avec couvercle',
    description: `Méthodologie d'évaluation :
Vérification sur place. La poubelle doit être fermée pour valider le critère.

Une poubelle encastrable fermée ou dans un placard fermé valide également le critère.`,
    non_applicabilite: null,
    notes: null,
  },
  '77': {
    numero: 77,
    titre: 'Pour accéder au 4ème étage à partir du rez-de-chaussée',
    description: `Méthodologie d'évaluation :
Vérification sur place. Sauf contrainte locale ou architecturale.`,
    non_applicabilite: `Si le logement est situé en rez-de-chaussée, alors, lorsque le critère est obligatoire, il devient non applicable.\
Si le logement est situé entre le 1er et 3ème étage, alors, lorsque le critère est obligatoire, il devient optionnel.\
Ce critère s’applique aux seuls logements situés dans des immeubles ou habitats collectifs. Il est non applicable dans les autres cas de figure.\
Les contraintes locales ou architecturales peuvent rendre le critère non applicable sur présentation d’un justificatif officiel (exemple : bâtiment classé).\
Ce critère est non applicable en 3*, 4* et 5*.`,
    notes: null,
  },
  '78': {
    numero: 78,
    titre: 'Pour accéder au 3ème étage à partir du rez-de-chaussée',
    description: `Méthodologie d'évaluation :
Vérification sur place. Sauf contrainte locale ou architecturale.`,
    non_applicabilite: `Si le logement est situé en rez-de-chaussée, alors, lorsque le critère est obligatoire, il devient non applicable.\
Si le logement est situé entre le 1er et 2ème étage, alors, lorsque le critère est obligatoire, il devient optionnel.\
Ce critère s’applique aux seuls logements situés dans des immeubles ou habitats collectifs. Il est non applicable dans les autres cas de figure.\
Les contraintes locales ou architecturales peuvent rendre le critère non applicable sur présentation d’un justificatif officiel (exemple : bâtiment classé).`,
    notes: null,
  },
  '79': {
    numero: 79,
    titre: 'Emplacement(s) à proximité',
    description: `Méthodologie d'évaluation :
Vérification visuelle sur place de la proximité des emplacements dans un rayon de 300 mètres et/ou vérification des supports de communication relatifs au logement.

Il est entendu par « emplacement(s) à proximité » la possibilité de stationnement(s) extérieur(s) au logement meublé/immeuble/résidence.`,
    non_applicabilite:
      'En cas de contrainte locale, le critère est non applicable. Les contraintes locales peuvent être liées aux autorisations de circulation en centre-ville par exemple.',
    notes: 'Un parking public payant peut permettre de valider ce critère.',
  },
  '80': {
    numero: 80,
    titre: 'Emplacement(s) privatif(s)',
    description: `Méthodologie d'évaluation :
Vérification visuelle sur place de l'emplacement privatif.

Il est entendu par « emplacement(s) privatif(s) » une possibilité de stationnement dédié exclusivement au logement meublé.

L'emplacement privatif doit être situé dans un rayon maximum de 300 mètres.`,
    non_applicabilite:
      'En cas de contrainte locale, le critère est non applicable. Les contraintes locales peuvent être liées aux autorisations de circulation en centre-ville par exemple.',
    notes: null,
  },
  '81': {
    numero: 81,
    titre: 'Garage ou abri couvert privatif',
    description: `Méthodologie d'évaluation :
Vérification visuelle sur place de l'abri ou du garage privatif.

Il est entendu par « abri ou garage privatif » une possibilité de stationnement dédiée exclusivement au logement meublé.

Tout système équivalent, privatif et/ou fermé, valide le critère (exemple : garage ouvert privatif : couvert privatif et clos, box dans résidence, etc…).

Les points des critères 79, 80 et 81 peuvent se cumuler.`,
    non_applicabilite: null,
    notes: null,
  },
  '82': {
    numero: 82,
    titre: 'Logement avec balcon, loggia ou véranda (3 m² minimum)',
    description: `Méthodologie d'évaluation :
Vérification sur place de la présence d’un balcon, d’une loggia ou d’une véranda et de sa superficie.`,
    non_applicabilite: null,
    notes: `Ces critères sont optionnels et indépendants. Ils sont à valider selon la configuration du logement. Ils ne se cumulent pas systématiquement.\
La loggia étant citée dans le critère 82, elle est associée à un balcon ou une véranda, soit un espace supplémentaire au logement ayant sa propre dimension. Sa surface n’est donc pas à intégrer dans la surface globale du meublé.`,
  },
  '83': {
    numero: 83,
    titre: 'Logement avec terrasse ou jardin privé (8m² minimum)',
    description: `Méthodologie d'évaluation :
Vérification sur place de la présence d'une terrasse ou d'un jardin privé et de sa superficie.

Une cour intérieure aménagée est tolérée pour valider le critère.`,
    non_applicabilite: null,
    notes: `Ces critères sont optionnels et indépendants. Ils sont à valider selon la configuration du logement. Ils ne se cumulent pas systématiquement.\
La loggia étant citée dans le critère 82, elle est associée à un balcon ou une véranda, soit un espace supplémentaire au logement ayant sa propre dimension. Sa surface n’est donc pas à intégrer dans la surface globale du meublé.`,
  },
  '84': {
    numero: 84,
    titre: 'Logement avec parc ou jardin (50 m² minimum)',
    description: `Méthodologie d'évaluation :
Vérification sur place du parc ou du jardin et de sa superficie.

La superficie doit être de 200 m² minimum quand le parc ou jardin est commun à d'autres logements.`,
    non_applicabilite: null,
    notes: `Ces critères sont optionnels et indépendants. Ils sont à valider selon la configuration du logement. Ils ne se cumulent pas systématiquement.\
La loggia étant citée dans le critère 82, elle est associée à un balcon ou une véranda, soit un espace supplémentaire au logement ayant sa propre dimension. Sa surface n’est donc pas à intégrer dans la surface globale du meublé.`,
  },
  '85': {
    numero: 85,
    titre: 'Présence de mobilier de jardin privatif propre et en bon état',
    description: `Méthodologie d'évaluation :
Vérification sur place du mobilier. Le mobilier de jardin doit être privatif pour la location.

La présence d'une assise extérieure par personne et d'une table doit être constatée pour valider le critère.

Le nombre d'assises doit correspondre à la capacité d'accueil du logement, plafonné à 7 personnes.`,
    non_applicabilite: null,
    notes: null,
  },
  '86': {
    numero: 86,
    titre: 'Mise à disposition d’une plancha extérieure et/ou d’un barbecue extérieur',
    description: `Méthodologie d'évaluation :
Vérification sur place de l'appareil extérieur.

Appareil extérieur équivalent accepté (four à pizza…). L'appareil peut se situer dans le jardin, sur une terrasse, sur un balcon…`,
    non_applicabilite: null,
    notes: null,
  },
  '87': {
    numero: 87,
    titre: 'Un équipement léger de loisirs, détente ou sport, dédié au logement',
    description: `Méthodologie d'évaluation :
Vérification sur place. Accès gratuit en propriété pleine ou copropriété.

Exemples d'équipements :
- Jeux de société (au moins 3), jeux d'extérieur (au moins 2)
- Prêt de matériel (vélo, luge, trottinette...)
- Salle de jeux avec jeux, baignoire balnéo et douche balnéo
- Billard, baby-foot, ping-pong, balançoire…`,
    non_applicabilite: null,
    notes: null,
  },
  '88': {
    numero: 88,
    titre: 'Un équipement aménagé de loisirs, détente ou sport, dédié au logement',
    description: `Méthodologie d'évaluation :
Vérification sur place. Accès gratuit en propriété pleine ou copropriété.

Exemples d'équipements : terrain de tennis, sauna, jacuzzi, hammam, étang de pêche, salle de fitness/sport, bain nordique…`,
    non_applicabilite: null,
    notes: null,
  },
  '89': {
    numero: 89,
    titre: 'Piscine extérieure ou intérieure',
    description: `Méthodologie d'évaluation :
Vérification sur place. Accès gratuit en propriété pleine ou copropriété.`,
    non_applicabilite: null,
    notes: null,
  },
  '90': {
    numero: 90,
    titre: 'Piscine extérieure ou intérieure chauffée',
    description: `Méthodologie d'évaluation :
Vérification sur place. Accès gratuit en propriété pleine ou copropriété.`,
    non_applicabilite: null,
    notes: null,
  },
  '91': {
    numero: 91,
    titre: 'Existence de rangement(s) pour équipement sportif',
    description: `Méthodologie d'évaluation :
Vérification sur place. Accès gratuit en propriété pleine ou copropriété.

Il faut au moins un rangement minimum pour valider le critère. Le rangement doit pouvoir accueillir un équipement sportif (ex : casier à ski, vélo, kayak, canoé…).

Si le logement possède un garage privatif ou un espace de rangement privatif assez grand pour permettre le rangement d'équipements sportifs, alors le critère est validé.`,
    non_applicabilite: 'Le critère est non applicable si la localisation n’est pas adaptée.',
    notes:
      'Un logement situé en ville peut être concerné par la mention « non applicable » si la localisation n’est pas adaptée.',
  },
  '92': {
    numero: 92,
    titre: 'Logement avec vue paysagère (vue mer, montagne, plaine ou zone urbaine)',
    description: `Méthodologie d'évaluation :
Vérification visuelle sur place.`,
    non_applicabilite: null,
    notes: null,
  },
  '93': {
    numero: 93,
    titre:
      'Logement avec accès immédiat à un environnement offrant la possibilité de faire des activités : nature, culture et sport',
    description: `Méthodologie d'évaluation :
Vérification sur place. L'accès doit être situé à 1km maximum.

Exemples d'espaces offrant la possibilité de faire des activités :
- Pistes de ski, pistes cyclables
- Espaces naturels préservés (parc naturel, chemins de randonnées...)
- Plage ou plan d'eau, établissement thermal
- Théâtre, cinéma, salle de spectacle, parc d'attraction, salle de sport...`,
    non_applicabilite: null,
    notes: null,
  },
  '94': {
    numero: 94,
    titre: 'Logement avec accès immédiat aux commerces, services et transports en commun',
    description: `Méthodologie d'évaluation :
Vérification sur place. L'accès doit être situé à 1km maximum.

Exemples d'espaces :
- Commerces sédentaires (boulangerie, boucherie, primeur, supermarché…)
- Marchés, services (pharmacie, médecin…)
- Transports en communs…`,
    non_applicabilite: null,
    notes: null,
  },
  '95': {
    numero: 95,
    titre: "Les sanitaires (toilette(s) et salle(s) d'eau) sont propres et en bon état",
    description: `Méthodologie d'évaluation :
Vérification sur place.

Le sol, le plafond, la paroi de douche (ou rideau de douche) et les murs sont propres et en bon état (absence de moisissures, saletés, traces de calcaire, cheveux...).

Absence de carrelage cassé et de revêtement abîmé.`,
    non_applicabilite: null,
    notes:
      "Le critère doit être invalidé dans le cas de l'absence de toilette(s) et/ou salle(s) d'eau, et/ou dans le cas où les toilette(s) et/ou salle(s) d'eau sont partagés avec d'autres logements.",
  },
  '96': {
    numero: 96,
    titre: 'Les sols, murs et plafonds sont propres et en bon état',
    description: `Méthodologie d'évaluation :
Vérification sur place.

Absence de saletés sur les murs, de peintures écaillées, de papier peint abîmé et déchiré, de carrelage cassé, de moquette tâchée, de traces de moisissures…`,
    non_applicabilite: null,
    notes: null,
  },
  '97': {
    numero: 97,
    titre: 'Le mobilier est propre et en bon état',
    description: `Méthodologie d'évaluation :
Vérification sur place.

Absence de mobiliers cassés, déboités et sales. Absence également, par exemple, de rideaux déchirés, troués ou salis…`,
    non_applicabilite: null,
    notes: null,
  },
  '98': {
    numero: 98,
    titre: 'La literie est propre et en bon état',
    description: `Méthodologie d'évaluation :
Vérification sur place.

Le contrôle de la literie porte sur le sommier, les matelas et éventuellement le sur-matelas.

Absence de tâches, de trous, de décoloration.`,
    non_applicabilite: null,
    notes: null,
  },
  '99': {
    numero: 99,
    titre: 'La cuisine ou coin cuisine et les équipements sont propres et en bon état',
    description: `Méthodologie d'évaluation :
Vérification sur place.

Le contrôle des équipements de la cuisine ou du coin-cuisine porte sur l'intégralité des équipements et des installations : robinets, joints, poignées de placards, évier, hotte, mobilier, électroménager...

Absence de tâches, moisissures, saleté, d'équipement cassé ou détérioré.`,
    non_applicabilite: null,
    notes:
      "Ce critère ne peut être invalidé dans le seul cas où il s'agit de la vaisselle et du matériel de cuisson (critères 63 à 65) qui sont en mauvais état.",
  },
  '100': {
    numero: 100,
    titre:
      "Mise à disposition de brochures d'informations locales et touristiques en français et dans au moins une langue étrangère",
    description: `Méthodologie d'évaluation :
Vérification sur place.

Exigences pour valider le critère :
- Il faut au moins 5 dépliants au total et/ou brochures dont 3 disponibles en langue(s) étrangère(s).

Format de la documentation :
- La documentation peut être présentée sous format papier ou numérique (QR code, tablette, lien de téléchargement, site internet, etc...).
- Si la documentation est bilingue, elle valide le français et la langue étrangère.

Types de brochures et/ou informations possibles :
Sites, monuments, activités et équipements de loisirs, excursions, animations, office de tourisme, commerces, services publics, santé, cultes...`,
    non_applicabilite: null,
    notes: null,
  },
  '101': {
    numero: 101,
    titre: "Mise à disposition d'un livret d'accueil",
    description: `Méthodologie d'évaluation :
Vérification sur place.

Contenu minimum requis :
- Les coordonnées du gestionnaire
- Les numéros d'urgence
- Le fonctionnement de la location (digicode(s), code WiFi…)

Contenu complémentaire possible :
- Les modes d'emploi des équipements spécifiques
- Les bonnes adresses…

Format de présentation :
- Le livret d'accueil peut être mis à disposition sous format papier ou numérique (QR code, tablette, lien de téléchargement, site internet, etc...).

Exigence linguistique :
- Le livret d'accueil doit être en version bilingue à partir de 3 étoiles.`,
    non_applicabilite: null,
    notes: "Un affichage dans le logement, s'il est complet, valide le point.",
  },
  '102': {
    numero: 102,
    titre: 'Accueil sur place par le propriétaire ou son représentant',
    description: `Méthodologie d'évaluation :
Vérification par tout moyen (brochures, guide d'accueil, site internet, location sur un site revendeur, site office de tourisme, affichette, vérification par email, …).

Accueil des clients sur place par le propriétaire ou par son représentant (agence, personne mandatée…).`,
    non_applicabilite: null,
    notes: null,
  },
  '103': {
    numero: 103,
    titre: "Cadeau de bienvenue à l'arrivée du client",
    description: `Méthodologie d'évaluation :
Vérification par tout moyen (brochures, guide d'accueil, site internet, location sur un site revendeur, site office de tourisme, affichette, vérification par email, photos des cadeaux de bienvenue, …).

Exemples : produits locaux ou régionaux offerts, bouquet de fleurs, billets d'entrée pour des sites de visite, des réductions dans des lieux de restauration, de divertissement, etc…`,
    non_applicabilite: null,
    notes:
      'Un élément tangible doit être présenté pour valider le critère. La simple déclaration verbale du propriétaire ne suffit pas.',
  },
  '104': {
    numero: 104,
    titre: "Existence d'une boîte à clé ou système équivalent",
    description: `Méthodologie d'évaluation :
Vérification sur place de la présence de l'équipement, de son fonctionnement et de la communication au client par tout moyen (brochures, guide d'accueil, site internet, location sur un site revendeur, site office de tourisme, affichette, vérification par email, …).

Une boîte à clés permet aux clients d'arriver de manière autonome aux horaires durant lesquels un accueil sur place ne serait pas possible.

Le système peut être équivalent (serrure à code, serrure digitale et/ou connectée…).`,
    non_applicabilite: null,
    notes: null,
  },
  '105': {
    numero: 105,
    titre: 'Draps de lit proposés systématiquement par le loueur',
    description: `Méthodologie d'évaluation :
A vérifier par tout moyen (brochures, guide d'accueil, site internet, location sur un site revendeur, site office de tourisme, affichette, vérification par email, …).

Il s'agit de vérifier que le loueur propose bien les draps de lit systématiquement à ses clients.

Prestations pouvant être assurées sous forme de service gratuit ou payant.`,
    non_applicabilite: null,
    notes: null,
  },
  '106': {
    numero: 106,
    titre: 'Linge de toilette proposé systématiquement par le loueur',
    description: `Méthodologie d'évaluation :
A vérifier par tout moyen (brochures, guide d'accueil, site internet, location sur un site revendeur, site office de tourisme, affichette, vérification par email, …).

Il s'agit de vérifier que le loueur propose bien le linge de toilette systématiquement à ses clients.

Prestations pouvant être assurées sous forme de service gratuit ou payant.`,
    non_applicabilite: null,
    notes: null,
  },
  '107': {
    numero: 107,
    titre: 'Linge de table',
    description: `Méthodologie d'évaluation :
Vérification sur place.

Equipement minimum : une nappe en tissu ou des sets de table et deux torchons de cuisine sont exigés pour valider le critère.

Prestations pouvant être assurées sous forme de service gratuit ou payant.`,
    non_applicabilite: null,
    notes: null,
  },
  '108': {
    numero: 108,
    titre: "Lits faits à l'arrivée proposés systématiquement par le loueur",
    description: `Méthodologie d'évaluation :
A vérifier par tout moyen (brochures, guide d'accueil, site internet, location sur un site revendeur, site office de tourisme, affichette, vérification par email, …).

Il s'agit de vérifier que le loueur propose bien systématiquement à ses clients de faire le(s) lit(s) pour leur arrivée.

Prestations pouvant être assurées sous forme de service gratuit ou payant.`,
    non_applicabilite: null,
    notes: null,
  },
  '109': {
    numero: 109,
    titre: 'Matériel pour bébé à la demande',
    description: `Méthodologie d'évaluation :
Vérification des équipements sur place.

Il faut au minimum un lit bébé et une chaise bébé (ou équivalent de type siège de table, réhausseur de table…) pour valider le critère.

Prestations pouvant être assurées sous forme de service gratuit ou payant.`,
    non_applicabilite: null,
    notes:
      "Même si l'hébergement a un positionnement \"adult only\" le critère reste applicable.\n\nLe matériel doit être présent à la demande du client. S'il n'est pas disponible directement dans l'hébergement, l'information doit être clairement portée à la connaissance de clientèle qu'il peut en faire la demande et un justificatif d'achat du matériel doit être présenté à l'inspecteur.",
  },
  '110': {
    numero: 110,
    titre: 'Service de ménage proposé systématiquement',
    description: `Méthodologie d'évaluation :
A vérifier par tout moyen (brochures, guide d'accueil, site internet, location sur un site revendeur, site office de tourisme, affichette, vérification par email, …).

Il s'agit de vérifier que le loueur propose bien systématiquement un service de ménage à ses clients.

Prestations pouvant être assurées sous forme de service gratuit ou payant.`,
    non_applicabilite: null,
    notes: null,
  },
  '111': {
    numero: 111,
    titre: "Présence de produits d'entretien",
    description: `Méthodologie d'évaluation :
Vérification des produits sur place.

Au minimum pour valider le critère :
- Une éponge neuve
- Un produit vaisselle (liquide ou solide)
- Un nettoyant multi-usage
- Un torchon de ménage
- Un sac poubelle
- Un rouleau de papier toilette dans chaque W.C.`,
    non_applicabilite: null,
    notes: null,
  },
  '112': {
    numero: 112,
    titre: 'Adaptateurs électriques',
    description: `Méthodologie d'évaluation :
Vérification du stock d'au minimum 2 adaptateurs électriques universels pour valider ce critère.

Un adaptateur électrique permet d'adapter un appareil électrique étranger sur des prises secteur françaises.`,
    non_applicabilite: null,
    notes: null,
  },
  '113': {
    numero: 113,
    titre: "Existence d'un site internet ou d'une page internet dédiée au logement",
    description: `Méthodologie d'évaluation :
Vérification du site internet. La page internet peut être présente sur un réseau social tant que cette page peut être consultée librement.

Le site internet ou la page dédiée doit être géré(e) directement par le propriétaire, le loueur ou son mandataire.

Les plateformes de réservation et sites tiers (offices de tourisme, réseau, conciergerie…) ne sont pas acceptés pour valider le critère.`,
    non_applicabilite: null,
    notes: null,
  },
  '114': {
    numero: 114,
    titre:
      "Existence d'un site internet ou d'une page internet dédiée au logement en une langue étrangère",
    description: `Méthodologie d'évaluation :
Vérification du site internet. La page internet peut être présente sur un réseau social tant que cette page peut être consultée librement.

Le site internet ou la page dédiée doit être géré(e) directement par le propriétaire, le loueur ou son mandataire.

Les plateformes de réservation et sites tiers (offices de tourisme, réseau, conciergerie…) ne sont pas acceptés pour valider le critère.`,
    non_applicabilite: null,
    notes:
      "Nous différencions le pop-up de traduction automatique Google qui ne permet pas de valider ces critères, d'une traduction entière du site avec intégration dans la barre d'outils (icône Google).",
  },
  '115': {
    numero: 115,
    titre: 'Animaux de compagnie admis',
    description: `Méthodologie d'évaluation :
A vérifier par tout moyen (brochures, guide d'accueil, site internet, site office de tourisme, affichette, vérification par email, …).

La politique d'accueil des animaux est libre.`,
    non_applicabilite: null,
    notes:
      "Tout affichage, quel que soit l'endroit, valide le critère. Même si le client n'est informé des modalités d'accueil des animaux qu'une fois sur place.\n\nPour rappel, ce critère ne peut être validé que si les animaux sont acceptés dans l'établissement.",
  },
  '116': {
    numero: 116,
    titre: "Informations concernant l'accessibilité sur les supports d'information",
    description: `Méthodologie d'évaluation :
A vérifier par tout moyen (pictogrammes sur brochures, site internet, site office de tourisme, vérification par email, …).

Il s'agit, en amont, d'informer la clientèle de l'accessibilité ou non du logement meublé.

Si le logement n'est pas adapté, cela doit être clairement précisé.`,
    non_applicabilite: null,
    notes:
      "Dans le cas d'un établissement n'étant pas accessible, cette non-accessibilité doit être précisée sur les supports de communication pour pouvoir valider le critère.\n\nSi l'établissement n'est adapté qu'à une partie des 4 familles de handicap, le critère peut être validé. L'information doit être claire pour la clientèle.",
  },
  '117': {
    numero: 117,
    titre:
      'Mise à disposition de télécommande de télévision à grosses touches et de couleurs contrastées',
    description: `Méthodologie d'évaluation :
Vérification de l'équipement sur place lors de la visite d'inspection. L'équipement peut être mis à disposition sur demande.

Il faut au moins un équipement par télévision pour valider le critère.

L'information doit être portée à la connaissance des clients par tout moyen (brochures, guide d'accueil, site internet, site office de tourisme, affichette, vérification par email, …).`,
    non_applicabilite: null,
    notes: null,
  },
  '118': {
    numero: 118,
    titre: "Présence d'un siège de douche avec barre d'appui",
    description: `Méthodologie d'évaluation :
Vérification des installations ou équipements sur place.

Les équipements peuvent être fixes ou mobiles. Le siège peut être sous forme de tabouret ou de chaise.

Au minimum une douche équipée.`,
    non_applicabilite: null,
    notes: null,
  },
  '119': {
    numero: 119,
    titre: "Présence de WC avec barre d'appui",
    description: `Méthodologie d'évaluation :
Vérification de l'installation sur place.

Au minimum un WC équipé.`,
    non_applicabilite: null,
    notes: null,
  },
  '120': {
    numero: 120,
    titre: 'Largeur de toutes les portes adaptées',
    description: `Méthodologie d'évaluation :
Vérification de la largeur de toutes les portes sur place.

Minimum 0,77 mètre (passage utile).`,
    non_applicabilite: null,
    notes: null,
  },
  '121': {
    numero: 121,
    titre: 'Document accessible mis à disposition',
    description: `Méthodologie d'évaluation :
Vérification sur place. Le document doit être accessible à au moins un type de personnes en situation de handicap.

Exemples de documents :
- Guide d'accueil en braille ou description audio
- Notice explicative des équipements en caractères agrandis
- Brochures touristiques ou locales adaptées, accompagnées par exemple de pictogrammes ou d'images…

Il s'agit d'un document papier ou numérique.

Si le meublé est labellisé Tourisme et Handicap, le critère est validé.`,
    non_applicabilite: null,
    notes: null,
  },
  '122': {
    numero: 122,
    titre: 'Obtention du label Tourisme et Handicap',
    description: `Méthodologie d'évaluation :
Vérification de la labellisation et des dates d'obtention du label.`,
    non_applicabilite: null,
    notes: null,
  },
  '123': {
    numero: 123,
    titre: "Mise en œuvre d'une mesure de réduction de consommation d'énergie",
    description: `Méthodologie d'évaluation :
Vérification sur place complétée de factures de l'équipement ou des travaux.

Exemples de mesures courantes :
- Contrôle automatique du chauffage
- Investissement dans des équipements et appareils professionnels économes
- Mise en place de double ou triple vitrage, détecteur de présence
- Installation de panneaux solaires, chaudière au bois
- Isolation des combles et des murs, pompe à chaleur
- Coupure automatique de la climatisation ou de l'éclairage (via horloge pour coupures journalières ou configurée pour être activée lorsque le client quitte le logement)
- Chauffe-eau solaire, éclairages extérieurs automatisés...

La liste est non exhaustive.`,
    non_applicabilite: null,
    notes:
      "Interprétation valable pour les critères 123 et 124.\n\nLes \"équipements et appareils professionnels économes\" concernent ceux ayant une classe énergétique respectueuse de l'environnement. Le schéma ci-joint permet de vérifier ces catégories.\n\nLa cheminée à bois peut permettre de valider les critères 123 et 124 qu'à la condition que la cheminée soit répandue dans l'ensemble des espaces du logement. Si elle permet de chauffer le logement, elle doit remplacer le chauffage existant dans ces surfaces.\n\nDans le cas contraire, la cheminée à bois ne peut pas permettre de valider les critères 123 et 124.",
    illustration: '/images/illustrations/notes_crit_123.jpg',
  },
  '124': {
    numero: 124,
    titre: "Mise en œuvre d'une mesure de réduction de consommation d'énergie supplémentaire",
    description: `Méthodologie d'évaluation :
Vérification sur place complétée de factures de l'équipement ou des travaux. Il s'agit d'une mesure supplémentaire en plus de celle exigée au critère 123.

Exemples de mesures courantes :
- Contrôle automatique du chauffage
- Investissement dans des équipements et appareils professionnels économes
- Mise en place de double ou triple vitrage, détecteur de présence
- Installation de panneaux solaires, chaudière au bois
- Isolation des combles et des murs, pompe à chaleur
- Coupure automatique de la climatisation (via horloge pour coupures journalières ou configurée pour être activée lorsque le client quitte le logement)
- Chauffe-eau solaire, éclairages extérieurs automatisés...

La liste est non exhaustive. Les points se cumulent avec ceux du critère précédent.`,
    non_applicabilite: null,
    notes:
      "Interprétation valable pour les critères 123 et 124.\n\nLes \"équipements et appareils professionnels économes\" concernent ceux ayant une classe énergétique respectueuse de l'environnement. Le schéma ci-joint permet de vérifier ces catégories.\n\nLa cheminée à bois peut permettre de valider les critères 123 et 124 qu'à la condition que la cheminée soit répandue dans l'ensemble des espaces du logement. Si elle permet de chauffer le logement, elle doit remplacer le chauffage existant dans ces surfaces.\n\nDans le cas contraire, la cheminée à bois ne peut pas permettre de valider les critères 123 et 124.",
    illustration: '/images/illustrations/notes_crit_123.jpg',
  },
  '125': {
    numero: 125,
    titre: 'Borne de recharge pour les véhicules électriques',
    description: `Méthodologie d'évaluation :
Vérification de l'équipement sur place. L'équipement peut être adapté pour les différents véhicules électriques : voitures, vélos, trottinettes…

L'équipement peut être commun à plusieurs logements, mais l'information doit être clairement portée à la connaissance des clients par tout moyen.

Il s'agit d'un équipement spécifiquement installé pour le logement ou la résidence. Un équipement disponible à tous sur la voie publique ne valide pas le critère.

Le service peut être gratuit ou payant.`,
    non_applicabilite: null,
    notes: null,
  },
  '126': {
    numero: 126,
    titre: "Mise en œuvre d'une mesure de réduction de consommation d'eau",
    description: `Méthodologie d'évaluation :
Vérification sur place complétée de factures de l'équipement ou des travaux. Parmi les plus courantes : installation de mécanismes à double flux dans tous les WC, de stop eau ou de plaquettes écologiques dans les WC, présence de régulateurs de débit d’eau pour les lavabos, de mousseurs, d'aérateurs, récupération et utilisation de l'eau de pluie, système de bouclage d’eau chaude sanitaire (ou boucle ECS), déneigement aux copeaux de bois, graviers, sables, cendres, piscine avec phytoépuration, toilettes sèches... La liste est non exhaustive. Si la mesure concerne le déneigement, l’organisme de contrôle peut la vérifier à l’aide de factures, photos, anciennes commandes, etc…`,
    non_applicabilite: null,
    notes: null,
  },
  '127': {
    numero: 127,
    titre: "Mise en œuvre d'une mesure de réduction de consommation d'eau supplémentaire",
    description: `Méthodologie d'évaluation :
Vérification sur place complétée de factures de l'équipement ou des travaux. Il s’agit d’une mesure supplémentaire en plus de celle exigée au critère 126. Parmi les plus courantes : installation de mécanismes à double flux dans tous les WC, de stop eau ou de plaquettes écologiques dans les WC dans toutes les chambres, présence de régulateurs de débit d’eau pour les lavabos, de mousseurs, d'aérateurs, récupération et utilisation de l'eau de pluie, déneigement aux copeaux de bois, graviers, sables cendres, piscine avec phytoépuration, toilettes sèches... La liste est non exhaustive. Les points se cumulent avec ceux du critère précédent. Si la mesure concerne le déneigement, l’organisme de contrôle peut la vérifier à l’aide de factures, photos, anciennes commandes etc…`,
    non_applicabilite: null,
    notes: null,
  },
  '128': {
    numero: 128,
    titre: "Existence d'un système de tri des déchets dédié au logement",
    description: `Méthodologie d'évaluation :
Vérification sur place du système de tri approprié dédié au logement.

Le critère est validé si le client peut trier a minima les emballages et le verre.

L'inspecteur vérifie :
- L'existence de contenants dédiés au tri dans l'appartement
- L'affichage des règles de tri ainsi que des informations sur la localisation des points de collecte d'apport volontaire

Exigences spécifiques :
- Les poubelles séparées sont dédiées au logement (à l'intérieur ou à l'extérieur dans un local réservé)
- Pour valider le critère, ces poubelles de tri ne peuvent pas être communes à plusieurs logements

Si l'immeuble ou la commune n'a pas mis en place un système de tri sélectif, alors le critère est non applicable.`,
    non_applicabilite:
      "Si l'immeuble ou la commune n'a pas mis en place un système de tri sélectif, alors le critère est non applicable.",
    notes: null,
  },
  '129': {
    numero: 129,
    titre: "Existence d'un composteur",
    description: `Méthodologie d'évaluation :
Vérification sur place du composteur. Exemple : bac composteur en plastique, en bois, lombricomposteur, composteur rotatif… Si le composteur est commun à plusieurs logements, le critère est validé.`,
    non_applicabilite: null,
    notes: null,
  },
  '130': {
    numero: 130,
    titre:
      "Sensibilisation des clients sur les actions qu'ils peuvent réaliser lors de leur séjour en matière de respect de l'environnement",
    description: `Méthodologie d'évaluation :
Vérification sur place du moyen de sensibilisation. Les informations peuvent être indiquées sur des affichettes, sur le site internet, sur le guide d'accueil… Exemple : informations sur les moyens de transports à faible impact environnemental, sur la consommation d'eau et d'énergie, valorisation de produits locaux, d'associations et actions locales, ... L'établissement peut également inciter les clients à réduire l’impact CO2 de leur séjour et les informer sur les moyens d’écomobilité mis à leur disposition (transports en commun à proximité, location de vélos, itinéraires pédestres, co-voiturage...).`,
    non_applicabilite: null,
    notes: null,
  },
  '131': {
    numero: 131,
    titre: "Présence de produits d'accueil écologiques dans la salle de bain",
    description: `Méthodologie d'évaluation :
Vérification sur place. La présence d'au moins 2 produits d'accueil valide ce critère. Un produit multi-usages (exemple : shampoing-douche) valide le critère. Produits biodégradables / réutilisables / rechargeables et / ou éco-labellisés. Les produits éco-labellisés doivent être certifiés par des labels respectueux de l'environnement. Par exemple : Ecolabel européen, Ecocert, Cosmos Organic, Cosmébio, Fairtrade, Vegan, Cruelty Free, etc… La liste est non exhaustive.`,
    non_applicabilite: null,
    notes:
      "Le label apposé sur le produit d'accueil écologique doit valoriser la production et la composition de ce produit, et non le système global de l'entreprise le fournissant.\n\nLes mentions \"Vegan Friendly\", \"OGM Free\", sont des mentions et non des labels octroyés par un organisme tiers, respectant une norme. Elles ne permettent donc pas d'évaluer la performance environnementale du produit et il est compliqué de s'assurer de la pérennité de la démarche.\n\nLe critère peut être validé grâce à des produits porteurs de labels cités dans la description, ainsi que sur le site internet de l'ADEME : https://agirpourlatransition.ademe.fr/particuliers/labels-environnementaux\n\nLes produits d'accueil sont des cosmétiques. Ainsi les mouchoirs, papier toilette et gobelets en carton ne peuvent être pris en compte pour ce critère.",
  },
  '132': {
    numero: 132,
    titre: "Mise à disposition d'au moins deux produits d'entretien respectueux de l'environnement",
    description: `Méthodologie d'évaluation :
Vérification sur place. Les produits de nettoyage utilisés doivent être respectueux de l'environnement. Par exemple : savon noir, vinaigre blanc, bicarbonate de soude… Si les produits sont certifiés par des labels, le critère est validé. Par exemple : Ecolabel européen, Nature & Progrès, Ecocert, Sustainable cleaning… La liste est non exhaustive.`,
    non_applicabilite: null,
    notes: null,
  },
  '133': {
    numero: 133,
    titre: "Obtention d'un label environnemental",
    description: `Méthodologie d'évaluation :
Vérification de l'obtention du label (dossier, facture, certification, dates d'obtention du label…). Les labels autorisés pour valider le critère sont les labels recommandés par l'ADEME : https://agirpourlatransition.ademe.fr/particuliers/labels-environnementaux.`,
    non_applicabilite: null,
    notes:
      "Le label NF HQE permet-il de valider ce critère ?\n\nSeuls les labels recommandés sur le lien : https://agirpourlatransition.ademe.fr/particuliers/labels-environnementaux permettent de valider ce critère.\n\nLe but étant de certifier l'intégralité de l'activité hôtelière (bâtiment, service, personnel…) et non uniquement le bâtiment.",
  },
};
