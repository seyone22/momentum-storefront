import Link from "next/link";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";

interface LegalPageLayoutProps {
  title: string;
  subtitle?: string;
  activePath: "/legal/terms" | "/legal/privacy" | "/legal/returns" | "/legal/shipping" | "/faq";
  lastUpdated?: string;
  children: React.ReactNode;
}

const LEGAL_NAV = [
  { href: "/legal/terms", label: "Terms & Conditions" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/shipping", label: "Shipping Policy" },
  { href: "/legal/returns", label: "Returns & Exchanges" },
  { href: "/faq", label: "FAQs" },
] as const;

export default function LegalPageLayout({
  title,
  subtitle,
  activePath,
  lastUpdated = "November 15, 2026",
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="text-[11px] uppercase tracking-[0.18em] text-neutral-500 mb-6 flex items-center gap-2"
        >
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-neutral-800">{title}</span>
        </nav>

        {/* Policy Navigation Pills */}
        <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-[#e5e5e0]">
          {LEGAL_NAV.map((item) => {
            const isActive = item.href === activePath;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[11px] uppercase tracking-[0.16em] px-3.5 py-2 border transition-colors ${
                  isActive
                    ? "bg-[#111111] text-[#fbfbf9] border-[#111111]"
                    : "bg-white text-neutral-600 border-[#e5e5e0] hover:border-black hover:text-black"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Page Header */}
        <header className="mb-10 space-y-3">
          <h1 className="font-editorial text-3xl sm:text-4xl uppercase tracking-wide text-black">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] uppercase tracking-[0.15em] text-neutral-500 pt-1">
            <span>Last Updated: {lastUpdated}</span>
            <span aria-hidden="true">•</span>
            <span>Grace Hood Ventures (PVT) LTD · Reg. No. PV 00329182</span>
          </div>
        </header>

        {/* Document Body */}
        <article className="text-xs sm:text-sm text-neutral-700 leading-relaxed space-y-6">
          {children}
        </article>
      </main>

      <Footer />
    </div>
  );
}
