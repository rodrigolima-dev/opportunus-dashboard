import { DemoShell } from "@/components/demo-shell";
import { DemoKanbanBoard } from "@/components/demo-kanban-board";
import { StatCard } from "@/components/stat-card";
import { formatCurrency, formatNumber } from "@/lib/format";
import { resolveView, type DemoSearchParams } from "@/lib/selection";
import { hasCapability } from "@/lib/access";
import { notFound } from "next/navigation";

export default async function Crm({ searchParams }: { searchParams: DemoSearchParams }) {
  const view = await resolveView(searchParams);
  if (!hasCapability(view.profile, "crm:manage")) notFound();
  const open = view.leads.filter((lead) => lead.stage !== "Concluído");
  const pipeline = open.reduce((total, lead) => total + lead.value, 0);

  return <DemoShell active="/crm" tenant={view.tenant} period={view.period} profile={view.profile} title="CRM e oportunidades" description="Acompanhe a jornada de contatos fictícios por etapa e canal.">
    <section className="stats-grid three"><StatCard label="No funil" value={formatNumber(open.length)} detail="Registros fictícios em aberto" icon="◎" /><StatCard label="Valor em aberto" value={formatCurrency(pipeline)} detail="Projeção ilustrativa" icon="↗" tone="gold" /><StatCard label="Concluídos" value={formatNumber(view.leads.length - open.length)} detail="Amostra de demonstração" icon="✓" tone="green" /></section>
    <section className="panel"><div className="panel-head"><div><span className="eyebrow">FUNIL</span><h2>Etapas do relacionamento</h2><p>Quadro somente leitura com contatos inteiramente fictícios.</p></div></div><DemoKanbanBoard leads={view.leads} /></section>
    <section className="panel"><div className="panel-head"><div><span className="eyebrow">CONTATOS</span><h2>Lista de oportunidades</h2></div><span className="panel-pill">Somente dados fictícios</span></div><div className="table-wrap"><table><thead><tr><th>Identificação</th><th>Canal</th><th>Etapa</th><th>Valor ilustrativo</th></tr></thead><tbody>{view.leads.map((lead) => <tr key={lead.id}><td><strong>{lead.company}</strong><small>{lead.id}</small></td><td>{lead.channel}</td><td><span className={`table-status ${lead.stage === "Concluído" ? "positive" : ""}`}>{lead.stage}</span></td><td className="right">{formatCurrency(lead.value)}</td></tr>)}</tbody></table></div></section>
  </DemoShell>;
}
