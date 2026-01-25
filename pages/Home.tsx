import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../AppContext';
import { UI_STRINGS } from '../translations';
import { STORES, PRODUCTS, WORKSHOP } from '../data';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
  const { lang } = useApp();
  const t = (key: string) => UI_STRINGS[key]?.[lang] || key;

  const featuredStores = STORES.slice(0, 6);
  const featuredProducts = PRODUCTS.sort(() => 0.5 - Math.random()).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <img 
          src="images/hero.jpg" 
          className="absolute inset-0 w-full h-full object-cover" 
          alt="Banner" 
        />
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl animate-fade-in">
          <p className="text-sm md:text-base uppercase tracking-widest mb-4 opacity-90">✨ {lang === 'en' ? 'Ajman, UAE' : 'عجمان، الإمارات العربية المتحدة'} ✨</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">{t('welcome')}</h1>
          <p className="text-lg md:text-xl opacity-80 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('discoverCollection')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/explore" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-full font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2">
              {t('exploreNow')} <span>→</span>
            </Link>
            <Link to="/stores" className="w-full sm:w-auto bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-10 py-4 rounded-full font-bold transition-all border border-white/30">
              {t('ourStores')}
            </Link>
          </div>

          <div className="mt-20 flex justify-center gap-12 md:gap-20">
            <div className="text-center">
              <span className="block text-4xl font-bold">6+</span>
              <span className="text-xs uppercase opacity-70 tracking-widest">{t('stores')}</span>
            </div>
            <div className="text-center">
              <span className="block text-4xl font-bold">35+</span>
              <span className="text-xs uppercase opacity-70 tracking-widest">{t('products')}</span>
            </div>
            <div className="text-center">
              <span className="block text-4xl font-bold">100%</span>
              <span className="text-xs uppercase opacity-70 tracking-widest">{t('authentic')}</span>
            </div>
          </div>
        </div>

        {/* Floating Mouse Icon */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-purple-50">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-[32px] bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <div>
              <h3 className="text-xl font-bold">{t('fastDelivery')}</h3>
              <p className="text-gray-500">{t('deliveryEmirates')}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-[32px] bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <div>
              <h3 className="text-xl font-bold">{t('authenticProducts')}</h3>
              <p className="text-gray-500">{t('qualityGuaranteed')}</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-[32px] bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <div>
              <h3 className="text-xl font-bold">{t('localPickup')}</h3>
              <p className="text-gray-500">{t('pickupAjman')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 w-full">
              <div className="relative">
                <img 
                  src="images/story.jpg" 
                  className="w-full h-[600px] object-cover rounded-[40px] shadow-2xl" 
                  alt="Zari Perfumes Story" 
                />
                <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-purple-600 rounded-[32px] hidden lg:flex items-center justify-center text-white p-8 shadow-xl">
                  <p className="text-center font-black leading-tight text-lg">{t('finestIngredients')}</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 w-full space-y-8">
              <span className="text-purple-600 font-black uppercase tracking-widest text-sm">{t('ourLegacy')}</span>
              <h2 className="text-5xl font-black text-gray-900 leading-tight">
                {t('authenticityEveryDrop')}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t('brandStory')}
              </p>
              <div className="pt-4 flex gap-8">
                <div>
                  <p className="text-3xl font-black text-purple-600">{t('ajmanCity')}</p>
                  <p className="text-gray-400 font-bold uppercase tracking-tighter text-xs">{t('origin')}</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-purple-600">{t('globalReach')}</p>
                  <p className="text-gray-400 font-bold uppercase tracking-tighter text-xs">{t('reach')}</p>
                </div>
              </div>
              <Link to="/explore" className="inline-block bg-purple-900 text-white px-10 py-4 rounded-full font-black hover:bg-purple-800 transition-all shadow-lg hover:-translate-y-1">
                {t('learnMore')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop */}
      <section className="py-24 bg-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-16">{t('workshops')}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center bg-white rounded-[40px] overflow-hidden shadow-xl">
            <div className="h-[400px] lg:h-full">
              <img src={WORKSHOP.image} className="w-full h-full object-cover" alt="Workshop" />
            </div>
            <div className="p-10 lg:p-20 space-y-6">
              <span className="text-purple-600 font-black uppercase tracking-widest text-sm">{lang === 'en' ? WORKSHOP.nameEn : WORKSHOP.nameAr}</span>
              <h3 className="text-4xl font-black text-gray-900 leading-tight">
                {lang === 'en' ? WORKSHOP.date : WORKSHOP.dateAr}
              </h3>
              <p className="text-xl text-purple-700 font-black">{lang === 'en' ? WORKSHOP.time : WORKSHOP.timeAr}</p>
              <p className="text-gray-600 text-lg leading-relaxed">
                {lang === 'en' ? WORKSHOP.detailsEn : WORKSHOP.detailsAr}
              </p>
              <a 
                href={WORKSHOP.link.startsWith('http') ? WORKSHOP.link : `https://${WORKSHOP.link}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <button className="bg-purple-600 text-white px-10 py-4 rounded-full font-black hover:bg-purple-700 transition-all shadow-lg">
                  {t('registerNow')}
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stores */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-purple-600 font-black mb-2 uppercase tracking-widest text-sm">{t('discover')}</p>
            <h2 className="text-5xl font-black mb-4">{t('featuredStores')}</h2>
            <p className="text-gray-500 text-lg">{t('shopFinest')}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredStores.map(store => (
              <Link key={store.id} to={`/stores/${store.id}`} className="group relative block rounded-[32px] overflow-hidden bg-white shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
                <div className="aspect-[4/3] relative">
                  <img src={store.image} alt={store.nameEn} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="flex items-center gap-2 mb-2 text-white/80 text-sm">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg>
                      <span className="font-bold">{store.productCount} {t('products')}</span>
                    </div>
                    <h3 className="text-2xl font-black">{lang === 'en' ? store.nameEn : store.nameAr}</h3>
                    <p className="text-white/60 mt-2 flex items-center gap-2 font-bold group-hover:text-white transition-colors">
                      {t('browseStore')}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link to="/stores" className="inline-flex items-center gap-2 bg-purple-600 text-white px-12 py-5 rounded-full font-black text-lg hover:bg-purple-700 transition-all shadow-xl active:scale-95">
              {t('viewAll')} →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-purple-600 font-black mb-2 uppercase tracking-widest text-sm">{t('featured')}</p>
            <h2 className="text-5xl font-black">{t('products')}</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link to="/explore" className="inline-block border-2 border-purple-600 text-purple-600 px-12 py-5 rounded-full font-black text-lg hover:bg-purple-600 hover:text-white transition-all shadow-md active:scale-95">
              {t('allProducts')} →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;