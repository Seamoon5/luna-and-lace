import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { formatPrice } from "../utils/currency";
import { storeConfig } from "../config/store";

export default function Cart() {
  const { items, removeItem, updateQty, total } = useCart();
  const shippingCost = total >= storeConfig.shippingThreshold ? 0 : storeConfig.defaultShippingCost;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32 text-center">
        <ShoppingBag size={56} strokeWidth={0.8} className="mx-auto mb-6 text-taupe/20" />
        <h1 className="font-display text-3xl md:text-5xl text-charcoal tracking-[-0.03em] mb-4">Your bag is waiting.</h1>
        <p className="text-taupe mb-8">Discover something beautiful for your next look.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 bg-charcoal text-ivory px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-stone transition-colors shadow-lg">Continue Shopping <ArrowRight size={16} /></Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <h1 className="font-display text-4xl md:text-6xl text-charcoal tracking-[-0.03em] mb-10">Your Bag</h1>
      <div className="grid lg:grid-cols-3 gap-10 md:gap-16">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="bg-paper rounded-2xl p-5 md:p-6 border border-beige/30 shadow-card flex gap-5 md:gap-6">
              <Link to={`/product/${item.product.slug}`} className="shrink-0 w-24 h-28 md:w-28 md:h-36 overflow-hidden rounded-xl bg-ivory-deep">
                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500" />
              </Link>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link to={`/product/${item.product.slug}`} className="font-display text-lg text-charcoal hover:text-rose-dust-deep transition-colors tracking-[-0.01em]">{item.product.name}</Link>
                  {(item.selectedColor || item.selectedSize) && (
                    <p className="text-xs text-taupe mt-1">{[item.selectedColor, item.selectedSize].filter(Boolean).join(" · ")}</p>
                  )}
                </div>
                <div className="flex items-end justify-between mt-4">
                  <div className="flex items-center gap-2 border border-beige rounded-full overflow-hidden">
                    <button onClick={() => updateQty(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)} className="px-3 py-1.5 hover:bg-ivory-deep" aria-label="Decrease"><Minus size={14} /></button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQty(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)} className="px-3 py-1.5 hover:bg-ivory-deep" aria-label="Increase"><Plus size={14} /></button>
                  </div>
                  <div className="flex items-center gap-5">
                    <span className="font-display text-lg text-charcoal">{formatPrice(item.product.price * item.quantity)}</span>
                    <button onClick={() => removeItem(item.product.id, item.selectedColor, item.selectedSize)} className="text-taupe hover:text-rose-dust-deep transition-colors" aria-label="Remove"><Trash2 size={18} strokeWidth={1.5} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <aside className="bg-paper rounded-2xl p-6 md:p-8 border border-beige/30 shadow-card h-fit">
          <h3 className="font-display text-xl text-charcoal mb-6">Order Summary</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm"><span className="text-taupe">Subtotal</span><span>{formatPrice(total)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-taupe">Shipping</span><span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span></div>
            {total >= storeConfig.shippingThreshold && <p className="text-xs text-rose-dust-deep">Free shipping unlocked!</p>}
          </div>
          <div className="border-t border-beige pt-4 mb-6 flex justify-between font-display text-xl"><span>Total</span><span>{formatPrice(total + shippingCost)}</span></div>
          <Link to="/checkout" className="block w-full text-center bg-charcoal text-ivory py-4 rounded-full text-sm font-semibold tracking-wide hover:bg-stone transition-colors shadow-lg">Proceed to Checkout</Link>
          <Link to="/shop" className="block w-full text-center mt-3 text-sm text-taupe hover:text-charcoal transition-colors">Continue Shopping</Link>
        </aside>
      </div>
    </div>
  );
}
