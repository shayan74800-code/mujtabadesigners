import React from 'react';

interface CollectionsGridProps {
  onSelectCategory: (category: string) => void;
}

const collections = [
  {
    title: 'Unstitched Lawn',
    category: 'LAWN',
    image: 'https://images.unsplash.com/photo-1595777712802-afa6f1ef8b51?auto=format&fit=crop&w=500&q=80',
  },
  {
    title: 'Wedding Wear',
    category: 'WEDDING WEAR',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=500&q=80',
  },
  {
    title: 'Formals',
    category: 'FORMALS',
    image: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=500&q=80',
  },
  {
    title: 'Party Wear',
    category: 'PARTY WEAR',
    image: 'https://images.unsplash.com/photo-1595908541149-f0d2b9c8d5ab?auto=format&fit=crop&w=500&q=80',
  },
  {
    title: 'Winter Edition',
    category: 'WINTER',
    image: 'https://images.unsplash.com/photo-1589637336369-8d02ffbfd5ba?auto=format&fit=crop&w=500&q=80',
  },
  {
    title: 'Stitched Collection',
    category: 'STITCHED COLLECTION',
    image: 'https://images.unsplash.com/photo-1595777712802-afa6f1ef8b51?auto=format&fit=crop&w=500&q=80',
  },
];

export const CollectionsGrid: React.FC<CollectionsGridProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 uppercase tracking-wider mb-8">
          Our Collections
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {collections.map((collection) => (
            <button
              key={collection.category}
              onClick={() => onSelectCategory(collection.category)}
              className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer"
            >
              <img
                src={collection.image}
                alt={collection.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center p-4">
                <h3 className="text-white font-bold text-sm text-center uppercase tracking-wider">
                  {collection.title}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
