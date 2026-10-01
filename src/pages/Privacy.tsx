export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <h1 className="font-display text-4xl md:text-6xl text-charcoal tracking-[-0.03em] mb-10">Privacy Policy</h1>
      <div className="text-taupe leading-relaxed space-y-6 text-sm">
        <h2 className="font-display text-xl text-charcoal mt-8">Data Collection</h2>
        <p>We collect only the information necessary to process orders: name, email, phone, and shipping address. We do not sell or share this information with third parties.</p>
        <h2 className="font-display text-xl text-charcoal">Cookies</h2>
        <p>We use cookies to maintain your cart and wishlist locally in your browser. No tracking cookies are used.</p>
        <h2 className="font-display text-xl text-charcoal">Security</h2>
        <p>This is a frontend-only demo. No sensitive data is transmitted to a backend or stored remotely.</p>
        <p className="text-xs mt-8">Note: This is a placeholder policy. Replace with legally reviewed text before launching.</p>
      </div>
    </div>
  );
}
