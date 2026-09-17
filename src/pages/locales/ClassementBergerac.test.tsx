import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from '../../App';
import { IMAGE_MANIFEST } from '../../content/imageManifest';
import { trackCtaClick } from '../../utils/analytics';

vi.mock('../../utils/analytics', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../utils/analytics')>()),
  trackCtaClick: vi.fn(),
}));

function renderBergeracPage() {
  window.history.pushState({}, 'Bergerac', '/classement-meuble-tourisme-bergerac');
  return render(<App />);
}

function getJsonLdScripts() {
  return [
    ...document.querySelectorAll<HTMLScriptElement>("script[type='application/ld+json']"),
  ].map((script) => JSON.parse(script.textContent ?? '{}') as Record<string, unknown>);
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

function expectHeadingSectionClass(headingName: string | RegExp, className: string | RegExp) {
  const heading = screen.getByRole('heading', { name: headingName });
  const section = heading.closest('section');

  expect(section).not.toBeNull();
  if (typeof className === 'string') {
    expect(section).toHaveClass(className);
    return;
  }

  expect(section?.className).toEqual(expect.stringMatching(className));
}

describe('ClassementBergerac', () => {
  afterEach(() => {
    cleanup();
    document.head.innerHTML = '';
    document.title = '';
    vi.mocked(trackCtaClick).mockClear();
  });

  it('keeps the Bergerac hero with one H1 and the existing image credit', () => {
    renderBergeracPage();

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Classement de meublé de tourisme à Bergerac et dans le Bergeracois',
      })
    ).toBeInTheDocument();
    expect(screen.getByText('à Bergerac et dans le Bergeracois')).toHaveClass('text-copper');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByText('Demande en 30 secondes').length).toBeGreaterThan(0);
    expect(screen.getByText('Visite en moyenne sous deux semaines')).toBeInTheDocument();
    expect(screen.getAllByText('Aucun frais de déplacement').length).toBeGreaterThan(0);
    expect(screen.getByText('Quai Cyrano, Bergerac')).toBeInTheDocument();
    const heroGrid = document.querySelector('.editorial-hero-grid');
    expect(heroGrid?.children).toHaveLength(2);
    const mediaColumn = heroGrid?.children[1];
    expect(mediaColumn).toHaveClass('local-v6-hero-media');
    expect(
      within(mediaColumn as HTMLElement).getByRole('link', {
        name: /Benjamin Smith \/ Wikimedia Commons/i,
      })
    ).toHaveAttribute(
      'href',
      'https://commons.wikimedia.org/wiki/File:Bergerac_-_View_in_late_afternoon.jpg'
    );
    expect(
      within(mediaColumn as HTMLElement).getByRole('link', { name: 'CC BY-SA 4.0' })
    ).toHaveAttribute('href', 'https://creativecommons.org/licenses/by-sa/4.0/');
    expect(
      within(document.querySelector('.editorial-hero-featured') as HTMLElement).getByRole('link', {
        name: 'Connaître mon tarif',
      })
    ).toHaveAttribute('href', '#tarifs');
    const heroImage = document.querySelector('.editorial-hero-media-photo img');
    expect(heroImage).toHaveClass(
      'object-[76%_center]',
      'max-[899px]:object-[78%_center]',
      'max-[680px]:object-[76%_center]'
    );
  });

  it('renders Bergerac in the V6 section order with local data preserved', () => {
    renderBergeracPage();

    expectHeadingSequence([
      'Classement de meublé de tourisme à Bergerac et dans le Bergeracois',
      'Pourquoi faire classer votre meublé de tourisme ?',
      /Où intervenons-nous autour de Bergerac\s*\?/,
      'Combien coûte le classement d’un meublé à Bergerac ?',
      'Votre classement en trois étapes',
      'Pourquoi choisir Etoilys pour votre classement à Bergerac ?',
      'Un exemple concret à Bergerac : l’effet du classement sur la taxe de séjour',
      'Questions fréquentes sur le classement à Bergerac',
      'Demandez le classement de votre meublé en Dordogne',
    ]);

    expect(screen.getByText('Eymet')).toBeInTheDocument();
    expect(screen.getByText('Lalinde')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Une fiscalité micro-BIC plus favorable' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Une taxe de séjour maîtrisée' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Un repère officiel de qualité' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /cotisations sociales/i })
    ).not.toBeInTheDocument();
  });

  it('uses V6 surfaces while leaving the Bordeaux V4 renderer to ETOILYS-414', () => {
    renderBergeracPage();

    expect(document.querySelector('.local-v6-landing')).toBeInTheDocument();
    expectHeadingSectionClass('Pourquoi faire classer votre meublé de tourisme ?', 'bg-paper');
    expectHeadingSectionClass(
      /Où intervenons-nous autour de Bergerac\s*\?/,
      'local-v6-service-area'
    );
    expectHeadingSectionClass('Combien coûte le classement d’un meublé à Bergerac ?', 'bg-paper');
    expectHeadingSectionClass('Votre classement en trois étapes', 'bg-surface-warm');
    expectHeadingSectionClass(
      'Pourquoi choisir Etoilys pour votre classement à Bergerac ?',
      'bg-surface-sage'
    );
    expectHeadingSectionClass(
      'Un exemple concret à Bergerac : l’effet du classement sur la taxe de séjour',
      'bg-surface-neutral'
    );
    expectHeadingSectionClass('Questions fréquentes sur le classement à Bergerac', 'bg-paper');
    expectHeadingSectionClass('Demandez le classement de votre meublé en Dordogne', 'bg-ink');
  });

  it('keeps Bergerac tariffs, tax comparison, module rhythm and V6 Etoilys reasons', () => {
    renderBergeracPage();

    [
      'Aucun frais de déplacement : la visite et les documents de classement sont inclus.',
      'Des tarifs dégressifs pour plusieurs meublés visités le même jour dans le même secteur.',
      'Un tarif confirmé avant tout engagement, quelle que soit la catégorie d’étoiles demandée.',
    ].forEach((guarantee) => expect(screen.getByText(guarantee)).toBeInTheDocument());
    expect(screen.getByRole('link', { name: 'Les modalités de la visite' })).toHaveAttribute(
      'href',
      '/procedure'
    );
    expect(screen.getByText('Meublé non classé')).toBeInTheDocument();
    expect(screen.getByText('6,60 € par nuit')).toBeInTheDocument();
    expect(screen.getByText('Meublé classé 2 étoiles')).toBeInTheDocument();
    expect(screen.getByText('3,12 € par nuit')).toBeInTheDocument();
    expect(
      screen.getByText('3,48 € de taxe de séjour en moins par nuit, soit une baisse d’environ 53 %')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/24,36 € de taxe de séjour en moins sur une semaine/i)
    ).toBeInTheDocument();

    expect(screen.getByText('Tarif public')).toBeInTheDocument();
    expect(screen.getAllByText(/240\s€/)).not.toHaveLength(0);
    expect(
      screen.getByText('Si vous êtes adhérent à un office de tourisme partenaire d’Etoilys.')
    ).toBeInTheDocument();
    expect(screen.getAllByText(/200\s€/)).not.toHaveLength(0);
    expect(screen.getAllByText('Premier logement').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Deuxième logement').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Troisième logement et suivants').length).toBeGreaterThan(0);
    expect(screen.getAllByText('160 € TTC').length).toBeGreaterThan(0);
    expect(screen.getAllByText('100 € par logement TTC').length).toBeGreaterThan(0);
    expect(
      document.body.textContent?.match(
        /Les tarifs ci-dessous sont tout compris, sans frais de déplacement/g
      ) ?? []
    ).toHaveLength(0);
    const directPricingResult = document.querySelector('.local-v6-pricing-result');
    expect(directPricingResult).toHaveClass('local-v6-pricing-result-direct');
    expect(document.body).not.toHaveTextContent('CONTEXTE LOCAL');
    expect(document.querySelector('.local-v6-tax-grid')).toBeInTheDocument();
    expect(document.querySelector('.local-v6-tax-copy h2')).toHaveTextContent(
      'Un exemple concret à Bergerac : l’effet du classement sur la taxe de séjour'
    );
    const taxHeading = screen.getByRole('heading', {
      name: 'Un exemple concret à Bergerac : l’effet du classement sur la taxe de séjour',
    });
    expect(within(taxHeading).getByText('taxe de séjour')).toHaveClass('text-copper');

    expect(
      screen.getByRole('heading', {
        name: '100 % spécialisés dans le classement des meublés de tourisme',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Des outils pour préparer votre visite' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Un organisme accrédité Cofrac' })
    ).toBeInTheDocument();

    const expertiseImage = screen.getByAltText(
      'Église Saint-Jacques et statue de Cyrano de Bergerac'
    );
    expect(expertiseImage).toHaveAttribute('src', IMAGE_MANIFEST.bergeracSaintJacquesCyrano.src);
    expect(expertiseImage).not.toHaveAttribute('src', IMAGE_MANIFEST.bergeracHero.src);
    expect(screen.getByRole('link', { name: 'JGS25 / Wikimedia Commons' })).toHaveAttribute(
      'href',
      'https://commons.wikimedia.org/wiki/File:Bergerac,_l%27%C3%A9glise_Saint-Jacques_et_Cyrano.jpg'
    );
  });

  it('renders expected V6 internal links without invented local claims', () => {
    renderBergeracPage();

    const expectedLinks: Array<{ href: string; name: string | RegExp }> = [
      { href: '/classement-meuble-tourisme-dordogne', name: /interventions en Dordogne/i },
      { href: '/procedure', name: 'La procédure en détail' },
      { href: '/les-avantages-du-classement', name: /avantages du classement/i },
      { href: '/simulateur', name: 'Estimer mon classement' },
      { href: '/simulateur-taxe-sejour', name: 'Comparer la taxe de séjour de mon logement' },
      { href: '/demande-classement', name: 'Demander mon classement' },
      { href: '/contact', name: 'Parlons-en' },
    ];

    expectedLinks.forEach(({ href, name }) => {
      expect(
        screen.getAllByRole('link', { name }).some((link) => link.getAttribute('href') === href)
      ).toBe(true);
    });
    expect(
      document.querySelector('a[href="/actualites/preparer-visite-classement-meuble-tourisme"]')
    ).toHaveTextContent('Voir notre guide pour préparer la visite de classement');
    expect(
      document.querySelector('a[href="/actualites/que-faire-apres-classement-meuble-tourisme"]')
    ).toHaveTextContent('Voir les démarches à effectuer après le classement');

    expect(document.body).not.toHaveTextContent(
      /témoignage|partenariat local|agence Etoilys à Bergerac/i
    );
    expect(document.body).not.toHaveTextContent(/LocalBusiness/i);
  });

  it('preserves Bergerac CTA analytics variants after reusing the Dordogne final CTA', () => {
    renderBergeracPage();

    const main = screen.getByRole('main');
    expect(
      screen.getByRole('heading', { name: 'Demandez le classement de votre meublé en Dordogne' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Parlez-nous de votre projet. Rappel sous 24 h ouvrées,/)
    ).toBeInTheDocument();
    expect(screen.getByText(/visite en moyenne sous deux semaines./)).toBeInTheDocument();
    expect(screen.getByText('Tarif confirmé avant tout engagement.')).toBeInTheDocument();
    const conversionLinks = within(main).getAllByRole('link', { name: 'Demander mon classement' });
    const heroCta = conversionLinks[0];
    const finalCta = conversionLinks[conversionLinks.length - 1];
    if (!heroCta || !finalCta) throw new Error('Missing Bergerac conversion links');
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

    const procedureLink = within(main).getByRole('link', { name: 'La procédure en détail' });
    procedureLink.addEventListener('click', (event: MouseEvent) => event.preventDefault());
    fireEvent.click(procedureLink);
    expect(trackCtaClick).toHaveBeenLastCalledWith({
      ctaId: 'cta_secondary_procedure',
      destinationPath: '/procedure',
    });
  });

  it('keeps SEO metadata and hierarchical breadcrumb JSON-LD', async () => {
    renderBergeracPage();

    await waitFor(() => {
      expect(document.title).toBe('Classement meublé de tourisme à Bergerac | Etoilys');
    });

    expect(document.querySelector("meta[name='description']")).toHaveAttribute(
      'content',
      'Faites classer votre meublé de tourisme à Bergerac et dans le Bergeracois. Visite sur place, tarifs clairs et demande en ligne avec Etoilys.'
    );
    expect(document.querySelector("link[rel='canonical']")).toHaveAttribute(
      'href',
      'https://www.etoilys.fr/classement-meuble-tourisme-bergerac'
    );
    expect(document.querySelector("meta[name='robots']")).toHaveAttribute(
      'content',
      'index,follow'
    );
    expect(document.querySelectorAll("link[data-seo-alternate='true']")).toHaveLength(0);

    await waitFor(() => {
      const breadcrumbs = getJsonLdScripts().find((script) => script['@type'] === 'BreadcrumbList');
      expect(breadcrumbs).toBeDefined();
      expect(breadcrumbs?.itemListElement).toEqual([
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
          name: 'Dordogne',
          item: 'https://www.etoilys.fr/classement-meuble-tourisme-dordogne',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Bergerac et le Bergeracois',
          item: 'https://www.etoilys.fr/classement-meuble-tourisme-bergerac',
        },
      ]);
    });
  });
});
