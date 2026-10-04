import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from '../../App';
import { IMAGE_MANIFEST } from '../../content/imageManifest';
import { CAHORS_VALLEE_LOT_SERVICE_COMMUNES } from '../../content/local/destinations/cahorsValleeLot';
import { trackCtaClick } from '../../utils/analytics';

vi.mock('../../utils/analytics', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../utils/analytics')>()),
  trackCtaClick: vi.fn(),
}));

function renderCahorsValleeLotPage() {
  window.history.pushState({}, 'Cahors et Vallée du Lot', '/classement-meuble-tourisme-cahors');
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

describe('ClassementCahorsValleeLot', () => {
  afterEach(() => {
    cleanup();
    document.head.innerHTML = '';
    document.title = '';
    vi.mocked(trackCtaClick).mockClear();
  });

  it('renders the Cahors and Vallée du Lot destination with V6 content', () => {
    renderCahorsValleeLotPage();

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Classement de meublé de tourisme à Cahors et dans la Vallée du Lot',
      })
    ).toBeInTheDocument();
    expect(screen.getByText('à Cahors et dans la Vallée du Lot')).toHaveClass('text-copper');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(document.querySelector('.local-v6-landing')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Vous souhaitez faire classer un gîte, une maison de vacances ou un appartement à Cahors ou dans la Vallée du Lot ? Etoilys réalise la visite officielle directement dans votre logement, avec une démarche simple et des tarifs clairs.'
      )
    ).toBeInTheDocument();

    expect(screen.getByText('Cahors depuis le Mont Saint-Cyr')).toBeInTheDocument();
    expect(
      screen.getByAltText('Vue panoramique de Cahors depuis le Mont Saint-Cyr')
    ).toHaveAttribute('src', IMAGE_MANIFEST.cahorsValleeLotHero.src);
    expect(screen.getByAltText('Rivière Lot à Douelle près de Cahors')).toHaveAttribute(
      'src',
      IMAGE_MANIFEST.cahorsValleeLotDouelle.src
    );
    expect(screen.getByText('Le Lot à Douelle, en aval de Cahors.')).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Velvet / Wikimedia Commons' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Arbref / Wikimedia Commons' })).toHaveAttribute(
      'href',
      'https://commons.wikimedia.org/wiki/File:Rivi%C3%A8re_Lot_%C3%A0_Douelle.jpg'
    );

    expectHeadingSequence([
      'Classement de meublé de tourisme à Cahors et dans la Vallée du Lot',
      'Pourquoi faire classer votre meublé de tourisme ?',
      /Où intervenons-nous à Cahors et dans la Vallée du Lot\s*\?/,
      'Combien coûte le classement d’un meublé à Cahors et dans la Vallée du Lot ?',
      'Votre classement en trois étapes',
      'Pourquoi choisir Etoilys pour votre classement à Cahors et dans la Vallée du Lot ?',
      'Un exemple concret à Cahors : l’effet du classement sur la taxe de séjour',
      'Questions fréquentes sur le classement à Cahors et dans la Vallée du Lot',
      'Demandez le classement de votre meublé à Cahors et dans la Vallée du Lot',
    ]);

    CAHORS_VALLEE_LOT_SERVICE_COMMUNES.forEach((commune) => {
      expect(screen.getByText(commune)).toBeInTheDocument();
    });
    expect(document.body).toHaveTextContent('Vignoble de Cahors');
    expect(document.body).toHaveTextContent('Quercy Blanc');
    expect(document.body).toHaveTextContent(
      'Nos inspecteurs interviennent à Cahors et dans la Vallée du Lot, du Vignoble de Cahors au Quercy Blanc, sans frais de déplacement. Nous couvrons notamment les communes suivantes :'
    );
    expect(screen.getByRole('link', { name: /zone d’intervention dans le Lot/i })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-lot'
    );

    expect(screen.getByText('Tarif public')).toBeInTheDocument();
    expect(document.body).toHaveTextContent(/200\s€\s*TTC/);
    expect(screen.getByText('Votre meublé à Cahors et dans la Vallée du Lot')).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/240\s€\s*TTC/);

    expect(screen.getByText('Exemple à Cahors')).toBeInTheDocument();
    expect(screen.getByText('Taxe de séjour pour 4 adultes')).toBeInTheDocument();
    expect(screen.getByText('Logement à 150 € la nuit')).toBeInTheDocument();
    expect(screen.getByText('Meublé non classé')).toBeInTheDocument();
    expect(screen.getByText('9,72 € par nuit')).toBeInTheDocument();
    expect(screen.getByText('Meublé classé 2 étoiles')).toBeInTheDocument();
    expect(screen.getByText('4,44 € par nuit')).toBeInTheDocument();
    expect(
      screen.getByText('5,28 € de taxe de séjour en moins par nuit, soit une baisse d’environ 54 %')
    ).toBeInTheDocument();
    expect(document.body).toHaveTextContent(
      'Pour les voyageurs, cela représente 36,96 € de taxe de séjour en moins sur une semaine.'
    );
    expect(document.body).toHaveTextContent(
      'Tarifs 2026 du Grand Cahors, taxes additionnelles comprises.'
    );
    expect(screen.queryByText('Montant de référence')).not.toBeInTheDocument();
    expect(
      screen.getAllByRole('link', { name: 'Comparer la taxe de séjour de mon logement' })
    ).toHaveLength(2);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Intervenez-vous aussi autour de Saint-Cirq-Lapopie, du vignoble de Cahors et du Quercy Blanc ?',
      })
    );
    expect(document.body).toHaveTextContent('Puy-l’Évêque');
    expect(document.body).toHaveTextContent('Limogne-en-Quercy');
    expect(document.body).not.toHaveTextContent(
      'Elle évite de disperser ces secteurs sur des pages locales séparées.'
    );

    const main = screen.getByRole('main');
    const conversionLinks = within(main).getAllByRole('link', { name: 'Demander mon classement' });
    expect(conversionLinks.length).toBeGreaterThanOrEqual(2);
    const heroCta = conversionLinks[0];
    const finalCta = conversionLinks[conversionLinks.length - 1];
    if (!heroCta || !finalCta) throw new Error('Missing Cahors conversion links');
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

  it('sets Cahors SEO metadata and hierarchical breadcrumb JSON-LD', async () => {
    renderCahorsValleeLotPage();

    await waitFor(() => {
      expect(document.title).toBe(
        'Classement meublé de tourisme à Cahors et dans la Vallée du Lot | Etoilys'
      );
    });

    expect(document.querySelector("meta[name='description']")).toHaveAttribute(
      'content',
      'Classement de meublé de tourisme à Cahors et dans la Vallée du Lot : visite sur place, tarifs applicables dans le Lot et demande en ligne.'
    );
    expect(document.querySelector("link[rel='canonical']")).toHaveAttribute(
      'href',
      'https://www.etoilys.fr/classement-meuble-tourisme-cahors'
    );
    expect(document.querySelector("meta[name='robots']")).toHaveAttribute(
      'content',
      'index,follow,max-image-preview:large'
    );

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
          name: 'Lot',
          item: 'https://www.etoilys.fr/classement-meuble-tourisme-lot',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Cahors et Vallée du Lot',
          item: 'https://www.etoilys.fr/classement-meuble-tourisme-cahors',
        },
      ]);
    });
  });
});
