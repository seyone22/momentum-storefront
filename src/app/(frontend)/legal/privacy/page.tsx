import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9]">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full text-xs sm:text-sm text-neutral-700 leading-relaxed space-y-6">
        <h1 className="font-editorial text-4xl uppercase tracking-wide text-black mb-8">
          Privacy Policy
        </h1>
        <p>
          Grace Hood Ventures (PVT) LTD and Momentum Clothing respect your privacy. This policy outlines how your personal data is collected, used, and protected during the checkout and order fulfillment process.
        </p>

        <h3 className="font-semibold text-black uppercase tracking-wider text-sm pt-4">
          1. Information We Collect
        </h3>
        <p>
          We collect your name, shipping address, email address, and mobile telephone number solely for the purposes of generating your pre-order invoice, processing payment with Payments.lk, and coordinating Prompt Xpress courier delivery.
        </p>

        <h3 className="font-semibold text-black uppercase tracking-wider text-sm pt-4">
          2. Data Sharing &amp; Third Parties
        </h3>
        <p>
          We do not sell or rent customer data. Personal details are transmitted securely over 256-bit SSL encryption to:
          (a) Payments.lk for merchant transaction settlement, and (b) Prompt Xpress courier personnel for delivery dispatch.
        </p>
      </main>
      <Footer />
    </div>
  );
}
