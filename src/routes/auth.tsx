import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { requestAdminAccess, getMyAdminStatus } from "@/lib/admin.functions";
import { AppShell } from "@/components/AppShell";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acesso administrativo • Igreja Coragem de Amar" },
      { name: "description", content: "Login para pastores e equipe de mídia." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

type Mode = "login" | "signup";

function AuthPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [status, setStatus] = useState<{
    isAdmin: boolean;
    requestStatus: string | null;
    fullName: string | null;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const refresh = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setSignedIn(false);
      setStatus(null);
      setChecking(false);
      return;
    }
    setSignedIn(true);
    try {
      const s = await getMyAdminStatus();
      setStatus(s);
      if (s.isAdmin) {
        await router.invalidate();
        navigate({ to: "/" });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    });
    setLoading(false);
    if (error) {
      setError("E-mail ou senha incorretos.");
      return;
    }
    await refresh();
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    const fullName = String(fd.get("fullName"));
    const role = String(fd.get("role")) as "pastor" | "midia";

    if (password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);
    const { error: signErr } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (signErr) {
      setLoading(false);
      const msg = signErr.message?.toLowerCase() ?? "";
      if (msg.includes("registered")) {
        setError("Este e-mail já está cadastrado. Faça login.");
      } else if (msg.includes("weak") || msg.includes("pwned") || msg.includes("known")) {
        setError(
          "Essa senha é muito comum e já apareceu em vazamentos públicos. Escolha uma senha mais forte — combine letras maiúsculas e minúsculas, números e símbolos (ex: Igreja@CoragemDeAmar2026!).",
        );
      } else {
        setError(signErr.message ?? "Erro no cadastro.");
      }
      return;
    }

    // Garante sessão (auto_confirm está ativo)
    const { data: sess } = await supabase.auth.getSession();
    if (!sess.session) {
      await supabase.auth.signInWithPassword({ email, password });
    }

    try {
      await requestAdminAccess({ data: { fullName, role } });
      setNotice(
        "Cadastro recebido! Um e-mail foi enviado aos responsáveis e seu acesso será liberado após a aprovação.",
      );
      setMode("login");
      await supabase.auth.signOut();
      setSignedIn(false);
      setStatus(null);
    } catch (e) {
      setError(
        e instanceof Error
          ? `Cadastro criado, mas falhou ao enviar e-mail de aprovação: ${e.message}`
          : "Falha ao enviar e-mail de aprovação.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSignedIn(false);
    setStatus(null);
    setNotice("Sessão encerrada.");
  };

  if (checking) {
    return (
      <AppShell>
        <div className="px-5 pt-10 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Verificando sessão…
        </div>
      </AppShell>
    );
  }

  // Logged in but not admin yet
  if (signedIn && status && !status.isAdmin) {
    const label =
      status.requestStatus === "pending"
        ? "Seu cadastro está aguardando aprovação da equipe pastoral."
        : status.requestStatus === "rejected"
        ? "Seu pedido foi rejeitado. Entre em contato com a equipe pastoral."
        : "Você ainda não tem permissão para acessar o painel administrativo.";
    return (
      <AppShell>
        <section className="px-5 pt-8">
          <h1 className="font-display text-2xl">Aguardando aprovação</h1>
          <p className="mt-3 text-sm text-muted-foreground">{label}</p>
          <button
            onClick={handleSignOut}
            className="mt-6 rounded-full border border-border px-5 py-2.5 text-sm"
          >
            Sair
          </button>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="px-5 pt-6">
        <p className="text-xs uppercase tracking-[0.25em] text-gold/80">Acesso restrito</p>
        <h1 className="mt-1 font-display text-3xl">
          {mode === "login" ? "Entrar" : "Solicitar acesso"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Apenas pastores e equipe de mídia. Novos cadastros passam por aprovação por e-mail.
        </p>
      </section>

      <section className="px-5 mt-5">
        <div className="inline-flex rounded-full border border-border bg-card p-1 text-xs">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setError(null);
                setNotice(null);
              }}
              className={`px-4 py-1.5 rounded-full transition ${
                mode === m ? "bg-gradient-gold text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {m === "login" ? "Já tenho conta" : "Criar conta"}
            </button>
          ))}
        </div>
      </section>

      <section className="px-5 mt-5">
        {mode === "login" ? (
          <form onSubmit={handleLogin} className="rounded-2xl border border-border bg-card p-4 space-y-3">
            <input
              name="email"
              type="email"
              required
              placeholder="E-mail"
              className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-gold"
            />
            <input
              name="password"
              type="password"
              required
              placeholder="Senha"
              className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-gold"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-gold py-3 text-sm font-semibold text-primary-foreground shadow-gold disabled:opacity-60"
            >
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="rounded-2xl border border-border bg-card p-4 space-y-3">
            <input
              name="fullName"
              required
              minLength={2}
              maxLength={120}
              placeholder="Nome completo"
              className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-gold"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="E-mail"
              className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-gold"
            />
            <input
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="Senha (mín. 8 caracteres)"
              className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-gold"
            />
            <div>
              <label className="text-xs text-muted-foreground">Função</label>
              <select
                name="role"
                required
                defaultValue="pastor"
                className="mt-1 w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-gold"
              >
                <option value="pastor">Pastor</option>
                <option value="midia">Mídia</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-gold py-3 text-sm font-semibold text-primary-foreground shadow-gold disabled:opacity-60"
            >
              {loading ? "Enviando…" : "Solicitar acesso"}
            </button>
            <p className="text-[11px] text-muted-foreground">
              Um e-mail será enviado para a equipe da igreja para aprovar seu acesso.
            </p>
          </form>
        )}

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
