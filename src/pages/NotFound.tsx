import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-24 md:py-32 text-center">
      <h1 className="font-display text-7xl md:text-9xl text-charcoal/10 tracking-[-0.05em] mb-4">404</h1>
      <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-4">Oops! This page doesn't exist.</h2>
      <p className="text-taupe mb-8">The page you're looking for may have been moved or removed.</p>
      <div className="flex gap-4 justify-center">
        <Link to="/" className="inline-flex items-center gap-2 bg-charcoal text-ivory px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-stone transition-colors shadow-lg">Back Home <ArrowLeft size={16} /></Link>
        <Link to="/shop" className="inline-flex items-center gap-2 bg-paper border border-beige text-charcoal px-7 py-3.5 rounded-full text-sm font-semibold hover:border-charcoal transition-colors">Continue Shopping <ArrowRight size={16} /></Link>
      </div>
    </div>
  );
}
