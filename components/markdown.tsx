import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import type { Components } from "react-markdown";
import LoopDiagram from "./loop-diagram";
import GameEmbed from "./game-embed";
import PostImage from "./post-image";

const components: Components = {
  p: ({ children }) => <p className="my-5 [blockquote_&]:my-2">{children}</p>,
  h1: ({ children }) => <h2 className="font-bold text-xl my-8">{children}</h2>,
  h2: ({ children }) => <h2 className="font-bold text-xl my-8">{children}</h2>,
  h3: ({ children }) => <h3 className="font-bold text-lg my-8">{children}</h3>,
  h4: ({ children }) => (
    <h4 className="font-bold text-base my-8">{children}</h4>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="border-b border-[var(--blockquote-border)] hover:border-[var(--text-primary)] transition-colors"
    >
      {children}
    </a>
  ),
  code: ({ className, children }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return <code className={className}>{children}</code>;
    }
    return (
      <code className="text-code px-1 py-0.5 rounded-sm bg-[var(--code-bg)] font-mono">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-6 p-4 text-code leading-relaxed bg-[var(--code-bg)] overflow-x-auto rounded-md font-mono font-normal">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-5 text-text-secondary pl-3 border-l-4 border-[var(--blockquote-border)]">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => <ul className="list-none my-5">{children}</ul>,
  ol: ({ children }) => (
    <ol className="list-decimal list-inside my-5">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="my-2 relative [ul>&]:pl-4 [ul>&]:before:content-['–'] [ul>&]:before:absolute [ul>&]:before:left-0 [ul>&]:before:text-text-secondary">
      {children}
    </li>
  ),
  hr: () => <div className="my-8 text-sm text-center">﹡﹡﹡</div>,
  img: ({ src, alt }) => (
    <PostImage src={typeof src === "string" ? src : undefined} alt={alt} />
  ),
  // Screen recordings ship as muted looping video rather than multi-megabyte GIFs.
  video: ({ src, ...props }) => (
    <video
      {...props}
      src={typeof src === "string" ? src : undefined}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      className="my-6 block max-w-full rounded-md mx-auto"
      style={{ boxShadow: "inset 0 0 0 1px var(--hairline)" }}
    />
  ),
  em: ({ children }) => <em>{children}</em>,
  details: ({ children }) => (
    <details className="my-6 group rounded-md border border-[var(--blockquote-border)] px-4 open:pb-2">
      {children}
    </details>
  ),
  summary: ({ children }) => (
    <summary className="py-3 cursor-pointer font-mono text-xs text-text-secondary hover:text-text-primary transition-colors marker:text-text-secondary">
      {children}
    </summary>
  ),
  // Posts occasionally embed something playable. Same-origin, from /public.
  // width/height give the frame the game's native aspect; it always spans the
  // full text column.
  iframe: ({ src, title, width, height }) => (
    <GameEmbed
      src={typeof src === "string" ? src : ""}
      title={title}
      width={Number(width) || undefined}
      height={Number(height) || undefined}
    />
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-[var(--blockquote-border)] px-3 py-1.5 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-[var(--blockquote-border)] px-3 py-1.5">
      {children}
    </td>
  ),
};

// Custom element names are legal keys at runtime, but the published type only
// covers intrinsic HTML tags, so the extra entry goes on afterwards.
const withCustomElements = {
  ...components,
  "loop-diagram": () => <LoopDiagram />,
} as Components;

export default function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={withCustomElements}
    >
      {content}
    </ReactMarkdown>
  );
}
