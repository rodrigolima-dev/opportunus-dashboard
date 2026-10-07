import { formatCurrency } from "@/lib/format";
import type { Lead, Stage } from "@/lib/demo-data";

const stages: Stage[] = ["Novo", "Em contato", "Proposta", "Concluído"];

export function DemoKanbanBoard({ leads }: { leads: readonly Lead[] }) {
  return <div className="demo-kanban" aria-label="Quadro de oportunidades fictícias">
    {stages.map((stage) => {
      const cards = leads.filter((lead) => lead.stage === stage);
      return <section className="demo-kanban-column" aria-label={stage} key={stage}>
        <header><div><span className="demo-kanban-marker" /><h3>{stage}</h3></div><strong>{cards.length}</strong></header>
        <div className="demo-kanban-cards">{cards.map((lead) => <article className="demo-kanban-card" key={lead.id}><span>{lead.id}</span><h4>{lead.company}</h4><p>{lead.channel}</p><strong>{formatCurrency(lead.value)}</strong></article>)}</div>
      </section>;
    })}
  </div>;
}
