import { createFileRoute } from "@tanstack/react-router";

function page(opts: { title: string; body: string; color: string }) {
  return new Response(
    `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>${opts.title}</title></head>
<body style="font-family:Arial,sans-serif;background:#0b1020;color:#fff;display:grid;place-items:center;min-height:100vh;margin:0;padding:24px">
  <div style="max-width:480px;text-align:center;background:#111a36;border:1px solid #2a3360;border-radius:16px;padding:32px">
    <div style="font-size:48px;margin-bottom:8px">${opts.color === "ok" ? "✅" : opts.color === "warn" ? "⚠️" : "❌"}</div>
    <h1 style="margin:0 0 12px;font-size:22px">${opts.title}</h1>
    <p style="color:#cbd5e1;line-height:1.5">${opts.body}</p>
  </div>
</body></html>`,
    { status: 200, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

export const Route = createFileRoute("/api/public/approve-admin")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const token = url.searchParams.get("token");
        const action = url.searchParams.get("action");

        if (!token || (action !== "approve" && action !== "reject")) {
          return page({
            title: "Link inválido",
            body: "Os parâmetros da URL estão incompletos.",
            color: "err",
          });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: req, error } = await supabaseAdmin
          .from("admin_signup_requests")
          .select("id, user_id, full_name, email, requested_role, status")
          .eq("approval_token", token)
          .maybeSingle();

        if (error || !req) {
          return page({
            title: "Solicitação não encontrada",
            body: "Este link já foi usado ou é inválido.",
            color: "err",
          });
        }

        if (req.status !== "pending") {
          return page({
            title: "Solicitação já processada",
            body: `Esta solicitação já foi <strong>${req.status === "approved" ? "aprovada" : "rejeitada"}</strong> anteriormente.`,
            color: "warn",
          });
        }

        if (action === "reject") {
          await supabaseAdmin
            .from("admin_signup_requests")
            .update({ status: "rejected", processed_at: new Date().toISOString() })
            .eq("id", req.id);
          return page({
            title: "Acesso rejeitado",
            body: `O pedido de <strong>${req.full_name}</strong> (${req.email}) foi rejeitado.`,
            color: "warn",
          });
        }

        // Approve: grant role and mark request
        const { error: grantErr } = await supabaseAdmin.from("user_roles").upsert(
          { user_id: req.user_id, role: req.requested_role, full_name: req.full_name },
          { onConflict: "user_id,role" },
        );

        if (grantErr) {
          return page({
            title: "Erro ao aprovar",
            body: "Não foi possível conceder o acesso. Tente novamente em instantes.",
            color: "err",
          });
        }

        await supabaseAdmin
          .from("admin_signup_requests")
          .update({ status: "approved", processed_at: new Date().toISOString() })
          .eq("id", req.id);

        return page({
          title: "Acesso aprovado",
          body: `<strong>${req.full_name}</strong> agora pode acessar o painel administrativo.`,
          color: "ok",
        });
      },
    },
  },
});
