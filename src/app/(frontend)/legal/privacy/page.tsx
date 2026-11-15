import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/storefront/LegalPageLayout";
import CookieSettingsButton from "@/components/storefront/CookieSettingsButton";

export const metadata: Metadata = {
  title: "Privacy Policy | Momentum Clothing",
  description:
    "Privacy Policy for Momentum Clothing and Grace Hood Ventures (PVT) LTD, prepared in accordance with Sri Lanka's Personal Data Protection Act No. 9 of 2022 (PDPA).",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="How Grace Hood Ventures (PVT) LTD and Momentum Clothing collect, process, store, and safeguard your personal data in accordance with Sri Lankan law."
      activePath="/legal/privacy"
    >
      <section className="space-y-3 bg-white border border-[#e5e5e0] p-5 sm:p-6">
        <p>
          At <strong>Momentum Clothing</strong> (&ldquo;Momentum&rdquo;), operated by{" "}
          <strong>Grace Hood Ventures (PVT) LTD</strong> (Company Registration No:{" "}
          <strong>PV 00329182</strong>, Office &amp; Warehouse: Ja-Ela, Sri Lanka), we value your
          privacy and are
          committed to protecting the personal data you share with us. This Privacy Policy explains
          how we collect, use, disclose, and safeguard your information when you visit{" "}
          <strong>momentumclothing.lk</strong>, place a pre-order or purchase, or interact with us
          via email, WhatsApp, or social media.
        </p>
        <p>
          We process personal data in accordance with the{" "}
          <strong>Personal Data Protection Act No. 9 of 2022 (PDPA)</strong> of Sri Lanka and
          applicable Central Bank of Sri Lanka (CBSL) e-commerce security guidelines.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          1. Information We Collect
        </h2>
        <p>We may collect and process the following categories of personal data:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Identity &amp; Contact Details:</strong> Full name, email address, mobile
            telephone number, and shipping/billing address (including city and postal details).
          </li>
          <li>
            <strong>Order &amp; Transaction Information:</strong> Garment selections, sizes,
            pre-order allocation numbers, order reference IDs, payment status, and delivery
            preferences.{" "}
            <em>
              We never store raw credit/debit card numbers, CVVs, or bank PINs on our servers.
            </em>
          </li>
          <li>
            <strong>Device &amp; Technical Data:</strong> IP address, browser type, device
            operating system, referring URLs, and essential session/cart state stored locally in
            your browser.
          </li>
          <li>
            <strong>Communication Data:</strong> Messages, sizing inquiries, exchange requests,
            photographic defect reports, or feedback sent via email, phone, WhatsApp concierge, or
            social media channels.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          2. Lawful Basis &amp; How We Use Your Information
        </h2>
        <p>
          Under the PDPA, we only process your personal data when we have a valid lawful basis.
          Specifically, we use your information to:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Contractual Fulfillment:</strong> Process your pre-orders and purchases,
            generate invoices, process payments via Payments.lk / Payable, and coordinate islandwide
            delivery with Prompt Xpress.
          </li>
          <li>
            <strong>Customer Support &amp; Order Updates:</strong> Send order confirmations,
            Drop 01 production status updates, courier tracking notifications via SMS/WhatsApp, and
            handle size exchanges or defect claims.
          </li>
          <li>
            <strong>Service Improvement &amp; Security:</strong> Prevent fraudulent transactions,
            diagnose technical issues, and improve our storefront experience.
          </li>
          <li>
            <strong>Marketing Communications (Consent-Based):</strong> Send drop announcements or
            promotional updates only where you have explicitly opted in. You may withdraw consent
            at any time.
          </li>
          <li>
            <strong>Legal &amp; Regulatory Compliance:</strong> Comply with Sri Lankan tax,
            accounting, audit, and consumer protection obligations.
          </li>
        </ul>
        <p>
          <strong>We will never sell, lease, or rent your personal data to third parties.</strong>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          3. Data Sharing &amp; Third-Party Service Providers
        </h2>
        <p>
          To fulfill your orders reliably, personal details are shared strictly on a need-to-know
          basis over encrypted channels with trusted third-party processors:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Payment Gateways:</strong> Certified Sri Lankan Internet Payment Gateways (
            <strong>Payments.lk / Payable</strong>) adhering to CBSL and PCI-DSS standards for
            secure merchant transaction settlement in LKR.
          </li>
          <li>
            <strong>Logistics &amp; Courier Partners:</strong> Licensed domestic courier partners
            (such as <strong>Prompt Xpress</strong>) who receive your name, delivery address, and
            contact number solely to complete delivery and coordinate Cash on Delivery (where
            applicable).
          </li>
          <li>
            <strong>Infrastructure &amp; Communication Tools:</strong> Secure cloud hosting,
            transactional email/SMS providers, and WhatsApp Business channels used to operate our
            storefront and customer care.
          </li>
          <li>
            <strong>Legal Authorities:</strong> Where required by law, court order, or lawful
            request by competent Sri Lankan regulatory authorities.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          4. Cross-Border Data Transfers
        </h2>
        <p>
          Where any of our cloud hosting or technical service providers store or process data
          outside Sri Lanka, Grace Hood Ventures (PVT) LTD ensures appropriate contractual and
          technical safeguards are in place so that your personal data receives a level of
          protection consistent with the Sri Lankan PDPA.
        </p>
      </section>

      <section id="cookies" className="space-y-4 scroll-mt-24">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          5. Cookies, Local Storage &amp; Global Privacy Control (GPC)
        </h2>
        <p>
          Our website uses strictly necessary browser storage and cookies to keep your shopping bag
          intact, support secure checkout, and record your consent choices. Optional analytics or
          marketing cookies are <strong>only activated with your prior opt-in consent</strong>. We
          also honor browser-level <strong>Global Privacy Control (GPC)</strong> signals by
          automatically disabling non-essential tracking.
        </p>

        <div className="overflow-x-auto border border-[#e5e5e0] bg-white">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e5e5e0] bg-[#f4f4f0] text-[11px] uppercase tracking-wider text-black">
                <th className="py-2.5 px-4 font-semibold">Storage / Cookie</th>
                <th className="py-2.5 px-4 font-semibold">Category</th>
                <th className="py-2.5 px-4 font-semibold">Purpose</th>
                <th className="py-2.5 px-4 font-semibold">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e0] text-neutral-700">
              <tr>
                <td className="py-2.5 px-4 font-mono text-[11px] text-black">momentum_cart_v1</td>
                <td className="py-2.5 px-4">Strictly Necessary</td>
                <td className="py-2.5 px-4">
                  Persists your selected garments, sizes, and quantities in your pre-order bag.
                </td>
                <td className="py-2.5 px-4">Persistent (until cleared)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono text-[11px] text-black">
                  momentum_cookie_consent_v1
                </td>
                <td className="py-2.5 px-4">Strictly Necessary</td>
                <td className="py-2.5 px-4">
                  Stores your granular cookie consent preferences and timestamp.
                </td>
                <td className="py-2.5 px-4">Persistent (until updated)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono text-[11px] text-black">momentum_consent</td>
                <td className="py-2.5 px-4">Strictly Necessary</td>
                <td className="py-2.5 px-4">
                  First-party cookie (`SameSite=Lax`) recording your consent choices.
                </td>
                <td className="py-2.5 px-4">180 days</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          You can review, change, or withdraw your consent at any time without affecting your
          shopping bag:{" "}
          <CookieSettingsButton
            label="Manage Cookie Preferences"
            className="underline text-black font-medium hover:opacity-75 cursor-pointer"
          />
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          6. Data Security
        </h2>
        <p>
          Your personal data is transmitted over 256-bit SSL/TLS encryption and stored securely with
          restricted access limited to authorized personnel. We implement reasonable physical,
          electronic, and managerial safeguards to prevent unauthorized access, alteration,
          disclosure, or destruction of your information. While we follow industry best practices,
          no online transmission is 100% immune to risk.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          7. Data Retention
        </h2>
        <p>
          We retain your personal information only for as long as necessary to fulfill the purposes
          outlined in this Privacy Policy—including order fulfillment, the 7-day exchange window,
          customer support, and statutory accounting/tax retention periods required under Sri
          Lankan law. Once data is no longer required, it is securely deleted or anonymized.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          8. Your Rights Under Sri Lankan Law (PDPA)
        </h2>
        <p>Subject to applicable statutory exceptions, you have the right to:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Request access to and obtain a copy of the personal data we hold about you.</li>
          <li>Request rectification or completion of inaccurate or incomplete personal data.</li>
          <li>
            Request erasure of your personal data where it is no longer necessary for the purpose
            collected (subject to legal retention obligations).
          </li>
          <li>Withdraw your consent for marketing communications at any time.</li>
          <li>Object to or request restriction of certain processing activities.</li>
          <li>
            Lodge a complaint with the <strong>Data Protection Authority of Sri Lanka</strong> if
            you believe your rights have been infringed.
          </li>
        </ul>
        <p>
          To exercise any of these rights, please contact our Data Protection / Customer Care desk
          at{" "}
          <a
            href="mailto:care@momentumclothing.lk"
            className="underline text-black hover:opacity-75"
          >
            care@momentumclothing.lk
          </a>
          . We will respond to verified requests within the statutory timelines prescribed by law.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          9. Children&apos;s Privacy
        </h2>
        <p>
          Our website and services are intended for adults aged 18 years and older. We do not
          knowingly collect personal data from individuals under 18 years of age without verified
          parental or guardian consent. If we become aware that such data has been collected
          inadvertently, it will be promptly deleted.
        </p>
      </section>

      <section className="space-y-3 bg-[#f4f4f0] border border-[#e5e5e0] p-5 sm:p-6">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm">
          10. Updates to This Policy &amp; Contact Us
        </h2>
        <p>
          Grace Hood Ventures (PVT) LTD reserves the right to update this Privacy Policy from time
          to time. Any changes will be posted on this page with an updated &ldquo;Last
          Updated&rdquo; date. For any privacy questions, data access requests, or concerns, please
          contact:
        </p>
        <div className="pt-2 space-y-1 text-neutral-800">
          <p>
            <strong>Momentum Customer Care — Grace Hood Ventures (PVT) LTD</strong>
          </p>
          <p>Company Registration No: PV 00329182 · Office &amp; Warehouse: Ja-Ela, Sri Lanka</p>
          <p>
            Email:{" "}
            <a
              href="mailto:care@momentumclothing.lk"
              className="underline text-black hover:opacity-75"
            >
              care@momentumclothing.lk
            </a>
          </p>
          <p>
            Hotline / WhatsApp:{" "}
            <a
              href="https://wa.me/94770413814"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-black hover:opacity-75"
            >
              +94 77 041 3814
            </a>
          </p>
          <p>
            Related:{" "}
            <Link href="/legal/terms" className="underline text-black hover:opacity-75">
              Terms &amp; Conditions
            </Link>
          </p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
