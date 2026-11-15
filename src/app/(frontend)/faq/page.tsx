import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/storefront/LegalPageLayout";
import FaqAccordion, { FaqItem } from "@/components/storefront/FaqAccordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Momentum Clothing",
  description:
    "Answers to common questions about Momentum Clothing Drop 01 pre-orders, sizing, Payments.lk checkout, Prompt Xpress delivery, and exchanges.",
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How does the Drop 01 Pre-Order model work?",
    answer:
      "Momentum produces limited, numbered batch editions (Drop 01 is capped at 200 units). Placing a pre-order reserves your exact sizing allocation in the production run. Target dispatch commences in the 2nd week of December 2026.",
  },
  {
    question: "How long does delivery take across Sri Lanka?",
    answer:
      "Once your order is dispatched via Prompt Xpress, deliveries within Colombo (1–15) and suburbs typically arrive within 1–3 working days. Outstation deliveries take 3–7 working days. Deliveries are not made on Sundays or Sri Lankan Public Holidays.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "Online payments are processed securely in Sri Lankan Rupees (LKR) via Payments.lk / Payable, compliant with Central Bank of Sri Lanka (CBSL) standards. We do not store raw card numbers or CVVs on our servers.",
  },
  {
    question: "What if my denim piece does not fit?",
    answer:
      "We maintain a dedicated buffer stock for each drop specifically for size exchanges. You may request a size exchange within 7 days of delivery as long as the garment is unworn, unwashed, and has all original tags intact.",
  },
  {
    question: "What should I do if I receive a defective or damaged item?",
    answer:
      "Contact our WhatsApp concierge (+94 77 041 3814) or email care@momentumclothing.lk within 48 hours of delivery with photos of the issue and your Order ID. Verified defects qualify for an expedited replacement or a full refund within 5–7 banking business days.",
  },
  {
    question: "How can I track my order?",
    answer:
      "You will receive SMS and email updates when your order is handed over to Prompt Xpress. You can also check your status anytime on our Order Tracking page using your Order ID.",
  },
  {
    question: "How is my personal data protected?",
    answer:
      "Grace Hood Ventures (PVT) LTD processes your data in accordance with Sri Lanka's Personal Data Protection Act No. 9 of 2022 (PDPA). Your details are encrypted via 256-bit SSL and shared only with Payments.lk (for payment settlement) and Prompt Xpress (for delivery).",
  },
];

export default function FaqPage() {
  return (
    <LegalPageLayout
      title="Frequently Asked Questions"
      subtitle="Everything you need to know about Drop 01 pre-orders, islandwide delivery, payments, and size exchanges."
      activePath="/faq"
    >
      <FaqAccordion items={FAQ_ITEMS} />

      <section className="bg-[#f4f4f0] border border-[#e5e5e0] p-5 sm:p-6 space-y-2">
        <h2 className="font-semibold text-black uppercase tracking-wider text-xs">
          Still have a question?
        </h2>
        <p>
          Reach our Colombo customer care team via{" "}
          <a
            href="https://wa.me/94770413814"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-black hover:opacity-75"
          >
            WhatsApp (+94 77 041 3814)
          </a>{" "}
          or email{" "}
          <a
            href="mailto:care@momentumclothing.lk"
            className="underline text-black hover:opacity-75"
          >
            care@momentumclothing.lk
          </a>
          . You can also{" "}
          <Link href="/track" className="underline text-black hover:opacity-75">
            track your order
          </Link>{" "}
          online.
        </p>
      </section>
    </LegalPageLayout>
  );
}
