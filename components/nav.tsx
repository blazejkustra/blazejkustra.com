"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const TABS = [
  { label: "Home", href: "/", match: (p: string) => p === "/" },
  { label: "Projects", href: "/#projects", match: () => false },
  { label: "Blog", href: "/blog", match: (p: string) => p.startsWith("/blog") },
];

const SOCIALS = [
  {
    label: "X (Twitter)",
    href: "https://x.com/blazejkustra_",
    path: "M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z",
    viewBox: "0 0 1200 1227",
  },
  {
    label: "GitHub",
    href: "https://github.com/blazejkustra",
    path: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z",
    viewBox: "0 0 24 24",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/kustrablazej/",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z",
    viewBox: "0 0 24 24",
  },
];

let navEntrancePlayed = false;

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [animateIn] = useState(
    () => !navEntrancePlayed && pathname === "/"
  );
  // The entrance animation must be REMOVED once done: its filled opacity
  // keeps the nav a backdrop root forever, killing the glass blur.
  const [entranceDone, setEntranceDone] = useState(false);

  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());
  const linksContainerRef = useRef<HTMLDivElement>(null);
  const panelBodyRef = useRef<HTMLDivElement>(null);
  const [dotStyle, setDotStyle] = useState<React.CSSProperties>({
    opacity: 0,
  });
  const prevActive = useRef<string | null>(null);
  const [openHeight, setOpenHeight] = useState(376);

  const activeHref = TABS.find((t) => t.match(pathname))?.href ?? null;

  useEffect(() => {
    navEntrancePlayed = true;
  }, []);

  // Sliding dot indicator — measured, not framer-motion
  useEffect(() => {
    const position = () => {
      const container = linksContainerRef.current;
      if (!activeHref) {
        if (prevActive.current) {
          setDotStyle((s) => ({
            ...s,
            opacity: 0,
            transform: "translateY(4px)",
            transition: "opacity 0.2s ease-in, transform 0.2s ease-in",
          }));
        }
        prevActive.current = null;
        return;
      }
      const link = linkRefs.current.get(activeHref);
      if (!link || !container) return;
      const lr = link.getBoundingClientRect();
      const cr = container.getBoundingClientRect();
      const left = lr.left - cr.left + lr.width / 2 - 1.5;
      const top = lr.bottom - cr.top - 4;
      if (!prevActive.current) {
        setDotStyle({
          left,
          top,
          opacity: 0,
          transform: "translateY(4px)",
          transition: "none",
        });
        requestAnimationFrame(() =>
          requestAnimationFrame(() =>
            setDotStyle({
              left,
              top,
              opacity: 1,
              transform: "translateY(0)",
              transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
            })
          )
        );
      } else {
        setDotStyle({
          left,
          top,
          opacity: 1,
          transform: "translateY(0)",
          transition:
            "left 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out, transform 0.3s ease-out",
        });
      }
      prevActive.current = activeHref;
    };

    position();
    window.addEventListener("resize", position);
    document.fonts?.ready.then(position);
    return () => window.removeEventListener("resize", position);
  }, [activeHref]);

  const toggleMenu = () => {
    if (!open && panelBodyRef.current) {
      setOpenHeight(52 + panelBodyRef.current.scrollHeight);
    }
    setOpen((o) => !o);
  };

  // Scroll lock while the mobile panel is open
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const { style } = document.body;
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.width = "100%";
    style.overflow = "hidden";
    return () => {
      style.position = "";
      style.top = "";
      style.width = "";
      style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  const scrollTopIfHome = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Backdrop for the open mobile panel */}
      <button
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 min-[624px]:hidden transition-opacity duration-150 ease-out backdrop-blur-[2.5px] ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <nav
        onAnimationEnd={(e) => {
          if (e.animationName === "nav-in") setEntranceDone(true);
        }}
        className={`fixed left-0 right-0 top-2 min-[624px]:top-4 z-50 px-4 min-[624px]:px-0 pointer-events-none [backface-visibility:hidden] will-change-transform translate-x-0 [--type-scale:1] ${
          animateIn && !entranceDone ? "animate-nav-in" : ""
        }`}
      >
        {/* Desktop pill */}
        <div className="hidden min-[624px]:flex pointer-events-auto glass backdrop-blur-[12px] backdrop-saturate-[180%] h-12 md:h-14 w-fit mx-auto items-center gap-6 md:gap-7 rounded-full py-1.5 pl-[15px] md:pl-[18px] pr-1.5 md:pr-2 translate-x-0">
          <Link
            href="/"
            aria-label="Home"
            onClick={scrollTopIfHome}
            className="shrink-0"
          >
            <Image
              src="/images/avatar.jpg"
              alt="Błażej Kustra"
              width={40}
              height={40}
              className="rounded-full w-5 h-5 md:w-6 md:h-6"
              draggable={false}
            />
          </Link>
          <div
            ref={linksContainerRef}
            className="relative flex items-center gap-4 md:gap-5"
          >
            {TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                ref={(el) => {
                  if (el) linkRefs.current.set(tab.href, el);
                }}
                onClick={tab.href === "/" ? scrollTopIfHome : undefined}
                className={`flex h-8 md:h-9 items-center text-sm md:text-base font-medium leading-none transition-colors ${
                  activeHref === tab.href
                    ? "text-[var(--nav-active)]"
                    : "text-[var(--nav-inactive)] hover:text-[var(--nav-active)]"
                }`}
              >
                {tab.label}
              </Link>
            ))}
            <span
              aria-hidden
              className="absolute w-[3px] h-[3px] rounded-full bg-[var(--nav-inactive)] pointer-events-none"
              style={dotStyle}
            />
          </div>
          <a
            href="mailto:kustrablazej@gmail.com"
            className="inline-flex h-9 md:h-10 items-center gap-2 rounded-full bg-[#245ACA] px-4 md:px-5 text-sm md:text-base font-medium text-white transition-opacity hover:opacity-90"
          >
            Get in touch
          </a>
        </div>

        {/* Mobile expanding glass panel */}
        <div
          className={`min-[624px]:hidden pointer-events-auto glass w-full flex flex-col overflow-hidden rounded-[26px] origin-top will-change-[height] [transition:height_.14s_cubic-bezier(.16,1,.3,1)] ${
            open
              ? "glass-open backdrop-blur-[24px] backdrop-saturate-150"
              : "backdrop-blur-[12px] backdrop-saturate-[180%]"
          }`}
          style={{ height: open ? openHeight : 52 }}
        >
          <div className="flex h-[50px] shrink-0 items-center justify-between pl-[18px] pr-3.5">
            <Link href="/" aria-label="Home" onClick={scrollTopIfHome}>
              <Image
                src="/images/avatar.jpg"
                alt="Błażej Kustra"
                width={48}
                height={48}
                className="rounded-full w-6 h-6"
                draggable={false}
              />
            </Link>
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={toggleMenu}
              className="relative flex h-9 w-9 items-center justify-center"
            >
              <span className="relative block h-5 w-5">
                <span
                  className={`absolute left-0 top-[7px] block h-[2px] w-5 rounded-full bg-current transition-transform duration-150 ease-out ${
                    open
                      ? "translate-y-[2px] rotate-45"
                      : "-translate-y-[3px]"
                  }`}
                />
                <span
                  className={`absolute left-0 top-[11px] block h-[2px] w-5 rounded-full bg-current transition-transform duration-150 ease-out ${
                    open
                      ? "-translate-y-[2px] -rotate-45"
                      : "translate-y-[3px]"
                  }`}
                />
              </span>
            </button>
          </div>
          <div
            ref={panelBodyRef}
            className={`px-[18px] pb-[18px] pt-3.5 transition-opacity duration-100 ease-out ${
              open ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="flex flex-col gap-1.5">
              {TABS.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={(e) => {
                    setOpen(false);
                    if (tab.href === "/") scrollTopIfHome(e);
                  }}
                  className={`font-display text-[30px] font-medium leading-[33px] transition-colors ${
                    activeHref === tab.href
                      ? "text-[var(--nav-active)]"
                      : "text-[var(--nav-muted)] hover:text-[var(--nav-active)]"
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
            <div className="mt-7 h-[0.5px] bg-[linear-gradient(90deg,transparent,var(--hairline)_22%,var(--hairline)_78%,transparent)]" />
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-6 w-6 items-center justify-center text-[var(--nav-muted)] transition-colors hover:text-[var(--nav-inactive)]"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox={social.viewBox}
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>
              <a
                href="mailto:kustrablazej@gmail.com"
                className="text-xs text-[var(--nav-muted)] transition-colors hover:text-[var(--nav-inactive)]"
              >
                kustrablazej@gmail.com
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
