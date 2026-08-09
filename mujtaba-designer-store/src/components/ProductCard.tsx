import React, { useState } from 'react';
import { Eye, ShoppingBag, Check, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, selectedSize: string) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const mainImage = product.images[0];
  const secondImage = product.images[1] || mainImage;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product);
    }
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group bg-white border border-stone-200/90 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-slate-300 flex flex-col cursor-pointer transform hover:-translate-y-1 relative"
    >
      {/* Image Gallery Thumbnail Container - Expanded Aspect Ratio */}
      <div className="relative aspect-[3/4] min-h-[380px] sm:min-h-[440px] w-full bg-stone-100 overflow-hidden">
        <img
          src={mainImage}
          alt={product.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Hover image overlay if multiple images exist */}
        {product.images.length > 1 && (
          <img
            src={secondImage}
            alt={`${product.title} view 2`}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {/* Category & Sale Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.salePrice && (
            <span className="bg-slate-950 text-white text-xs font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-lg shadow-sm">
              SALE
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-slate-900 text-white text-xs font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-lg shadow-sm border border-slate-200">
              FEATURED COUTURE
            </span>
          )}
        </div>

        {/* Wishlist Heart Button - Top Right */}
        {onToggleWishlist && (
          <button
            onClick={handleWishlistClick}
            className={`absolute top-4 right-4 z-20 p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg border ${
              isWishlisted
                ? 'bg-rose-600 text-white border-rose-500 scale-110'
                : 'bg-white/80 hover:bg-white text-slate-900 border-white/60 hover:text-rose-600'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
          </button>
        )}

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-white/95 via-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm tracking-[0.2em] uppercase rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-white" />
            Quick View
          </button>
        </div>
      </div>

      {/* Card Information Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-white border-t border-stone-100">
        <div>
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-slate-500 block mb-1.5">
            {product.category} {product.collection ? `• ${product.collection}` : ''}
          </span>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-950 group-hover:text-amber-800 transition-colors line-clamp-1">
            {product.title}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 mt-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Size Selection Pills - Large Touch Targets */}
        <div className="mt-4 pt-3 border-t border-stone-100">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Size:</span>
            <span className="font-bold text-slate-950">{selectedSize}</span>
          </div>
          <div className="flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
            {product.sizes.map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSize(sz)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                  selectedSize === sz
                    ? 'border-slate-950 bg-slate-950 text-white font-bold shadow-sm'
                    : 'border-stone-200 text-slate-700 hover:border-slate-400 bg-slate-100'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
          <div className="flex flex-col">
            {product.salePrice ? (
              <div className="flex items-baseline gap-2">
                <span className="font-sans text-lg sm:text-xl font-bold text-amber-900">
                  Rs. {product.salePrice.toLocaleString()}
                </span>
                <span className="font-sans text-xs sm:text-sm text-stone-400 line-through">
                  Rs. {product.price.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="font-sans text-lg sm:text-xl font-bold text-slate-950">
                Rs. {product.price.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className={`px-4 sm:px-5 py-3 text-xs font-bold tracking-[0.15em] uppercase rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              addedAnimation
                ? 'bg-slate-950 text-white'
                : 'bg-slate-950 hover:bg-slate-800 text-white'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Add to Bag
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
