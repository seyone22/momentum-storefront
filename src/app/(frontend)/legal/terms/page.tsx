import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9]">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full text-xs sm:text-sm text-neutral-700 leading-relaxed space-y-6">
        <h1 className="font-editorial text-4xl uppercase tracking-wide text-black mb-8">
          Terms &amp; Conditions
        </h1>
        <p>
          Welcome to Momentum Clothing (<strong>“Momentum”</strong>), operated under <strong>Grace Hood Ventures (PVT) LTD</strong> (Company Registration No: PV 00329182), Colombo, Sri Lanka. By placing a pre-order or purchasing goods through our website (momentumclothing.lk) or authorized WhatsApp concierge channels, you agree to the following terms.
        </p>

        <h3 className="font-semibold text-black uppercase tracking-wider text-sm pt-4">
          1. Pre-Order &amp; Batch Production Model
        </h3>
        <p>
          Momentum produces garments in limited, numbered batch editions (Drop 01: 200 units). When you place a pre-order, your sizing allocation is reserved and fabric cutting commences. Expected dispatch commences the 2nd week of December 2026. While we strive to meet target windows, minor production or transit delays will be communicated proactively via SMS or email.
        </p>

        <h3 className="font-semibold text-black uppercase tracking-wider text-sm pt-4">
          2. Payments &amp; Gateway Compliance
        </h3>
        <p>
          Online transactions are processed securely through certified Internet Payment Gateways (Payments.lk / Payable) adhering to the standards of the Central Bank of Sri Lanka (CBSL). We do not store raw card numbers, CVVs, or bank credentials on our servers. All transactions are charged in Sri Lankan Rupees (LKR).
        </p>

        <h3 className="font-semibold text-black uppercase tracking-wider text-sm pt-4">
          3. Deliveries &amp; Inspection
        </h3>
        <p>
          Deliveries are handled by licensed domestic courier partners (Prompt Xpress). Customers are required to provide a valid telephone number and address. Upon receipt, customers are advised to inspect the garment package for integrity.
        </p>
      </main>
      <Footer />
    </div>
  );
}
