import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-grow pt-16'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
