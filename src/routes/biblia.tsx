import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { BookOpen, Search, Bookmark } from "lucide-react";

export const Route = createFileRoute("/biblia")({
  head: () => ({
    meta: [
      { title: "Bíblia • Igreja Coragem de Amar" },
      { name: "description", content: "Bíblia online com plano de leitura, marcadores e versículos diários." },
    ],
  }),
  component: Biblia,
});

const plans = [
  { name: "Bíblia em 1 ano", days: 365, progress: 28 },
  { name: "Novo Testamento em 90 dias", days: 90, progress: 12 },
  { name: "Salmos & Provérbios", days: 60, progress: 5 },
];

const quick = ["Salmos 23", "João 3", "Romanos 8", "1 Coríntios 13", "Filipenses 4"];

function Biblia() {
  return (
    <AppShell>
      <section className="px-5 pt-6">
        <p className="text-xs uppercase tracking-[0.25em] text-gold/80">Leitura</p>
        <h1 className="mt-1 font-display text-3xl">Bíblia</h1>

        <div className="mt-4 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Buscar livro, capítulo ou versículo"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </section>

      <section className="px-5 mt-6">
        <div className="rounded-2xl border border-gold/30 bg-gradient-hero p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-gold">Versículo de hoje</span>
            <Bookmark className="h-4 w-4 text-gold" />
          </div>
          <p className="mt-3 font-display text-xl leading-snug">
            “O Senhor é o meu pastor; nada me faltará.”
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Salmos 23:1</p>
        </div>
      </section>

      <section className="px-5 mt-7">
        <h2 className="font-display text-xl mb-3">Planos de leitura</h2>
        <div className="space-y-3">
          {plans.map((p, i) => (
            <article key={i} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{p.name}</h3>
                <span className="text-xs text-muted-foreground">{p.progress}/{p.days} dias</span>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-gradient-gold"
                  style={{ width: `${(p.progress / p.days) * 100}%` }}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 mt-7">
        <h2 className="font-display text-xl mb-3">Acesso rápido</h2>
        <div className="flex flex-wrap gap-2">
          {quick.map((q) => (
            <button
              key={q}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs"
            >
              <BookOpen className="h-3 w-3 text-gold" /> {q}
            </button>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
