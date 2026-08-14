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
    expect(screen.getAllByText('Demande en 30 secondes').length).toBeGreaterThan(0);
    expect(screen.getByText('Visite en moyenne sous deux semaines')).toBeInTheDocument();
    expect(screen.getAllByText('Aucun frais de déplacement').length).toBeGreaterThan(0);
    expect(
      screen.getByText(
        'Vous souhaitez faire classer un gîte, une maison de vacances ou un appartement à Bergerac ? Etoilys réalise la visite officielle directement dans votre logement, avec une démarche simple et des tarifs clairs.'
      )
    ).toBeInTheDocument();
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
    expect(screen.getByText('Eymet')).toBeInTheDocument();
    expect(screen.getByText('Lalinde')).toBeInTheDocument();

    expect(screen.getByText('Meublé non classé')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Entre le centre historique, la Dordogne et les vignobles du Bergeracois, le secteur accueille de nombreux gîtes, maisons de vacances et appartements proposés en location saisonnière. Au-delà de ses avantages fiscaux et de la visibilité qu’il peut apporter, le classement a aussi un effet concret sur la taxe de séjour payée par vos voyageurs.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'À Bergerac, un meublé non classé relève en 2026 d’un tarif proportionnel au prix de la nuitée. Un meublé classé bénéficie au contraire d’un montant fixe par personne.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('6,60 € par nuit')).toBeInTheDocument();
    expect(screen.getByText('Meublé classé 2 étoiles')).toBeInTheDocument();
    expect(screen.getByText('3,12 € par nuit')).toBeInTheDocument();
    expect(
      screen.getByText('3,48 € de taxe de séjour en moins par nuit, soit une baisse d’environ 53 %')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Pour les voyageurs, cela représente 24,36 € de taxe de séjour en moins sur une semaine.'
      )
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
    expect(screen.getAllByText('Aucun frais de déplacement').length).toBeGreaterThan(0);
    expect(
      screen.getByRole('heading', {
        name: 'Des outils pour atteindre plus facilement la catégorie visée',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Avant la visite, le simulateur Etoilys vous indique précisément les critères à compléter pour la catégorie demandée. Pendant le contrôle, l’inspecteur vous explique les éventuels points bloquants, puis son compte rendu détaille les équipements, ajustements ou justificatifs encore utiles pour atteindre le classement visé.'
      )
    ).toBeInTheDocument();
    expect(screen.queryByText('Pendant et après la visite')).toBeNull();
    expect(
      screen.getByRole('heading', {
        name: 'Une demande en 30 secondes, sans dossier complexe',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Quelques informations essentielles suffisent pour lancer votre demande. Vous n’avez aucun dossier technique à constituer ni relevé détaillé du logement à préparer : Etoilys organise la visite et prend en charge les documents et démarches administratives du classement.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'La visite est organisée en moyenne sous deux semaines et toujours sous un mois après votre demande. La date d’intervention est fixée directement avec vous selon vos disponibilités.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '100 % spécialisés dans le classement' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Consulter la portée d’accréditation Cofrac' })
    ).toHaveAttribute('href');
    expect(document.body).not.toHaveTextContent(/OT de Bergerac|Tarif préférentiel/i);
    expect(document.body).not.toHaveTextContent(
      /recommandations|conseils|accompagnement personnalisé/i
    );
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
