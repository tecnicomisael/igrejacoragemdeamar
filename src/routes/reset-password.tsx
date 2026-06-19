import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Redefinir senha • Igreja Coragem de Amar" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    // Supabase processa o hash (#access_token=...) automaticamente e dispara PASSWORD_RECOVERY.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setHasSession(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setHasSession(true);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password"));
    const confirm = String(fd.get("confirm"));
    if (password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não conferem.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setNotice("Senha atualizada com sucesso! Redirecionando…");
    setTimeout(async () => {
      await supabase.auth.signOut();
      navigate({ to: "/auth" });
    }, 1500);
  };

  if (!ready) {
    return (
      <AppShell>
        <div className="px-5 pt-10 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando…
        </div>
      </AppShell>
    );
  }

  if (!hasSession) {
    return (
      <AppShell>
        <section className="px-5 pt-8">
          <h1 className="font-display text-2xl">Link inválido ou expirado</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Solicite um novo link de redefinição de senha na tela de login.
          </p>
          <button
            onClick={() => navigate({ to: "/auth" })}
            className="mt-6 rounded-full border border-border px-5 py-2.5 text-sm"
          >
            Voltar para o login
          </button>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="px-5 pt-6">
        <p className="text-xs uppercase tracking-[0.25em] text-gold/80">Recuperação de acesso</p>
        <h1 className="mt-1 font-display text-3xl">Definir nova senha</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Escolha uma senha forte com pelo menos 8 caracteres.
        </p>
      </section>

      <section className="px-5 mt-5">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              placeholder="Nova senha"
              className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 pr-11 text-sm outline-none focus:border-gold"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <input
            name="confirm"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            placeholder="Confirme a nova senha"
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-gold"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-gold py-3 text-sm font-semibold text-primary-foreground shadow-gold disabled:opacity-60"
          >
            {loading ? "Salvando…" : "Salvar nova senha"}
          </button>
        </form>

        {error && (
          <p className="mt-3 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}
        {notice && (
          <p className="mt-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
            {notice}
          </p>
        )}
      </section>
    </AppShell>
  );
}
