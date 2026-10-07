import { notFound } from "next/navigation";
import { DemoShell } from "@/components/demo-shell";
import { StatCard } from "@/components/stat-card";
import { hasCapability } from "@/lib/access";
import { formatCurrency } from "@/lib/format";
import { resolveView, type DemoSearchParams } from "@/lib/selection";

export default async function HistoricoPage({ searchParams }: { searchParams: DemoSearchParams }) {
  const view = await resolveView(searchParams);
  if (!hasCapability(view.profile, "admin:read")) notFound();
  const paid = view.orders.filter((order) => order.status === "Pago");
  const revenue = paid.reduce((sum, order) => sum + order.value, 0);
  return <DemoShell active="/historico" tenant={view.tenant} period={view.period} profile={view.profile} title="Histórico comercial" description="Pedidos pagos de uma amostra sintética.">
    <div className="stats-grid three"><StatCard label="Pedidos pagos" value={String(paid.length)} detail="Amostra fictícia" icon="✓" tone="green" /><StatCard label="Valor da amostra" value={formatCurrency(revenue)} detail="Sem conciliação real" icon="↗" tone="gold" /><StatCard label="Atribuídos à IA" value={String(paid.filter((order) => order.source === "IA").length)} detail="Classificação de exemplo" icon="◎" /></div>
    <section className="panel"><div className="panel-head"><div><span className="eyebrow">Registros</span><h2>Pagamentos ilustrativos</h2><p>Os estados abaixo não representam transações reais.</p></div></div><div className="table-wrap"><table><thead><tr><th>Pedido</th><th>Empresa</th><th>Origem</th><th>Valor</th></tr></thead><tbody>{paid.map((order) => <tr key={order.id}><td><strong>{order.id}</strong></td><td>{order.company}</td><td>{order.source}</td><td className="right">{formatCurrency(order.value)}</td></tr>)}</tbody></table></div></section>
  </DemoShell>;
}
