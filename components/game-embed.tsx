"use client";

import { useEffect, useRef, useState } from "react";
import { useIsClient } from "@/lib/use-is-client";

type Props = {
  src: string;
  title?: string;
  /** Native resolution of the embedded game, used only for the frame's aspect. */
  width?: number;
  height?: number;
};

/**
 * A playable embed with a fullscreen toggle. Markdown drops these inside a <p>,
 * so the wrapper is a <span> (phrasing content) rather than a <div>.
 */
export default function GameEmbed({ src, title, width = 4, height = 3 }: Props) {
  const wrap = useRef<HTMLSpanElement>(null);
  const [full, setFull] = useState(false);
  const isClient = useIsClient();
  const canFullscreen =
    isClient && typeof document.body.requestFullscreen === "function";

  useEffect(() => {
    const onChange = () => setFull(document.fullscreenElement === wrap.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggle = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else wrap.current?.requestFullscreen();
  };

  return (
    <span
      ref={wrap}
      className="my-6 block relative w-full bg-black"
      style={full ? { height: "100%" } : { aspectRatio: `${width} / ${height}` }}
    >
      <iframe
        src={src}
        title={title}
        loading="lazy"
        className="block w-full h-full border-0"
      />
      {canFullscreen ? (
        <button
          type="button"
          onClick={toggle}
          aria-label={full ? "Exit fullscreen" : "Play fullscreen"}
          className="absolute bottom-2 right-2 px-2 py-1 font-mono text-[11px] rounded-sm cursor-pointer text-white/70 bg-black/45 hover:text-white hover:bg-black/70 transition-colors"
        >
          {full ? "exit" : "fullscreen"}
        </button>
      ) : null}
    </span>
  );
}
