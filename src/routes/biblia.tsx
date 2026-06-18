import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useSiteContent } from "@/lib/use-content";
import { BookOpen, Search, Bookmark, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/biblia")({
  head: () => ({
    meta: [
      { title: "Bíblia • Igreja Coragem de Amar" },
      { name: "description", content: "Bíblia Sagrada online com busca de capítulos e versículos em português." },
    ],
  }),
  component: Biblia,
});

const quick = ["Salmos 23", "João 3:16", "Romanos 8", "1 Coríntios 13", "Filipenses 4:6-7"];

type Verse = { book_name: string; chapter: number; verse: number; text: string };
type BibleResponse = {
  reference?: string;
  verses?: Verse[];
  text?: string;
  error?: string;
};

function Biblia() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BibleResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function search(ref: string) {
    const q = ref.trim();
    if (!q) return;
    setQuery(q);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const url = `https://bible-api.com/${encodeURIComponent(q)}?translation=almeida`;
      const res = await fetch(url);
      const data: BibleResponse = await res.json();
      if (!res.ok || data.error) {
        setError(
          data.error ||
            "Não encontramos essa passagem. Tente uma referência como “João 3:16” ou “Salmos 23”.",
        );
      } else {
        setResult(data);
      }
    } catch {
      setError("Não foi possível conectar à Bíblia online. Verifique sua internet e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    search(query);
  }

  return (
    <AppShell>
      <section className="px-5 pt-6">
        <p className="text-xs uppercase tracking-[0.25em] text-gold/80">Leitura</p>
        <h1 className="mt-1 font-display text-3xl">Bíblia Sagrada</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tradução João Ferreira de Almeida. Digite uma referência (ex.: João 3:16).
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-4 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 focus-within:border-gold/60"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex.: Salmos 23 ou João 3:16"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="rounded-full bg-gradient-gold px-3 py-1 text-xs font-medium text-primary-foreground shadow-gold disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Buscar"}
          </button>
        </form>
      </section>

      <section className="px-5 mt-5">
        <div className="flex flex-wrap gap-2">
          {quick.map((q) => (
            <button
              key={q}
              onClick={() => search(q)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs hover:border-gold/50 transition-colors"
            >
              <BookOpen className="h-3 w-3 text-gold" /> {q}
            </button>
          ))}
        </div>
      </section>

      <section className="px-5 mt-6 min-h-[200px]">
        {loading && (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Buscando…
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive-foreground">
            {error}
          </div>
        )}

        {result && !loading && (
          <article className="rounded-2xl border border-gold/30 bg-gradient-hero p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-gold">
                {result.reference}
              </span>
              <Bookmark className="h-4 w-4 text-gold" />
            </div>
            <div className="mt-4 space-y-2.5">
              {result.verses?.map((v) => (
                <p key={`${v.chapter}-${v.verse}`} className="text-[15px] leading-relaxed">
                  <sup className="text-gold/80 font-semibold mr-1.5">{v.verse}</sup>
                  {v.text.trim()}
                </p>
              ))}
            </div>
            <p className="mt-4 text-[11px] text-muted-foreground">
              João Ferreira de Almeida • bible-api.com
            </p>
          </article>
        )}

        {!result && !loading && !error && (
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">
              Pesquise um livro, capítulo ou versículo acima. Exemplos:
              <span className="text-foreground"> João 3:16</span>,
              <span className="text-foreground"> Salmos 23</span>,
              <span className="text-foreground"> Romanos 8:28</span>.
            </p>
          </div>
        )}
      </section>
    </AppShell>
  );
}
