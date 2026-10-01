import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function OrderConfirmation() {
  // Generated once per order, not on every render.
  const [orderNum] = useState(
    () => `LL-2026-${String(Math.floor(Math.random() * 90000) + 10000)}`
  );

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-20 md:py-28 text-center">
      <CheckCircle size={64} strokeWidth={1} className="mx-auto mb-6 text-rose-dust-deep" />
      <h1 className="font-display text-4xl md:text-6xl text-charcoal tracking-[-0.03em] mb-4">Thank You For Your Order!</h1>
      <p className="text-taupe mb-8">Your order has been received. We'll notify you when it ships.</p>
      <div className="bg-paper rounded-2xl border border-beige/30 p-6 md:p-8 text-left shadow-card mb-8">
        <p className="text-xs text-taupe uppercase tracking-[0.15em] mb-2">Order Number</p>
        <p className="font-display text-xl text-charcoal mb-6">{orderNum}</p>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-taupe">Payment</span><span className="text-charcoal font-medium">Cash on Delivery</span></div>
          <div className="flex justify-between"><span className="text-taupe">Shipping</span><span className="text-charcoal">Karachi, Pakistan</span></div>
        </div>
      </div>
      <div className="flex gap-4 justify-center">
        <Link to="/shop" className="inline-flex items-center gap-2 bg-charcoal text-ivory px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-stone transition-colors shadow-lg">Continue Shopping <ArrowRight size={16} /></Link>
      </div>
      <p className="text-[10px] text-taupe mt-6">{"This is a demo store. No real order has been placed."}</p>
    </div>
  );
}
