import type { Locale } from '../../i18n/locales';

export type BenefitsIconKey = 'award' | 'calculator' | 'globe' | 'percent' | 'piggyBank' | 'ticket';

type BenefitCard = {
  icon: BenefitsIconKey;
  title: string;
  description: string;
};

type FiscalComparisonItem = {
  title: string;
  allowance: string;
  allowanceLabel: string;
  example: string;
  color: string;
};

type TouristTaxRange = {
  label: string;
  value: string;
};

type TouristTaxExampleRow = {
  label: string;
  unclassified: string;
  classified: string;
};

type SocialRegimeRow = {
  situation: string;
  classified: string;
  unclassified: string;
  takeaway: string;
  highlight?: 'classified' | 'unclassified';
};

type CheckItem = {
  title: string;
  description: string;
};

export type ClassificationBenefitsPageContent = {
  hero: {
    title: string;
    description: string;
  };
  mainBenefits: {
    title: string;
    items: readonly BenefitCard[];
  };
  fiscalComparison: {
    title: string;
    description: string;
    items: readonly [FiscalComparisonItem, FiscalComparisonItem];
    result: {
      value: string;
      label: string;
      description: string;
    };
    footnote: {
      intro: string;
      items: readonly string[];
      sourceLabel: string;
      sourceHref: string;
    };
  };
  touristTax: {
    title: string;
    description: string;
    unclassified: {
      title: string;
      value: string;
      label: string;
      note: string;
    };
    classified: {
      title: string;
      intro: string;
      headerCategory: string;
      headerRange: string;
      ranges: readonly TouristTaxRange[];
    };
    example: {
      title: string;
      note: string;
      headers: readonly [string, string, string];
      rows: readonly TouristTaxExampleRow[];
      totalLabel: string;
      totalValue: string;
    };
    cta?: {
      label: string;
      href: string;
    };
  };
  socialRegime: {
    title: string;
    description: string;
    headers: readonly [string, string, string, string];
    rows: readonly SocialRegimeRow[];
    footnote: string;
    callout: string;
    sources: readonly {
      label: string;
      href: string;
    }[];
  };
  officialSign: {
    title: string;
    description: string;
    sourceLabel: string;
    sourceHref: string;
    panonceauAltPrefix: string;
    items: readonly CheckItem[];
  };
  tourismReference: {
    title: string;
    imageAlt: string;
    items: readonly CheckItem[];
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

const OFFICIAL_FISCAL_SOURCE_HREF =
  'https://www.impots.gouv.fr/particulier/questions/je-suis-proprietaire-dune-location-meublee-de-tourisme-quel-est-le-nouveau';

export const classificationBenefitsPageContent = {
  fr: {
    hero: {
      title: 'Pourquoi faire classer son meublé de tourisme ?',
      description:
        'Faire classer son meublé permet d’obtenir un repère officiel en étoiles. Selon votre situation, cela peut aussi avoir un impact sur le régime micro-BIC, la taxe de séjour et la visibilité de votre hébergement.',
    },
    mainBenefits: {
      title: "Les avantages d'un meublé classé",
      items: [
        {
          icon: 'calculator',
          title: 'Abattement fiscal majoré',
          description:
            'En régime micro-BIC, le classement donne accès à un abattement de 50 % (plafond 77 700 €) contre 30 % (plafond 15 000 €) pour un meublé non classé, depuis la loi du 19 novembre 2024.',
        },
        {
          icon: 'percent',
          title: 'Taxe de séjour avantageuse',
          description:
            "Les meublés classés bénéficient d'un tarif forfaitaire de taxe de séjour par personne et par nuit, généralement inférieur à celui appliqué aux meublés non classés.",
        },
        {
          icon: 'piggyBank',
          title: 'Cotisations sociales allégées',
          description:
            "Les loueurs relevant du régime micro-entrepreneur bénéficient d'un taux de cotisations sociales de 6 % pour les meublés classés, contre 21,2 % pour les meublés non classés.",
        },
        {
          icon: 'award',
          title: 'Repère officiel en étoiles',
          description:
            "Le loueur peut demander un panonceau officiel du ministère chargé du Tourisme (1 à 5 étoiles), apposable sur le bien et mentionnable dans toutes les annonces. Il atteste du respect de critères de confort et d'équipement du logement.",
        },
        {
          icon: 'globe',
          title: 'Référencement touristique',
          description:
            "Les meublés classés peuvent être référencés par les offices de tourisme locaux et éligibles aux bases de données nationales de promotion touristique. Le niveau d'étoiles constitue un repère standardisé pour les voyageurs.",
        },
        {
          icon: 'ticket',
          title: 'Chèques-vacances acceptés',
          description:
            "Le classement ouvre le droit à l'affiliation à l'ANCV (Agence nationale pour les chèques-vacances). Les meublés affiliés peuvent accepter les chèques-vacances et être référencés dans les supports de l'ANCV.",
        },
      ],
    },
    fiscalComparison: {
      title: 'Avantages fiscaux : comparaison',
      description:
        "Le classement vous permet de bénéficier d'un abattement fiscal majoré, réduisant significativement votre base imposable.",
      items: [
        {
          title: 'Sans classement',
          allowance: '30%',
          allowanceLabel: "d'abattement fiscal",
          example: 'Pour 12 000 € de revenus : 8 400 € imposables (plafond micro-BIC* : 15 000 €)',
          color: 'bg-gray-100',
        },
        {
          title: 'Avec classement',
          allowance: '50%',
          allowanceLabel: "d'abattement fiscal",
          example: 'Pour 12 000 € de revenus : 6 000 € imposables (plafond micro-BIC* : 77 700 €)',
          color: 'bg-success-100',
        },
      ],
      result: {
        value: '2 400 €',
        label: 'de base imposable en moins',
        description:
          'Sur 12 000 € de recettes, la base micro-BIC est de 6 000 € avec classement (50 %) contre 8 400 € sans classement (30 %).',
      },
      footnote: {
        intro:
          "* Le régime micro-BIC s'applique tant que les recettes annuelles restent sous le plafond applicable. En cas de dépassement pendant deux années consécutives, le loueur bascule obligatoirement au régime réel d'imposition, qui implique :",
        items: [
          "la tenue d'une comptabilité conforme au plan comptable général ;",
          "l'établissement et la télétransmission d'une liasse fiscale (formulaire 2031) avant la déclaration de revenus ;",
          'le recours habituel à un expert-comptable.',
        ],
        sourceLabel: 'impots.gouv.fr — régime fiscal des meublés de tourisme',
        sourceHref: OFFICIAL_FISCAL_SOURCE_HREF,
      },
    },
    touristTax: {
      title: 'Taxe de séjour : forfait fixe ou taux proportionnel',
      description:
        "Les meublés classés relèvent d'un tarif forfaitaire par personne et par nuit, fixé selon le nombre d'étoiles dans une fourchette définie par arrêté ministériel. Les meublés non classés sont soumis à un taux proportionnel au prix de la nuitée, compris entre 1 % et 5 % selon les délibérations locales.",
      unclassified: {
        title: 'Meublé non classé',
        value: '1 % – 5 %',
        label: 'du prix HT par personne et par nuit',
        note: 'Taux fixé par délibération locale, dans cette fourchette nationale.',
      },
      classified: {
        title: 'Meublé classé',
        intro: 'Tarif forfaitaire par étoile (fourchette nationale 2026)',
        headerCategory: 'Classement',
        headerRange: 'Min – Max / pers / nuit',
        ranges: [
          { label: '1 étoile', value: '0,20 € – 0,80 €' },
          { label: '2 étoiles', value: '0,30 € – 1,00 €' },
          { label: '3 étoiles', value: '0,50 € – 1,70 €' },
          { label: '4 étoiles', value: '0,70 € – 2,60 €' },
          { label: '5 étoiles', value: '0,70 € – 3,60 €' },
        ],
      },
      example: {
        title: 'Exemple à Paris — meublé 3★, loué 120 € / nuit à 2 personnes (60 € HT / pers)',
        note: 'Paris applique une surtaxe départementale (+10 %) et une surtaxe Île-de-France Mobilités (+200 %) sur la base de la taxe de séjour.',
        headers: ['', 'Non classé', 'Classé 3★'],
        rows: [
          {
            label: 'Base taxe de séjour',
            unclassified: '5 % × 60 € = 3,00 €',
            classified: '1,70 €',
          },
          { label: '+ Surtaxe dépt. (10 %)', unclassified: '0,30 €', classified: '0,17 €' },
          {
            label: '+ Surtaxe IDF Mobilités (200 %)',
            unclassified: '6,00 €',
            classified: '3,40 €',
          },
          { label: 'Total / pers / nuit', unclassified: '9,30 €', classified: '5,27 €' },
          { label: 'Total 2 pers / nuit', unclassified: '18,60 €', classified: '10,54 €' },
        ],
        totalValue: '8,06 €',
        totalLabel: 'de taxe de séjour en moins par nuit, répercutés sur le voyageur',
      },
      cta: {
        label: 'Simuler l’impact du classement sur la taxe de séjour',
        href: '/simulateur-taxe-sejour',
      },
    },
    socialRegime: {
      title: 'Régime social : un avantage concret pour les meublés classés en 2026',
      description:
        'En dessous de 23 000 € de recettes annuelles, loueurs classés et non classés relèvent des mêmes prélèvements sociaux (18,6 % sur les revenus nets) — sans cotisations sociales professionnelles. Au-delà de ce seuil, les situations divergent nettement sur le plan social. Le meublé de tourisme classé peut, selon sa situation, continuer à relever du micro-social à 6 % sur les recettes brutes. En 2026, la location de courte durée non classée ne peut plus accéder à ce cadre : elle bascule vers le régime des travailleurs indépendants, plus complexe et potentiellement plus lourd.',
      headers: ['Situation', 'Meublé classé', 'Meublé non classé', 'À retenir'],
      rows: [
        {
          situation: 'Recettes < 15 000 €/an',
          classified: 'Prélèvements sociaux — pas de cotisations professionnelles',
          unclassified: 'Prélèvements sociaux — pas de cotisations professionnelles',
          takeaway: 'Même cadre dans les deux cas',
        },
        {
          situation: '15 000 € – 23 000 €/an',
          classified: 'Pas de cotisations sociales — micro-BIC accessible',
          unclassified: 'Pas de cotisations sociales — régime réel fiscal',
          takeaway: 'Pas encore de cotisations ; divergence fiscale (voir bloc précédent)',
        },
        {
          situation: '> 23 000 €/an',
          classified: 'Micro-social possible à 6 %*',
          unclassified: 'Régime des travailleurs indépendants',
          takeaway: 'Le classement permet de conserver un cadre social plus simple et favorable',
          highlight: 'classified',
        },
      ],
      footnote:
        "* Applicable entre 23 000 € et 83 600 €, si les recettes 2024 ou 2025 n'excèdent pas 77 700 €. Au-delà de 83 600 €, le meublé classé bascule également vers le régime des indépendants.",
      callout:
        'En 2026, le classement ne se limite pas à un avantage fiscal : il permet aussi de conserver un cadre social plus simple et potentiellement beaucoup plus favorable.',
      sources: [
        {
          label:
            'Source : Urssaf — auto-entrepreneur loueur en meublé : le point sur les changements',
          href: 'https://www.urssaf.fr/accueil/actualites/auto-entrepreneur-loueur-meuble.html',
        },
        {
          label: 'Urssaf — économie collaborative',
          href: 'https://www.urssaf.fr/accueil/services/economie-collaborative.html',
        },
      ],
    },
    officialSign: {
      title: 'Le panonceau officiel : un repère certifié',
      description:
        "Après attribution du classement, le loueur dispose du droit d'apposer le panonceau officiel géré par Atout France, sous l'autorité du ministère chargé du Tourisme. Il peut être affiché sur la façade du bien et reproduit sur toutes les annonces.",
      sourceLabel: 'Panonceaux officiels 2026 — Atout France',
      sourceHref: 'https://www.classement.atout-france.fr/les-panonceaux-de-classement',
      panonceauAltPrefix: 'Panonceau officiel meublé de tourisme',
      items: [
        {
          title: "Émis sous l'autorité du ministère chargé du Tourisme",
          description:
            'Le panonceau est géré par Atout France. Il atteste que le logement a été inspecté par un organisme accrédité par le Cofrac ou agréé par Atout France.',
        },
        {
          title: 'Reproductible sur toutes les annonces',
          description:
            "Le nombre d'étoiles peut figurer sur les plateformes de réservation (Airbnb, Booking…), sur le site du loueur et sur tout support de communication.",
        },
        {
          title: 'Validité 5 ans',
          description:
            "Le panonceau porte l'année d'attribution et est renouvelé après une nouvelle inspection, assurant la mise à jour régulière du niveau de classement.",
        },
        {
          title: 'Critères objectifs et consultables',
          description:
            "Les étoiles correspondent à des critères de confort et d'équipement définis par arrêté ministériel. La grille d'évaluation est publique et vérifiable.",
        },
      ],
    },
    tourismReference: {
      title: 'Référencement touristique',
      imageAlt: 'Meuble de tourisme',
      items: [
        {
          title: 'Un classement qui rend votre bien plus visible',
          description:
            "Le classement officiel donne à votre meublé un repère reconnu par tout l'écosystème touristique. Il facilite sa reprise dans les circuits d'information des offices de tourisme et des organismes touristiques locaux, auprès desquels Atout France invite justement les voyageurs et propriétaires à se renseigner pour les meublés classés.",
        },
        {
          title: 'Une information exploitable bien au-delà de votre annonce',
          description:
            "Les données touristiques issues des offices de tourisme, agences départementales et comités régionaux alimentent DATAtourisme, la plateforme nationale de référence. Ce système permet de diffuser une information homogène, réutilisable à grande échelle par des acteurs publics, privés et des supports d'information touristique.",
        },
        {
          title: 'Des étoiles qui parlent immédiatement aux voyageurs',
          description:
            "Le classement repose sur une échelle officielle de 1 à 5 étoiles, valable 5 ans, fondée sur 133 critères. Pour un voyageur, c'est un signal simple et rassurant pour situer le niveau de confort, d'équipement et de services du logement.",
        },
      ],
    },
    finalCta: {
      title: "Quels types de logements peuvent bénéficier d'un classement ?",
      description:
        "Contrairement aux idées reçues, le classement n'est pas réservé aux biens haut de gamme.",
      links: [
        {
          label: 'Découvrir les prérequis',
          href: '/prerequis-au-classement',
          variant: 'ghost',
        },
        {
          label: 'Demander votre classement',
          href: '/demande-classement',
          variant: 'white',
        },
      ],
    },
  },
  en: {
    hero: {
      title: 'Why classify furnished tourist accommodation in France?',
      description:
        'Classifying your furnished accommodation gives it an official star reference point. Depending on your situation, this can also affect the micro-BIC tax regime, tourist tax and the visibility of your accommodation.',
    },
    mainBenefits: {
      title: 'The benefits of classified furnished accommodation',
      items: [
        {
          icon: 'calculator',
          title: 'Increased tax allowance',
          description:
            'Under the micro-BIC tax regime, classification gives access to a 50% allowance (€77,700 threshold), compared with 30% (€15,000 threshold) for non-classified accommodation, since the law of 19 November 2024.',
        },
        {
          icon: 'percent',
          title: 'Advantageous tourist tax',
          description:
            'Classified furnished tourist accommodation benefits from a fixed tourist tax amount per person and per night, generally lower than the amount applied to non-classified furnished accommodation.',
        },
        {
          icon: 'piggyBank',
          title: 'Reduced social contributions',
          description:
            'Owners under the French micro-entrepreneur regime benefit from a 6% social contribution rate for classified furnished accommodation, compared with 21.2% for non-classified furnished accommodation.',
        },
        {
          icon: 'award',
          title: 'Official star reference',
          description:
            'The owner may request the official sign issued by the ministry in charge of Tourism (1 to 5 stars), which can be displayed at the property and mentioned in all listings. It attests that the accommodation meets comfort and equipment criteria.',
        },
        {
          icon: 'globe',
          title: 'Tourism listing',
          description:
            'Classified furnished accommodation can be listed by local tourist offices and be eligible for national tourism promotion databases. The star level is a standardized reference for travellers.',
        },
        {
          icon: 'ticket',
          title: 'ANCV holiday vouchers',
          description:
            'Classification allows affiliation with ANCV, the French national agency for holiday vouchers. Affiliated accommodation can accept holiday vouchers and appear in ANCV materials.',
        },
      ],
    },
    fiscalComparison: {
      title: 'Tax benefits: comparison',
      description:
        'Classification allows you to benefit from an increased tax allowance, significantly reducing your taxable base.',
      items: [
        {
          title: 'Without classification',
          allowance: '30%',
          allowanceLabel: 'tax allowance',
          example: 'For €12,000 in revenue: €8,400 taxable income (micro-BIC threshold*: €15,000)',
          color: 'bg-gray-100',
        },
        {
          title: 'With classification',
          allowance: '50%',
          allowanceLabel: 'tax allowance',
          example: 'For €12,000 in revenue: €6,000 taxable income (micro-BIC threshold*: €77,700)',
          color: 'bg-success-100',
        },
      ],
      result: {
        value: '€2,400',
        label: 'less taxable base in this example',
        description:
          'On €12,000 in revenue, the micro-BIC taxable base is €6,000 with classification (50%) compared with €8,400 without classification (30%).',
      },
      footnote: {
        intro:
          '* The micro-BIC regime applies while annual revenue remains below the applicable threshold. If the threshold is exceeded for two consecutive years, the owner moves to the actual expenses tax regime, which involves:',
        items: [
          'keeping accounting records in line with the French general chart of accounts;',
          'preparing and electronically filing a tax package, including form 2031, before the income tax return;',
          'usually working with an accountant.',
        ],
        sourceLabel: 'impots.gouv.fr — furnished tourist accommodation tax regime',
        sourceHref: OFFICIAL_FISCAL_SOURCE_HREF,
      },
    },
    touristTax: {
      title: 'Tourist tax: fixed amount or proportional rate',
      description:
        'Classified furnished tourist accommodation is subject to a fixed amount per person and per night, set according to the star category within a national range. Non-classified accommodation is subject to a proportional rate on the nightly price, between 1% and 5% depending on local decisions.',
      unclassified: {
        title: 'Non-classified accommodation',
        value: '1% – 5%',
        label: 'of the pre-tax price per person per night',
        note: 'The rate is set by local decision within this national range.',
      },
      classified: {
        title: 'Classified accommodation',
        intro: 'Fixed amount by star category (2026 national range)',
        headerCategory: 'Classification',
        headerRange: 'Min – Max / person / night',
        ranges: [
          { label: '1 star', value: '€0.20 – €0.80' },
          { label: '2 stars', value: '€0.30 – €1.00' },
          { label: '3 stars', value: '€0.50 – €1.70' },
          { label: '4 stars', value: '€0.70 – €2.60' },
          { label: '5 stars', value: '€0.70 – €3.60' },
        ],
      },
      example: {
        title:
          'Example in Paris — 3★ accommodation, rented for €120 / night for 2 people (€60 excl. tax / person)',
        note: 'Paris applies a departmental surtax (+10%) and an Île-de-France Mobilités surtax (+200%) on the tourist tax base.',
        headers: ['', 'Non-classified', 'Classified 3★'],
        rows: [
          { label: 'Tourist tax base', unclassified: '5% × €60 = €3.00', classified: '€1.70' },
          { label: '+ Departmental surtax (10%)', unclassified: '€0.30', classified: '€0.17' },
          { label: '+ IDF Mobilités surtax (200%)', unclassified: '€6.00', classified: '€3.40' },
          { label: 'Total / person / night', unclassified: '€9.30', classified: '€5.27' },
          { label: 'Total 2 people / night', unclassified: '€18.60', classified: '€10.54' },
        ],
        totalValue: '€8.06',
        totalLabel:
          'less tourist tax per night in this example, reflected in the amount paid by the traveller',
      },
    },
    socialRegime: {
      title: 'Social regime: a concrete advantage for classified furnished accommodation in 2026',
      description:
        'Below €23,000 in annual revenue, classified and non-classified owners are subject to the same social levies on net income, with no professional social contributions. Above this threshold, the social framework differs. Depending on the situation, classified furnished tourist accommodation may remain under the micro-social regime at 6% of gross revenue. In 2026, non-classified short-term rentals no longer have access to that framework and move to the self-employed workers regime.',
      headers: [
        'Situation',
        'Classified accommodation',
        'Non-classified accommodation',
        'Key point',
      ],
      rows: [
        {
          situation: 'Revenue < €15,000 / year',
          classified: 'Social levies — no professional social contributions',
          unclassified: 'Social levies — no professional social contributions',
          takeaway: 'Same framework in both cases',
        },
        {
          situation: '€15,000 – €23,000 / year',
          classified: 'No social contributions — micro-BIC available',
          unclassified: 'No social contributions — actual expenses tax regime',
          takeaway: 'No social contributions yet; tax treatment differs',
        },
        {
          situation: '> €23,000 / year',
          classified: 'Micro-social regime may apply at 6%*',
          unclassified: 'Self-employed workers regime',
          takeaway:
            'Classification allows owners to keep a simpler and more favourable social framework',
          highlight: 'classified',
        },
      ],
      footnote:
        '* Applies between €23,000 and €83,600, if 2024 or 2025 revenue does not exceed €77,700. Above €83,600, classified accommodation also moves to the self-employed workers regime.',
      callout:
        'In 2026, classification is not limited to a tax benefit: it also allows owners to keep a simpler and potentially much more favourable social framework.',
      sources: [
        {
          label: 'Source: Urssaf — furnished rental micro-entrepreneurs: update on the changes',
          href: 'https://www.urssaf.fr/accueil/actualites/auto-entrepreneur-loueur-meuble.html',
        },
        {
          label: 'Urssaf — collaborative economy',
          href: 'https://www.urssaf.fr/accueil/services/economie-collaborative.html',
        },
      ],
    },
    officialSign: {
      title: 'The official sign: a certified reference point',
      description:
        'After classification is awarded, the owner has the right to display the official sign managed by Atout France, under the authority of the ministry in charge of Tourism. It may be displayed on the facade of the property and reproduced in all listings.',
      sourceLabel: 'Official signs 2026 — Atout France',
      sourceHref: 'https://www.classement.atout-france.fr/les-panonceaux-de-classement',
      panonceauAltPrefix: 'Official furnished tourist accommodation sign',
      items: [
        {
          title: 'Issued under the authority of the ministry in charge of tourism',
          description:
            'The sign is managed by Atout France. It attests that the accommodation has been inspected by a body accredited by Cofrac or approved by Atout France.',
        },
        {
          title: 'Reusable in listings',
          description:
            'The number of stars may appear on booking platforms, the owner’s website and other communication materials.',
        },
        {
          title: 'Valid for 5 years',
          description:
            'The sign shows the year in which classification was awarded and is renewed after a new inspection, ensuring that the classification level is updated regularly.',
        },
        {
          title: 'Objective and public criteria',
          description:
            'The stars correspond to comfort and equipment criteria defined by ministerial order. The assessment grid is public and verifiable.',
        },
      ],
    },
    tourismReference: {
      title: 'Tourism listing',
      imageAlt: 'Furnished tourist accommodation',
      items: [
        {
          title: 'A classification that makes your property more visible',
          description:
            'Official classification gives your furnished accommodation a reference recognized by the whole tourism ecosystem. It helps the property appear in the information channels of tourist offices and local tourism bodies, which Atout France specifically invites travellers and owners to contact for classified furnished accommodation.',
        },
        {
          title: 'Information that can be used well beyond your listing',
          description:
            'Tourism data from tourist offices, departmental agencies and regional tourism committees feed DATAtourisme, the French national reference platform. This system distributes consistent information that can be reused at large scale by public and private actors and tourism information media.',
        },
        {
          title: 'Stars that speak immediately to travellers',
          description:
            'The classification is based on an official 1 to 5 star scale, valid for 5 years and based on 133 criteria. For travellers, it is a simple and reassuring signal for understanding the level of comfort, equipment and services of the accommodation.',
        },
      ],
    },
    finalCta: {
      title: 'Which accommodation can be classified?',
      description:
        'Contrary to common assumptions, classification is not reserved for high-end properties.',
      links: [
        {
          label: 'Discover the requirements',
          href: '/en/classification-requirements',
          variant: 'ghost',
        },
        {
          label: 'Request your classification',
          href: '/en/request-a-classification',
          variant: 'white',
        },
      ],
    },
  },
} as const satisfies Record<Locale, ClassificationBenefitsPageContent>;
