import React, { useEffect, useState } from 'react';
import { X, User as UserIcon, Package, CheckCircle2, Clock, Mail, LogOut, RefreshCw, ShieldCheck } from 'lucide-react';
import { User, Order } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
}) => {
  if (!isOpen || !user) return null;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/my-orders?email=${encodeURIComponent(user.gmail)}`);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { parseJSONSafe } = await import('../utils/response');
      const data = await parseJSONSafe(res);
      if (res.ok && data) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching user orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-none shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-800 text-white font-bold flex items-center justify-center font-serif text-lg">
              {user.firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-serif text-xl font-light">{user.firstName} {user.lastName}</h3>
              <span className="text-xs text-amber-300 font-mono">{user.gmail}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Account Info Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-stone-50 border border-stone-200 text-xs">
            <div>
              <span className="text-stone-500 block uppercase text-[10px] font-bold">Gmail</span>
              <span className="font-medium text-slate-900">{user.gmail}</span>
            </div>
            <div>
              <span className="text-stone-500 block uppercase text-[10px] font-bold">Account Verification</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" /> OTP Verified
              </span>
            </div>
            <div>
              <span className="text-stone-500 block uppercase text-[10px] font-bold">Member Since</span>
              <span className="font-medium text-slate-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Orders Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-serif text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-800" /> My Order History ({orders.length})
              </h4>
              <button
                onClick={fetchOrders}
                className="text-xs text-amber-800 hover:underline flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh Status
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 border border-stone-200 text-stone-500 text-xs">
                You have not placed any orders yet.
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-4 border border-stone-200 bg-white shadow-xs space-y-2 text-xs">
                    <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                      <div>
                        <span className="font-mono font-bold text-slate-900 text-sm">#{ord.orderNumber}</span>
                        <span className="text-[10px] text-stone-400 block">
                          {new Date(ord.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <span
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
                          ord.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : ord.status === 'Pending'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}
                      >
                        {ord.status === 'Confirmed' ? '✓ Confirmed by Admin' : '⏳ Pending CMS Approval'}
                      </span>
                    </div>

                    {/* Order items list */}
                    <div className="space-y-1 py-1">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-stone-700">
                          <span>
                            {item.title} <strong className="text-amber-800">({item.size})</strong> x {item.quantity}
                          </span>
                          <span className="font-semibold">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center border-t border-stone-100 pt-2 font-bold text-slate-900">
                      <span>Total Paid:</span>
                      <span className="text-amber-900 font-sans text-sm">
                        Rs. {ord.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-between items-center">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
