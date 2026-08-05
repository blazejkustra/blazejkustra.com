import { neon } from "@neondatabase/serverless";

/**
 * Page view counters, stored in Postgres (Neon, via the Vercel integration).
 * One row per page: `home` for the front page, the post slug for an article.
 *
 * Without a database URL every call throws, the API route answers 500, and the
 * counter simply doesn't render, so a local checkout with no env vars still
 * builds and runs.
 */
function db() {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

// A visitor moves a page's counter at most once per this many hours. The
// endpoint is public and its valid slugs are readable from the repo, so
// without a window anyone with a for-loop decides what the numbers say.
const WINDOW_HOURS = 24;

// The tables are created once per server instance rather than in a migration
// step: two small tables with nothing to evolve.
let ready: Promise<unknown> | null = null;
function ensureTables() {
  if (!ready) {
    ready = createTables().catch((error) => {
      // Clear the slot before rethrowing. Caching a rejection would leave this
      // instance answering 500 for the rest of its life over one blip while
      // Neon was resuming, instead of retrying on the next request.
      ready = null;
      throw error;
    });
  }
  return ready;
}

async function createTables() {
  const sql = db();
  await sql`
    CREATE TABLE IF NOT EXISTS views (
      slug TEXT PRIMARY KEY,
      count INTEGER NOT NULL DEFAULT 0
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS view_visits (
      slug TEXT NOT NULL,
      visitor TEXT NOT NULL,
      seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (slug, visitor)
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS view_visits_seen_at_idx ON view_visits (seen_at)
  `;
}

/**
 * An opaque id for one visitor, derived from their address.
 *
 * The address itself is never stored. It's hashed with a per-deployment salt
 * so the table holds nothing that identifies a reader, and a leaked dump can't
 * be reversed by hashing the address space. Set VIEWS_SALT in production —
 * without it the fallback is public, and so is the hash.
 */
export async function visitorId(address: string): Promise<string> {
  const salt = process.env.VIEWS_SALT ?? "personal-site";
  const bytes = new TextEncoder().encode(`${salt}:${address}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest).slice(0, 16))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function getViews(slug: string): Promise<number> {
  await ensureTables();
  const rows = await db()`SELECT count FROM views WHERE slug = ${slug}`;
  return rows[0]?.count ?? 0;
}

export async function incrementViews(
  slug: string,
  visitor: string,
): Promise<number> {
  await ensureTables();
  const sql = db();

  // Claim the visit first. The row is only taken when it's new or its window
  // has expired, and ON CONFLICT locks it, so concurrent requests from one
  // visitor can't both win. Anything that doesn't claim never reaches the
  // counter below.
  const claimed = await sql`
    INSERT INTO view_visits (slug, visitor) VALUES (${slug}, ${visitor})
    ON CONFLICT (slug, visitor) DO UPDATE SET seen_at = now()
      WHERE view_visits.seen_at < now() - (${WINDOW_HOURS}::int * interval '1 hour')
    RETURNING 1
  `;
  if (claimed.length === 0) return getViews(slug);

  const rows = await sql`
    INSERT INTO views (slug, count) VALUES (${slug}, 1)
    ON CONFLICT (slug) DO UPDATE SET count = views.count + 1
    RETURNING count
  `;

  // A row past the window can never block a count again. Clearing them out now
  // and then keeps the table proportional to recent traffic rather than to
  // every address that has ever hit the site. It's housekeeping, so a failure
  // here shouldn't cost the reader their response.
  if (Math.random() < 0.01) {
    await sql`
      DELETE FROM view_visits
      WHERE seen_at < now() - (${WINDOW_HOURS}::int * interval '1 hour')
    `.catch(() => {});
  }

  return rows[0]?.count ?? 0;
}
