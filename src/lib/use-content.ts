import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getDefault } from "./content-registry";

type Row = { page: string; key: string; value: string; type: string };

const QUERY_KEY = ["site-content"] as const;

async function fetchAll(): Promise<Row[]> {
  const { data, error } = await supabase
    .from("site_content")
    .select("page, key, value, type");
  if (error) throw error;
  return (data ?? []) as Row[];
}

export function useSiteContent() {
  const q = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchAll,
    staleTime: 5 * 60 * 1000,
  });

  const map = new Map<string, string>();
  for (const row of q.data ?? []) {
    map.set(`${row.page}::${row.key}`, row.value);
  }

  function t(page: string, key: string, fallback?: string): string {
    const v = map.get(`${page}::${key}`);
    if (v !== undefined && v !== "") return v;
    return fallback ?? getDefault(page, key);
  }

  return { t, isLoading: q.isLoading, raw: map };
}

export function useInvalidateSiteContent() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: QUERY_KEY });
}

/** Render text where **word** becomes a gold highlight span. */
export function renderHighlighted(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <span key={i} className="text-gradient-gold">
          {p.slice(2, -2)}
        </span>
      );
    }
    return <span key={i}>{p}</span>;
  });
}
