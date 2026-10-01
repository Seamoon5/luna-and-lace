import ProductCard from "./ProductCard";
import type { Product } from "../data/products";

interface Props {
  products: Product[];
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export default function ProductGrid({ products, title, subtitle, compact }: Props) {
  if (products.length === 0) return null;
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
      {(title || subtitle) && (
        <div className="text-center mb-10 md:mb-14">
          {title && <h2 className="font-display text-3xl md:text-5xl text-charcoal mb-3 tracking-[-0.03em]">{title}</h2>}
          {subtitle && <p className="text-taupe text-base md:text-lg max-w-md mx-auto">{subtitle}</p>}
        </div>
      )}
      <div className={`grid gap-6 md:gap-8 ${compact ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} variant={compact ? "compact" : "default"} />
        ))}
      </div>
    </section>
  );
}
