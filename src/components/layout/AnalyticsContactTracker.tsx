import { useEffect } from 'react';
import { trackContactClick } from '../../utils/analytics';

const ETOILYS_PHONE = '+33649551540';
const ETOILYS_EMAIL = 'contact@etoilys.fr';

function getContactMethod(href: string): 'phone' | 'email' | null {
  const normalizedHref = href.trim().toLowerCase();

  if (normalizedHref.startsWith('tel:')) {
    const phone = normalizedHref.slice(4).replace(/[\s().-]/g, '');
    return phone === ETOILYS_PHONE ? 'phone' : null;
  }

  if (normalizedHref.startsWith('mailto:')) {
    const email = normalizedHref.slice(7).split('?')[0];
    return email === ETOILYS_EMAIL ? 'email' : null;
  }

  return null;
}

export default function AnalyticsContactTracker() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest<HTMLAnchorElement>('a[href]');
      if (!link) return;

      const contactMethod = getContactMethod(link.getAttribute('href') ?? '');
      if (contactMethod) trackContactClick(contactMethod);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
