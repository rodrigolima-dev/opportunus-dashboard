import { notFound } from "next/navigation";
import { DemoShell } from "@/components/demo-shell";
import { StatCard } from "@/components/stat-card";
import { hasCapability } from "@/lib/access";
import { getExtraData } from "@/lib/demo-extra-data";
import { resolveView, type DemoSearchParams } from "@/lib/selection";

export default async function CampanhasPage({ searchParams }: { searchParams: DemoSearchParams }) {
  const view = await resolveView(searchParams);
  if (!hasCapability(view.profile, "admin:read")) notFound();
  const campaigns = getExtraData(view.tenant.id).campaigns;
  return <DemoShell active="/campanhas" tenant={view.tenant} period={view.period} profile={view.profile} title="Campanhas" description="Planejamento ilustrativo sem integração de envio.">
    <div className="stats-grid three"><StatCard label="Ações na amostra" value={String(campaigns.length)} detail="Todas fictícias" icon="◌" /><StatCard label="Rascunhos" value={String(campaigns.filter((item) => item.status === "Rascunho").length)} detail="Sem agendamento" icon="○" tone="gold" /><StatCard label="Concluídas" value={String(campaigns.filter((item) => item.status === "Concluída").length)} detail="Histórico ilustrativo" icon="✓" tone="green" /></div>
    <section className="panel"><div className="panel-head"><div><span className="eyebrow">Ações</span><h2>Visão de campanhas</h2><p>Nenhum público, regra comercial ou destinatário real foi incluído.</p></div></div><div className="table-wrap"><table><thead><tr><th>Campanha</th><th>Canal</th><th>Estado</th></tr></thead><tbody>{campaigns.map((item) => <tr key={item.id}><td><strong>{item.name}</strong><small>{item.id}</small></td><td>{item.channel}</td><td><span className="table-status">{item.status}</span></td></tr>)}</tbody></table></div></section>
  </DemoShell>;
}
