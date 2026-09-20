import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Contact from '../pages/Contact';
import DemandeClassement from '../pages/DemandeClassement';
import { COFRAC_ACCREDITATION_URL } from '../content/accreditationLinks';
import { contactPageContent } from '../content/pages/contactPageContent';
import { requestClassificationPageContent } from '../content/pages/requestClassificationPageContent';
import { formContent } from '../i18n/formContent';
import { localizedRoutes } from '../i18n/localizedRoutes';
import { expectNoA11yViolations } from './a11y';

afterEach(cleanup);

describe('public form pages', () => {
  it.each(
    (['fr', 'en', 'nl'] as const).flatMap((locale) =>
      (['contact', 'demandeClassement'] as const).map((kind) => ({ locale, kind }))
    )
  )('keeps accessible actions and legal links on $kind / $locale', async ({ kind, locale }) => {
    const { container } = render(
      <MemoryRouter initialEntries={[localizedRoutes[kind][locale]!]}>
        <main>{kind === 'contact' ? <Contact /> : <DemandeClassement />}</main>
      </MemoryRouter>
    );
    const pageContent =
      kind === 'contact' ? contactPageContent[locale] : requestClassificationPageContent[locale];
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: pageContent.hero.title })).toBeVisible();
    expect(
      screen.getByRole('heading', { level: 2, name: formContent[locale][kind].title })
    ).toBeVisible();
    expect(container.querySelectorAll('form')).toHaveLength(1);
    const phone = container.querySelector('a[href="tel:+33649551540"]');
    expect(phone).toBeVisible();
    expect(phone).toHaveAccessibleName();
    const privacy = container.querySelector(`a[href="${localizedRoutes.confidentialite[locale]}"]`);
    expect(privacy).toBeVisible();
    expect(privacy).toHaveAccessibleName();

    if (kind === 'contact') {
      expect(container.querySelector('a[href="mailto:contact@etoilys.fr"]')).toBeVisible();
      expect(container).not.toHaveTextContent('1345 route de Dautres');
      expect(container).not.toHaveTextContent('24150 Mauzac et Grand Castang');
    } else {
      if (locale === 'fr') {
        expect(screen.getByRole('link', { name: /Lire le guide/i })).toHaveAttribute(
          'href',
          '/actualites/preparer-visite-classement-meuble-tourisme'
        );
        expect(screen.getByRole('link', { name: /Lancer la simulation/i })).toHaveAttribute(
          'href',
          '/simulateur'
        );
      } else {
        expect(
          container.querySelector(
            'a[href="/actualites/preparer-visite-classement-meuble-tourisme"]'
          )
        ).not.toBeInTheDocument();
        expect(container.querySelector('a[href="/simulateur"]')).not.toBeInTheDocument();
      }
      expect(
        screen.getByRole('heading', {
          level: 3,
          name: requestClassificationPageContent[locale].reassurance.title,
        })
      ).toBeVisible();
      const proof = container.querySelector(`a[href="${COFRAC_ACCREDITATION_URL}"]`);
      expect(proof).toBeVisible();
      expect(proof).toHaveAccessibleName();
      expect(proof).toHaveAttribute('rel', expect.stringContaining('noopener'));
      expect(container).toHaveTextContent('3-2394');
      expect(container.querySelector('img[src="/Inspection_RVB.jpg"]')).toHaveAccessibleName();
    }
    await expectNoA11yViolations(container);
  });
});
