import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/storefront/LegalPageLayout";

export const metadata: Metadata = {
  title: "Shipping Policy | Momentum Clothing",
  description:
    "Islandwide Sri Lanka shipping, Prompt Xpress delivery timelines, pre-order dispatch windows, and courier terms for Momentum Clothing.",
};

export default function ShippingPolicyPage() {
  return (
    <LegalPageLayout
      title="Shipping & Delivery Policy"
      subtitle="Islandwide Sri Lanka delivery timelines, pre-order dispatch schedules, and courier handling via Prompt Xpress."
      activePath="/legal/shipping"
    >
      <section className="space-y-3 bg-white border border-[#e5e5e0] p-5 sm:p-6">
        <p>
          <strong>Momentum Clothing</strong> delivers islandwide across Sri Lanka through our
          licensed domestic courier partner, <strong>Prompt Xpress</strong>. All orders are
          dispatched from Colombo, Sri Lanka, with SMS and tracking updates sent to the mobile
          number provided at checkout.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          1. Pre-Order Dispatch Schedule (Drop 01)
        </h2>
        <p>
          Momentum Drop 01 pieces are produced in a limited, numbered batch of 200 units. Once
          your pre-order is confirmed, your sizing allocation is reserved. Target dispatch for Drop
          01 commences in the <strong>2nd week of December 2026</strong>. You will receive an SMS
          and email notification as soon as your parcel is handed over to Prompt Xpress.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          2. Estimated Delivery Timeframes (Post-Dispatch)
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Colombo (1–15) &amp; Greater Colombo Suburbs:</strong> 1 to 3 working days from
            the date of courier handoff.
          </li>
          <li>
            <strong>Outstation / Rest of Sri Lanka:</strong> 3 to 7 working days from the date of
            courier handoff, depending on regional courier routing.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          3. Sundays &amp; Public Holidays
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Deliveries within Colombo (1–15), suburbs, and outstation areas are{" "}
            <strong>not made on Sundays</strong>.
          </li>
          <li>
            Orders placed or scheduled for dispatch on Sri Lankan Public, Mercantile, or Poya
            Holidays will be processed and handed over on the next working day.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          4. Shipping Charges &amp; Weight Surcharges
        </h2>
        <p>
          Any applicable delivery fee is displayed clearly at checkout prior to payment. Orders
          exceeding <strong>1 kg</strong> in parcel weight may be subject to an additional courier
          charge for each additional <strong>500g</strong>, in accordance with domestic courier
          tariffs.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          5. Cash on Delivery (COD) &amp; Courier Contact
        </h2>
        <p>
          Where Cash on Delivery (COD) is enabled for an order, our delivery agent will contact you
          by phone prior to arrival to confirm your availability and delivery window. Please ensure
          your Sri Lankan mobile number is active and reachable.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          6. Order Tracking &amp; Failed Delivery Attempts
        </h2>
        <p>
          You can check your order status anytime on our{" "}
          <Link href="/track" className="underline text-black hover:opacity-75">
            Order Tracking
          </Link>{" "}
          page using your Order ID. If a delivery fails due to an incorrect address or repeated
          unavailability after courier contact attempts, the parcel will be returned to our Colombo
          facility and re-dispatch may incur an additional courier fee.
        </p>
      </section>

      <section className="space-y-3 bg-[#f4f4f0] border border-[#e5e5e0] p-5 sm:p-6">
        <p>
          For urgent delivery inquiries or address updates prior to dispatch, contact our WhatsApp
          support at{" "}
          <a
            href="https://wa.me/94770413814"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-black hover:opacity-75"
          >
            +94 77 041 3814
          </a>{" "}
          or email{" "}
          <a
            href="mailto:care@momentumclothing.lk"
            className="underline text-black hover:opacity-75"
          >
            care@momentumclothing.lk
          </a>
          .
        </p>
      </section>
    </LegalPageLayout>
  );
}
