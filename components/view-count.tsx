"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Renders the view count for a page, and counts the visit on mount.
 *
 * The pages themselves stay statically prerendered: the number arrives from
 * /api/views afterwards, so nothing here forces a page to render per request.
 * In development the visit is only read, never counted, so working on the site
 * doesn't inflate the numbers.
 *
 * While the count is in flight a bar holds its place, so the surrounding line
 * doesn't jump when the number lands. If the request fails the bar goes away
 * rather than pulsing forever at a reader who is never getting a number.
 */
export default function ViewCount({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const [views, setViews] = useState<number | "failed" | null>(null);
  const counted = useRef(false);

  useEffect(() => {
    // Strict Mode mounts effects twice in development; count at most once.
    if (counted.current) return;
    counted.current = true;

    fetch(`/api/views/${slug}`, {
      method: process.env.NODE_ENV === "production" ? "POST" : "GET",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) =>
        setViews(typeof data?.views === "number" ? data.views : "failed"),
      )
      .catch(() => {
        // A missing database shouldn't put an error in front of a reader.
        setViews("failed");
      });
  }, [slug]);

  if (views === "failed") return null;

  if (views === null) {
    return (
      <span
        // Roughly the width of "1,234 views", so the number lands in the space
        // the bar was already holding.
        className={`view-skeleton inline-block h-[1em] w-[5.5em] self-center rounded-full bg-secondaryA ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <span className={`view-loaded tabular-nums ${className}`}>
      {views.toLocaleString("en-US")} {views === 1 ? "view" : "views"}
    </span>
  );
}
