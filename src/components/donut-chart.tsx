"use client";

import type { ReactNode } from "react";

export type DonutSegment = {
  label: string;
  value: number;
  color: string;
  valueLabel?: string;
};

type DonutChartProps = {
  segments: DonutSegment[];
  centerLabel?: string;
  centerValue?: ReactNode;
  ariaLabel?: string;
};

const SIZE = 220;
const STROKE = 22;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function DonutChart({
  segments,
  centerLabel,
  centerValue,
  ariaLabel = "Distribuição"
}: DonutChartProps) {
  const safeSegments = segments.filter((segment) => segment.value > 0);
  const total = safeSegments.reduce((sum, segment) => sum + segment.value, 0);

  if (!total) {
    return <p className="empty-state">Sem dados suficientes para a distribuição.</p>;
  }

  let progress = 0;

  return (
    <div className="donut-chart" role="img" aria-label={ariaLabel}>
      <div className="donut-chart-visual">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <circle
            className="donut-chart-track"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            pathLength={100}
          />
          <g className="donut-chart-arcs">
            {safeSegments.map((segment) => {
              const length = (segment.value / total) * 100;
              const dashArray = `${length} ${100 - length}`;
              const dashOffset = -progress;

              progress += length;

              return (
                <circle
                  key={segment.label}
                  className="donut-chart-ring"
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  pathLength={100}
                  style={{ stroke: segment.color }}
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                />
              );
            })}
          </g>
        </svg>
        {(centerLabel || centerValue) ? (
          <div className="donut-chart-center">
            {centerLabel ? <span>{centerLabel}</span> : null}
            {centerValue ? <strong>{centerValue}</strong> : null}
          </div>
        ) : null}
      </div>

      <div className="donut-chart-legend">
        {segments.map((segment) => {
          const ratio = total > 0 ? (segment.value / total) * 100 : 0;
          return (
            <div key={segment.label} className="donut-chart-legend-row">
              <span className="donut-chart-legend-label">
                <i style={{ background: segment.color }} />
                {segment.label}
              </span>
              <span className="donut-chart-legend-value">
                {segment.valueLabel ?? `${ratio.toFixed(0)}%`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
