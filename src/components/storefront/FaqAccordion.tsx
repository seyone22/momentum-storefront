"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[#e5e5e0] border border-[#e5e5e0] bg-white">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#fbfbf9] transition-colors cursor-pointer"
            >
              <span className="text-xs sm:text-sm font-medium text-black">
                {item.question}
              </span>
              <ChevronDown
                size={16}
                className={`shrink-0 text-neutral-500 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-black" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
