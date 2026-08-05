"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Renders the view count for a page, and counts the visit on mount.
 *
 * The pages themselves stay statically prerendered: the number arrives from
 * /api/views afterwards, so nothing here forces a page to render per request.
 * In development the visit is only read, never counted, so working on the site
 * doesn't inflate the numbers.
 */
export default function ViewCount({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const [views, setViews] = useState<number | null>(null);
  const counted = useRef(false);

  useEffect(() => {
    // Strict Mode mounts effects twice in development; count at most once.
    if (counted.current) return;
    counted.current = true;

    fetch(`/api/views/${slug}`, {
      method: process.env.NODE_ENV === "production" ? "POST" : "GET",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setViews(data.views);
      })
      .catch(() => {
        // A missing database shouldn't put an error in front of a reader.
      });
  }, [slug]);

  if (views === null) return null;

  return (
    <span className={`tabular-nums ${className}`}>
      {views.toLocaleString("en-US")} {views === 1 ? "view" : "views"}
    </span>
  );
}
