import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useSiteContent } from "@/lib/use-content";
import {
  BookOpen,
  HandCoins,
  Users,
  Phone,
  Instagram,
  Youtube,
  MapPin,
  Bell,
  Info,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/mais")({
  head: () => ({
    meta: [
      { title: "Mais • Igreja Coragem de Amar" },
      { name: "description", content: "Bíblia, células, contribuições, contato e redes sociais da Igreja Coragem de Amar." },
    ],
  }),
  component: Mais,
});

const items = [
  { to: "/biblia", label: "Bíblia online", desc: "Leia em qualquer lugar", icon: BookOpen },
  { to: "/contribuir", label: "Dízimos & Ofertas", desc: "Pix, cartão e boleto", icon: HandCoins },
  { to: "/celulas", label: "Células", desc: "Encontre um grupo perto", icon: Users },
  { to: "/contato", label: "Contato", desc: "Fale com a igreja", icon: Phone },
];

function Mais() {
  const { t } = useSiteContent();
  const social = [
    { icon: Instagram, label: "Instagram", url: t("mais", "instagram_url") },
    { icon: Youtube, label: "YouTube", url: t("mais", "youtube_url") },
    { icon: MapPin, label: "Como chegar", url: t("mais", "map_url") },
  ];
  return (
    <AppShell>
      <section className="px-5 pt-6">
        <p className="text-xs uppercase tracking-[0.25em] text-gold/80">Menu</p>
        <h1 className="mt-1 font-display text-3xl">Mais</h1>
      </section>

      <section className="px-5 mt-6 space-y-3">
        {items.map(({ to, label, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-gold text-primary-foreground shadow-gold">
              <Icon className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <div className="font-medium">{label}</div>
              <div className="text-xs text-muted-foreground">{desc}</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </section>

      <section className="px-5 mt-7">
        <h2 className="font-display text-lg mb-3">Conecte-se</h2>
        <div className="grid grid-cols-3 gap-3">
          {social.map(({ icon: Icon, label, url }) => (
            <a
              key={label}
              href={url || "#"}
              target={url && url !== "#" ? "_blank" : undefined}
              rel="noreferrer"
              className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4"
            >
              <Icon className="h-5 w-5 text-gold" />
              <span className="text-xs">{label}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="px-5 mt-7 space-y-3">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-gold" />
            <div>
              <div className="text-sm font-medium">Notificações</div>
              <div className="text-xs text-muted-foreground">Receba avisos de cultos</div>
            </div>
          </div>
          <input type="checkbox" defaultChecked className="h-5 w-9 accent-[var(--gold)]" />
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <Info className="h-5 w-5 text-gold" />
          <div className="flex-1">
            <div className="text-sm font-medium">Sobre a igreja</div>
            <div className="text-xs text-muted-foreground">Nossa história e missão</div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </section>

      <p className="mt-8 text-center text-[11px] text-muted-foreground">
        {t("mais", "footer")}
      </p>
    </AppShell>
  );
}
