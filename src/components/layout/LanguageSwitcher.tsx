import { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, ChevronDown } from 'lucide-react';
import { layoutContent, localeNativeNames } from '../../i18n/layoutContent';
import { SUPPORTED_LOCALES, type Locale } from '../../i18n/locales';
import { getLocaleFromPath, getLocalizedPathFromPathname } from '../../i18n/routeHelpers';

type LanguageSwitcherVariant = 'desktop' | 'mobile';

type LanguageSwitcherProps = {
  variant?: LanguageSwitcherVariant;
  className?: string;
};

type LocaleVisualConfig = {
  flagSrc: string;
};

const localeVisualConfig = {
  fr: {
    flagSrc: '/flags/fr.svg',
  },
  en: {
    flagSrc: '/flags/en.svg',
  },
} as const satisfies Record<Locale, LocaleVisualConfig>;

const joinClassNames = (...classes: Array<string | false | undefined>): string =>
  classes.filter(Boolean).join(' ');

export default function LanguageSwitcher({
  variant = 'desktop',
  className,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const activeLocale = getLocaleFromPath(location.pathname);
  const content = layoutContent[activeLocale].languageSwitcher;
  const activeLocaleName = localeNativeNames[activeLocale];
  const activeLocaleVisual = localeVisualConfig[activeLocale];
  const isMobile = variant === 'mobile';
  const rootRef = useRef<HTMLDivElement>(null);
  const dropdownId = useId();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const rootClasses = joinClassNames('relative inline-flex', isMobile && 'w-full', className);
  const triggerClasses = joinClassNames(
    'inline-flex h-10 items-center justify-center gap-2 rounded-full border border-primary-100 bg-white px-3 text-sm font-semibold text-themePrimary-1 shadow-sm transition-all duration-200 hover:border-primary-200 hover:bg-primary-100/50 hover:text-primary-500 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200',
    isMobile ? 'w-full' : 'min-w-[5.25rem]'
  );
  const dropdownClasses = joinClassNames(
    'absolute z-[90] mt-2 min-w-56 rounded-xl border border-primary-100/90 bg-white p-1.5 shadow-[0_18px_45px_rgba(1,50,176,0.14)]',
    isMobile ? 'left-0 right-0 top-full' : 'right-0 top-full'
  );
  const optionBaseClasses =
    'grid min-h-10 w-full grid-cols-[1.25rem_minmax(0,1fr)_2rem_1rem] items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200';
  const optionAvailableClasses =
    'text-themePrimary-1 hover:bg-primary-100/70 hover:text-primary-500';
  const optionActiveClasses = 'bg-primary-100/80 font-medium text-primary-500';
  const optionDisabledClasses = 'cursor-not-allowed text-gray-400 opacity-60';

  return (
    <div ref={rootRef} className={rootClasses}>
      <button
        type="button"
        className={triggerClasses}
        aria-label={`${content.ariaLabel}: ${activeLocaleName}`}
        aria-expanded={isOpen}
        aria-controls={isOpen ? dropdownId : undefined}
        onClick={() => setIsOpen((current) => !current)}
      >
        <img
          src={activeLocaleVisual.flagSrc}
          alt=""
          aria-hidden="true"
          width={24}
          height={18}
          className="h-4 w-5 rounded-[3px] object-cover shadow-[0_0_0_1px_rgba(215,222,234,0.9)]"
        />
        <span className="leading-none">{content.shortLabels[activeLocale]}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul id={dropdownId} className={dropdownClasses}>
          {SUPPORTED_LOCALES.map((locale: Locale) => {
            const isActive = locale === activeLocale;
            const localizedPath = getLocalizedPathFromPathname(location.pathname, locale);
            const localeName = localeNativeNames[locale];
            const shortLabel = content.shortLabels[locale];
            const visualConfig = localeVisualConfig[locale];

            const optionContent = (
              <>
                <img
                  src={visualConfig.flagSrc}
                  alt=""
                  aria-hidden="true"
                  width={24}
                  height={18}
                  className="block h-4 w-5 rounded-[3px] object-cover shadow-[0_0_0_1px_rgba(215,222,234,0.9)]"
                />
                <span className="min-w-0 leading-none">{localeName}</span>
                <span className="justify-self-end text-xs font-semibold uppercase leading-none text-textLight">
                  {shortLabel}
                </span>
                <Check
                  className={joinClassNames(
                    'h-4 w-4 justify-self-end',
                    isActive ? 'opacity-100' : 'opacity-0'
                  )}
                  aria-hidden="true"
                />
              </>
            );

            if (isActive) {
              return (
                <li key={locale}>
                  <button
                    type="button"
                    className={joinClassNames(optionBaseClasses, optionActiveClasses)}
                    aria-current="true"
                    aria-label={`${content.activeLabel} ${localeName}`}
                    lang={locale}
                    onClick={() => setIsOpen(false)}
                  >
                    {optionContent}
                  </button>
                </li>
              );
            }

            if (localizedPath === null) {
              return (
                <li key={locale}>
                  <button
                    type="button"
                    className={joinClassNames(optionBaseClasses, optionDisabledClasses)}
                    aria-disabled="true"
                    aria-label={`${content.unavailableLabel} ${localeName}`}
                    disabled
                    lang={locale}
                  >
                    {optionContent}
                  </button>
                </li>
              );
            }

            return (
              <li key={locale}>
                <Link
                  to={localizedPath}
                  className={joinClassNames(optionBaseClasses, optionAvailableClasses)}
                  aria-label={`${content.switchLabel} ${localeName}`}
                  hrefLang={locale}
                  lang={locale}
                  onClick={() => setIsOpen(false)}
                >
                  {optionContent}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
