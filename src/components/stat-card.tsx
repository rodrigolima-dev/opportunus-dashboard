import type { ReactNode } from "react";

export function StatCard({ label, value, detail, icon, tone = "rose" }: { label: string; value: string; detail: string; icon: ReactNode; tone?: "rose" | "gold" | "blue" | "green" }) {
  return <article className={`stat-card tone-${tone}`}><div className="stat-top"><span>{label}</span><span className="stat-icon" aria-hidden="true">{icon}</span></div><strong>{value}</strong><small>{detail}</small></article>;
}
