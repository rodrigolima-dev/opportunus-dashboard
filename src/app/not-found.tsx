import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><span className="brand-mark">O</span><h1>Seleção indisponível</h1><p>Escolha uma das empresas fictícias e um período válido.</p><Link className="button-primary" href="/">Voltar à visão geral</Link></main>;
}
