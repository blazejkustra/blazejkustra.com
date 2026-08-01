"use client";

import { useState } from "react";
import Link from "next/link";

export type BlogListItem = {
  slug: string;
  title: string;
  date: string;
  cover?: string;
  excerpt: string;
};

/**
 * The post index. Hovering a row opens a preview with the post's cover image
 * and opening paragraph. Covers are only requested once a row has been
 * hovered, so landing on this page downloads nothing extra.
 */
export default function BlogList({ posts }: { posts: BlogListItem[] }) {
  const [seen, setSeen] = useState<string[]>([]);

  return (
    <ul>
      {posts.map((post, index) => {
        const year = new Date(post.date).getFullYear();
        const firstOfYear =
          index === 0 || new Date(posts[index - 1].date).getFullYear() !== year;
        const preview = post.excerpt || post.cover;

        return (
          <li
            key={post.slug}
            className="group relative"
            onMouseEnter={() =>
              setSeen((s) => (s.includes(post.slug) ? s : [...s, post.slug]))
            }
          >
            <Link href={`/blog/${post.slug}`}>
              <span className="flex border-y-0 py-2">
                {firstOfYear ? (
                  <span className="w-10 md:w-21 inline-block self-start shrink-0 text-text-secondary text-xs mt-0.5 tabular-nums">
                    {year}
                  </span>
                ) : null}
                <span
                  className={`grow min-w-0 ${firstOfYear ? "" : "ml-10 md:ml-21"}`}
                >
                  <span className="group-hover:bg-secondaryA transition-colors rounded-xl py-0.5 px-1.5 -ml-1.5">
                    {post.title}
                  </span>
                </span>
                <span className="text-text-secondary text-xs mt-0.5 shrink-0 tabular-nums">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </span>
            </Link>

            {preview ? (
              <span
                aria-hidden="true"
                className="post-preview hidden md:block pointer-events-none absolute z-20 right-0 top-full -mt-1 w-[340px] p-3 rounded-xl opacity-0 translate-y-1 transition-[opacity,transform] duration-150 group-hover:opacity-100 group-hover:translate-y-0 bg-primary"
                style={{
                  boxShadow:
                    "0 0 0 1px var(--hairline), 0 12px 32px rgba(0,0,0,.18)",
                }}
              >
                {post.cover && seen.includes(post.slug) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.cover}
                    alt=""
                    className="block w-full aspect-16/9 object-cover rounded-md mb-2"
                  />
                ) : null}
                <span className="block text-xs leading-relaxed text-text-secondary">
                  {post.excerpt}
                </span>
              </span>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
