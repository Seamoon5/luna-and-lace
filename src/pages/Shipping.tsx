export default function Shipping() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <h1 className="font-display text-4xl md:text-6xl text-charcoal tracking-[-0.03em] mb-10">Shipping Information</h1>
      <div className="text-taupe leading-relaxed space-y-6 text-sm">
        <p>Orders over Rs. 5,000 qualify for free shipping within Pakistan. Orders below this threshold have a flat Rs. 250 delivery fee.</p>
        <h2 className="font-display text-xl text-charcoal">Delivery Areas</h2>
        <p>Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, and Hyderabad. Additional cities will be added as we expand.</p>
        <h2 className="font-display text-xl text-charcoal">Delivery Time</h2>
        <p>Most orders arrive within 3-5 business days. Remote areas may take 5-7 days.</p>
        <p className="text-xs mt-8">Note: Demo store — actual delivery times and rates may change.</p>
      </div>
    </div>
  );
}
