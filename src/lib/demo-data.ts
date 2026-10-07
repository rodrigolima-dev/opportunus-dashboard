export type TenantId = "aurora" | "horizonte";
export type Period = "7d" | "30d";
export type Stage = "Novo" | "Em contato" | "Proposta" | "Concluído";

export type DailyPoint = {
  day: string;
  leads: number;
  orders: number;
  revenue: number;
  inbound: number;
  outbound: number;
};

export type Lead = { id: string; company: string; stage: Stage; value: number; channel: string };
export type Order = { id: string; company: string; value: number; source: "IA" | "Site"; status: "Pago" | "Em análise" };

type Fixture = {
  id: TenantId;
  name: string;
  description: string;
  accent: string;
  seed: number;
  leads: Lead[];
  orders: Order[];
};

const fixtures: Record<TenantId, Fixture> = {
  aurora: {
    id: "aurora",
    name: "Projeto Aurora",
    description: "Loja fictícia de artigos para casa",
    accent: "#a94c61",
    seed: 11,
    leads: [
      { id: "A-L01", company: "Empresa A-01", stage: "Novo", value: 320, channel: "Site" },
      { id: "A-L02", company: "Empresa A-02", stage: "Em contato", value: 780, channel: "IA" },
      { id: "A-L03", company: "Empresa A-03", stage: "Proposta", value: 1250, channel: "IA" },
      { id: "A-L04", company: "Empresa A-04", stage: "Concluído", value: 540, channel: "Site" },
      { id: "A-L05", company: "Empresa A-05", stage: "Em contato", value: 910, channel: "Site" }
    ],
    orders: [
      { id: "A-P001", company: "Empresa A-04", value: 540, source: "Site", status: "Pago" },
      { id: "A-P002", company: "Empresa A-03", value: 1250, source: "IA", status: "Em análise" },
      { id: "A-P003", company: "Empresa A-06", value: 690, source: "IA", status: "Pago" },
      { id: "A-P004", company: "Empresa A-07", value: 420, source: "Site", status: "Pago" }
    ]
  },
  horizonte: {
    id: "horizonte",
    name: "Projeto Horizonte",
    description: "Distribuidora fictícia de materiais",
    accent: "#476d88",
    seed: 29,
    leads: [
      { id: "H-L01", company: "Empresa H-01", stage: "Proposta", value: 890, channel: "IA" },
      { id: "H-L02", company: "Empresa H-02", stage: "Novo", value: 460, channel: "Site" },
      { id: "H-L03", company: "Empresa H-03", stage: "Em contato", value: 1120, channel: "Site" },
      { id: "H-L04", company: "Empresa H-04", stage: "Concluído", value: 740, channel: "IA" },
      { id: "H-L05", company: "Empresa H-05", stage: "Novo", value: 310, channel: "IA" }
    ],
    orders: [
      { id: "H-P001", company: "Empresa H-04", value: 740, source: "IA", status: "Pago" },
      { id: "H-P002", company: "Empresa H-06", value: 980, source: "Site", status: "Pago" },
      { id: "H-P003", company: "Empresa H-07", value: 630, source: "IA", status: "Em análise" },
      { id: "H-P004", company: "Empresa H-08", value: 1180, source: "Site", status: "Pago" }
    ]
  }
};

function dailySeries(seed: number): DailyPoint[] {
  return Array.from({ length: 30 }, (_, index) => {
    const day = new Date(Date.UTC(2026, 8, index + 1)).toISOString().slice(0, 10);
    const leads = 8 + ((index * 7 + seed) % 13);
    const orders = 2 + ((index * 3 + seed) % 6);
    return {
      day,
      leads,
      orders,
      revenue: orders * (150 + ((index * 29 + seed) % 210)),
      inbound: leads * 3 + ((index + seed) % 8),
      outbound: leads * 2 + ((index * 2 + seed) % 7)
    };
  });
}

export function getDemoView(tenantInput: unknown = "aurora", periodInput: unknown = "7d") {
  if (tenantInput !== "aurora" && tenantInput !== "horizonte") {
    throw new RangeError("Empresa de demonstração desconhecida");
  }
  if (periodInput !== "7d" && periodInput !== "30d") {
    throw new RangeError("Período de demonstração desconhecido");
  }

  const fixture = fixtures[tenantInput];
  const period = periodInput as Period;
  const daily = dailySeries(fixture.seed).slice(period === "7d" ? -7 : -30);
  const totals = daily.reduce((sum, point) => ({
    leads: sum.leads + point.leads,
    orders: sum.orders + point.orders,
    revenue: sum.revenue + point.revenue,
    inbound: sum.inbound + point.inbound,
    outbound: sum.outbound + point.outbound
  }), { leads: 0, orders: 0, revenue: 0, inbound: 0, outbound: 0 });

  return {
    tenant: { id: fixture.id, name: fixture.name, description: fixture.description, accent: fixture.accent },
    period,
    daily,
    totals,
    conversion: totals.leads === 0 ? 0 : totals.orders / totals.leads,
    leads: fixture.leads.map((lead) => ({ ...lead })),
    orders: fixture.orders.map((order) => ({ ...order }))
  };
}

export function getTenantOptions() {
  return Object.values(fixtures).map(({ id, name }) => ({ id, name }));
}
