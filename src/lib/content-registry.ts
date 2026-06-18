// Registry of editable site content. Each entry declares the page, field key,
// human label, input type, and the default value used when the database has no
// override yet. The admin "Conteúdo do site" panel auto-generates forms from this.

export type FieldType = "text" | "textarea" | "image";

export type ContentField = {
  key: string;
  label: string;
  type: FieldType;
  default: string;
  hint?: string;
};

export type PageDefinition = {
  page: string;
  title: string;
  fields: ContentField[];
};

export const contentRegistry: PageDefinition[] = [
  {
    page: "home",
    title: "Início",
    fields: [
      { key: "hero_kicker", label: "Pré-título do hero", type: "text", default: "Bem-vindo" },
      {
        key: "hero_title",
        label: "Título principal (use **palavra** para destacar em dourado)",
        type: "text",
        default: "Onde a fé encontra **coragem** para amar.",
      },
      { key: "hero_logo", label: "Logo do hero (centro)", type: "image", default: "" },
      { key: "next_service_label", label: "Rótulo do próximo culto", type: "text", default: "Próximo culto" },
      { key: "next_service_when", label: "Quando", type: "text", default: "Domingo • 19h" },
      { key: "next_service_place", label: "Local", type: "text", default: "Templo Sede" },
      { key: "verse_label", label: "Rótulo do versículo", type: "text", default: "Versículo do dia" },
      {
        key: "verse_text",
        label: "Versículo",
        type: "textarea",
        default: "Acima de tudo, porém, revistam-se do amor, que é o vínculo perfeito.",
      },
      { key: "verse_ref", label: "Referência do versículo", type: "text", default: "Colossenses 3:14" },
      { key: "quick_title", label: "Título de acesso rápido", type: "text", default: "Acesso rápido" },
      { key: "sermon_section_title", label: "Título da seção de sermão", type: "text", default: "Último sermão" },
      { key: "sermon_card_title", label: "Título do sermão em destaque", type: "text", default: "A coragem que nasce do amor" },
      { key: "sermon_card_meta", label: "Autor e data do sermão", type: "text", default: "Pr. Pedro Costa • 02 Jun 2026" },
      { key: "sermon_card_tag", label: "Tag do sermão", type: "text", default: "Culto da família" },
      { key: "sermon_card_duration", label: "Duração do sermão", type: "text", default: "42 min" },
      { key: "devo_label", label: "Rótulo do devocional", type: "text", default: "Devocional de hoje" },
      { key: "devo_title", label: "Título do devocional", type: "text", default: "Coragem no silêncio" },
      {
        key: "devo_text",
        label: "Texto do devocional",
        type: "textarea",
        default:
          "Há momentos em que Deus fala mais alto na quietude. Aprenda hoje como o silêncio molda a fé e renova a esperança do coração cansado…",
      },
      { key: "community_title", label: "Título da seção comunidade", type: "text", default: "Comunidade" },
    ],
  },
  {
    page: "agenda",
    title: "Agenda",
    fields: [
      { key: "kicker", label: "Pré-título", type: "text", default: "Programação" },
      { key: "title", label: "Título", type: "text", default: "Agenda" },
      {
        key: "subtitle",
        label: "Subtítulo",
        type: "textarea",
        default: "Junte-se a nós nos cultos e eventos desta semana.",
      },
      {
        key: "notify_text",
        label: "Texto do card de notificações",
        type: "textarea",
        default: "Quer receber lembretes dos próximos eventos?",
      },
      { key: "notify_button", label: "Botão de notificações", type: "text", default: "Ativar notificações" },
    ],
  },
  {
    page: "sermoes",
    title: "Sermões",
    fields: [
      { key: "kicker", label: "Pré-título", type: "text", default: "Palavra" },
      { key: "title", label: "Título", type: "text", default: "Sermões" },
      { key: "search_placeholder", label: "Placeholder da busca", type: "text", default: "Buscar mensagem ou pregador" },
      { key: "featured_title", label: "Título do sermão em destaque", type: "text", default: "A coragem que nasce do amor" },
      { key: "featured_meta", label: "Subtítulo do destaque", type: "text", default: "Pr. Pedro Costa • Culto da família" },
      { key: "featured_cover", label: "Capa do sermão em destaque", type: "image", default: "" },
    ],
  },
  {
    page: "celulas",
    title: "Células",
    fields: [
      { key: "kicker", label: "Pré-título", type: "text", default: "Comunhão" },
      { key: "title", label: "Título", type: "text", default: "Células" },
      {
        key: "subtitle",
        label: "Subtítulo",
        type: "textarea",
        default: "Pequenos grupos que se reúnem para crescer juntos em fé e amizade.",
      },
      { key: "cta", label: "Botão (todos os cards)", type: "text", default: "Quero participar" },
    ],
  },
  {
    page: "biblia",
    title: "Bíblia",
    fields: [
      { key: "kicker", label: "Pré-título", type: "text", default: "Leitura" },
      { key: "title", label: "Título", type: "text", default: "Bíblia Sagrada" },
      {
        key: "subtitle",
        label: "Subtítulo",
        type: "textarea",
        default: "Tradução João Ferreira de Almeida. Digite uma referência (ex.: João 3:16).",
      },
    ],
  },
  {
    page: "contribuir",
    title: "Contribuir",
    fields: [
      { key: "kicker", label: "Pré-título", type: "text", default: "Generosidade" },
      { key: "title", label: "Título", type: "text", default: "Dízimos & Ofertas" },
      {
        key: "subtitle",
        label: "Subtítulo",
        type: "textarea",
        default: "Sua contribuição transforma vidas e mantém a obra. Toda honra a Deus.",
      },
      { key: "pix_key_label", label: "Rótulo da chave Pix", type: "text", default: "Chave Pix" },
      { key: "pix_key", label: "Chave Pix", type: "text", default: "contato@igrejacoragemdeamar.com" },
    ],
  },
  {
    page: "contato",
    title: "Contato",
    fields: [
      { key: "kicker", label: "Pré-título", type: "text", default: "Fale conosco" },
      { key: "title", label: "Título", type: "text", default: "Contato" },
      {
        key: "subtitle",
        label: "Subtítulo",
        type: "textarea",
        default: "Envie sua mensagem, dúvida ou sugestão. Responderemos em breve.",
      },
      { key: "phone", label: "Telefone exibido", type: "text", default: "" },
      { key: "address", label: "Endereço exibido", type: "text", default: "" },
    ],
  },
  {
    page: "mais",
    title: "Mais / Rodapé",
    fields: [
      { key: "instagram_url", label: "URL do Instagram", type: "text", default: "#" },
      { key: "youtube_url", label: "URL do YouTube", type: "text", default: "#" },
      { key: "map_url", label: "URL do mapa", type: "text", default: "#" },
      { key: "footer", label: "Texto do rodapé", type: "text", default: "Igreja Coragem de Amar • v1.0" },
    ],
  },
  {
    page: "global",
    title: "Cabeçalho & marca",
    fields: [
      { key: "brand_kicker", label: "Pré-título da marca", type: "text", default: "Igreja" },
      { key: "brand_name", label: "Nome da igreja", type: "text", default: "Coragem de Amar" },
      { key: "brand_logo", label: "Logo no cabeçalho", type: "image", default: "" },
    ],
  },
];

export function getDefault(page: string, key: string): string {
  const p = contentRegistry.find((x) => x.page === page);
  return p?.fields.find((f) => f.key === key)?.default ?? "";
}
