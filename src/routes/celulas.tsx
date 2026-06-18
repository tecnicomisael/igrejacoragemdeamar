import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useSiteContent } from "@/lib/use-content";
import { Users, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/celulas")({
  head: () => ({
    meta: [
      { title: "Células • Igreja Coragem de Amar" },
      { name: "description", content: "Encontre uma célula perto de você e cresça em comunhão." },
    ],
  }),
  component: Celulas,
});

const cells = [
  { name: "Célula Esperança", leader: "Família Costa", day: "Ter • 20h", area: "Centro" },
  { name: "Célula Restauração", leader: "Lucas & Ana", day: "Qua • 19h30", area: "Zona Sul" },
  { name: "Célula Jovens Fé", leader: "Pedro Ramos", day: "Sex • 20h", area: "Bairro Alto" },
  { name: "Célula Casais", leader: "Tiago & Júlia", day: "Sáb • 19h", area: "Vila Nova" },
];

function Celulas() {
  const { t } = useSiteContent();
  return (
    <AppShell>
      <section className="px-5 pt-6">
        <p className="text-xs uppercase tracking-[0.25em] text-gold/80">{t("celulas", "kicker")}</p>
        <h1 className="mt-1 font-display text-3xl">{t("celulas", "title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("celulas", "subtitle")}
        </p>
      </section>

      <section className="px-5 mt-6 space-y-3">
        {cells.map((c, i) => (
          <article key={i} className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-gold text-primary-foreground">
                <Users className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <h3 className="font-display text-lg leading-tight">{c.name}</h3>
                <p className="text-xs text-muted-foreground">Liderança: {c.leader}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {c.day}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {c.area}</span>
                </div>
              </div>
            </div>
            <button className="mt-3 w-full rounded-full bg-gradient-gold py-2.5 text-sm font-semibold text-primary-foreground shadow-gold">
              {t("celulas", "cta")}
            </button>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
