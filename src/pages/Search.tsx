import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get("q") || "").toLowerCase();
  const results = q ? products.filter((p) =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.tags.some((t) => t.toLowerCase().includes(q)) ||
    p.description.toLowerCase().includes(q)
  ) : products.slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <div className="mb-10 md:mb-14">
        <h1 className="font-display text-4xl md:text-6xl text-charcoal tracking-[-0.03em] mb-3">Search Results</h1>
        <p className="text-taupe">{q ? `${results.length} results for "${searchParams.get("q")}"` : "Browse our collection"}</p>
      </div>
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {results.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <Search size={48} strokeWidth={1} className="mx-auto mb-4 text-taupe/30" />
          <h2 className="font-display text-2xl md:text-3xl text-charcoal mb-2">No products found</h2>
          <p className="text-taupe mb-6">Try another search or browse our categories.</p>
          <a href="/shop" className="inline-block px-6 py-3 bg-charcoal text-ivory rounded-full text-sm font-medium hover:bg-stone transition-colors">Browse All Products</a>
        </div>
      )}
    </div>
  );
}
