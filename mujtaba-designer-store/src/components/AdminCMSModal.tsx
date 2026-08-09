import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, CheckCircle2, ShieldCheck, Mail, RefreshCw, Package, ShoppingBag, Send } from 'lucide-react';
import { Product, Order, AdminUser } from '../types';

interface AdminCMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin: AdminUser | null;
  products: Product[];
  onProductsUpdated: () => void;
  onAdminLogout: () => void;
}

export const AdminCMSModal: React.FC<AdminCMSModalProps> = ({
  isOpen,
  onClose,
  admin,
  products,
  onProductsUpdated,
  onAdminLogout,
}) => {
  if (!isOpen || !admin) return null;

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'add_product'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  // Add/Edit Product Form State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [category, setCategory] = useState('MENSWEAR SHERWANI');
  const [collection, setCollection] = useState('Bridal 2026');
  const [imageUrl1, setImageUrl1] = useState('');
  const [imageUrl2, setImageUrl2] = useState('');
  const [sizesInput, setSizesInput] = useState('S, M, L, XL, Custom Stitching');
  const [inStock, setInStock] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  // Fetch all orders for Admin CMS
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
    fetchOrders();
  }, [admin]);

  // Confirm Order Workflow (Triggers Nodemailer confirmation email!)
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
        throw new Error((data && data.error) || `Failed to update order status.`);
      }

      setActionMessage((data && data.message) || `Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    }
  };

  // Add or Edit Product Submit
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
      if (imagesArray.length === 0) {
        imagesArray.push('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800');
      }

      const sizesArray = sizesInput.split(',').map((s) => s.trim()).filter(Boolean);

      const payload = {
        title,
        description,
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : undefined,
        category,
        collection,
        images: imagesArray,
        sizes: sizesArray,
        inStock,
        isFeatured,
      };

      let url = '/api/products';
      let method = 'POST';

      if (editingProductId) {
        url = `/api/products/${editingProductId}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { parseJSONSafe } = await import('../utils/response');
      const data = await parseJSONSafe(res);

      if (!res.ok) {
        throw new Error((data && data.error) || 'Failed to save product.');
      }

      setActionMessage(editingProductId ? 'Product updated successfully!' : 'Product added successfully!');
      resetProductForm();
      onProductsUpdated();
      setActiveTab('products');
    } catch (err: any) {
      setActionMessage(`Error saving product: ${err.message}`);
    } finally {
      setSavingProduct(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        setActionMessage('Product deleted from storefront.');
        onProductsUpdated();
      }
    } catch (err) {
      console.error('Delete product error:', err);
    }
  };

  const startEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setTitle(prod.title);
    setDescription(prod.description);
    setPrice(prod.price.toString());
    setSalePrice(prod.salePrice ? prod.salePrice.toString() : '');
    setCategory(prod.category);
    setCollection(prod.collection || '');
    setImageUrl1(prod.images[0] || '');
    setImageUrl2(prod.images[1] || '');
    setSizesInput(prod.sizes.join(', '));
    setInStock(prod.inStock);
    setIsFeatured(!!prod.isFeatured);
    setActiveTab('add_product');
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setSalePrice('');
    setCategory('MENSWEAR SHERWANI');
    setCollection('Bridal 2026');
    setImageUrl1('');
    setImageUrl2('');
    setSizesInput('S, M, L, XL, Custom Stitching');
    setInStock(true);
    setIsFeatured(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-white rounded-none shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-800 text-white rounded-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-400 block mb-0.5">
                MUJTABA DESIGNER
              </span>
              <h3 className="font-serif text-lg font-light">Admin CMS Dashboard</h3>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onAdminLogout}
              className="text-xs text-red-400 hover:text-red-300 font-semibold uppercase tracking-wider"
            >
              Sign Out
            </button>
            <button onClick={onClose} className="text-stone-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 bg-stone-100 border-b border-stone-200 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-white text-amber-900 border-b-2 border-amber-800 font-bold'
                : 'text-stone-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Order CMS ({orders.filter((o) => o.status === 'Pending').length} Pending)
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-white text-amber-900 border-b-2 border-amber-800 font-bold'
                : 'text-stone-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" /> Product Catalog ({products.length})
          </button>

          <button
            onClick={() => {
              resetProductForm();
              setActiveTab('add_product');
            }}
            className={`py-3 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'add_product'
                ? 'bg-white text-amber-900 border-b-2 border-amber-800 font-bold'
                : 'text-stone-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-4 h-4" /> {editingProductId ? 'Edit Product' : 'Add New Product'}
          </button>
        </div>

        {/* Message Banner */}
        {actionMessage && (
          <div className="p-3 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs font-medium flex justify-between items-center">
            <span>{actionMessage}</span>
            <button onClick={() => setActionMessage('')} className="text-amber-700 hover:text-amber-950">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content Container */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: ORDER MANAGEMENT & AUTOMATED EMAIL DISPATCH */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-serif text-base font-bold text-slate-900 uppercase tracking-wider">
                  Customer Orders Workflow
                </h4>
                <button
                  onClick={fetchOrders}
                  className="text-xs text-amber-800 hover:underline flex items-center gap-1 font-semibold"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} /> Refresh Orders
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 border border-stone-200 text-stone-500 text-xs">
                  No orders placed yet. Place an order from storefront to test the CMS workflow.
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className={`p-4 border text-xs space-y-3 transition-all ${
                        ord.status === 'Pending' ? 'border-amber-400 bg-amber-50/30' : 'border-stone-200 bg-white'
                      }`}
                    >
                      <div className="flex flex-wrap justify-between items-center border-b border-stone-200 pb-2 gap-2">
                        <div>
                          <span className="font-mono font-bold text-slate-900 text-sm">#{ord.orderNumber}</span>
                          <span className="text-stone-500 block text-[11px]">
                            {new Date(ord.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
                              ord.status === 'Confirmed'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : ord.status === 'Pending'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-red-100 text-red-800 border border-red-300'
                            }`}
                          >
                            Status: {ord.status}
                          </span>

                          {ord.status === 'Pending' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'Confirmed')}
                              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 cursor-pointer shadow-xs"
                              title="Clicking this updates status to Confirmed and dispatches email via Nodemailer"
                            >
                              <Send className="w-3.5 h-3.5" /> Confirm Order & Send Email
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-stone-50 p-2.5 border border-stone-200 text-[11px]">
                        <div>
                          <span className="text-stone-400 block uppercase text-[9px] font-bold">Customer</span>
                          <span className="font-semibold text-slate-900">{ord.userName}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block uppercase text-[9px] font-bold">Gmail</span>
                          <span className="font-mono text-amber-900">{ord.userEmail}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block uppercase text-[9px] font-bold">Phone & Address</span>
                          <span className="text-slate-800">{ord.phone} | {ord.address}, {ord.city}</span>
                        </div>
                      </div>

                      {/* Item Breakdown */}
                      <div className="space-y-1">
                        <span className="font-bold text-[10px] uppercase tracking-widest text-slate-500">
                          Order Items:
                        </span>
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-stone-700 pl-2">
                            <span>
                              {item.title} <strong className="text-amber-800">({item.size})</strong> x {item.quantity}
                            </span>
                            <span className="font-semibold">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center border-t border-stone-200 pt-2 font-bold text-slate-900">
                        <span>Grand Total:</span>
                        <span className="text-amber-900 font-sans text-sm">
                          Rs. {ord.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCT MANAGEMENT GRID */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-serif text-base font-bold text-slate-900 uppercase tracking-wider">
                  Storefront Products ({products.length})
                </h4>
                <button
                  onClick={() => {
                    resetProductForm();
                    setActiveTab('add_product');
                  }}
                  className="px-3 py-1.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1 hover:bg-amber-800"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Product
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((prod) => (
                  <div key={prod.id} className="p-3 border border-stone-200 bg-white shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="aspect-[3/4] w-full bg-stone-100 overflow-hidden mb-2 relative">
                        <img
                          src={prod.images[0]}
                          alt={prod.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 uppercase">
                          {prod.category}
                        </span>
                      </div>
                      <h5 className="font-serif text-xs font-bold text-slate-900 line-clamp-1">{prod.title}</h5>
                      <p className="text-[11px] font-bold text-amber-900 mt-0.5">
                        Rs. {prod.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-2 border-t border-stone-100 pt-2 mt-3">
                      <button
                        onClick={() => startEditProduct(prod)}
                        className="flex-1 py-1 bg-stone-100 hover:bg-stone-200 text-slate-800 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1"
                      >
                        <Edit className="w-3 h-3 text-amber-800" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1 text-stone-400 hover:text-red-700 hover:bg-red-50 border border-stone-200"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ADD / EDIT PRODUCT FORM */}
          {activeTab === 'add_product' && (
            <form onSubmit={handleSaveProduct} className="space-y-4 max-w-2xl mx-auto">
              <h4 className="font-serif text-base font-bold text-slate-900 uppercase tracking-wider border-b border-stone-200 pb-2">
                {editingProductId ? 'Edit Existing Product' : 'Add New Product to Store'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 uppercase mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Emerald Sherwani"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 focus:outline-none focus:border-amber-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 focus:outline-none focus:border-amber-800 bg-white"
                  >
                    <option value="MENSWEAR SHERWANI">MENSWEAR SHERWANI</option>
                    <option value="COUTURE">COUTURE</option>
                    <option value="LUXURY LAWN">LUXURY LAWN</option>
                    <option value="VELVET EDITION">VELVET EDITION</option>
                    <option value="FESTIVE PRET">FESTIVE PRET</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 uppercase mb-1">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="185000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 focus:outline-none focus:border-amber-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 uppercase mb-1">
                    Sale Price (Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="165000"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 focus:outline-none focus:border-amber-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 uppercase mb-1">
                    Collection / Tag
                  </label>
                  <input
                    type="text"
                    placeholder="Bridal 2026"
                    value={collection}
                    onChange={(e) => setCollection(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 focus:outline-none focus:border-amber-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed fabric, embroidery, and crafting specifications..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 focus:outline-none focus:border-amber-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 uppercase mb-1">
                    Primary Image URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={imageUrl1}
                    onChange={(e) => setImageUrl1(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 focus:outline-none focus:border-amber-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 uppercase mb-1">
                    Secondary Image URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={imageUrl2}
                    onChange={(e) => setImageUrl2(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 focus:outline-none focus:border-amber-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 uppercase mb-1">
                  Available Sizes (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="S, M, L, XL, Custom Stitching"
                  value={sizesInput}
                  onChange={(e) => setSizesInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 focus:outline-none focus:border-amber-800"
                />
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                  />
                  <span>In Stock</span>
                </label>

                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
                  <span>Feature on Store Hero</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    resetProductForm();
                    setActiveTab('products');
                  }}
                  className="px-5 py-2.5 border border-stone-300 text-slate-700 text-xs uppercase font-semibold hover:bg-stone-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingProduct}
                  className="flex-1 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  {savingProduct ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Save & Publish Product'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
