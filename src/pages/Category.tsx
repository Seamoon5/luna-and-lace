import { useParams } from "react-router-dom";
import { products, categories } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const cat = categories.find((c) => c.slug === slug);
  const items = products.filter((p) => p.slug.includes(slug || "") || p.category.toLowerCase().includes(slug || "") || p.subcategory.toLowerCase().includes(slug || ""));

  const finalItems = items.length > 0 ? items : products.filter((p) => p.category.toLowerCase().includes((cat?.name || "").toLowerCase()) || p.subcategory.toLowerCase().includes((cat?.name || "").toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <h1 className="font-display text-4xl md:text-6xl text-charcoal tracking-[-0.03em] mb-2">{cat?.name || slug?.replace(/-/g, " ")}</h1>
      <p className="text-taupe mb-10">{finalItems.length} products</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {finalItems.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
