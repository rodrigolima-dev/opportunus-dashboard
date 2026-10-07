import { DemoShell } from "@/components/demo-shell";
import { StatCard } from "@/components/stat-card";
import { TrendChart } from "@/components/trend-chart";
import { formatNumber, formatPercent } from "@/lib/format";
import { resolveView, type DemoSearchParams } from "@/lib/selection";
import { hasCapability } from "@/lib/access";
import { notFound } from "next/navigation";

export default async function Operacao({ searchParams }: { searchParams: DemoSearchParams }) {
  const view = await resolveView(searchParams);
  if (!hasCapability(view.profile, "admin:read")) notFound();
  const ratio = view.totals.inbound === 0 ? 0 : view.totals.outbound / view.totals.inbound;
  const peak = view.daily.reduce((best, day) => day.inbound > best.inbound ? day : best, view.daily[0]);

  return <DemoShell active="/operacao" tenant={view.tenant} period={view.period} profile={view.profile} title="Operação" description="Visualização do volume de atendimento em uma série inteiramente sintética.">
    <section className="stats-grid three"><StatCard label="Mensagens recebidas" value={formatNumber(view.totals.inbound)} detail="Entradas fictícias no período" icon="↓" /><StatCard label="Respostas enviadas" value={formatNumber(view.totals.outbound)} detail="Saídas fictícias no período" icon="↑" tone="blue" /><StatCard label="Relação respostas/entradas" value={formatPercent(ratio)} detail="Não indica resolução" icon="◷" tone="gold" /></section>
    <div className="content-grid operation-grid"><section className="panel chart-panel"><div className="panel-head"><div><span className="eyebrow">RITMO</span><h2>Entradas por dia</h2><p>Volume diário de exemplo.</p></div><span className="panel-pill">{view.period === "7d" ? "7 dias" : "30 dias"}</span></div><TrendChart points={view.daily.map(({ day, inbound }) => ({ day, value: inbound }))} label="Mensagens recebidas por dia, dados fictícios" color={view.tenant.accent} /></section><section className="panel side-insight"><span className="eyebrow">LEITURA RÁPIDA</span><h2>Pico de movimento</h2><strong>{formatNumber(peak.inbound)}</strong><p>mensagens fictícias no dia de maior volume do período.</p><div className="divider" /><span className="eyebrow">CONTEXTO</span><p>Os indicadores deste painel são calculados somente para a empresa selecionada.</p></section></div>
    <section className="insight-strip"><span className="insight-icon">i</span><p><strong>Sobre esta visualização:</strong> ela demonstra apresentação e separação de dados. Não envia mensagens nem consulta canais reais.</p></section>
  </DemoShell>;
}
