import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PRODUCTS } from '../data';
import { useApp } from '../AppContext';
import { UI_STRINGS } from '../translations'; // Added this
import ProductCard from '../components/ProductCard';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, addToCart, wishlist, toggleWishlist, cart, updateQuantity, removeFromCart } = useApp();
  
  // Define the translation function
  const t = (key: string) => UI_STRINGS[key]?.[lang] || key;

  const [isSuccess, setIsSuccess] = useState(false);

  const product = PRODUCTS.find(p => String(p.id) === String(id));
  const cartItem = cart.find(item => item.id === product?.id);
  const isWishlisted = wishlist.some(item => item.id === product?.id);

  const recommended = PRODUCTS
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, 1);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 1500);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h2 className="text-4xl font-black text-purple-900 mb-4">
            {lang === 'en' ? 'Scent Not Found' : 'العطر غير موجود'}
          </h2>
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
      <section className="container mx-auto px-4 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24 items-start">
          
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
                isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-900 hover:bg-white'
              }`}
            >
              <svg className="w-6 h-6" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </button>
          </div>

          <div> {/* Wrapped content in a div for grid layout */}
            <nav className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-6">
              <Link to="/" className="hover:text-purple-600">Zari</Link>
              <span>/</span>
              <Link 
                to={`/explore?category=${encodeURIComponent(product.category)}`} 
                className="text-purple-600 hover:text-gray-400"
              >
                {lang === 'en' ? product.category : t(product.category.toLowerCase())}
              </Link>
            </nav>

            <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-4">{name}</h1>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-black text-purple-600">{product.price} AED</span>
              <div className="h-6 w-px bg-gray-200"></div>
              <span className="bg-green-50 text-green-600 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-green-100">
                {lang === 'en' ? 'In Stock' : 'متوفر'}
              </span>
            </div>

            <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-xl">
              {lang === 'en' 
                ? `Experience the luxury of ${name}. A masterfully crafted ${product.category.toLowerCase()} designed for elegance.`
                : `استمتع بفخامة ${name}. عطر ${categoryLabel} مصنوع ببراعة للأناقة.`}
            </p>

            <div className="h-20 flex items-center mb-12">
              {!cartItem ? (
                <button 
                  onClick={handleAddToCart}
                  className={`w-full py-5 rounded-2xl font-black text-xl transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3 shadow-xl ${
                    isSuccess ? 'bg-green-600 scale-105' : 'bg-purple-600 hover:bg-purple-700'
                  } text-white`}
                >
                  {isSuccess ? (
                    <span className="animate-pulse">{lang === 'en' ? 'Success!' : 'تمت الإضافة!'}</span>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/>
                      </svg>
                      {lang === 'en' ? 'Add to Cart' : 'أضف إلى السلة'}
                    </>
                  )}
                </button>
              ) : (
                <div className="w-full flex items-center justify-between bg-gray-50 rounded-2xl p-2 border border-purple-100">
                  <button 
                    onClick={() => cartItem.quantity === 1 ? removeFromCart(product.id) : updateQuantity(product.id, -1)}
                    className="w-16 h-16 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-red-500 transition-all"
                  >
                    {cartItem.quantity === 1 ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    ) : "-"}
                  </button>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-black text-purple-400 uppercase">{lang === 'en' ? 'In Cart' : 'في السلة'}</span>
                    <span className="text-2xl font-black text-gray-900">{cartItem.quantity}</span>
                  </div>
                  <button 
                    onClick={() => updateQuantity(product.id, 1)}
                    className="w-16 h-16 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-purple-600 transition-all"
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">✓</div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{lang === 'en' ? '100% Genuine' : 'أصلي 100%'}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">⚡</div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{lang === 'en' ? 'Fast Delivery' : 'توصيل سريع'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {recommended.length > 0 && (
        <section className="bg-gray-50/50 py-24 border-t border-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-12">{lang === 'en' ? 'Similar Scents' : 'عطور مشابهة'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {recommended.map(item => <ProductCard key={item.id} product={item} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;