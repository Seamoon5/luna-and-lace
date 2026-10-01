import { User, Package, Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Account() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <h1 className="font-display text-4xl md:text-6xl text-charcoal tracking-[-0.03em] mb-10">My Account</h1>
      <div className="grid md:grid-cols-4 gap-6 md:gap-8">
        {[
          { icon: User, label: "Profile", desc: "Manage your details" },
          { icon: Package, label: "Orders", desc: "Track orders" },
          { icon: Heart, label: "Wishlist", desc: "Saved items" },
          { icon: MapPin, label: "Addresses", desc: "Shipping info" },
        ].map((item) => (
          <Link key={item.label} to={item.label === "Wishlist" ? "/wishlist" : "#"} className="bg-paper rounded-2xl p-6 md:p-8 border border-beige/30 shadow-card hover:shadow-elevated transition-all duration-300 group">
            <item.icon size={24} strokeWidth={1.5} className="text-rose-dust-deep mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-display text-xl text-charcoal mb-1">{item.label}</h3>
            <p className="text-xs text-taupe">{item.desc}</p>
          </Link>
        ))}
      </div>
      <p className="text-xs text-taupe mt-8">No real authentication is implemented. This UI is ready for future backend integration.</p>
    </div>
  );
}
