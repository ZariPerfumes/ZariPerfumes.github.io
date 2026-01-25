import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useApp } from '../AppContext';

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const { lang, cart, wishlist, addToCart, updateQuantity, removeFromCart, toggleWishlist } = useApp();
  const cartItem = cart.find(item => item.id === product.id);
  const isWishlisted = wishlist.some(item => item.id === product.id);

  const name = lang === 'en' ? product.nameEn : product.nameAr;

  return (
    <div className="bg-white rounded-[24px] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-purple-50 flex flex-col h-full">
      <Link to={`/product/${product.id}`} className="flex-grow flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img 
            src={product.image} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-purple-600 shadow-sm">
            {product.category}
          </div>
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{name}</h3>
          <p className="text-purple-600 font-black text-xl mb-5">{product.price} <span className="text-sm font-medium">AED</span></p>
        </div>
      </Link>
      
      <div className="px-5 pb-5 mt-auto">
        {!cartItem ? (
          <div className="flex gap-2">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product);
              }}
              className="w-[75%] bg-purple-600 hover:bg-purple-700 text-white py-3.5 rounded-2xl font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/>
              </svg>
              {lang === 'en' ? 'Add' : 'أضف'}
            </button>
            
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product);
              }}
              className={`w-[25%] py-3.5 rounded-2xl transition-all shadow-sm active:scale-95 flex items-center justify-center border ${
                isWishlisted 
                ? 'bg-red-50 border-red-100 text-red-500' 
                : 'bg-purple-50 border-purple-100 text-purple-600 hover:bg-purple-100'
              }`}
            >
              <svg 
                className="w-5 h-5" 
                fill={isWishlisted ? "currentColor" : "none"} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-purple-50 rounded-2xl p-1.5 border border-purple-100" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={(e) => {
                e.preventDefault();
                cartItem.quantity === 1 ? removeFromCart(product.id) : updateQuantity(product.id, -1);
              }}
              className={`p-2.5 rounded-xl transition-colors flex items-center justify-center ${
                cartItem.quantity === 1 ? 'text-red-500 hover:bg-red-50' : 'text-purple-600 hover:bg-purple-100 font-black text-lg'
              }`}
            >
              {cartItem.quantity === 1 ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              ) : (
                '-'
              )}
            </button>
            
            <span className="font-black text-purple-900 text-lg">{cartItem.quantity}</span>
            
            <button 
              onClick={(e) => {
                e.preventDefault();
                updateQuantity(product.id, 1);
              }}
              className="p-2.5 text-purple-600 hover:bg-purple-100 rounded-xl transition-colors font-black text-lg"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;