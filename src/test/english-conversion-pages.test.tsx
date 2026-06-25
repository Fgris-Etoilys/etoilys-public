import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
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
    expect(EN_MVP_PATH_SET.has(link.getAttribute('href') ?? '')).toBe(true);
  });
}

function expectEnglishMvpInternalLinksInScope(container: HTMLElement) {
  const outOfScopeHrefs = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href]'))
    .map((link) => link.getAttribute('href') ?? '')
    .map(getInternalPathname)
    .filter((pathname): pathname is string => pathname !== null)
    .filter(
      (pathname) =>
        isForbiddenEnglishMvpInternalHref(pathname) ||
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
    renderAt('/en/');

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
    expectNoHref(main, '/en/');
    expectEnglishMvpPageGovernance();
  });

  it('renders the English classification benefits page without French page copy or simulator links', () => {
    renderAt('/en/benefits-of-furnished-tourist-accommodation-classification');

    const main = screen.getByRole('main');

    expectHref(main, '/en/classification-requirements');
    expectHref(main, '/en/request-a-classification');
    expect(main.querySelector('a[href^="/simulateur"]')).toBeNull();
    expectNoHref(main, '/en/');
    expectEnglishMvpPageGovernance();
  });

  it('renders the English classification requirements page without French page copy', () => {
    renderAt('/en/classification-requirements');

    const main = screen.getByRole('main');

    expectHref(main, '/en/classification-process');
    expectHref(main, '/en/request-a-classification');
    expectNoHref(main, '/en/');
    expectEnglishMvpPageGovernance();
  });

  it('renders the English classification process page without French page copy', () => {
    renderAt('/en/classification-process');

    const main = screen.getByRole('main');

    expectHref(main, '/en/faq');
    expectHref(main, '/en/request-a-classification');
    expectNoHref(main, '/en/');
    expectEnglishMvpPageGovernance();
  });

  it('renders the English FAQ without French page copy', () => {
    renderAt('/en/faq');

    const main = screen.getByRole('main');

    expectHref(main, '/en/classification-process');
    expectHref(main, '/en/contact');
    expectHref(main, '/en/request-a-classification');
    expect(main.querySelector('a[href="/simulateur-taxe-sejour"]')).toBeNull();
    expectNoHref(main, '/en/');
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
    expectEnglishMvpPageGovernance();
  });

  it('renders the English privacy policy without French page copy', () => {
    renderAt('/en/privacy-policy');

    expect(screen.getAllByRole('button', { name: /manage cookies/i }).length).toBeGreaterThan(0);
    expectEnglishMvpPageGovernance();
  });
});
