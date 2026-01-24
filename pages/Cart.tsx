import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../AppContext';
import { UI_STRINGS } from '../translations';
import { DELIVERY_COSTS } from '../data';
import { encryptReceipt } from '../utils/encryption';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
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
  const t = (key: string) => UI_STRINGS[key]?.[lang] || key;

  const [showCheckout, setShowCheckout] = useState(false);
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [emirate, setEmirate] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastReceipt, setLastReceipt] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  const [mapCoords, setMapCoords] = useState<[number, number]>([25.4052, 55.5136]);
  const [mapZoom, setMapZoom] = useState(11);
  const markerRef = useRef<L.Marker>(null);
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);

  const [locationDetails, setLocationDetails] = useState({ street: '', villa: '' });

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = method === 'delivery' ? (DELIVERY_COSTS.find(e => e.emirate === emirate)?.cities[city as any] || 0) : 0;
  const total = subtotal + deliveryFee;

  const isStep1Valid = method === 'pickup' || (emirate !== '' && city !== '');
  const isStep2Valid = phone.length >= 9 && otp.length === 6 && (method === 'pickup' || (locationDetails.street !== '' && locationDetails.villa !== ''));

  useEffect(() => {
    let interval: any;
    if (timer > 0) interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (city && CITY_COORDS[city]) {
      setMapCoords(CITY_COORDS[city]);
      setMapZoom(14);
    } else if (emirate && CITY_COORDS[emirate]) {
      setMapCoords(CITY_COORDS[emirate]);
      setMapZoom(12);
    }
  }, [city, emirate]);

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

  const handleSendOtp = async () => {
    if (!phone || timer > 0) return;
    setLoading(true);
    let p = phone.startsWith('+') ? phone : `+971${phone.replace(/^0/, '')}`;
    try {
      if (!recaptchaVerifier.current) recaptchaVerifier.current = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
      const result = await signInWithPhoneNumber(auth, p, recaptchaVerifier.current);
      setConfirmationResult(result);
      setOtpSent(true);
      setTimer(120);
      setError('');
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      await confirmationResult?.confirm(otp);
      const mapLink = `https://www.google.com/maps?q=${mapCoords[0]},${mapCoords[1]}`;
      const receipt = `ZARI PERFUMES\nTotal: ${total} AED\nPhone: ${phone}\nLocation: ${city}, ${emirate}\nAddress: ${locationDetails.villa}, ${locationDetails.street}\nMap: ${mapLink}`;
      const encrypted = encryptReceipt(receipt);
      setLastReceipt(encrypted);
      navigator.clipboard.writeText(encrypted);
      setStep(3);
    } catch (err) { setError("Invalid OTP"); }
    setLoading(false);
  };

  if (cart.length === 0 && !showCheckout) {
    return (
      <div className="pt-40 pb-20 container mx-auto px-4 text-center min-h-[70vh] flex flex-col items-center justify-center">
        <h2 className="text-4xl font-black mb-4 text-purple-900">{t('emptyCart')}</h2>
        <Link to="/explore" className="bg-purple-600 text-white px-12 py-5 rounded-full font-black text-xl shadow-xl">{t('continueShopping')} →</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-gray-50/50 min-h-screen">
      <div id="recaptcha-container"></div>
      
      <div className="h-[300px] mb-12 bg-gradient-to-br from-purple-950 to-purple-800 flex items-center justify-center text-white text-center">
        <h1 className="text-7xl font-black tracking-tighter uppercase">{t('cart')}</h1>
      </div>

      <div className="container mx-auto px-4 lg:flex gap-12">
        <div className="lg:w-2/3 space-y-6">
          {cart.map(item => (
            <div key={item.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-purple-50 flex items-center gap-8">
              <img src={item.image} className="w-32 h-32 rounded-3xl object-cover" alt={item.nameEn} />
              <div className="flex-grow">
                <h3 className="text-2xl font-black text-gray-900">{lang === 'en' ? item.nameEn : item.nameAr}</h3>
                <p className="text-purple-600 font-bold text-lg">{item.price} AED</p>
                <div className="flex items-center bg-purple-50 w-fit rounded-2xl p-1.5 mt-4 gap-6">
                   <button onClick={() => item.quantity === 1 ? removeFromCart(item.id) : updateQuantity(item.id, -1)} className="p-2 text-purple-600 font-black text-xl">{item.quantity === 1 ? '✕' : '-'}</button>
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

      {showCheckout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-md">
          <div className="bg-white rounded-[56px] w-full max-w-3xl overflow-hidden animate-slide-up flex flex-col max-h-[92vh]">
            <div className="bg-purple-900 p-10 text-white">
               <div className="flex justify-between items-center mb-10">
                 <h3 className="text-2xl font-black uppercase tracking-tighter">{t('step')} {step}</h3>
                 <button onClick={() => setShowCheckout(false)}>✕</button>
               </div>
               <div className="flex items-center justify-center gap-16">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${step>=1?'bg-white text-purple-900':'bg-white/10'}`}>1</div>
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${step>=2?'bg-white text-purple-900':'bg-white/10'}`}>2</div>
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${step>=3?'bg-white text-purple-900':'bg-white/10'}`}>3</div>
               </div>
            </div>

            <div className="p-10 lg:p-14 overflow-y-auto flex-grow">
              {step === 1 && (
   <div className="space-y-8">
    <div className="grid grid-cols-2 gap-6">
      {/* Pickup Option */}
      <div 
        onClick={() => setMethod('pickup')} 
        className={`p-8 rounded-[32px] border-4 font-black cursor-pointer flex flex-col items-center justify-center text-center transition-all relative ${method === 'pickup' ? 'border-purple-600 bg-purple-50' : 'border-gray-50 bg-white'}`}
      >
        <span className="text-xl">{t('pickup')}</span>
        <a 
          href="https://www.google.com/maps/search/?api=1&query=Makhriz+Store+Ajman" 
          target="_blank" 
          rel="noopener noreferrer" 
          onClick={(e) => {
            e.stopPropagation(); // Prevents clicking the link from toggling the method
          }} 
          className="inline-block text-[#25D366] hover:underline text-sm mt-2 relative z-[60] cursor-pointer"
        >
          {t('seeLocation')}
        </a>
      </div>

      {/* Delivery Option */}
      <button 
        type="button"
        onClick={() => setMethod('delivery')} 
        className={`p-8 rounded-[32px] border-4 font-black transition-all ${method === 'delivery' ? 'border-purple-600 bg-purple-50' : 'border-gray-50 bg-white'}`}
      >
        {t('delivery')}
      </button>
    </div>

    {method === 'delivery' && (
      <div className="grid gap-6">
        <select 
          value={emirate} 
          onChange={(e) => {setEmirate(e.target.value); setCity('');}} 
          className="p-6 bg-purple-50 rounded-[24px] outline-none font-black text-purple-900"
        >
          <option value="">{t('selectEmirate')}</option>
          {DELIVERY_COSTS.map(d => <option key={d.emirate} value={d.emirate}>{d.emirate}</option>)}
        </select>
        <select 
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
          className="p-6 bg-purple-50 rounded-[24px] outline-none font-black text-purple-900"
        >
          <option value="">{t('selectCity')}</option>
          {emirate && Object.keys(DELIVERY_COSTS.find(d => d.emirate === emirate)?.cities || {}).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
    )}

    <button 
      disabled={!isStep1Valid} 
      onClick={() => setStep(2)} 
      className="w-full bg-purple-600 text-white py-6 rounded-[28px] font-black text-xl shadow-xl disabled:opacity-30"
    >
      {t('continue')} →
    </button>
  </div>
)}

              {step === 2 && (
                <div className="space-y-8">
                  {method === 'delivery' && (
                    <div className="space-y-4">
                      <div className="h-72 rounded-[32px] overflow-hidden border-4 border-white shadow-lg relative z-0">
                        <MapContainer center={mapCoords} zoom={mapZoom} style={{height: "100%"}}>
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker position={mapCoords} icon={icon} draggable={true} eventHandlers={eventHandlers} ref={markerRef} />
                          <ChangeView center={mapCoords} zoom={mapZoom} />
                          <MapHandler />
                        </MapContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <input placeholder={t('street')} className="p-6 bg-purple-50 rounded-[24px] font-black" onChange={e => setLocationDetails({...locationDetails, street: e.target.value})} />
                        <input placeholder={t('villa')} className="p-6 bg-purple-50 rounded-[24px] font-black" onChange={e => setLocationDetails({...locationDetails, villa: e.target.value})} />
                      </div>
                    </div>
                  )}
                  <div className="flex gap-4">
                    <input placeholder="+971 XX XXX XXXX" className="flex-grow p-6 bg-purple-50 rounded-[24px] font-black" onChange={e => setPhone(e.target.value)} />
                    <button disabled={timer > 0} onClick={handleSendOtp} className="bg-purple-600 text-white px-8 rounded-[24px] font-black text-xs shadow-lg min-w-[140px]">
                      {timer > 0 ? `${t('retry')} ${timer}s` : t('sendOtp')}
                    </button>
                  </div>
                  {otpSent && <input placeholder={t('otpPlaceholder')} maxLength={6} className="w-full p-6 text-center tracking-[1em] bg-purple-50 border-4 border-purple-200 rounded-[24px] font-black text-2xl" onChange={e => setOtp(e.target.value)} />}
                  <button disabled={!isStep2Valid || loading} onClick={handleVerifyOtp} className="w-full bg-purple-600 text-white py-6 rounded-[28px] font-black text-xl shadow-xl disabled:opacity-30">{t('verifyComplete')}</button>
                </div>
              )}

              {step === 3 && (
                 <div className="text-center space-y-8 py-10">
                    <p className="text-2xl font-black text-gray-900">
                      {lang === 'en' ? t('orderInstructionEn') : t('orderInstructionAr')}
                      <a href="https://wa.me/971588537024" target="_blank" rel="noopener noreferrer" className="text-[#25D366] hover:underline"> {t('whatsapp')} </a> 
                      {t('or')} 
                      <a href="https://www.instagram.com/zari.aj25" target="_blank" rel="noopener noreferrer" className="text-[#E1306C] hover:underline"> {t('instagram')}.</a>
                    </p>

                    <button 
                      onClick={(e) => {
                        navigator.clipboard.writeText(lastReceipt);
                        const btn = e.currentTarget;
                        btn.innerHTML = t('copied');
                        btn.style.borderColor = "#059669";
                        btn.style.color = "#059669";
                        setTimeout(() => {
                          btn.innerHTML = t('copyReceipt');
                          btn.style.borderColor = "#9333ea";
                          btn.style.color = "#9333ea";
                        }, 2000);
                      }} 
                      className="w-full border-4 border-purple-600 text-purple-600 py-6 rounded-[28px] font-black text-xl transition-all"
                    >
                      {t('copyReceipt')}
                    </button>
                    <Link to="/" onClick={clearCart} className="block bg-purple-600 text-white py-6 rounded-[28px] font-black text-xl shadow-xl">{t('backToHome')}</Link>
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