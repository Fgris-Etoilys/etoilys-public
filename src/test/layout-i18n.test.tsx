import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from '../App';
import {
  EN_MVP_PATH_SET,
  NL_MVP_PATH_SET,
  isForbiddenDutchMvpInternalHref,
  isForbiddenEnglishMvpInternalHref,
} from './i18nMvpTestData';

const renderAt = (path: string) => {
  window.history.pushState({}, 'Test page', path);
  return render(<App />);
};

const openLanguageSwitcher = (name: RegExp = /sélecteur de langue/i) => {
  const trigger = screen.getByRole('button', { name });
  fireEvent.click(trigger);
  return trigger;
};

const getLastElement = <T,>(items: T[]): T => {
  const item = items[items.length - 1];
  if (item === undefined) {
    throw new Error('Expected at least one element');
  }
  return item;
};

function getInternalPathname(href: string): string | null {
  if (!href.startsWith('/')) {
    return null;
  }

  return href.split(/[?#]/)[0] ?? href;
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

function expectDutchMvpInternalLinksInScope(container: HTMLElement) {
  const outOfScopeHrefs = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href]'))
    .map((link) => link.getAttribute('href') ?? '')
    .map(getInternalPathname)
    .filter((pathname): pathname is string => pathname !== null)
    .filter(
      (pathname) =>
        isForbiddenDutchMvpInternalHref(pathname) ||
        (pathname.startsWith('/nl/') && !NL_MVP_PATH_SET.has(pathname))
    );

  expect(outOfScopeHrefs).toEqual([]);
}

function expectSeoHeadWithoutDuplicates({
  hasBreadcrumb,
  hasGlobalStructuredData,
}: {
  hasBreadcrumb: boolean;
  hasGlobalStructuredData: boolean;
}) {
  expect(document.querySelectorAll('script#structured-data-global')).toHaveLength(
    hasGlobalStructuredData ? 1 : 0
  );
  expect(document.querySelectorAll('script#structured-data-breadcrumbs')).toHaveLength(
    hasBreadcrumb ? 1 : 0
  );
  expect(document.querySelectorAll('script#structured-data-article')).toHaveLength(0);
  expect(document.querySelectorAll('link[data-seo-alternate="true"]')).toHaveLength(4);
  expect(
    Array.from(document.querySelectorAll('link[data-seo-alternate="true"]')).map((link) =>
      link.getAttribute('hreflang')
    )
  ).toEqual(['fr', 'en', 'nl', 'x-default']);
}

describe('localized layout', () => {
  afterEach(() => {
    cleanup();
  });

  it('links from a French MVP route to its English equivalent', () => {
    renderAt('/procedure');
    openLanguageSwitcher();

    expect(screen.getByRole('link', { name: /passer en english/i })).toHaveAttribute(
      'href',
      '/en/classification-process'
    );
  });

  it('links from an English MVP route to its French equivalent', () => {
    renderAt('/en/classification-process');
    openLanguageSwitcher(/language selector/i);

    expect(screen.getByRole('link', { name: /switch to français/i })).toHaveAttribute(
      'href',
      '/procedure'
    );
  });

  it('disables unavailable language options without falling back to /en', () => {
    renderAt('/actualites');
    openLanguageSwitcher();

    const unavailableEnglishOption = screen.getByRole('button', {
      name: /version indisponible en english/i,
    });

    expect(unavailableEnglishOption).toBeDisabled();
    expect(unavailableEnglishOption).toHaveAttribute('aria-disabled', 'true');
    expect(unavailableEnglishOption).not.toHaveAttribute('href');
    expect(screen.queryByRole('link', { name: /passer en anglais/i })).not.toBeInTheDocument();
    expect(document.querySelector('a[href="/en"]')).not.toBeInTheDocument();
  });

  it('uses a compact trigger and closes the dropdown with Escape and outside clicks', () => {
    renderAt('/procedure');

    const trigger = openLanguageSwitcher();

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveTextContent('FR');
    expect(
      document.getElementById(trigger.getAttribute('aria-controls') ?? '')
    ).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: /passer en english/i })).not.toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.getByRole('link', { name: /passer en english/i })).toBeInTheDocument();

    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('link', { name: /passer en english/i })).not.toBeInTheDocument();
  });

  it('marks the active language without rendering a self-navigation link', () => {
    renderAt('/procedure');
    openLanguageSwitcher();

    const activeFrenchOption = screen.getByRole('button', { name: /langue active.*français/i });
    const languageSwitcherList = activeFrenchOption.closest('ul');

    expect(activeFrenchOption).toHaveAttribute('aria-current', 'true');
    expect(activeFrenchOption.tagName).toBe('BUTTON');
    expect(languageSwitcherList?.querySelector('a[href="/procedure"]')).not.toBeInTheDocument();
  });

  it('renders English header labels and keeps global links limited to English MVP routes', () => {
    renderAt('/en/classification-process');

    const header = screen.getByRole('banner');

    expect(within(header).getByRole('link', { name: 'Etoilys' })).toHaveAttribute('href', '/en');
    expect(within(header).queryByRole('link', { name: 'Home' })).not.toBeInTheDocument();
    const classificationMenu = within(header).getByRole('button', {
      name: /^Official classification$/,
    });
    expect(classificationMenu).toBeInTheDocument();
    fireEvent.mouseEnter(classificationMenu);
    expect(
      within(header).getByRole('menuitem', { name: /benefits of classification/i })
    ).toHaveAttribute('href', '/en/benefits-of-furnished-tourist-accommodation-classification');
    expect(within(header).getByRole('link', { name: 'Contact' })).toHaveAttribute(
      'href',
      '/en/contact'
    );
    expect(within(header).getByRole('link', { name: /request a classification/i })).toHaveAttribute(
      'href',
      '/en/request-a-classification'
    );

    expect(
      within(header).queryByRole('link', { name: /news|actualités/i })
    ).not.toBeInTheDocument();
    expect(
      within(header).queryByRole('link', { name: /recruitment|recrutement/i })
    ).not.toBeInTheDocument();
    expect(within(header).queryByRole('button', { name: /tools|outils/i })).not.toBeInTheDocument();
    expectEnglishMvpInternalLinksInScope(header);
  });

  it('renders English footer labels without non-MVP destinations', () => {
    renderAt('/en/contact');

    const footer = screen.getByRole('contentinfo');

    expect(within(footer).getByRole('link', { name: /privacy policy/i })).toHaveAttribute(
      'href',
      '/en/privacy-policy'
    );
    expect(within(footer).getByRole('link', { name: /classification process/i })).toHaveAttribute(
      'href',
      '/en/classification-process'
    );
    expect(
      within(footer).getByRole('link', { name: /benefits of classification/i })
    ).toHaveAttribute('href', '/en/benefits-of-furnished-tourist-accommodation-classification');
    expect(
      within(footer).queryByRole('link', { name: /news|actualités/i })
    ).not.toBeInTheDocument();
    expect(
      within(footer).queryByRole('link', { name: /recruitment|recrutement/i })
    ).not.toBeInTheDocument();
    expect(footer.querySelector('a[href="/simulateur"]')).not.toBeInTheDocument();
    expect(footer.querySelector('a[href="/mentions-legales"]')).not.toBeInTheDocument();
    expectEnglishMvpInternalLinksInScope(footer);
  });

  it('renders Dutch footer labels without Dutch non-MVP destinations', () => {
    renderAt('/nl/contact');

    const footer = screen.getByRole('contentinfo');

    expect(within(footer).getByRole('link', { name: /privacybeleid/i })).toHaveAttribute(
      'href',
      '/nl/privacybeleid'
    );
    expect(
      within(footer).getByRole('link', { name: /juridische informatie \(frans\)/i })
    ).toHaveAttribute('href', '/mentions-legales');
    expect(within(footer).getByRole('link', { name: /classificatieprocedure/i })).toHaveAttribute(
      'href',
      '/nl/classificatieprocedure-vakantiewoning'
    );
    expect(footer.querySelector('a[href="/nl/mentions-legales"]')).not.toBeInTheDocument();
    expectDutchMvpInternalLinksInScope(footer);
  });

  it('keeps the French header and footer destinations unchanged', () => {
    renderAt('/');

    const header = screen.getByRole('banner');
    const footer = screen.getByRole('contentinfo');

    expect(within(header).getByRole('link', { name: 'Accueil' })).toHaveAttribute('href', '/');
    expect(within(header).getByRole('button', { name: /^Le classement$/ })).toBeInTheDocument();
    expect(within(header).getByRole('button', { name: /^Outils$/ })).toBeInTheDocument();
    expect(within(header).getByRole('link', { name: 'Actualités' })).toHaveAttribute(
      'href',
      '/actualites'
    );
    expect(within(header).getByRole('link', { name: 'Recrutement' })).toHaveAttribute(
      'href',
      '/recrutement'
    );

    expect(within(footer).getByRole('link', { name: 'Zones d’intervention' })).toHaveAttribute(
      'href',
      '/zones-intervention'
    );
    expect(within(footer).getByRole('link', { name: 'Classement en Dordogne' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-dordogne'
    );
    expect(
      within(footer).getByRole('link', { name: 'Classement en Lot-et-Garonne' })
    ).toHaveAttribute('href', '/classement-meuble-tourisme-lot-et-garonne');
    expect(within(footer).getByRole('link', { name: 'Mentions légales' })).toHaveAttribute(
      'href',
      '/mentions-legales'
    );
  });

  it('keeps the mobile menu functional with the localized language switcher', () => {
    renderAt('/en/contact');

    fireEvent.click(screen.getByLabelText(/open or close menu/i));
    fireEvent.click(getLastElement(screen.getAllByRole('button', { name: /language selector/i })));

    expect(
      screen
        .getAllByRole('link', { name: /switch to français/i })
        .some((link) => link.getAttribute('href') === '/contact')
    ).toBe(true);
    expect(
      screen
        .getAllByRole('link', { name: /request a classification/i })
        .some((link) => link.getAttribute('href') === '/en/request-a-classification')
    ).toBe(true);
    expectEnglishMvpInternalLinksInScope(document.body);
  });

  it('does not duplicate JSON-LD or hreflang tags after SPA navigation between English routes', async () => {
    renderAt('/en/classification-process');

    expectSeoHeadWithoutDuplicates({ hasBreadcrumb: true, hasGlobalStructuredData: true });

    fireEvent.click(
      within(screen.getByRole('main')).getByRole('link', { name: /frequently asked questions/i })
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /faq on furnished tourist accommodation classification/i,
        })
      ).toBeInTheDocument();
    });
    expectSeoHeadWithoutDuplicates({ hasBreadcrumb: true, hasGlobalStructuredData: false });

    fireEvent.click(
      within(screen.getByRole('main')).getByRole('link', { name: /contact etoilys/i })
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: /contact etoilys/i })
      ).toBeInTheDocument();
    });
    expectSeoHeadWithoutDuplicates({ hasBreadcrumb: true, hasGlobalStructuredData: true });
  });

  it('keeps unavailable language options disabled in the mobile menu', () => {
    renderAt('/actualites');

    fireEvent.click(screen.getByLabelText(/ouvrir ou fermer le menu/i));
    fireEvent.click(
      getLastElement(screen.getAllByRole('button', { name: /sélecteur de langue/i }))
    );

    const unavailableEnglishOptions = screen.getAllByRole('button', {
      name: /version indisponible en english/i,
    });

    expect(unavailableEnglishOptions.length).toBeGreaterThanOrEqual(1);
    unavailableEnglishOptions.forEach((option) => {
      expect(option).toBeDisabled();
      expect(option).toHaveAttribute('aria-disabled', 'true');
      expect(option).not.toHaveAttribute('href');
    });
  });
});
