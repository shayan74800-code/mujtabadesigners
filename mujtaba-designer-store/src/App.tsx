import React, { useState, useEffect, Suspense } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { Header } from './components/Header';
const HeroSection = React.lazy(() => import('./components/HeroSection').then((m) => ({ default: m.HeroSection })));
const VideoShowcaseSection = React.lazy(() => import('./components/VideoShowcaseSection').then((m) => ({ default: m.VideoShowcaseSection })));
import { ProductCard } from './components/ProductCard';
import { ProductQuickView } from './components/ProductQuickView';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { UserProfileModal } from './components/UserProfileModal';
import { LocationModal } from './components/LocationModal';
import { PoliciesModal } from './components/PoliciesModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CMSView } from './components/CMSView';
import { Footer } from './components/Footer';
import { AssistantChat } from './components/AssistantChat';
import { StorefrontShowcase } from './components/StorefrontShowcase';
import { Product, CartItem, User, AdminUser, VideoSettings } from './types';
import { INITIAL_PRODUCTS } from './data/initialProducts';

export default function App() {
  const [loading, setLoading] = useState(true);

  // Router Path State
  const [currentPath, setCurrentPath] = useState<string>(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // App State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  // Wishlist State
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('mujtaba_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mujtaba_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist:', e);
    }
  }, [wishlist]);

  // Video Settings State
  const [videoSettings, setVideoSettings] = useState<VideoSettings | null>(null);

  const categoryLabels: Record<string, string> = {
    'ALL COLLECTIONS': 'HOME',
    'NEW ARRIVALS': 'NEW ARRIVALS',
    'UNSTITCHED LAWN': 'UNSTITCHED LAWN',
    'UNSTITCHED': 'UNSTITCHED LAWN',
    'COUTURE': 'BRIDAL & COUTURE',
    'LUXURY LAWN': 'LAWN EDITION',
    'STITCHED': 'STITCHED PRET',
    'FESTIVE PRET': 'FESTIVE PRET',
    'WINTER': 'WINTER EDITION',
    'SALE': 'SPECIAL SALE',
  };

  const availableCategories = Array.from(
    new Set(products.map((product) => product.category.toUpperCase()))
  ) as string[];

  const menuCategories = [
    'ALL COLLECTIONS',
    'NEW ARRIVALS',
    ...availableCategories,
    'SALE',
  ].filter((value, index, self) => self.indexOf(value) === index) as string[];

  const fetchVideoSettings = async () => {
    try {
      const res = await fetch('/api/settings/video');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { parseJSONSafe } = await import('./utils/response');
      const data = await parseJSONSafe(res);
      if (res.ok && data) {
        setVideoSettings(data);
      }
    } catch (e) {
      console.warn('Failed to fetch video settings:', e);
    }
  };

  useEffect(() => {
    fetchVideoSettings();
  }, []);

  // Navigation & Search State
  const [activeCategory, setActiveCategory] = useState<string>('ALL COLLECTIONS');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [wishlistDrawerOpen, setWishlistDrawerOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [policiesModalOpen, setPoliciesModalOpen] = useState(false);
  const [policiesInitialTab, setPoliciesInitialTab] = useState<'returns' | 'shipping' | 'privacy' | 'complaints'>('returns');

  // Wishlist Handlers
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleRemoveWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleClearWishlist = () => {
    setWishlist([]);
  };

  // Fetch Products from Backend API
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { parseJSONSafe } = await import('./utils/response');
      const data = await parseJSONSafe(res);
      if (res.ok && data && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch (err) {
      console.warn('API fetch products fallback to initial products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Cart Operations
  const handleAddToCart = (product: Product, selectedSize: string) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === selectedSize
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      } else {
        return [...prev, { product, selectedSize, quantity: 1 }];
      }
    });

    setCartDrawerOpen(true);
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBuyNow = (product: Product, selectedSize: string) => {
    handleAddToCart(product, selectedSize);
    if (!user) {
      setAuthModalOpen(true);
    } else {
      setCheckoutModalOpen(true);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchQuery ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === 'ALL COLLECTIONS' ||
      activeCategory === 'NEW ARRIVALS' ||
      (activeCategory === 'SALE' && product.salePrice) ||
      product.category.toUpperCase().includes(activeCategory.toUpperCase()) ||
      activeCategory.toUpperCase().includes(product.category.toUpperCase());

    return matchesCategory && matchesSearch;
  });

  // ROUTE 1: /cms ROUTE -> RENDER DEDICATED CMS VIEW
  if (currentPath === '/cms' || currentPath.startsWith('/cms')) {
    return (
      <div className="min-h-screen bg-stone-100 font-sans text-slate-950 antialiased">
        <CMSView
          admin={admin}
          products={products}
          onProductsUpdated={fetchProducts}
          onAdminLoginSuccess={(adminUser) => {
            setAdmin(adminUser);
          }}
          onAdminLogout={() => {
            setAdmin(null);
          }}
          onNavigateHome={() => navigateTo('/')}
        />
      </div>
    );
  }

  // ROUTE 2: MAIN BOUTIQUE WEBSITE ROUTE
  return (
    <div className="min-h-screen bg-[#fcfbf9] font-sans text-slate-950 selection:bg-amber-800 selection:text-white flex flex-col antialiased">
      {/* Branded Loading Screen */}
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      {/* Header */}
      <Header
        user={user}
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        wishlistCount={wishlist.length}
        activeCategory={activeCategory}
        categories={menuCategories.map((key) => ({ key, label: categoryLabels[key] || key }))}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSearchQuery('');
        }}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenWishlist={() => setWishlistDrawerOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
        onOpenLocation={() => setLocationModalOpen(true)}
        onOpenPolicies={() => {
          setPoliciesInitialTab('returns');
          setPoliciesModalOpen(true);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Section with Video (lazy-loaded) */}
      <Suspense fallback={<div className="min-h-[420px] bg-white" />}>
        <HeroSection
          videoSettings={videoSettings}
          onExploreClick={(cat) => {
            if (cat) setActiveCategory(cat);
            const el = document.getElementById('catalog-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenLocation={() => setLocationModalOpen(true)}
        />

        {/* Grand Video Showcase Section (lazy-loaded) */}
        <VideoShowcaseSection
          videoSettings={videoSettings}
          onQuickView={(p) => setQuickViewProduct(p)}
          onAddToCart={(p, size) => handleAddToCart(p, size)}
        />
      </Suspense>

      <StorefrontShowcase
        products={products}
        onExplore={(cat) => {
          setActiveCategory(cat);
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onQuickView={(product) => setQuickViewProduct(product)}
      />

      {/* Main E-Commerce Catalog Section */}
      <main id="catalog-section" className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24 w-full">
        {/* Category Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-stone-300 pb-8 mb-12 gap-6">
          <div>
            <span className="text-[11px] uppercase font-extrabold tracking-[0.35em] text-[#8b1d1d] block mb-2">
              EXCLUSIVE WOMEN'S LUXURY COLLECTION 2026
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-slate-950 uppercase tracking-[0.02em] leading-tight">
              {activeCategory}
            </h2>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {['ALL COLLECTIONS', 'UNSTITCHED LAWN', 'COUTURE', 'FESTIVE PRET'].map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-5 py-3 rounded-full text-xs sm:text-sm font-bold tracking-[0.24em] uppercase transition-all cursor-pointer border shadow-sm ${
                  activeCategory === c
                    ? 'border-[#8b1d1d] bg-[#8b1d1d] text-white shadow-md'
                    : 'border-stone-300 text-slate-700 hover:border-[#8b1d1d] hover:text-[#8b1d1d] bg-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 p-10 shadow-sm">
            <p className="font-serif text-2xl text-slate-900 font-bold">No items match your selected filter or search.</p>
            <p className="text-sm text-stone-600 mt-2">Try clearing your search or exploring all collections.</p>
            <button
              onClick={() => {
                setActiveCategory('ALL COLLECTIONS');
                setSearchQuery('');
              }}
              className="mt-6 px-8 py-3.5 bg-slate-950 text-white text-xs font-bold uppercase tracking-widest hover:bg-amber-800 rounded-xl shadow-lg transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickView={setQuickViewProduct}
                onAddToCart={handleAddToCart}
                isWishlisted={wishlist.some((p) => p.id === prod.id)}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenLocation={() => setLocationModalOpen(true)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          window.scrollTo({ top: 500, behavior: 'smooth' });
        }}
        onOpenPolicies={(tab) => {
          if (tab) setPoliciesInitialTab(tab);
          setPoliciesModalOpen(true);
        }}
      />

      {/* MODALS & DRAWERS */}
      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isWishlisted={quickViewProduct ? wishlist.some((p) => p.id === quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      <WishlistDrawer
        isOpen={wishlistDrawerOpen}
        onClose={() => setWishlistDrawerOpen(false)}
        wishlist={wishlist}
        onRemoveWishlist={handleRemoveWishlist}
        onClearWishlist={handleClearWishlist}
        onAddToCart={(product, size) => handleAddToCart(product, size)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccessUser={(u) => {
          setUser(u);
          setAuthModalOpen(false);
        }}
      />

      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cart={cart}
        user={user}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setCartDrawerOpen(false);
          setCheckoutModalOpen(true);
        }}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        cart={cart}
        user={user}
        onOrderPlaced={() => {
          setCart([]); // Clear cart after order placed
        }}
      />

      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
        onLogout={() => {
          setUser(null);
          setProfileModalOpen(false);
        }}
      />

      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
      />

      <PoliciesModal
        isOpen={policiesModalOpen}
        onClose={() => setPoliciesModalOpen(false)}
        initialTab={policiesInitialTab}
      />

      <AssistantChat />
    </div>
  );
}
