"use client";

import { useState } from "react";
import { X, Ruler } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<"cm" | "in">("in");

  if (!isOpen) return null;

  // Measurements in Inches and Centimeters
  const measurements = [
    { size: "26", waistIn: 26, waistCm: 66, hipIn: 36, hipCm: 91, riseIn: 11.5, riseCm: 29, inseamIn: 31, inseamCm: 79 },
    { size: "27", waistIn: 27, waistCm: 68.5, hipIn: 37, hipCm: 94, riseIn: 11.75, riseCm: 30, inseamIn: 31, inseamCm: 79 },
    { size: "28", waistIn: 28, waistCm: 71, hipIn: 38, hipCm: 96.5, riseIn: 12, riseCm: 30.5, inseamIn: 31.5, inseamCm: 80 },
    { size: "29", waistIn: 29, waistCm: 73.5, hipIn: 39, hipCm: 99, riseIn: 12.25, riseCm: 31, inseamIn: 31.5, inseamCm: 80 },
    { size: "30", waistIn: 30, waistCm: 76, hipIn: 40.5, hipCm: 103, riseIn: 12.5, riseCm: 31.7, inseamIn: 32, inseamCm: 81.5 },
    { size: "32", waistIn: 32, waistCm: 81, hipIn: 42.5, hipCm: 108, riseIn: 12.75, riseCm: 32.4, inseamIn: 32, inseamCm: 81.5 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#fbfbf9] w-full max-w-2xl rounded-sm border border-[#e5e5e0] shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-[#e5e5e0]">
          <div className="flex items-center space-x-3">
            <Ruler className="w-5 h-5 text-neutral-700" />
            <h3 className="font-editorial text-2xl uppercase tracking-wider text-black">
              Garment Sizing Spec
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-black transition-colors"
            aria-label="Close size guide"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toggle Unit */}
        <div className="flex items-center justify-between my-6">
          <p className="text-xs uppercase tracking-widest text-neutral-500 font-medium">
            Model is 5'9" (175cm) wearing Size 27
          </p>
          <div className="flex bg-[#eeeeea] p-1 rounded-sm border border-[#e2e2dc]">
            <button
              onClick={() => setUnit("in")}
              className={`px-3 py-1 text-xs font-semibold tracking-wider transition-all rounded-xs ${
                unit === "in" ? "bg-black text-white shadow-xs" : "text-neutral-600 hover:text-black"
              }`}
            >
              INCHES
            </button>
            <button
              onClick={() => setUnit("cm")}
              className={`px-3 py-1 text-xs font-semibold tracking-wider transition-all rounded-xs ${
                unit === "cm" ? "bg-black text-white shadow-xs" : "text-neutral-600 hover:text-black"
              }`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-300 text-[11px] uppercase tracking-widest text-neutral-600">
                <th className="py-3 px-3 font-semibold">Waist Size</th>
                <th className="py-3 px-3 font-semibold">Waist</th>
                <th className="py-3 px-3 font-semibold">Hip</th>
                <th className="py-3 px-3 font-semibold">Front Rise</th>
                <th className="py-3 px-3 font-semibold">Inseam</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e0] font-mono text-xs">
              {measurements.map((row) => (
                <tr key={row.size} className="hover:bg-neutral-100/50 transition-colors">
                  <td className="py-3.5 px-3 font-bold font-sans text-neutral-900">{row.size}</td>
                  <td className="py-3.5 px-3 text-neutral-700">
                    {unit === "in" ? `${row.waistIn}"` : `${row.waistCm} cm`}
                  </td>
                  <td className="py-3.5 px-3 text-neutral-700">
                    {unit === "in" ? `${row.hipIn}"` : `${row.hipCm} cm`}
                  </td>
                  <td className="py-3.5 px-3 text-neutral-700">
                    {unit === "in" ? `${row.riseIn}"` : `${row.riseCm} cm`}
                  </td>
                  <td className="py-3.5 px-3 text-neutral-700">
                    {unit === "in" ? `${row.inseamIn}"` : `${row.inseamCm} cm`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fit Advisory */}
        <div className="mt-6 p-4 bg-[#f4f4f0] border border-[#e5e5de] rounded-xs text-xs text-neutral-700 leading-relaxed space-y-1">
          <p className="font-semibold uppercase tracking-wider text-black">Fit Advisory:</p>
          <p>
            Cut from 100% rigid pre-shrunk cotton denim with zero synthetic give. For an ultra-high waisted fitted look, order true to your natural waist measurement. For an effortless relaxed or low-slung streetwear drape, we recommend ordering one size up.
          </p>
        </div>
      </div>
    </div>
  );
}
