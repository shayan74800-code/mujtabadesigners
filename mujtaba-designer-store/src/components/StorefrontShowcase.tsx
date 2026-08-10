import React from 'react';
import { ArrowRight, BadgeCheck, Sparkles, Store, Truck, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface StorefrontShowcaseProps {
  products: Product[];
  onExplore: (category: string) => void;
  onQuickView: (product: Product) => void;
}

const collectionCards = [
  {
    title: 'Unstitched Lawn',
    blurb: 'Soft cotton blends, premium prints, and summer luxury for every celebration.',
    badge: 'Fresh Drop',
    category: 'UNSTITCHED LAWN',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Bridal & Couture',
    blurb: 'Velvet, silk, and statement embroidery for elegant evenings and nuptial moments.',
    badge: 'Bespoke',
    category: 'COUTURE',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Festive Pret',
    blurb: 'Ready-to-wear elegance with rich fabrics and refined finishing touches.',
    badge: 'Trending',
    category: 'FESTIVE PRET',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Winter Edition',
    blurb: 'Heavy textures, rich colors, and layered couture crafted for colder seasons.',
    badge: 'Limited',
    category: 'WINTER',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
  },
];

export const StorefrontShowcase: React.FC<StorefrontShowcaseProps> = ({ products, onExplore, onQuickView }) => {
  const featuredProducts = products.slice(0, 4);

  return (
    <section className="w-full bg-[#f9f4ee] border-y border-stone-200/90">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-stretch">
          <div className="rounded-[2rem] border border-stone-200 bg-gradient-to-br from-[#0f172a] via-[#2c1d17] to-[#7a1111] p-8 sm:p-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.16)]">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.32em] text-[#f6d9a8]">
              <Sparkles className="w-3.5 h-3.5" />
              Luxury at every stitch
            </div>
            <h3 className="mt-6 font-serif text-3xl sm:text-4xl font-semibold leading-tight">
              Signature fabrics that bring timeless grace to every occasion.
            </h3>
            <p className="mt-4 max-w-2xl text-sm sm:text-base leading-7 text-stone-200">
              Discover premium lawn, couture, bridals, and festive pret curated with a refined palette and impeccable craftsmanship.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => onExplore('UNSTITCHED LAWN')}
                className="rounded-full bg-[#f2b447] px-5 py-3 text-sm font-bold uppercase tracking-[0.24em] text-[#161616] transition hover:scale-[1.02]"
              >
                Shop Lawn Edit
              </button>
              <button
                onClick={() => onExplore('COUTURE')}
                className="rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold uppercase tracking-[0.24em] text-white transition hover:bg-white/20"
              >
                Explore Couture
              </button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, label: '100% Original Collections' },
                { icon: Truck, label: 'Express Delivery Across Pakistan' },
                { icon: Store, label: 'Boutique Store in Rawalpindi' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-sm">
                  <item.icon className="h-5 w-5 text-[#f2b447]" />
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-100">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {collectionCards.map((card) => (
              <button
                key={card.title}
                onClick={() => onExplore(card.category)}
                className="group relative overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white text-left shadow-sm transition hover:-translate-y-1"
              >
                <img src={card.image} alt={card.title} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/80 via-[#131313]/45 to-transparent" />
                <div className="relative flex min-h-[132px] flex-col justify-between p-5 sm:p-6 text-white">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.3em] text-[#f6d9a8]">
                      {card.badge}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-200">{card.category}</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">{card.title}</h4>
                    <p className="mt-2 max-w-xs text-sm text-stone-200">{card.blurb}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 rounded-[2rem] border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#7a1111]">Featured Picks</p>
              <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-semibold text-slate-950">Trending pieces curated for the modern wardrobe.</h3>
            </div>
            <button
              onClick={() => onExplore('ALL COLLECTIONS')}
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-slate-700 hover:text-[#7a1111]"
            >
              View all collections <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => onQuickView(product)}
                className="group rounded-[1.25rem] border border-stone-200 bg-[#fcfbf9] p-4 text-left transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="overflow-hidden rounded-[1rem]">
                  <img src={product.images[0]} alt={product.title} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#7a1111]">{product.category}</p>
                    <h4 className="mt-1 font-serif text-lg font-semibold text-slate-950">{product.title}</h4>
                  </div>
                  <div className="rounded-full bg-[#f6e8cc] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8d4d11]">
                    {product.salePrice ? 'Sale' : 'New'}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-stone-600 line-clamp-2">{product.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm font-semibold text-slate-900">
                  <span>Rs. {product.salePrice ? product.salePrice.toLocaleString() : product.price.toLocaleString()}</span>
                  <span className="text-[#7a1111]">View</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
