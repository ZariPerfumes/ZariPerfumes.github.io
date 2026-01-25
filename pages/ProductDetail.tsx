import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PRODUCTS } from '../data';
import { useApp } from '../AppContext';
import ProductCard from '../components/ProductCard';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, addToCart, wishlist, toggleWishlist, cart, updateQuantity, removeFromCart } = useApp();
  
  const [activeQuantity, setActiveQuantity] = useState(1);

  // Find product with loose comparison to handle string vs number IDs
  const product = PRODUCTS.find(p => p.id == id);
  
  // Cart/Wishlist logic
  const cartItem = cart.find(item => item.id === product?.id);
  const isWishlisted = wishlist.some(item => item.id === product?.id);

  // Filter 4 recommended products from the same category, excluding the current one
  const recommended = PRODUCTS
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveQuantity(1);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h2 className="text-4xl font-black text-purple-900 mb-4">
            {lang === 'en' ? 'Scent Not Found' : 'العطر غير موجود'}
          </h2>
          <p className="text-gray-500 mb-8 max-w-md">
            {lang === 'en' 
              ? "The fragrance you're looking for might have been moved or is currently unavailable." 
              : "ربما تم نقل العطر الذي تبحث عنه أو أنه غير متوفر حالياً."}
          </p>
          <button 
            onClick={() => navigate('/explore')} 
            className="bg-purple-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-lg"
          >
            {lang === 'en' ? 'Back to Explore' : 'العودة للاستكشاف'}
          </button>
        </div>
      </div>
    );
  }

  const name = lang === 'en' ? product.nameEn : product.nameAr;
  const categoryLabel = lang === 'en' 
    ? product.category 
    : (product.category.toLowerCase() === 'perfume' ? 'عطر' : 'عود');

  return (
    <div className="bg-white min-h-screen">
      {/* Main Product Section */}
      <section className="container mx-auto px-4 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24 items-start">
          
          {/* Left: Image Gallery */}
          <div className="relative group">
            <div className="aspect-square rounded-[3rem] overflow-hidden bg-gray-100 shadow-2xl border border-purple-50">
              <img 
                src={product.image} 
                alt={name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              />
            </div>
            <button 
              onClick={() => toggleWishlist(product)}
              className={`absolute top-6 right-6 p-4 rounded-2xl shadow-xl backdrop-blur-md transition-all active:scale-90 ${
                isWishlisted 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-900 hover:bg-white'
              }`}
            >
              <svg className="w-6 h-6" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </button>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <nav className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-6">
              <Link to="/" className="hover:text-purple-600 transition-colors">Zari</Link>
              <span>/</span>
              <span className="text-purple-600">{categoryLabel}</span>
            </nav>

            <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-4">
              {name}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-black text-purple-600">
                {product.price} AED
              </span>
              <div className="h-6 w-px bg-gray-200"></div>
              <span className="bg-green-50 text-green-600 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-green-100">
                {lang === 'en' ? 'In Stock' : 'متوفر'}
              </span>
            </div>

            <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-xl">
              {lang === 'en' 
                ? `Experience the luxury of ${name}. A masterfully crafted ${product.category.toLowerCase()} designed to leave a lasting impression of elegance and sophistication.`
                : `استمتع بفخامة ${name}. عطر ${categoryLabel} مصنوع ببراعة ليترك انطباعاً يدوم من الأناقة والرقي.`}
            </p>

            {/* Quantity and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <div className="flex items-center bg-gray-50 rounded-2xl p-2 border border-gray-100">
                <button 
                  onClick={() => setActiveQuantity(prev => Math.max(1, prev - 1))}
                  className="w-12 h-12 flex items-center justify-center font-black text-xl hover:bg-white rounded-xl transition-all"
                >
                  -
                </button>
                <span className="w-12 text-center font-black text-lg">{activeQuantity}</span>
                <button 
                  onClick={() => setActiveQuantity(prev => prev + 1)}
                  className="w-12 h-12 flex items-center justify-center font-black text-xl hover:bg-white rounded-xl transition-all"
                >
                  +
                </button>
              </div>

              <button 
                onClick={() => {
                  for(let i=0; i < activeQuantity; i++) addToCart(product);
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-5 rounded-2xl font-black text-xl transition-all active:scale-95 shadow-2xl shadow-purple-200 flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/>
                </svg>
                {lang === 'en' ? 'Add to Cart' : 'أضف إلى السلة'}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040L3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622l-.382-3.016z"/>
                  </svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {lang === 'en' ? '100% Genuine' : 'أصلي 100%'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {lang === 'en' ? 'Fast Delivery' : 'توصيل سريع'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Section */}
      {recommended.length > 0 && (
        <section className="bg-gray-50/50 py-24 border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-purple-600 font-black uppercase tracking-widest text-xs">
                  {lang === 'en' ? 'Curated for you' : 'مختارات لك'}
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-2">
                  {lang === 'en' ? 'Similar Scents' : 'عطور مشابهة'}
                </h2>
              </div>
              <Link to="/explore" className="hidden md:block text-purple-600 font-black uppercase tracking-widest text-sm border-b-2 border-purple-600 pb-1">
                {lang === 'en' ? 'View All' : 'عرض الكل'}
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {recommended.map(item => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;