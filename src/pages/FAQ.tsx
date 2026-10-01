import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  { q: "How long does shipping take?", a: "Orders within Pakistan typically arrive within 3-5 business days. For major cities like Karachi, Lahore, and Islamabad, delivery is often within 2-3 days." },
  { q: "What payment methods do you accept?", a: "We currently support Cash on Delivery (COD) for all orders in Pakistan. Additional payment options will be added soon." },
  { q: "Can I return or exchange an item?", a: "Yes. We accept returns within 7 days of delivery for items in original condition with tags attached. Exchanges are available based on stock availability." },
  { q: "Is Cash on Delivery safe?", a: "Yes. You pay only when the courier delivers your package. Inspect the package before making payment." },
  { q: "How do I track my order?", a: "Once your order ships, you'll receive a tracking link via email or SMS. You can also check your account for updates." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <h1 className="font-display text-4xl md:text-6xl text-charcoal tracking-[-0.03em] mb-4">Frequently Asked Questions</h1>
      <p className="text-taupe mb-10">Quick answers to common questions about orders, shipping, and returns.</p>
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="bg-paper rounded-2xl border border-beige/30 shadow-card overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 md:p-6 text-left">
              <h3 className="font-display text-lg text-charcoal">{f.q}</h3>
              {open === i ? <Minus size={20} strokeWidth={1.5} className="text-taupe shrink-0 ml-4" /> : <Plus size={20} strokeWidth={1.5} className="text-taupe shrink-0 ml-4" />}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${open === i ? "max-h-60" : "max-h-0"}`}>
              <p className="px-5 md:px-6 pb-5 md:pb-6 text-sm text-taupe leading-relaxed">{f.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
