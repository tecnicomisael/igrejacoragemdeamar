import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { contentRegistry, type ContentField, type PageDefinition } from "@/lib/content-registry";
import { useInvalidateSiteContent } from "@/lib/use-content";
import { ArrowLeft, Loader2, Save, Upload, ImageIcon, Check } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/conteudo")({
  head: () => ({
    meta: [
      { title: "Editar conteúdo • Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminContent,
});

const SIGNED_EXPIRES = 60 * 60 * 24 * 365 * 50; // ~50 years

async function withTimeout<T>(promise: PromiseLike<T>, ms = 7000): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Tempo limite ao carregar conteúdo")), ms);
  });
  try {
    return await Promise.race([Promise.resolve(promise), timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

function AdminContent() {
  const navigate = useNavigate();
  const invalidate = useInvalidateSiteContent();
  const [activePage, setActivePage] = useState<string>(contentRegistry[0].page);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const { data } = await withTimeout(
          supabase
            .from("site_content")
            .select("page, key, value"),
        );
        if (!active) return;
        const map: Record<string, string> = {};
        for (const row of data ?? []) {
          map[`${row.page}::${row.key}`] = row.value as string;
        }
        setValues(map);
      } catch (error) {
        console.error(error);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const def = useMemo<PageDefinition>(
    () => contentRegistry.find((p) => p.page === activePage)!,
    [activePage],
  );

  const setField = (key: string, value: string) =>
    setValues((v) => ({ ...v, [`${activePage}::${key}`]: value }));

  const saveAll = async () => {
    setSaving(true);
    setSaved(false);
    const rows = def.fields.map((f) => ({
      page: activePage,
      key: f.key,
      type: f.type,
      value: values[`${activePage}::${f.key}`] ?? "",
    }));
    const { error } = await supabase
      .from("site_content")
      .upsert(rows, { onConflict: "page,key" });
    setSaving(false);
    if (!error) {
      setSaved(true);
      invalidate();
      setTimeout(() => setSaved(false), 2200);
    } else {
      alert("Erro ao salvar: " + error.message);
    }
  };

  return (
    <AppShell>
      <section className="px-5 pt-6">
        <button
          onClick={() => navigate({ to: "/admin" })}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> Voltar ao painel
        </button>
        <h1 className="mt-2 font-display text-3xl">Conteúdo do site</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edite textos e imagens de qualquer página. As mudanças aparecem para todos imediatamente.
        </p>
      </section>

      <section className="px-5 mt-5">
        <div className="-mx-5 overflow-x-auto px-5">
          <div className="flex gap-2 w-max">
            {contentRegistry.map((p) => (
              <button
                key={p.page}
                onClick={() => setActivePage(p.page)}
                className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-xs transition-all ${
                  activePage === p.page
                    ? "border-transparent bg-gradient-gold text-primary-foreground shadow-gold"
                    : "border-border text-muted-foreground"
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 mt-6 space-y-4">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando…
          </div>
        ) : (
          def.fields.map((f) => (
            <FieldEditor
              key={f.key}
              field={f}
              value={values[`${activePage}::${f.key}`] ?? ""}
              onChange={(v) => setField(f.key, v)}
              page={activePage}
            />
          ))
        )}
      </section>

      <div className="sticky bottom-20 z-30 px-5 mt-6">
        <button
          onClick={saveAll}
          disabled={saving || loading}
          className="w-full rounded-full bg-gradient-gold py-3 text-sm font-semibold text-primary-foreground shadow-gold disabled:opacity-60 inline-flex items-center justify-center gap-2"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <Check className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Salvando…" : saved ? "Salvo!" : `Salvar alterações de "${def.title}"`}
        </button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          <Link to="/" className="underline">Ver site</Link> para conferir.
        </p>
      </div>
    </AppShell>
  );
}

function FieldEditor({
  field,
  value,
  onChange,
  page,
}: {
  field: ContentField;
  value: string;
  onChange: (v: string) => void;
  page: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `${page}/${field.key}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("site-images")
        .upload(path, file, { upsert: true, cacheControl: "3600" });
      if (upErr) throw upErr;
      const { data, error: sErr } = await supabase.storage
        .from("site-images")
        .createSignedUrl(path, SIGNED_EXPIRES);
      if (sErr) throw sErr;
      onChange(data.signedUrl);
    } catch (e: unknown) {
      alert("Falha no upload: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <label className="block text-xs font-medium text-foreground/90">{field.label}</label>
      {field.hint && (
        <p className="mt-0.5 text-[11px] text-muted-foreground">{field.hint}</p>
      )}

      {field.type === "text" && (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.default}
          className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold/60"
        />
      )}

      {field.type === "textarea" && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.default}
          rows={4}
          className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold/60 resize-y"
        />
      )}

      {field.type === "image" && (
        <div className="mt-2 space-y-2">
          {value ? (
            <div className="relative rounded-lg border border-border overflow-hidden bg-background">
              <img src={value} alt="" className="max-h-40 w-full object-contain" />
            </div>
          ) : (
            <div className="flex items-center justify-center h-24 rounded-lg border border-dashed border-border text-muted-foreground text-xs">
              <ImageIcon className="h-4 w-4 mr-1.5" /> Nenhuma imagem
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-gold text-primary-foreground px-3 py-1.5 text-xs font-medium disabled:opacity-60"
            >
              {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
              {value ? "Trocar imagem" : "Enviar imagem"}
            </button>
            {value && (
              <button
                onClick={() => onChange("")}
                className="rounded-full border border-border px-3 py-1.5 text-xs"
              >
                Remover
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadImage(f);
              e.target.value = "";
            }}
          />
        </div>
      )}
    </div>
  );
}
