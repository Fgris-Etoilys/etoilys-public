import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import App from '../App';
import {
  EN_MVP_PATHS,
  EN_MVP_PATH_SET,
  isForbiddenEnglishMvpInternalHref,
} from './i18nMvpTestData';

const renderAt = (path: string) => {
  window.history.pushState({}, 'Test page', path);
  return render(<App />);
};

const ENGLISH_ARTICLE_PATH = '/en/articles/prepare-holiday-rental-star-rating-inspection';

function expectRenderedEnglishPage() {
  const heading = screen.getByRole('heading', { level: 1 });
  expect(heading).not.toHaveTextContent(/page non trouv/i);
}

function expectNoObviousFrenchContent(container: HTMLElement) {
  expect(container).not.toHaveTextContent(/coordonnées|siège social|réponse rapide/i);
  expect(container).not.toHaveTextContent(/demande de classement|politique de confidentialité/i);
  expect(container).not.toHaveTextContent(/dernière mise à jour|données personnelles/i);
  expect(container).not.toHaveTextContent(/nous contacter|demander votre classement/i);
  expect(container).not.toHaveTextContent(/prérequis|procédure|questions fréquentes/i);
  expect(container).not.toHaveTextContent(/source officielle|voir notre page dédiée/i);
}

function getInternalPathname(href: string): string | null {
  if (!href.startsWith('/')) {
    return null;
  }

  return href.split(/[?#]/)[0] ?? href;
}

function expectHref(container: HTMLElement, href: string) {
  expect(container.querySelector(`a[href="${href}"]`)).not.toBeNull();
}

function expectNoHref(container: HTMLElement, href: string) {
  expect(container.querySelector(`a[href="${href}"]`)).toBeNull();
}

function expectMainInternalEnglishLinksReadyOnly() {
  const main = screen.getByRole('main');
  const links = Array.from(main.querySelectorAll('a[href^="/en/"]'));

  links.forEach((link) => {
    expect(EN_MVP_PATH_SET.has(getInternalPathname(link.getAttribute('href') ?? '') ?? '')).toBe(
      true
    );
  });
}

function expectEnglishMvpInternalLinksInScope(container: HTMLElement) {
  const allowedInternalHrefs =
    window.location.pathname === ENGLISH_ARTICLE_PATH
      ? new Set(['/simulateur'])
      : new Set<string>();
  const outOfScopeHrefs = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href]'))
    .map((link) => link.getAttribute('href') ?? '')
    .map(getInternalPathname)
    .filter((pathname): pathname is string => pathname !== null)
    .filter(
      (pathname) =>
        (isForbiddenEnglishMvpInternalHref(pathname) && !allowedInternalHrefs.has(pathname)) ||
        (pathname.startsWith('/en/') && !EN_MVP_PATH_SET.has(pathname))
    );

  expect(outOfScopeHrefs).toEqual([]);
}

function expectEnglishMvpPageGovernance() {
  const main = screen.getByRole('main');

  expectRenderedEnglishPage();
  expectNoObviousFrenchContent(main);
  expectMainInternalEnglishLinksReadyOnly();
  expectEnglishMvpInternalLinksInScope(document.body);
}

describe('English conversion pages', () => {
  afterEach(() => {
    cleanup();
  });

  it.each(EN_MVP_PATHS)('keeps rendered English MVP route links in scope for %s', (pathname) => {
    renderAt(pathname);

    expectEnglishMvpInternalLinksInScope(document.body);
  });

  it('renders the English home page without French news content', () => {
    renderAt('/en');

    const main = screen.getByRole('main');

    [
      '/en/furnished-tourist-accommodation-classification',
      '/en/benefits-of-furnished-tourist-accommodation-classification',
      '/en/classification-requirements',
      '/en/classification-process',
      '/en/faq',
      '/en/request-a-classification',
    ].forEach((href) => expectHref(main, href));
    expectNoHref(main, '/actualites');
    expect(main.querySelector('a[href^="/actualites/"]')).toBeNull();
    expect(main).not.toHaveTextContent(/nos derni/i);
    expect(main).not.toHaveTextContent(/actualit/i);
    expectEnglishMvpPageGovernance();
  });

  it('renders the English classification page without French page copy', () => {
    renderAt('/en/furnished-tourist-accommodation-classification');

    const main = screen.getByRole('main');

    expectHref(main, '/en/classification-requirements');
    expectHref(main, '/en/request-a-classification');
    expectHref(main, '/en/benefits-of-furnished-tourist-accommodation-classification');
    expectNoHref(main, '/en');
    expectEnglishMvpPageGovernance();
  });

  it('renders the English classification benefits page without French page copy or simulator links', () => {
    renderAt('/en/benefits-of-furnished-tourist-accommodation-classification');

    const main = screen.getByRole('main');

    expectHref(main, '/en/classification-requirements');
    expectHref(main, '/en/request-a-classification');
    expect(main.querySelector('a[href^="/simulateur"]')).toBeNull();
    expectNoHref(main, '/en');
    expectEnglishMvpPageGovernance();
  });

  it('renders the English classification requirements page without French page copy', () => {
    renderAt('/en/classification-requirements');

    const main = screen.getByRole('main');

    expectHref(main, '/en/classification-process');
    expectHref(main, '/en/request-a-classification');
    expectNoHref(main, '/en');
    expectEnglishMvpPageGovernance();
  });

  it('renders the English classification process page without French page copy', () => {
    renderAt('/en/classification-process');

    const main = screen.getByRole('main');

    expectHref(main, '/en/faq');
    expectHref(main, '/en/request-a-classification');
    expectNoHref(main, '/en');
    expectEnglishMvpPageGovernance();
  });

  it('renders the English FAQ without French page copy', () => {
    renderAt('/en/faq');

    const main = screen.getByRole('main');

    expectHref(main, '/en/classification-process');
    expectHref(main, '/en/contact');
    expectHref(main, '/en/request-a-classification');
    expect(main.querySelector('a[href="/simulateur-taxe-sejour"]')).toBeNull();
    expectNoHref(main, '/en');
    expectEnglishMvpPageGovernance();
  });

  it('renders the English contact page without French page copy', () => {
    renderAt('/en/contact');

    const main = screen.getByRole('main');

    expectHref(main, '/en/privacy-policy');
    expectEnglishMvpPageGovernance();
  });

  it('renders the English classification request page without French page copy', () => {
    renderAt('/en/request-a-classification');

    const main = screen.getByRole('main');

    expectHref(main, '/en/privacy-policy');
    expectHref(main, ENGLISH_ARTICLE_PATH);
    expectEnglishMvpPageGovernance();
  });

  it('renders the English privacy policy without French page copy', () => {
    renderAt('/en/privacy-policy');

    expect(screen.getAllByRole('button', { name: /manage cookies/i }).length).toBeGreaterThan(0);
    expectEnglishMvpPageGovernance();
  });

  it('renders the complete English inspection-preparation article without French shell copy', () => {
    renderAt(ENGLISH_ARTICLE_PATH);

    const main = screen.getByRole('main');
    const article = screen.getByRole('article', {
      name: 'How to prepare your holiday rental for its star-rating inspection',
    });

    expect(within(article).getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(within(article).getByRole('link', { name: 'Back to home' })).toHaveAttribute(
      'href',
      '/en'
    );
    expect(within(article).getByText('Practical guides')).toBeInTheDocument();
    expect(within(article).getByText('Published on 19 July 2026')).toBeInTheDocument();
    expect(within(article).getByText(/\d+ min read/)).toBeInTheDocument();
    expect(
      within(article).getAllByRole('navigation', { name: 'Article table of contents' })
    ).toHaveLength(2);

    const sectionIds = [
      'understanding-the-criteria-for-your-star-rating',
      'equipment-and-guest-capacity',
      'guest-information-and-documents',
      'presenting-the-property-as-rented',
      'pre-inspection-checklist',
      'additional-evidence-after-inspection',
    ];
    sectionIds.forEach((id) => expect(document.getElementById(id)?.tagName).toBe('H2'));

    const takeaways = within(article)
      .getByRole('heading', { level: 2, name: 'Key takeaways' })
      .closest('section');
    expect(within(takeaways as HTMLElement).getAllByRole('listitem')).toHaveLength(3);
    expect(
      within(screen.getByTestId('criterion-63-tableware')).getAllByRole('listitem')
    ).toHaveLength(11);
    expect(
      within(screen.getByTestId('criterion-65-equipment-groups')).getAllByRole('listitem')
    ).toHaveLength(3);
    expect(
      within(screen.getByTestId('pre-inspection-checklist')).getAllByRole('listitem')
    ).toHaveLength(12);
    expect(article.querySelectorAll('blockquote')).toHaveLength(2);

    expect(
      within(article).getByRole('table', { name: 'Examples of criteria by requested star rating' })
    ).toBeInTheDocument();
    const servicesTable = within(article).getByRole('table', {
      name: 'Guest services that must be verifiable in writing',
    });
    expect(within(servicesTable).getAllByRole('row')).toHaveLength(5);

    const sources = within(article)
      .getByRole('heading', { level: 2, name: 'Official sources' })
      .closest('section');
    expect(within(sources as HTMLElement).getAllByRole('listitem')).toHaveLength(4);
    expect(within(article).getAllByRole('link', { name: /simulator \(in French\)/i })).toHaveLength(
      2
    );
    expect(
      within(article).getByRole('link', { name: 'read about the classification process' })
    ).toHaveAttribute('href', '/en/classification-process');
    expect(
      within(article).queryByRole('heading', { name: 'À lire aussi' })
    ).not.toBeInTheDocument();
    expect(main).not.toHaveTextContent(
      /Retour aux actualités|À retenir|Sources officielles|Publié le|Dans cet article/
    );
    expectEnglishMvpPageGovernance();

    fireEvent.click(
      screen.getAllByRole('button', { name: /^Language selector/i })[0] as HTMLElement
    );
    expect(screen.getByRole('button', { name: /unavailable in Nederlands/i })).toBeDisabled();
    expect(screen.queryByRole('link', { name: /switch to Nederlands/i })).not.toBeInTheDocument();
  });
});
