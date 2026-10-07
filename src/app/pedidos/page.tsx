import { DemoShell } from "@/components/demo-shell";
import { StatCard } from "@/components/stat-card";
import { formatCurrency, formatNumber } from "@/lib/format";
import { resolveView, type DemoSearchParams } from "@/lib/selection";
import { hasCapability } from "@/lib/access";
import { notFound } from "next/navigation";

export default async function Pedidos({ searchParams }: { searchParams: DemoSearchParams }) {
  const view = await resolveView(searchParams);
  if (!hasCapability(view.profile, "orders:read")) notFound();
  const paid = view.orders.filter((order) => order.status === "Pago");
  const paidValue = paid.reduce((total, order) => total + order.value, 0);
  return <DemoShell active="/pedidos" tenant={view.tenant} period={view.period} profile={view.profile} title="Pedidos" description="Exemplo de acompanhamento comercial com referências inteiramente inventadas.">
    <section className="stats-grid three"><StatCard label="Pedidos no período" value={formatNumber(view.totals.orders)} detail="Série ilustrativa" icon="▣" /><StatCard label="Pagos na amostra" value={formatNumber(paid.length)} detail="Lista fictícia abaixo" icon="✓" tone="green" /><StatCard label="Valor da amostra" value={formatCurrency(paidValue)} detail="Não representa receita real" icon="↗" tone="gold" /></section>
    <section className="panel"><div className="panel-head"><div><span className="eyebrow">ACOMPANHAMENTO</span><h2>Pedidos recentes</h2><p>A listagem exemplifica origem e estado, sem integração de checkout ou pagamento.</p></div><span className="panel-pill">Amostra sintética</span></div><div className="table-wrap"><table><thead><tr><th>Pedido</th><th>Empresa</th><th>Origem</th><th>Estado</th><th>Valor</th></tr></thead><tbody>{view.orders.map((order) => <tr key={order.id}><td><strong>{order.id}</strong></td><td>{order.company}</td><td>{order.source}</td><td><span className={`table-status ${order.status === "Pago" ? "positive" : ""}`}>{order.status}</span></td><td className="right">{formatCurrency(order.value)}</td></tr>)}</tbody></table></div></section>
    <section className="insight-strip"><span className="insight-icon">i</span><p><strong>Leitura do painel:</strong> números de cards e tabela têm escopos diferentes. Cards do período vêm da série diária fictícia; a tabela mostra uma amostra menor.</p></section>
  </DemoShell>;
}
