import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useSiteContent } from "@/lib/use-content";
import { Copy, QrCode, CreditCard, Building2, HandCoins } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contribuir")({
  head: () => ({
    meta: [
      { title: "Contribuir • Igreja Coragem de Amar" },
      { name: "description", content: "Contribua com dízimos e ofertas via Pix, cartão ou transferência bancária." },
    ],
  }),
  component: Contribuir,
});

function Contribuir() {
  const [copied, setCopied] = useState(false);
  const pix = "contribuicao@coragemdeamar.org";

  return (
    <AppShell>
      <section className="px-5 pt-6">
        <p className="text-xs uppercase tracking-[0.25em] text-gold/80">Generosidade</p>
        <h1 className="mt-1 font-display text-3xl">Dízimos & Ofertas</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          “Cada um dê conforme determinou em seu coração, com alegria.” — 2 Co 9:7
        </p>
      </section>

      <section className="px-5 mt-6">
        <div className="rounded-2xl border border-gold/30 bg-gradient-hero p-6 text-center shadow-card">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-gold text-primary-foreground shadow-gold">
            <QrCode className="h-6 w-6" />
          </span>
          <h2 className="mt-3 font-display text-2xl">Pix</h2>
          <p className="mt-1 text-xs text-muted-foreground">Chave Pix (e-mail)</p>
          <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-border bg-background/50 px-4 py-3 text-sm">
            <span className="truncate">{pix}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(pix);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="inline-flex items-center gap-1 rounded-full bg-gradient-gold px-3 py-1.5 text-xs font-semibold text-primary-foreground"
            >
              <Copy className="h-3 w-3" /> {copied ? "Copiado" : "Copiar"}
            </button>
          </div>
        </div>
      </section>

      <section className="px-5 mt-6 space-y-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold">
              <CreditCard className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <div className="font-medium">Cartão de crédito</div>
              <div className="text-xs text-muted-foreground">Contribuição única ou recorrente</div>
            </div>
          </div>
          <button className="mt-3 w-full rounded-full bg-gradient-gold py-2.5 text-sm font-semibold text-primary-foreground shadow-gold">
            Contribuir agora
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <div className="font-medium">Transferência bancária</div>
              <div className="text-xs text-muted-foreground">Banco 001 • Ag 0001 • CC 12345-6</div>
              <div className="text-xs text-muted-foreground">Igreja Coragem de Amar — CNPJ 00.000.000/0001-00</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
          <HandCoins className="h-5 w-5 text-gold" />
          <p className="text-xs text-muted-foreground">
            Toda contribuição sustenta a missão, projetos sociais e o cuidado pastoral.
          </p>
        </div>
      </section>
    </AppShell>
  );
}
