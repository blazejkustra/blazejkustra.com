import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Markdown from "@/components/markdown";
import ViewCount from "@/components/view-count";
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
  // Metadata merges shallowly, so openGraph/twitter here replace the layout's
  // versions entirely: without this the post would share with no thumbnail.
  const image = post.ogImage;
  return {
    title: post.title,
    description: post.description,
    // Republished articles point their canonical at the original publication.
    alternates: {
      canonical: post.canonical ?? `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `/blog/${slug}`,
      images: [{ ...image, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [image.url],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const postJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `https://blazejkustra.com/blog/${post.slug}`,
    author: {
      "@type": "Person",
      name: "Błażej Kustra",
      url: "https://blazejkustra.com",
    },
  };

  return (
    <article className="mb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd) }}
      />
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
        {/* Pushed to the right edge so it can appear late without shifting
            the date, and leaves no dangling separator if it never loads. */}
        <ViewCount slug={post.slug} className="ml-auto pl-4" />
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
