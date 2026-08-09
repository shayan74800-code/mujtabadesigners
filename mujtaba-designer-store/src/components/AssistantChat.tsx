import React, { useMemo, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

interface ChatMessage {
  id: number;
  sender: 'assistant' | 'user';
  text: string;
}

const assistantReplies = [
  "Mujtaba Designer specializes in luxury couture, bridal appointments, bespoke tailoring, and premium order guidance.",
  "You can place an order directly through our checkout and we will confirm it via WhatsApp and email.",
  "For custom stitching, fabric consultation, or urgent styling support, our team is ready to assist.",
  "If you want to know about delivery, pricing, or sizing, tell me what you are looking for and I will guide you."
];

const getAssistantReply = (text: string) => {
  const normalized = text.toLowerCase();

  if (normalized.includes('price') || normalized.includes('cost') || normalized.includes('budget')) {
    return 'Our collection includes premium couture pieces with custom pricing based on design, fabric, and tailoring details.';
  }

  if (normalized.includes('order') || normalized.includes('buy') || normalized.includes('checkout')) {
    return 'You can place your order from the store checkout. After confirmation, our team will update you on WhatsApp and email.';
  }

  if (normalized.includes('bridal') || normalized.includes('wedding') || normalized.includes('suit') || normalized.includes('gown')) {
    return 'We offer bridal and luxury custom pieces, including embroidered gowns, sherwanis, and tailored statement outfits.';
  }

  if (normalized.includes('delivery') || normalized.includes('shipping') || normalized.includes('address')) {
    return 'We can help with delivery planning and shipping details once your order is placed.';
  }

  return assistantReplies[Math.floor(Math.random() * assistantReplies.length)];
};

export const AssistantChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'assistant',
      text: 'Assalam-o-Alaikum! I am Mujtaba Designer’s assistant. How can I help you today?'
    }
  ]);
  const [draft, setDraft] = useState('');

  const quickPrompts = useMemo(() => [
    'Tell me about your collections',
    'How do I place an order?',
    'Do you offer custom stitching?'
  ], []);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = { id: Date.now(), sender: 'user', text: trimmed };
    const assistantMessage: ChatMessage = {
      id: Date.now() + 1,
      sender: 'assistant',
      text: getAssistantReply(trimmed)
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setDraft('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-[60]">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-white shadow-[0_12px_32px_rgba(0,0,0,0.28)] hover:bg-amber-800 transition-all"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em]">Ask Mujtaba</span>
        </button>
      ) : (
        <div className="w-[320px] max-w-[90vw] rounded-2xl border border-stone-200 bg-white shadow-[0_18px_48px_rgba(0,0,0,0.2)] overflow-hidden">
          <div className="bg-slate-950 px-4 py-3 text-white flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400">Mujtaba Designer</p>
              <p className="text-sm font-semibold">Live Assistant</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-full p-1.5 hover:bg-white/10">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[280px] overflow-y-auto bg-stone-50 p-3 space-y-2">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${message.sender === 'user' ? 'bg-amber-700 text-white' : 'bg-white text-slate-700 border border-stone-200'}`}>
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-stone-200 bg-white p-3">
            <div className="flex flex-wrap gap-2 mb-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setDraft(prompt);
                  }}
                  className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] text-slate-700 hover:bg-stone-100"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form onSubmit={handleSend} className="flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask about collections or orders"
                className="flex-1 rounded-full border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-700"
              />
              <button type="submit" className="rounded-full bg-amber-700 p-2 text-white hover:bg-amber-800">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
