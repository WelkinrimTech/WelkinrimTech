// Daily Vercel Cron target (see vercel.json "crons").
// Supabase pauses free-tier projects after ~7 days without activity; a paused project
// takes the site, the admin console and admin invite emails down with it. This does a
// real (read-only) database query so the project always registers activity.
const URL_ = process.env.VITE_SUPABASE_URL || "https://axjomaehmyohlnbyekjr.supabase.co";
// Public anon key (already shipped in the site bundle); read-only under RLS.
const KEY = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4am9tYWVobXlvaGxuYnlla2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0Nzk5MjEsImV4cCI6MjA5MTA1NTkyMX0.yFtHyBVvj2GzI4bLR5ajkmFT8-wh8Vu9WN3-XzZwE04";

export async function GET() {
  const headers = { apikey: KEY, Authorization: "Bearer " + KEY };
  const started = Date.now();
  try {
    const [db, auth] = await Promise.all([
      fetch(URL_ + "/rest/v1/products?select=id&limit=1", { headers, cache: "no-store" }),
      fetch(URL_ + "/auth/v1/health", { headers, cache: "no-store" }),
    ]);
    const ok = db.ok && auth.ok;
    return Response.json(
      { ok, db: db.status, auth: auth.status, ms: Date.now() - started, at: new Date().toISOString() },
      { status: ok ? 200 : 502, headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
