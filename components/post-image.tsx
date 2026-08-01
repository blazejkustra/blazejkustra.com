"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useIsClient } from "@/lib/use-is-client";

type Props = {
  src?: string;
  alt?: string;
};

/**
 * Post images open into a lightbox, the way Medium does it: click to enlarge,
 * click anywhere or press Escape to put it back.
 */
export default function PostImage({ src, alt }: Props) {
  const [open, setOpen] = useState(false);
  const isClient = useIsClient();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    // Hold the page still underneath, and keep it from shifting as the
    // scrollbar disappears.
    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [open, close]);

  if (!src) return null;

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? ""}
        loading="lazy"
        onClick={() => setOpen(true)}
        className="my-6 max-w-full rounded-md mx-auto cursor-zoom-in"
        style={{ boxShadow: "inset 0 0 0 1px var(--hairline)" }}
      />
      {isClient && open
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={alt || "Enlarged image"}
              onClick={close}
              className="lightbox fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 cursor-zoom-out bg-black/90 backdrop-blur-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt ?? ""}
                className="max-w-full max-h-full object-contain rounded-md"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute top-3 right-4 font-mono text-sm text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                close
              </button>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
