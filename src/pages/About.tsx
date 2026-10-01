import { ArrowRight } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <h1 className="font-display text-4xl md:text-7xl text-charcoal tracking-[-0.03em] mb-6">Our Story</h1>
      <p className="text-xl md:text-2xl text-taupe font-display mb-10 leading-relaxed">"Luna & Lace was created for women who believe the smallest details can transform an entire look."</p>
      <div className="prose prose-lg text-taupe leading-relaxed space-y-6">
        <p>We believe accessories are not an afterthought — they are the finishing touch that turns a simple outfit into a statement. Our collection is designed for modern women who value quality, elegance, and versatility.</p>
        <p>From structured leather bags to delicate pearl earrings, every piece in our collection is selected with intention. We partner with artisans and suppliers who share our commitment to craftsmanship and ethical production.</p>
        <p>Based in Pakistan but inspired by global fashion, Luna & Lace brings premium accessories within reach — without compromising on quality or style.</p>
      </div>
      <a href="/contact" className="inline-flex items-center gap-2 mt-10 bg-charcoal text-ivory px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-stone transition-colors shadow-lg">Get in Touch <ArrowRight size={16} /></a>
    </div>
  );
}
