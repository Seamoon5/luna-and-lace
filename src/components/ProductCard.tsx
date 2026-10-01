import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Plus, Star } from "lucide-react";
import { formatPrice } from "../utils/currency";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";
import { useToast } from "./ToastProvider";
import type { Product } from "../data/products";

interface Props {
  product: Product;
  variant?: "compact" | "default";
}

export default function ProductCard({ product, variant = "default" }: Props) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const { toggle, isInWishlist } = useWishlist();
  const { addItem } = useCart();
  const { show } = useToast();
  const inWishlist = isInWishlist(product.id);
  const isCompact = variant === "compact";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1, product.colors[0] || undefined, product.sizes[0] || undefined);
    setAdded(true);
    show("Added to cart");
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(product);
    show(inWishlist ? "Removed from wishlist" : "Added to wishlist", inWishlist ? "warning" : "success");
  };

  const imgSrc = hovered && product.images[1] ? product.images[1] : product.images[0];

  return (
    <Link
      to={`/product/${product.slug}`}
      className={`group relative block bg-paper rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-shadow duration-500 ${isCompact ? "" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/5] md:aspect-[3/4] bg-ivory-deep">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className={`text-[10px] font-semibold tracking-[0.08em] uppercase px-2.5 py-1 rounded-full text-white ${
              product.badge === "Best Seller" ? "bg-charcoal" : product.badge === "New" ? "bg-rose-dust-deep" : "bg-stone"
            }`}>
              {product.badge}
            </span>
          )}
          {product.discount > 0 && (
            <span className="text-[10px] font-semibold tracking-[0.08em] uppercase px-2.5 py-1 rounded-full bg-rose-dust-deep text-white">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Hover overlay actions */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            onClick={handleWishlist}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
              inWishlist ? "bg-rose-dust-deep text-white" : "bg-white/90 text-stone hover:bg-rose-dust-deep hover:text-white backdrop-blur-sm"
            }`}
            aria-label="Wishlist"
            title="Wishlist"
          >
            <Heart size={16} strokeWidth={1.5} fill={inWishlist ? "currentColor" : "none"} />
          </button>
          <button
            onClick={handleQuickAdd}
            className={`w-9 h-9 rounded-full bg-white/90 text-stone hover:bg-charcoal hover:text-white backdrop-blur-sm flex items-center justify-center shadow-md transition-all duration-300 ${added ? "scale-125 bg-charcoal text-white" : ""}`}
            aria-label="Quick add"
            title="Quick add"
          >
            <Plus size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 md:p-5">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex text-rose-dust-deep">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={12} strokeWidth={0} fill={s <= Math.round(product.rating) ? "currentColor" : "none"} className={s <= Math.round(product.rating) ? "" : "text-beige"} />
            ))}
          </div>
          <span className="text-[11px] text-taupe">({product.reviewCount})</span>
        </div>

        <h3 className="font-display text-lg md:text-xl text-charcoal mb-1 leading-snug tracking-[-0.01em]">{product.name}</h3>
        <p className="text-xs text-taupe mb-3 truncate">{product.category} · {product.material}</p>

        <div className="flex items-center gap-2.5">
          <span className="font-display text-xl text-charcoal tracking-[-0.02em]">{formatPrice(product.price)}</span>
          {product.compareAtPrice > product.price && (
            <span className="text-sm text-taupe line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
