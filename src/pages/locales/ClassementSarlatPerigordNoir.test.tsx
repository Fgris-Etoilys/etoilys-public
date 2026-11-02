import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from '../../App';
import { IMAGE_ALT_TEXT } from '../../content/imageAltText';
import { IMAGE_MANIFEST } from '../../content/imageManifest';
import { SARLAT_PERIGORD_NOIR_SERVICE_COMMUNES } from '../../content/local/destinations/sarlatPerigordNoir';
import * as V6_PAGES from '../../content/local/v6Pages';
import { SARLAT_PERIGORD_NOIR_LOCAL_LANDING_PAGE_V6 } from '../../content/local/v6Pages';
import {
  getDepartmentInterventionArea,
  getLocalRegistryEntry,
  getPublishedLocalChildEntriesForDepartment,
  isLocalRegistryEntryPublished,
} from '../../content/local/registry';
import { CITY_COMMON_FAQ } from '../../content/local/cities/sharedCityFaq';
import { COMMON_LOCAL_V6_FAQ_ITEMS } from '../../content/local/sharedLocalContent';
import type { LocalLandingPageV6Config } from '../../content/local/types';
import { getIndexablePaths, getPrerenderPaths } from '../../content/seoRoutes';
import { trackCtaClick } from '../../utils/analytics';

vi.mock('../../utils/analytics', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../utils/analytics')>()),
  trackCtaClick: vi.fn(),
}));

const SARLAT_PATH = '/classement-meuble-tourisme-sarlat';

function renderSarlatPerigordNoirPage() {
  window.history.pushState({}, 'Sarlat et le Périgord Noir', SARLAT_PATH);
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

function getConfigPricingProfileIds(config: LocalLandingPageV6Config) {
  return config.scope === 'department'
    ? [
        config.pricing.picker.defaultPricingProfileId,
        ...Object.values(config.pricing.picker.overrides),
      ]
    : [config.pricing.pricingProfileId];
}

describe('ClassementSarlatPerigordNoir', () => {
  afterEach(() => {
    cleanup();
    document.head.innerHTML = '';
    document.title = '';
    vi.mocked(trackCtaClick).mockClear();
  });

  it('renders the Sarlat and Périgord Noir destination with V6 hero, images and service area', () => {
    renderSarlatPerigordNoirPage();

    expect(SARLAT_PERIGORD_NOIR_LOCAL_LANDING_PAGE_V6.scope).toBe('destination');
    expect(document.querySelector('.local-v6-landing')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Classement de gîtes et meublés de tourisme à Sarlat et dans le Périgord Noir',
      })
    ).toBeInTheDocument();
    expect(screen.getByText('à Sarlat et dans le Périgord Noir')).toHaveClass('text-copper');
    expect(document.body).toHaveTextContent('Sarlat · Périgord Noir');
    expect(
      screen.getByText(
        'Vous souhaitez faire classer un gîte, une maison de vacances ou un appartement à Sarlat ou dans le Périgord Noir ? Etoilys réalise la visite officielle directement dans votre logement, avec une procédure simple, des tarifs clairs et un classement de 1 à 5 étoiles.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Connaître mon tarif/ })).toHaveAttribute(
      'href',
      '#tarifs'
    );
    expect(document.getElementById('tarifs')).toBeInTheDocument();

    expect(screen.getByText('Château de Castelnaud-la-Chapelle')).toBeInTheDocument();
    expect(
      screen.getByAltText(
        'Château de Castelnaud dominant le village et la vallée de la Dordogne, dans le Périgord Noir'
      )
    ).toHaveAttribute('src', IMAGE_MANIFEST.sarlatPerigordNoirHero.src);
    expect(IMAGE_MANIFEST.sarlatPerigordNoirHero).toMatchObject({ width: 750, height: 578 });
    expect(
      screen.getByAltText(
        'Place de la Liberté et bâtiments historiques du centre de Sarlat-la-Canéda'
      )
    ).toHaveAttribute('src', IMAGE_MANIFEST.sarlatPlaceLiberte.src);
    expect(screen.getByText('Place de la Liberté, Sarlat-la-Canéda')).toBeInTheDocument();
    expect(document.querySelectorAll('.local-v6-stone-credit')).toHaveLength(1);
    expect(
      screen.getByRole('link', { name: 'Jean-Christophe BENOIST / Wikimedia Commons' })
    ).toHaveAttribute(
      'href',
      'https://commons.wikimedia.org/wiki/File:Sarlat_-_Place_de_la_Libert%C3%A9.jpg'
    );
    expect(screen.getByRole('link', { name: 'CC BY 3.0' })).toHaveAttribute(
      'href',
      'https://creativecommons.org/licenses/by/3.0/'
    );

    expectHeadingSequence([
      'Classement de gîtes et meublés de tourisme à Sarlat et dans le Périgord Noir',
      'Pourquoi faire classer votre meublé de tourisme ?',
      /Où intervenons-nous autour de Sarlat et dans le Périgord Noir\s*\?/,
      'Combien coûte le classement d’un meublé à Sarlat et dans le Périgord Noir ?',
      'Votre classement en trois étapes',
      'Pourquoi choisir Etoilys pour votre classement à Sarlat et dans le Périgord Noir ?',
      'Un exemple concret à Sarlat : l’effet du classement sur la taxe de séjour',
      'Après le classement, vos interlocuteurs dans le Périgord Noir',
      'Questions fréquentes sur le classement à Sarlat et dans le Périgord Noir',
      'Demandez le classement de votre meublé à Sarlat et dans le Périgord Noir',
    ]);

    const serviceArea = getSectionByHeading(/Où intervenons-nous autour de Sarlat/);
    expect(serviceArea).toHaveTextContent(
      'Etoilys intervient à Sarlat-la-Canéda et dans de nombreuses communes du Périgord Noir, notamment dans la vallée de la Dordogne et autour des principaux sites touristiques du secteur. Voici quelques communes couvertes par nos inspecteurs.'
    );
    expect(within(serviceArea).getAllByRole('listitem')).toHaveLength(
      SARLAT_PERIGORD_NOIR_SERVICE_COMMUNES.length
    );
    expect(SARLAT_PERIGORD_NOIR_SERVICE_COMMUNES).toHaveLength(18);
    SARLAT_PERIGORD_NOIR_SERVICE_COMMUNES.forEach((commune) => {
      expect(within(serviceArea).getByText(commune)).toBeInTheDocument();
    });
    expect(
      within(serviceArea).getByRole('link', { name: /Voir notre zone d’intervention en Dordogne/ })
    ).toHaveAttribute('href', '/classement-meuble-tourisme-dordogne');
  });

  it('renders the exact direct and OT partner pricing grids', () => {
    renderSarlatPerigordNoirPage();

    const pricing = getSectionByHeading(
      'Combien coûte le classement d’un meublé à Sarlat et dans le Périgord Noir ?'
    );
    expect(pricing).toHaveTextContent(
      'La visite de classement d’un premier logement coûte 200 € TTC, ou 160 € TTC si vous êtes adhérent d’un office de tourisme partenaire d’Etoilys. Des tarifs dégressifs s’appliquent lorsque vous faites classer plusieurs meublés.'
    );
    [
      'La visite et les documents de classement sont inclus, sans frais de déplacement supplémentaires.',
      'Les tarifs dégressifs dépendent du nombre de logements à classer.',
      'Le tarif applicable est confirmé avant tout engagement.',
    ].forEach((guarantee) => {
      expect(within(pricing).getByText(guarantee)).toBeInTheDocument();
    });
    expect(
      within(pricing).getByText('Votre meublé à Sarlat et dans le Périgord Noir')
    ).toBeInTheDocument();

    const groups = [...pricing.querySelectorAll('.local-v6-pricing-tier-group')];
    const rows = groups.map((group) => ({
      title: group.querySelector('h3')?.textContent,
      rows: [...group.querySelectorAll('.local-v6-pricing-tiers > div')].map((row) => [
        row.querySelector('dt')?.textContent,
        row.querySelector('dd')?.textContent,
      ]),
    }));
    expect(rows).toEqual([
      {
        title: 'Tarif direct',
        rows: [
          ['1er logement', '200 € TTC'],
          ['2e logement', '150 € TTC'],
          ['3e, 4e et 5e logement (chacun)', '120 € TTC'],
          ['À partir du 6e logement', 'Sur devis'],
        ],
      },
      {
        title: 'Tarif partenaire office de tourisme',
        rows: [
          ['1er logement', '160 € TTC'],
          ['2e logement', '120 € TTC'],
          ['3e, 4e et 5e logement (chacun)', '100 € TTC'],
          ['À partir du 6e logement', 'Sur devis'],
        ],
      },
    ]);
    expect(pricing).toHaveTextContent(
      'Réservé aux propriétaires adhérents d’un office de tourisme partenaire d’Etoilys.'
    );
    expect(pricing).not.toHaveTextContent(/Sur devis\s*(TTC|HT|€)/);
    expect(pricing).not.toHaveTextContent(/(^|\D)0\s€/);
    expect(pricing).not.toHaveTextContent(/240\s€/);
  });

  it('keeps the Sarlat pricing profile exclusive to this destination', () => {
    const configs = Object.values(V6_PAGES).filter(
      (value): value is LocalLandingPageV6Config =>
        typeof value === 'object' && value !== null && 'layoutVersion' in value
    );
    const configsUsingSarlatPricing = configs.filter((config) =>
      getConfigPricingProfileIds(config).includes('sarlat-perigord-noir')
    );

    expect(configs.length).toBeGreaterThan(10);
    expect(configsUsingSarlatPricing).toHaveLength(1);
    expect(configsUsingSarlatPricing[0]).toBe(SARLAT_PERIGORD_NOIR_LOCAL_LANDING_PAGE_V6);
    expect(SARLAT_PERIGORD_NOIR_LOCAL_LANDING_PAGE_V6.pricing.pricingProfileId).toBe(
      'sarlat-perigord-noir'
    );
  });

  it('renders the Sarlat tourist tax example without generalising it to the Périgord Noir', () => {
    renderSarlatPerigordNoirPage();

    // 4 adultes, 150 € la nuit : 5,5 % de 37,50 € par personne (plafond 5,06 € non atteint)
    // contre 1,10 € par personne en 2 étoiles. Calcul en centimes.
    const unclassifiedCents = Math.round((15000 / 4) * 0.055 * 4);
    const classifiedCents = 110 * 4;
    expect(unclassifiedCents).toBe(825);
    expect(classifiedCents).toBe(440);
    expect(unclassifiedCents - classifiedCents).toBe(385);
    expect((unclassifiedCents - classifiedCents) * 7).toBe(2695);
    expect(Math.round(((unclassifiedCents - classifiedCents) / unclassifiedCents) * 100)).toBe(47);

    const taxSection = getSectionByHeading(
      'Un exemple concret à Sarlat : l’effet du classement sur la taxe de séjour'
    );
    expect(within(taxSection).getByText('taxe de séjour')).toHaveClass('text-copper');
    expect(within(taxSection).getByText('Exemple à Sarlat en 2026')).toBeInTheDocument();
    expect(within(taxSection).getByText('Taxe de séjour pour 4 adultes')).toBeInTheDocument();
    expect(within(taxSection).getByText('Logement à 150 € la nuit')).toBeInTheDocument();
    expect(within(taxSection).getByText('8,25 € par nuit')).toBeInTheDocument();
    expect(within(taxSection).getByText('4,40 € par nuit')).toBeInTheDocument();
    expect(
      within(taxSection).getByText(
        '3,85 € de taxe de séjour en moins par nuit, soit une baisse d’environ 47 %'
      )
    ).toBeInTheDocument();
    expect(
      within(taxSection).getByText(
        'Pour quatre adultes, cela représente 26,95 € de taxe de séjour en moins sur une semaine.'
      )
    ).toBeInTheDocument();
    expect(taxSection).toHaveTextContent(
      'Tarifs officiels 2026 de Sarlat Périgord Noir Tourisme, taxe additionnelle départementale incluse.'
    );
    expect(taxSection).toHaveTextContent(
      'Cet exemple concerne Sarlat et les communes soumises au même barème. Dans les autres secteurs du Périgord Noir, les tarifs et les modalités de collecte peuvent être différents selon la collectivité compétente.'
    );
    within(taxSection)
      .getAllByRole('link', { name: 'Comparer la taxe de séjour de mon logement' })
      .forEach((link) => expect(link).toHaveAttribute('href', '/simulateur-taxe-sejour'));
    expect(
      within(taxSection).getAllByRole('link', {
        name: 'Comparer la taxe de séjour de mon logement',
      })
    ).toHaveLength(2);
  });

  it('renders local tourist tax contacts per intercommunality without unproven regulation', () => {
    renderSarlatPerigordNoirPage();

    const contacts = getSectionByHeading(
      'Après le classement, vos interlocuteurs dans le Périgord Noir'
    );
    expect(contacts).toHaveClass('bg-paper');
    expect(getSectionByHeading(/Un exemple concret à Sarlat/)).toHaveClass('bg-surface-neutral');
    expect(getSectionByHeading(/Questions fréquentes sur le classement à Sarlat/)).toHaveClass(
      'bg-surface-neutral'
    );
    expect(contacts).toHaveTextContent(
      'Dans le Périgord Noir, il dépend de la communauté de communes du logement.'
    );

    const entries = within(contacts).getAllByRole('listitem');
    expect(
      entries.map((entry) => within(entry).getByRole('heading', { level: 3 }).textContent)
    ).toEqual([
      'Sarlat et ses environs',
      'Vallée de la Vézère',
      'Domme, Castelnaud, Saint-Cyprien et Belvès',
    ]);
    expect(
      entries.map((entry) => {
        const link = within(entry).getByRole('link');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        return link.getAttribute('href');
      })
    ).toEqual([
      'https://taxe.3douest.com/sarlat.php',
      'https://taxe.3douest.com/lascauxdordogne.php',
      'https://www.perigordnoir-valleedordogne.com/espace-pro/informations-pratiques/taxes-sejour/',
    ]);

    // Chaque commune de la zone est rattachée à une seule entrée.
    SARLAT_PERIGORD_NOIR_SERVICE_COMMUNES.forEach((commune) => {
      const token = commune.replace(/^(Les|Le) /, '');
      expect(
        entries.filter((entry) => entry.textContent?.includes(token)),
        commune
      ).toHaveLength(1);
    });

    expect(document.querySelector('.local-v6-notice')).toBeNull();
    [/logements? vacants?/i, /THLV/, /TVLH/, /nouvelle taxe/i, /résidences? secondaires?/i].forEach(
      (pattern) => expect(document.body).not.toHaveTextContent(pattern)
    );
  });

  it('orders local FAQ before the shared FAQ and keeps CTA analytics', () => {
    renderSarlatPerigordNoirPage();

    const faq = getSectionByHeading(
      'Questions fréquentes sur le classement à Sarlat et dans le Périgord Noir'
    );
    const questions = within(faq)
      .getAllByRole('button')
      .map((button) => button.textContent?.trim());
    expect(questions).toEqual([
      'Dans quelles communes du Périgord Noir intervenez-vous ?',
      'Comment bénéficier du tarif partenaire office de tourisme ?',
      ...CITY_COMMON_FAQ.map((item) => item.question),
      ...COMMON_LOCAL_V6_FAQ_ITEMS.map((item) => item.question),
    ]);
    expect(new Set(questions).size).toBe(questions.length);

    fireEvent.click(
      within(faq).getByRole('button', {
        name: 'Comment bénéficier du tarif partenaire office de tourisme ?',
      })
    );
    expect(faq).toHaveTextContent(
      'Pour un premier logement, il est de 160 € TTC au lieu de 200 € TTC au tarif direct.'
    );

    const main = screen.getByRole('main');
    const conversionLinks = within(main).getAllByRole('link', { name: 'Demander mon classement' });
    expect(conversionLinks.length).toBeGreaterThanOrEqual(2);
    conversionLinks.forEach((link) => expect(link).toHaveAttribute('href', '/demande-classement'));
    const heroCta = conversionLinks[0];
    const finalCta = conversionLinks[conversionLinks.length - 1];
    if (!heroCta || !finalCta) throw new Error('Missing Sarlat conversion links');
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
    renderSarlatPerigordNoirPage();

    expect(getLocalRegistryEntry('sarlat-perigord-noir')).toMatchObject({
      kind: 'destination',
      parentId: 'dordogne',
      departmentCode: '24',
      regionId: 'nouvelle-aquitaine',
      path: SARLAT_PATH,
      status: 'published',
      displayOrder: 20,
      hubLabel: 'Sarlat et le Périgord Noir',
    });
    expect(isLocalRegistryEntryPublished('sarlat-perigord-noir')).toBe(true);
    expect(getPublishedLocalChildEntriesForDepartment('dordogne').map((child) => child.id)).toEqual(
      ['bergerac', 'sarlat-perigord-noir']
    );
    expect(getDepartmentInterventionArea('dordogne').localPages.map((page) => page.id)).toEqual([
      'bergerac',
      'sarlat-perigord-noir',
    ]);
    expect(getIndexablePaths()).toContain(SARLAT_PATH);
    expect(getPrerenderPaths()).toContain(SARLAT_PATH);

    await waitFor(() => {
      expect(document.title).toBe(
        'Classement meublé de tourisme à Sarlat et en Périgord Noir | Etoilys'
      );
    });
    expect(document.querySelector("meta[name='description']")).toHaveAttribute(
      'content',
      'Faites classer votre gîte ou meublé de tourisme à Sarlat et dans le Périgord Noir avec Etoilys. Visite officielle, tarifs dégressifs et demande en ligne.'
    );
    expect(document.querySelector("link[rel='canonical']")).toHaveAttribute(
      'href',
      'https://www.etoilys.fr/classement-meuble-tourisme-sarlat'
    );
    expect(document.querySelector("meta[name='robots']")).toHaveAttribute(
      'content',
      'index,follow,max-image-preview:large'
    );
    expect(document.querySelector("meta[property='og:image:alt']")).toHaveAttribute(
      'content',
      IMAGE_ALT_TEXT.sarlatPerigordNoirHero.fr
    );

    const visibleBreadcrumb = screen.getByRole('navigation', { name: 'Fil d’Ariane' });
    expect(within(visibleBreadcrumb).getByRole('link', { name: 'Dordogne' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-dordogne'
    );
    expect(within(visibleBreadcrumb).getByText('Sarlat et le Périgord Noir')).toHaveAttribute(
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
          name: 'Dordogne',
          item: 'https://www.etoilys.fr/classement-meuble-tourisme-dordogne',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Sarlat et le Périgord Noir',
          item: 'https://www.etoilys.fr/classement-meuble-tourisme-sarlat',
        },
      ]);
    });
  });
});
