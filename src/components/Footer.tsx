import { Link } from "react-router-dom";
import { Globe, Mail, MessageCircle } from "lucide-react";
import { storeConfig } from "../config/store";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-ivory">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16 md:pt-20 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-display text-2xl tracking-[-0.03em] text-ivory block mb-4">{storeConfig.brandName}</Link>
            <p className="text-sm text-sand/80 leading-relaxed max-w-xs">Premium women's accessories, designed with intention. Every piece tells a story.</p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-5 text-ivory/90">Shop</h4>
            <nav className="flex flex-col gap-2.5">
              {["New Arrivals", "Best Sellers", "Handbags", "Jewelry", "Watches", "Sale"].map((item) => (
                <Link key={item} to="/shop" className="text-sm text-sand/70 hover:text-ivory transition-colors">{item}</Link>
              ))}
            </nav>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-5 text-ivory/90">Help</h4>
            <nav className="flex flex-col gap-2.5">
              {["Contact Us", "FAQ", "Shipping", "Returns", "Track Order", "Account"].map((item) => (
                <Link key={item} to={item === "Contact Us" ? "/contact" : item === "FAQ" ? "/faq" : item === "Shipping" ? "/shipping" : item === "Returns" ? "/returns" : item === "Account" ? "/account" : "/faq"} className="text-sm text-sand/70 hover:text-ivory transition-colors">{item}</Link>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-5 text-ivory/90">Company</h4>
            <nav className="flex flex-col gap-2.5">
              {["About Us", "Our Story", "Privacy Policy", "Terms & Conditions", "Shipping Policy"].map((item) => (
                <Link key={item} to={item === "About Us" ? "/about" : item === "Privacy Policy" ? "/privacy" : item === "Terms & Conditions" ? "/terms" : item === "Shipping Policy" ? "/shipping" : "/about"} className="text-sm text-sand/70 hover:text-ivory transition-colors">{item}</Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-sand/40">© 2026 {storeConfig.brandName}. All rights reserved.</p>
          <div className="flex gap-2">
            {[
              { icon: Globe, label: "Instagram" },
              { icon: MessageCircle, label: "TikTok" },
              { icon: Mail, label: "Email" },
            ].map((social) => (
              <a key={social.label} href="#" aria-label={social.label} className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-sand/70 hover:text-ivory transition-all">
                <social.icon size={16} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
