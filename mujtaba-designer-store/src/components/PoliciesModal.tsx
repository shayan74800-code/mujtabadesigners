import React, { useState } from 'react';
import { X, ShieldCheck, RefreshCw, Truck, Lock, Phone, HelpCircle, CheckCircle2 } from 'lucide-react';

interface PoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'returns' | 'shipping' | 'privacy' | 'complaints';
}

export const PoliciesModal: React.FC<PoliciesModalProps> = ({ isOpen, onClose, initialTab = 'returns' }) => {
  const [activeTab, setActiveTab] = useState<'returns' | 'shipping' | 'privacy' | 'complaints'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-amber-50/80 p-5 border-b border-amber-200 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-amber-800">
              MUJTABA DESIGNER OFFICIAL STORE POLICIES
            </span>
            <h3 className="font-serif text-2xl font-bold text-slate-950">Store Guarantees & Terms</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-stone-200 hover:bg-stone-300 rounded-full text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('returns')}
            className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'returns'
                ? 'border-amber-800 text-amber-900 bg-white'
                : 'border-transparent text-stone-600 hover:text-slate-900'
            }`}
          >
            <RefreshCw className="w-4 h-4 text-amber-800" /> Return & Exchange
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'shipping'
                ? 'border-amber-800 text-amber-900 bg-white'
                : 'border-transparent text-stone-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4 text-amber-800" /> Shipping & Delivery
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'border-amber-800 text-amber-900 bg-white'
                : 'border-transparent text-stone-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4 text-amber-800" /> Privacy & Authenticity
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'complaints'
                ? 'border-amber-800 text-amber-900 bg-white'
                : 'border-transparent text-stone-600 hover:text-slate-900'
            }`}
          >
            <Phone className="w-4 h-4 text-amber-800" /> Complaints & Help (+92 331 8858108)
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm leading-relaxed">
          {activeTab === 'returns' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <CheckCircle2 className="w-6 h-6 text-amber-800 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-950 uppercase tracking-wide">7-Day Hassle-Free Exchange Guarantee</h4>
                  <p className="text-xs text-stone-700">
                    At Mujtaba Designer, customer satisfaction is our highest commitment. All 100% original unstitched lawn, gents fabrics, and couture suits are eligible for exchange within 7 days of delivery.
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-stone-700">
                <h5 className="font-bold text-slate-900 uppercase tracking-wider">Exchange Eligibility Criteria:</h5>
                <ul className="list-disc pl-5 space-y-1">
                  <li>The product must be unused, unstitched, unwashed, and in its original designer packaging with tags attached.</li>
                  <li>In case of manufacturing defects or incorrect suit delivered, return shipping charges will be fully borne by Mujtaba Designer.</li>
                  <li>Sale items or custom stitched suits are non-refundable but can be exchanged for store credit upon review.</li>
                  <li>To claim an exchange, please contact our support hotline at <strong className="text-slate-900">+92 331 8858108</strong> with your order receipt.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <Truck className="w-6 h-6 text-emerald-800 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-950 uppercase tracking-wide">Nationwide & Express International Delivery</h4>
                  <p className="text-xs text-stone-700">
                    We deliver across Pakistan via TCS, Leopard, and M&P, and worldwide via DHL Express.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                  <h5 className="font-bold text-slate-900 uppercase">Pakistan Orders:</h5>
                  <p className="text-stone-600">Standard Delivery: 2 - 4 Working Days.</p>
                  <p className="text-stone-600 font-semibold">Cash on Delivery (COD) Available nationwide.</p>
                </div>
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                  <h5 className="font-bold text-slate-900 uppercase">International Shipping:</h5>
                  <p className="text-stone-600">DHL Express Delivery: 5 - 7 Working Days.</p>
                  <p className="text-stone-600">Prepaid orders via Bank Transfer, Visa, MasterCard.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-amber-800 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-950 uppercase">100% Original Brand Authenticity Guarantee</h4>
                  <p className="text-stone-700">
                    Every piece sold at Mujtaba Designer is guaranteed 100% genuine original fabric sourced directly from official manufacturer mills.
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-stone-700">
                <h5 className="font-bold text-slate-900 uppercase">Data Privacy & Security:</h5>
                <p>
                  Your personal information (name, address, telephone number, payment information) is strictly encrypted and stored securely. We never share or sell customer data to third parties.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'complaints' && (
            <div className="space-y-4">
              <div className="p-5 bg-stone-900 text-white rounded-2xl space-y-3">
                <h4 className="font-serif text-lg font-bold text-amber-300">Customer Support & Complaint Cell</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Have a issue with your order, delivery delay, or fabric inquiry? Our dedicated store management team is available 6 days a week to resolve your complaints immediately.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-3 text-xs">
                  <a
                    href="tel:+923318858108"
                    className="flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-700 text-white font-bold py-3 px-5 rounded-xl uppercase tracking-wider"
                  >
                    <Phone className="w-4 h-4" /> Call Helpline: +92 331 8858108
                  </a>
                  <a
                    href="https://wa.me/923318858108"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-5 rounded-xl uppercase tracking-wider"
                  >
                    WhatsApp Helpline: +92 331 8858108
                  </a>
                </div>
              </div>

              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl text-xs space-y-1 text-stone-700">
                <span className="font-bold text-slate-900">Boutique Store Address:</span>
                <p>Shop No G 90/91, Rabi Saddar, Adamjee Road, Rawalpindi, Pakistan</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-between items-center text-xs">
          <span className="text-stone-500 font-medium">Mujtaba Designer Store Policies • 2026</span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-950 text-white font-bold uppercase tracking-wider rounded-xl hover:bg-amber-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
