import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, LogOut, Loader2, MessageSquare, Heart, ShieldCheck, FileEdit, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel administrativo • Igreja Coragem de Amar" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPanel,
});

type Tab = "mural" | "contatos";

type Prayer = { id: string; name: string; text: string; count: number; created_at: string };
type ContactMsg = { id: string; name: string; email: string; message: string; created_at: string };

function AdminPanel() {
  const navigate = useNavigate();
  const { role } = Route.useRouteContext();
  const [tab, setTab] = useState<Tab>("mural");
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [contacts, setContacts] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [pr, ct] = await Promise.all([
      supabase
        .from("prayers")
        .select("id, name, text, count, created_at")
        .order("created_at", { ascending: false })
        .limit(200),
      supabase
        .from("contact_messages")
        .select("id, name, email, message, created_at")
        .order("created_at", { ascending: false })
        .limit(200),
    ]);
    if (pr.data) setPrayers(pr.data as Prayer[]);
    if (ct.data) setContacts(ct.data as ContactMsg[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const removePrayer = async (id: string) => {
    if (!confirm("Remover este pedido do mural?")) return;
    const { error } = await supabase.from("prayers").delete().eq("id", id);
    if (!error) setPrayers((p) => p.filter((x) => x.id !== id));
  };

  const removeContact = async (id: string) => {
    if (!confirm("Remover esta mensagem?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (!error) setContacts((c) => c.filter((x) => x.id !== id));
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  return (
    <AppShell>
      <section className="px-5 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold/80 flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3" /> Painel administrativo
            </p>
            <h1 className="mt-1 font-display text-3xl">Olá, {role === "pastor" ? "Pastor" : "Mídia"}</h1>
          </div>
          <button
            onClick={signOut}
            className="rounded-full border border-border px-3 py-1.5 text-xs inline-flex items-center gap-1.5"
          >
            <LogOut className="h-3 w-3" /> Sair
          </button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Gerencie o conteúdo público do site.
        </p>
      </section>

      <section className="px-5 mt-5">
        <Link
          to="/admin/conteudo"
          className="flex items-center gap-3 rounded-2xl border border-gold/40 bg-gradient-hero p-4 shadow-card"
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-gold text-primary-foreground shadow-gold">
            <FileEdit className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <div className="font-display text-base">Editar conteúdo do site</div>
            <div className="text-xs text-muted-foreground">Textos e imagens de todas as páginas</div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </section>

      <section className="px-5 mt-5">
        <div className="inline-flex rounded-full border border-border bg-card p-1 text-xs">
          {([
            { id: "mural" as const, label: "Mural", icon: Heart },
            { id: "contatos" as const, label: "Contatos", icon: MessageSquare },
          ]).map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-1.5 rounded-full transition inline-flex items-center gap-1.5 ${
                  tab === t.id ? "bg-gradient-gold text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-3 w-3" /> {t.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="px-5 mt-5">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando…
          </div>
        ) : tab === "mural" ? (
          <div className="space-y-3">
            {prayers.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum pedido no mural.</p>
            )}
            {prayers.map((p) => (
              <article key={p.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gold">{p.name}</span>
                  <button
                    onClick={() => removePrayer(p.id)}
                    className="inline-flex items-center gap-1 rounded-full bg-red-500/10 text-red-300 px-2.5 py-1 text-[11px] hover:bg-red-500/20"
                  >
                    <Trash2 className="h-3 w-3" /> Remover
                  </button>
                </div>
                <p className="mt-2 text-sm text-foreground/90 whitespace-pre-wrap">{p.text}</p>
                <p className="mt-2 text-[10px] text-muted-foreground">
                  {new Date(p.created_at).toLocaleString("pt-BR")} · {p.count} oraram
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhuma mensagem recebida.</p>
            )}
            {contacts.map((c) => (
              <article key={c.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gold">{c.name}</div>
                    <a href={`mailto:${c.email}`} className="text-xs text-muted-foreground underline">
                      {c.email}
                    </a>
                  </div>
                  <button
                    onClick={() => removeContact(c.id)}
                    className="inline-flex items-center gap-1 rounded-full bg-red-500/10 text-red-300 px-2.5 py-1 text-[11px] hover:bg-red-500/20"
                  >
                    <Trash2 className="h-3 w-3" /> Remover
                  </button>
                </div>
                <p className="mt-2 text-sm text-foreground/90 whitespace-pre-wrap">{c.message}</p>
                <p className="mt-2 text-[10px] text-muted-foreground">
                  {new Date(c.created_at).toLocaleString("pt-BR")}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
