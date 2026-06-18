import { Link, useLocation } from "@tanstack/react-router";
import { Home, Calendar, Heart, BookOpen, Menu, ShieldCheck } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import logo from "@/assets/logo-coragem.png.asset.json";
import { supabase } from "@/integrations/supabase/client";

const tabs = [
  { to: "/", label: "Início", icon: Home },
  { to: "/agenda", label: "Agenda", icon: Calendar },
  { to: "/sermoes", label: "Sermões", icon: BookOpen },
  { to: "/oracao", label: "Oração", icon: Heart },
  { to: "/mais", label: "Mais", icon: Menu },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      const user = data.session?.user;
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();
      if (active) setIsAdmin(!!role);
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => check());
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-night flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
        <div className="mx-auto max-w-md px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo.url} alt="Igreja Coragem de Amar" className="h-9 w-auto" />
            <div className="leading-tight">
              <div className="text-[10px] uppercase tracking-[0.18em] text-gold/80">Igreja</div>
              <div className="font-display text-base text-foreground">Coragem de Amar</div>
            </div>
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 rounded-full bg-gold/15 text-gold px-2.5 py-1 text-[11px] font-semibold"
            >
              <ShieldCheck className="h-3 w-3" /> Admin
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-md pb-28">{children}</main>

      <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto max-w-md grid grid-cols-5 px-2 py-2">
          {tabs.map((t) => {
            const active = pathname === t.to || (t.to !== "/" && pathname.startsWith(t.to));
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className="flex flex-col items-center gap-1 py-1.5 text-[11px] transition-colors"
              >
                <span
                  className={`flex h-9 w-12 items-center justify-center rounded-full transition-all ${
                    active ? "bg-gradient-gold text-primary-foreground shadow-gold" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" strokeWidth={2.2} />
                </span>
                <span className={active ? "text-gold font-medium" : "text-muted-foreground"}>
                  {t.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
