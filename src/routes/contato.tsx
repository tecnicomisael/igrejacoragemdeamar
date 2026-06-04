import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

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
  return (
    <AppShell>
      <section className="px-5 pt-6">
        <p className="text-xs uppercase tracking-[0.25em] text-gold/80">Fale conosco</p>
        <h1 className="mt-1 font-display text-3xl">Contato</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Estamos aqui para ouvir, orar e caminhar com você.
        </p>
      </section>

      <section className="px-5 mt-6 space-y-3">
        {[
          { icon: MessageCircle, label: "WhatsApp", value: "(11) 99999-0000" },
          { icon: Phone, label: "Telefone", value: "(11) 3000-0000" },
          { icon: Mail, label: "E-mail", value: "contato@coragemdeamar.org" },
          { icon: MapPin, label: "Endereço", value: "Rua da Esperança, 100 — Centro" },
        ].map(({ icon: Icon, label, value }) => (
          <a
            key={label}
            href="#"
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-gold text-primary-foreground shadow-gold">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="font-medium">{value}</div>
            </div>
          </a>
        ))}
      </section>

      <section className="px-5 mt-6">
        <form className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <h2 className="font-display text-lg">Envie uma mensagem</h2>
          <input
            placeholder="Seu nome"
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-gold"
          />
          <input
            placeholder="E-mail"
            type="email"
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-gold"
          />
          <textarea
            rows={4}
            placeholder="Mensagem"
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-gold resize-none"
          />
          <button className="w-full rounded-full bg-gradient-gold py-3 text-sm font-semibold text-primary-foreground shadow-gold">
            Enviar
          </button>
        </form>
      </section>
    </AppShell>
  );
}
