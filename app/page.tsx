import Link from "next/link";
import ProjectList from "@/components/project-list";
import ShaderHero from "@/components/shader-hero";
import { getAllPosts } from "@/lib/posts";

const socials = [
  { label: "Email", href: "mailto:kustrablazej@gmail.com" },
  { label: "GitHub", href: "https://github.com/blazejkustra" },
  { label: "X (Twitter)", href: "https://x.com/blazejkustra_" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/kustrablazej/" },
];

export default function Home() {
  const posts = getAllPosts().slice(0, 4);

  return (
    <main className="px-4 md:px-6 pt-20 md:pt-24 pb-24 md:pb-44 max-w-[640px] md:max-w-[960px] mx-auto">
      <div className="flex flex-col gap-16 md:gap-24">
        {/* Intro */}
        <section
          className="relative flex flex-col gap-4 animate-in"
          style={{ "--index": 0 } as React.CSSProperties}
        >
          <div className="absolute left-1/2 w-screen -translate-x-1/2 -top-20 md:-top-24 -bottom-16 md:-bottom-24">
            <ShaderHero />
          </div>
          <h1 className="relative z-10 pointer-events-none text-sm">
            Błażej Kustra
          </h1>
          <div className="relative z-10 pointer-events-none flex flex-col gap-4 text-sm text-text-secondary leading-relaxed">
            <p>
              Senior React Native Developer at{" "}
              <a
                className="link"
                href="https://swmansion.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Software Mansion
              </a>
              , based in Kraków, Poland. For 6+ years I&apos;ve been building
              mobile and universal apps that ship to real users.
            </p>
            <p>
              I maintain open source libraries with over 1,000 stars on GitHub,
              ran a workshop on universal React Native apps at{" "}
              <a
                className="link"
                href="https://appjs.co"
                target="_blank"
                rel="noopener noreferrer"
              >
                App.js Conf
              </a>
              , and build my own products like{" "}
              <a
                className="link"
                href="https://www.cookinbuddy.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                CookinBuddy
              </a>
              . Lately I&apos;m deep into agentic engineering — using AI agents
              to ship faster without cutting corners.
            </p>
            <p>
              If you want to talk React Native, open source, or something
              you&apos;re building,{" "}
              <a className="link" href="mailto:kustrablazej@gmail.com">
                get in touch
              </a>
              .
            </p>
          </div>
          <ul className="relative z-10 pointer-events-none animated-list flex gap-6 text-sm text-text-secondary">
            {socials.map((social) => (
              <li key={social.label} className="animated-list-item">
                <a
                  className="link"
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Projects */}
        <section
          id="projects"
          className="flex flex-col gap-4 animate-in scroll-mt-24"
          style={{ "--index": 1 } as React.CSSProperties}
        >
          <h2 className="text-sm text-text-secondary">Projects</h2>
          <ProjectList />
        </section>

        {/* Posts */}
        <section
          className="flex flex-col gap-4 animate-in"
          style={{ "--index": 2 } as React.CSSProperties}
        >
          <h2 className="text-sm text-text-secondary">Posts</h2>
          <ol className="animated-list flex flex-col">
            {posts.map((post) => (
              <li key={post.slug} className="animated-list-item">
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex gap-4 items-center px-4 py-3 -mx-4 rounded-2xl transition-colors hover:bg-secondaryA"
                >
                  <span className="flex-1 min-w-0 text-sm">{post.title}</span>
                  <time className="tabular-nums text-sm text-text-secondary shrink-0">
                    {new Date(post.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </Link>
              </li>
            ))}
            <li className="animated-list-item">
              <Link
                href="/blog"
                className="flex px-4 py-3 -mx-4 rounded-2xl text-sm text-text-secondary transition-colors hover:bg-secondaryA"
              >
                See all →
              </Link>
            </li>
          </ol>
        </section>
      </div>
    </main>
  );
}
