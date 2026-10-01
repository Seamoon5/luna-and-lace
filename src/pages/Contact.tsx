import { Mail, Phone, MapPin } from "lucide-react";
import { storeConfig } from "../config/store";

export default function Contact() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <h1 className="font-display text-4xl md:text-6xl text-charcoal tracking-[-0.03em] mb-4">Contact Us</h1>
      <p className="text-taupe mb-12">We'd love to hear from you. Reach out for questions, custom orders, or just to say hello.</p>

      <div className="grid md:grid-cols-2 gap-8 md:gap-16">
        <form onSubmit={(e) => { e.preventDefault(); alert("Message received (demo — not actually sent)."); }} className="bg-paper rounded-2xl p-6 md:p-8 border border-beige/30 shadow-card space-y-4">
          <h3 className="font-display text-2xl text-charcoal mb-4">Send a Message</h3>
          <input required placeholder="Name" className="w-full bg-ivory border border-beige rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-dust-deep transition-colors" />
          <input required type="email" placeholder="Email" className="w-full bg-ivory border border-beige rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-dust-deep transition-colors" />
          <input placeholder="Subject" className="w-full bg-ivory border border-beige rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-dust-deep transition-colors" />
          <textarea required placeholder="Your message" rows={4} className="w-full bg-ivory border border-beige rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-dust-deep transition-colors resize-none" />
          <button type="submit" className="w-full bg-charcoal text-ivory py-3.5 rounded-full text-sm font-semibold hover:bg-stone transition-colors shadow-lg">Send Message</button>
        </form>

        <div className="space-y-6">
          <div className="bg-paper rounded-2xl p-6 md:p-8 border border-beige/30 shadow-card">
            <h3 className="font-display text-xl text-charcoal mb-4">Store Details</h3>
            <div className="space-y-3 text-sm text-taupe">
              <p className="flex items-center gap-3"><Mail size={16} strokeWidth={1.5} className="text-rose-dust-deep" /> {storeConfig.contactEmail}</p>
              <p className="flex items-center gap-3"><Phone size={16} strokeWidth={1.5} className="text-rose-dust-deep" /> {storeConfig.phone}</p>
              <p className="flex items-start gap-3"><MapPin size={16} strokeWidth={1.5} className="text-rose-dust-deep mt-0.5" /> {storeConfig.address}</p>
            </div>
          </div>
          <div className="bg-paper rounded-2xl p-6 md:p-8 border border-beige/30 shadow-card">
            <h3 className="font-display text-xl text-charcoal mb-3">Note</h3>
            <p className="text-sm text-taupe">This is a demo store. Messages are not actually sent to any backend or email service.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
