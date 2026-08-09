import React, { useState } from 'react';
import { X, ShoppingBag, ShieldCheck, Truck, Phone, Heart, Check, ChevronRight } from 'lucide-react';
import { Product } from '../types';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedSize: string) => void;
  onBuyNow: (product: Product, selectedSize: string) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(product.images[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [customStitchingNotes, setCustomStitchingNotes] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuy = () => {
    onBuyNow(product, selectedSize);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-white/90 backdrop-blur-2xl rounded-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden max-h-[92vh] flex flex-col md:flex-row border border-white/50">
        {/* Close Modal Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-slate-950 hover:text-white rounded-full text-slate-800 transition-colors shadow-lg cursor-pointer border border-gray-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery View */}
        <div className="w-full md:w-1/2 bg-stone-100 p-4 flex flex-col items-center justify-center">
          <div className="relative w-full aspect-[3/4] max-h-[420px] overflow-hidden bg-white shadow-xs">
            <img
              src={selectedImage || product.images[0]}
              alt={product.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Gallery Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto max-w-full pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-16 h-20 flex-shrink-0 border-2 transition-all cursor-pointer overflow-hidden ${
                    selectedImage === img ? 'border-amber-800 scale-105' : 'border-stone-200 opacity-70'
                  }`}
                >
                  <img src={img} loading="lazy" alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-amber-800 font-semibold mb-1">
              <span>{product.category}</span>
              {product.collection && <span>• {product.collection}</span>}
            </div>

            <h2 className="font-serif text-2xl font-bold text-slate-900 leading-tight">
              {product.title}
            </h2>

            {/* Price section */}
            <div className="my-3 flex items-baseline gap-3">
              {product.salePrice ? (
                <>
                  <span className="text-2xl font-bold text-amber-900">
                    Rs. {product.salePrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-stone-400 line-through">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    SPECIAL OFFER
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-slate-900">
                  Rs. {product.price.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3 mb-4">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-900">SIZE / MEASUREMENT</span>
                <span className="text-amber-800 text-[11px] font-medium underline cursor-pointer">
                  Custom Size Guide
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3.5 py-1.5 text-xs font-medium border transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'border-amber-800 bg-amber-800 text-white font-bold shadow-xs'
                        : 'border-stone-300 text-slate-700 hover:border-slate-500 bg-stone-50'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {selectedSize === 'Custom Stitching' && (
              <div className="mb-4 bg-amber-50/60 p-3 border border-amber-200/80 rounded-none text-xs">
                <label className="block text-[11px] font-semibold text-amber-900 uppercase mb-1">
                  Custom Measurements / Collar & Sleeve Notes:
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Chest: 40 inches, Shoulder: 18 inches, Length: 42 inches"
                  value={customStitchingNotes}
                  onChange={(e) => setCustomStitchingNotes(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-stone-300 focus:outline-none focus:border-amber-800"
                />
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-stone-100 mt-4">
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className={`flex-1 py-3 px-3 text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer rounded-lg ${
                  addedAnimation
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" /> Added
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-amber-300" /> Add to Bag
                  </>
                )}
              </button>

              <button
                onClick={handleBuy}
                className="flex-1 py-3 px-3 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-1 cursor-pointer rounded-lg"
              >
                Buy Now <ChevronRight className="w-4 h-4" />
              </button>

              {onToggleWishlist && (
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3 border rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                    isWishlisted
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-stone-100 hover:bg-rose-50 border-stone-300 text-stone-700 hover:text-rose-600'
                  }`}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
                </button>
              )}
            </div>

            {/* Guarantees & Contact */}
            <div className="pt-3 flex flex-wrap justify-between text-[11px] text-stone-500 border-t border-stone-100">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-amber-800" /> Worldwide Shipping
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-800" /> 100% Authentic Handcraft
              </span>
              <a
                href="https://wa.me/923318858108"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-emerald-700 hover:underline font-medium"
              >
                <Phone className="w-3.5 h-3.5" /> Order via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
