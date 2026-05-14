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
export const SERIES_CONFIG = {
  haemng: {
    label: "Haemng Series",
    useSvgLogo: true,
    logoSrc: "haemng.svg",
    accent: "#ffc812",
    textOnAccent: "#000",
    heroImage: "welkinrim-motor.png",
  },
  maelard: {
    label: "Maelard Series",
    useSvgLogo: true,
    logoSrc: "Maelard.svg",
    accent: "#ffc812",
    textOnAccent: "#000",
    heroImage: "welkinrim-motor.png",
  },
  stroke: {
    label: "Stroke Series",
    useSvgLogo: false,
    logoSrc: null,
    accent: "#ffc812",
    textOnAccent: "#000",
    heroImage: null,
  },
  vagans: {
    label: "Vagans Series",
    useSvgLogo: false,
    logoSrc: null,
    accent: "#ffc812",
    textOnAccent: "#000",
    heroImage: null,
  },
  sciatic: {
    label: "Sciatic Series",
    useSvgLogo: false,
    logoSrc: null,
    accent: "#ffc812",
    textOnAccent: "#000",
    heroImage: null,
  },
  esc: {
    label: "ESCs",
    useSvgLogo: false,
    logoSrc: null,
    accent: "#ffc812",
    textOnAccent: "#000",
    heroImage: null,
  },
  fc: {
    label: "Flight Controller",
    useSvgLogo: false,
    logoSrc: null,
    accent: "#ffc812",
    textOnAccent: "#000",
    heroImage: null,
  },
  ips: {
    label: "Integrated Power Systems",
    useSvgLogo: false,
    logoSrc: null,
    accent: "#ffc812",
    textOnAccent: "#000",
    heroImage: null,
  },
  other: {
    label: "Other Systems & Custom Solutions",
    useSvgLogo: false,
    logoSrc: null,
    accent: "#ffc812",
    textOnAccent: "#000",
    heroImage: null,
  },
} as const;

export type SeriesKey = keyof typeof SERIES_CONFIG;

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
  series: SeriesKey;
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