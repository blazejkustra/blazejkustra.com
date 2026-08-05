import { getAllPosts } from "@/lib/posts";
import { getViews, incrementViews, visitorId } from "@/lib/views";

/**
 * GET reads a counter, POST increments it and returns the new value.
 *
 * Slugs are checked against the real pages so a stranger POSTing to
 * /api/views/anything can't fill the table with rows that don't exist.
 */
function isKnownSlug(slug: string) {
  return slug === "home" || getAllPosts().some((post) => post.slug === slug);
}

/**
 * Vercel replaces `x-forwarded-for` with the address it saw, so the first entry
 * is trustworthy in production. Behind a proxy that passes the client's own
 * header through, the worst it buys someone is inflating a page they could
 * already inflate from a pool of addresses. Requests with no address at all
 * share one bucket, which fails towards counting less rather than more.
 */
function clientAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/views/[slug]">,
) {
  const { slug } = await ctx.params;
  if (!isKnownSlug(slug)) return new Response("Not found", { status: 404 });

  return Response.json({ views: await getViews(slug) });
}

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/views/[slug]">,
) {
  const { slug } = await ctx.params;
  if (!isKnownSlug(slug)) return new Response("Not found", { status: 404 });

  const visitor = await visitorId(clientAddress(request));
  return Response.json({ views: await incrementViews(slug, visitor) });
}
