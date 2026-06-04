import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PlayCircle, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/sermoes")({
  head: () => ({
    meta: [
      { title: "Sermões • Igreja Coragem de Amar" },
      { name: "description", content: "Assista e ouça os sermões da Igreja Coragem de Amar — séries, mensagens e palavras inspiradas." },
    ],
  }),
  component: Sermoes,
});

const series = ["Todos", "Coragem", "Família", "Esperança", "Discipulado"];

const sermons = [
  { title: "A coragem que nasce do amor", pastor: "Pr. Lucas Andrade", date: "02 Jun", dur: "42 min", series: "Coragem" },
  { title: "Quando o silêncio fala", pastor: "Pr. Lucas Andrade", date: "26 Mai", dur: "38 min", series: "Esperança" },
  { title: "Famílias que oram juntas", pastor: "Pra. Marta Lima", date: "19 Mai", dur: "45 min", series: "Família" },
  { title: "Discípulos no cotidiano", pastor: "Pr. Tiago Reis", date: "12 Mai", dur: "36 min", series: "Discipulado" },
  { title: "O amor que vence o medo", pastor: "Pr. Lucas Andrade", date: "05 Mai", dur: "40 min", series: "Coragem" },
];

function Sermoes() {
  const [active, setActive] = useState("Todos");
  const list = active === "Todos" ? sermons : sermons.filter((s) => s.series === active);

  return (
    <AppShell>
      <section className="px-5 pt-6">
        <p className="text-xs uppercase tracking-[0.25em] text-gold/80">Palavra</p>
        <h1 className="mt-1 font-display text-3xl">Sermões</h1>

        <div className="mt-4 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Buscar mensagem ou pregador"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="mt-4 -mx-5 overflow-x-auto px-5">
          <div className="flex gap-2 w-max">
            {series.map((s) => (
              <button
                key={s}
                onClick={() => setActive(s)}
                className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-xs transition-all ${
                  active === s
                    ? "border-transparent bg-gradient-gold text-primary-foreground shadow-gold"
                    : "border-border text-muted-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="px-5 mt-5">
        <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="relative h-44 bg-gradient-hero">
            <div className="absolute inset-0 grid place-items-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-gold text-primary-foreground shadow-gold">
                <PlayCircle className="h-7 w-7" />
              </span>
            </div>
            <span className="absolute top-3 left-3 rounded-full bg-background/70 px-2.5 py-1 text-[10px] uppercase tracking-widest text-gold backdrop-blur">
              Destaque
            </span>
          </div>
          <div className="p-4">
            <h3 className="font-display text-lg">A coragem que nasce do amor</h3>
            <p className="mt-1 text-xs text-muted-foreground">Pr. Lucas Andrade • Série Coragem</p>
          </div>
        </article>
      </section>

      {/* List */}
      <section className="px-5 mt-6 space-y-3">
        {list.map((s, i) => (
          <article
            key={i}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
          >
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-hero text-gold">
              <PlayCircle className="h-6 w-6" />
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-base leading-tight truncate">{s.title}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground truncate">
                {s.pastor} • {s.date} • {s.dur}
              </p>
            </div>
            <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-gold">
              {s.series}
            </span>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
