import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
};

export default function BlogLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <main className="px-4 md:px-6 pt-28 md:pt-32 pb-10 max-w-[640px] md:max-w-[960px] mx-auto w-full min-h-screen">
        {children}
      </main>
      <footer className="px-4 md:px-6 pb-8 max-w-[640px] md:max-w-[960px] mx-auto w-full flex text-xs text-text-secondary font-mono">
        <div className="grow">
          Błażej Kustra (
          <a
            href="https://x.com/blazejkustra_"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-[var(--blockquote-border)] hover:border-[var(--text-primary)] transition-colors"
          >
            @blazejkustra_
          </a>
          )
        </div>
        <a
          href="https://github.com/blazejkustra"
          target="_blank"
          rel="noopener noreferrer"
          className="border-b border-[var(--blockquote-border)] hover:border-[var(--text-primary)] transition-colors"
        >
          GitHub
        </a>
      </footer>
    </>
  );
}
