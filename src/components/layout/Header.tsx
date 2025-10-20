import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';

const navigation = [
  { name: 'Accueil', href: '/' },
  {
    name: 'Classement meublé',
    href: '/classement',
    submenu: [
      { name: 'Pourquoi classer', href: '/pourquoi-classer' },
      { name: 'Procédure', href: '/procedure' },
      { name: 'Simulateur', href: '/simulateur' },
      { name: 'FAQ', href: '/faq' },
    ]
  },
  { name: 'Notre équipe', href: '/equipe' },
  { name: 'Actualités', href: '/actualites' },
  { name: 'Recrutement', href: '/recrutement' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled || !isHomePage || isMobileMenuOpen
      ? 'bg-white shadow-md'
      : 'bg-white/95 backdrop-blur-sm shadow-sm'
  }`;

  const textClasses = isScrolled || !isHomePage || isMobileMenuOpen
    ? 'text-gray-900'
    : 'text-gray-900';

  return (
    <>
      <header className={headerClasses}>
        <nav className='container-adaptive py-1'>
          <div className='flex items-center justify-between'>
            <Link to='/' className='flex items-center'>
              <img
                src='/Logo complet - site web copy.svg'
                alt='Etoilys'
                className='h-20 w-auto scale-100 md:h-20'
              />
            </Link>

            <div className='hidden xl:flex items-center gap-6' ref={dropdownRef}>
              {navigation.map((item) => {
                const hasSubmenu = 'submenu' in item && item.submenu;
                const isActive = location.pathname === item.href ||
                  (hasSubmenu && item.submenu?.some(sub => location.pathname === sub.href));

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
                      className='relative'
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 ${
                          isActive
                            ? 'text-primary-300'
                            : textClasses + ' hover:text-primary-300'
                        }`}
                        aria-expanded={openDropdown === item.name}
                        aria-haspopup="true"
                      >
                        {item.name}
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                          openDropdown === item.name ? 'rotate-180' : ''
                        }`} />
                      </button>

                      {openDropdown === item.name && (
                        <div
                          className='absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50'
                          role="menu"
                        >
                          <Link
                            to={item.href}
                            className={`block px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                              location.pathname === item.href
                                ? 'text-primary-300 bg-primary-100'
                                : 'text-gray-700 hover:text-primary-300 hover:bg-gray-50'
                            }`}
                            role="menuitem"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {item.name}
                          </Link>
                          <div className='my-1 border-t border-gray-100'></div>
                          {item.submenu?.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className={`block px-4 py-2.5 text-sm transition-colors duration-200 ${
                                location.pathname === subItem.href
                                  ? 'text-primary-300 bg-primary-100'
                                  : 'text-gray-700 hover:text-primary-300 hover:bg-gray-50'
                              }`}
                              role="menuitem"
                              onClick={() => setOpenDropdown(null)}
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
                    className={`text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-primary-300'
                        : textClasses + ' hover:text-primary-300'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <Button href='/demande-classement' variant='primary'>
                Demande de classement
              </Button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`xl:hidden p-2 ${textClasses}`}
              aria-label='Toggle menu'
            >
              {isMobileMenuOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </button>
          </div>
        </nav>
      </header>

      {isMobileMenuOpen && (
        <div className='fixed inset-0 z-40 bg-white pt-20 xl:hidden overflow-y-auto'>
          <nav className='container-adaptive py-8'>
            <div className='flex flex-col gap-4'>
              {navigation.map((item) => {
                const hasSubmenu = 'submenu' in item && item.submenu;
                const isActive = location.pathname === item.href ||
                  (hasSubmenu && item.submenu?.some(sub => location.pathname === sub.href));
                const isSubmenuOpen = openMobileSubmenu === item.name;

                if (hasSubmenu) {
                  return (
                    <div key={item.name} className='flex flex-col'>
                      <button
                        onClick={() => setOpenMobileSubmenu(isSubmenuOpen ? null : item.name)}
                        className={`flex items-center justify-between text-lg font-medium transition-colors duration-200 py-2 ${
                          isActive
                            ? 'text-primary-300'
                            : 'text-gray-900 hover:text-primary-300'
                        }`}
                        aria-expanded={isSubmenuOpen}
                        aria-label={`${item.name} menu`}
                      >
                        {item.name}
                        <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${
                          isSubmenuOpen ? 'rotate-180' : ''
                        }`} />
                      </button>

                      {isSubmenuOpen && (
                        <div className='flex flex-col ml-4 mt-2 space-y-2 border-l-2 border-primary-200 pl-4'>
                          <Link
                            to={item.href}
                            className={`text-base transition-colors duration-200 py-1.5 ${
                              location.pathname === item.href
                                ? 'text-primary-300 font-medium'
                                : 'text-gray-700 hover:text-primary-300'
                            }`}
                            onClick={() => setOpenMobileSubmenu(null)}
                          >
                            Vue d'ensemble
                          </Link>
                          {item.submenu?.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className={`text-base transition-colors duration-200 py-1.5 ${
                                location.pathname === subItem.href
                                  ? 'text-primary-300 font-medium'
                                  : 'text-gray-700 hover:text-primary-300'
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
                    className={`text-lg font-medium transition-colors duration-200 py-2 ${
                      isActive
                        ? 'text-primary-300'
                        : 'text-gray-900 hover:text-primary-300'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <Button href='/demande-classement' variant='primary' className='w-full mt-4'>
                Demande de classement
              </Button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
