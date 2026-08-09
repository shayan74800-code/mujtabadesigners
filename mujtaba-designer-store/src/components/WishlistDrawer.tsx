import React from 'react';
import { Product } from '../types';
import { X, Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveWishlist: (productId: string) => void;
  onClearWishlist: () => void;
  onAddToCart: (product: Product, size: string) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveWishlist,
  onClearWishlist,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white text-slate-950 shadow-2xl flex flex-col justify-between border-l border-stone-200">
          {/* Drawer Header */}
          <div className="p-6 bg-slate-950 text-white border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
                <Heart className="w-5 h-5 fill-rose-400" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold uppercase tracking-widest text-white">
                  My Favourites Wishlist
                </h2>
                <p className="text-[11px] text-amber-300 font-semibold uppercase tracking-wider">
                  {wishlist.length} {wishlist.length === 1 ? 'Saved Outfit' : 'Saved Outfits'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wishlist Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {wishlist.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-stone-300 mb-4 border border-stone-200">
                  <Heart className="w-10 h-10 text-stone-300" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900">Your Wishlist is Empty</h3>
                <p className="text-stone-500 text-xs mt-2 max-w-xs leading-relaxed">
                  Save your favourite haute couture dresses, sherwanis & velvet gowns by tapping the heart icon on any product.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-3 bg-slate-950 text-amber-300 text-xs font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-amber-800 hover:text-white transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <span>Browse Collections</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-stone-200 text-xs">
                  <span className="text-stone-500 uppercase tracking-wider font-semibold">Saved Outfits ({wishlist.length})</span>
                  <button
                    onClick={onClearWishlist}
                    className="text-stone-500 hover:text-red-700 font-bold uppercase tracking-wider text-[11px] cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                {wishlist.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 bg-stone-50/80 rounded-2xl border border-stone-200/90 flex gap-4 items-center hover:bg-white hover:shadow-md transition-all group relative"
                  >
                    <div className="w-20 h-28 rounded-xl overflow-hidden bg-stone-200 flex-shrink-0 border border-stone-200">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                      <div>
                        <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block">
                          {product.category}
                        </span>
                        <h4 className="font-serif text-sm font-bold text-slate-950 truncate mt-0.5">
                          {product.title}
                        </h4>
                        <div className="text-xs font-bold text-slate-900 mt-1">
                          {product.salePrice ? (
                            <span className="flex items-center gap-2">
                              <span className="text-amber-900">Rs. {product.salePrice.toLocaleString()}</span>
                              <span className="text-stone-400 line-through text-[11px]">Rs. {product.price.toLocaleString()}</span>
                            </span>
                          ) : (
                            <span>Rs. {product.price.toLocaleString()}</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => {
                            onAddToCart(product, product.sizes[0] || 'M');
                            onRemoveWishlist(product.id);
                          }}
                          className="flex-1 py-2 px-3 bg-slate-950 hover:bg-amber-800 text-white font-bold text-[10px] uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                          <span>Move to Bag</span>
                        </button>

                        <button
                          onClick={() => onRemoveWishlist(product.id)}
                          className="p-2 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {wishlist.length > 0 && (
            <div className="p-6 bg-stone-100 border-t border-stone-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-600">
                <span>Wishlist Total Value:</span>
                <span className="font-bold text-slate-950 font-sans text-sm">
                  Rs. {wishlist.reduce((acc, p) => acc + (p.salePrice || p.price), 0).toLocaleString()}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3.5 bg-slate-950 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-md cursor-pointer text-center block"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
