"use client";

import { useEffect, useState } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
} from "next-share";
import { Facebook, Linkedin, Link, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  description?: string;
}

export default function ShareButtons({ title, description }: ShareButtonsProps) {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  if (!shareUrl) {
    return (
      <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-white/[0.08]">
        <h4 className="font-oxanium text-xs font-semibold uppercase tracking-[0.1em] text-[#8F8F8F]">
          Share Project
        </h4>
        <div className="flex gap-3 h-10 w-full animate-pulse bg-white/[0.02] rounded-md" />
      </div>
    );
  }

  const cleanDescription = description 
    ? description.replace(/<[^>]*>/g, "").substring(0, 150) + "..." 
    : "Check out this project by Baliyo Ventures!";

  return (
    <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-white/[0.08]">
      <h4 className="font-oxanium text-xs font-semibold uppercase tracking-[0.1em] text-[#8F8F8F]">
        Share Project
      </h4>

      <div className="flex flex-wrap items-center gap-3">
        {/* Facebook Share */}
        <FacebookShareButton
          url={shareUrl}
          quote={`${title} - ${cleanDescription}`}
          hashtag="#baliyoventures"
        >
          <div className="group flex items-center justify-center h-10 w-10 rounded bg-[#12151C] border border-white/[0.07] text-[#B5B5B5] hover:text-[#FFFFFF] hover:bg-[#1877F2] hover:border-[#1877F2] hover:shadow-[0_0_15px_rgba(24,119,242,0.5)] active:scale-95 transition-all duration-300 cursor-pointer">
            <Facebook className="h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110" />
          </div>
        </FacebookShareButton>

        {/* X / Twitter Share */}
        <TwitterShareButton
          url={shareUrl}
          title={`Check out this amazing project: ${title} by Baliyo Ventures!`}
        >
          <div className="group flex items-center justify-center h-10 w-10 rounded bg-[#12151C] border border-white/[0.07] text-[#B5B5B5] hover:text-[#FFFFFF] hover:bg-[#000000] hover:border-white/[0.2] hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] active:scale-95 transition-all duration-300 cursor-pointer">
            <svg className="h-4 w-4 fill-current transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
        </TwitterShareButton>

        {/* LinkedIn Share */}
        <LinkedinShareButton
          url={shareUrl}
          title={title}
          summary={cleanDescription}
          source="Baliyo Ventures"
        >
          <div className="group flex items-center justify-center h-10 w-10 rounded bg-[#12151C] border border-white/[0.07] text-[#B5B5B5] hover:text-[#FFFFFF] hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:shadow-[0_0_15px_rgba(10,102,194,0.5)] active:scale-95 transition-all duration-300 cursor-pointer">
            <Linkedin className="h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110" />
          </div>
        </LinkedinShareButton>

        {/* WhatsApp Share */}
        <WhatsappShareButton
          url={shareUrl}
          title={`*${title}*\n\n${cleanDescription}\n\nRead more at: `}
          separator=""
        >
          <div className="group flex items-center justify-center h-10 w-10 rounded bg-[#12151C] border border-white/[0.07] text-[#B5B5B5] hover:text-[#FFFFFF] hover:bg-[#25D366] hover:border-[#25D366] hover:shadow-[0_0_15px_rgba(37,211,102,0.5)] active:scale-95 transition-all duration-300 cursor-pointer">
            <svg className="h-4.5 w-4.5 fill-current transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.637-1.03-5.112-2.905-6.986C16.457 1.88 13.985 1.05 11.996 1.05c-5.439 0-9.867 4.427-9.87 9.868-.001 1.77.462 3.5 1.342 5.025l-.974 3.557 3.638-.954zm12.355-6.52c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
          </div>
        </WhatsappShareButton>

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className="group relative flex items-center justify-center h-10 w-10 rounded bg-[#12151C] border border-white/[0.07] text-[#B5B5B5] hover:text-[#FFFFFF] hover:bg-[#FFFCCB]/10 hover:border-[#FFFCCB]/30 hover:shadow-[0_0_15px_rgba(255,252,203,0.15)] active:scale-95 transition-all duration-300 cursor-pointer"
          title="Copy Project Link"
        >
          {copied ? (
            <Check className="h-4.5 w-4.5 text-yellow-300" />
          ) : (
            <Link className="h-4.5 w-4.5 transition-transform duration-300 group-hover:rotate-45" />
          )}

          {/* Premium Tooltip */}
          {copied && (
            <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 bg-yellow-300 text-[#00040C] font-semibold font-oxanium text-[10px] uppercase rounded shadow-lg animate-bounce pointer-events-none tracking-[0.05em] whitespace-nowrap">
              Copied!
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
