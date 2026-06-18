import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useSiteContent } from "@/lib/use-content";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato • Igreja Coragem de Amar" },
      { name: "description", content: "Fale com a equipe pastoral da Igreja Coragem de Amar." },
    ],
  }),
  component: Contato,
});

function Contato() {
  const { t } = useSiteContent();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    if (!name || !email || !message) {
      setError("Preencha todos os campos.");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("contact_messages").insert({ name, email, message });
    setSending(false);
    if (error) {
      setError("Não foi possível enviar. Tente novamente.");
      return;
    }
    setSent(true);
    (e.target as HTMLFormElement).reset();
    setTimeout(() => setSent(false), 3500);
  };

  const phone = t("contato", "phone");
  const address = t("contato", "address");

  return (
    <AppShell>
      <section className="px-5 pt-6">
        <p className="text-xs uppercase tracking-[0.25em] text-gold/80">{t("contato", "kicker")}</p>
        <h1 className="mt-1 font-display text-3xl">{t("contato", "title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("contato", "subtitle")}
        </p>
      </section>

      <section className="px-5 mt-6 space-y-3">
        {[
          { icon: MessageCircle, label: "WhatsApp", value: "(11) 99999-0000" },
          { icon: Phone, label: "Telefone", value: "(11) 3000-0000" },
          { icon: Mail, label: "E-mail", value: "contato@coragemdeamar.org" },
          { icon: MapPin, label: "Endereço", value: "Rua da Esperança, 100 — Centro" },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-gold text-primary-foreground shadow-gold">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="font-medium">{value}</div>
            </div>
          </div>
        ))}
      </section>

      <section className="px-5 mt-6">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-4 space-y-3"
        >
          <h2 className="font-display text-lg">Envie uma mensagem</h2>
          <input
            name="name"
            required
            maxLength={120}
            placeholder="Seu nome"
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-gold"
          />
          <input
            name="email"
            type="email"
            required
            maxLength={255}
            placeholder="E-mail"
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-gold"
          />
          <textarea
            name="message"
            required
            rows={4}
            maxLength={4000}
            placeholder="Mensagem"
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-gold resize-none"
          />
          <button
            type="submit"
            disabled={sending}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold py-3 text-sm font-semibold text-primary-foreground shadow-gold disabled:opacity-60"
          >
            {sent ? "Mensagem enviada 🙏" : sending ? "Enviando…" : (<>Enviar <Send className="h-4 w-4" /></>)}
          </button>
          {error && (
            <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}
        </form>
      </section>
    </AppShell>
  );
}
