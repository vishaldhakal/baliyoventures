"use client";

import { ChevronLeft, ChevronRight, Image as ImageIcon, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface GalleryImageItem {
  url: string;
  alt?: string;
}

interface ProjectImageGalleryProps {
  title: string;
  images: GalleryImageItem[];
}

export default function ProjectImageGallery({
  title,
  images,
}: ProjectImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % images.length : null
    );
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev - 1 + images.length) % images.length : null
    );
  }, [images.length]);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  // Keyboard navigation listener (Left, Right, Escape)
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        handleNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        handlePrev();
      } else if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedIndex, handleNext, handlePrev, handleClose]);

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-oxanium text-2xl font-semibold uppercase tracking-[0.02em] text-[#E4E4E4] border-b border-white/[0.08] pb-3 flex items-center gap-2">
        <ImageIcon className="h-5 w-5 text-yellow-300" />
        {title}
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((img, index) => (
          <div
            key={index}
            onClick={() => setSelectedIndex(index)}
            className="group relative aspect-[4/3] w-full overflow-hidden rounded-md border border-white/[0.08] bg-white/[0.01] cursor-pointer"
          >
            <Image
              src={img.url}
              alt={img.alt || `${title} Image ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Hover overlay indicator */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/20 text-xs text-white">
                <ZoomIn className="h-4 w-4 text-yellow-300" />
                <span>Preview</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Preview Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-md p-4"
          onClick={handleClose}
        >
          {/* Top Bar */}
          <div className="fixed top-4 inset-x-4 sm:inset-x-8 z-50 flex items-center justify-between pointer-events-auto">
            <span className="font-oxanium text-sm font-medium text-white/80 bg-black/60 px-3.5 py-1.5 rounded-full border border-white/10">
              {title} ({selectedIndex + 1} of {images.length})
            </span>
            <button
              onClick={handleClose}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/10"
              title="Close (Esc)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Buttons (Outside Image) */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="fixed left-3 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3 sm:p-4 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 text-white shadow-xl transition-all hover:scale-110 cursor-pointer"
                title="Previous (Left Arrow)"
              >
                <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="fixed right-3 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3 sm:p-4 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 text-white shadow-xl transition-all hover:scale-110 cursor-pointer"
                title="Next (Right Arrow)"
              >
                <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>
            </>
          )}

          {/* Main Image Container (Constrained width so image stays inside buttons) */}
          <div
            className="relative flex items-center justify-center w-full h-full max-h-[82vh] max-w-[calc(100vw-120px)] sm:max-w-[calc(100vw-180px)]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedIndex].url}
              alt={
                images[selectedIndex].alt ||
                `${title} Image ${selectedIndex + 1}`
              }
              className="max-h-[82vh] max-w-full object-contain rounded-md select-none shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
