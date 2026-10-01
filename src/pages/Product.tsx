import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Plus, Minus, Star, Check, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { products } from "../data/products";
import { formatPrice } from "../utils/currency";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";
import { useToast } from "../components/ToastProvider";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug);
  const [mainImage, setMainImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "");
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || "");
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { toggle, isInWishlist } = useWishlist();
  const { show } = useToast();

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-32 text-center">
        <h2 className="font-display text-4xl text-charcoal mb-4">Product Not Found</h2>
        <Link to="/shop" className="text-rose-dust-deep hover:text-charcoal font-medium">Back to Shop</Link>
      </div>
    );
  }

  const handleAdd = () => {
    if (product.colors.length > 0 && !selectedColor) return;
    if (product.sizes.length > 0 && !selectedSize) return;
    addItem(product, qty, selectedColor || undefined, selectedSize || undefined);
    setAdded(true);
    show("Added to cart");
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = () => {
    toggle(product);
    show(isInWishlist(product.id) ? "Removed from wishlist" : "Added to wishlist", isInWishlist(product.id) ? "warning" : "success");
  };

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
      <div className="grid lg:grid-cols-2 gap-10 md:gap-16">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl bg-ivory-deep aspect-[4/5] shadow-card">
            <img src={product.images[mainImage] || product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setMainImage(i)}
                className={`shrink-0 snap-start w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 ${mainImage === i ? "border-charcoal shadow-md" : "border-transparent hover:border-beige"}`}
              >
                <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-rose-dust-deep">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={14} strokeWidth={0} fill={s <= Math.round(product.rating) ? "currentColor" : "none"} className={s <= Math.round(product.rating) ? "" : "text-beige"} />
              ))}
            </div>
            <span className="text-xs text-taupe">{product.reviewCount} reviews</span>
          </div>

          <h1 className="font-display text-3xl md:text-5xl text-charcoal tracking-[-0.03em] mb-3">{product.name}</h1>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-3xl text-charcoal">{formatPrice(product.price)}</span>
            {product.compareAtPrice > product.price && (
              <span className="text-xl text-taupe line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
            {product.discount > 0 && (
              <span className="text-xs font-bold text-rose-dust-deep tracking-wide">Save {product.discount}%</span>
            )}
          </div>

          <p className="text-taupe text-base leading-relaxed mb-8">{product.description}</p>

          {/* Color */}
          {product.colors.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-semibold tracking-[0.1em] uppercase text-stone mb-3">Color — <span className="font-normal text-taupe lowercase">{selectedColor || "Select"}</span></h4>
              <div className="flex gap-2.5 flex-wrap">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-4 py-2 rounded-full text-xs font-medium border transition-all duration-300 ${selectedColor === c ? "bg-charcoal text-ivory border-charcoal" : "bg-paper text-stone border-beige hover:border-stone"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {product.sizes.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-semibold tracking-[0.1em] uppercase text-stone mb-3">Size — <span className="font-normal text-taupe lowercase">{selectedSize || "Select"}</span></h4>
              <div className="flex gap-2.5 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-10 h-10 rounded-full text-xs font-medium border transition-all duration-300 flex items-center justify-center ${selectedSize === s ? "bg-charcoal text-ivory border-charcoal" : "bg-paper text-stone border-beige hover:border-stone"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Actions */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-beige rounded-full overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3.5 py-3 hover:bg-ivory-deep transition-colors" aria-label="Decrease"><Minus size={14} /></button>
              <span className="w-10 text-center text-sm font-medium tabular-nums">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3.5 py-3 hover:bg-ivory-deep transition-colors" aria-label="Increase"><Plus size={14} /></button>
            </div>
            <button
              onClick={handleAdd}
              className={`flex-1 py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${added ? "bg-stone text-ivory scale-[1.02]" : "bg-charcoal text-ivory hover:bg-stone shadow-lg hover:shadow-elevated"}`}
            >
              {added ? "Added!" : "Add to Cart"}
            </button>
            <button
              onClick={handleWishlist}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${inWishlist ? "bg-rose-dust-deep text-white border-rose-dust-deep" : "bg-paper text-stone border-beige hover:border-rose-dust-deep hover:text-rose-dust-deep"}`}
              aria-label="Wishlist"
            >
              <Heart size={20} strokeWidth={1.5} fill={inWishlist ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            <div className="bg-paper rounded-xl p-4 border border-beige/30 text-center">
              <Truck size={20} className="mx-auto mb-2 text-taupe" strokeWidth={1.5} />
              <p className="text-[10px] text-taupe leading-tight">Free Shipping over Rs. 5,000</p>
            </div>
            <div className="bg-paper rounded-xl p-4 border border-beige/30 text-center">
              <RotateCcw size={20} className="mx-auto mb-2 text-taupe" strokeWidth={1.5} />
              <p className="text-[10px] text-taupe leading-tight">Easy Returns</p>
            </div>
            <div className="bg-paper rounded-xl p-4 border border-beige/30 text-center">
              <ShieldCheck size={20} className="mx-auto mb-2 text-taupe" strokeWidth={1.5} />
              <p className="text-[10px] text-taupe leading-tight">Quality Guarantee</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-beige pt-8 space-y-6">
            <div>
              <h3 className="font-display text-xl text-charcoal mb-3">Product Details</h3>
              <ul className="text-sm text-taupe space-y-2">
                <li className="flex items-start gap-2"><Check size={14} className="text-rose-dust-deep mt-0.5 shrink-0" /> Material: {product.material}</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-rose-dust-deep mt-0.5 shrink-0" /> Category: {product.category}</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-rose-dust-deep mt-0.5 shrink-0" /> Available in {product.colors.length} colors</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-rose-dust-deep mt-0.5 shrink-0" /> {product.stock > 10 ? `${product.stock} in stock` : `Only ${product.stock} left`}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="max-w-3xl mx-auto mt-20 md:mt-28">
        <h2 className="font-display text-3xl text-charcoal mb-8">Customer Reviews</h2>
        {product.reviews.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map((r) => (
              <div key={r.id} className="bg-paper rounded-2xl p-6 border border-beige/30 shadow-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-rose-dust-soft flex items-center justify-center font-display text-rose-dust-deep text-sm">{r.name[0]}</div>
                  <div>
                    <p className="text-sm font-medium text-charcoal">{r.name}</p>
                    <p className="text-[10px] text-taupe">{r.date}</p>
                  </div>
                </div>
                <div className="flex text-rose-dust-deep mb-2">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={12} strokeWidth={0} fill={s <= r.rating ? "currentColor" : "none"} className={s <= r.rating ? "" : "text-beige"} />)}
                </div>
                <p className="text-sm text-taupe">{r.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-taupe text-sm">No reviews yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
}
