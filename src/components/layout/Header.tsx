import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, Star, X } from 'lucide-react';
import Button from '../ui/Button';
import LanguageSwitcher from './LanguageSwitcher';
import { layoutContent, type LayoutNavigationItem } from '../../i18n/layoutContent';
import { getLocaleFromPath } from '../../i18n/routeHelpers';

const normalizePathForComparison = (pathname: string): string =>
  pathname === '/' ? pathname : pathname.replace(/\/+$/, '') || '/';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);
  const content = layoutContent[locale].header;
  const navigation: readonly LayoutNavigationItem[] = content.navigation;
  const isHomePage =
    normalizePathForComparison(location.pathname) === normalizePathForComparison(content.homeHref);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const headerHeight = Math.ceil(headerRef.current?.getBoundingClientRect().height ?? 64);
      document.documentElement.style.setProperty('--etoilys-header-height', `${headerHeight}px`);
    };
    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateHeaderHeight);

    updateHeaderHeight();
    if (headerRef.current) {
      resizeObserver?.observe(headerRef.current);
    }
    window.addEventListener('resize', updateHeaderHeight);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateHeaderHeight);
      document.documentElement.style.removeProperty('--etoilys-header-height');
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenMobileSubmenu(null);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const headerClasses = `fixed left-0 right-0 top-0 z-[70] border-b border-primary-100/80 shadow-[0_10px_30px_rgba(1,50,176,0.08)] backdrop-blur-md transition-all duration-300 ${
    isScrolled || !isHomePage || isMobileMenuOpen ? 'bg-white/95' : 'bg-white/90'
  }`;

  const navLinkBaseClasses =
    'rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200';
  const navLinkInactiveClasses =
    'text-themePrimary-1 hover:bg-primary-100/80 hover:text-primary-500';
  const navLinkActiveClasses = 'bg-primary-100 text-primary-500 shadow-sm';
  const mobileLinkBaseClasses =
    'rounded-lg px-3 py-2 text-lg font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200';
  const mobileLinkInactiveClasses =
    'text-themePrimary-1 hover:bg-primary-100/70 hover:text-primary-500';
  const mobileLinkActiveClasses = 'bg-primary-100 text-primary-500';

  return (
    <>
      <header ref={headerRef} className={headerClasses}>
        <nav className="container-adaptive py-2">
          <div className="flex items-center justify-between">
            <Link to={content.homeHref} className="flex items-center">
              <img
                src="/Logo complet - site web copy.svg"
                alt="Etoilys"
                width={1025}
                height={576}
                loading="eager"
                decoding="async"
                className="h-14 w-auto origin-left scale-110 md:h-14 xl:h-16"
              />
            </Link>

            <div className="hidden items-center gap-2 xl:flex" ref={dropdownRef}>
              {navigation.map((item) => {
                const hasSubmenu = Boolean(item.submenu);
                const isActive =
                  location.pathname === item.href ||
                  (hasSubmenu && item.submenu?.some((sub) => location.pathname === sub.href));
                const dropdownItems =
                  hasSubmenu && item.showOverviewLink !== false
                    ? [
                        {
                          name: item.overviewLabel ?? item.name,
                          href: item.href,
                          description: item.overviewDescription,
                        },
                        ...(item.submenu ?? []),
                      ]
                    : (item.submenu ?? []);

                if (hasSubmenu) {
                  const handleMouseEnter = () => {
                    if (closeTimeoutRef.current) {
                      clearTimeout(closeTimeoutRef.current);
                      closeTimeoutRef.current = null;
                    }
                    setOpenDropdown(item.name);
                  };

                  const handleMouseLeave = () => {
                    closeTimeoutRef.current = setTimeout(() => {
                      setOpenDropdown(null);
                    }, 150);
                  };

                  return (
                    <div
                      key={item.name}
                      className="relative"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        className={`flex items-center gap-1 ${navLinkBaseClasses} ${
                          isActive ? navLinkActiveClasses : navLinkInactiveClasses
                        }`}
                        aria-expanded={openDropdown === item.name}
                        aria-haspopup="true"
                      >
                        {item.name}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            openDropdown === item.name ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {openDropdown === item.name && (
                        <div
                          className="absolute left-0 top-full z-[80] mt-3 w-72 rounded-xl border border-primary-100/90 bg-white p-2 shadow-[0_18px_45px_rgba(1,50,176,0.14)]"
                          role="menu"
                        >
                          {dropdownItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className={`block rounded-lg px-4 py-3 transition-colors duration-200 ${
                                location.pathname === subItem.href
                                  ? 'bg-primary-100 text-primary-500'
                                  : 'text-themePrimary-1 hover:bg-primary-100/70 hover:text-primary-500'
                              }`}
                              role="menuitem"
                              onClick={() => setOpenDropdown(null)}
                            >
                              <span className="block text-sm font-medium">{subItem.name}</span>
                              {subItem.description && (
                                <span className="mt-0.5 block text-xs leading-5 text-textLight">
                                  {subItem.description}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${navLinkBaseClasses} ${
                      isActive ? navLinkActiveClasses : navLinkInactiveClasses
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <Button
                href={content.cta.href}
                variant="primary"
                size="sm"
                className="ml-2 gap-2 border border-primary-200 px-4 py-2.5 shadow-[0_10px_24px_rgba(49,107,255,0.22)]"
              >
                <Star className="h-4 w-4" aria-hidden="true" />
                {content.cta.name}
              </Button>
              <LanguageSwitcher />
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-full p-2 text-themePrimary-1 transition-colors duration-200 hover:bg-primary-100/70 hover:text-primary-500 xl:hidden"
              aria-label={content.menuToggleLabel}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-white pt-20 xl:hidden">
          <nav className="container-adaptive py-6">
            <div className="flex flex-col gap-2">
              {navigation.map((item) => {
                const hasSubmenu = Boolean(item.submenu);
                const isActive =
                  location.pathname === item.href ||
                  (hasSubmenu && item.submenu?.some((sub) => location.pathname === sub.href));
                const isSubmenuOpen = openMobileSubmenu === item.name;
                const mobileSubmenuItems =
                  hasSubmenu && item.showOverviewLink !== false
                    ? [
                        {
                          name: item.overviewLabel ?? "Vue d'ensemble",
                          href: item.href,
                        },
                        ...(item.submenu ?? []),
                      ]
                    : (item.submenu ?? []);

                if (hasSubmenu) {
                  return (
                    <div key={item.name} className="flex flex-col">
                      <button
                        onClick={() => setOpenMobileSubmenu(isSubmenuOpen ? null : item.name)}
                        className={`flex items-center justify-between ${mobileLinkBaseClasses} ${
                          isActive ? mobileLinkActiveClasses : mobileLinkInactiveClasses
                        }`}
                        aria-expanded={isSubmenuOpen}
                        aria-label={`${item.name} menu`}
                      >
                        {item.name}
                        <ChevronDown
                          className={`h-5 w-5 transition-transform duration-200 ${
                            isSubmenuOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isSubmenuOpen && (
                        <div className="ml-3 mt-2 flex flex-col gap-1 border-l border-primary-200 pl-3">
                          {mobileSubmenuItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className={`rounded-lg px-3 py-2 text-base transition-colors duration-200 ${
                                location.pathname === subItem.href
                                  ? 'bg-primary-100 font-medium text-primary-500'
                                  : 'text-themePrimary-1 hover:bg-primary-100/70 hover:text-primary-500'
                              }`}
                              onClick={() => setOpenMobileSubmenu(null)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${mobileLinkBaseClasses} ${
                      isActive ? mobileLinkActiveClasses : mobileLinkInactiveClasses
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <LanguageSwitcher variant="mobile" className="mt-4" />
              <Button
                href={content.cta.href}
                variant="primary"
                className="mt-4 w-full gap-2 border border-primary-200 shadow-[0_10px_24px_rgba(49,107,255,0.2)]"
              >
                <Star className="h-4 w-4" aria-hidden="true" />
                {content.cta.name}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
