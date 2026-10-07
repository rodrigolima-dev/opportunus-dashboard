import type { TenantId } from "./demo-data";

export function getExtraData(tenant: TenantId) {
  if (tenant !== "aurora" && tenant !== "horizonte") throw new RangeError("Unknown demo tenant");
  const prefix = tenant === "aurora" ? "A" : "H";
  return {
    products: [
      { id: `${prefix}-I01`, name: `Item ${prefix}-01`, category: "Coleção 01", available: true },
      { id: `${prefix}-I02`, name: `Item ${prefix}-02`, category: "Coleção 02", available: true },
      { id: `${prefix}-I03`, name: `Item ${prefix}-03`, category: "Coleção 01", available: false }
    ],
    campaigns: [
      { id: `${prefix}-C01`, name: `Ação ${prefix}-01`, channel: "E-mail", status: "Rascunho" },
      { id: `${prefix}-C02`, name: `Ação ${prefix}-02`, channel: "Mensagem", status: "Concluída" }
    ],
    followups: [
      { id: `${prefix}-F01`, subject: `Contato ${prefix}-01`, status: "Pendente" },
      { id: `${prefix}-F02`, subject: `Contato ${prefix}-02`, status: "Concluído" }
    ]
  };
}
