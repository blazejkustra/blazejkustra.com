import type { Metadata } from "next";
import BlogList from "@/components/blog-list";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writing about React Native, TypeScript, and building apps — by Błażej Kustra.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogIndex() {
  const posts = getAllPosts().map(({ slug, title, date, cover, excerpt }) => ({
    slug,
    title,
    date,
    cover,
    excerpt,
  }));

  return (
    <div className="mb-10 text-sm">
      <h1 className="text-2xl font-bold mb-8">Blog</h1>
      <BlogList posts={posts} />
    </div>
  );
}
