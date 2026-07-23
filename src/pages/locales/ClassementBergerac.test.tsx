import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import App from '../../App';

function renderBergeracPage() {
  window.history.pushState({}, 'Bergerac', '/classement-meuble-tourisme-bergerac');
  return render(<App />);
}

function getJsonLdScripts() {
  return [
    ...document.querySelectorAll<HTMLScriptElement>("script[type='application/ld+json']"),
  ].map((script) => JSON.parse(script.textContent ?? '{}') as Record<string, unknown>);
}

describe('ClassementBergerac', () => {
  afterEach(() => {
    cleanup();
    document.head.innerHTML = '';
    document.title = '';
  });

  it('renders the V2 Bergerac landing page with one H1 and the existing hero image credit', () => {
    renderBergeracPage();

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Classement de meublé de tourisme à Bergerac et dans le Bergeracois',
      })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByText(/intervention généralement sous deux semaines/i)).toBeInTheDocument();
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

  it('renders V2 service area, tax comparison, tariffs and FAQ', () => {
    renderBergeracPage();

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Etoilys intervient à Bergerac et dans les communes proches',
      })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Issigeac, Eymet et Lalinde/).length).toBeGreaterThan(0);

    expect(screen.getByText('Meublé non classé')).toBeInTheDocument();
    expect(screen.getByText('6,60 € par nuit')).toBeInTheDocument();
    expect(screen.getByText('Meublé classé 2 étoiles')).toBeInTheDocument();
    expect(screen.getByText('3,12 € par nuit')).toBeInTheDocument();
    expect(screen.getByText('3,48 € de moins par nuit · soit environ –53 %')).toBeInTheDocument();
    expect(
      screen.getByText('Sur 7 nuits : 24,36 € de taxe de séjour en moins')
    ).toBeInTheDocument();

    expect(screen.getByText('Tarif habituel')).toBeInTheDocument();
    expect(screen.getAllByText(/150 € (?:à|et) 250 € TTC/).length).toBeGreaterThan(0);
    expect(screen.getByText('Adhérents OT partenaires')).toBeInTheDocument();
    expect(screen.getByText('Tarif préférentiel')).toBeInTheDocument();
    expect(screen.getByText('Plusieurs meublés')).toBeInTheDocument();
    expect(screen.getByText('Tarif dégressif')).toBeInTheDocument();
    expect(screen.getAllByText(/OT de Bergerac/).length).toBeGreaterThan(0);

    expect(
      screen.getByRole('button', {
        name: 'Sous quel délai une visite peut-elle être organisée ?',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Que se passe-t-il s’il manque quelques critères après la visite ?',
      })
    ).toBeInTheDocument();
  });

  it('renders expected V2 internal links without V1 public sections', () => {
    renderBergeracPage();

    const expectedLinks: Array<{ href: string; name: string | RegExp }> = [
      { href: '/classement-meuble-tourisme-dordogne', name: /interventions en Dordogne/i },
      { href: '/procedure', name: 'Découvrir la procédure complète' },
      { href: '/les-avantages-du-classement', name: 'Comprendre les avantages du classement' },
      { href: '/simulateur', name: 'Estimer la catégorie de mon logement' },
      { href: '/simulateur-taxe-sejour', name: 'Comparer la taxe de séjour de mon logement' },
      { href: '/faq', name: 'Consulter toutes les questions fréquentes' },
      { href: '/demande-classement', name: 'Demander mon classement' },
      { href: '/demande-classement', name: 'Obtenir le tarif pour mon logement' },
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
    expect(document.body).not.toHaveTextContent(/240 €|200 € par meublé|350 €/i);
    expect(document.body).not.toHaveTextContent(/preuve locale|témoignage|partenariat local/i);
    expect(document.body).not.toHaveTextContent(/0,61 €|1,71 €/i);
  });

  it('sets SEO metadata and hierarchical breadcrumb JSON-LD', async () => {
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
          name: 'Classement en Dordogne',
          item: 'https://www.etoilys.fr/classement-meuble-tourisme-dordogne',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Bergerac',
          item: 'https://www.etoilys.fr/classement-meuble-tourisme-bergerac',
        },
      ]);
    });
  });
});
