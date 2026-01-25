import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../AppContext';
import { UI_STRINGS } from '../translations';
import { PRODUCTS } from '../data';

const LOGO_URL = "images/logo.png";

const Header: React.FC = () => {
  const { lang, setLang, cart, wishlist, isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const t = (key: string) => UI_STRINGS[key]?.[lang] || key;

  const isActive = (path: string) => {
      if (path === '/' && location.pathname === '/') return true;
      return location.pathname.startsWith(path) && path !== '/';
  };

  const isHome = location.pathname === '/';
  const isSolid = !isHome || isScrolled;
  
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const navItems = [
    { label: t('home'), path: '/' },
    { label: t('explore'), path: '/explore' },
    { label: t('stores'), path: '/stores' },
    { label: t('cart'), path: '/cart', count: totalItems }
  ];

  const filteredProducts = searchQuery.trim() === '' ? [] : PRODUCTS.filter(p => 
    p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.nameAr.includes(searchQuery)
  );

  return (
    <>
      <div 
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-md transition-all duration-500 md:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className={`absolute inset-x-4 top-24 p-8 rounded-[3rem] bg-purple-950/90 border border-white/10 shadow-2xl flex flex-col gap-8 transition-all duration-500 ${isMobileMenuOpen ? 'translate-y-0 scale-100' : 'translate-y-10 scale-95'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {navItems.map((item, idx) => (
            <Link 
              key={item.path} 
              to={item.path} 
              style={{ transitionDelay: `${idx * 50}ms` }}
              className={`text-2xl font-black uppercase tracking-[0.2em] flex justify-between items-center transition-all duration-500 ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'} ${isActive(item.path) ? 'text-purple-400' : 'text-white'}`}
            >
              {item.label}
              {item.count !== undefined && item.count > 0 && (
                <span className="bg-white text-purple-900 text-[10px] px-3 py-1 rounded-full font-black min-w-[24px] text-center">{item.count}</span>
              )}
            </Link>
          ))}
          
          <div className="h-px bg-white/10 w-full my-2"></div>
          
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="w-full py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-black tracking-widest uppercase text-xs"
          >
            {lang === 'en' ? 'Switch to العربية' : 'Switch to English'}
          </button>

          <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.4em] text-center">Zari Perfumes • Genuine Luxury</p>
        </div>
      </div>

      <header className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-500 ${isSolid ? 'bg-white/90 backdrop-blur-xl shadow-xl py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 transition-transform active:scale-75 ${isSolid ? 'text-purple-900' : 'text-white'}`}
            >
              <div className="w-7 h-5 flex flex-col justify-between items-start">
                <span className={`h-1 bg-current transition-all duration-300 rounded-full ${isMobileMenuOpen ? 'w-7 rotate-45 translate-y-2' : 'w-7'}`}></span>
                <span className={`h-1 bg-current transition-all duration-300 rounded-full ${isMobileMenuOpen ? 'opacity-0' : 'w-5'}`}></span>
                <span className={`h-1 bg-current transition-all duration-300 rounded-full ${isMobileMenuOpen ? 'w-7 -rotate-45 -translate-y-2' : 'w-3'}`}></span>
              </div>
            </button>
          </div>

          <Link to="/" className="flex items-center gap-2 group">
            <div className={`transition-all duration-500 ${isSolid ? 'w-8 h-8' : 'w-10 h-10'}`}>
              <img src={LOGO_URL} alt="Zari Logo" className="w-full h-full object-contain" />
            </div>
            <span className={`text-2xl font-black tracking-tighter transition-colors ${isSolid ? 'text-purple-600' : 'text-white'}`}>{lang === 'en' ? 'Zari' : 'زري'}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navItems.map(item => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`relative font-black text-sm uppercase tracking-widest transition-all ${isActive(item.path) ? (isSolid ? 'text-purple-600' : 'text-white border-b-2 border-white') : (isSolid ? 'text-gray-900' : 'text-white/80')}`}
              >
                {item.label}
                {item.count !== undefined && item.count > 0 && (
                  <span className={`absolute -top-3 -right-4 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black ${isSolid ? 'bg-purple-600 text-white' : 'bg-white text-purple-900'}`}>
                    {item.count}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={() => setIsSearchOpen(true)} className={`p-2 ${isSolid ? 'text-gray-900' : 'text-white'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>

            <Link to="/wishlist" className={`p-2 relative ${isSolid ? 'text-gray-900' : 'text-white'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              {wishlist.length > 0 && <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />}
            </Link>

            <button 
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className={`hidden md:flex px-4 py-2 rounded-xl border-2 font-black text-xs transition-colors ${isSolid ? 'border-purple-600 bg-purple-600 text-white' : 'border-white text-white'}`}
            >
              {lang === 'en' ? 'العربيه' : 'EN'}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;