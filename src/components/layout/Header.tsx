import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Star } from 'lucide-react';
import Button from '../ui/Button';

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Classement meublé', href: '/classement' },
  { name: 'Pourquoi classer', href: '/pourquoi-classer' },
  { name: 'Procédure', href: '/procedure' },
  { name: 'Simulateur', href: '/simulateur' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Notre équipe', href: '/equipe' },
  { name: 'Actualités', href: '/actualites' },
  { name: 'Recrutement', href: '/recrutement' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled || !isHomePage || isMobileMenuOpen
      ? 'bg-white shadow-md'
      : 'bg-transparent'
  }`;

  const textClasses = isScrolled || !isHomePage || isMobileMenuOpen
    ? 'text-gray-900'
    : 'text-white';

  return (
    <>
      <header className={headerClasses}>
        <nav className='container-adaptive py-4'>
          <div className='flex items-center justify-between'>
            <Link to='/' className='flex items-center gap-2'>
              <Star className={`h-8 w-8 ${textClasses} fill-current`} />
              <span className={`text-2xl font-playfair font-bold ${textClasses}`}>
                Etoilys
              </span>
            </Link>

            <div className='hidden lg:flex items-center gap-8'>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.href
                      ? 'text-primary-300'
                      : textClasses + ' hover:text-primary-300'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Button href='/demande-classement' variant='primary'>
                Demande de classement
              </Button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 ${textClasses}`}
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
        <div className='fixed inset-0 z-40 bg-white pt-20 lg:hidden overflow-y-auto'>
          <nav className='container-adaptive py-8'>
            <div className='flex flex-col gap-6'>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-lg font-medium transition-colors duration-200 ${
                    location.pathname === item.href
                      ? 'text-primary-300'
                      : 'text-gray-900 hover:text-primary-300'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
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
