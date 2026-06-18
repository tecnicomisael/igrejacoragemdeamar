import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const APPROVERS = [
  "contato@misaelribeiro.com.br",
  "contato@igrejacoragemdeamar.com",
];

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]!));
}

async function sendApprovalEmail(args: {
  toList: string[];
  applicantEmail: string;
  fullName: string;
  role: "pastor" | "midia";
  approveUrl: string;
  rejectUrl: string;
}) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const gmailKey = process.env.GOOGLE_MAIL_API_KEY;
  if (!lovableKey || !gmailKey) throw new Error("Conector Gmail não configurado");

  const roleLabel = args.role === "pastor" ? "Pastor" : "Mídia";
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px">
      <h2 style="color:#0b1020;margin:0 0 12px">Nova solicitação de acesso administrativo</h2>
      <p style="color:#444">Uma pessoa solicitou acesso ao painel administrativo da <strong>Igreja Coragem de Amar</strong>.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:6px 0;color:#666">Nome</td><td><strong>${escapeHtml(args.fullName)}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#666">E-mail</td><td>${escapeHtml(args.applicantEmail)}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Função</td><td>${roleLabel}</td></tr>
      </table>
      <div style="margin:24px 0;text-align:center">
        <a href="${args.approveUrl}" style="display:inline-block;background:#10b981;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;margin-right:8px">✓ Aprovar acesso</a>
        <a href="${args.rejectUrl}" style="display:inline-block;background:#ef4444;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600">✕ Rejeitar</a>
      </div>
      <p style="color:#888;font-size:12px;text-align:center">Se você não conhece esta pessoa, basta clicar em Rejeitar.</p>
    </div>
  `;

  const subject = `Nova solicitação de acesso administrativo — ${args.fullName}`;
  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject, "utf-8").toString("base64")}?=`;

  const rfc2822 = [
    `To: ${args.toList.join(", ")}`,
    `Subject: ${encodedSubject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "",
    html,
  ].join("\r\n");

  const raw = Buffer.from(rfc2822, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await fetch(
    "https://connector-gateway.lovable.dev/google_mail/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": gmailKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("[Gmail] erro:", res.status, text);
    throw new Error(`Falha ao enviar e-mail (${res.status})`);
  }
}

export const requestAdminAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { fullName: string; role: "pastor" | "midia" }) => {
    if (!input?.fullName || input.fullName.trim().length < 2)
      throw new Error("Nome inválido");
    if (input.role !== "pastor" && input.role !== "midia")
      throw new Error("Função inválida");
    return { fullName: input.fullName.trim().slice(0, 120), role: input.role };
  })
  .handler(async ({ data, context }) => {
    const { userId, claims } = context;
    const email = (claims.email as string | undefined) ?? "";
    if (!email) throw new Error("Usuário sem e-mail");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existingRole } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();
    if (existingRole) return { ok: true, status: "already_approved" as const };

    const { data: req, error } = await supabaseAdmin
      .from("admin_signup_requests")
      .upsert(
        {
          user_id: userId,
          email,
          full_name: data.fullName,
          requested_role: data.role,
          status: "pending",
        },
        { onConflict: "user_id" },
      )
      .select("approval_token, status")
      .single();

    if (error || !req) throw new Error(error?.message ?? "Falha ao registrar pedido");

    if (req.status !== "pending") {
      return { ok: true, status: req.status as "approved" | "rejected" };
    }

    const baseUrl =
      process.env.PUBLIC_APP_URL ||
      "https://igrejacoragemdeamar.lovable.app";
    const approveUrl = `${baseUrl}/api/public/approve-admin?token=${req.approval_token}&action=approve`;
    const rejectUrl = `${baseUrl}/api/public/approve-admin?token=${req.approval_token}&action=reject`;

    await sendApprovalEmail({
      toList: APPROVERS,
      applicantEmail: email,
      fullName: data.fullName,
      role: data.role,
      approveUrl,
      rejectUrl,
    });

    return { ok: true, status: "pending" as const };
  });

export const getMyAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [{ data: role }, { data: req }] = await Promise.all([
      supabase.from("user_roles").select("role, full_name").eq("user_id", userId).maybeSingle(),
      supabase
        .from("admin_signup_requests")
        .select("status, requested_role, full_name")
        .eq("user_id", userId)
        .maybeSingle(),
    ]);
    return {
      isAdmin: !!role,
      role: role?.role ?? null,
      fullName: role?.full_name ?? req?.full_name ?? null,
      requestStatus: req?.status ?? null,
      requestedRole: req?.requested_role ?? null,
    };
  });
