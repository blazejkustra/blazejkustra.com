import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="mb-10 text-sm">
      <h1 className="text-2xl font-bold mb-8">Blog</h1>
      <ul>
        {posts.map((post, index) => {
          const year = new Date(post.date).getFullYear();
          const firstOfYear =
            index === 0 ||
            new Date(posts[index - 1].date).getFullYear() !== year;

          return (
            <li key={post.slug} className="group">
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
            </li>
          );
        })}
      </ul>
    </div>
  );
}
