import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, Heart, ShoppingBag, User } from "lucide-react";
import { storeConfig } from "../config/store";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { count } = useCart();
  const { items: wishlistItems } = useWishlist();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { label: "Shop", to: "/shop" },
    { label: "New Arrivals", to: "/shop?filter=new" },
    { label: "Best Sellers", to: "/shop?filter=best" },
    { label: "Sale", to: "/shop?filter=sale" },
    { label: "Categories", to: "/category/handbags", child: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-ivory/85 backdrop-blur-xl border-b border-beige/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-[72px] md:h-[80px]">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 -ml-2 text-charcoal hover:text-stone transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>

          {/* Brand */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:ml-0 flex flex-col items-center md:items-start">
            <span className="font-display text-xl md:text-2xl tracking-[-0.03em] text-charcoal leading-none">{storeConfig.brandName}</span>
            <span className="text-[9px] tracking-[0.2em] uppercase text-taupe font-body mt-0.5 hidden md:block">Premium Accessories</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 ml-auto mr-8">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="text-[13px] font-medium text-stone hover:text-charcoal transition-colors tracking-wide relative group">
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-charcoal transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 md:gap-5 ml-auto md:ml-0">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-charcoal hover:text-rose-dust-deep transition-colors"
              aria-label="Search"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link to="/account" className="hidden sm:block p-2 text-charcoal hover:text-rose-dust-deep transition-colors" aria-label="Account">
              <User size={20} strokeWidth={1.5} />
            </Link>
            <Link to="/wishlist" className="hidden sm:block p-2 text-charcoal hover:text-rose-dust-deep transition-colors relative" aria-label="Wishlist">
              <Heart size={20} strokeWidth={1.5} />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-dust-deep text-white text-[9px] rounded-full flex items-center justify-center font-bold">{wishlistItems.length}</span>
              )}
            </Link>
            <Link to="/cart" className="p-2 text-charcoal hover:text-rose-dust-deep transition-colors relative" aria-label="Cart">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-charcoal text-ivory text-[9px] rounded-full flex items-center justify-center font-bold">{count}</span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className={`overflow-hidden transition-all duration-300 ease-out ${searchOpen ? "max-h-16 opacity-100 pb-3" : "max-h-0 opacity-0"}`}>
          <form onSubmit={handleSearch} className="flex items-center gap-3 border-b border-beige pb-2">
            <Search size={18} className="text-taupe" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search bags, jewelry, scarves..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm outline-none text-charcoal placeholder:text-taupe/60 font-body"
              autoFocus={searchOpen}
            />
            <button type="submit" className="text-xs font-medium text-rose-dust-deep hover:text-charcoal tracking-wide">Search</button>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-paper/95 backdrop-blur-xl border-b border-beige/40 ${mobileOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"}`}>
        <nav className="flex flex-col px-6 py-4 gap-1">
          {[
            { label: "Home", to: "/" },
            { label: "Shop All", to: "/shop" },
            { label: "New Arrivals", to: "/shop?filter=new" },
            { label: "Best Sellers", to: "/shop?filter=best" },
            { label: "Sale", to: "/shop?filter=sale" },
            { label: "Categories", to: "/category/handbags" },
            { label: "About", to: "/about" },
            { label: "Contact", to: "/contact" },
          ].map((l) => (
            <Link key={l.to + l.label} to={l.to} onClick={() => setMobileOpen(false)} className="py-3 text-[15px] font-medium text-charcoal border-b border-beige/30 hover:text-rose-dust-deep transition-colors font-display">{l.label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
