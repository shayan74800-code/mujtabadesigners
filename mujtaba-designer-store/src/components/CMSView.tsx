import React, { useState, useEffect } from 'react';
import { Product, Order, AdminUser } from '../types';
import {
  ShieldCheck,
  User as UserIcon,
  Lock,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Package,
  ShoppingBag,
  ArrowLeft,
  LogOut,
  
  Send,
  ShieldAlert,
  
  Phone,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import logoImg from '../assets/images/mujtaba_gold_logo_1786177848393.jpg';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  id: string;
}

const ImageUploaderField: React.FC<ImageUploaderProps> = ({ label, value, onChange, id }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP, etc.)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[10px] text-amber-800 font-bold hover:underline cursor-pointer"
        >
          {showUrlInput ? 'Switch to Drag & Drop' : 'Or Paste Web URL'}
        </button>
      </div>

      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Paste image URL (https://...)"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800 bg-white"
          />
        </div>
      ) : value ? (
        <div className="relative rounded-2xl border border-stone-300 p-2 bg-stone-50 flex items-center gap-3">
          <img
            src={value}
            alt="Preview"
            className="w-16 h-20 object-cover rounded-xl border border-stone-200 flex-shrink-0 bg-white"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">Image Attached</p>
            <p className="text-[10px] text-stone-500 truncate mt-0.5">
              {value.startsWith('data:') ? 'Selected from local files' : value}
            </p>
            <div className="flex gap-2 mt-2">
              <label htmlFor={`file-${id}`} className="px-2.5 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-slate-800 cursor-pointer">
                Change File
              </label>
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-2.5 py-1 bg-red-100 text-red-800 text-[10px] font-bold uppercase rounded-lg hover:bg-red-200 cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
          <input
            id={`file-${id}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                processFile(e.target.files[0]);
              }
            }}
          />
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-amber-600 bg-amber-50'
              : 'border-stone-300 hover:border-amber-700 bg-stone-50 hover:bg-stone-100'
          }`}
        >
          <input
            id={`file-${id}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                processFile(e.target.files[0]);
              }
            }}
          />
          <label htmlFor={`file-${id}`} className="cursor-pointer block space-y-1">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <Plus className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Drag & Drop Image File
            </p>
            <p className="text-[10px] text-stone-500">
              or <span className="text-amber-800 font-bold underline">Choose from Files / Folder</span>
            </p>
          </label>
        </div>
      )}
    </div>
  );
};

interface CMSViewProps {
  admin: AdminUser | null;
  products: Product[];
  onProductsUpdated: () => void;
  onAdminLoginSuccess: (admin: AdminUser, token: string) => void;
  onAdminLogout: () => void;
  onNavigateHome: () => void;
}

export const CMSView: React.FC<CMSViewProps> = ({
  admin,
  products,
  onProductsUpdated,
  onAdminLoginSuccess,
  onAdminLogout,
  onNavigateHome,
}) => {
  // Login Form States (for when admin is not logged in)
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // CMS Dashboard States (when logged in)
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'add_product'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  // (Video Showcase manager removed)

  // Product Form State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [category, setCategory] = useState('UNSTITCHED LAWN');
  const [collection, setCollection] = useState('Bridal 2026');
  const [imageUrl1, setImageUrl1] = useState('');
  const [imageUrl2, setImageUrl2] = useState('');
  const [sizesInput, setSizesInput] = useState('S, M, L, XL, Custom Stitching');
  const [inStock, setInStock] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  // Handle Admin Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { parseJSONSafe } = await import('../utils/response');
      const data = await parseJSONSafe(res);

      if (!res.ok) {
        throw new Error((data && data.error) || 'Invalid admin credentials.');
      }

      onAdminLoginSuccess(data.admin, data.token);
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders/all');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { parseJSONSafe } = await import('../utils/response');
      const data = await parseJSONSafe(res);
      if (res.ok && data) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (admin) {
      fetchOrders();
    }
  }, [admin]);

  

  const handleUpdateOrderStatus = async (orderId: string, newStatus: 'Confirmed' | 'Cancelled') => {
    setActionMessage('');
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { parseJSONSafe } = await import('../utils/response');
      const data = await parseJSONSafe(res);

      if (!res.ok) {
        throw new Error((data && data.error) || 'Failed to update order status.');
      }

      setActionMessage((data && data.message) || `Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionMessage('');

    if (!title || !price || !category) {
      setActionMessage('Title, Price, and Category are required.');
      return;
    }

    setSavingProduct(true);

    try {
      const imagesArray = [imageUrl1.trim(), imageUrl2.trim()].filter(Boolean);
      const sizesArray = sizesInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        title,
        description,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        category,
        collection,
        images: imagesArray.length > 0 ? imagesArray : ['/assets/images/mujtaba_video_hero_1786177863771.jpg'],
        sizes: sizesArray.length > 0 ? sizesArray : ['S', 'M', 'L', 'XL'],
        inStock,
        isFeatured,
      };

      let res;
      if (editingProductId) {
        res = await fetch(`/api/products/${editingProductId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { parseJSONSafe } = await import('../utils/response');
      const data = await parseJSONSafe(res);

      if (!res.ok) {
        throw new Error((data && data.error) || 'Failed to save product.');
      }

      setActionMessage(editingProductId ? 'Product updated successfully!' : 'New product published successfully!');
      resetProductForm();
      onProductsUpdated();
      setActiveTab('products');
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order from the CMS?')) return;

    setActionMessage('');
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { parseJSONSafe } = await import('../utils/response');
      const data = await parseJSONSafe(res);

      if (!res.ok) {
        throw new Error((data && data.error) || 'Failed to delete order.');
      }

      setActionMessage('Order deleted successfully.');
      fetchOrders();
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product from store catalog?')) return;

    setActionMessage('');
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { parseJSONSafe } = await import('../utils/response');
      const data = await parseJSONSafe(res);

      if (!res.ok) {
        throw new Error((data && data.error) || 'Failed to delete product.');
      }

      setActionMessage('Product deleted successfully.');
      onProductsUpdated();
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    }
  };

  const startEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setTitle(product.title);
    setDescription(product.description || '');
    setPrice(product.price.toString());
    setSalePrice(product.salePrice ? product.salePrice.toString() : '');
    setCategory(product.category);
    setCollection(product.collection || 'Bridal 2026');
    setImageUrl1(product.images[0] || '');
    setImageUrl2(product.images[1] || '');
    setSizesInput(product.sizes.join(', '));
    setInStock(product.inStock);
    setIsFeatured(product.isFeatured || false);
    setActiveTab('add_product');
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setSalePrice('');
    setCategory('UNSTITCHED LAWN');
    setCollection('Bridal 2026');
    setImageUrl1('');
    setImageUrl2('');
    setSizesInput('S, M, L, XL, Custom Stitching');
    setInStock(true);
    setIsFeatured(false);
  };

  // IF NOT LOGGED IN AS ADMIN -> SHOW CMS LOGIN PAGE
  if (!admin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
        {/* Top Header Bar */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onNavigateHome}>
            <div className="w-10 h-10 rounded-full border border-amber-400 p-0.5 bg-white overflow-hidden">
              <img src={logoImg} alt="Mujtaba Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-[0.2em] text-white uppercase block leading-none">
                MUJTABA DESIGNER
              </span>
              <span className="text-[10px] tracking-[0.3em] text-amber-400 font-bold uppercase">ADMIN CMS PORTAL</span>
            </div>
          </div>

          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-300 hover:text-white px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            Back to Website Store
          </button>
        </div>

        {/* Center Login Box */}
        <div className="my-auto py-12 px-4 flex items-center justify-center">
          <div className="w-full max-w-md bg-slate-900/90 border border-amber-500/30 rounded-3xl p-8 sm:p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-400/40 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-400">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-white">
                Admin CMS Access
              </h2>
              <p className="text-stone-400 text-xs sm:text-sm mt-2">
                Enter your administrative credentials to manage store catalog, orders, and products.
              </p>
            </div>

            {loginError && (
              <div className="mb-6 p-4 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-stone-400 flex items-center justify-between">
                <span>Admin Login:</span>
                <span className="font-mono text-amber-300 font-bold">Use configured admin environment credentials</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-300 mb-2">
                  Admin Email / Username *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-amber-400" />
                  <input
                    type="text"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                    placeholder="admin"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-300 mb-2">
                  Admin Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-amber-400" />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm tracking-[0.2em] uppercase rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {loginLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Log In to CMS Dashboard'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-6 text-center text-xs text-stone-500 border-t border-slate-900">
          Mujtaba Designer © 2026 Admin Content Management System
        </div>
      </div>
    );
  }

  // LOGGED IN ADMIN CMS DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-stone-100 text-slate-950 flex flex-col selection:bg-amber-800 selection:text-white">
      {/* Top Header */}
      <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-amber-400 p-0.5 bg-white overflow-hidden">
              <img src={logoImg} alt="Mujtaba Gold Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase text-white">
                  MUJTABA DESIGNER • CMS
                </h1>
              </div>
              <p className="text-stone-400 text-xs">Logged in as: {admin.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-stone-200 hover:text-white text-xs font-bold tracking-wider uppercase rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              Visit Website Store
            </button>

            <button
              onClick={onAdminLogout}
              className="px-4 py-2.5 bg-red-900/80 hover:bg-red-800 text-white text-xs font-bold tracking-wider uppercase rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out CMS
            </button>
          </div>
        </div>
      </header>

      {/* Main CMS Body */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-8 w-full flex-1 flex flex-col">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between bg-white rounded-2xl p-2 border border-stone-200 shadow-sm mb-8 gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 rounded-xl text-xs font-bold tracking-[0.2em] uppercase transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-slate-950 text-amber-300 shadow-md'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Customer Orders ({orders.length})
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-3 rounded-xl text-xs font-bold tracking-[0.2em] uppercase transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-slate-950 text-amber-300 shadow-md'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Package className="w-4 h-4" />
              Store Products ({products.length})
            </button>

            <button
              onClick={() => {
                resetProductForm();
                setActiveTab('add_product');
              }}
              className={`px-6 py-3 rounded-xl text-xs font-bold tracking-[0.2em] uppercase transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'add_product'
                  ? 'bg-amber-800 text-white shadow-md'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              <Plus className="w-4 h-4" />
              {editingProductId ? 'Edit Product' : 'Add New Product'}
            </button>

            {/* Video Showcase Manager removed */}
          </div>

          <button
            onClick={fetchOrders}
            className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-700 hover:text-slate-950 flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loadingOrders ? 'animate-spin text-amber-800' : ''}`} />
            Refresh Orders
          </button>
        </div>

        {/* Global Action Banner */}
        {actionMessage && (
          <div className="mb-6 p-4 bg-slate-950 text-amber-300 border border-amber-400/40 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <span>{actionMessage}</span>
            </div>
            <button onClick={() => setActionMessage('')} className="text-stone-400 hover:text-white text-xs font-bold">
              Dismiss
            </button>
          </div>
        )}

        {/* TAB 1: CUSTOMER ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm flex-1">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-stone-200">
              <div>
                <h2 className="font-serif text-2xl font-bold uppercase tracking-wide">Customer Orders</h2>
                <p className="text-stone-500 text-xs mt-1">
                  Manage incoming customer orders. Confirm orders to send email notifications.
                </p>
              </div>
            </div>

            {loadingOrders ? (
              <div className="py-20 text-center text-stone-500 flex flex-col items-center gap-3">
                <RefreshCw className="w-8 h-8 animate-spin text-amber-800" />
                <p className="text-sm font-semibold">Loading orders data...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-16 text-center text-stone-500 bg-stone-50 rounded-2xl border border-stone-200 p-8">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <p className="font-bold text-lg text-slate-800">No orders placed yet.</p>
                <p className="text-xs text-stone-500 mt-1">When customers complete checkout, their orders will appear here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-stone-200 rounded-2xl p-6 bg-stone-50/50 hover:bg-white transition-all shadow-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 block">
                          ORDER #{order.orderNumber}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-slate-900 mt-0.5">
                          {order.userName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 mt-1">
                          <span>{order.userEmail}</span>
                          <span>•</span>
                          <span>{order.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest ${
                            order.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : order.status === 'Cancelled'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {order.status}
                        </span>

                        <div className="text-right">
                          <span className="block text-xs text-stone-500">Total Amount</span>
                          <span className="font-sans font-bold text-lg text-slate-950">
                            Rs. {order.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="rounded-xl border border-stone-200 bg-white p-3">
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-700" /> Delivery Address
                          </div>
                          <p className="text-xs text-slate-800 leading-relaxed">
                            {order.address}, {order.city}
                          </p>
                        </div>

                        <div className="rounded-xl border border-stone-200 bg-white p-3">
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                            <Phone className="w-3.5 h-3.5 text-emerald-700" /> Contact Number
                          </div>
                          <p className="text-xs text-slate-800 leading-relaxed">{order.phone}</p>
                        </div>

                        {order.notes && (
                          <div className="rounded-xl border border-stone-200 bg-white p-3">
                            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Notes</div>
                            <p className="text-xs text-slate-800 leading-relaxed">{order.notes}</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                          Ordered Items ({order.items.length})
                        </h4>
                        <div className="space-y-2 bg-white p-3 rounded-xl border border-stone-200 max-h-36 overflow-y-auto">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs text-slate-800 gap-2">
                              <span className="font-semibold">{item.title} ({item.size}) x {item.quantity}</span>
                              <span className="font-bold whitespace-nowrap">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-[11px] text-stone-500">
                        Placed on: {new Date(order.createdAt).toLocaleString()}
                      </span>

                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={`https://wa.me/923318858108?text=${encodeURIComponent(`Assalam o Alaikum Mujtaba Designer, I need help with order ${order.orderNumber}.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold tracking-wider uppercase rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                        </a>

                        {order.status !== 'Confirmed' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'Confirmed')}
                            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold tracking-wider uppercase rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                          >
                            <Send className="w-3.5 h-3.5" /> Confirm Order
                          </button>
                        )}

                        {order.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'Cancelled')}
                            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-slate-800 text-xs font-bold tracking-wider uppercase rounded-xl transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold tracking-wider uppercase rounded-xl transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline mr-1" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: STORE PRODUCTS CATALOG */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm flex-1">
            <div className="flex flex-wrap justify-between items-center pb-6 mb-6 border-b border-stone-200 gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold uppercase tracking-wide">Store Catalog Products</h2>
                <p className="text-stone-500 text-xs mt-1">
                  Manage product catalog, edit pricing, or add new couture outfits.
                </p>
              </div>

              <button
                onClick={() => {
                  resetProductForm();
                  setActiveTab('add_product');
                }}
                className="px-6 py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="border border-stone-200 rounded-2xl overflow-hidden bg-stone-50 flex flex-col justify-between">
                  <div className="relative aspect-[3/4] h-52 w-full bg-stone-200 overflow-hidden">
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover object-top" />
                    <span className="absolute top-3 left-3 bg-slate-950 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                      {p.category}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-base font-bold text-slate-900 line-clamp-1">{p.title}</h3>
                      <p className="text-xs text-stone-500 line-clamp-2 mt-1">{p.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">Rs. {p.price.toLocaleString()}</span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditProduct(p)}
                          className="p-2 bg-stone-200 hover:bg-amber-100 text-slate-800 hover:text-amber-900 rounded-lg transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ADD / EDIT PRODUCT FORM */}
        {activeTab === 'add_product' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 shadow-sm max-w-4xl mx-auto w-full">
            <h2 className="font-serif text-2xl font-bold uppercase tracking-wide pb-4 mb-6 border-b border-stone-200">
              {editingProductId ? 'Edit Product Details' : 'Add New Couture Product'}
            </h2>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Gull-e-Emerald Silk Velvet Gown"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe fabric, embroidery details, zari work..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Original Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="150000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Sale Price (Rs.) Optional
                  </label>
                  <input
                    type="number"
                    placeholder="135000"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800 bg-white"
                  >
                    <option value="UNSTITCHED LAWN">UNSTITCHED LAWN</option>
                    <option value="COUTURE">BRIDAL & COUTURE</option>
                    <option value="LUXURY LAWN">LUXURY LAWN</option>
                    <option value="VELVET EDITION">VELVET EDITION</option>
                    <option value="FESTIVE PRET">FESTIVE PRET</option>
                    <option value="STITCHED">STITCHED PRET</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Collection / Campaign Tag
                  </label>
                  <input
                    type="text"
                    placeholder="Pure Luxury 2026"
                    value={collection}
                    onChange={(e) => setCollection(e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ImageUploaderField
                  id="primary-img"
                  label="Primary Catalog Image (Drag & Drop or Select File)"
                  value={imageUrl1}
                  onChange={setImageUrl1}
                />

                <ImageUploaderField
                  id="secondary-img"
                  label="Secondary Hover Image (Drag & Drop or Select File)"
                  value={imageUrl2}
                  onChange={setImageUrl2}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Available Sizes (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="S, M, L, XL, Custom Stitching"
                  value={sizesInput}
                  onChange={(e) => setSizesInput(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800"
                />
              </div>

              <div className="flex gap-8 pt-2">
                <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="w-4 h-4 accent-amber-800"
                  />
                  <span>In Stock</span>
                </label>

                <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-amber-800"
                  />
                  <span>Featured Hero Showcase</span>
                </label>
              </div>

              <div className="flex gap-4 pt-6 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    resetProductForm();
                    setActiveTab('products');
                  }}
                  className="px-6 py-3 border border-stone-300 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-stone-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingProduct}
                  className="flex-1 py-3.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {savingProduct ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Save & Publish Product'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Video Showcase manager removed */}
      </div>
    </div>
  );
};
