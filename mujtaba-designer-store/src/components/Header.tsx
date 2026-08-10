import React, { useState } from 'react';
import { Search, User as UserIcon, Heart, ShoppingBag, Menu, X } from 'lucide-react';
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
  onOpenLocation?: () => void;
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

  const navItems = [
    { key: 'HOME', label: 'HOME' },
    { key: 'NEW ARRIVALS', label: 'NEW ARRIVALS' },
    { key: 'SALE', label: 'SALE' },
    { key: 'BRANDS', label: 'BRANDS' },
    { key: 'FORMALS', label: 'FORMALS' },
    { key: 'PARTY WEAR', label: 'PARTY WEAR' },
    { key: 'LAWN', label: 'LAWN' },
    { key: 'WEDDING WEAR', label: 'WEDDING WEAR' },
    { key: 'STITCHED COLLECTION', label: 'STITCHED COLLECTION' },
    { key: 'WINTER', label: 'WINTER' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Top Announcement Bar - Burgundy */}
      <div className="bg-[#8B1D1D] text-white text-sm font-semibold text-center py-3 px-4">
        Fresh Arrivals / Shop The Latest Collection Now!
      </div>

      {/* Main Header */}
      <div className="border-b border-stone-300 py-4 px-4 sm:px-8">
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

        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo - Center */}
          <div
            className="flex-1 flex justify-center cursor-pointer"
            onClick={() => onSelectCategory('HOME')}
          >
            <img
              src={logoImg}
              alt="Mujtaba Designer"
              className="h-16 w-auto"
            />
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button
              className="p-2 hover:bg-stone-100 rounded-lg"
              title="Search"
            >
              <Search className="w-5 h-5 text-slate-900" />
            </button>

            {user ? (
              <button
                onClick={onOpenProfile}
                className="p-2 hover:bg-stone-100 rounded-lg"
                title="Account"
              >
                <UserIcon className="w-5 h-5 text-slate-900" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="p-2 hover:bg-stone-100 rounded-lg"
                title="Sign In"
              >
                <UserIcon className="w-5 h-5 text-slate-900" />
              </button>
            )}

            {onOpenWishlist && (
              <button
                onClick={onOpenWishlist}
                className="relative p-2 hover:bg-stone-100 rounded-lg"
                title="Wishlist"
              >
                <Heart className="w-5 h-5 text-slate-900" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 bg-rose-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={onOpenCart}
              className="relative p-2 hover:bg-stone-100 rounded-lg"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5 text-slate-900" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-slate-950 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="hidden lg:block border-t border-stone-300">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-center gap-8 py-3">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onSelectCategory(item.key)}
              className={`text-sm font-semibold uppercase tracking-wider transition-colors py-2 border-b-2 ${
                activeCategory === item.key
                  ? 'border-[#8B1D1D] text-[#8B1D1D]'
                  : 'border-transparent text-slate-900 hover:text-[#8B1D1D]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-300 bg-white">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  onSelectCategory(item.key);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded font-semibold uppercase tracking-wider ${
                  activeCategory === item.key
                    ? 'bg-[#8B1D1D] text-white'
                    : 'text-slate-900 hover:bg-stone-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
