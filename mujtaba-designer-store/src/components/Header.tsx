import React, { useState } from 'react';
import { ShoppingBag, User as UserIcon, Search, MapPin, Phone, Menu, X, Heart, Globe } from 'lucide-react';
import { User } from '../types';
import logoImg from '../assets/images/mujtaba_new_logo_1786264765562.jpg';

interface HeaderProps {
  user: User | null;
  cartCount: number;
  wishlistCount?: number;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenCart: () => void;
  onOpenWishlist?: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenLocation: () => void;
  onOpenPolicies?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: { key: string; label: string }[];
}

export const Header: React.FC<HeaderProps> = ({
  user,
  cartCount,
  wishlistCount = 0,
  activeCategory,
  onSelectCategory,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  onOpenProfile,
  onOpenLocation,
  onOpenPolicies,
  searchQuery,
  onSearchChange,
  categories,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('PKR');

  const rawNavCategories = [
    { key: 'ALL COLLECTIONS', label: 'HOME' },
    { key: 'NEW ARRIVALS', label: 'NEW ARRIVALS' },
    ...categories,
    { key: 'SALE', label: 'SALE' },
  ];

  const navCategories = rawNavCategories.filter(
    (item, index, self) => index === self.findIndex((t) => t.key === item.key)
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-stone-200/90 shadow-sm transition-all">
      {/* Top Luxury Announcement Ticker Bar */}
      <div className="bg-amber-50/90 text-slate-900 text-[11px] font-semibold tracking-[0.2em] uppercase py-2 px-4 sm:px-8 flex flex-wrap justify-between items-center border-b border-amber-200/90">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-slate-900 font-bold">
            MUJTABA DESIGNER | 100% ORIGINAL WOMEN'S LAWN & LUXURY FABRICS | WORLDWIDE EXPRESS SHIPPING
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-6 text-[11px] text-slate-800 font-semibold">
          {/* Currency Switcher */}
          <div className="flex items-center gap-1.5 text-slate-800">
            <Globe className="w-3.5 h-3.5 text-amber-800" />
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="bg-transparent text-amber-900 text-[11px] font-bold focus:outline-none cursor-pointer uppercase"
            >
              <option value="PKR" className="bg-white text-slate-900">PKR (Rs.)</option>
              <option value="USD" className="bg-white text-slate-900">USD ($)</option>
              <option value="GBP" className="bg-white text-slate-900">GBP (£)</option>
              <option value="EUR" className="bg-white text-slate-900">EUR (€)</option>
              <option value="AED" className="bg-white text-slate-900">AED (AED)</option>
            </select>
          </div>

          <a
            href="https://wa.me/923318858108"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-800 transition-colors flex items-center gap-1.5 text-emerald-800 font-bold"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-700" /> Helpline: +92 331 8858108
          </a>

          <button
            onClick={onOpenLocation}
            className="hover:text-amber-800 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-800" /> Store Location
          </button>

          {onOpenPolicies && (
            <button
              onClick={onOpenPolicies}
              className="hover:text-amber-800 transition-colors text-amber-900 font-extrabold cursor-pointer"
            >
              Store Policies
            </button>
          )}
        </div>
      </div>

      {/* Main Brand & Controls Bar */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-3.5 sm:py-5 flex items-center justify-between">
        {/* Mobile Hamburger Menu Trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl text-slate-800 focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <button
            onClick={onOpenLocation}
            className="p-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl text-slate-800"
            title="Store Location"
          >
            <MapPin className="w-5 h-5 text-amber-800" />
          </button>
        </div>

        {/* Center/Left Brand Identity with Logo */}
        <div
          className="flex items-center gap-3 sm:gap-4 cursor-pointer group"
          onClick={() => onSelectCategory('ALL COLLECTIONS')}
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-amber-500/40 p-0.5 overflow-hidden bg-white shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
            <img
              src={logoImg}
              alt="Mujtaba Designer Logo"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-[0.2em] text-slate-950 uppercase leading-none font-ethnocentric">
              MUJTABA DESIGNER
            </span>
            <span className="text-[9px] sm:text-[11px] tracking-[0.38em] text-amber-800 font-bold uppercase mt-1">
              LUXURY FABRICS & UNSTITCHED
            </span>
          </div>
        </div>

        {/* Action Controls Right Bar */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search Toggle / Expanded Input */}
          <div className="relative flex items-center">
            {showSearchInput ? (
              <div className="flex items-center bg-stone-100 rounded-full px-4 py-2 border border-stone-300 shadow-inner">
                <Search className="w-4 h-4 text-stone-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search lawn, unstitched, gents cotton..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm text-slate-900 focus:outline-none w-44 sm:w-64"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setShowSearchInput(false);
                    onSearchChange('');
                  }}
                  className="ml-2 text-stone-400 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                className="p-2.5 sm:p-3 text-slate-800 hover:text-amber-800 transition-colors cursor-pointer rounded-xl hover:bg-stone-100"
                title="Search Products"
              >
                <Search className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* User Account Button */}
          {user ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 bg-stone-100 hover:bg-amber-100 px-3.5 py-2 rounded-full border border-stone-200 text-xs sm:text-sm font-bold text-slate-900 transition-all cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-amber-800 text-white flex items-center justify-center text-xs font-bold">
                {user.firstName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline">{user.firstName}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="p-2.5 sm:px-4 sm:py-2.5 text-slate-800 hover:text-amber-800 transition-colors flex items-center gap-2 text-xs font-bold cursor-pointer rounded-xl hover:bg-stone-100"
              title="Sign In / Register"
            >
              <UserIcon className="w-6 h-6" />
              <span className="hidden sm:inline uppercase tracking-[0.2em] text-xs">
                Account
              </span>
            </button>
          )}

          {/* Wishlist Button */}
          {onOpenWishlist && (
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 sm:p-3 text-slate-800 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer rounded-xl flex items-center gap-1.5"
              title="Wishlist"
            >
              <Heart className="w-6 h-6 text-rose-600 fill-rose-600/20" />
              <span className="hidden sm:inline font-bold text-xs uppercase tracking-wider text-slate-800">
                Wishlist
              </span>
              {wishlistCount > 0 && (
                <span className="bg-rose-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-md">
                  {wishlistCount}
                </span>
              )}
            </button>
          )}

          {/* Shopping Bag Button */}
          <button
            onClick={onOpenCart}
            className="relative p-3 bg-amber-800 text-white hover:bg-amber-900 transition-colors cursor-pointer rounded-xl shadow-lg flex items-center gap-2"
            aria-label="Open Shopping Bag"
          >
            <ShoppingBag className="w-6 h-6 text-amber-200" />
            <span className="hidden sm:inline font-bold text-xs uppercase tracking-widest">Bag</span>
            {cartCount > 0 && (
              <span className="bg-white text-slate-950 text-xs font-extrabold px-2 py-0.5 rounded-full shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="hidden lg:block bg-stone-50 border-t border-stone-200">
        <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-center gap-8 py-3">
          {navCategories.map((item) => {
            const isActive = activeCategory === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onSelectCategory(item.key)}
                className={`text-xs font-bold tracking-[0.22em] uppercase transition-all py-1 border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-amber-800 text-amber-900 font-extrabold'
                    : 'border-transparent text-slate-700 hover:text-slate-950 hover:border-slate-400'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            onClick={onOpenLocation}
            className="text-xs font-bold tracking-[0.22em] uppercase text-amber-800 hover:text-amber-950 py-1 flex items-center gap-1.5 cursor-pointer border-b-2 border-transparent"
          >
            <MapPin className="w-4 h-4" /> LOCATION
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-2xl border-t border-stone-200 px-6 py-6 space-y-4 shadow-2xl">
          <div className="text-xs font-extrabold tracking-[0.3em] text-amber-800 uppercase mb-3">
            MUJTABA DESIGNER COLLECTIONS
          </div>
          {navCategories.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                onSelectCategory(item.key);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-3 text-sm font-bold uppercase tracking-[0.2em] border-b border-stone-100 ${
                activeCategory === item.key ? 'text-amber-800 font-extrabold bg-amber-50/50 px-3 rounded-lg' : 'text-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 space-y-3">
            <button
              onClick={() => {
                onOpenLocation();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-amber-800 font-bold py-3 px-4 bg-amber-50 rounded-xl w-full"
            >
              <MapPin className="w-5 h-5 text-amber-800" /> Store Location & Hours
            </button>
            <a
              href="https://wa.me/923318858108"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-emerald-800 font-bold py-3 px-4 bg-emerald-50 rounded-xl w-full"
            >
              <Phone className="w-5 h-5 text-emerald-700" /> Complaint Line: +92 331 8858108
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
