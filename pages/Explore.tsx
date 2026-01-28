import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../AppContext';
import { UI_STRINGS } from '../translations';
import { PRODUCTS, STORES } from '../data';
import ProductCard from '../components/ProductCard';
import { useLocation } from 'react-router-dom';

const Explore: React.FC = () => {
  const { lang } = useApp();
  const { search } = useLocation();
  const t = (key: string) => UI_STRINGS[key]?.[lang] || key;

  const [storeFilter, setStoreFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    const params = new URLSearchParams(search);
    const category = params.get('category');
    const store = params.get('store');
    
    if (category) setCategoryFilter(category);
    if (store) setStoreFilter(store);
  }, [search]);

  useEffect(() => {
    document.title = lang === 'en' ? 'Zari Perfumes | Explore' : 'عطور زاري | استكشف';
  }, [lang]);

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter(p => {
      const storeMatch = storeFilter === 'all' || p.storeId === storeFilter;
      const catMatch = categoryFilter === 'all' || p.category === categoryFilter;
      return storeMatch && catMatch;
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else {
      result.sort((a, b) => (lang === 'en' ? a.nameEn : a.nameAr).localeCompare(lang === 'en' ? b.nameEn : b.nameAr));
    }

    return result;
  }, [storeFilter, categoryFilter, sortBy, lang]);

  return (
    <div className="pt-[64px] pb-20">
      {/* Banner */}
      <div className="relative h-[300px] mb-12 flex items-center justify-center">
        <img src="images/explore.jpg" className="absolute inset-0 w-full h-full object-cover" alt="Explore" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative text-center text-white px-4">
          <h1 className="text-6xl font-black mb-2">{t('explore')}</h1>
          <p className="text-xl opacity-80 capitalize">
            {storeFilter === 'all' && categoryFilter === 'all' ? (
              t('allProducts')
            ) : (
              <>
                {storeFilter !== 'all' ? (STORES.find(s => s.id === storeFilter)?.[lang === 'en' ? 'nameEn' : 'nameAr']) : ''}
                {storeFilter !== 'all' && categoryFilter !== 'all' ? ' | ' : ''}
                {categoryFilter !== 'all' ? (lang === 'en' ? categoryFilter : (categoryFilter.toLowerCase() === 'perfume' ? 'عطر' : 'عود')) : ''}
              </>
            )}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Filter Bar */}
        <div className="bg-white p-6 rounded-[28px] shadow-lg mb-12 flex flex-col lg:flex-row items-center justify-between gap-6 border border-purple-50">
          <div className="flex items-center gap-4 w-full lg:w-auto">
             <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
             </div>
             <span className="font-bold text-lg">{t('filter')}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full flex-grow">
            <select 
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
              className="bg-purple-50 p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-purple-600 font-medium"
            >
              <option value="all">{lang === 'en' ? 'All Stores' : 'جميع المتاجر'}</option>
              {STORES.map(s => (
                <option key={s.id} value={s.id}>{lang === 'en' ? s.nameEn : s.nameAr}</option>
              ))}
            </select>

            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-purple-50 p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-purple-600 font-medium"
            >
              <option value="all">{t('allCategories')}</option>
              {['Oud', 'Perfume', 'Musk', 'Oil', 'Lotion', 'Dukhoon'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-purple-50 p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-purple-600 font-medium"
            >
              <option value="name">{t('name')}</option>
              <option value="price-asc">{t('priceLowHigh')}</option>
              <option value="price-desc">{t('priceHighLow')}</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            {(storeFilter !== 'all' || categoryFilter !== 'all') && (
              <button
                onClick={() => {
                  setStoreFilter('all');
                  setCategoryFilter('all');
                }}
                className="text-sm font-black text-red-500 hover:text-red-700 transition-colors uppercase tracking-tighter"
              >
                {lang === 'en' ? 'Reset' : 'إعادة تعيين'}
              </button>
            )}
            <div className="text-purple-600 font-bold whitespace-nowrap">
              {filteredProducts.length} {t('products')}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              {lang === 'en' ? 'No products found' : 'لم يتم العثور على منتجات'}
            </h3>
            <p className="text-gray-500">
              {lang === 'en' ? 'Try adjusting your filters or search criteria.' : 'حاول تعديل الفلاتر أو معايير البحث.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;