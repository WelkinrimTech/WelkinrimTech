/**
 * Products Configuration
 *
 * This file controls how products are loaded across the site.
 * Toggle USE_DATABASE to switch between Supabase DB and built-in static data.
 *
 * When USE_DATABASE is true:
 *   - Products are fetched from Supabase 'products' table
 *   - Falls back to static PRODUCTS if DB fails or returns empty
 *
 * When USE_DATABASE is false:
 *   - Uses static PRODUCTS from data/products.ts
 */

// ============================================
// DATA SOURCE TOGGLE
// ============================================
export const USE_DATABASE = true;

// ============================================
// SERIES CONFIGURATION
// Matches database series IDs and provides display labels/colors
// ============================================
type SeriesMeta = {
  label: string;
  menuLabel: string;
  tagline: string;
  /** Local logo in /public/assets/series (from the brand asset pack). */
  logoFile: string | null;
  accent: string;
  textOnAccent: string;
  heroImage: string | null;
};

const meta = (m: Partial<SeriesMeta> & Pick<SeriesMeta, "label" | "menuLabel" | "tagline">): SeriesMeta => ({
  logoFile: null,
  accent: "#ffc812",
  textOnAccent: "#000",
  heroImage: null,
  ...m,
});

/**
 * Curated presentation metadata for the known product lines, keyed by DB series id.
 * The series list itself comes from the live `series` table, so a line added in the
 * admin console appears on the site without a code change; this map only adds
 * taglines and local logos for the lines we already know.
 */
export const SERIES_CONFIG = {
  haemng: meta({ label: "Haemng Series", menuLabel: "HAEMNG", tagline: "UAV & eVTOL Motors", logoFile: "haemng_logo.svg", heroImage: "welkinrim-motor.webp" }),
  maelard: meta({ label: "Maelard Series", menuLabel: "MAELARD", tagline: "Marine, UAV & Multi-mission", logoFile: "maelard_logo.svg", heroImage: "welkinrim-motor.webp" }),
  stroke: meta({ label: "Stoaek Series", menuLabel: "STOAEK", tagline: "High-Density Storage & Industrial", logoFile: "stoaek_logo.svg" }),
  vagans: meta({ label: "Vaegan Series", menuLabel: "VAEGAN", tagline: "Mobile & Robotic Platforms", logoFile: "vaegan_logo.svg" }),
  sciatic: meta({ label: "Sciaetic Series", menuLabel: "SCIAETIC", tagline: "High-Frequency & Precision Control", logoFile: "sciaetic_logo.svg" }),
  esc: meta({ label: "ESCs", menuLabel: "ESC", tagline: "Electronic Speed Controllers" }),
  ips: meta({ label: "Integrated Power Systems", menuLabel: "IPS", tagline: "Motor + ESC Matched Assemblies" }),
  fc: meta({ label: "Flight Controller", menuLabel: "AUTO PILOT", tagline: "Autonomous UAV Navigation" }),
  other: meta({ label: "Other Systems & Custom Solutions", menuLabel: "OTHER", tagline: "Industrial, Marine & Custom Projects" }),
} satisfies Record<string, SeriesMeta>;

export type SeriesKey = keyof typeof SERIES_CONFIG;

/** Presentation config for any series id, including ones added later in the admin console. */
export function seriesConfig(id: string): SeriesMeta {
  return (SERIES_CONFIG as Record<string, SeriesMeta>)[id] ?? SERIES_CONFIG.other;
}

/** Local brand logo first, then the icon uploaded in the admin console, else none. */
export function seriesLogoFor(id: string, iconUrl?: string | null): string | null {
  const file = (SERIES_CONFIG as Record<string, SeriesMeta>)[id]?.logoFile;
  if (file) return `/assets/series/${file}`;
  return iconUrl || null;
}

/** A product line as shown on the site (merged from the DB row and SERIES_CONFIG). */
export type SeriesInfo = {
  id: string;
  label: string;
  menuLabel: string;
  tagline: string;
  accent: string;
  logoUrl: string | null;
};

// Application segments used by the navbar "Products" menu. Stored per product in
// products.data.segments by the admin console.
export const SEGMENTS = [
  { id: "uav", label: "UAV" },
  { id: "marine", label: "Marine" },
  { id: "land", label: "Land" },
  { id: "robotics", label: "Robotics" },
  { id: "other", label: "Other Products" },
] as const;
export const SEGMENT_IDS = SEGMENTS.map((s) => s.id);

/** Segments for products saved before the admin console could set them. */
export function defaultSegmentsFor(seriesId: string): string[] {
  return seriesId === "other" ? ["other"] : ["uav"];
}

// ============================================
// PRODUCT TYPE DEFINITION
// ============================================
export type PerfRow = {
  throttle: string;
  voltage: string;
  power: string;
  thrust: string;
  current: string;
  speed?: string;
  efficiency?: string;
};

export type Product = {
  id: string;
  series: string;
  /** Application segments (uav, marine, land, robotics, other). */
  segments?: string[];
  seriesLabel: string;
  model: string;
  name: string;
  tag: string;
  application: string;
  keySpecs: { label: string; value: string }[];
  allSpecs: { label: string; value: string }[];
  perf?: PerfRow[];
  thumbnailUrl?: string | null;
  wireframeUrl?: string | null;
  thumbnailBgColor?: string | null;
};