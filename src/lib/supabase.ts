import { createClient } from '@supabase/supabase-js';
import { Product, PerfRow, SERIES_CONFIG, SeriesKey } from '@/config/products.config';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://axjomaehmyohlnbyekjr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4am9tYWVobXlvaGxuYnlla2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0Nzk5MjEsImV4cCI6MjA5MTA1NTkyMX0.yFtHyBVvj2GzI4bLR5ajkmFT8-wh8Vu9WN3-XzZwE04';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Fetches all published products from Supabase database
 * Transforms database format to client Product type
 */
export async function fetchProducts(): Promise<Product[] | null> {
  try {
    // Fetch series labels from series table
    const { data: seriesData, error: seriesError } = await supabase
      .from('series')
      .select('id, label')
      .eq('is_deleted', false);

    if (seriesError) {
      console.error('Supabase series error:', seriesError);
    }

    // Create series label lookup map
    const seriesLabels: Record<string, string> = {};
    if (seriesData) {
      seriesData.forEach((s: { id: string; label: string }) => {
        seriesLabels[s.id.toLowerCase()] = s.label;
      });
    }

    // Fetch published products
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_deleted', false)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase products error:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    // Transform database rows to Product type
    return data.map((row: any): Product => {
      const productData = row.data || {};
      const seriesKey = (row.series?.toLowerCase() || productData.series?.toLowerCase() || 'other') as SeriesKey;

      // Get series label from database or config fallback
      const seriesConfig = SERIES_CONFIG[seriesKey] || SERIES_CONFIG.other;
      const seriesLabel = seriesLabels[seriesKey] || productData.seriesLabel || seriesConfig.label;

      // Handle performance data - can be in perf, performance, or nested data.perf
      let perfData: PerfRow[] = [];
      if (productData.perf && Array.isArray(productData.perf)) {
        perfData = productData.perf;
      } else if (productData.performance && Array.isArray(productData.performance)) {
        perfData = productData.performance;
      } else if (row.perf && Array.isArray(row.perf)) {
        perfData = row.perf;
      }

      return {
        id: row.id,
        series: seriesKey,
        seriesLabel: seriesLabel,
        model: row.model || productData.model || 'Unknown Model',
        name: productData.name || row.model || 'Unknown',
        tag: productData.tag || row.series?.toUpperCase() || 'Product',
        application: productData.application || 'UAV / eVTOL',
        keySpecs: productData.keySpecs || [],
        allSpecs: productData.allSpecs || [],
        perf: perfData,
        thumbnailUrl: productData.thumbnailUrl || row.thumbnailUrl || null,
        wireframeUrl: productData.wireframeUrl || row.wireframeUrl || null,
        thumbnailBgColor: productData.thumbnailBgColor || row.thumbnailBgColor || null,
      };
    });
  } catch (err) {
    console.error('Failed to fetch products:', err);
    return null;
  }
}

/**
 * Fetches a single product by ID from Supabase
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const { data: row, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_deleted', false)
      .eq('is_published', true)
      .single();

    if (error || !row) {
      console.error('Supabase product fetch error:', error);
      return null;
    }

    const productData = row.data || {};
    const seriesKey = (row.series?.toLowerCase() || productData.series?.toLowerCase() || 'other') as SeriesKey;
    const seriesConfig = SERIES_CONFIG[seriesKey] || SERIES_CONFIG.other;

    // Handle performance data
    let perfData: PerfRow[] = [];
    if (productData.perf && Array.isArray(productData.perf)) {
      perfData = productData.perf;
    } else if (productData.performance && Array.isArray(productData.performance)) {
      perfData = productData.performance;
    } else if (row.perf && Array.isArray(row.perf)) {
      perfData = row.perf;
    }

    return {
      id: row.id,
      series: seriesKey,
      seriesLabel: productData.seriesLabel || seriesConfig.label,
      model: row.model || productData.model || 'Unknown Model',
      name: productData.name || row.model || 'Unknown',
      tag: productData.tag || row.series?.toUpperCase() || 'Product',
      application: productData.application || 'UAV / eVTOL',
      keySpecs: productData.keySpecs || [],
      allSpecs: productData.allSpecs || [],
      perf: perfData,
      thumbnailUrl: productData.thumbnailUrl || row.thumbnailUrl || null,
      wireframeUrl: productData.wireframeUrl || row.wireframeUrl || null,
      thumbnailBgColor: productData.thumbnailBgColor || row.thumbnailBgColor || null,
    };
  } catch (err) {
    console.error('Failed to fetch product by ID:', err);
    return null;
  }
}

/**
 * Fetches products by series from Supabase
 */
export async function fetchProductsBySeries(series: SeriesKey): Promise<Product[] | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('series', series)
      .eq('is_deleted', false)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.error('Supabase series products error:', error);
      return null;
    }

    const seriesConfig = SERIES_CONFIG[series] || SERIES_CONFIG.other;

    return data.map((row: any): Product => {
      const productData = row.data || {};

      let perfData: PerfRow[] = [];
      if (productData.perf && Array.isArray(productData.perf)) {
        perfData = productData.perf;
      } else if (productData.performance && Array.isArray(productData.performance)) {
        perfData = productData.performance;
      }

      return {
        id: row.id,
        series: series,
        seriesLabel: productData.seriesLabel || seriesConfig.label,
        model: row.model || productData.model || 'Unknown Model',
        name: productData.name || row.model || 'Unknown',
        tag: productData.tag || series.toUpperCase(),
        application: productData.application || 'UAV / eVTOL',
        keySpecs: productData.keySpecs || [],
        allSpecs: productData.allSpecs || [],
        perf: perfData,
        thumbnailUrl: productData.thumbnailUrl || row.thumbnailUrl || null,
        wireframeUrl: productData.wireframeUrl || row.wireframeUrl || null,
        thumbnailBgColor: productData.thumbnailBgColor || row.thumbnailBgColor || null,
      };
    });
  } catch (err) {
    console.error('Failed to fetch products by series:', err);
    return null;
  }
}