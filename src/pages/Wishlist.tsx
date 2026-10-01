import { Link } from "react-router-dom";
import { ArrowRight, HeartCrack } from "lucide-react";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";
import { useToast } from "../components/ToastProvider";
import { formatPrice } from "../utils/currency";

export default function Wishlist() {
  const { items, toggle } = useWishlist();
  const { addItem } = useCart();
  const { show } = useToast();

  const handleMoveToCart = (p: typeof items[0]) => {
    addItem(p, 1, p.colors[0] || undefined, p.sizes[0] || undefined);
    show("Moved to cart");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32 text-center">
        <HeartCrack size={56} strokeWidth={0.8} className="mx-auto mb-6 text-taupe/20" />
        <h1 className="font-display text-3xl md:text-5xl text-charcoal tracking-[-0.03em] mb-4">Your wishlist is empty.</h1>
        <p className="text-taupe mb-8">Save pieces you love for later.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 bg-charcoal text-ivory px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-stone transition-colors shadow-lg">Continue Shopping <ArrowRight size={16} /></Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <h1 className="font-display text-4xl md:text-6xl text-charcoal tracking-[-0.03em] mb-10">Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {items.map((p) => (
          <div key={p.id} className="bg-paper rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500 border border-beige/20">
            <Link to={`/product/${p.slug}`} className="block relative overflow-hidden aspect-[4/5] md:aspect-[3/4] bg-ivory-deep">
              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700" />
              <button onClick={(e) => { e.preventDefault(); toggle(p); }} className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-rose-dust-deep hover:text-white transition-colors text-stone" aria-label="Remove from wishlist">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </button>
            </Link>
            <div className="p-5">
              <Link to={`/product/${p.slug}`} className="font-display text-lg text-charcoal hover:text-rose-dust-deep transition-colors tracking-[-0.01em] block mb-1">{p.name}</Link>
              <p className="text-sm text-taupe mb-3">{formatPrice(p.price)}</p>
              <button onClick={() => handleMoveToCart(p)} className="w-full py-2.5 rounded-full bg-charcoal text-ivory text-xs font-semibold hover:bg-stone transition-colors">Move to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
