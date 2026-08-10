import React, { useState, useEffect } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { Header } from './components/Header';
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
import { CollectionsGrid } from './components/CollectionsGrid';
import { TestimonialsSection } from './components/TestimonialsSection';
import { InstagramSection } from './components/InstagramSection';
import { Product, CartItem, User, AdminUser } from './types';
import { INITIAL_PRODUCTS } from './data/initialProducts';


  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState<string>(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('HOME');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('mujtaba_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [wishlistDrawerOpen, setWishlistDrawerOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [policiesModalOpen, setPoliciesModalOpen] = useState(false);
  const [policiesInitialTab, setPoliciesInitialTab] = useState<'returns' | 'shipping' | 'privacy' | 'complaints'>('returns');

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

  useEffect(() => {
    try {
      localStorage.setItem('mujtaba_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist:', e);
    }
  }, [wishlist]);

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
      activeCategory === 'HOME' ||
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
    <div className="min-h-screen bg-white font-sans text-slate-950 flex flex-col antialiased">
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      {/* Header */}
      <Header
        user={user}
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        wishlistCount={wishlist.length}
        activeCategory={activeCategory}
        categories={[]}
        onSelectCategory={setActiveCategory}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenWishlist={() => setWishlistDrawerOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Collections Grid */}
      <CollectionsGrid onSelectCategory={setActiveCategory} />

      {/* Main Catalog Section */}
      <main id="catalog-section" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 uppercase tracking-wider mb-2">
            RESTOCK BEST SELLING
          </h2>
          <p className="text-sm text-stone-600">Featuring our most-loved pieces and new arrivals</p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-stone-200 p-10">
            <p className="text-lg text-slate-900 font-bold">No items found</p>
            <button
              onClick={() => {
                setActiveCategory('HOME');
                setSearchQuery('');
              }}
              className="mt-6 px-8 py-3 bg-[#8B1D1D] text-white font-bold uppercase tracking-widest rounded hover:bg-[#6D1515] transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 8).map((prod) => (
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

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Instagram Section */}
      <InstagramSection />

      {/* Footer */}
      <Footer
        onSelectCategory={setActiveCategory}
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
          setCart([]);
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

