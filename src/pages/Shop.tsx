import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { products, categories } from "../data/products";
import { formatPrice } from "../utils/currency";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get("filter");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [sort, setSort] = useState("featured");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const allColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.colors.forEach((c) => set.add(c)));
    return Array.from(set).sort();
  }, []);

  let display = products.filter((p) => {
    if (filterParam === "new") return p.newArrival;
    if (filterParam === "best") return p.bestSeller;
    if (filterParam === "sale") return p.discount > 0;
    return true;
  });

  if (selectedCategories.length > 0) {
    display = display.filter((p) => selectedCategories.includes(p.category));
  }
  if (selectedColors.length > 0) {
    display = display.filter((p) => p.colors.some((c) => selectedColors.includes(c)));
  }
  if (minPrice) display = display.filter((p) => p.price >= parseInt(minPrice));
  if (maxPrice) display = display.filter((p) => p.price <= parseInt(maxPrice));

  if (sort === "price-asc") display.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") display.sort((a, b) => b.price - a.price);
  if (sort === "rating") display.sort((a, b) => b.rating - a.rating);
  if (sort === "newest") display.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  };
  const toggleColor = (c: string) => {
    setSelectedColors((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <div className="flex items-center justify-between mb-10 md:mb-14">
        <div>
          <h1 className="font-display text-4xl md:text-6xl text-charcoal tracking-[-0.03em]">Shop All</h1>
          <p className="text-taupe text-sm mt-2">{display.length} products</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilters(!mobileFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-beige rounded-full text-sm font-medium text-charcoal"
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="hidden md:block bg-paper border border-beige rounded-full px-4 py-2.5 text-sm text-charcoal outline-none focus:border-rose-dust-deep transition-colors cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="flex gap-12">
        {/* Sidebar Filters */}
        <aside className={`hidden md:block w-72 shrink-0 ${mobileFilters ? "block" : "hidden"}`}>
          <div className="sticky top-28 space-y-8">
            <div>
              <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => toggleCategory(cat.name)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      selectedCategories.includes(cat.name) ? "bg-charcoal text-ivory border-charcoal" : "bg-paper text-taupe border-beige hover:border-charcoal"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal mb-4">Color</h3>
              <div className="flex flex-wrap gap-2">
                {allColors.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleColor(c)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      selectedColors.includes(c) ? "bg-charcoal text-ivory border-charcoal" : "bg-paper text-taupe border-beige hover:border-charcoal"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal mb-4">Price</h3>
              <div className="flex gap-2 items-center">
                <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-20 bg-paper border border-beige rounded-full px-3 py-1.5 text-xs outline-none focus:border-rose-dust-deep" />
                <span className="text-taupe text-xs">-</span>
                <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-20 bg-paper border border-beige rounded-full px-3 py-1.5 text-xs outline-none focus:border-rose-dust-deep" />
              </div>
            </div>
            {(selectedCategories.length > 0 || selectedColors.length > 0 || minPrice || maxPrice) && (
              <button onClick={clearFilters} className="text-xs text-rose-dust-deep hover:text-charcoal font-medium tracking-wide">Clear all filters</button>
            )}
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
            {display.map((p) => (
              <a key={p.id} href={`/product/${p.slug}`} className="group block bg-paper rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500">
                <div className="relative overflow-hidden aspect-[4/5] md:aspect-[3/4] bg-ivory-deep">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" loading="lazy" />
                  {p.discount > 0 && (
                    <span className="absolute top-3 left-3 bg-rose-dust-deep text-white text-[10px] font-bold tracking-[0.08em] uppercase px-2.5 py-1 rounded-full">{p.discount}% OFF</span>
                  )}
                </div>
                <div className="p-4 md:p-5">
                  <h3 className="font-display text-lg text-charcoal mb-1 tracking-[-0.01em] truncate">{p.name}</h3>
                  <div className="flex items-center gap-2.5">
                    <span className="font-display text-lg text-charcoal">{formatPrice(p.price)}</span>
                    {p.compareAtPrice > p.price && <span className="text-sm text-taupe line-through">{formatPrice(p.compareAtPrice)}</span>}
                  </div>
                </div>
              </a>
            ))}
          </div>
          {display.length === 0 && (
            <div className="text-center py-24">
              <h3 className="font-display text-2xl text-charcoal mb-2">No products found</h3>
              <p className="text-taupe mb-6">Try another search or browse our categories.</p>
              <button onClick={clearFilters} className="px-6 py-2.5 bg-charcoal text-ivory rounded-full text-sm font-medium hover:bg-stone transition-colors">Clear filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
