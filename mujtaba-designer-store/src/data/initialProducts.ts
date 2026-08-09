import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Gull-e-Emerald Silk Velvet Outfit',
    description: 'Deep emerald green micro-velvet long shirt encrusted with hand-worked antique gold dabka, marori, and zardozi detailing. Paired with crushed silk pants and a heavy embellished net dupatta.',
    price: 185000,
    salePrice: 165000,
    category: 'Couture',
    collection: 'Velvet Edition 2026',
    images: [
      '/src/assets/images/designer_couture_suit_1786177248353.jpg',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'Custom Stitching'],
    inStock: true,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    title: 'Noor-e-Jehan Crimson Velvet Ensemble',
    description: 'Regal crimson micro-velvet shirt embellished with intricate threadwork, cutdana, and gold sequins. Includes organza dupatta with scalloped zardozi borders and raw silk trousers.',
    price: 210000,
    salePrice: 195000,
    category: 'Couture',
    collection: 'Bridal Heritage',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'Custom Stitching'],
    inStock: true,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    title: 'Shehrnaz Chiffon Embroidered Formal',
    description: 'Bespoke midnight blue chiffon shirt embellished with intricate silver zari, gota patti, and mirror work. Accompanied by silk crushed trousers and a embroidered chiffon dupatta.',
    price: 125000,
    salePrice: 110000,
    category: 'Festive Pret',
    collection: 'Chiffon Luxe 2026',
    images: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'Custom Stitching'],
    inStock: true,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-4',
    title: 'Gulrukh Unstitched Luxury Lawn 3-Piece',
    description: '100% Original Egyptian lawn 3-piece suit featuring embroidered neckline patches, digital print organza borders, digitally printed silk dupatta, and dyed lawn trousers.',
    price: 34500,
    salePrice: 29500,
    category: 'Unstitched Lawn',
    collection: 'Lawn Edition 2026',
    images: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['Unstitched', 'Custom Stitching Available'],
    inStock: true,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-5',
    title: 'Mehrunissa Organza Zardozi Formal',
    description: 'Ethereal pastel mint organza flared shirt with hand-sewn resham and pearl embellishments. Includes viscose lining, silk trousers, and heavily embroidered organza shawl.',
    price: 145000,
    category: 'Festive Pret',
    collection: 'Royal Heritage',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'Custom Stitching'],
    inStock: true,
    isFeatured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-6',
    title: 'Aira Handcrafted Lawn 3-Piece Edition',
    description: '100% original premium Egyptian cotton lawn digitally printed with subtle floral motifs and hand-worked neckline embroidery. Includes chiffon ombre dupatta and lawn pants.',
    price: 32000,
    category: 'Unstitched Lawn',
    collection: 'Lawn Edition 2026',
    images: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['Unstitched', 'S', 'M', 'L'],
    inStock: true,
    isFeatured: true,
    createdAt: new Date().toISOString()
  }
];
