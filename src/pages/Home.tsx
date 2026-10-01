import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { products, categories } from "../data/products";
import ProductCard from "../components/ProductCard";
import { storeConfig } from "../config/store";

export default function Home() {
  const featured = products.filter((p) => p.featured);
  const newArrivals = products.filter((p) => p.newArrival);
  const bestSellers = products.filter((p) => p.bestSeller);

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[92vh] min-h-[600px] md:min-h-[720px] overflow-hidden bg-stone">
        <img
          src="/img/photos/hero.jpg"
          alt="Woman carrying a leather shoulder bag"
          className="absolute inset-0 w-full h-full object-cover object-[22%_50%] md:object-center opacity-45 md:opacity-70 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/60 via-charcoal/30 to-transparent hidden md:block" />
        {/* On phones the still-life would crop into the headline, so wash it out instead. */}
        <div className="absolute inset-0 bg-charcoal/55 md:hidden" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
            <div className="max-w-xl">
              <p className="text-ivory/80 text-sm md:text-base tracking-[0.2em] uppercase mb-6 font-medium">{storeConfig.brandName}</p>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-ivory leading-[0.92] mb-6 tracking-[-0.04em] text-balance">
                Accessories That <em className="italic font-light">Complete</em> Your Look.
              </h1>
              <p className="text-ivory/80 text-base md:text-lg mb-8 leading-relaxed max-w-md">Discover timeless pieces designed to elevate every outfit — from structured bags to delicate jewelry.</p>
              <div className="flex gap-4">
                <Link to="/shop?filter=new" className="inline-flex items-center gap-2.5 bg-ivory text-charcoal px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide hover:bg-paper transition-colors shadow-lg">
                  Shop New Arrivals <ArrowRight size={16} strokeWidth={2} />
                </Link>
                <Link to="/shop" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-ivory border border-white/20 px-7 py-3.5 rounded-full text-sm font-medium tracking-wide hover:bg-white/20 transition-colors">
                  Explore Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY QUICK LINKS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {[
            { name: "Handbags", to: "/category/handbags", img: "/img/photos/cat-handbags.jpg" },
            { name: "Jewelry", to: "/category/jewelry", img: "/img/photos/cat-jewelry.jpg" },
            { name: "Watches", to: "/category/watches", img: "/img/photos/cat-watches.jpg" },
            { name: "Sunglasses", to: "/category/sunglasses", img: "/img/photos/cat-sunglasses.jpg" },
            { name: "Scarves", to: "/category/scarves", img: "/img/photos/cat-scarves.jpg" },
            { name: "Gift Sets", to: "/category/gift-sets", img: "/img/photos/cat-gift-sets.jpg" },
          ].map((cat) => (
            <Link key={cat.name} to={cat.to} className="group relative overflow-hidden rounded-2xl shadow-card hover:shadow-elevated transition-all duration-500 aspect-[4/5] md:aspect-[3/4]">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <h3 className="font-display text-xl md:text-2xl text-ivory tracking-[-0.02em] mb-1">{cat.name}</h3>
                <span className="text-xs text-ivory/80 tracking-wide group-hover:text-ivory transition-colors">Shop Now</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-28">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-4xl md:text-6xl text-charcoal tracking-[-0.03em] mb-3">Featured Collection</h2>
          <p className="text-taupe text-base">Handpicked pieces for the modern wardrobe.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* PROMOTIONAL BANNER */}
      <section className="relative overflow-hidden mt-16 md:mt-24">
        <img src="/img/photos/banner.jpg" alt="Silver necklace and pearl necklace from the Luna &amp; Lace collection" className="w-full h-[420px] md:h-[500px] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
            <div className="max-w-lg">
              <h2 className="font-display text-4xl md:text-6xl text-ivory tracking-[-0.03em] mb-4 leading-[1.05]">The Details Matter.</h2>
              <p className="text-ivory/80 text-base md:text-lg mb-6">Small accessories. Big difference. Discover the pieces that define your personal style.</p>
              <Link to="/shop" className="inline-flex items-center gap-2.5 bg-ivory text-charcoal px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-paper transition-colors shadow-lg">
                Shop Accessories <ArrowRight size={16} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-28">
        <div className="flex items-end justify-between mb-10 md:mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-5xl text-charcoal tracking-[-0.03em] mb-2">New Arrivals</h2>
            <p className="text-taupe text-sm">Fresh pieces for the season ahead.</p>
          </div>
          <Link to="/shop?filter=new" className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-rose-dust-deep hover:text-charcoal transition-colors tracking-wide">View All <ArrowRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-28 pb-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-3xl md:text-5xl text-charcoal tracking-[-0.03em] mb-3">Shop By Category</h2>
          <p className="text-taupe text-base">Browse our complete collection.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link key={cat.slug} to={`/category/${cat.slug}`} className="group text-center py-8 md:py-10 bg-paper rounded-2xl border border-beige/40 hover:border-rose-dust-deep/30 hover:shadow-elevated transition-all duration-300">
              <h3 className="font-display text-xl md:text-2xl text-charcoal group-hover:text-rose-dust-deep transition-colors tracking-[-0.02em]">{cat.name}</h3>
              <span className="text-xs text-taupe mt-1 block">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-16 md:pt-24">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-display text-3xl md:text-5xl text-charcoal tracking-[-0.03em] mb-3">Our Best Sellers</h2>
          <p className="text-taupe text-base">Loved by thousands of women.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* SOCIAL GALLERY */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-28">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-display text-3xl md:text-5xl text-charcoal tracking-[-0.03em] mb-2">Follow The Look</h2>
          <p className="text-taupe text-base">Style inspiration from our community.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { src: "/img/photos/gallery-1.jpg", alt: "Tan leather handbag styled with a belt" },
            { src: "/img/photos/gallery-2.jpg", alt: "Pearl choker necklace detail" },
            { src: "/img/photos/gallery-3.jpg", alt: "Stacked gold bangles" },
            { src: "/img/photos/gallery-4.jpg", alt: "Gold bangles and pearls from the collection" },
          ].map((item) => (
            <a key={item.src} href={storeConfig.socialLinks.instagram} target="_blank" rel="noreferrer" className="group relative overflow-hidden rounded-2xl aspect-[4/5] md:aspect-[3/4] block shadow-card hover:shadow-elevated transition-all duration-500">
              <img src={item.src} alt={item.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-charcoal/20 transition-colors" />
            </a>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 pt-20 md:pt-28 pb-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-3xl md:text-5xl text-charcoal tracking-[-0.03em] mb-3">What Our Customers Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {[
            { quote: "Absolutely love the quality. The bag looks even better in person.", name: "Sarah M.", role: "Karachi" },
            { quote: "Elegant pieces that feel premium without being over the top. The leather is incredible.", name: "Ayesha K.", role: "Lahore" },
            { quote: "I wear my pearl earrings almost every day. So versatile and beautiful.", name: "Zara T.", role: "Islamabad" },
          ].map((t, i) => (
            <div key={i} className="bg-paper rounded-2xl p-7 md:p-8 border border-beige/30 shadow-card">
              <div className="flex gap-1 mb-4 text-rose-dust-deep">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Sparkles key={s} size={14} strokeWidth={1.5} />
                ))}
              </div>
              <blockquote className="font-display text-xl md:text-2xl text-charcoal leading-relaxed mb-6 tracking-[-0.01em]">"{t.quote}"</blockquote>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-rose-dust-soft flex items-center justify-center font-display text-rose-dust-deep text-sm">{t.name[0]}</div>
                <div>
                  <p className="text-sm font-medium text-charcoal">{t.name}</p>
                  <p className="text-xs text-taupe">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-charcoal text-ivory">
        <div className="max-w-3xl mx-auto px-6 md:px-8 py-16 md:py-24 text-center">
          <h2 className="font-display text-3xl md:text-5xl tracking-[-0.03em] mb-4">10% Off Your First Order</h2>
          <p className="text-ivory/70 mb-8">Join our mailing list for new arrivals, exclusive offers, and styling inspiration.</p>
          <form
            onSubmit={(e) => { e.preventDefault(); alert("Thank you for subscribing! (Demo — no real email sent)"); }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <input
              type="email"
              placeholder="Your email address"
              required
              className="flex-1 max-w-md px-5 py-3.5 rounded-full bg-white/10 border border-white/10 text-ivory placeholder:text-ivory/50 text-sm outline-none focus:border-ivory/30 transition-colors"
            />
            <button type="submit" className="px-8 py-3.5 rounded-full bg-ivory text-charcoal text-sm font-semibold tracking-wide hover:bg-paper transition-colors shadow-lg">
              Join Now
            </button>
          </form>
          <p className="text-[10px] text-ivory/30 mt-4">{storeConfig.demoLabel}</p>
        </div>
      </section>
    </div>
  );
}
