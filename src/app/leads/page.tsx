import { notFound } from "next/navigation";
import { DemoShell } from "@/components/demo-shell";
import { StatCard } from "@/components/stat-card";
import { hasCapability } from "@/lib/access";
import { formatCurrency, formatNumber } from "@/lib/format";
import { resolveView, type DemoSearchParams } from "@/lib/selection";

export default async function LeadsPage({ searchParams }: { searchParams: DemoSearchParams }) {
  const view = await resolveView(searchParams);
  if (!hasCapability(view.profile, "leads:read")) notFound();
  const active = view.leads.filter((lead) => lead.stage !== "Concluído");
  return <DemoShell active="/leads" tenant={view.tenant} period={view.period} profile={view.profile} title="Leads" description="Contatos e andamento de uma empresa fictícia.">
    <div className="stats-grid three"><StatCard label="Novos no período" value={formatNumber(view.totals.leads)} detail="Série ilustrativa" icon="↗" /><StatCard label="Na amostra" value={formatNumber(view.leads.length)} detail="Contatos inventados" icon="◎" tone="blue" /><StatCard label="Em andamento" value={formatNumber(active.length)} detail="Amostra fictícia" icon="◷" tone="green" /></div>
    <section className="panel"><div className="panel-head"><div><span className="eyebrow">Relacionamento</span><h2>Contatos recentes</h2><p>Identificadores e valores são apenas exemplos.</p></div></div><div className="table-wrap"><table><thead><tr><th>Contato</th><th>Canal</th><th>Etapa</th><th>Valor ilustrativo</th></tr></thead><tbody>{view.leads.map((lead) => <tr key={lead.id}><td><strong>{lead.company}</strong><small>{lead.id}</small></td><td>{lead.channel}</td><td>{lead.stage}</td><td className="right">{formatCurrency(lead.value)}</td></tr>)}</tbody></table></div></section>
  </DemoShell>;
}
