import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from '../../App';
import { IMAGE_ALT_TEXT } from '../../content/imageAltText';
import { IMAGE_MANIFEST } from '../../content/imageManifest';
import {
  CARCASSONNE_SERVICE_COMMUNES,
  CARCASSONNE_TAX_MODULE,
} from '../../content/local/cities/carcassonne';
import { CITY_COMMON_FAQ } from '../../content/local/cities/sharedCityFaq';
import { PRICING_PROFILES } from '../../content/local/pricing';
import {
  getDepartmentInterventionArea,
  getLocalRegistryEntry,
  getPublishedLocalChildEntriesForDepartment,
  isLocalRegistryEntryPublished,
} from '../../content/local/registry';
import { COMMON_LOCAL_V6_FAQ_ITEMS } from '../../content/local/sharedLocalContent';
import { CARCASSONNE_LOCAL_LANDING_PAGE_V6 } from '../../content/local/v6Pages';
import { getIndexablePaths, getPrerenderPaths } from '../../content/seoRoutes';
import { loadTaxeSejourDataset } from '../../content/taxeSejourDataset';
import { trackCtaClick } from '../../utils/analytics';
import { calculateTaxeSejour } from '../../utils/taxeSejourCalculator';

vi.mock('../../utils/analytics', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../utils/analytics')>()),
  trackCtaClick: vi.fn(),
}));

const CARCASSONNE_PATH = '/classement-meuble-tourisme-carcassonne';
const CARCASSONNE_EXAMPLE_AMOUNTS = /10,80|5,76|5,04|35,28|47\s%/;

function renderCarcassonnePage() {
  window.history.pushState({}, 'Carcassonne et le Carcassonnais', CARCASSONNE_PATH);
  return render(<App />);
}

function getJsonLdScripts() {
  return [
    ...document.querySelectorAll<HTMLScriptElement>("script[type='application/ld+json']"),
  ].map((script) => JSON.parse(script.textContent ?? '{}') as Record<string, unknown>);
}

function getSectionByHeading(name: string | RegExp) {
  const section = screen.getByRole('heading', { level: 2, name }).closest('section');
  if (!section) throw new Error(`Missing section for heading ${String(name)}`);
  return section;
}

function expectHeadingSequence(expectedHeadings: Array<string | RegExp>) {
  const headings = screen.getAllByRole('heading').map((heading) => heading.textContent ?? '');
  let cursor = -1;

  expectedHeadings.forEach((expectedHeading) => {
    const nextIndex = headings.findIndex((heading, index) => {
      if (index <= cursor) return false;
      return typeof expectedHeading === 'string'
        ? heading === expectedHeading
        : expectedHeading.test(heading);
    });

    expect(
      nextIndex,
      `Missing heading after index ${cursor}: ${String(expectedHeading)}`
    ).toBeGreaterThan(cursor);
    cursor = nextIndex;
  });
}

function readCogAudeCommuneLabels() {
  return new Set(
    readFileSync('tools/airdna/reference/2026/v_commune_2026.csv', 'utf8')
      .split(/\r?\n/)
      .map((line) => [...line.matchAll(/"([^"]*)"/g)].map((match) => match[1]))
      .filter(([type, , , department]) => type === 'COM' && department === '11')
      .map((columns) => columns[9])
  );
}

async function loadCommuneFromPublicDataset(communeCode: string) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(readFileSync('public/data/taxe-sejour-dataset.v1.json')))
  );
  const { cities } = await loadTaxeSejourDataset();
  const commune = cities.find((city) => city.id === communeCode);
  if (!commune) throw new Error(`Missing commune ${communeCode} in the dataset`);
  return commune;
}

function getSimulatedRows(city: Awaited<ReturnType<typeof loadCommuneFromPublicDataset>>) {
  const { rows } = calculateTaxeSejour(
    { cityId: city.id, nightlyPriceHt: 150, nights: 1, personsStaying: 4 },
    city
  );
  return Object.fromEntries(rows.map((row) => [row.category, row.amount]));
}

describe('ClassementCarcassonne', () => {
  afterEach(() => {
    cleanup();
    document.head.innerHTML = '';
    document.title = '';
    vi.unstubAllGlobals();
    vi.mocked(trackCtaClick).mockClear();
  });

  it('renders the city with V6 hero, images and service area', () => {
    renderCarcassonnePage();

    expect(CARCASSONNE_LOCAL_LANDING_PAGE_V6.scope).toBe('city');
    expect(document.querySelector('.local-v6-landing')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Classement de gîtes et meublés de tourisme à Carcassonne et dans le Carcassonnais',
      })
    ).toBeInTheDocument();
    expect(screen.getByText('à Carcassonne et dans le Carcassonnais')).toHaveClass('text-copper');
    expect(
      screen.getByText(
        'Vous souhaitez faire classer un gîte, une maison de vacances ou un appartement à Carcassonne ? Etoilys réalise la visite officielle directement dans votre logement, avec une démarche simple et des tarifs clairs.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Connaître mon tarif/ })).toHaveAttribute(
      'href',
      '#tarifs'
    );
    expect(document.getElementById('tarifs')).toBeInTheDocument();
    expect(screen.getByText('Demande en 30 secondes')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Cofrac Inspection n° 3-2394' })).toBeInTheDocument();
    expect(screen.getByText('un classement de 1 à 5 étoiles.')).toBeInTheDocument();

    expect(screen.getByText('Cité de Carcassonne et Pont-Vieux')).toBeInTheDocument();
    expect(
      screen.getByAltText('Cité médiévale de Carcassonne et Pont-Vieux au-dessus de l’Aude')
    ).toHaveAttribute('src', IMAGE_MANIFEST.carcassonneHero.src);
    expect(IMAGE_MANIFEST.carcassonneHero).toMatchObject({ width: 4320, height: 3456 });
    expect(document.querySelector('.local-v6-hero-media')).not.toHaveTextContent(
      /Lynx1211|Wikimedia|CC BY-SA/
    );

    expect(
      screen.getByAltText('Promeneurs sur le Pont-Vieux devant la Cité médiévale de Carcassonne')
    ).toHaveAttribute('src', IMAGE_MANIFEST.carcassonneExpertise.src);
    expect(IMAGE_MANIFEST.carcassonneExpertise).toMatchObject({ width: 7310, height: 4573 });
    expect(IMAGE_MANIFEST.carcassonneExpertise.src).not.toBe(IMAGE_MANIFEST.carcassonneHero.src);
    expect(screen.getByText('Pont-Vieux et Cité médiévale de Carcassonne')).toBeInTheDocument();
    expect(document.querySelectorAll('.local-v6-stone-credit')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Sue Winston / Unsplash' })).toHaveAttribute(
      'href',
      'https://unsplash.com/fr/photos/les-gens-marchent-sur-un-pont-de-pierre-pres-dun-chateau-m5QeiDz8sS0'
    );
    expect(screen.getByRole('link', { name: 'Licence Unsplash' })).toHaveAttribute(
      'href',
      'https://unsplash.com/fr/licence'
    );

    expectHeadingSequence([
      'Classement de gîtes et meublés de tourisme à Carcassonne et dans le Carcassonnais',
      'Pourquoi faire classer votre meublé de tourisme ?',
      /Où intervenons-nous autour de Carcassonne\s*\?/,
      'Combien coûte le classement d’un meublé à Carcassonne ?',
      'Votre classement en trois étapes',
      'Pourquoi choisir Etoilys pour votre classement à Carcassonne ?',
      'À Carcassonne, le classement peut aussi alléger la taxe de séjour',
      'Les démarches utiles pour votre meublé à Carcassonne',
      'Questions fréquentes sur le classement à Carcassonne',
      'Demandez le classement de votre meublé à Carcassonne',
    ]);

    const serviceArea = getSectionByHeading(/Où intervenons-nous autour de Carcassonne/);
    expect(serviceArea).toHaveTextContent(
      'Nos inspecteurs interviennent à Carcassonne et dans le Carcassonnais, sans frais de déplacement, notamment à :'
    );
    const listedCommunes = within(serviceArea)
      .getAllByRole('listitem')
      .map((item) => item.textContent);
    expect(listedCommunes).toEqual([...CARCASSONNE_SERVICE_COMMUNES]);
    expect(listedCommunes).toHaveLength(15);
    expect(new Set(listedCommunes).size).toBe(15);
    expect(
      within(serviceArea).getByRole('link', { name: /Voir notre zone d’intervention dans l’Aude/ })
    ).toHaveAttribute('href', '/classement-meuble-tourisme-aude');
  });

  it('lists official Aude communes only', () => {
    const cogLabels = readCogAudeCommuneLabels();

    expect(cogLabels.size).toBe(433);
    CARCASSONNE_SERVICE_COMMUNES.forEach((commune) => {
      expect(cogLabels.has(commune), commune).toBe(true);
    });
  });

  it('reuses the Aude pricing profile without intro or invented discount', () => {
    renderCarcassonnePage();

    expect(CARCASSONNE_LOCAL_LANDING_PAGE_V6.pricing).toMatchObject({
      mode: 'direct',
      pricingProfileId: 'aude-standard',
    });
    expect(CARCASSONNE_LOCAL_LANDING_PAGE_V6.pricing).not.toHaveProperty('intro');
    expect(Object.keys(PRICING_PROFILES).filter((id) => /carcassonne/i.test(id))).toEqual([]);

    const pricing = getSectionByHeading('Combien coûte le classement d’un meublé à Carcassonne ?');
    expect(
      pricing.querySelectorAll('.local-v6-tariff-copy > p:not(.editorial-eyebrow)')
    ).toHaveLength(0);
    [
      'La visite et les documents de classement sont inclus, sans frais de déplacement supplémentaires.',
      'Un tarif dégressif peut être proposé pour plusieurs meublés, sur demande.',
      'Le tarif est confirmé avant tout engagement, quelle que soit la catégorie d’étoiles visée.',
    ].forEach((guarantee) => {
      expect(within(pricing).getByText(guarantee)).toBeInTheDocument();
    });
    expect(
      within(pricing).getByText('Votre meublé à Carcassonne et dans le Carcassonnais')
    ).toBeInTheDocument();
    expect(pricing.querySelector('.local-v6-pricing-public')).toHaveTextContent('240 € TTC');
    expect(pricing.querySelector('.local-v6-pricing-partner')).toHaveTextContent('200 € TTC');
    expect(pricing.querySelector('.local-v6-pricing-partner')).toHaveTextContent(
      'Si vous êtes adhérent à un office de tourisme partenaire d’Etoilys.'
    );
    expect(pricing.querySelector('.local-v6-pricing-multiple')).toBeNull();
    expect(pricing.querySelector('.local-v6-pricing-tier-group')).toBeNull();
    expect(new Set(pricing.textContent?.match(/\d+\s€/g))).toEqual(new Set(['240 €', '200 €']));
  });

  it('renders the Carcassonne tourist tax example', () => {
    renderCarcassonnePage();

    // 4 adultes, 150 € HT la nuit : 5 % de 37,50 € par personne (plafond de 3,34 € non atteint), majoré
    // de 10 % + 34 %, contre 1,44 € par personne en 2 étoiles, taxes additionnelles comprises.
    const unclassifiedCents = Math.round((15000 / 4) * 0.05 * 1.44 * 4);
    const classifiedCents = 144 * 4;
    expect((15000 / 4) * 0.05).toBeLessThan(334);
    expect(unclassifiedCents).toBe(1080);
    expect(classifiedCents).toBe(576);
    expect(unclassifiedCents - classifiedCents).toBe(504);
    expect((unclassifiedCents - classifiedCents) * 7).toBe(3528);
    expect(Math.round(((unclassifiedCents - classifiedCents) / unclassifiedCents) * 100)).toBe(47);

    expect(CARCASSONNE_TAX_MODULE.paragraphs).toHaveLength(2);
    const taxSection = getSectionByHeading(
      'À Carcassonne, le classement peut aussi alléger la taxe de séjour'
    );
    expect(within(taxSection).getByText('taxe de séjour')).toHaveClass('text-copper');
    CARCASSONNE_TAX_MODULE.paragraphs.forEach((paragraph) => {
      expect(within(taxSection).getByText(paragraph)).toBeInTheDocument();
    });
    expect(within(taxSection).getByText('Exemple à Carcassonne en 2026')).toBeInTheDocument();
    expect(within(taxSection).getByText('Taxe de séjour pour 4 adultes')).toBeInTheDocument();
    expect(within(taxSection).getByText('Logement à 150 € HT la nuit')).toBeInTheDocument();
    expect(within(taxSection).getByText('10,80 € par nuit')).toBeInTheDocument();
    expect(within(taxSection).getByText('5,76 € par nuit')).toBeInTheDocument();
    expect(
      within(taxSection).getByText(
        '5,04 € de taxe de séjour en moins par nuit, soit une baisse d’environ 47 %'
      )
    ).toBeInTheDocument();
    expect(
      within(taxSection).getByText(
        'Pour quatre adultes, cela représente 35,28 € de taxe de séjour en moins sur une semaine.'
      )
    ).toBeInTheDocument();
    expect(
      within(taxSection).getByText(
        'Tarifs 2026 de la commune de Carcassonne, taxes additionnelles comprises.'
      )
    ).toBeInTheDocument();
    // L’écart concerne la taxe payée par les voyageurs, jamais une économie pour le propriétaire.
    expect(taxSection).toHaveTextContent('Soit 5,04 € de moins par nuit pour les voyageurs.');
    expect(taxSection).not.toHaveTextContent(/économie|propriétaire/i);
    expect(taxSection).not.toHaveTextContent(/non exonérés|perçue au réel|34 %/i);

    const simulatorLinks = within(taxSection).getAllByRole('link', {
      name: 'Comparer la taxe de séjour de mon logement',
    });
    expect(simulatorLinks).toHaveLength(2);
    simulatorLinks.forEach((link) =>
      expect(link).toHaveAttribute('href', '/simulateur-taxe-sejour')
    );
  });

  it('gives the same result in the public tourist tax simulator', async () => {
    const carcassonne = getSimulatedRows(await loadCommuneFromPublicDataset('11069'));

    expect(carcassonne['Non classé']).toBe(10.8);
    expect(carcassonne['2*']).toBe(5.76);
  });

  it('does not extend the Carcassonne amounts to Carcassonne Agglo', async () => {
    // Trèbes relève de Carcassonne Agglo : 0,70 € par personne en 2 étoiles avant taxes additionnelles.
    const trebes = getSimulatedRows(await loadCommuneFromPublicDataset('11397'));
    expect(trebes['2*']).toBe(4.03);

    renderCarcassonnePage();

    const taxSection = getSectionByHeading(/le classement peut aussi alléger/);
    expect(taxSection).toHaveTextContent(
      'Les communes voisines relevant de Carcassonne Agglo disposent d’un barème différent.'
    );

    const territorial = getSectionByHeading('Les démarches utiles pour votre meublé à Carcassonne');
    const faq = getSectionByHeading('Questions fréquentes sur le classement à Carcassonne');
    within(faq)
      .getAllByRole('button')
      .forEach((button) => fireEvent.click(button));
    expect(territorial).not.toHaveTextContent(CARCASSONNE_EXAMPLE_AMOUNTS);
    expect(faq).not.toHaveTextContent(CARCASSONNE_EXAMPLE_AMOUNTS);
  });

  it('renders the three territorial items in order, without a separate notice', () => {
    renderCarcassonnePage();

    const territorial = getSectionByHeading('Les démarches utiles pour votre meublé à Carcassonne');
    expect(territorial).toHaveClass('bg-paper');
    expect(getSectionByHeading(/le classement peut aussi alléger/)).toHaveClass(
      'bg-surface-neutral'
    );
    expect(getSectionByHeading(/Questions fréquentes sur le classement à Carcassonne/)).toHaveClass(
      'bg-surface-neutral'
    );
    expect(territorial).toHaveTextContent(
      'Déclaration du logement, taxe de séjour, prise en compte de votre classement : voici les principaux services à connaître à Carcassonne et dans les communes voisines.'
    );

    const entries = within(territorial).getAllByRole('listitem');
    expect(
      entries.map((entry) =>
        within(entry).getByRole('heading', { level: 3 }).textContent?.replace(/\s+/g, ' ')
      )
    ).toEqual([
      'Déclarer votre meublé à Carcassonne',
      'Déclarer et payer la taxe de séjour à Carcassonne',
      'Trèbes, Palaja, Pennautier : un autre barème',
    ]);
    [
      'La Ville de Carcassonne oriente les propriétaires de meublés de tourisme vers le service DéclaLoc pour leur déclaration préalable en mairie, notamment lorsque le logement n’est pas leur résidence principale. Selon votre situation, d’autres formalités peuvent s’appliquer. Le classement officiel ne remplace pas ces démarches.',
      'La commune de Carcassonne dispose de son propre portail de taxe de séjour. Les déclarations sont mensuelles et, depuis le 1er octobre 2026, les paiements sont eux aussi effectués chaque mois, au lieu de chaque trimestre. Après un classement ou un renouvellement, pensez à vérifier que la catégorie en étoiles de votre logement est bien prise en compte.',
      'Dans les communes voisines relevant de Carcassonne Agglo, les tarifs et les démarches de taxe de séjour ne sont pas nécessairement ceux de la ville de Carcassonne. L’Agglo publie son propre barème et renvoie vers son portail de déclaration. Vérifiez toujours la collectivité compétente selon l’adresse exacte de votre meublé.',
    ].forEach((body, index) => {
      const entry = entries[index];
      if (!entry) throw new Error(`Missing territorial item ${index}`);
      expect(within(entry).getByText(body)).toBeInTheDocument();
    });

    expect(
      entries.map((entry) => {
        const link = within(entry).getByRole('link');
        expect(link).toHaveAttribute('target', '_blank');
        return [link.textContent, link.getAttribute('href'), link.getAttribute('rel')];
      })
    ).toEqual([
      [
        'Consulter les démarches de déclaration à Carcassonne',
        'https://carcassonne.taxesejour.fr/portail/homepage-declaloc',
        'noopener noreferrer',
      ],
      [
        'Accéder au portail de taxe de séjour de Carcassonne',
        'https://carcassonne.taxesejour.fr/',
        'noopener noreferrer',
      ],
      [
        'Consulter les règles de taxe de séjour de Carcassonne Agglo',
        'https://www.carcassonne-agglo.fr/mon-agglo/elus-et-instances/grand-carcassonne-tourisme/la-taxe-de-sejour/',
        'noopener noreferrer',
      ],
    ]);

    expect(document.querySelector('.local-v6-notice')).toBeNull();
  });

  it('orders local FAQ before the shared FAQ and keeps CTA analytics', () => {
    renderCarcassonnePage();

    const faq = getSectionByHeading('Questions fréquentes sur le classement à Carcassonne');
    const questions = within(faq)
      .getAllByRole('button')
      .map((button) => button.textContent?.trim());
    expect(questions).toEqual([
      'Intervenez-vous à Trèbes, Palaja et dans les communes autour de Carcassonne ?',
      'La taxe de séjour est-elle identique à Carcassonne et dans les communes voisines ?',
      ...CITY_COMMON_FAQ.map((item) => item.question),
      ...COMMON_LOCAL_V6_FAQ_ITEMS.map((item) => item.question),
    ]);
    expect(new Set(questions).size).toBe(questions.length);

    [
      {
        question: 'Intervenez-vous à Trèbes, Palaja et dans les communes autour de Carcassonne ?',
        answer:
          'Oui. Etoilys intervient à Carcassonne et dans les communes environnantes, notamment Trèbes, Palaja, Pennautier, Villemoustaussou, Cazilhac, Pezens et Conques-sur-Orbiel. Nos inspecteurs couvrent également le reste de l’Aude, avec un tarif confirmé avant tout engagement.',
      },
      {
        question:
          'La taxe de séjour est-elle identique à Carcassonne et dans les communes voisines ?',
        answer:
          'Non. La ville de Carcassonne possède son propre barème et son portail de taxe de séjour. Les autres communes relevant de Carcassonne Agglo utilisent les modalités définies par l’agglomération. Vérifiez toujours les règles applicables à la commune où se situe votre logement.',
      },
    ].forEach(({ question, answer }) => {
      fireEvent.click(within(faq).getByRole('button', { name: question }));
      expect(faq).toHaveTextContent(answer);
    });

    const main = screen.getByRole('main');
    const conversionLinks = within(main).getAllByRole('link', { name: 'Demander mon classement' });
    expect(conversionLinks.length).toBeGreaterThanOrEqual(2);
    conversionLinks.forEach((link) => expect(link).toHaveAttribute('href', '/demande-classement'));
    const heroCta = conversionLinks[0];
    const finalCta = conversionLinks[conversionLinks.length - 1];
    if (!heroCta || !finalCta) throw new Error('Missing Carcassonne conversion links');
    heroCta.addEventListener('click', (event: MouseEvent) => event.preventDefault());
    finalCta.addEventListener('click', (event: MouseEvent) => event.preventDefault());

    fireEvent.click(heroCta);
    expect(trackCtaClick).toHaveBeenLastCalledWith({
      ctaId: 'cta_white_demande_classement',
      destinationPath: '/demande-classement',
    });
    fireEvent.click(finalCta);
    expect(trackCtaClick).toHaveBeenLastCalledWith({
      ctaId: 'cta_white_demande_classement',
      destinationPath: '/demande-classement',
    });
  });

  it('publishes registry, hub, SEO, sitemap and breadcrumb data', async () => {
    renderCarcassonnePage();

    expect(getLocalRegistryEntry('carcassonne')).toMatchObject({
      kind: 'city',
      name: 'Carcassonne et le Carcassonnais',
      parentId: 'aude',
      departmentCode: '11',
      regionId: 'occitanie',
      path: CARCASSONNE_PATH,
      status: 'published',
      hubLabel: 'Carcassonne et le Carcassonnais',
    });
    expect(isLocalRegistryEntryPublished('carcassonne')).toBe(true);
    expect(getPublishedLocalChildEntriesForDepartment('aude').map((child) => child.id)).toEqual([
      'carcassonne',
      'narbonne-cote-du-midi',
    ]);
    expect(getDepartmentInterventionArea('aude').localPages.map((page) => page.id)).toEqual([
      'carcassonne',
      'narbonne-cote-du-midi',
    ]);
    expect(getIndexablePaths()).toContain(CARCASSONNE_PATH);
    expect(getPrerenderPaths()).toContain(CARCASSONNE_PATH);
    expect(readFileSync('public/sitemap.xml', 'utf8')).toContain(
      `<loc>https://www.etoilys.fr${CARCASSONNE_PATH}</loc>`
    );

    await waitFor(() => {
      expect(document.title).toBe('Classement meublé de tourisme à Carcassonne | Etoilys');
    });
    expect(document.querySelector("meta[name='description']")).toHaveAttribute(
      'content',
      'Faites classer votre gîte ou meublé de tourisme à Carcassonne et dans le Carcassonnais avec Etoilys. Visite officielle, tarifs clairs et demande en ligne.'
    );
    expect(document.querySelector("link[rel='canonical']")).toHaveAttribute(
      'href',
      'https://www.etoilys.fr/classement-meuble-tourisme-carcassonne'
    );
    expect(document.querySelector("meta[name='robots']")).toHaveAttribute(
      'content',
      'index,follow,max-image-preview:large'
    );
    expect(document.querySelector("meta[name='keywords']")).toBeNull();
    expect(document.querySelector("meta[property='og:image']")).toHaveAttribute(
      'content',
      `https://www.etoilys.fr${IMAGE_MANIFEST.carcassonneHero.src}`
    );
    expect(document.querySelector("meta[property='og:image:alt']")).toHaveAttribute(
      'content',
      IMAGE_ALT_TEXT.carcassonneHero.fr
    );

    const visibleBreadcrumb = screen.getByRole('navigation', { name: 'Fil d’Ariane' });
    expect(within(visibleBreadcrumb).getByRole('link', { name: 'Aude' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-aude'
    );
    expect(within(visibleBreadcrumb).getByText('Carcassonne et le Carcassonnais')).toHaveAttribute(
      'aria-current',
      'page'
    );

    await waitFor(() => {
      const breadcrumbs = getJsonLdScripts().filter(
        (script) => script['@type'] === 'BreadcrumbList'
      );
      expect(breadcrumbs).toHaveLength(1);
      expect(breadcrumbs[0]?.itemListElement).toEqual([
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Accueil',
          item: 'https://www.etoilys.fr/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Zones d’intervention',
          item: 'https://www.etoilys.fr/zones-intervention',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Aude',
          item: 'https://www.etoilys.fr/classement-meuble-tourisme-aude',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Carcassonne et le Carcassonnais',
          item: 'https://www.etoilys.fr/classement-meuble-tourisme-carcassonne',
        },
      ]);
    });
  });
});
