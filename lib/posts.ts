import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Post = {
  slug: string;
  title: string;
  date: string;
  description: string;
  canonical?: string;
  content: string;
  /** First image in the post, used as the cover in hover previews. */
  cover?: string;
  /** Social card: the frontmatter `image`, else the cover, else the site card. */
  ogImage: { url: string; width: number; height: number };
  /** First real paragraph, flattened to plain text for hover previews. */
  excerpt: string;
};

const postsDirectory = path.join(process.cwd(), "content/posts");

/** The first markdown image in a post, local path or remote URL. */
function firstImage(content: string): string | undefined {
  return content.match(/!\[[^\]]*\]\(([^)\s]+)/)?.[1];
}

const SITE_CARD = { url: "/og.png", width: 1200, height: 630 };

/** PNG dimensions straight out of the IHDR chunk, no image library needed. */
function pngSize(publicPath: string): { width: number; height: number } | null {
  try {
    const file = path.join(process.cwd(), "public", publicPath);
    const head = fs.readFileSync(file).subarray(0, 33);
    if (head.subarray(1, 4).toString() !== "PNG") return null;
    return { width: head.readUInt32BE(16), height: head.readUInt32BE(20) };
  } catch {
    return null;
  }
}

/**
 * The card social platforms show. Facebook and Messenger in particular skip
 * the image when the page doesn't declare its size, so local files get
 * measured at build time and anything remote falls back to the site card.
 */
function socialCard(image: string | undefined) {
  if (!image?.startsWith("/")) return SITE_CARD;
  const size = pngSize(image);
  return size ? { url: image, ...size } : SITE_CARD;
}

/**
 * The first paragraph that reads as prose, with markdown syntax stripped.
 * Skips images, headings, quotes, tables, lists and raw HTML blocks.
 */
function firstParagraph(content: string, limit = 220): string {
  const blocks = content
    .replace(/```[\s\S]*?```/g, "")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  for (const block of blocks) {
    if (/^(#|!\[|<|>|\||[-*+]\s|\d+[.)]\s)/.test(block)) continue;
    const text = block
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[*_`]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (text.length < 40) continue;
    if (text.length <= limit) return text;
    return text.slice(0, limit).replace(/\s+\S*$/, "") + "…";
  }
  return "";
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(postsDirectory, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        description: (data.description as string) ?? "",
        canonical: data.canonical as string | undefined,
        content,
        cover: firstImage(content),
        ogImage: socialCard((data.image as string) ?? firstImage(content)),
        excerpt: firstParagraph(content),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function relativeTime(date: string): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const days = Math.floor(diffMs / 86_400_000);
  if (days < 30) return `${Math.max(days, 1)}d ago`;
  const months = Math.floor(days / 30.44);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365.25);
  return `${years} yr ago`;
}
