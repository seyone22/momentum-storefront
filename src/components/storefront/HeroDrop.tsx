import Link from "next/link";
import { ArrowDown } from "lucide-react";

export default function HeroDrop() {
  return (
    <section className="relative border-b border-[#e5e5e0] bg-[#fbfbf9] py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-500 font-medium">
          Inaugural Drop 01
        </p>

        <h1 className="font-editorial text-5xl sm:text-7xl font-normal leading-[1.05] tracking-tight text-neutral-950">
          Tailored Women’s Denim
        </h1>

        <p className="text-neutral-600 text-sm sm:text-base max-w-lg mx-auto leading-relaxed font-light">
          A limited pre-order collection featuring contrast panels and lace detailing.
        </p>

        <div className="pt-4">
          <Link
            href="/#collection"
            className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white text-[11px] uppercase tracking-[0.2em] font-medium py-4 px-8 transition-all"
          >
            <span>View The Pieces</span>
            <ArrowDown size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}
