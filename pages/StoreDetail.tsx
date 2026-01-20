
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../AppContext';
import { STORES, PRODUCTS } from '../data';
import ProductCard from '../components/ProductCard';

const StoreDetail: React.FC = () => {
  const { id } = useParams();
  const { lang } = useApp();
  
  const store = STORES.find(s => s.id === id);
  const products = PRODUCTS.filter(p => p.storeId === id);

  if (!store) return <div className="pt-40 text-center">Store not found</div>;

  return (
    <div className="pt-24 pb-20">
      <div className="relative h-[350px] mb-16">
        <img src={store.image} className="w-full h-full object-cover" alt={store.nameEn} />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
          <Link to="/stores" className="mb-6 opacity-70 hover:opacity-100 flex items-center gap-2">
            ← {lang === 'en' ? 'Back to Stores' : 'العودة للمحلات'}
          </Link>
          <h1 className="text-6xl font-black mb-4">{lang === 'en' ? store.nameEn : store.nameAr}</h1>
          <p className="text-xl opacity-80">{products.length} {lang === 'en' ? 'Authentic Products' : 'منتجات أصلية'}</p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreDetail;
