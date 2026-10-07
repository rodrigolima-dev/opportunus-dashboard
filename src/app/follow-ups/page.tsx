import { notFound } from "next/navigation";
import { DemoShell } from "@/components/demo-shell";
import { StatCard } from "@/components/stat-card";
import { hasCapability } from "@/lib/access";
import { getExtraData } from "@/lib/demo-extra-data";
import { resolveView, type DemoSearchParams } from "@/lib/selection";

export default async function FollowUpsPage({ searchParams }: { searchParams: DemoSearchParams }) {
  const view = await resolveView(searchParams);
  if (!hasCapability(view.profile, "admin:read")) notFound();
  const items = getExtraData(view.tenant.id).followups;
  return <DemoShell active="/follow-ups" tenant={view.tenant} period={view.period} profile={view.profile} title="Disparos" description="Fila ilustrativa, sem envio de mensagens.">
    <div className="stats-grid three"><StatCard label="Itens da amostra" value={String(items.length)} detail="Registros fictícios" icon="◷" /><StatCard label="Pendentes" value={String(items.filter((item) => item.status === "Pendente").length)} detail="Nenhuma ação é executada" icon="○" tone="gold" /><StatCard label="Concluídos" value={String(items.filter((item) => item.status === "Concluído").length)} detail="Estado de exemplo" icon="✓" tone="green" /></div>
    <section className="panel"><div className="panel-head"><div><span className="eyebrow">Fila de exemplo</span><h2>Histórico de disparos</h2><p>A tela não possui ação de envio ou reprocessamento.</p></div></div><div className="table-wrap"><table><thead><tr><th>Referência</th><th>Assunto</th><th>Estado</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><strong>{item.id}</strong></td><td>{item.subject}</td><td><span className="table-status">{item.status}</span></td></tr>)}</tbody></table></div></section>
  </DemoShell>;
}
