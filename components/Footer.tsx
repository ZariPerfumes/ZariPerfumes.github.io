
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../AppContext';
import { UI_STRINGS } from '../translations';
import { STORES } from '../data';

// Path to your custom logo image in the images folder
const LOGO_URL = "logo.png";

const Footer: React.FC = () => {
  const { lang } = useApp();
  const t = (key: string) => UI_STRINGS[key]?.[lang] || key;

  return (
    <footer className="bg-purple-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Licensing */}
        <div className="text-center mb-12">
          <p className="text-lg opacity-80">{t('licensedUAE')}</p>
          <div className="h-[1px] bg-white/20 mt-6 max-w-4xl mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                <img src={LOGO_URL} alt="Zari Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-black tracking-tighter">Zari</span>
            </Link>
            <p className="text-white/70 leading-relaxed font-medium">
              {t('footerAbout')}
            </p>
          </div>

          {/* Stores */}
          <div className="space-y-4">
            <h4 className="text-lg font-black uppercase tracking-widest text-purple-300">{t('ourStores')}</h4>
            <ul className="space-y-2">
              {STORES.map(s => (
                <li key={s.id}>
                  <Link to={`/stores/${s.id}`} className="text-white/70 hover:text-white transition-colors font-medium">
                    {lang === 'en' ? s.nameEn : s.nameAr}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-black uppercase tracking-widest text-purple-300">{t('contactUs')}</h4>
            <div className="space-y-3">
              <a href="https://instagram.com/zari.aj25" target="_blank" className="flex items-center gap-3 text-white/70 hover:text-white transition-all font-medium">
                <img src="images/icons/instagram.svg" className="w-5 h-5 invert" alt="insta" />
                @zari.aj25
              </a>
              <a href="#" className="flex items-center gap-3 text-white/70 hover:text-white transition-all font-medium">
                <img src="images/icons/tiktok.svg" className="w-5 h-5 invert" alt="tiktok" />
                @zari.aj25
              </a>
              <a href="https://wa.me/971588537024" target="_blank" className="flex items-center gap-3 text-white/70 hover:text-white transition-all font-medium">
                <img src="images/icons/whatsapp.svg" className="w-5 h-5 invert" alt="wa" />
                +971 58 853 7024
              </a>
              <a href="https://maps.app.goo.gl/wFuaKvBwv1ArSuis9" target="_blank" className="flex items-center gap-3 text-white/70 hover:text-white transition-all font-medium">
                <img src="images/icons/location.svg" className="w-5 h-5 invert" alt="loc" />
                Ajman, UAE
              </a>
            </div>
          </div>

          {/* Social Icons Grid */}
          <div className="space-y-4">
            <h4 className="text-lg font-black uppercase tracking-widest text-purple-300">{t('followUs')}</h4>
            <div className="flex gap-4">
                <a href="https://instagram.com/zari.aj25" target="_blank" className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-purple-600 transition-all shadow-lg active:scale-90">
                    <img src="images/icons/instagram.svg" className="w-6 h-6 invert" alt="insta" />
                </a>
                <a href="#" className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-purple-600 transition-all shadow-lg active:scale-90">
                    <img src="images/icons/tiktok.svg" className="w-6 h-6 invert" alt="tiktok" />
                </a>
                <a href="https://wa.me/971588537024" target="_blank" className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-purple-600 transition-all shadow-lg active:scale-90">
                    <img src="images/icons/whatsapp.svg" className="w-6 h-6 invert" alt="wa" />
                </a>
            </div>
          </div>
        </div>

        <div className="h-[2px] bg-white/10 mt-16 mb-8 rounded-full"></div>
        <p className="text-center text-white/40 text-xs font-bold uppercase tracking-widest">{t('copyright')}</p>
      </div>
    </footer>
  );
};

export default Footer;
