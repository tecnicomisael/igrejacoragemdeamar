import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import logo from "@/assets/logo-coragem.png.asset.json";
import {
  Calendar,
  PlayCircle,
  Heart,
  BookOpen,
  HandCoins,
  Users,
  ArrowRight,
  MapPin,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Igreja Coragem de Amar — App Oficial" },
      {
        name: "description",
        content:
          "Sermões, devocionais, agenda de cultos, pedidos de oração e contribuição online da Igreja Coragem de Amar.",
      },
    ],
  }),
  component: Home,
});

const verse = {
  text: "Acima de tudo, porém, revistam-se do amor, que é o vínculo perfeito.",
  ref: "Colossenses 3:14",
};

const quickActions = [
  { to: "/sermoes", label: "Sermões", icon: PlayCircle },
  { to: "/agenda", label: "Agenda", icon: Calendar },
  { to: "/oracao", label: "Oração", icon: Heart },
  { to: "/biblia", label: "Bíblia", icon: BookOpen },
  { to: "/contribuir", label: "Contribuir", icon: HandCoins },
  { to: "/celulas", label: "Células", icon: Users },
];

function Home() {
  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero px-5 pt-6 pb-10">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.25em] text-gold/80">Bem-vindo</p>
          <h1 className="mt-2 font-display text-[2.1rem] leading-[1.05] text-foreground">
            Onde a fé encontra <span className="text-gradient-gold">coragem</span> para amar.
          </h1>

          <div className="mt-6 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gold/20 blur-2xl" />
              <img src={logo.url} alt="" className="relative h-28 w-auto drop-shadow-2xl" />
            </div>
          </div>

          {/* Next service card */}
          <Link
            to="/agenda"
            className="mt-6 flex items-center justify-between rounded-2xl border border-gold/30 bg-card/60 p-4 backdrop-blur shadow-card"
          >
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gold">Próximo culto</div>
              <div className="mt-1 font-display text-lg">Domingo • 19h</div>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> Templo Sede
              </div>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-gold text-primary-foreground shadow-gold">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </section>

      {/* Verse of the day */}
      <section className="px-5 -mt-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-gold">Versículo do dia</span>
            <BookOpen className="h-4 w-4 text-gold" />
          </div>
          <p className="mt-3 font-display text-lg leading-snug text-foreground">
            “{verse.text}”
          </p>
          <p className="mt-2 text-xs text-muted-foreground">{verse.ref}</p>
        </div>
      </section>

      {/* Quick actions */}
      <section className="px-5 mt-6">
        <h2 className="font-display text-xl mb-3">Acesso rápido</h2>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4 transition-all hover:border-gold/50 hover:-translate-y-0.5"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-gold text-primary-foreground shadow-gold">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-medium text-foreground">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest sermon */}
      <section className="px-5 mt-7">
        <div className="flex items-end justify-between mb-3">
          <h2 className="font-display text-xl">Último sermão</h2>
          <Link to="/sermoes" className="text-xs text-gold">Ver todos</Link>
        </div>
        <Link
          to="/sermoes"
          className="block overflow-hidden rounded-2xl border border-border bg-card shadow-card"
        >
          <div className="relative h-40 bg-gradient-hero">
            <div className="absolute inset-0 grid place-items-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-gold text-primary-foreground shadow-gold">
                <PlayCircle className="h-7 w-7" />
              </span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="rounded-full bg-background/70 px-2.5 py-1 text-[10px] uppercase tracking-widest text-gold backdrop-blur">
                Culto da família
              </span>
              <span className="rounded-full bg-background/70 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur">
                42 min
              </span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-display text-lg leading-tight">A coragem que nasce do amor</h3>
            <p className="mt-1 text-xs text-muted-foreground">Pr. Pedro Costa • 02 Jun 2026</p>
          </div>
        </Link>
      </section>

      {/* Devotional */}
      <section className="px-5 mt-7">
        <div className="rounded-2xl border border-border bg-gradient-hero p-5 shadow-card">
          <span className="text-[10px] uppercase tracking-widest text-gold">Devocional de hoje</span>
          <h3 className="mt-2 font-display text-xl">Coragem no silêncio</h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
            Há momentos em que Deus fala mais alto na quietude. Aprenda hoje como
            o silêncio molda a fé e renova a esperança do coração cansado…
          </p>
          <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold">
            Ler devocional <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="px-5 mt-7">
        <h2 className="font-display text-xl mb-3">Comunidade</h2>
        <div className="grid gap-3">
          <Link to="/oracao" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold/15 text-gold">
              <Heart className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <div className="font-medium">Envie um pedido de oração</div>
              <div className="text-xs text-muted-foreground">Nossa equipe ora por você</div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Link to="/contribuir" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold/15 text-gold">
              <HandCoins className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <div className="font-medium">Dízimos & Ofertas</div>
              <div className="text-xs text-muted-foreground">Contribua com facilidade via Pix</div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
