import Link from "next/link";

import { AnimatedNumber, type AnimatedNumberFormat } from "@/components/animated-number";

type MetricCardProps = {
  label: string;
  value: string;
  detail?: string;
  tone?: "pink" | "gold" | "green" | "graphite" | "paper";
  href?: string;
  numericValue?: number;
  valueFormat?: AnimatedNumberFormat;
  animationDelay?: number;
};

export function MetricCard({
  label,
  value,
  detail,
  tone = "paper",
  href,
  numericValue,
  valueFormat = "number",
  animationDelay = 0
}: MetricCardProps) {
  const content = (
    <>
      <span className="metric-label">{label}</span>
      <strong>
        {typeof numericValue === "number" && Number.isFinite(numericValue) ? (
          <AnimatedNumber value={numericValue} format={valueFormat} delay={animationDelay} />
        ) : value}
      </strong>
      {detail ? <small>{detail}</small> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`metric-card metric-${tone} metric-card-link`}>
        {content}
      </Link>
    );
  }

  return <article className={`metric-card metric-${tone}`}>{content}</article>;
}
