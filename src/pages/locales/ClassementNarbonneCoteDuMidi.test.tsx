import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from '../../App';
import { IMAGE_ALT_TEXT } from '../../content/imageAltText';
import { IMAGE_MANIFEST } from '../../content/imageManifest';
import { CITY_COMMON_FAQ } from '../../content/local/cities/sharedCityFaq';
import { NARBONNE_COTE_DU_MIDI_SERVICE_COMMUNES } from '../../content/local/destinations/narbonneCoteDuMidi';
import { PRICING_PROFILES } from '../../content/local/pricing';
import {
  getDepartmentInterventionArea,
  getLocalRegistryEntry,
  getPublishedLocalChildEntriesForDepartment,
  isLocalRegistryEntryPublished,
} from '../../content/local/registry';
import { COMMON_LOCAL_V6_FAQ_ITEMS } from '../../content/local/sharedLocalContent';
import { NARBONNE_COTE_DU_MIDI_LOCAL_LANDING_PAGE_V6 } from '../../content/local/v6Pages';
import { getIndexablePaths, getPrerenderPaths } from '../../content/seoRoutes';
import { trackCtaClick } from '../../utils/analytics';

vi.mock('../../utils/analytics', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../utils/analytics')>()),
  trackCtaClick: vi.fn(),
}));

const NARBONNE_PATH = '/classement-meuble-tourisme-narbonne';

function renderNarbonnePage() {
  window.history.pushState({}, 'Narbonne et la Côte du Midi', NARBONNE_PATH);
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

describe('ClassementNarbonneCoteDuMidi', () => {
  afterEach(() => {
    cleanup();
    document.head.innerHTML = '';
    document.title = '';
    vi.mocked(trackCtaClick).mockClear();
  });

  it('renders the destination with V6 hero, images and service area', () => {
    renderNarbonnePage();

    expect(NARBONNE_COTE_DU_MIDI_LOCAL_LANDING_PAGE_V6.scope).toBe('destination');
    expect(document.querySelector('.local-v6-landing')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Classement de gîtes et meublés de tourisme à Narbonne et sur la Côte du Midi',
      })
    ).toBeInTheDocument();
    expect(screen.getByText('à Narbonne et sur la Côte du Midi')).toHaveClass('text-copper');
    expect(document.body).toHaveTextContent('Narbonne · Côte du Midi');
    expect(
      screen.getByText(
        'Vous souhaitez faire classer un gîte, une maison de vacances ou un appartement à Narbonne ou sur la Côte du Midi ? Etoilys réalise la visite officielle directement dans votre logement, avec une démarche simple, des tarifs clairs et un classement de 1 à 5 étoiles.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Connaître mon tarif/ })).toHaveAttribute(
      'href',
      '#tarifs'
    );
    expect(document.getElementById('tarifs')).toBeInTheDocument();

    expect(screen.getByText('Canal de la Robine, Narbonne')).toBeInTheDocument();
    expect(
      screen.getByAltText('Canal de la Robine et bâtiments du centre historique de Narbonne')
    ).toHaveAttribute('src', IMAGE_MANIFEST.narbonneCoteDuMidiHero.src);
    expect(IMAGE_MANIFEST.narbonneCoteDuMidiHero).toMatchObject({ width: 3060, height: 2448 });
    expect(
      screen.getByAltText('Ponton de bois traversant un étang devant le village de Peyriac-de-Mer')
    ).toHaveAttribute('src', IMAGE_MANIFEST.narbonneCoteDuMidiPeyriac.src);
    expect(screen.getByText('Ponton de bois sur l’étang, Peyriac-de-Mer')).toBeInTheDocument();
    expect(document.querySelectorAll('.local-v6-stone-credit')).toHaveLength(1);
    expect(
      screen.getByRole('link', { name: 'Christian Ferrer / Wikimedia Commons' })
    ).toHaveAttribute(
      'href',
      'https://commons.wikimedia.org/wiki/File:Peyriac-de-Mer,_february_2018_(05).jpg'
    );
    expect(screen.getByRole('link', { name: 'CC BY 4.0' })).toHaveAttribute(
      'href',
      'https://creativecommons.org/licenses/by/4.0/'
    );

    expectHeadingSequence([
      'Classement de gîtes et meublés de tourisme à Narbonne et sur la Côte du Midi',
      'Pourquoi faire classer votre meublé de tourisme ?',
      /Où intervenons-nous à Narbonne et sur la Côte du Midi\s*\?/,
      'Combien coûte le classement d’un meublé à Narbonne et sur la Côte du Midi ?',
      'Votre classement en trois étapes',
      'Pourquoi choisir Etoilys pour votre classement à Narbonne et sur la Côte du Midi ?',
      'À Narbonne, le classement peut alléger la taxe de séjour de vos voyageurs',
      'Les démarches utiles pour votre meublé à Narbonne et sur la Côte du Midi',
      'Questions fréquentes sur le classement à Narbonne et sur la Côte du Midi',
      'Demandez le classement de votre meublé à Narbonne et sur la Côte du Midi',
    ]);

    const serviceArea = getSectionByHeading(/Où intervenons-nous à Narbonne/);
    expect(serviceArea).toHaveTextContent(
      'Etoilys intervient à Narbonne, sur le littoral et dans les communes environnantes de la Côte du Midi. Du centre historique de Narbonne aux plages méditerranéennes, en passant par les étangs et les villages de la Narbonnaise, nos inspecteurs se déplacent directement dans votre logement, sans frais de déplacement supplémentaires.'
    );
    const listedCommunes = within(serviceArea)
      .getAllByRole('listitem')
      .map((item) => item.textContent);
    expect(listedCommunes).toEqual([...NARBONNE_COTE_DU_MIDI_SERVICE_COMMUNES]);
    expect(listedCommunes).toHaveLength(18);
    expect(
      within(serviceArea).getByRole('link', { name: /Voir notre zone d’intervention dans l’Aude/ })
    ).toHaveAttribute('href', '/classement-meuble-tourisme-aude');
  });

  it('lists official communes only, without Narbonne-Plage, Gruissan or Leucate as entries', () => {
    const cogLabels = readCogAudeCommuneLabels();

    expect(cogLabels.size).toBe(433);
    NARBONNE_COTE_DU_MIDI_SERVICE_COMMUNES.forEach((commune) => {
      expect(cogLabels.has(commune.replace(/’/g, "'")), commune).toBe(true);
    });
    expect(cogLabels.has('Narbonne-Plage')).toBe(false);
    ['Narbonne-Plage', 'Gruissan', 'Leucate'].forEach((commune) => {
      expect(NARBONNE_COTE_DU_MIDI_SERVICE_COMMUNES).not.toContain(commune);
    });
  });

  it('reuses the Aude pricing profile with no invented multi-property tier', () => {
    renderNarbonnePage();

    expect(NARBONNE_COTE_DU_MIDI_LOCAL_LANDING_PAGE_V6.pricing).toMatchObject({
      mode: 'direct',
      pricingProfileId: 'aude-standard',
    });
    expect(Object.keys(PRICING_PROFILES).filter((id) => /narbonne/i.test(id))).toEqual([]);

    const pricing = getSectionByHeading(
      'Combien coûte le classement d’un meublé à Narbonne et sur la Côte du Midi ?'
    );
    expect(pricing).not.toHaveTextContent('coûte 240 € TTC par visite');
    [
      'La visite et les documents de classement sont inclus, sans frais de déplacement supplémentaires.',
      'Un tarif dégressif peut être proposé pour plusieurs meublés, sur demande.',
      'Le tarif est confirmé avant tout engagement, quelle que soit la catégorie d’étoiles visée.',
    ].forEach((guarantee) => {
      expect(within(pricing).getByText(guarantee)).toBeInTheDocument();
    });
    expect(
      within(pricing).getByText('Votre meublé à Narbonne et sur la Côte du Midi')
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

  it('renders the Grand Narbonne tourist tax example without generalising it', () => {
    renderNarbonnePage();

    // 4 adultes, 150 € HT la nuit : 5 % de 37,50 € par personne (plafond de 3 € non atteint), majoré
    // de 10 % + 34 %, contre 1,30 € par personne en 2 étoiles, taxes additionnelles comprises.
    const unclassifiedCents = Math.round((15000 / 4) * 0.05 * 1.44 * 4);
    const classifiedCents = 130 * 4;
    expect((15000 / 4) * 0.05).toBeLessThan(300);
    expect(unclassifiedCents).toBe(1080);
    expect(classifiedCents).toBe(520);
    expect(unclassifiedCents - classifiedCents).toBe(560);
    expect((unclassifiedCents - classifiedCents) * 7).toBe(3920);
    expect(Math.round(((unclassifiedCents - classifiedCents) / unclassifiedCents) * 100)).toBe(52);

    const taxSection = getSectionByHeading(
      'À Narbonne, le classement peut alléger la taxe de séjour de vos voyageurs'
    );
    expect(within(taxSection).getByText('taxe de séjour')).toHaveClass('text-copper');
    expect(within(taxSection).getByText('Exemple à Narbonne en 2026')).toBeInTheDocument();
    expect(within(taxSection).getByText('Taxe de séjour pour 4 adultes')).toBeInTheDocument();
    expect(within(taxSection).getByText('Logement à 150 € HT la nuit')).toBeInTheDocument();
    expect(within(taxSection).getByText('10,80 € par nuit')).toBeInTheDocument();
    expect(within(taxSection).getByText('5,20 € par nuit')).toBeInTheDocument();
    expect(
      within(taxSection).getByText(
        '5,60 € de taxe de séjour en moins par nuit, soit une baisse d’environ 52 %'
      )
    ).toBeInTheDocument();
    expect(
      within(taxSection).getByText(
        'Pour quatre adultes, cela représente 39,20 € de taxe de séjour en moins sur une semaine.'
      )
    ).toBeInTheDocument();
    expect(within(taxSection).getByText('Tarifs 2026 du Grand Narbonne.')).toBeInTheDocument();
    expect(taxSection).toHaveTextContent(
      'Attention : Gruissan et Leucate ont leurs propres modalités, ces montants ne s’y appliquent pas automatiquement.'
    );
    // L’écart concerne la taxe payée par les voyageurs, jamais une économie pour le propriétaire.
    expect(taxSection).toHaveTextContent(
      'permet par exemple à vos voyageurs de payer 5,60 € de taxe de séjour en moins par nuit'
    );
    expect(taxSection).not.toHaveTextContent(/économie|propriétaire/i);
    // Le détail du calcul reste en commentaire de la config : le texte visible reste simple.
    expect(taxSection).not.toHaveTextContent(/taxes additionnelles|non exonérés|perçue au réel/i);

    const simulatorLinks = within(taxSection).getAllByRole('link', {
      name: 'Comparer la taxe de séjour de mon logement',
    });
    expect(simulatorLinks).toHaveLength(2);
    simulatorLinks.forEach((link) =>
      expect(link).toHaveAttribute('href', '/simulateur-taxe-sejour')
    );
  });

  it('renders the three territorial items in order, without a separate notice', () => {
    renderNarbonnePage();

    const territorial = getSectionByHeading(
      'Les démarches utiles pour votre meublé à Narbonne et sur la Côte du Midi'
    );
    expect(territorial).toHaveClass('bg-paper');
    expect(getSectionByHeading(/À Narbonne, le classement peut alléger/)).toHaveClass(
      'bg-surface-neutral'
    );
    expect(getSectionByHeading(/Questions fréquentes sur le classement à Narbonne/)).toHaveClass(
      'bg-surface-neutral'
    );
    expect(territorial).toHaveTextContent(
      'Déclaration du meublé, taxe de séjour, mise à jour du classement : plusieurs démarches concernent directement les propriétaires de locations saisonnières à Narbonne. Voici les principaux interlocuteurs et outils locaux à connaître.'
    );

    const entries = within(territorial).getAllByRole('listitem');
    expect(
      entries.map((entry) => within(entry).getByRole('heading', { level: 3 }).textContent)
    ).toEqual([
      'Déclarer votre meublé à Narbonne',
      'Déclarer la taxe de séjour au Grand Narbonne',
      'Signaler votre classement après la visite',
    ]);
    [
      'La Ville de Narbonne met à disposition un service de télédéclaration pour les meublés de tourisme. Selon la situation du logement, notamment lorsqu’il ne constitue pas la résidence principale du loueur, une autorisation de changement d’usage peut également être nécessaire. Vérifiez les formalités applicables avant de commercialiser votre logement : le classement officiel ne remplace pas ces démarches.',
      'Le Grand Narbonne dispose d’un portail dédié à la taxe de séjour au réel. Les hébergeurs concernés y déclarent chaque mois les nuitées commercialisées directement, avant le 15 du mois suivant. Lorsque les plateformes de réservation collectent et reversent la taxe, vérifiez les déclarations restant à effectuer : une déclaration à zéro peut notamment être nécessaire si aucune nuitée n’a été commercialisée directement.',
      'Une fois votre classement obtenu, pensez à faire actualiser la catégorie de votre hébergement auprès du service de taxe de séjour compétent. L’Office de tourisme de la Côte du Midi indique qu’une copie de la décision de classement peut être transmise au service du Grand Narbonne par courriel. Actualisez également le nombre d’étoiles dans vos annonces Airbnb, Booking ou autres plateformes. Si votre logement se situe à Gruissan ou à Leucate, vérifiez les démarches spécifiques auprès de la collectivité concernée.',
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
        'Consulter les démarches de déclaration à Narbonne',
        'https://narbonne.taxesejour.fr/portail/homepage-declaloc',
        'noopener noreferrer',
      ],
      [
        'Accéder au portail de taxe de séjour du Grand Narbonne',
        'https://grandnarbonne.taxesejour.fr/',
        'noopener noreferrer',
      ],
      [
        'Contacter le service de taxe de séjour du Grand Narbonne',
        'https://www.narbonne.fr/taxe-sejour',
        'noopener noreferrer',
      ],
    ]);

    // La page classement de l’office de tourisme présente des organismes concurrents.
    expect(document.querySelector('a[href*="cotedumidi.com"]')).toBeNull();
    expect(document.querySelector('.local-v6-notice')).toBeNull();
  });

  it('orders local FAQ before the shared FAQ and keeps CTA analytics', () => {
    renderNarbonnePage();

    const faq = getSectionByHeading(
      'Questions fréquentes sur le classement à Narbonne et sur la Côte du Midi'
    );
    const questions = within(faq)
      .getAllByRole('button')
      .map((button) => button.textContent?.trim());
    expect(questions).toEqual([
      'Intervenez-vous à Narbonne-Plage et dans les communes autour de Narbonne ?',
      'Quel tarif pour faire classer plusieurs meublés à Narbonne ?',
      'Le classement remplace-t-il la déclaration en mairie ?',
      ...CITY_COMMON_FAQ.map((item) => item.question),
      ...COMMON_LOCAL_V6_FAQ_ITEMS.map((item) => item.question),
    ]);
    expect(new Set(questions).size).toBe(questions.length);

    [
      {
        question: 'Intervenez-vous à Narbonne-Plage et dans les communes autour de Narbonne ?',
        answer:
          'Oui. Etoilys intervient à Narbonne, Narbonne-Plage et dans les communes environnantes',
      },
      {
        question: 'Quel tarif pour faire classer plusieurs meublés à Narbonne ?',
        answer:
          'La visite individuelle coûte 240 € TTC, ou 200 € TTC si vous êtes adhérent d’un office de tourisme partenaire d’Etoilys. Pour plusieurs logements, un tarif dégressif peut être proposé sur demande.',
      },
      {
        question: 'Le classement remplace-t-il la déclaration en mairie ?',
        answer: 'À Narbonne, un service de télédéclaration est proposé par la mairie.',
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
    if (!heroCta || !finalCta) throw new Error('Missing Narbonne conversion links');
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
    renderNarbonnePage();

    expect(getLocalRegistryEntry('narbonne-cote-du-midi')).toMatchObject({
      kind: 'destination',
      name: 'Narbonne et la Côte du Midi',
      parentId: 'aude',
      departmentCode: '11',
      regionId: 'occitanie',
      path: NARBONNE_PATH,
      status: 'published',
      displayOrder: 10,
      hubLabel: 'Narbonne et la Côte du Midi',
    });
    expect(isLocalRegistryEntryPublished('narbonne-cote-du-midi')).toBe(true);
    expect(getPublishedLocalChildEntriesForDepartment('aude').map((child) => child.id)).toEqual([
      'carcassonne',
      'narbonne-cote-du-midi',
    ]);
    expect(getDepartmentInterventionArea('aude').localPages.map((page) => page.id)).toEqual([
      'carcassonne',
      'narbonne-cote-du-midi',
    ]);
    expect(getIndexablePaths()).toContain(NARBONNE_PATH);
    expect(getPrerenderPaths()).toContain(NARBONNE_PATH);
    expect(readFileSync('public/sitemap.xml', 'utf8')).toContain(
      `<loc>https://www.etoilys.fr${NARBONNE_PATH}</loc>`
    );

    await waitFor(() => {
      expect(document.title).toBe(
        'Classement meublé de tourisme à Narbonne et Côte du Midi | Etoilys'
      );
    });
    expect(document.querySelector("meta[name='description']")).toHaveAttribute(
      'content',
      'Faites classer votre gîte ou meublé de tourisme à Narbonne et sur la Côte du Midi avec Etoilys. Visite officielle, tarifs clairs et demande en ligne.'
    );
    expect(document.querySelector("link[rel='canonical']")).toHaveAttribute(
      'href',
      'https://www.etoilys.fr/classement-meuble-tourisme-narbonne'
    );
    expect(document.querySelector("meta[name='robots']")).toHaveAttribute(
      'content',
      'index,follow,max-image-preview:large'
    );
    expect(document.querySelector("meta[name='keywords']")).toBeNull();
    expect(document.querySelector("meta[property='og:image:alt']")).toHaveAttribute(
      'content',
      IMAGE_ALT_TEXT.narbonneCoteDuMidiHero.fr
    );

    const visibleBreadcrumb = screen.getByRole('navigation', { name: 'Fil d’Ariane' });
    expect(within(visibleBreadcrumb).getByRole('link', { name: 'Aude' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-aude'
    );
    expect(within(visibleBreadcrumb).getByText('Narbonne et la Côte du Midi')).toHaveAttribute(
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
          name: 'Narbonne et la Côte du Midi',
          item: 'https://www.etoilys.fr/classement-meuble-tourisme-narbonne',
        },
      ]);
    });
  });
});
