import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Heart, Send, Lock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/oracao")({
  head: () => ({
    meta: [
      { title: "Pedidos de Oração • Igreja Coragem de Amar" },
      { name: "description", content: "Envie seu pedido de oração e una-se a uma comunidade que intercede." },
    ],
  }),
  component: Oracao,
});

const wall = [
  { name: "Ana", text: "Orem pela saúde do meu pai. Deus é bom.", count: 38 },
  { name: "Anônimo", text: "Direção em uma decisão importante.", count: 22 },
  { name: "Marcos", text: "Agradecer por novo emprego!", count: 64 },
  { name: "Júlia", text: "Pela restauração do meu casamento.", count: 51 },
];

function Oracao() {
  const [sent, setSent] = useState(false);
  const [anon, setAnon] = useState(false);

  return (
    <AppShell>
      <section className="px-5 pt-6">
        <p className="text-xs uppercase tracking-[0.25em] text-gold/80">Intercessão</p>
        <h1 className="mt-1 font-display text-3xl">Pedidos de oração</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          “Confessem os seus pecados uns aos outros e orem uns pelos outros.” — Tg 5:16
        </p>
      </section>

      <section className="px-5 mt-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            setTimeout(() => setSent(false), 2500);
            (e.target as HTMLFormElement).reset();
          }}
          className="rounded-2xl border border-border bg-card p-4 shadow-card space-y-3"
        >
          <input
            placeholder="Seu nome (opcional)"
            disabled={anon}
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-gold disabled:opacity-50"
          />
          <textarea
            required
            rows={4}
            placeholder="Compartilhe seu pedido…"
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-gold resize-none"
          />
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={anon}
              onChange={(e) => setAnon(e.target.checked)}
              className="accent-[var(--gold)]"
            />
            Enviar de forma anônima
          </label>
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold py-3 text-sm font-semibold text-primary-foreground shadow-gold"
          >
            {sent ? "Pedido enviado 🙏" : (<>Enviar pedido <Send className="h-4 w-4" /></>)}
          </button>
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Lock className="h-3 w-3" /> Seu pedido vai diretamente à equipe pastoral.
          </p>
        </form>
      </section>

      <section className="px-5 mt-7">
        <div className="flex items-end justify-between mb-3">
          <h2 className="font-display text-xl">Mural de oração</h2>
          <span className="text-xs text-muted-foreground">{wall.length} pedidos</span>
        </div>
        <div className="space-y-3">
          {wall.map((p, i) => (
            <article key={i} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gold">{p.name}</span>
                <button className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-1 text-[11px] text-gold">
                  <Heart className="h-3 w-3 fill-current" /> {p.count} oraram
                </button>
              </div>
              <p className="mt-2 text-sm text-foreground/90">{p.text}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
