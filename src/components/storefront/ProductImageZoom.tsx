"use client";

import { useState, useRef, MouseEvent } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";

interface ProductImageZoomProps {
  images: string[];
  alt: string;
}

export default function ProductImageZoom({ images, alt }: ProductImageZoomProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const activeImage = images[selectedIdx] || images[0];

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnail Stack */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[620px] scrollbar-none">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIdx(idx)}
            className={`relative w-20 h-26 sm:w-22 sm:h-28 flex-shrink-0 border transition-all overflow-hidden ${
              selectedIdx === idx
                ? "border-black shadow-sm opacity-100"
                : "border-transparent opacity-60 hover:opacity-90"
            }`}
          >
            <Image
              src={img}
              alt={`${alt} view ${idx + 1}`}
              fill
              className="object-cover object-top"
              sizes="90px"
            />
          </button>
        ))}
      </div>

      {/* Main Image with Macro Zoom */}
      <div className="flex-1 relative">
        <div
          ref={containerRef}
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
          className="relative aspect-[3/4] w-full bg-neutral-100 overflow-hidden cursor-crosshair border border-[#e5e5e0]"
        >
          <Image
            src={activeImage}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover object-top transition-opacity duration-200"
          />

          {/* Macro Zoom Lens Overlay */}
          {isZooming && (
            <div
              className="absolute inset-0 pointer-events-none hidden md:block"
              style={{
                backgroundImage: `url("${activeImage}")`,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundSize: "260%",
                backgroundRepeat: "no-repeat",
              }}
            />
          )}

          {/* Mobile indicator */}
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-xs flex items-center gap-1.5 pointer-events-none">
            <ZoomIn size={12} />
            <span>Hover to inspect weave</span>
          </div>
        </div>
      </div>
    </div>
  );
}
