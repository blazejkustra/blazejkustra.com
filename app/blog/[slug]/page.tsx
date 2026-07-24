import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Markdown from "@/components/markdown";
import { getAllPosts, getPost, formatDate, relativeTime } from "@/lib/posts";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="mb-10">
      <h1 className="text-2xl font-bold mb-1 text-balance">{post.title}</h1>
      <p className="font-mono flex text-xs text-text-secondary mb-8">
        <span className="hidden md:inline">
          <a
            href="https://x.com/blazejkustra_"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-primary transition-colors"
          >
            @blazejkustra_
          </a>
          <span className="mx-2">|</span>
        </span>
        <span>
          {formatDate(post.date)} ({relativeTime(post.date)})
        </span>
      </p>
      <div className="text-post leading-relaxed font-normal text-text-primary">
        <Markdown content={post.content} />
      </div>
      {post.canonical ? (
        <p className="block text-xs my-8 font-mono text-text-secondary text-center">
          Originally published on{" "}
          <a
            href={post.canonical}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-[var(--blockquote-border)] hover:border-[var(--text-primary)] transition-colors"
          >
            {post.canonical.includes("swmansion.com")
              ? "Software Mansion"
              : "Medium"}
          </a>
        </p>
      ) : null}
    </article>
  );
}
