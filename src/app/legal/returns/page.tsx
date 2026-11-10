import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9]">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full text-xs sm:text-sm text-neutral-700 leading-relaxed space-y-6">
        <h1 className="font-editorial text-4xl uppercase tracking-wide text-black mb-8">
          Refund &amp; Exchange Policy
        </h1>
        <p>
          At Momentum, every denim piece is handcrafted with precision. We want you to feel confident in your fit and styling.
        </p>

        <h3 className="font-semibold text-black uppercase tracking-wider text-sm pt-4">
          1. Size Exchange Guarantee
        </h3>
        <p>
          We hold a dedicated buffer stock for each drop specifically for sizing adjustments. If your denim piece does not fit as expected, you may request an exchange within <strong>7 days</strong> of delivery. The item must be unworn, unwashed, and returned in its original condition with all tags intact.
        </p>

        <h3 className="font-semibold text-black uppercase tracking-wider text-sm pt-4">
          2. Defective or Damaged Items
        </h3>
        <p>
          In the unlikely event that a garment possesses a manufacturing flaw or shipping defect, please notify our WhatsApp concierge or email us at care@momentumclothing.lk with photographic evidence within 48 hours of receipt. A full refund or expedited replacement will be issued immediately.
        </p>

        <h3 className="font-semibold text-black uppercase tracking-wider text-sm pt-4">
          3. Refund Processing
        </h3>
        <p>
          Approved refunds will be credited back directly to the original payment method through Payments.lk within 5–7 banking business days.
        </p>
      </main>
      <Footer />
    </div>
  );
}
