import { Link } from "react-router-dom";
import { Globe, Mail, MessageCircle } from "lucide-react";
import { storeConfig } from "../config/store";

const SHOP_LINKS = [
  { label: "New Arrivals", to: "/shop?filter=new" },
  { label: "Best Sellers", to: "/shop?filter=best" },
  { label: "Handbags", to: "/category/handbags" },
  { label: "Jewelry", to: "/category/jewelry" },
  { label: "Watches", to: "/category/watches" },
  { label: "Sale", to: "/shop?filter=sale" },
];

const HELP_LINKS = [
  { label: "Contact Us", to: "/contact" },
  { label: "FAQ", to: "/faq" },
  { label: "Shipping", to: "/shipping" },
  { label: "Returns", to: "/returns" },
  { label: "Track Order", to: "/account" },
  { label: "Account", to: "/account" },
];

const COMPANY_LINKS = [
  { label: "About Us", to: "/about" },
  { label: "Our Story", to: "/about" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Shipping Policy", to: "/shipping" },
];

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
              {SHOP_LINKS.map((item) => (
                <Link key={item.label} to={item.to} className="text-sm text-sand/70 hover:text-ivory transition-colors">{item.label}</Link>
              ))}
            </nav>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-5 text-ivory/90">Help</h4>
            <nav className="flex flex-col gap-2.5">
              {HELP_LINKS.map((item) => (
                <Link key={item.label} to={item.to} className="text-sm text-sand/70 hover:text-ivory transition-colors">{item.label}</Link>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-5 text-ivory/90">Company</h4>
            <nav className="flex flex-col gap-2.5">
              {COMPANY_LINKS.map((item) => (
                <Link key={item.label} to={item.to} className="text-sm text-sand/70 hover:text-ivory transition-colors">{item.label}</Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-sand/40">© 2026 {storeConfig.brandName}. All rights reserved.</p>
          <div className="flex gap-2">
            {[
              { icon: Globe, label: "Instagram", href: storeConfig.socialLinks.instagram },
              { icon: MessageCircle, label: "TikTok", href: storeConfig.socialLinks.tiktok },
              { icon: Mail, label: "Email", href: `mailto:${storeConfig.contactEmail}` },
            ].map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label} className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-sand/70 hover:text-ivory transition-all">
                <social.icon size={16} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
