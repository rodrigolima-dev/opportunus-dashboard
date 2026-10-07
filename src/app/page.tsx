import Link from "next/link";
import { DemoShell } from "@/components/demo-shell";
import { DonutChart } from "@/components/donut-chart";
import { MetricCard } from "@/components/metric-card";
import { TrendChart } from "@/components/trend-chart";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { resolveView, type DemoSearchParams } from "@/lib/selection";

export default async function Home({ searchParams }: { searchParams: DemoSearchParams }) {
  const view = await resolveView(searchParams);
  const paid = view.orders.filter((order) => order.status === "Pago");
  const aiPaid = paid.filter((order) => order.source === "IA");
  const aiValue = aiPaid.reduce((total, order) => total + order.value, 0);
  const paidValue = paid.reduce((total, order) => total + order.value, 0);
  const aiShare = paidValue > 0 ? aiValue / paidValue : 0;
  const stages = ["Novo", "Em contato", "Proposta", "Concluído"] as const;
  const url = (path: string) => `${path}?tenant=${view.tenant.id}&period=${view.period}`;

  return <DemoShell active="/" tenant={view.tenant} period={view.period} profile={view.profile} title="Painel da loja" description="Resumo comercial do período.">
    <section className="overview-banner">
      <div className="overview-hero-grid">
        <div className="overview-copy"><span className="eyebrow">Prioridade comercial</span><h2>{formatNumber(view.totals.leads)} novos leads entraram neste período</h2><p>Use o CRM para acompanhar oportunidades, pedidos pagos e pontos que precisam de atuação humana.</p><div className="hero-actions"><Link href={url("/crm")} className="button-primary">Abrir CRM</Link><Link href={url("/pedidos")} className="button-secondary">Ver pedidos</Link></div></div>
        <div className="overview-side-stack"><div className="overview-signal"><span>Conversas 100% IA</span><strong>{formatPercent(0.62)}</strong><small>Indicador inteiramente fictício</small></div></div>
      </div>
    </section>

    <section className="panel sales-composition-grid">
      <div className="sales-composition-main"><div className="section-header"><div><span className="eyebrow">Vendas por canal</span><h2>Vendas por canal</h2><p>Pedidos pagos de exemplo, sem ligação com loja ou pagamentos reais.</p></div></div><div className="metric-grid metric-grid-hero sales-composition-cards"><MetricCard label="Faturamento pago" value={formatCurrency(paidValue)} detail={`${formatNumber(paid.length)} pedidos pagos na amostra`} tone="green" /><MetricCard label="Vendas com IA" value={formatCurrency(aiValue)} detail={`${formatNumber(aiPaid.length)} pedidos na amostra`} tone="gold" /></div><p className="cost-footnote">Valores e atribuição simulados para esta demonstração.</p></div>
      <aside className="sales-composition-side"><DonutChart segments={[{ label: "IA atribuída", value: aiValue, color: "#a94c61", valueLabel: formatCurrency(aiValue) }, { label: "Site", value: paidValue - aiValue, color: "#caa04a", valueLabel: formatCurrency(paidValue - aiValue) }]} centerLabel="IA no faturamento" centerValue={formatPercent(aiShare)} ariaLabel="Composição fictícia de pedidos pagos" /><div className="sales-composition-facts"><div><span>Pedidos com IA</span><strong>{formatPercent(paid.length ? aiPaid.length / paid.length : 0)}</strong><small>{formatNumber(aiPaid.length)} de {formatNumber(paid.length)} pedidos pagos na amostra.</small></div><div><span>Base atualizada</span><strong>{formatNumber(paid.length)}</strong><small>Dados sintéticos locais.</small></div></div></aside>
    </section>

    <section className="panel stage-summary-panel"><div className="section-header"><div><span className="eyebrow">Jornada comercial</span><h2>Etapas do CRM</h2><p>Distribuição de contatos fictícios.</p></div><Link href={url("/crm")} className="section-link">Abrir CRM ↗</Link></div><div className="funnel-strip">{stages.map((stage) => <div className="funnel-stage" key={stage}><span>{stage}</span><strong>{formatNumber(view.leads.filter((lead) => lead.stage === stage).length)}</strong></div>)}</div></section>

    <section className="panel trend-panel"><div className="section-header"><div><span className="eyebrow">Evolução</span><h2>Movimento no período</h2><p>Volume diário de novos leads sintéticos.</p></div></div><TrendChart points={view.daily.map(({ day, leads }) => ({ day, value: leads }))} label="Novos leads por dia, dados fictícios" color={view.tenant.accent} /></section>
  </DemoShell>;
}
