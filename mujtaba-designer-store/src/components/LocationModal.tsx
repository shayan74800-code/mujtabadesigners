import React from 'react';
import { X, MapPin, Phone, MessageSquare, Clock, ExternalLink } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const storeAddress = "Shop No G 90/91, Rabi Saddar, Adamjee Road, Rawalpindi, Pakistan";
  const mapsUrl = "https://maps.app.goo.gl/cnQJurxWFzrfpRLYA";
  const complaintPhone = "+92 331 8858108";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-white backdrop-blur-2xl rounded-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-amber-50 text-slate-950 p-5 flex justify-between items-center border-b border-amber-200">
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-amber-900 block mb-0.5">
              MUJTABA DESIGNER
            </span>
            <h3 className="font-serif text-xl font-bold tracking-wide">Boutique Location & Store Contact</h3>
          </div>
          <button onClick={onClose} className="p-1.5 bg-stone-200 hover:bg-stone-300 text-slate-950 rounded-full transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Map Box & Information */}
          <div className="border border-stone-200 overflow-hidden relative shadow-xs rounded-xl">
            <iframe
              title="Mujtaba Designer Boutique Location Map"
              src="https://www.google.com/maps?q=Shop+No+G+90+91+Rabi+Saddar+Adamjee+Road+Rawalpindi&output=embed"
              width="100%"
              height="260"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="p-4 bg-stone-50 text-slate-950 text-xs flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 border-t border-stone-200">
              <span className="font-bold flex items-center gap-2 text-slate-900">
                <MapPin className="w-4 h-4 text-amber-800 flex-shrink-0" />
                {storeAddress}
              </span>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-800 hover:bg-amber-900 text-white text-[10px] font-extrabold px-4 py-2 uppercase tracking-wider flex items-center gap-1.5 rounded-lg transition-colors flex-shrink-0"
              >
                Open Google Maps <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Contact Details & Direct Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2 text-xs">
              <h4 className="font-serif font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-amber-800" /> Support & Complaint Line
              </h4>
              <p className="text-stone-600">
                For order inquiries, store appointments, or customer complaints, reach out to our team directly.
              </p>

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href="https://wa.me/923318858108"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold uppercase tracking-wider text-[11px] flex items-center justify-center gap-2 rounded-lg"
                >
                  <MessageSquare className="w-4 h-4" /> WhatsApp: {complaintPhone}
                </a>

                <a
                  href={`tel:${complaintPhone}`}
                  className="w-full py-2.5 bg-slate-950 hover:bg-amber-800 text-white font-bold uppercase tracking-wider text-[11px] flex items-center justify-center gap-2 rounded-lg transition-colors"
                >
                  <Phone className="w-4 h-4 text-amber-300" /> Call Direct: {complaintPhone}
                </a>
              </div>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2 text-xs">
              <h4 className="font-serif font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-800" /> Store Opening Hours
              </h4>
              <ul className="space-y-1.5 text-stone-700">
                <li className="flex justify-between border-b border-stone-200 pb-1">
                  <span>Monday - Saturday:</span>
                  <span className="font-bold">11:00 AM - 9:30 PM</span>
                </li>
                <li className="flex justify-between border-b border-stone-200 pb-1">
                  <span>Sunday:</span>
                  <span className="font-bold">2:00 PM - 9:00 PM</span>
                </li>
                <li className="flex justify-between pt-1 text-amber-900 font-semibold">
                  <span>Location:</span>
                  <span>Rabi Saddar, Rawalpindi</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 bg-stone-100 border-t border-stone-200 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-950 text-white text-xs font-bold uppercase tracking-widest hover:bg-amber-800 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
