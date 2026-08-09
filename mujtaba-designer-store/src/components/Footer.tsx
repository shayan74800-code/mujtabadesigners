import React, { useState } from 'react';
import { Phone, MapPin, Mail, MessageSquare, Instagram, Facebook, ArrowRight, ShieldCheck, RefreshCw, Truck } from 'lucide-react';
import logoImg from '../assets/images/mujtaba_new_logo_1786264765562.jpg';

interface FooterProps {
  onOpenLocation: () => void;
  onSelectCategory: (category: string) => void;
  onOpenPolicies?: (tab?: 'returns' | 'shipping' | 'privacy' | 'complaints') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLocation, onSelectCategory, onOpenPolicies }) => {
  const [emailSub, setEmailSub] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);

  const complaintPhone = "+92 331 8858108";
  const storeAddress = "Shop No G 90/91, Rabi Saddar, Adamjee Road, Rawalpindi, Pakistan";
  const mapsUrl = "https://maps.app.goo.gl/cnQJurxWFzrfpRLYA";

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailSub) {
      setSubSuccess(true);
      setEmailSub('');
      setTimeout(() => setSubSuccess(false), 4000);
    }
  };

  return (
    <footer className="bg-[#0b0f17] text-white pt-16 pb-12 relative border-t border-amber-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Col 1: Brand Info & Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-amber-400/40 p-0.5 overflow-hidden bg-white shadow-md">
                <img
                  src={logoImg}
                  alt="Mujtaba Designer Logo"
                  loading="lazy"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-ethnocentric text-lg font-extrabold tracking-[0.25em] text-white uppercase leading-tight">
                  MUJTABA DESIGNER
                </span>
                <span className="text-[9px] tracking-[0.38em] text-amber-400 font-semibold uppercase">
                  LUXURY FABRICS & UNSTITCHED
                </span>
              </div>
            </div>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Pakistan's leading boutique house for 100% original unstitched Egyptian lawn, velvet, silk, chiffon, and bespoke bridal couture.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/923318858108"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-stone-900 border border-emerald-500/40 hover:bg-emerald-700 text-emerald-400 hover:text-white flex items-center justify-center transition-colors"
                title="WhatsApp Support"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href="tel:03318858108"
                className="w-8 h-8 rounded-full bg-stone-900 border border-stone-700 hover:bg-amber-700 text-stone-200 hover:text-white flex items-center justify-center transition-colors"
                title="Complaint & Support Line"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-stone-900 border border-stone-700 hover:bg-amber-700 text-stone-200 hover:text-white flex items-center justify-center transition-colors"
                title="Google Maps Location"
              >
                <MapPin className="w-4 h-4" />
              </a>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.instagram.com/mujtaba_designers_?utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-stone-900 border border-stone-700 hover:bg-stone-800 text-stone-300 flex items-center justify-center transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/share/1EGmNs7afC/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-stone-900 border border-stone-700 hover:bg-stone-800 text-stone-300 flex items-center justify-center transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@mujtabadesigenero?_r=1&_t=ZS-98iWriHXdFE"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-stone-900 border border-stone-700 hover:bg-stone-800 text-stone-300 flex items-center justify-center transition-colors"
                title="TikTok"
              >
                <svg className="w-4 h-4 fill-current text-stone-300" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.34 22a6.33 6.33 0 0 0 6.33-6.33V9.05a8.16 8.16 0 0 0 4.92 1.62V7.22a4.85 4.85 0 0 1-1-.53z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Luxury Collections */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-xs font-bold tracking-[0.25em] text-amber-400 uppercase">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onSelectCategory('UNSTITCHED LAWN')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Unstitched Lawn & Cotton
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('COUTURE')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Velvet & Bridal Couture
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('FESTIVE PRET')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Chiffon & Festive Formal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('SALE')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-amber-400 font-semibold"
                >
                  Special Offers & Sale
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Support, Location & Policies */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-xs font-bold tracking-[0.25em] text-amber-400 uppercase">
              Store & Policies
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <a href="mailto:mujtabad427@gmail.com" className="hover:text-amber-300 text-stone-200">
                  mujtabad427@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <a href={`tel:${complaintPhone}`} className="hover:text-white font-semibold text-stone-200">
                  Complaint Line: {complaintPhone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 leading-tight">
                  {storeAddress}
                </a>
              </li>

              {onOpenPolicies && (
                <>
                  <li className="pt-2 border-t border-stone-800">
                    <button
                      onClick={() => onOpenPolicies('returns')}
                      className="hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer text-amber-300/90 font-medium"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> 7-Day Return & Exchange Policy
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onOpenPolicies('shipping')}
                      className="hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5" /> Express Shipping & Cash on Delivery
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onOpenPolicies('privacy')}
                      className="hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> 100% Brand Authenticity Guarantee
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Col 4: VIP Newsletter */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-xs font-bold tracking-[0.25em] text-amber-400 uppercase">
              VIP Privileges
            </h4>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Subscribe to receive exclusive preview invites to Lawn & Winter collections.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex border border-stone-800 bg-stone-900 rounded-lg overflow-hidden focus-within:border-amber-500">
                <input
                  type="email"
                  required
                  placeholder="Enter your email..."
                  value={emailSub}
                  onChange={(e) => setEmailSub(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-transparent text-white focus:outline-none placeholder-stone-500"
                />
                <button
                  type="submit"
                  className="px-3 bg-amber-800 hover:bg-amber-700 text-white font-bold text-xs uppercase transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {subSuccess && (
                <p className="text-[11px] text-emerald-400">
                  Thank you for subscribing to Mujtaba Designer VIP updates.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500 gap-4">
          <p>© 2026 MUJTABA DESIGNER. All Rights Reserved.</p>
          <div className="flex flex-wrap gap-6 uppercase tracking-[0.2em] text-[9px] font-semibold text-stone-400">
            <span>100% Original Lawn & Fabrics</span>
            <span>Worldwide Express Delivery</span>
            <span>Cash on Delivery</span>
          </div>
        </div>
      </div>

      {/* Floating Sticky WhatsApp Quick Button */}
      <a
        href="https://wa.me/923318858108"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 group transition-all hover:scale-105 border border-emerald-400/40"
        title="Complaint & WhatsApp Hotline: +92 331 8858108"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-xs font-bold uppercase tracking-wider pr-1">
          Helpline +92 331 8858108
        </span>
      </a>
    </footer>
  );
};
