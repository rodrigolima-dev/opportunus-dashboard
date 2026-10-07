import { requireClientAccess } from "@/lib/client-context";

export default async function ClientesPage() {
  const session = await requireClientAccess();
  return <main className="client-page"><div className="client-page-head"><span className="eyebrow">Empresas fictícias</span><h1>Selecione uma empresa</h1><p>O painel e as APIs usam somente a empresa ativa na sessão.</p></div><div className="client-cards">{session.clients.map((client) => <form key={client.id} method="post" action="/api/auth/select-client" className="client-card"><input type="hidden" name="clientId" value={client.id} /><span className="eyebrow">Empresa de exemplo</span><h2>{client.name}</h2><p>{client.id === session.client.id ? "Ativa nesta sessão" : "Disponível para este perfil"}</p><button className="button-primary" type="submit">{client.id === session.client.id ? "Abrir painel" : "Selecionar"}</button></form>)}</div></main>;
}
