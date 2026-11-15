import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/storefront/LegalPageLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions | Momentum Clothing",
  description:
    "Terms and Conditions governing purchases, pre-orders, payments, and use of Momentum Clothing (momentumclothing.lk), operated by Grace Hood Ventures (PVT) LTD in Sri Lanka.",
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      subtitle="Please read these Terms of Service carefully before accessing our website or placing an order with Momentum Clothing."
      activePath="/legal/terms"
    >
      <section className="space-y-3 bg-white border border-[#e5e5e0] p-5 sm:p-6">
        <p>
          This website (<strong>momentumclothing.lk</strong>) is operated by{" "}
          <strong>Momentum Clothing</strong> (&ldquo;Momentum&rdquo;), a brand owned and
          managed by <strong>Grace Hood Ventures (PVT) LTD</strong> (Company Registration No:{" "}
          <strong>PV 00329182</strong>), a private limited liability company incorporated in Sri
          Lanka and operating from its office and warehouse in <strong>Ja-Ela, Sri Lanka</strong>.
          Throughout the site, the terms &ldquo;we&rdquo;, &ldquo;us&rdquo;,
          and &ldquo;our&rdquo; refer to Momentum Clothing and Grace Hood Ventures (PVT) LTD.
        </p>
        <p>
          Momentum offers this website, including all information, tools, products, and services
          available from this site to you, the user, conditioned upon your acceptance of all terms,
          conditions, policies, and notices stated here. By visiting our site, placing a pre-order,
          or purchasing something from us (including via authorized WhatsApp concierge channels),
          you engage in our &ldquo;Service&rdquo; and agree to be bound by the following Terms and
          Conditions (&ldquo;Terms of Service&rdquo;, &ldquo;Terms&rdquo;), including our{" "}
          <Link href="/legal/privacy" className="underline text-black hover:opacity-75">
            Privacy Policy
          </Link>
          ,{" "}
          <Link href="/legal/shipping" className="underline text-black hover:opacity-75">
            Shipping Policy
          </Link>
          , and{" "}
          <Link href="/legal/returns" className="underline text-black hover:opacity-75">
            Refund &amp; Exchange Policy
          </Link>
          .
        </p>
        <p>
          These Terms apply to all users of the site, including without limitation browsers,
          customers, merchants, and contributors of content. If you do not agree to all the terms
          and conditions of this agreement, you may not access the website or use any services.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          Section 1 — Online Store Terms &amp; Eligibility
        </h2>
        <p>
          By agreeing to these Terms, you represent that you are at least the age of majority in
          the Democratic Socialist Republic of Sri Lanka (18 years of age or older), or that you
          have obtained the express consent of a parent or legal guardian to use this site and place
          orders.
        </p>
        <p>
          You may not use our products or services for any illegal or unauthorized purpose nor may
          you, in the use of the Service, violate any applicable laws in Sri Lanka or your
          jurisdiction (including, without limitation, intellectual property and copyright laws). You
          must not transmit any worms, viruses, or any code of a destructive nature. A breach or
          violation of any of these Terms will result in an immediate termination of your Services.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          Section 2 — General Conditions &amp; Electronic Contracting
        </h2>
        <p>
          We reserve the right to refuse service to anyone for any lawful reason at any time. In
          accordance with the <strong>Electronic Transactions Act No. 19 of 2006</strong> of Sri
          Lanka, orders placed electronically through our website constitute valid and binding
          electronic contracts once confirmed by us via order confirmation email or SMS.
        </p>
        <p>
          You understand that your non-payment content may be transferred over various networks and
          adapted to technical requirements of connecting networks or devices. Payment card
          information is always encrypted during transfer over networks through our certified
          payment gateway partners. You agree not to reproduce, duplicate, copy, sell, resell, or
          exploit any portion of the Service without our express written permission.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          Section 3 — Accuracy, Completeness &amp; Timeliness of Information
        </h2>
        <p>
          We strive to ensure all information on this site is accurate and current; however, we are
          not responsible if general information made available on this site is not accurate,
          complete, or current. Any reliance on general material on this site is at your own risk.
          We reserve the right to modify the contents of this site at any time, and it is your
          responsibility to monitor changes to our site.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          Section 4 — Modifications to the Service &amp; Prices
        </h2>
        <p>
          All prices on our website are listed in <strong>Sri Lankan Rupees (LKR)</strong> unless
          explicitly stated otherwise. Prices for our products are subject to change without prior
          notice. We reserve the right at any time to modify or discontinue the Service (or any
          part or content thereof) without notice, and we shall not be liable to you or any
          third-party for any modification, price change, suspension, or discontinuance of the
          Service, except that confirmed paid orders will be honored at the price paid at checkout.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          Section 5 — Products, Pre-Order &amp; Batch Production Model
        </h2>
        <p>
          Momentum produces garments in limited, numbered batch editions (for example,{" "}
          <strong>Drop 01: 200 units</strong>). Certain products are available exclusively online
          through our website in limited quantities and are subject to return or exchange strictly
          in accordance with our{" "}
          <Link href="/legal/returns" className="underline text-black hover:opacity-75">
            Refund &amp; Exchange Policy
          </Link>
          .
        </p>
        <p>
          When you place a pre-order, your sizing allocation is reserved and fabric cutting and
          finishing commence. For Drop 01, target dispatch commences in the{" "}
          <strong>2nd week of December 2026</strong>. While we take every measure to meet target
          production windows, minor manufacturing or transit delays will be communicated proactively
          via SMS, WhatsApp, or email.
        </p>
        <p>
          We have made every effort to display as accurately as possible the colors, washes, and
          textures of our denim and apparel. However, we cannot guarantee that your device screen&apos;s
          display of any color will be completely accurate, and slight variations in artisan
          garment washes are an inherent characteristic of handcrafted denim.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          Section 6 — Accuracy of Billing, Account &amp; Order Information
        </h2>
        <p>
          We reserve the right to refuse any order you place with us. We may, in our sole
          discretion, limit or cancel quantities purchased per person, per household, or per order.
          These restrictions may include orders placed under the same customer account, the same
          payment card, or orders using the same billing or shipping address. In the event we make
          a change to or cancel an order, we will attempt to notify you via the email address,
          billing address, or phone number provided at checkout. We reserve the right to limit or
          prohibit orders that, in our judgment, appear to be placed by unauthorized dealers,
          resellers, or distributors.
        </p>
        <p>
          You agree to provide current, complete, and accurate purchase and delivery information for
          all orders made at our store so that we can complete your transactions and coordinate
          delivery.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          Section 7 — Payments &amp; CBSL-Compliant Gateway Terms
        </h2>
        <p>
          Online transactions are processed securely through certified Sri Lankan Internet Payment
          Gateways (<strong>Payments.lk / Payable</strong>) adhering to the regulatory standards of
          the <strong>Central Bank of Sri Lanka (CBSL)</strong> and PCI-DSS security protocols. We
          do not store raw credit/debit card numbers, CVVs, or banking credentials on our servers.
        </p>
        <p>
          All online transactions are charged in Sri Lankan Rupees (LKR). Where Cash on Delivery
          (COD) is offered for eligible orders, full payment in LKR must be tendered to the courier
          upon delivery.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          Section 8 — Deliveries, Risk of Loss &amp; Inspection
        </h2>
        <p>
          Deliveries within Sri Lanka are handled by licensed domestic courier partners (including{" "}
          <strong>Prompt Xpress</strong>) in accordance with our{" "}
          <Link href="/legal/shipping" className="underline text-black hover:opacity-75">
            Shipping Policy
          </Link>
          . Customers must provide a valid Sri Lankan telephone number and accurate delivery
          address. Risk of loss and title for items purchased pass to you upon delivery to your
          designated address. Upon receipt, customers are advised to inspect the garment package for
          tampering or damage and report any transit or manufacturing defect within{" "}
          <strong>48 hours</strong>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          Section 9 — Optional Tools &amp; Third-Party Links
        </h2>
        <p>
          We may provide you with access to third-party tools or links (such as payment gateways,
          courier tracking portals, or WhatsApp concierge links) over which we neither monitor nor
          have control. We are not responsible for examining or evaluating the content or accuracy
          of third-party websites and shall have no liability arising from your use of third-party
          websites or tools. Please review the third-party&apos;s policies before engaging in any
          transaction.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          Section 10 — User Comments, Feedback &amp; Submissions
        </h2>
        <p>
          If you send us creative ideas, suggestions, proposals, reviews, or other materials
          (collectively, &ldquo;comments&rdquo;), whether online, by email, WhatsApp, or social
          media, you agree that we may use, edit, publish, and distribute such comments without
          restriction or compensation, provided we do so in accordance with our Privacy Policy. You
          agree that your comments will not violate any third-party rights (including copyright,
          trademark, or privacy) or contain unlawful, defamatory, or malicious content.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          Section 11 — Intellectual Property
        </h2>
        <p>
          All content on this website, including the <strong>Momentum Clothing</strong> name,
          logo, garment designs, patterns, photography, editorial copy, graphics, and source code,
          is the exclusive intellectual property of <strong>Grace Hood Ventures (PVT) LTD</strong>{" "}
          or its licensors and is protected under the{" "}
          <strong>Intellectual Property Act No. 36 of 2003</strong> of Sri Lanka and international
          treaties. Unauthorized reproduction, scraping, or commercial exploitation is strictly
          prohibited.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          Section 12 — Personal Information
        </h2>
        <p>
          Your submission of personal information through the store is governed by our{" "}
          <Link href="/legal/privacy" className="underline text-black hover:opacity-75">
            Privacy Policy
          </Link>
          , prepared in compliance with the Personal Data Protection Act No. 9 of 2022 (PDPA) of
          Sri Lanka.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          Section 13 — Errors, Inaccuracies &amp; Omissions
        </h2>
        <p>
          Occasionally there may be information on our site that contains typographical errors,
          inaccuracies, or omissions relating to product descriptions, pricing, promotions, shipping
          charges, transit times, or stock availability. We reserve the right to correct any
          errors, inaccuracies, or omissions, and to update information or cancel orders if any
          information in the Service is inaccurate at any time without prior notice (including after
          you have submitted your order), in which case any amount paid for a cancelled order will
          be refunded in full.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          Section 14 — Prohibited Uses
        </h2>
        <p>
          You are prohibited from using the site or its content: (a) for any unlawful purpose; (b)
          to solicit others to perform or participate in any unlawful acts; (c) to violate any
          Sri Lankan or international laws or regulations; (d) to infringe upon our intellectual
          property rights or the rights of others; (e) to harass, abuse, defame, intimidate, or
          discriminate against any person; (f) to submit false or misleading information; (g) to
          upload or transmit viruses or malicious code; (h) to collect or track the personal
          information of others; (i) to spam, phish, crawl, or scrape; or (j) to interfere with or
          circumvent the security features of the Service.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          Section 15 — Disclaimer of Warranties &amp; Limitation of Liability
        </h2>
        <p>
          We do not guarantee that your use of our website will be uninterrupted, timely, secure, or
          error-free. Except as expressly stated by us or mandated under the{" "}
          <strong>Consumer Affairs Authority Act No. 9 of 2003</strong> of Sri Lanka, the Service
          and all products delivered through the Service are provided &ldquo;as is&rdquo; and
          &ldquo;as available&rdquo;.
        </p>
        <p>
          To the maximum extent permitted by Sri Lankan law, Grace Hood Ventures (PVT) LTD, its
          directors, officers, employees, affiliates, agents, and service providers shall not be
          liable for any indirect, incidental, punitive, special, or consequential damages arising
          from your use of the Service or any products procured using the Service. Nothing in these
          Terms excludes or limits liability that cannot be lawfully excluded under Sri Lankan
          consumer protection law.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          Section 16 — Indemnification
        </h2>
        <p>
          You agree to indemnify, defend, and hold harmless Grace Hood Ventures (PVT) LTD, Momentum
          Clothing, and our directors, officers, employees, agents, contractors, and suppliers from
          any claim or demand, including reasonable attorneys&apos; fees, made by any third-party
          due to or arising out of your breach of these Terms or your violation of any law or the
          rights of a third-party.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          Section 17 — Severability &amp; Termination
        </h2>
        <p>
          If any provision of these Terms is determined to be unlawful, void, or unenforceable under
          Sri Lankan law, such provision shall nonetheless be enforceable to the fullest extent
          permitted by applicable law, and the unenforceable portion shall be deemed severed without
          affecting the validity of remaining provisions. These Terms remain effective unless and
          until terminated by either you or us. Obligations and liabilities incurred prior to
          termination survive termination.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          Section 18 — Entire Agreement
        </h2>
        <p>
          Our failure to exercise or enforce any right or provision of these Terms shall not
          constitute a waiver of such right or provision. These Terms and any policies posted by us
          on this site (including the Privacy Policy, Shipping Policy, and Refund &amp; Exchange
          Policy) constitute the entire agreement between you and us, superseding any prior
          agreements or communications.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm pt-2">
          Section 19 — Governing Law &amp; Jurisdiction
        </h2>
        <p>
          These Terms of Service and any separate agreements whereby we provide you Services shall
          be governed by and construed in accordance with the laws of the{" "}
          <strong>Democratic Socialist Republic of Sri Lanka</strong>. Any disputes arising out of
          or in connection with these Terms shall be subject to the exclusive jurisdiction of the
          competent courts of <strong>Colombo, Sri Lanka</strong>.
        </p>
      </section>

      <section className="space-y-3 bg-[#f4f4f0] border border-[#e5e5e0] p-5 sm:p-6">
        <h2 className="font-semibold text-black uppercase tracking-wider text-sm">
          Section 20 — Changes to Terms &amp; Contact Information
        </h2>
        <p>
          You can review the most current version of these Terms at any time on this page. We
          reserve the right to update, change, or replace any part of these Terms by posting
          updates to our website. Your continued use of the website following any changes
          constitutes acceptance of those changes.
        </p>
        <div className="pt-2 space-y-1 text-neutral-800">
          <p>
            <strong>Grace Hood Ventures (PVT) LTD</strong> (t/a Momentum Clothing)
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
            WhatsApp / Hotline:{" "}
            <a
              href="https://wa.me/94770413814"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-black hover:opacity-75"
            >
              +94 77 041 3814
            </a>
          </p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
