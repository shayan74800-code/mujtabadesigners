import React from 'react';
import { Instagram } from 'lucide-react';

export const InstagramSection: React.FC = () => {
  const instagramImages = [
    'https://images.unsplash.com/photo-1505391566245-253d7c61c71d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1551028719-00167b16ebc5?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1490481651969-e0121603e61e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1505042588941-c86e6aa27840?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1539613881829-d62e2ead3815?auto=format&fit=crop&w=400&q=80',
  ];

  return (
    <section className="py-16 sm:py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 uppercase tracking-wider">
            Follow Us On Instagram
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramImages.map((image, idx) => (
            <a
              key={idx}
              href="https://www.instagram.com/mujtaba_designers_"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-lg aspect-square"
            >
              <img
                src={image}
                alt="Mujtaba Designer Instagram"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <Instagram className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://www.instagram.com/mujtaba_designers_"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#8B1D1D] text-white px-8 py-3 rounded-full font-semibold uppercase tracking-wider hover:bg-[#6D1515] transition-colors"
          >
            <Instagram className="w-5 h-5" />
            Follow Us
          </a>
        </div>
      </div>
    </section>
  );
};
