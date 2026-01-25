import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../AppContext';
import { UI_STRINGS } from '../translations';
import { PRODUCTS } from '../data';
import logoImg from '../logo.png';

const LOGO_URL = logoImg;

const Header: React.FC = () => {
  const { lang, setLang, cart, wishlist, isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isSolid ? 'bg-white shadow-xl py-3 border-b border-gray-100' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className={`transition-all duration-500 overflow-hidden ${isSolid ? 'w-10 h-10' : 'w-12 h-12'}`}>
            <img src={LOGO_URL} alt="Zari Logo" className="w-full h-full object-contain" />
          </div>
          <span className={`text-3xl font-black tracking-tighter transition-colors duration-500 ${isSolid ? 'text-purple-600' : 'text-white'}`}>{lang === 'en' ? 'Zari' : 'زري'}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`relative font-black text-sm uppercase tracking-widest transition-all duration-500 hover:scale-110 ${
                isActive(item.path) 
                  ? (isSolid ? 'text-purple-600' : 'text-white underline decoration-4 underline-offset-8') 
                  : (isSolid ? 'text-gray-900 hover:text-purple-600' : 'text-white/80 hover:text-white')
              }`}
            >
              {item.label}
              {item.count !== undefined && item.count > 0 && (
                <span className={`absolute -top-3 -right-5 text-[10px] w-5 h-5 rounded-lg flex items-center justify-center font-black shadow-lg transition-all duration-500 ${isSolid ? 'bg-purple-600 text-white' : 'bg-white text-purple-900'}`}>
                  {item.count}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-3 rounded-2xl transition-all duration-500 ${isSolid ? 'hover:bg-purple-50 text-gray-900' : 'hover:bg-white/20 text-white'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </button>

          {/* Luxurious Wishlist Link */}
          <Link 
            to="/wishlist" 
            className={`p-3 rounded-2xl relative transition-all duration-500 ${isSolid ? 'hover:bg-red-50 text-gray-900' : 'hover:bg-white/20 text-white'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            {wishlist.length > 0 && (
              <span className="absolute top-2 right-2 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </Link>
          
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className={`px-4 py-2 rounded-2xl transition-all duration-500 flex items-center gap-2 border-2 font-black text-xs tracking-widest ${isSolid ? 'border-purple-600 bg-purple-600 text-white shadow-lg' : 'border-white/50 bg-white/10 text-white backdrop-blur-md'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>{lang === 'en' ? 'العربيه' : 'EN'}</span>
          </button>
        </div>
      </div>

      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-100 animate-slide-down origin-top">
          <div className="container mx-auto p-10">
            <div className="relative max-w-4xl mx-auto">
              <input 
                type="text"
                autoFocus
                placeholder={t('searchPlaceholder')}
                className="w-full pb-6 text-4xl font-black text-purple-900 border-b-8 border-purple-50 focus:border-purple-600 outline-none transition-all placeholder:text-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                className="absolute top-2 right-0 text-gray-300 hover:text-red-500 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            {filteredProducts.length > 0 && (
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                {filteredProducts.map(p => (
                  <Link 
                    key={p.id} 
                    to={`/explore?id=${p.id}`}
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                    className="flex items-center gap-6 p-4 hover:bg-purple-50 rounded-3xl transition-all group"
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                      <img src={p.image} alt={p.nameEn} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 group-hover:text-purple-600 transition-colors">{lang === 'en' ? p.nameEn : p.nameAr}</h4>
                      <p className="text-purple-600 font-bold">{p.price} AED</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {searchQuery && filteredProducts.length === 0 && (
              <div className="py-20 text-center">
                 <p className="text-2xl font-black text-gray-300">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;