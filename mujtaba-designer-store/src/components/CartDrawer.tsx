import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { CartItem, User } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  user: User | null;
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
  onOpenAuth: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  user,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onOpenAuth,
}) => {
  if (!isOpen) return null;

  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity,
    0
  );

  const freeShippingThreshold = 100000;
  const progressToFreeShipping = Math.min((totalAmount / freeShippingThreshold) * 100, 100);

  const handleCheckoutClick = () => {
    if (!user) {
      onClose();
      onOpenAuth();
    } else {
      onProceedToCheckout();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-md">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white/85 backdrop-blur-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] flex flex-col border-l border-white/50">
          {/* Drawer Header */}
          <div className="p-5 bg-slate-950/90 text-white flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="font-serif text-lg font-bold tracking-[0.2em] uppercase">
                Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-amber-50 p-3 border-b border-amber-200/60 text-xs">
            <div className="flex justify-between items-center text-amber-900 font-medium mb-1">
              <span>
                {totalAmount >= freeShippingThreshold ? (
                  <strong className="text-emerald-800">🎉 Qualified for Free Worldwide Express Shipping!</strong>
                ) : (
                  `Add Rs. ${(freeShippingThreshold - totalAmount).toLocaleString()} more for Free Shipping`
                )}
              </span>
            </div>
            <div className="w-full h-1.5 bg-amber-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-800 transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <ShoppingBag className="w-12 h-12 stroke-[1.2] mb-3 text-stone-300" />
                <p className="font-serif text-lg text-slate-800 font-light">Your shopping bag is empty.</p>
                <p className="text-xs text-stone-500 mt-1">
                  Explore our luxury haute couture collections to add bespoke garments.
                </p>
              </div>
            ) : (
              cart.map((item, idx) => {
                const itemPrice = item.product.salePrice || item.product.price;
                return (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${idx}`}
                    className="flex gap-4 p-3 border border-stone-200/80 bg-stone-50/50 relative group"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-20 h-24 object-cover flex-shrink-0 bg-stone-200"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start pr-6">
                          <h4 className="font-serif text-xs font-semibold text-slate-900 leading-snug">
                            {item.product.title}
                          </h4>
                        </div>
                        <span className="text-[11px] text-amber-800 font-semibold block mt-0.5">
                          Size: {item.selectedSize}
                        </span>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-stone-300 bg-white">
                          <button
                            onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-slate-700 hover:bg-stone-100"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-900">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-slate-700 hover:bg-stone-100"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-sans text-xs font-bold text-slate-900">
                          Rs. {(itemPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(idx)}
                      className="absolute top-2 right-2 p-1 text-stone-400 hover:text-red-700 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
              <div className="flex justify-between text-sm font-semibold text-slate-900">
                <span>Subtotal</span>
                <span>Rs. {totalAmount.toLocaleString()}</span>
              </div>

              {!user && (
                <div className="p-2.5 bg-amber-100/80 border border-amber-300 text-amber-900 text-[11px] flex items-center gap-1.5 font-medium">
                  <Lock className="w-3.5 h-3.5 text-amber-800 flex-shrink-0" />
                  <span>Account Required: Please Sign Up / Log In before placing your order.</span>
                </div>
              )}

              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 bg-slate-900 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {user ? (
                  <>
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Sign In / Sign Up to Checkout <Lock className="w-4 h-4 text-amber-300" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-stone-400 text-center uppercase tracking-widest flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Guaranteed Authentic Luxury Couture
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
