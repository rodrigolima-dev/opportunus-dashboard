import { DemoShell } from "@/components/demo-shell";
import { StatCard } from "@/components/stat-card";
import { formatCurrency, formatNumber } from "@/lib/format";
import { resolveView, type DemoSearchParams } from "@/lib/selection";
import type { Stage } from "@/lib/demo-data";
import { hasCapability } from "@/lib/access";
import { notFound } from "next/navigation";

const stages: Stage[] = ["Novo", "Em contato", "Proposta", "Concluído"];

export default async function Crm({ searchParams }: { searchParams: DemoSearchParams }) {
  const view = await resolveView(searchParams);
  if (!hasCapability(view.profile, "crm:manage")) notFound();
  const open = view.leads.filter((lead) => lead.stage !== "Concluído");
  const pipeline = open.reduce((total, lead) => total + lead.value, 0);

  return <DemoShell active="/crm" tenant={view.tenant} period={view.period} profile={view.profile} title="CRM e oportunidades" description="Acompanhe a jornada de contatos fictícios por etapa e canal.">
    <section className="stats-grid three"><StatCard label="No funil" value={formatNumber(open.length)} detail="Registros fictícios em aberto" icon="◎" /><StatCard label="Valor em aberto" value={formatCurrency(pipeline)} detail="Projeção ilustrativa" icon="↗" tone="gold" /><StatCard label="Concluídos" value={formatNumber(view.leads.length - open.length)} detail="Amostra de demonstração" icon="✓" tone="green" /></section>
    <section className="panel"><div className="panel-head"><div><span className="eyebrow">FUNIL</span><h2>Etapas do relacionamento</h2><p>Cada empresa fictícia mantém registros próprios.</p></div></div><div className="stage-grid">{stages.map((stage, index) => { const count = view.leads.filter((lead) => lead.stage === stage).length; return <div className="stage-card" key={stage}><span className={`stage-number stage-${index}`}>0{index + 1}</span><strong>{stage}</strong><b>{count}</b><small>{count === 1 ? "oportunidade" : "oportunidades"}</small></div>; })}</div></section>
    <section className="panel"><div className="panel-head"><div><span className="eyebrow">CONTATOS</span><h2>Lista de oportunidades</h2></div><span className="panel-pill">Somente dados fictícios</span></div><div className="table-wrap"><table><thead><tr><th>Identificação</th><th>Canal</th><th>Etapa</th><th>Valor ilustrativo</th></tr></thead><tbody>{view.leads.map((lead) => <tr key={lead.id}><td><strong>{lead.company}</strong><small>{lead.id}</small></td><td>{lead.channel}</td><td><span className={`table-status ${lead.stage === "Concluído" ? "positive" : ""}`}>{lead.stage}</span></td><td className="right">{formatCurrency(lead.value)}</td></tr>)}</tbody></table></div></section>
  </DemoShell>;
}
