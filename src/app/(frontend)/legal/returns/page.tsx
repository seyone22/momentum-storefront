import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/storefront/LegalPageLayout";

export const metadata: Metadata = {
  title: "Refund & Exchange Policy | Momentum Clothing",
  description:
    "Return, size exchange, and refund policy for Momentum Clothing (momentumclothing.lk) in Sri Lanka.",
};

export default function ReturnsPolicyPage() {
  return (
    <LegalPageLayout
      title="Refund & Exchange Policy"
      subtitle="Every Momentum piece is crafted in limited batches. Review our 3-step size exchange process, defect claims, and refund terms."
      activePath="/legal/returns"
    >
      <section className="space-y-3 bg-white border border-[#e5e5e0] p-5 sm:p-6">
        <p>
          At <strong>Momentum Clothing</strong>, every garment is handcrafted with precision. We
          hold a dedicated buffer stock for each limited drop specifically for sizing adjustments so
          you can shop with confidence. If you need a size exchange or encounter a manufacturing
          issue, please follow our 3-step process below.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          How to Request an Exchange (3 Easy Steps)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-[#e5e5e0] p-4 space-y-2">
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-black block">
              Step 1 — Contact Us
            </span>
            <p>
              Reach out to our Customer Care team within <strong>7 days</strong> of delivery via{" "}
              <a
                href="mailto:care@momentumclothing.lk"
                className="underline text-black hover:opacity-75"
              >
                care@momentumclothing.lk
              </a>{" "}
              or WhatsApp at{" "}
              <a
                href="https://wa.me/94770413814"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-black hover:opacity-75"
              >
                +94 77 041 3814
              </a>{" "}
              with your Order ID and requested size.
            </p>
          </div>
          <div className="bg-white border border-[#e5e5e0] p-4 space-y-2">
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-black block">
              Step 2 — Pickup &amp; Inspection
            </span>
            <p>
              Once approved, we schedule a Prompt Xpress courier pickup from your doorstep. Your
              returned item is inspected at our Colombo warehouse for condition and hygiene.
            </p>
          </div>
          <div className="bg-white border border-[#e5e5e0] p-4 space-y-2">
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-black block">
              Step 3 — Dispatch
            </span>
            <p>
              Upon passing inspection, your replacement size or alternative piece is dispatched
              directly to your doorstep. Standard exchange turnaround is up to 14 days.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          1. Size &amp; Product Exchange Conditions
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>7-Day Window:</strong> Exchanges must be requested strictly within{" "}
            <strong>7 days</strong> from the date of courier delivery completion.
          </li>
          <li>
            <strong>Original Condition:</strong> All garments must be new, unworn, unwashed,
            unaltered, free of odors or stains, and returned in original packaging with all
            Momentum brand/price tags and labels intact.
          </li>
          <li>
            <strong>Customer Packaging Responsibility:</strong> Returned items remain the
            customer&apos;s responsibility until received at our facility. Please pack and seal the
            parcel securely to prevent transit damage or tampering.
          </li>
          <li>
            <strong>Stock Availability:</strong> Items may be exchanged for a different size or an
            alternative piece, subject to buffer-stock availability.
          </li>
          <li>
            <strong>Price Differences:</strong> If the replacement item has a higher selling price,
            you will be requested to settle the balance prior to dispatch. If the replacement item
            has a lower selling price, no cash refund or store credit is issued for the difference.
          </li>
          <li>
            <strong>No Change-of-Mind Cash Refunds:</strong> Please note that no cash refunds or
            store credit notes are issued for standard size or preference exchanges.
          </li>
          <li>
            <strong>Non-Exchangeable Items:</strong> Discounted/sale items, gift vouchers, and
            intimate/bodysuit garments (for hygiene reasons) cannot be exchanged unless defective.
          </li>
          <li>
            <strong>Rejected Returns:</strong> If an item fails inspection (e.g., worn, washed,
            missing tags, or damaged), it will be returned to you at your courier expense.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          2. Defective or Damaged Items (48-Hour Claim)
        </h2>
        <p>
          In the rare occurrence that you receive a garment with a manufacturing flaw or transit
          damage, please notify our WhatsApp concierge (
          <a
            href="https://wa.me/94770413814"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-black hover:opacity-75"
          >
            +94 77 041 3814
          </a>
          ) or email{" "}
          <a
            href="mailto:care@momentumclothing.lk"
            className="underline text-black hover:opacity-75"
          >
            care@momentumclothing.lk
          </a>{" "}
          within <strong>48 hours</strong> of receipt with clear photographic evidence and your
          Order ID.
        </p>
        <p>
          Once collected by our courier and verified by our quality assurance team as an unworn
          manufacturing or transit defect, you may choose either:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>An expedited replacement garment (at no additional courier cost to you), or</li>
          <li>A full refund of the garment value.</li>
        </ul>
        <p>
          Claims resulting from wear-and-tear, improper washing/care, or customer misuse are not
          eligible for defect refunds.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          3. Refund Processing
        </h2>
        <p>
          Approved refunds (for verified defective items, out-of-stock cancellations, or pre-order
          cancellations accepted by management) are credited back directly to your original payment
          method through <strong>Payments.lk / Payable</strong> within{" "}
          <strong>5–7 banking business days</strong>, subject to your issuing bank&apos;s settlement
          timelines. For Cash on Delivery orders, approved refunds are issued via direct bank
          transfer to your nominated Sri Lankan bank account.
        </p>
      </section>

      <section className="space-y-3 bg-[#f4f4f0] border border-[#e5e5e0] p-5 sm:p-6">
        <p>
          Need help with a return or exchange? Check our{" "}
          <Link href="/legal/shipping" className="underline text-black hover:opacity-75">
            Shipping Policy
          </Link>{" "}
          or{" "}
          <Link href="/faq" className="underline text-black hover:opacity-75">
            FAQs
          </Link>
          , or message our support team directly on WhatsApp.
        </p>
      </section>
    </LegalPageLayout>
  );
}
