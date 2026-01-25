import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { UI_STRINGS } from '../translations';
import { DELIVERY_COSTS } from '../data';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const CITY_COORDS: Record<string, [number, number]> = {
  'Dubai': [25.2048, 55.2708],
  'Abu Dhabi': [24.4539, 54.3773],
  'Sharjah': [25.3463, 55.4209],
  'Ajman': [25.4052, 55.5136],
  'Umm Al Quwain': [25.5647, 55.5533],
  'Ras Al Khaimah': [25.7895, 55.9432],
  'Fujairah': [25.1288, 56.3265],
  'Al Ain City': [24.1302, 55.8023]
};

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

const Cart: React.FC = () => {
  const { lang, cart, updateQuantity, removeFromCart, clearCart } = useApp();
  const navigate = useNavigate();
  const receiptRef = useRef<HTMLDivElement>(null);
  const t = (key: string) => UI_STRINGS[key]?.[lang] || key;

  const [showCheckout, setShowCheckout] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [emirate, setEmirate] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [orderDate] = useState(new Date().toLocaleString());
  
  const [mapCoords, setMapCoords] = useState<[number, number]>([25.4052, 55.5136]);
  const [mapZoom, setMapZoom] = useState(11);
  const markerRef = useRef<L.Marker>(null);
  const [locationDetails, setLocationDetails] = useState({ street: '', villa: '' });

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = method === 'delivery' ? (DELIVERY_COSTS.find(e => e.emirateEn === emirate)?.cities[city as any] || 0) : 0;
  const total = subtotal + deliveryFee;

  const validateEmail = (emailStr: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  const validatePhone = (phoneStr: string) => /^\d{9}$/.test(phoneStr);

  const isStep1Valid = method === 'pickup' || (emirate !== '' && city !== '');
  const isStep2Valid = validatePhone(phone) && validateEmail(email) && (method === 'pickup' || (locationDetails.street !== '' && locationDetails.villa !== ''));

  useEffect(() => {
    document.title = lang === 'en' ? 'Zari Perfumes | Cart' : 'عطور زاري | السلة';
  }, [lang]);

  useEffect(() => {
    if (emirate && CITY_COORDS[emirate]) {
      setMapCoords(CITY_COORDS[emirate]);
      setMapZoom(12);
    }
  }, [emirate]);

  useEffect(() => {
    if (step === 3 && receiptRef.current) {
      const observer = new MutationObserver(() => {
        window.location.reload();
      });
      observer.observe(receiptRef.current, { attributes: true, childList: true, subtree: true, characterData: true });
      return () => observer.disconnect();
    }
  }, [step]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 9);
    setPhone(val);
    setPhoneError(val.length > 0 && val.length < 9);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(e.target.value.length > 0 && !validateEmail(e.target.value));
  };

  const MapHandler = () => {
    useMapEvents({ click(e) { setMapCoords([e.latlng.lat, e.latlng.lng]); } });
    return null;
  };

  const eventHandlers = useMemo(() => ({
    dragend() {
      const marker = markerRef.current;
      if (marker) {
        const { lat, lng } = marker.getLatLng();
        setMapCoords([lat, lng]);
      }
    },
  }), []);

  const handleFullReset = () => {
    clearCart();
    setShowCheckout(false);
    setShowCancelConfirm(false);
    setStep(1);
    navigate('/');
  };

  return (
    <div className="pt-[73px] pb-20 bg-gray-50/50 min-h-screen">
      <div className="h-[300px] mb-12 bg-gradient-to-br from-purple-950 to-purple-800 flex items-center justify-center text-white text-center">
        <h1 className="text-7xl font-black tracking-tighter">{t('cart')}</h1>
      </div>

      <div className="container mx-auto px-4">
        {cart.length === 0 && !showCheckout ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <h2 className="text-4xl font-black mb-6 text-purple-900">{t('emptyCart')}</h2>
            <Link to="/explore" className="bg-purple-600 text-white px-12 py-5 rounded-full font-black text-xl shadow-xl">{t('continueShopping')} →</Link>
          </div>
        ) : (
          <div className="lg:flex gap-12">
            <div className="lg:w-2/3 space-y-6">
              {cart.map(item => (
                <div key={item.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-purple-50 flex items-center gap-8">
                  <img src={item.image} className="w-32 h-32 rounded-3xl object-cover" alt={item.nameEn} />
                  <div className="flex-grow">
                    <h3 className="text-2xl font-black text-gray-900">{lang === 'en' ? item.nameEn : item.nameAr}</h3>
                    <p className="text-purple-600 font-bold text-lg">{item.price} AED</p>
                    <div className="flex items-center bg-purple-50 w-fit rounded-2xl p-1.5 mt-4 gap-6">
                       <button 
                         onClick={() => item.quantity === 1 ? removeFromCart(item.id) : updateQuantity(item.id, -1)} 
                         className={`p-2 transition-colors flex items-center justify-center ${item.quantity === 1 ? 'text-red-500' : 'text-purple-600 font-black text-xl'}`}
                       >
                         {item.quantity === 1 ? (
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                           </svg>
                         ) : '-'}
                       </button>
                       <span className="font-black text-purple-900 text-xl">{item.quantity}</span>
                       <button onClick={() => updateQuantity(item.id, 1)} className="p-2 text-purple-600 font-black text-xl">+</button>
                    </div>
                  </div>
                  <p className="text-3xl font-black text-purple-900">{item.price * item.quantity} AED</p>
                </div>
              ))}
            </div>

            <div className="lg:w-1/3 mt-12 lg:mt-0">
              <div className="bg-white p-10 rounded-[48px] shadow-2xl border border-purple-100 sticky top-32">
                <h3 className="text-3xl font-black mb-10">{t('orderSummary')}</h3>
                <div className="flex justify-between items-center mb-10 text-2xl">
                   <span className="font-bold">{t('total')}</span>
                   <span className="font-black text-purple-600">{total} AED</span>
                </div>
                <button onClick={() => setShowCheckout(true)} className="w-full bg-purple-600 text-white py-6 rounded-[28px] font-black text-2xl shadow-xl active:scale-95 transition-all">{t('proceedToCheckout')} →</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showCheckout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-md">
          <div className="bg-white rounded-[56px] w-full max-w-3xl overflow-hidden animate-slide-up flex flex-col max-h-[92vh] relative">
            
            {showExitConfirm && (
              <div className="absolute inset-0 z-[110] bg-purple-900/95 flex items-center justify-center p-8 text-center rounded-[56px]">
                <div className="bg-white p-10 rounded-[40px] shadow-2xl max-w-sm">
                  <h4 className="text-2xl font-black text-purple-900 mb-4">{lang === 'en' ? 'Close Checkout?' : 'إغلاق الدفع؟'}</h4>
                  <p className="text-gray-600 font-bold mb-8">{lang === 'en' ? 'Your cart items will be saved.' : 'سيتم حفظ منتجاتك في السلة.'}</p>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => setShowCheckout(false)} className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black uppercase">{lang === 'en' ? 'Close & Save' : 'إغلاق وحفظ'}</button>
                    <button onClick={() => setShowExitConfirm(false)} className="w-full bg-gray-100 text-gray-900 py-4 rounded-2xl font-black uppercase">{lang === 'en' ? 'Cancel' : 'إلغاء'}</button>
                  </div>
                </div>
              </div>
            )}

            {showCancelConfirm && (
              <div className="absolute inset-0 z-[110] bg-red-900/95 flex items-center justify-center p-8 text-center rounded-[56px]">
                <div className="bg-white p-10 rounded-[40px] shadow-2xl max-w-sm">
                  <h4 className="text-2xl font-black text-red-600 mb-4">{lang === 'en' ? 'Clear Everything?' : 'مسح كل شيء؟'}</h4>
                  <p className="text-gray-600 font-bold mb-8">{lang === 'en' ? 'This will delete your cart and reset the app.' : 'سيتم حذف السلة وإعادة ضبط التطبيق.'}</p>
                  <div className="flex flex-col gap-3">
                    <button onClick={handleFullReset} className="w-full bg-red-600 text-white py-4 rounded-2xl font-black uppercase">{lang === 'en' ? 'Yes, Clear All' : 'نعم، مسح الكل'}</button>
                    <button onClick={() => setShowCancelConfirm(false)} className="w-full bg-gray-100 text-gray-900 py-4 rounded-2xl font-black uppercase">{lang === 'en' ? 'No, Go Back' : 'لا، العودة'}</button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-purple-900 p-10 text-white">
               <div className="flex justify-between items-center mb-10">
                 <button onClick={() => setShowExitConfirm(true)} className="text-3xl font-bold">✕</button>
               </div>
               <div className="flex items-center justify-center gap-16">
                 {[1, 2, 3].map(i => (
                   <div key={i} className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${step>=i?'bg-white text-purple-900':'bg-white/10'}`}>{i}</div>
                 ))}
               </div>
            </div>

            <div className="p-10 lg:p-14 overflow-y-auto flex-grow">
              {step === 1 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div onClick={() => setMethod('pickup')} className={`p-8 rounded-[32px] border-4 font-black cursor-pointer flex flex-col items-center justify-center text-center transition-all ${method === 'pickup' ? 'border-purple-600 bg-purple-50' : 'border-gray-50 bg-white'}`}>
                      <span className="text-xl">{t('pickup')}</span>
                    </div>
                    <button type="button" onClick={() => setMethod('delivery')} className={`p-8 rounded-[32px] border-4 font-black transition-all ${method === 'delivery' ? 'border-purple-600 bg-purple-50' : 'border-gray-50 bg-white'}`}>
                      {t('delivery')}
                    </button>
                  </div>
                  {method === 'delivery' && (
                    <div className="grid gap-6">
                      <select value={emirate} onChange={(e) => {setEmirate(e.target.value); setCity('');}} className="p-6 bg-purple-50 rounded-[24px] outline-none font-black text-purple-900 border-2 border-transparent">
                        <option value="">{t('selectEmirate')}</option>
                        {DELIVERY_COSTS.map(d => (
                          <option key={d.emirateEn} value={d.emirateEn}>{lang === 'en' ? d.emirateEn : d.emirateAr}</option>
                        ))}
                      </select>
                      <select value={city} onChange={(e) => setCity(e.target.value)} className="p-6 bg-purple-50 rounded-[24px] outline-none font-black text-purple-900 border-2 border-transparent">
                        <option value="">{t('selectCity')}</option>
                        {emirate && Object.keys(DELIVERY_COSTS.find(d => d.emirateEn === emirate)?.cities || {}).map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <button disabled={!isStep1Valid} onClick={() => setStep(2)} className="w-full bg-purple-600 text-white py-6 rounded-[28px] font-black text-xl shadow-xl disabled:opacity-30">{t('continue')} →</button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  {method === 'delivery' && (
                    <div className="space-y-4">
                      <div className="h-64 rounded-[32px] overflow-hidden border-4 border-white shadow-lg relative z-0">
                        <MapContainer center={mapCoords} zoom={mapZoom} style={{height: "100%"}}>
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker position={mapCoords} icon={icon} draggable={true} eventHandlers={eventHandlers} ref={markerRef} />
                          <ChangeView center={mapCoords} zoom={mapZoom} />
                          <MapHandler />
                        </MapContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input placeholder={t('street')} className="p-5 bg-purple-50 rounded-[20px] font-black text-sm border-2 border-transparent" onChange={e => setLocationDetails({...locationDetails, street: e.target.value})} />
                        <input placeholder={t('villa')} className="p-5 bg-purple-50 rounded-[20px] font-black text-sm border-2 border-transparent" onChange={e => setLocationDetails({...locationDetails, villa: e.target.value})} />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <input value={email} onChange={handleEmailChange} type="text" placeholder="example@email.com" className={`w-full p-5 bg-purple-50 rounded-[20px] font-black text-sm border-2 outline-none ${emailError ? 'border-red-400' : 'border-transparent'}`} />
                    <input value={phone} onChange={handlePhoneChange} type="text" placeholder="+971 ## ### ####" className={`w-full p-5 bg-purple-50 rounded-[20px] font-black text-sm border-2 outline-none ${phoneError ? 'border-red-400' : 'border-transparent'}`} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setStep(1)} className="bg-gray-100 text-gray-900 py-6 rounded-[28px] font-black text-xl">{lang === 'en' ? 'Back' : 'رجوع'}</button>
                    <button disabled={!isStep2Valid} onClick={() => setStep(3)} className="bg-purple-600 text-white py-6 rounded-[28px] font-black text-xl disabled:opacity-30">{lang === 'en' ? 'Confirm' : 'تأكيد'}</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center space-y-8 py-2">
                  <div ref={receiptRef} className="bg-white p-12 rounded-[60px] border-[12px] border-purple-100 text-left space-y-8 shadow-2xl max-w-xl mx-auto relative select-none overflow-hidden" onContextMenu={(e) => e.preventDefault()}>
                    <div className="absolute inset-0 z-[5] opacity-[0.06] pointer-events-none grid grid-cols-4 grid-rows-8 gap-4 rotate-[-15deg] scale-150">
                       {Array(60).fill('ZARI PERFUMES').map((text, i) => <span key={i} className="text-2xl font-black whitespace-nowrap text-purple-900">{text}</span>)}
                    </div>
                    <div className="absolute inset-0 z-[100] bg-transparent"></div>
                    <div className="flex justify-between items-start relative z-10">
                      <div><h2 className="text-4xl font-black text-purple-900 italic uppercase">ZARI PERFUMES</h2></div>
                      <div className="text-right text-[10px] font-black text-gray-400 uppercase">{orderDate}</div>
                    </div>
                    <div className="space-y-4 py-4 relative z-10 border-y-4 border-purple-50">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between text-xl font-black text-gray-800">
                          <span>{item.quantity}x {lang === 'en' ? item.nameEn : item.nameAr}</span>
                          <span className="text-purple-600">{item.price * item.quantity} AED</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-6 flex justify-between items-center relative z-10">
                      <span className="text-3xl font-black text-purple-900 uppercase tracking-tighter">{t('total')}</span>
                      <span className="text-5xl font-black text-purple-600">{total} AED</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 max-w-xl mx-auto">
                    <button onClick={() => setStep(2)} className="w-full bg-gray-100 text-gray-900 py-4 rounded-2xl font-black uppercase tracking-tight">← {lang === 'en' ? 'Back to Details' : 'رجوع للتفاصيل'}</button>
                    <a href="https://form.jotform.com/zariperfumes/receipt-form" target="_blank" rel="noopener noreferrer" className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-2xl shadow-xl">{lang === 'en' ? 'UPLOAD SCREENSHOT →' : 'تحميل لقطة شاشة →'}</a>
                    <button onClick={() => navigate('/explore')} className="w-full border-4 border-purple-600 text-purple-600 py-4 rounded-2xl font-black uppercase">{lang === 'en' ? 'Continue Shopping (Save)' : 'متابعة التسوق (حفظ)'}</button>
                    <button onClick={() => setShowCancelConfirm(true)} className="w-full text-red-500 font-black uppercase text-sm mt-4 hover:underline">{lang === 'en' ? 'Cancel Order & Clear Cart' : 'إلغاء الطلب ومسح السلة'}</button>
                  </div>
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