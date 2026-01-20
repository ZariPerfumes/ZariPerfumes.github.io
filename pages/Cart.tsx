
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../AppContext';
import { UI_STRINGS } from '../translations';
import { DELIVERY_COSTS } from '../data';
import { encryptReceipt } from '../utils/encryption';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

const Cart: React.FC = () => {
  const { lang, cart, updateQuantity, removeFromCart, clearCart } = useApp();
  const t = (key: string) => UI_STRINGS[key]?.[lang] || key;

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [emirate, setEmirate] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);

  const [locationDetails, setLocationDetails] = useState({
      street: '',
      villa: '',
      type: 'Villa',
      additional: ''
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = method === 'delivery' ? (DELIVERY_COSTS.find(e => e.emirate === emirate)?.cities[city] || 0) : 0;
  const total = subtotal + deliveryFee;

  // Setup reCAPTCHA when the checkout modal opens
  useEffect(() => {
    if (showCheckout && !recaptchaVerifier.current) {
        try {
            recaptchaVerifier.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': () => {
                    console.log("reCAPTCHA solved");
                }
            });
        } catch (err) {
            console.error("Recaptcha init error", err);
        }
    }
    return () => {
        if (recaptchaVerifier.current) {
            recaptchaVerifier.current.clear();
            recaptchaVerifier.current = null;
        }
    };
  }, [showCheckout]);

  const formatPhoneNumber = (number: string) => {
    let cleaned = number.replace(/\D/g, '');
    if (!cleaned.startsWith('971') && !number.startsWith('+')) {
        return `+971${cleaned}`;
    }
    return number.startsWith('+') ? number : `+${cleaned}`;
  };

  const handleSendOtp = async () => {
    if (!phone) {
        setError(lang === 'en' ? "Please enter a phone number" : "يرجى إدخال رقم الهاتف");
        return;
    }
    
    setError('');
    setLoading(true);
    const formattedPhone = formatPhoneNumber(phone);

    try {
        if (!recaptchaVerifier.current) throw new Error("Recaptcha not initialized");
        
        const result = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier.current);
        setConfirmationResult(result);
        setOtpSent(true);
        setLoading(false);
    } catch (err: any) {
        console.error("OTP send error", err);
        setError(lang === 'en' ? `Error: ${err.message}` : "حدث خطأ أثناء إرسال الرمز");
        setLoading(false);
        // Reset recaptcha if it fails
        if (recaptchaVerifier.current) {
            recaptchaVerifier.current.clear();
            recaptchaVerifier.current = null;
        }
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !confirmationResult) return;
    
    setError('');
    setLoading(true);
    
    try {
        await confirmationResult.confirm(otp);
        // If confirmed, proceed to final receipt generation
        handleFinalizeOrder();
    } catch (err: any) {
        console.error("OTP verify error", err);
        setError(lang === 'en' ? "Invalid OTP code. Please try again." : "رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.");
        setLoading(false);
    }
  };

  const handleFinalizeOrder = () => {
    const dateStr = new Date().toLocaleString();
    const timeStr = new Date().toLocaleTimeString();
    const receiptText = `
ZARI PERFUMES RECEIPT
---------------------
Date: ${dateStr}
Time: ${timeStr}
Method: ${method.toUpperCase()}
Emirate: ${emirate || 'N/A'}
City: ${city || 'N/A'}
Phone: ${phone}
Location Details: ${method === 'delivery' ? `${locationDetails.type} ${locationDetails.villa}, ${locationDetails.street}. Info: ${locationDetails.additional}` : 'Pickup: Ajman Makhriz Store'}
---------------------
Items:
${cart.map(item => `- ${item.nameEn} (x${item.quantity}) @ ${item.price} = ${item.price * item.quantity} AED`).join('\n')}
---------------------
Subtotal: ${subtotal} AED
Delivery Fee: ${deliveryFee} AED
TOTAL PAYABLE: ${total} AED
---------------------
AUTHENTICITY GUARANTEED
Ajman, UAE
    `;

    const encrypted = encryptReceipt(receiptText);
    navigator.clipboard.writeText(encrypted);
    setStep(3);
    setLoading(false);
  };

  const findMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
          alert(lang === 'en' ? `Location found: ${pos.coords.latitude}, ${pos.coords.longitude}. Auto-filling address...` : `تم تحديد موقعك: ${pos.coords.latitude}, ${pos.coords.longitude}. جاري تعبئة العنوان...`);
          setLocationDetails(prev => ({ ...prev, additional: `Coords: ${pos.coords.latitude}, ${pos.coords.longitude}` }));
      }, () => {
          alert(lang === 'en' ? "Could not access location. Please enter manually." : "لا يمكن الوصول إلى الموقع. يرجى الإدخال يدوياً.");
      });
    }
  };

  if (cart.length === 0 && !showCheckout) {
    return (
      <div className="pt-40 pb-20 container mx-auto px-4 text-center min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-32 h-32 bg-purple-50 rounded-full flex items-center justify-center text-purple-200 mx-auto mb-8 shadow-inner animate-pulse">
           <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        </div>
        <h2 className="text-4xl font-black mb-4 text-purple-900">{t('emptyCart')}</h2>
        <p className="text-gray-500 text-lg mb-12 max-w-md mx-auto">{t('noProducts')}</p>
        <Link to="/explore" className="bg-purple-600 text-white px-12 py-5 rounded-full font-black text-xl hover:bg-purple-700 transition-all shadow-xl active:scale-95 inline-block">
          {t('continueShopping')} →
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-gray-50/50 min-h-screen">
       {/* Invisible reCAPTCHA container */}
       <div id="recaptcha-container"></div>

       <div className="h-[300px] mb-12 bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 flex items-center justify-center text-white text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-150 animate-pulse"></div>
        <div className="flex flex-col items-center gap-4 relative z-10">
            <svg className="w-16 h-16 text-purple-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            <h1 className="text-7xl font-black tracking-tighter uppercase">{t('cart')}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:flex gap-12">
        {/* Cart List */}
        <div className="lg:w-2/3 space-y-6">
          {cart.map(item => (
            <div key={item.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-purple-50 flex items-center gap-8 group hover:shadow-lg transition-all duration-500">
              <div className="relative w-32 h-32 rounded-3xl overflow-hidden bg-gray-50 shrink-0">
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.nameEn} />
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-black text-gray-900 mb-1">{lang === 'en' ? item.nameEn : item.nameAr}</h3>
                <p className="text-purple-600 font-bold text-lg mb-4">{item.price} AED <span className="text-gray-400 text-sm font-medium">/ piece</span></p>
                <div className="flex items-center bg-purple-50 w-fit rounded-2xl p-1.5 border border-purple-100 gap-6">
                   {item.quantity === 1 ? (
                     <button onClick={() => removeFromCart(item.id)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                     </button>
                   ) : (
                     <button onClick={() => updateQuantity(item.id, -1)} className="p-2.5 text-purple-600 font-black text-xl">-</button>
                   )}
                   <span className="font-black text-purple-900 text-xl">{item.quantity}</span>
                   <button onClick={() => updateQuantity(item.id, 1)} className="p-2.5 text-purple-600 font-black text-xl">+</button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-gray-400 text-sm font-bold uppercase mb-1">Total</p>
                <p className="text-3xl font-black text-purple-900">{item.price * item.quantity} AED</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Summary */}
        <div className="lg:w-1/3 mt-12 lg:mt-0">
          <div className="bg-white p-10 rounded-[48px] shadow-2xl border border-purple-100 sticky top-32">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-3xl font-black tracking-tight">{t('orderSummary')}</h3>
               <span className="bg-purple-100 text-purple-600 px-4 py-1.5 rounded-full font-black text-sm">{cart.length} {t('products')}</span>
            </div>
            
            <div className="space-y-6 mb-10 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-base items-center">
                  <span className="text-gray-500 font-medium truncate max-w-[200px]">{lang === 'en' ? item.nameEn : item.nameAr} <span className="font-black text-purple-400 ml-1">x{item.quantity}</span></span>
                  <span className="font-black text-gray-900">{item.price * item.quantity} AED</span>
                </div>
              ))}
            </div>

            <div className="h-[2px] bg-purple-50 mb-8 rounded-full"></div>
            
            <div className="flex justify-between items-center mb-10">
               <span className="text-2xl font-bold text-gray-900">{t('total')}</span>
               <div className="text-right">
                 <span className="text-4xl font-black text-purple-600 tracking-tighter">{total} AED</span>
                 {deliveryFee > 0 && <p className="text-[10px] text-green-500 font-bold uppercase mt-1">Incl. Delivery Fee</p>}
               </div>
            </div>

            <button 
              onClick={() => setShowCheckout(true)}
              className="w-full bg-purple-600 text-white py-6 rounded-[28px] font-black text-2xl hover:bg-purple-700 transition-all mb-6 shadow-xl shadow-purple-100 active:scale-95"
            >
              {t('proceedToCheckout')} →
            </button>
            
            <button 
              onClick={() => setShowClearConfirm(true)}
              className="w-full flex items-center justify-center gap-2 text-red-500 font-black py-4 hover:bg-red-50 rounded-[20px] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              {t('clearCart')}
            </button>
          </div>
        </div>
      </div>

      {/* Clear Cart Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-md">
          <div className="bg-white rounded-[48px] p-12 max-w-md w-full text-center space-y-8 animate-scale-up shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-500 mx-auto animate-bounce-slow">
               <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <div>
              <h3 className="text-4xl font-black mb-3 text-gray-900">{t('clearCart')}</h3>
              <p className="text-gray-500 font-bold text-lg leading-relaxed">{t('clearCartConfirm')}</p>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <button onClick={() => setShowClearConfirm(false)} className="py-5 border-2 border-gray-100 rounded-3xl font-black hover:bg-gray-50 text-gray-500 transition-colors uppercase tracking-widest text-xs">{t('cancel')}</button>
              <button onClick={() => { clearCart(); setShowClearConfirm(false); }} className="py-5 bg-red-500 text-white rounded-3xl font-black hover:bg-red-600 transition-all shadow-lg shadow-red-100 uppercase tracking-widest text-xs">{t('confirm')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Flow Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-md">
          <div className="bg-white rounded-[56px] w-full max-w-3xl overflow-hidden animate-slide-up flex flex-col max-h-[92vh] shadow-2xl">
            <div className="bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 p-10 text-white relative">
               <div className="flex justify-between items-start mb-10">
                 <div>
                   <h3 className="text-3xl font-black uppercase tracking-tighter mb-1">{t('checkout')}</h3>
                   <p className="text-purple-300 font-bold text-sm">Follow the steps to complete your order</p>
                 </div>
                 <button onClick={() => { setShowCheckout(false); setStep(1); setOtpSent(false); setError(''); }} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">✕</button>
               </div>
               
               <div className="flex items-center justify-center gap-16 text-sm font-black relative">
                 <div className="flex flex-col items-center gap-3">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${step >= 1 ? 'bg-white text-purple-900 scale-110 shadow-xl' : 'bg-white/10 text-white/50'}`}>1</div>
                   <span className={step >= 1 ? 'text-white' : 'text-white/30'}>Method</span>
                 </div>
                 <div className={`h-[2px] w-16 transition-all duration-500 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/10'}`}></div>
                 <div className="flex flex-col items-center gap-3">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${step >= 2 ? 'bg-white text-purple-900 scale-110 shadow-xl' : 'bg-white/10 text-white/50'}`}>2</div>
                   <span className={step >= 2 ? 'text-white' : 'text-white/30'}>Details</span>
                 </div>
                 <div className={`h-[2px] w-16 transition-all duration-500 rounded-full ${step >= 3 ? 'bg-white' : 'bg-white/10'}`}></div>
                 <div className="flex flex-col items-center gap-3">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${step >= 3 ? 'bg-white text-purple-900 scale-110 shadow-xl' : 'bg-white/10 text-white/50'}`}>3</div>
                   <span className={step >= 3 ? 'text-white' : 'text-white/30'}>Finalize</span>
                 </div>
               </div>
            </div>

            <div className="p-10 lg:p-14 overflow-y-auto custom-scrollbar flex-grow bg-white">
              {step === 1 && (
                <div className="space-y-10 animate-fade-in">
                   <div>
                     <h4 className="text-2xl font-black mb-8 text-gray-900">{t('deliveryMethod')}</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button 
                          onClick={() => setMethod('pickup')}
                          className={`p-8 rounded-[40px] border-4 text-left transition-all group ${method === 'pickup' ? 'border-purple-600 bg-purple-50 shadow-xl shadow-purple-50' : 'border-gray-50 bg-gray-50/50 hover:bg-gray-50'}`}
                        >
                          <div className="flex items-center gap-5 mb-4">
                             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${method === 'pickup' ? 'bg-purple-600 text-white' : 'bg-white text-purple-400'}`}>
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                             </div>
                             <span className={`text-xl font-black ${method === 'pickup' ? 'text-purple-900' : 'text-gray-400'}`}>{t('pickup')}</span>
                          </div>
                          <p className="text-gray-500 font-bold mb-3">{t('makhrizStore')}</p>
                          <a href="https://maps.app.goo.gl/CvUXRfPCeuyB59qP9" target="_blank" className="inline-flex items-center gap-1 text-purple-600 text-sm font-black border-b-2 border-purple-200 hover:border-purple-600 transition-all">{t('viewOnMap')} ↗</a>
                        </button>

                        <button 
                          onClick={() => setMethod('delivery')}
                          className={`p-8 rounded-[40px] border-4 text-left transition-all group ${method === 'delivery' ? 'border-purple-600 bg-purple-50 shadow-xl shadow-purple-50' : 'border-gray-50 bg-gray-50/50 hover:bg-gray-50'}`}
                        >
                          <div className="flex items-center gap-5 mb-4">
                             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${method === 'delivery' ? 'bg-purple-600 text-white' : 'bg-white text-purple-400'}`}>
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                             </div>
                             <span className={`text-xl font-black ${method === 'delivery' ? 'text-purple-900' : 'text-gray-400'}`}>{t('delivery')}</span>
                          </div>
                          <p className="text-gray-500 font-bold leading-tight">{t('deliveryEmirates')}</p>
                        </button>
                     </div>
                   </div>

                   {method === 'pickup' && (
                     <div className="bg-green-50 text-green-700 p-6 rounded-[32px] flex items-center gap-5 font-black animate-scale-up border border-green-100">
                        <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shrink-0">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                        </div>
                        <p className="text-lg">{t('readyForPickup')}</p>
                     </div>
                   )}

                   {method === 'delivery' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-scale-up">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">{t('selectEmirate')}</label>
                          <select 
                            value={emirate}
                            onChange={(e) => { setEmirate(e.target.value); setCity(''); }}
                            className="w-full bg-purple-50 p-6 rounded-[24px] border-none outline-none font-black text-purple-900 focus:ring-4 ring-purple-100 transition-all appearance-none cursor-pointer"
                          >
                            <option value="">Choose Emirate...</option>
                            {DELIVERY_COSTS.map(d => <option key={d.emirate} value={d.emirate}>{d.emirate}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">{t('selectCity')}</label>
                          <select 
                            disabled={!emirate}
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-purple-50 p-6 rounded-[24px] border-none outline-none font-black text-purple-900 focus:ring-4 ring-purple-100 transition-all appearance-none cursor-pointer disabled:opacity-50"
                          >
                            <option value="">Choose City...</option>
                            {emirate && Object.keys(DELIVERY_COSTS.find(d => d.emirate === emirate)?.cities || {}).map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                     </div>
                   )}

                   <div className="flex justify-end pt-10">
                      <button 
                        disabled={method === 'delivery' && (!emirate || !city)}
                        onClick={() => setStep(2)}
                        className="bg-purple-600 text-white px-16 py-6 rounded-[28px] font-black text-xl disabled:opacity-30 transition-all hover:translate-x-2 shadow-xl shadow-purple-100 active:scale-95"
                      >
                        {t('next')}
                      </button>
                   </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-10 animate-fade-in">
                  <h4 className="text-2xl font-black text-gray-900">{t('orderDetails')}</h4>
                  
                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl font-bold border border-red-100 animate-scale-up">
                      {error}
                    </div>
                  )}

                  {method === 'delivery' && (
                    <div className="space-y-8">
                       <div className="space-y-4">
                         <div className="flex justify-between items-center px-4">
                           <p className="text-xs font-black uppercase tracking-widest text-gray-400">Map & Coordinates</p>
                           <button 
                            onClick={findMyLocation}
                            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-full font-black text-xs hover:bg-purple-700 transition-all shadow-md active:scale-95"
                           >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                             {t('findMyLocation')}
                           </button>
                         </div>
                         <div className="h-48 bg-gray-100 rounded-[32px] flex items-center justify-center overflow-hidden border-4 border-white shadow-inner relative group">
                            <img src="images/map-placeholder.jpg" className="w-full h-full object-cover grayscale opacity-30 group-hover:opacity-50 transition-all duration-700" alt="Map Placeholder" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 font-black p-4 text-center">
                               <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                               <span className="uppercase text-xs tracking-widest">Map Interface Placeholder</span>
                            </div>
                         </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <input 
                            type="text" 
                            placeholder={t('streetName')} 
                            value={locationDetails.street}
                            onChange={(e) => setLocationDetails({...locationDetails, street: e.target.value})}
                            className="w-full bg-purple-50 p-6 rounded-[24px] border-none outline-none font-black text-purple-900 focus:ring-4 ring-purple-100 transition-all" 
                          />
                          <input 
                            type="text" 
                            placeholder={t('villaBuilding')} 
                            value={locationDetails.villa}
                            onChange={(e) => setLocationDetails({...locationDetails, villa: e.target.value})}
                            className="w-full bg-purple-50 p-6 rounded-[24px] border-none outline-none font-black text-purple-900 focus:ring-4 ring-purple-100 transition-all" 
                          />
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <select 
                            value={locationDetails.type}
                            onChange={(e) => setLocationDetails({...locationDetails, type: e.target.value})}
                            className="w-full bg-purple-50 p-6 rounded-[24px] border-none outline-none font-black text-purple-900 focus:ring-4 ring-purple-100 transition-all appearance-none cursor-pointer"
                          >
                             <option value="">{t('propertyType')}</option>
                             <option value="Villa">Villa</option>
                             <option value="Apartment">Apartment</option>
                             <option value="Hotel">Hotel</option>
                             <option value="Office">Office</option>
                             <option value="Other">Other</option>
                          </select>
                          <input 
                            type="text" 
                            placeholder={t('additionalInfo')} 
                            value={locationDetails.additional}
                            onChange={(e) => setLocationDetails({...locationDetails, additional: e.target.value})}
                            className="w-full bg-purple-50 p-6 rounded-[24px] border-none outline-none font-black text-purple-900 focus:ring-4 ring-purple-100 transition-all" 
                          />
                       </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">{t('phoneNumber')}</p>
                    <div className="flex gap-4">
                      <input 
                        type="tel" 
                        placeholder="+971 XX XXX XXXX" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="flex-grow bg-purple-50 p-6 rounded-[24px] border-none outline-none font-black text-purple-900 focus:ring-4 ring-purple-100 transition-all text-xl" 
                      />
                      <button 
                        disabled={loading || !phone}
                        onClick={handleSendOtp} 
                        className="bg-purple-600 text-white px-8 rounded-[24px] font-black hover:bg-purple-700 transition-all active:scale-95 shadow-lg shadow-purple-100 disabled:opacity-50 flex items-center gap-2"
                      >
                        {loading && !otpSent && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                        {otpSent ? 'RESEND' : 'SEND OTP'}
                      </button>
                    </div>
                    
                    {otpSent && (
                      <div className="animate-scale-up space-y-4">
                        <div className="text-sm font-black text-green-600 px-4 flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                           OTP Sent successfully!
                        </div>
                        <input 
                          type="text" 
                          placeholder="Enter 6-digit OTP" 
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full bg-white border-4 border-purple-50 p-6 rounded-[24px] outline-none font-black text-purple-900 focus:border-purple-600 transition-all text-2xl tracking-[1em] text-center" 
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-10">
                     <button onClick={() => setStep(1)} className="text-purple-600 font-black px-10 py-4 hover:bg-purple-50 rounded-full transition-all flex items-center gap-2">← {t('back')}</button>
                     <button 
                       disabled={loading || !otp || !phone || (method === 'delivery' && (!locationDetails.street || !locationDetails.villa))}
                       onClick={handleVerifyOtp}
                       className="bg-purple-600 text-white px-16 py-6 rounded-[28px] font-black text-xl disabled:opacity-30 transition-all shadow-xl shadow-purple-100 active:scale-95 flex items-center gap-2"
                     >
                       {loading && otpSent && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                       {t('confirmOrder')}
                     </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="py-16 text-center space-y-10 animate-scale-up">
                   <div className="w-32 h-32 bg-green-100 rounded-[40px] flex items-center justify-center text-green-500 mx-auto animate-pulse">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                   </div>
                   <div>
                     <h3 className="text-5xl font-black mb-4 text-gray-900 tracking-tighter">{t('orderConfirmed')}</h3>
                     <p className="text-gray-500 font-bold text-xl">{t('receiptCopied')}</p>
                   </div>
                   
                   <div className="space-y-4 px-10">
                     <a 
                       href="https://instagram.com/zari.aj25" 
                       target="_blank"
                       className="w-full bg-gradient-to-br from-purple-700 via-pink-600 to-orange-500 text-white py-6 rounded-[32px] font-black text-2xl flex items-center justify-center gap-4 shadow-xl hover:-translate-y-1 transition-all"
                     >
                        <img src="images/icons/instagram.svg" className="w-8 h-8 invert" alt="insta" />
                        {t('sendInstagram')}
                     </a>
                     <a 
                       href="https://wa.me/971588537024" 
                       target="_blank"
                       className="w-full bg-[#25D366] text-white py-6 rounded-[32px] font-black text-2xl flex items-center justify-center gap-4 shadow-xl hover:-translate-y-1 transition-all"
                     >
                        <img src="images/icons/whatsapp.svg" className="w-8 h-8 invert" alt="wa" />
                        {t('sendWhatsapp')}
                     </a>
                   </div>
                   
                   <p className="text-sm text-gray-400 font-bold max-w-sm mx-auto uppercase tracking-widest leading-loose">
                     Your order will not be processed until you send the encrypted receipt to our support team.
                   </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
