import { useId } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Locale } from '../../i18n/locales';
import { getLocalizedPath } from '../../i18n/routeHelpers';
import { simulatorNextStepsContent } from '../../i18n/simulatorContent';
import Button from '../ui/Button';

interface SimulatorNextStepsProps {
  locale: Locale;
  currentSimulator: 'fiscal' | 'tourist-tax';
}

export default function SimulatorNextSteps({ locale, currentSimulator }: SimulatorNextStepsProps) {
  const titleId = useId();
  const contentLocale = locale === 'en' ? 'en' : 'fr';
  const content = simulatorNextStepsContent[contentLocale];
  const otherSimulatorRoute =
    currentSimulator === 'fiscal' ? 'simulateurTaxeSejour' : 'simulateurFiscalClassement';
  const otherSimulatorHref =
    getLocalizedPath(otherSimulatorRoute, contentLocale) ??
    (currentSimulator === 'fiscal' ? '/simulateur-taxe-sejour' : '/simulateur-fiscal-classement');

  return (
    <section className="simulator-next editorial-focus-inverse" aria-labelledby={titleId}>
      <div>
        <h2 id={titleId}>{content.title}</h2>
        <p>{content.description[currentSimulator]}</p>
      </div>
      <div className="simulator-next-actions">
        <Button
          href={getLocalizedPath('demandeClassement', contentLocale) ?? '/demande-classement'}
          variant="secondary"
          className="simulator-next-primary"
        >
          {content.classificationLabel}
          <ArrowUpRight size={18} aria-hidden="true" />
        </Button>
        <Button href={otherSimulatorHref} variant="primary" className="simulator-next-secondary">
          {content.otherSimulatorLabel[currentSimulator]}
          <ArrowRight size={18} aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}
