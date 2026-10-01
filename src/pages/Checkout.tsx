import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CreditCard, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { formatPrice } from "../utils/currency";
import { storeConfig } from "../config/store";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", province: "PK", postal: "", country: "Pakistan", method: "cod" });
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const shippingCost = total >= storeConfig.shippingThreshold ? 0 : storeConfig.defaultShippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) { setStep(2); return; }
    setSubmitted(true);
    clearCart();
    setTimeout(() => navigate("/order-confirmation"), 1500);
  };

  if (items.length === 0 && !submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32 text-center">
        <ShoppingBag size={56} strokeWidth={0.8} className="mx-auto mb-6 text-taupe/20" />
        <h1 className="font-display text-3xl md:text-5xl text-charcoal tracking-[-0.03em] mb-4">Your cart is empty</h1>
        <p className="text-taupe mb-8">Add a few pieces before you check out.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 bg-charcoal text-ivory px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-stone transition-colors shadow-lg">Continue Shopping <ArrowRight size={16} /></Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <h1 className="font-display text-4xl md:text-6xl text-charcoal tracking-[-0.03em] mb-10">Checkout</h1>
      <div className="grid lg:grid-cols-5 gap-10 md:gap-16">
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit}>
            {/* Customer Info */}
            <section className="mb-10">
              <h2 className="font-display text-2xl text-charcoal mb-6">Customer Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input required placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-paper border border-beige rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-dust-deep transition-colors" />
                <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-paper border border-beige rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-dust-deep transition-colors" />
                <input required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-paper border border-beige rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-dust-deep transition-colors" />
              </div>
            </section>

            {/* Shipping */}
            <section className="mb-10">
              <h2 className="font-display text-2xl text-charcoal mb-6">Shipping Address</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input required placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="md:col-span-2 w-full bg-paper border border-beige rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-dust-deep transition-colors" />
                <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full bg-paper border border-beige rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-dust-deep transition-colors" />
                <select value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} className="w-full bg-paper border border-beige rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-dust-deep transition-colors">
                  <option>Punjab</option><option>Sindh</option><option>KPK</option><option>Balochistan</option>
                </select>
                <input placeholder="Postal Code" value={form.postal} onChange={(e) => setForm({ ...form, postal: e.target.value })} className="w-full bg-paper border border-beige rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-dust-deep transition-colors" />
              </div>
            </section>

            {/* Payment */}
            <section className="mb-10">
              <h2 className="font-display text-2xl text-charcoal mb-6">Payment Method</h2>
              <label className="flex items-center gap-3 bg-paper border border-beige rounded-xl px-5 py-4 cursor-pointer hover:border-rose-dust-deep/30 transition-colors">
                <input type="radio" name="method" value="cod" checked={form.method === "cod"} onChange={(e) => setForm({ ...form, method: e.target.value })} className="accent-charcoal" />
                <CreditCard size={20} strokeWidth={1.5} className="text-taupe" />
                <div>
                  <p className="text-sm font-medium text-charcoal">Cash on Delivery</p>
                  <p className="text-xs text-taupe">Pay when you receive your order</p>
                </div>
              </label>
            </section>

            <button type="submit" className="w-full bg-charcoal text-ivory py-4 rounded-full text-sm font-semibold tracking-wide hover:bg-stone transition-colors shadow-lg">
              {step < 2 ? "Continue" : (submitted ? "Order Placed!" : "Place Order")}
            </button>
          </form>
        </div>

        <aside className="bg-paper rounded-2xl p-6 md:p-8 border border-beige/30 shadow-card h-fit lg:sticky lg:top-28">
          <h3 className="font-display text-xl text-charcoal mb-6">Order Summary</h3>
          <div className="space-y-4 mb-6">
            {items.map((it) => (
              <div key={`${it.product.id}-${it.selectedColor}`} className="flex gap-3">
                <div className="w-14 h-16 rounded-lg overflow-hidden bg-ivory-deep"><img src={it.product.images[0]} alt={it.product.name} className="w-full h-full object-cover" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">{it.product.name} <span className="text-taupe">× {it.quantity}</span></p>
                  <p className="text-xs text-taupe">{it.selectedColor || "Standard"}</p>
                </div>
                <span className="text-sm font-medium text-charcoal">{formatPrice(it.product.price * it.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-beige pt-4 space-y-2 mb-4 text-sm">
            <div className="flex justify-between text-taupe"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
            <div className="flex justify-between text-taupe"><span>Shipping</span><span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span></div>
          </div>
          <div className="border-t border-beige pt-4 flex justify-between font-display text-xl mb-2"><span>Total</span><span>{formatPrice(total + shippingCost)}</span></div>
          <p className="text-[10px] text-taupe">{storeConfig.demoLabel}</p>
        </aside>
      </div>
    </div>
  );
}
