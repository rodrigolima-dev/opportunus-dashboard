import { notFound } from "next/navigation";
import { DemoShell } from "@/components/demo-shell";
import { StatCard } from "@/components/stat-card";
import { hasCapability } from "@/lib/access";
import { getExtraData } from "@/lib/demo-extra-data";
import { resolveView, type DemoSearchParams } from "@/lib/selection";

export default async function ProdutosPage({ searchParams }: { searchParams: DemoSearchParams }) {
  const view = await resolveView(searchParams);
  if (!hasCapability(view.profile, "admin:read")) notFound();
  const products = getExtraData(view.tenant.id).products;
  return <DemoShell active="/produtos" tenant={view.tenant} period={view.period} profile={view.profile} title="Produtos" description="Catálogo demonstrativo sem preços ou estoque real.">
    <div className="stats-grid three"><StatCard label="Itens na amostra" value={String(products.length)} detail="Catálogo sintético" icon="□" /><StatCard label="Disponíveis" value={String(products.filter((item) => item.available).length)} detail="Estado fictício" icon="✓" tone="green" /><StatCard label="Indisponíveis" value={String(products.filter((item) => !item.available).length)} detail="Estado fictício" icon="○" tone="gold" /></div>
    <section className="panel"><div className="panel-head"><div><span className="eyebrow">Catálogo</span><h2>Itens de exemplo</h2><p>Referências genéricas, sem integração com lojas.</p></div></div><div className="table-wrap"><table><thead><tr><th>Item</th><th>Categoria</th><th>Estado</th></tr></thead><tbody>{products.map((item) => <tr key={item.id}><td><strong>{item.name}</strong><small>{item.id}</small></td><td>{item.category}</td><td><span className={`table-status ${item.available ? "positive" : ""}`}>{item.available ? "Disponível" : "Indisponível"}</span></td></tr>)}</tbody></table></div></section>
  </DemoShell>;
}
