import { createClient } from '@supabase/supabase-js';
import {
  Product,
  PerfRow,
  SeriesInfo,
  SERIES_CONFIG,
  SEGMENT_IDS,
  defaultSegmentsFor,
  seriesLogoFor,
} from '@/config/products.config';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://axjomaehmyohlnbyekjr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4am9tYWVobXlvaGxuYnlla2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0Nzk5MjEsImV4cCI6MjA5MTA1NTkyMX0.yFtHyBVvj2GzI4bLR5ajkmFT8-wh8Vu9WN3-XzZwE04';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Catalog = { products: Product[]; series: SeriesInfo[] };

type SeriesRow = {
  id: string;
  label: string | null;
  accent: string | null;
  icon_url: string | null;
  created_at: string | null;
};

const KNOWN_ORDER = Object.keys(SERIES_CONFIG);

function toSeriesInfo(row: SeriesRow): SeriesInfo {
  const id = row.id.toLowerCase();
  const cfg = SERIES_CONFIG[id as keyof typeof SERIES_CONFIG];
  const label = row.label || cfg?.label || id.toUpperCase();
  return {
    id,
    label,
    menuLabel: cfg?.menuLabel ?? label.replace(/\s+series$/i, '').toUpperCase(),
    tagline: cfg?.tagline ?? 'Electric Drive Systems',
    accent: '#ffc812',
    logoUrl: seriesLogoFor(id, row.icon_url),
  };
}

function seriesSort(a: SeriesInfo, b: SeriesInfo): number {
  // Known lines keep their curated order, new lines follow, "other" is always last.
  const rank = (s: SeriesInfo) => {
    if (s.id === 'other') return 10_000;
    const i = KNOWN_ORDER.indexOf(s.id);
    return i === -1 ? 1_000 : i;
  };
  return rank(a) - rank(b);
}

function normaliseSegments(raw: unknown, seriesId: string): string[] {
  if (Array.isArray(raw)) {
    const segs = raw
      .map((s) => String(s).toLowerCase().trim())
      .filter((s): s is string => (SEGMENT_IDS as readonly string[]).includes(s));
    if (segs.length > 0) return Array.from(new Set(segs));
  }
  return defaultSegmentsFor(seriesId);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProduct(row: any, seriesById: Map<string, SeriesInfo>): Product {
  const d = row.data || {};
  const seriesId = String(row.series || d.series || 'other').toLowerCase();
  const series = seriesById.get(seriesId);

  let perf: PerfRow[] = [];
  if (Array.isArray(d.perf)) perf = d.perf;
  else if (Array.isArray(d.performance)) perf = d.performance;
  else if (Array.isArray(row.perf)) perf = row.perf;

  return {
    id: row.id,
    series: seriesId,
    seriesLabel: series?.label || d.seriesLabel || seriesId.toUpperCase(),
    model: row.model || d.model || 'Unknown Model',
    name: d.name || row.model || 'Unknown',
    tag: d.tag || seriesId.toUpperCase(),
    application: d.application || 'UAV / eVTOL',
    keySpecs: Array.isArray(d.keySpecs) ? d.keySpecs : [],
    allSpecs: Array.isArray(d.allSpecs) ? d.allSpecs : [],
    perf,
    segments: normaliseSegments(d.segments, seriesId),
    thumbnailUrl: d.thumbnailUrl || null,
    wireframeUrl: d.wireframeUrl || null,
    thumbnailBgColor: d.thumbnailBgColor || null,
  };
}

async function loadCatalog(): Promise<Catalog | null> {
  const [seriesRes, productsRes] = await Promise.all([
    supabase.from('series').select('id, label, accent, icon_url, created_at').eq('is_deleted', false),
    supabase
      .from('products')
      .select('id, series, model, data, created_at')
      .eq('is_deleted', false)
      .eq('is_published', true)
      .order('created_at', { ascending: true }),
  ]);

  if (productsRes.error || !productsRes.data || productsRes.data.length === 0) {
    console.error('Supabase products error:', productsRes.error);
    return null;
  }

  const series = ((seriesRes.data as SeriesRow[] | null) ?? []).map(toSeriesInfo);
  const seriesById = new Map(series.map((s) => [s.id, s]));
  const products = productsRes.data.map((row) => rowToProduct(row, seriesById));

  // A product may reference a series row that was soft-deleted or never created;
  // keep it visible under a derived line rather than silently dropping it.
  for (const p of products) {
    if (!seriesById.has(p.series)) {
      const info = toSeriesInfo({ id: p.series, label: p.seriesLabel, accent: null, icon_url: null, created_at: null });
      seriesById.set(p.series, info);
      series.push(info);
    }
  }
  series.sort(seriesSort);
  return { products, series };
}

let catalogPromise: Promise<Catalog | null> | null = null;

/**
 * One network round-trip shared by the navbar, home page, catalogue and product
 * pages. A failed load is not cached, so the next caller retries.
 */
export function fetchCatalog(): Promise<Catalog | null> {
  if (!catalogPromise) {
    catalogPromise = loadCatalog().catch((err) => {
      console.error('Failed to fetch catalog:', err);
      return null;
    });
    catalogPromise.then((c) => {
      if (!c) catalogPromise = null;
    });
  }
  return catalogPromise;
}

export async function fetchProducts(): Promise<Product[] | null> {
  return (await fetchCatalog())?.products ?? null;
}

export async function fetchProductById(id: string): Promise<Product | null> {
  return (await fetchCatalog())?.products.find((p) => p.id === id) ?? null;
}
