import type { Locale } from '../../i18n/locales';

type RequirementCriterion = {
  title: string;
  paragraphs: readonly string[];
};

type ClassificationRequirementsPageContent = {
  hero: {
    title: string;
    description: string;
  };
  eligibility: {
    title: string;
    paragraphs: readonly string[];
    highlight: {
      lead: string;
      text: string;
    };
  };
  criteria: {
    title: string;
    description: string;
    items: readonly RequirementCriterion[];
    summary: {
      beforeStrong: string;
      strong: string;
      afterStrong: string;
    };
  };
  blockingPoints: {
    title: string;
    description: string;
    items: readonly string[];
    closing: string;
    resultBox: string;
  };
  checklist: {
    title: string;
    description: string;
    items: readonly string[];
  };
  finalCta: {
    title: string;
    description: string;
    links: readonly [
      {
        label: string;
        href: string;
        variant: 'ghost';
      },
      {
        label: string;
        href: string;
        variant: 'white';
      },
    ];
  };
};

export const classificationRequirementsPageContent: Record<
  Locale,
  ClassificationRequirementsPageContent
> = {
  fr: {
    hero: {
      title: "Les prérequis au classement d'un meublé de tourisme",
      description:
        "Le classement n'est pas réservé aux biens haut de gamme. Il existe des critères minimums à respecter, mais beaucoup de meublés peuvent entrer dans la démarche dès lors qu'ils sont propres, fonctionnels, correctement équipés et adaptés à leur capacité d'accueil.",
    },
    eligibility: {
      title: "Le classement s'adresse à bien plus de meublés qu'on ne l'imagine",
      paragraphs: [
        "Un meublé de tourisme est un logement meublé, loué à l'usage exclusif du locataire, à une clientèle de passage qui n'y élit pas domicile. Il peut s'agir d'une maison, d'un appartement ou d'un studio.",
        'Le classement officiel attribue de 1 à 5 étoiles selon une grille nationale. Il est donc tout à fait possible de viser un classement sans disposer d\'un bien "de luxe".',
        "Le classement ne commence pas à 4 ou 5 étoiles : il commence à 1 étoile, avec un niveau simple mais conforme à un socle de confort, d'équipement et d'entretien.",
      ],
      highlight: {
        lead: 'Un studio peut tout à fait être classé.',
        text: " Pour un studio ou T1 de 1 à 2 personnes, la surface minimale de base démarre à 12 m² en 1 étoile. Le prérequis bloquant sur un logement d'une seule pièce est de 9 m² si la cuisine est séparée, ou 12 m² avec coin cuisine.",
      },
    },
    criteria: {
      title: 'Les points à vérifier avant de demander une visite',
      description:
        "Avant de parler d'étoiles, il faut d'abord vérifier que le logement peut réellement entrer dans la démarche. Le sujet n'est pas seulement d'avoir \"assez d'équipements\", mais d'avoir un logement qui correspond bien à la définition du meublé de tourisme, qui respecte les conditions minimales attendues et dont la capacité d'accueil est cohérente.",
      items: [
        {
          title: 'Un vrai meublé de tourisme, et non un hébergement exclu du dispositif',
          paragraphs: [
            "Pour être classé en meublé de tourisme, le logement doit être un logement entier, meublé, loué à l'usage exclusif du locataire, à une clientèle de passage qui n'y élit pas domicile.",
            "Certains hébergements sont exclus du classement en meublé de tourisme, notamment les logements non indépendants, les hébergements légers ou mobiles, les logements pouvant être loués simultanément à plusieurs clients, ou encore les chambres d'hôtes.",
          ],
        },
        {
          title: 'Un logement propre, entretenu et sans dégradation manifeste',
          paragraphs: [
            "L'état général du logement compte énormément. Un logement sale, mal entretenu ou présentant des éléments dégradés compromet directement l'issue de la visite.",
            "Autrement dit, avant même d'entrer dans les détails de la grille, il faut que le logement présente une base saine : propreté réelle, équipements en état, sanitaires corrects, revêtements propres et literie convenable.",
          ],
        },
        {
          title: 'Des pièces réellement comptabilisables pour le classement',
          paragraphs: [
            "Toutes les zones du logement ne sont pas automatiquement comptées comme des pièces d'habitation. Pour être prise en compte, une pièce doit notamment disposer d'une surface suffisante, d'une hauteur adaptée et d'un ouvrant sur l'extérieur.",
            "À l'inverse, une cabine trop petite, un coin montagne ou un espace sans ouverture sur l'extérieur ne sont pas considérés comme de vraies pièces d'habitation pour le classement, et les couchages qui s'y trouvent ne sont pas comptabilisés dans la capacité d'accueil.",
          ],
        },
        {
          title: "Un logement qui respecte les conditions minimales d'habitabilité",
          paragraphs: [
            "Le logement doit respecter un socle minimum de confort et d'habitabilité. Concrètement, cela signifie notamment qu'il doit comprendre une pièce d'habitation, une cuisine ou un coin cuisine intérieur, une salle d'eau intérieure et des sanitaires intérieurs.",
            "La cuisine ou le coin cuisine doit être situé à l'intérieur du logement. La salle d'eau doit également être située à l'intérieur et être alimentée en eau chaude et en eau froide. En pratique, l'absence d'eau chaude ou la présence d'équipements de cuisine ou de sanitaires à l'extérieur rendent le classement impossible.",
          ],
        },
      ],
      summary: {
        beforeStrong:
          "En clair, avant de viser une catégorie, il faut d'abord vérifier quatre choses : que le logement entre bien dans la définition du meublé de tourisme, qu'il respecte les conditions minimales d'habitabilité, que sa surface et sa capacité d'accueil sont cohérentes, et qu'il est présenté dans un état ",
        strong: 'propre et soigné.',
        afterStrong: '',
      },
    },
    blockingPoints: {
      title: 'Les points qui bloquent le plus souvent',
      description:
        "Certains points reviennent souvent lorsqu'un logement n'est pas prêt pour une visite de classement ou lorsque la catégorie visée est trop ambitieuse.",
      items: [
        'une surface insuffisante par rapport à la catégorie visée ;',
        'des sanitaires non privatifs ou situés hors du logement ;',
        'un logement mal entretenu ou insuffisamment propre ;',
        'des couchages, du mobilier ou des équipements incohérents avec la capacité annoncée ;',
        "l'absence d'un prérequis bloquant ;",
        'une catégorie visée trop élevée par rapport aux caractéristiques réelles du logement.',
      ],
      closing:
        'Dans de nombreux cas, le sujet n\'est pas que le logement soit "non classable", mais plutôt que la catégorie visée ne soit pas la bonne.',
      resultBox:
        "À l'issue de la visite, les outils d'Etoilys indiquent directement à quel classement maximal le logement peut prétendre. La catégorie visée peut alors être modifiée en conséquence.",
    },
    checklist: {
      title: 'Checklist simple avant de demander la visite',
      description:
        "Avant de planifier une visite, quelques vérifications simples permettent d'aborder la démarche plus sereinement.",
      items: [
        'vérifier la surface réelle du logement et la catégorie envisagée ;',
        "vérifier que les sanitaires sont bien situés à l'intérieur du logement ;",
        "contrôler l'état de la literie, du mobilier, de la cuisine et des sanitaires ;",
        "s'assurer que les équipements sont cohérents avec le nombre de personnes accueillies ;",
        'préparer les services annoncés aux voyageurs ;',
        'prévoir un logement propre, rangé et prêt le jour de la visite.',
      ],
    },
    finalCta: {
      title: 'Quelles sont les étapes pour obtenir son classement ?',
      description:
        'Une fois les prérequis réunis, la procédure de classement suit un déroulement précis en quelques étapes.',
      links: [
        { label: 'La procédure de classement', href: '/procedure', variant: 'ghost' },
        { label: 'Demander votre classement', href: '/demande-classement', variant: 'white' },
      ],
    },
  },
  en: {
    hero: {
      title: 'Requirements for furnished tourist accommodation classification',
      description:
        'Classification is not reserved for high-end properties. There are minimum criteria to meet, but many furnished tourist accommodations can enter the process when they are clean, functional, properly equipped and consistent with their stated capacity.',
    },
    eligibility: {
      title: 'Classification applies to more properties than many owners expect',
      paragraphs: [
        'A furnished tourist accommodation is a furnished whole property rented for the exclusive use of the tenant, to passing customers who do not make it their home. It may be a house, an apartment or a studio.',
        'The official classification awards 1 to 5 stars according to a national grid. A property does not need to be a luxury property to be considered for classification.',
        'The classification does not start at 4 or 5 stars: it starts at 1 star, with a simple level that still meets a baseline for comfort, equipment and maintenance.',
      ],
      highlight: {
        lead: 'A studio can absolutely be classified.',
        text: ' For a studio or one-room unit for 1 to 2 people, the basic minimum surface area starts at 12 m² for 1 star. For a single-room property, the blocking prerequisite is 9 m² if the kitchen is separate, or 12 m² with a kitchenette.',
      },
    },
    criteria: {
      title: 'Points to check before requesting an inspection',
      description:
        'Before considering stars, the first step is to check whether the property can actually enter the classification process. The issue is not only having enough equipment, but having accommodation that matches the definition of furnished tourist accommodation, meets the expected minimum conditions and has a coherent guest capacity.',
      items: [
        {
          title:
            'A real furnished tourist accommodation, not accommodation excluded from the system',
          paragraphs: [
            'To be classified as furnished tourist accommodation, the property must be a whole furnished property rented for the exclusive use of the tenant, to passing customers who do not make it their home.',
            'Some types of accommodation are excluded from furnished tourist accommodation classification, including non-independent accommodation, light or mobile accommodation, accommodation that may be rented simultaneously to several customers, and bed and breakfast rooms.',
          ],
        },
        {
          title: 'A clean, maintained property with no obvious deterioration',
          paragraphs: [
            'The general condition of the accommodation matters significantly. A dirty, poorly maintained property or one with damaged elements directly compromises the outcome of the inspection.',
            'Before looking at the detail of the grid, the property needs a sound baseline: real cleanliness, working equipment, proper sanitary facilities, clean surfaces and suitable bedding.',
          ],
        },
        {
          title: 'Rooms that can actually be counted for classification',
          paragraphs: [
            'Not every area of the property is automatically counted as a living room. To be taken into account, a room must in particular have sufficient surface area, suitable height and an opening to the outside.',
            'By contrast, a very small cabin, mountain corner or space without an opening to the outside is not considered a real living room for classification, and beds located there are not counted in the guest capacity.',
          ],
        },
        {
          title: 'A property that meets minimum habitability conditions',
          paragraphs: [
            'The property must meet a minimum baseline for comfort and habitability. In practice, this means in particular that it must include a living room, an indoor kitchen or kitchenette, an indoor shower or bathroom, and indoor sanitary facilities.',
            'The kitchen or kitchenette must be inside the accommodation. The shower or bathroom must also be inside and supplied with hot and cold water. In practice, no hot water or kitchen or sanitary facilities located outside the accommodation make classification impossible.',
          ],
        },
      ],
      summary: {
        beforeStrong:
          'In short, before targeting a category, four points must be checked first: that the property matches the definition of furnished tourist accommodation, that it meets minimum habitability conditions, that its surface area and guest capacity are coherent, and that it is presented in a ',
        strong: 'clean and well-maintained condition.',
        afterStrong: '',
      },
    },
    blockingPoints: {
      title: 'The most common blocking points',
      description:
        'Some points often come up when a property is not ready for a classification inspection or when the target category is too ambitious.',
      items: [
        'insufficient surface area for the target category;',
        'sanitary facilities that are not private or are located outside the accommodation;',
        'a property that is poorly maintained or insufficiently clean;',
        'beds, furniture or equipment inconsistent with the stated capacity;',
        'a missing blocking prerequisite;',
        'a target category that is too high for the actual characteristics of the property.',
      ],
      closing:
        'In many cases, the issue is not that the property cannot be classified, but that the target category is not the right one.',
      resultBox:
        'After the inspection, Etoilys tools indicate the maximum classification level that the property can obtain. The target category can then be adjusted accordingly.',
    },
    checklist: {
      title: 'Simple checklist before requesting an inspection',
      description:
        'Before scheduling an inspection, a few simple checks help clarify whether the accommodation is ready for the process.',
      items: [
        'check the actual surface area of the property and the category being considered;',
        'check that the sanitary facilities are located inside the accommodation;',
        'check the condition of the bedding, furniture, kitchen and sanitary facilities;',
        'make sure the equipment is consistent with the number of guests accommodated;',
        'prepare the services announced to travellers;',
        'have the accommodation clean, tidy and ready on the inspection day.',
      ],
    },
    finalCta: {
      title: 'What are the steps to obtain classification?',
      description:
        'Once the requirements are met, the classification process follows a defined sequence of steps.',
      links: [
        { label: 'Classification process', href: '/en/classification-process', variant: 'ghost' },
        {
          label: 'Request your classification',
          href: '/en/request-a-classification',
          variant: 'white',
        },
      ],
    },
  },
  nl: {
    hero: {
      title: 'Voorwaarden voor classificatie van een vakantiewoning',
      description:
        'Classificatie is niet voorbehouden aan luxe woningen. Er zijn minimumcriteria, maar veel vakantiewoningen, juridisch meublés de tourisme, kunnen in de procedure passen wanneer zij schoon, functioneel, correct uitgerust en afgestemd op hun opvangcapaciteit zijn.',
    },
    eligibility: {
      title: 'Classificatie geldt voor meer woningen dan vaak wordt gedacht',
      paragraphs: [
        'Een meublé de tourisme is een gemeubileerde volledige woning, verhuurd voor exclusief gebruik door de huurder, aan reizigers die er tijdelijk verblijven en er niet hun hoofdverblijf vestigen. Het kan gaan om een huis, appartement of studio.',
        'De officiële classificatie kent 1 tot 5 sterren toe volgens een nationale beoordelingslijst. Een woning hoeft dus geen luxe woning te zijn om voor classificatie in aanmerking te komen.',
        'De classificatie begint niet bij 4 of 5 sterren: zij begint bij 1 ster, met een eenvoudig niveau dat wel voldoet aan een basis van comfort, uitrusting en onderhoud.',
      ],
      highlight: {
        lead: 'Een studio kan zeker worden geclassificeerd.',
        text: ' Voor een studio of eenkamerwoning voor 1 tot 2 personen begint de minimale basisoppervlakte bij 12 m² voor 1 ster. Voor een woning met één ruimte is de blokkerende voorwaarde 9 m² als de keuken apart is, of 12 m² met kitchenette.',
      },
    },
    criteria: {
      title: 'Punten om te controleren vóór een inspectiebezoek',
      description:
        'Voordat over sterren wordt gesproken, moet eerst worden nagegaan of de woning daadwerkelijk in de classificatieprocedure past. Het gaat niet alleen om voldoende uitrusting, maar ook om een woning die overeenkomt met de definitie van meublé de tourisme, de minimumvoorwaarden respecteert en een coherente opvangcapaciteit heeft.',
      items: [
        {
          title: 'Een echte meublé de tourisme, geen uitgesloten accommodatievorm',
          paragraphs: [
            'Om als meublé de tourisme te worden geclassificeerd, moet de woning een volledige, gemeubileerde woning zijn, verhuurd voor exclusief gebruik door de huurder, aan reizigers die er niet hun woonplaats vestigen.',
            'Sommige accommodaties zijn uitgesloten van deze classificatie, waaronder niet-onafhankelijke accommodaties, lichte of mobiele accommodaties, woningen die gelijktijdig aan meerdere klanten kunnen worden verhuurd en chambres d’hôtes.',
          ],
        },
        {
          title: 'Een schone, onderhouden woning zonder duidelijke gebreken',
          paragraphs: [
            'De algemene staat van de woning telt zwaar mee. Een vuile, slecht onderhouden woning of een woning met beschadigde elementen brengt de uitkomst van het bezoek direct in gevaar.',
            'Nog vóór de details van de beoordelingslijst moet de woning een gezonde basis tonen: echte netheid, werkende uitrusting, correcte sanitaire voorzieningen, schone afwerkingen en geschikte bedden.',
          ],
        },
        {
          title: 'Ruimtes die werkelijk meetellen voor de classificatie',
          paragraphs: [
            'Niet alle delen van de woning tellen automatisch als verblijfsruimte. Om te worden meegeteld, moet een ruimte met name voldoende oppervlakte, geschikte hoogte en een opening naar buiten hebben.',
            'Een te kleine cabine, slaaphoek of ruimte zonder opening naar buiten wordt daarentegen niet beschouwd als echte verblijfsruimte voor de classificatie. Bedden in zulke ruimtes tellen niet mee voor de opvangcapaciteit.',
          ],
        },
        {
          title: 'Een woning die voldoet aan minimale bewoonbaarheidsvoorwaarden',
          paragraphs: [
            'De woning moet voldoen aan een minimale basis van comfort en bewoonbaarheid. Concreet betekent dit onder meer dat zij een verblijfsruimte, een binnenkeuken of kitchenette, een binnenbadkamer of doucheruimte en sanitaire voorzieningen binnen moet hebben.',
            'De keuken of kitchenette moet zich binnen de woning bevinden. De badkamer of doucheruimte moet eveneens binnen liggen en warm en koud water hebben. Geen warm water of keuken- of sanitaire voorzieningen buiten de woning maken classificatie in de praktijk onmogelijk.',
          ],
        },
      ],
      summary: {
        beforeStrong:
          'Kort gezegd moeten vóór het kiezen van een categorie vier punten worden gecontroleerd: dat de woning overeenkomt met de definitie van meublé de tourisme, dat zij aan minimale bewoonbaarheidsvoorwaarden voldoet, dat oppervlakte en opvangcapaciteit coherent zijn, en dat zij wordt gepresenteerd in een ',
        strong: 'schone en verzorgde staat.',
        afterStrong: '',
      },
    },
    blockingPoints: {
      title: 'De meest voorkomende blokkerende punten',
      description:
        'Sommige punten komen vaak terug wanneer een woning niet klaar is voor een classificatiebezoek of wanneer de beoogde categorie te ambitieus is.',
      items: [
        'onvoldoende oppervlakte voor de beoogde categorie;',
        'sanitaire voorzieningen die niet privé zijn of buiten de woning liggen;',
        'een slecht onderhouden of onvoldoende schone woning;',
        'bedden, meubels of uitrusting die niet overeenkomen met de opgegeven capaciteit;',
        'het ontbreken van een blokkerende voorwaarde;',
        'een beoogde categorie die te hoog is voor de werkelijke kenmerken van de woning.',
      ],
      closing:
        'In veel gevallen is het probleem niet dat de woning niet classificeerbaar is, maar dat de beoogde categorie niet de juiste is.',
      resultBox:
        'Na het bezoek geven de tools van Etoilys direct aan welk maximaal classificatieniveau de woning kan behalen. De beoogde categorie kan dan worden aangepast.',
    },
    checklist: {
      title: 'Eenvoudige checklist vóór het aanvragen van het bezoek',
      description:
        'Enkele eenvoudige controles helpen om de procedure duidelijker te benaderen voordat een bezoek wordt gepland.',
      items: [
        'de werkelijke oppervlakte van de woning en de beoogde categorie controleren;',
        'controleren dat de sanitaire voorzieningen zich binnen de woning bevinden;',
        'de staat van bedden, meubels, keuken en sanitaire voorzieningen controleren;',
        'nagaan of de uitrusting overeenkomt met het aantal ontvangen personen;',
        'de diensten voorbereiden die aan reizigers worden aangekondigd;',
        'zorgen voor een schone, opgeruimde en bezoekklare woning op de dag van inspectie.',
      ],
    },
    finalCta: {
      title: 'Welke stappen zijn nodig om classificatie te verkrijgen?',
      description:
        'Wanneer aan de voorwaarden is voldaan, volgt de classificatieprocedure een duidelijk verloop in enkele stappen.',
      links: [
        {
          label: 'De classificatieprocedure',
          href: '/nl/classificatieprocedure-vakantiewoning',
          variant: 'ghost',
        },
        { label: 'Classificatie aanvragen', href: '/nl/classificatie-aanvragen', variant: 'white' },
      ],
    },
  },
};
