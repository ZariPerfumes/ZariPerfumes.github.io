import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, CartItem, Product } from './types';
import { PRODUCTS } from './data';

interface AppContextType {
  lang: Language;
  setLang: (l: Language) => void;
  cart: CartItem[];
  addToCart: (p: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (b: boolean) => void;
  searchQuery: string;
  setSearchQuery: (s: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize language from localStorage or default to 'en'
  const [lang, setLang] = useState<Language>(() => {
    const savedLang = localStorage.getItem('zari_lang');
    return (savedLang as Language) || 'en';
  });

  // Initialize cart from localStorage or default to empty array
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('zari_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('zari_cart', JSON.stringify(cart));
  }, [cart]);

  // Save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('zari_lang', lang);
  }, [lang]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev;
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('zari_cart');
  };

  return (
    <AppContext.Provider value={{
      lang, setLang, cart, addToCart, removeFromCart, updateQuantity, clearCart,
      isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery
    }}>
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className={lang === 'ar' ? 'font-arabic' : ''}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};