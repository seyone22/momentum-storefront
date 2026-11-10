import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-[#fbfbf9] pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-neutral-800">
          
          {/* Brand info */}
          <div className="space-y-3">
            <Image
              src="/logo.svg"
              alt="Momentum"
              width={140}
              height={36}
              className="h-7 w-auto invert brightness-200"
            />
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              Grace Hood Ventures (PVT) LTD. Limited-batch contemporary apparel.
            </p>
          </div>

          {/* Storefront links */}
          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-400">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <Link href="/#collection" className="hover:text-white transition-colors">
                  Drop 01 Collection
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-white transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/94770413814"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-400">
              Information
            </h4>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <Link href="/legal/terms" className="hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/returns" className="hover:text-white transition-colors">
                  Refund &amp; Return Policy
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-neutral-500 space-y-4 sm:space-y-0">
          <p>&copy; 2026 Momentum Clothing / Grace Hood Ventures (PVT) LTD.</p>
          <p className="tracking-widest uppercase">Colombo, Sri Lanka</p>
        </div>
      </div>
    </footer>
  );
}
