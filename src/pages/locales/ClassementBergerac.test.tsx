import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import CityLandingPage from '../../components/local/CityLandingPage';
import { BERGERAC_CITY_LANDING_PAGE } from '../../content/cityLandingPages';

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
  });

  it('keeps the Bergerac hero with one H1 and the existing image credit', () => {
    renderBergeracPage();

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Classement de meublé de tourisme à Bergerac et dans le Bergeracois',
      })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByText('Demande en 30 secondes').length).toBeGreaterThan(0);
    expect(screen.getByText('Visite en moyenne sous deux semaines')).toBeInTheDocument();
    expect(screen.getAllByText('Aucun frais de déplacement').length).toBeGreaterThan(0);
    expect(
      screen.getByRole('link', { name: /Benjamin Smith \/ Wikimedia Commons/i })
    ).toHaveAttribute(
      'href',
      'https://commons.wikimedia.org/wiki/File:Bergerac_-_View_in_late_afternoon.jpg'
    );
    expect(screen.getByRole('link', { name: 'CC BY-SA 4.0' })).toHaveAttribute(
      'href',
      'https://creativecommons.org/licenses/by-sa/4.0/'
    );
  });

  it('renders Bergerac in the V4 section order without migrating generic city content into config', () => {
    renderBergeracPage();

    expectHeadingSequence([
      'Classement de meublé de tourisme à Bergerac et dans le Bergeracois',
      'Pourquoi classer votre meublé ?',
      'Votre classement directement dans votre logement',
      'Combien coûte le classement d’un meublé à Bergerac ?',
      'Votre classement en 3 étapes',
      'Pourquoi choisir Etoilys pour votre classement à Bergerac ?',
      'Un exemple concret à Bergerac : l’effet du classement sur la taxe de séjour',
      'Questions fréquentes sur le classement à Bergerac',
      'Vous souhaitez faire classer votre meublé à Bergerac ?',
    ]);

    expect(screen.getByRole('heading', { name: 'Fiscalité micro-BIC' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Taxe de séjour' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Gagnez en visibilité auprès des voyageurs' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /cotisations sociales/i })
    ).not.toBeInTheDocument();
  });

  it('keeps the V4 background alternation by section', () => {
    renderBergeracPage();

    expectHeadingSectionClass('Pourquoi classer votre meublé ?', 'bg-white');
    expectHeadingSectionClass('Votre classement directement dans votre logement', 'bg-primary-100');
    expectHeadingSectionClass('Combien coûte le classement d’un meublé à Bergerac ?', 'bg-white');
    expectHeadingSectionClass('Votre classement en 3 étapes', 'bg-primary-100');
    expectHeadingSectionClass(
      'Pourquoi choisir Etoilys pour votre classement à Bergerac ?',
      'bg-white'
    );
    expectHeadingSectionClass(
      'Un exemple concret à Bergerac : l’effet du classement sur la taxe de séjour',
      'bg-primary-100'
    );
    expectHeadingSectionClass('Questions fréquentes sur le classement à Bergerac', 'bg-white');
    expectHeadingSectionClass('Vous souhaitez faire classer votre meublé à Bergerac ?', /from-/);
  });

  it('keeps optional local warnings available in the V4 renderer', () => {
    render(
      <MemoryRouter>
        <CityLandingPage
          config={{
            ...BERGERAC_CITY_LANDING_PAGE,
            localWarning: {
              title: 'Règles locales à vérifier',
              intro: 'Avant publication, contrôlez les règles applicables.',
              items: ['Déclaration en mairie', 'Numéro d’enregistrement'],
              conclusion: 'Ces obligations dépendent de la commune.',
            },
          }}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Règles locales à vérifier' })).toBeInTheDocument();
    expectHeadingSequence([
      'Votre classement directement dans votre logement',
      'Règles locales à vérifier',
      'Combien coûte le classement d’un meublé à Bergerac ?',
    ]);
  });

  it('keeps Bergerac local data, tariffs, tax comparison and V4 Etoilys reasons', () => {
    renderBergeracPage();

    expect(screen.getByText('Eymet')).toBeInTheDocument();
    expect(screen.getByText('Lalinde')).toBeInTheDocument();
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
    expect(screen.getAllByText('240 € TTC').length).toBeGreaterThan(0);
    expect(screen.getByText('Adhérent à un office de tourisme partenaire')).toBeInTheDocument();
    expect(screen.getAllByText('200 € TTC').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Premier logement').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Deuxième logement').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Troisième logement et suivants').length).toBeGreaterThan(0);
    expect(screen.getAllByText('160 €').length).toBeGreaterThan(0);
    expect(screen.getAllByText('100 € par logement').length).toBeGreaterThan(0);

    expect(
      screen.getByRole('heading', { name: 'Des outils pour mieux préparer la catégorie visée' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: '100 % spécialisés dans le classement des meublés de tourisme',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Organisme accrédité Cofrac Inspection' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {
        name: 'Des outils pour atteindre plus facilement la catégorie visée',
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Une demande en 30 secondes, sans dossier complexe' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Une intervention rapide' })
    ).not.toBeInTheDocument();
  });

  it('renders expected V4 internal links without V1 public sections', () => {
    renderBergeracPage();

    const expectedLinks: Array<{ href: string; name: string | RegExp }> = [
      { href: '/classement-meuble-tourisme-dordogne', name: /interventions en Dordogne/i },
      { href: '/procedure', name: 'Découvrir la procédure complète' },
      { href: '/les-avantages-du-classement', name: /avantages du classement/i },
      { href: '/simulateur', name: 'Estimer la catégorie de mon logement' },
      { href: '/simulateur-taxe-sejour', name: 'Comparer la taxe de séjour de mon logement' },
      { href: '/faq', name: 'Consulter toutes les questions fréquentes' },
      { href: '/demande-classement', name: 'Demander mon classement' },
      { href: '/contact', name: 'Poser une question' },
    ];

    expectedLinks.forEach(({ href, name }) => {
      expect(
        screen.getAllByRole('link', { name }).some((link) => link.getAttribute('href') === href)
      ).toBe(true);
    });

    expect(document.body).not.toHaveTextContent(/Sources officielles et institutionnelles/i);
    expect(document.body).not.toHaveTextContent(/Déclaration en mairie/i);
    expect(document.body).not.toHaveTextContent(/DéclaLoc|numéro d’enregistrement/i);
    expect(document.body).not.toHaveTextContent(/150 € (?:à|et) 250 € TTC|350 €/i);
    expect(document.body).not.toHaveTextContent(/preuve locale|témoignage|partenariat local/i);
    expect(document.body).not.toHaveTextContent(/0,61 €|1,71 €/i);
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
