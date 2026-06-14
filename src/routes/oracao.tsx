import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Heart, Send, Lock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/oracao")({
  head: () => ({
    meta: [
      { title: "Pedidos de Oração • Igreja Coragem de Amar" },
      { name: "description", content: "Envie seu pedido de oração e una-se a uma comunidade que intercede." },
    ],
  }),
  component: Oracao,
});

type Prayer = {
  id: string;
  name: string;
  text: string;
  count: number;
  anonymous: boolean;
};

function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("cda_device_id");
  if (!id) {
    id = (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)) + "-" + Date.now();
    localStorage.setItem("cda_device_id", id);
  }
  return id;
}

function getPrayedSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem("cda_prayed_ids") ?? "[]"));
  } catch {
    return new Set();
  }
}

function savePrayedSet(set: Set<string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem("cda_prayed_ids", JSON.stringify([...set]));
}

function Oracao() {
  const [sent, setSent] = useState(false);
  const [anon, setAnon] = useState(false);
  const [wall, setWall] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [prayed, setPrayed] = useState<Set<string>>(new Set());
  const nameRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setPrayed(getPrayedSet());

    (async () => {
      const { data } = await supabase
        .from("prayers")
        .select("id, name, text, count, anonymous")
        .order("created_at", { ascending: false })
        .limit(100);
      if (data) setWall(data as Prayer[]);
      setLoading(false);
    })();

    const channel = supabase
      .channel("prayers-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "prayers" },
        (payload) => {
          const p = payload.new as Prayer;
          setWall((prev) => (prev.some((x) => x.id === p.id) ? prev : [p, ...prev]));
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "prayers" },
        (payload) => {
          const p = payload.new as Prayer;
          setWall((prev) => prev.map((x) => (x.id === p.id ? { ...x, count: p.count } : x)));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = textRef.current?.value.trim() ?? "";
    if (!text || submitting) return;
    const name = anon ? "Anônimo" : (nameRef.current?.value.trim() || "Anônimo");

    setSubmitting(true);
    const { data, error } = await supabase
      .from("prayers")
      .insert({ name, text, anonymous: anon })
      .select("id, name, text, count, anonymous")
      .single();
    setSubmitting(false);

    if (error || !data) return;

    setWall((prev) => (prev.some((x) => x.id === data.id) ? prev : [data as Prayer, ...prev]));
    setSent(true);
    setTimeout(() => setSent(false), 2500);
    (e.target as HTMLFormElement).reset();
    setAnon(false);
  };

  const handlePray = async (id: string) => {
    if (prayed.has(id)) return;
    // optimistic
    const next = new Set(prayed);
    next.add(id);
    setPrayed(next);
    savePrayedSet(next);
    setWall((prev) => prev.map((p) => (p.id === id ? { ...p, count: p.count + 1 } : p)));

    const { error } = await supabase
      .from("prayer_intercessions")
      .insert({ prayer_id: id, device_id: getDeviceId() });

    if (error) {
      // já registrado neste dispositivo: mantém estado. Outro erro: reverte.
      const isDuplicate = (error as { code?: string }).code === "23505";
      if (!isDuplicate) {
        const revert = new Set(next);
        revert.delete(id);
        setPrayed(revert);
        savePrayedSet(revert);
        setWall((prev) => prev.map((p) => (p.id === id ? { ...p, count: Math.max(0, p.count - 1) } : p)));
      }
    }
  };

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
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-4 shadow-card space-y-3"
        >
          <input
            ref={nameRef}
            placeholder="Seu nome (opcional)"
            disabled={anon}
            maxLength={60}
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-gold disabled:opacity-50"
          />
          <textarea
            ref={textRef}
            required
            rows={4}
            maxLength={1000}
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
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold py-3 text-sm font-semibold text-primary-foreground shadow-gold disabled:opacity-60"
          >
            {sent ? "Pedido enviado 🙏" : submitting ? "Enviando…" : (<>Enviar pedido <Send className="h-4 w-4" /></>)}
          </button>
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Lock className="h-3 w-3" /> Seu pedido vai diretamente à equipe pastoral e aparece no mural abaixo.
          </p>
        </form>
      </section>

      <section className="px-5 mt-7">
        <div className="flex items-end justify-between mb-3">
          <h2 className="font-display text-xl">Mural de oração</h2>
          <span className="text-xs text-muted-foreground">
            {loading ? "carregando…" : `${wall.length} pedidos`}
          </span>
        </div>
        <div className="space-y-3">
          {!loading && wall.length === 0 && (
            <p className="text-sm text-muted-foreground">Seja o primeiro a compartilhar um pedido.</p>
          )}
          {wall.map((p) => {
            const hasPrayed = prayed.has(p.id);
            return (
              <article key={p.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gold">{p.name}</span>
                  <button
                    onClick={() => handlePray(p.id)}
                    disabled={hasPrayed}
                    aria-label={hasPrayed ? "Você já orou por este pedido" : "Orar por este pedido"}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] transition ${
                      hasPrayed
                        ? "bg-gold/20 text-gold cursor-default"
                        : "bg-gold/10 text-gold hover:bg-gold/20 active:scale-95"
                    }`}
                  >
                    <Heart className={`h-3 w-3 ${hasPrayed ? "fill-current" : ""}`} />{" "}
                    {p.count} {p.count === 1 ? "orou" : "oraram"}
                  </button>
                </div>
                <p className="mt-2 text-sm text-foreground/90 whitespace-pre-wrap">{p.text}</p>
              </article>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
