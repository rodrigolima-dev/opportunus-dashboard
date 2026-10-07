"use client";

import { useEffect, useRef, useState } from "react";

import { formatCurrency, formatCurrencyUsd, formatNumber, formatPercent } from "@/lib/format";

export type AnimatedNumberFormat = "number" | "currency-brl" | "currency-usd" | "percent";

type AnimatedNumberProps = {
  value: number;
  format?: AnimatedNumberFormat;
  duration?: number;
  delay?: number;
  className?: string;
};

function formatAnimatedValue(value: number, format: AnimatedNumberFormat) {
  if (format === "currency-brl") return formatCurrency(value);
  if (format === "currency-usd") return formatCurrencyUsd(value);
  if (format === "percent") return formatPercent(value / 100);
  return formatNumber(value);
}

export function AnimatedNumber({
  value,
  format = "number",
  duration = 650,
  delay = 0,
  className
}: AnimatedNumberProps) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const [displayedValue, setDisplayedValue] = useState(0);
  const displayedValueRef = useRef(0);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const startValue = hasAnimatedRef.current ? displayedValueRef.current : 0;
    hasAnimatedRef.current = true;

    if (prefersReducedMotion || duration <= 0 || document.visibilityState === "hidden") {
      displayedValueRef.current = safeValue;
      setDisplayedValue(safeValue);
      return;
    }

    let animationFrame = 0;
    let delayTimer = 0;

    const startAnimation = () => {
      const startedAt = performance.now();

      const animate = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const nextValue = startValue + (safeValue - startValue) * easedProgress;

        displayedValueRef.current = nextValue;
        setDisplayedValue(nextValue);

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(animate);
        }
      };

      animationFrame = window.requestAnimationFrame(animate);
    };

    delayTimer = window.setTimeout(startAnimation, Math.max(0, delay));

    return () => {
      window.clearTimeout(delayTimer);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [delay, duration, safeValue]);

  const finalValue = formatAnimatedValue(safeValue, format);

  return (
    <span className={["animated-number", className].filter(Boolean).join(" ")} aria-label={finalValue}>
      <span aria-hidden="true">{formatAnimatedValue(displayedValue, format)}</span>
    </span>
  );
}
