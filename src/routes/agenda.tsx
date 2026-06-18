import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useSiteContent } from "@/lib/use-content";
import { Calendar, Clock, MapPin } from "lucide-react";

export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda • Igreja Coragem de Amar" },
      { name: "description", content: "Confira a programação semanal de cultos, encontros e eventos especiais da Igreja Coragem de Amar." },
    ],
  }),
  component: Agenda,
});

const events = [
  { day: "Dom", date: "08", title: "Culto da Família", time: "18h30", place: "Templo Sede", tag: "Culto" },
  { day: "Qua", date: "11", title: "Culto de Oração", time: "19h45", place: "Templo Sede", tag: "Oração" },
  { day: "Sex", date: "13", title: "Encontro de Jovens", time: "20h00", place: "Salão Jovem", tag: "Jovens" },
  { day: "Sáb", date: "14", title: "Café com o Pastor", time: "09h30", place: "Anexo", tag: "Comunhão" },
  { day: "Dom", date: "15", title: "Santa Ceia", time: "18h30", place: "Templo Sede", tag: "Culto" },
  { day: "Sex", date: "20", title: "Vigília de Gratidão", time: "22h00", place: "Templo Sede", tag: "Vigília" },
];

function Agenda() {
  const { t } = useSiteContent();
  return (
    <AppShell>
      <section className="px-5 pt-6">
        <p className="text-xs uppercase tracking-[0.25em] text-gold/80">{t("agenda", "kicker")}</p>
        <h1 className="mt-1 font-display text-3xl">{t("agenda", "title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("agenda", "subtitle")}
        </p>
      </section>

      <section className="px-5 mt-6 space-y-3">
        {events.map((e, i) => (
          <article
            key={i}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card"
          >
            <div className="grid h-16 w-14 place-items-center rounded-xl bg-gradient-gold text-primary-foreground">
              <span className="text-[10px] uppercase tracking-widest">{e.day}</span>
              <span className="font-display text-2xl leading-none">{e.date}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-gold">
                  {e.tag}
                </span>
              </div>
              <h3 className="mt-1.5 font-display text-lg leading-tight truncate">{e.title}</h3>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {e.time}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.place}</span>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="px-5 mt-7">
        <div className="rounded-2xl border border-gold/30 bg-card p-5 text-center">
          <Calendar className="mx-auto h-6 w-6 text-gold" />
          <p className="mt-2 text-sm text-muted-foreground">
            {t("agenda", "notify_text")}
          </p>
          <button className="mt-3 rounded-full bg-gradient-gold px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-gold">
            {t("agenda", "notify_button")}
          </button>
        </div>
      </section>
    </AppShell>
  );
}
