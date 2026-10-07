"use client";

import Link from "next/link";
import { useState, type CSSProperties, type ReactNode } from "react";
import { AppIcon, type AppIconName } from "@/components/app-icon";
import { hasCapability, type Capability, type DemoProfile } from "@/lib/access";
import { getTenantOptions, type Period, type TenantId } from "@/lib/demo-data";

const navigation: { href: string; label: string; icon: AppIconName; capability: Capability }[] = [
  { href: "/", label: "Painel da loja", icon: "home", capability: "dashboard:read" },
  { href: "/leads", label: "Leads", icon: "users", capability: "leads:read" },
  { href: "/crm", label: "CRM", icon: "columns", capability: "crm:manage" },
  { href: "/pedidos", label: "Pedidos", icon: "receipt", capability: "orders:read" },
  { href: "/follow-ups", label: "Disparos", icon: "bell", capability: "admin:read" },
  { href: "/campanhas", label: "Campanhas", icon: "megaphone", capability: "admin:read" },
  { href: "/produtos", label: "Produtos", icon: "package", capability: "admin:read" },
  { href: "/historico", label: "Histórico comercial", icon: "chart", capability: "admin:read" },
  { href: "/operacao", label: "Operação", icon: "sparkles", capability: "admin:read" }
];

function target(path: string, tenant: TenantId, period: Period) {
  return `${path}?tenant=${tenant}&period=${period}`;
}

export function DemoShell({ active, tenant, period, profile, title, description, children }: {
  active: string;
  tenant: { id: TenantId; name: string; description: string; accent: string };
  period: Period;
  profile: DemoProfile;
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`app-shell${expanded ? " sidebar-expanded" : ""}`} style={{ "--accent": tenant.accent } as CSSProperties}>
      {expanded && <button className="sidebar-scrim" type="button" aria-label="Fechar menu" onClick={() => setExpanded(false)} />}
      <aside className="sidebar" aria-label="Menu principal">
        <Link className="brand" href={target("/", tenant.id, period)} aria-label="Painel da loja" onClick={() => setExpanded(true)}>
          <span className="brand-mark" aria-hidden="true">O</span>
          <span>Opportunus<small>Dashboard</small></span>
        </Link>
        <nav className="nav-list" aria-label="Navegação principal">
          {navigation.filter((item) => hasCapability(profile, item.capability)).map((item) => (
            <Link key={item.href} href={target(item.href, tenant.id, period)} className={active === item.href ? "is-active" : ""} aria-current={active === item.href ? "page" : undefined} aria-label={item.label} title={expanded ? undefined : item.label} onClick={() => setExpanded(true)}>
              <AppIcon name={item.icon} /><span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-note"><span className="demo-mark" title="Dados fictícios">D</span><span className="sidebar-note-label">{profile.label}</span></div>
      </aside>
      <main className="main-surface">
        <div className="page-stack">
          <header className="data-page-header">
            <div><span className="eyebrow">Painel da {tenant.name}</span><h1>{active === "/" ? "Olá, equipe" : title}</h1><p>{active === "/" ? `Leads, vendas e atendimento da ${tenant.name} consolidados para o período selecionado.` : description}</p></div>
            <div className="data-page-header-side">
              <div className="session-actions"><span className="demo-indicator">Dados de demonstração · {profile.label}</span><Link href="/clientes">Empresas</Link><form method="post" action="/api/auth/logout"><button type="submit">Sair</button></form></div>
              <div className="demo-controls">
                <div className="control-group" aria-label="Empresa fictícia"><span>Empresa</span>{getTenantOptions().filter((option) => profile.tenants.includes(option.id)).map((option) => <form key={option.id} method="post" action="/api/auth/select-client"><input type="hidden" name="clientId" value={option.id} /><button type="submit" className={tenant.id === option.id ? "selected" : ""}>{option.name}</button></form>)}</div>
                <div className="control-group" aria-label="Período"><span>Período</span><Link href={target(active, tenant.id, "7d")} className={period === "7d" ? "selected" : ""}>7 dias</Link><Link href={target(active, tenant.id, "30d")} className={period === "30d" ? "selected" : ""}>30 dias</Link></div>
              </div>
            </div>
          </header>
          {children}
          <footer className="footer">OpportunusAI Dashboard · dados inteiramente fictícios</footer>
        </div>
      </main>
    </div>
  );
}
