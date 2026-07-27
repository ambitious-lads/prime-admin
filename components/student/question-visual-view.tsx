"use client";

import Image from "next/image";
import { useId } from "react";
import type {
  CoordinatePoint,
  QuestionVisual,
} from "@/lib/api/types";

type CoordinateGraphVisual = Extract<
  QuestionVisual,
  { type: "coordinate_graph" }
>;

function uniquePoints(points: CoordinatePoint[]) {
  const seen = new Set<string>();
  return points.filter((point) => {
    const key = `${point.x.toFixed(6)},${point.y.toFixed(6)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getLineBounds(
  graph: CoordinateGraphVisual,
  first: CoordinatePoint,
  second: CoordinatePoint,
) {
  const candidates: CoordinatePoint[] = [];
  const dx = second.x - first.x;
  const dy = second.y - first.y;

  if (Math.abs(dx) < 1e-9) {
    if (first.x >= graph.xMin && first.x <= graph.xMax) {
      candidates.push(
        { x: first.x, y: graph.yMin },
        { x: first.x, y: graph.yMax },
      );
    }
    return candidates;
  }

  const slope = dy / dx;
  const yAtXMin = first.y + slope * (graph.xMin - first.x);
  const yAtXMax = first.y + slope * (graph.xMax - first.x);
  if (yAtXMin >= graph.yMin && yAtXMin <= graph.yMax) {
    candidates.push({ x: graph.xMin, y: yAtXMin });
  }
  if (yAtXMax >= graph.yMin && yAtXMax <= graph.yMax) {
    candidates.push({ x: graph.xMax, y: yAtXMax });
  }

  if (Math.abs(dy) >= 1e-9) {
    const xAtYMin = first.x + (graph.yMin - first.y) / slope;
    const xAtYMax = first.x + (graph.yMax - first.y) / slope;
    if (xAtYMin >= graph.xMin && xAtYMin <= graph.xMax) {
      candidates.push({ x: xAtYMin, y: graph.yMin });
    }
    if (xAtYMax >= graph.xMin && xAtYMax <= graph.xMax) {
      candidates.push({ x: xAtYMax, y: graph.yMax });
    }
  }

  return uniquePoints(candidates).slice(0, 2);
}

function CoordinateGraph({ visual }: { visual: CoordinateGraphVisual }) {
  const clipId = useId();
  const size = 420;
  const padding = 22;
  const graphSize = size - padding * 2;
  const xSpan = visual.xMax - visual.xMin || 1;
  const ySpan = visual.yMax - visual.yMin || 1;
  const toCanvas = (point: CoordinatePoint) => ({
    x: padding + ((point.x - visual.xMin) / xSpan) * graphSize,
    y: padding + ((visual.yMax - point.y) / ySpan) * graphSize,
  });
  const xTicks = Array.from(
    { length: Math.max(0, Math.floor(visual.xMax) - Math.ceil(visual.xMin) + 1) },
    (_, index) => Math.ceil(visual.xMin) + index,
  );
  const yTicks = Array.from(
    { length: Math.max(0, Math.floor(visual.yMax) - Math.ceil(visual.yMin) + 1) },
    (_, index) => Math.ceil(visual.yMin) + index,
  );

  return (
    <figure className="mx-auto w-full max-w-[420px] space-y-2">
      {visual.title ? (
        <figcaption className="text-center text-xs font-bold uppercase text-muted">
          {visual.title}
        </figcaption>
      ) : null}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={visual.title ?? "Coordinate graph"}
        className="aspect-square w-full rounded-lg border border-line bg-white"
      >
        <defs>
          <clipPath id={clipId}>
            <rect
              x={padding}
              y={padding}
              width={graphSize}
              height={graphSize}
            />
          </clipPath>
        </defs>
        {xTicks.map((x) => {
          const canvas = toCanvas({ x, y: 0 });
          return (
            <line
              key={`x-${x}`}
              x1={canvas.x}
              x2={canvas.x}
              y1={padding}
              y2={size - padding}
              stroke={x === 0 ? "#64748b" : "#e5e7eb"}
              strokeWidth={x === 0 ? 1.5 : 1}
            />
          );
        })}
        {yTicks.map((y) => {
          const canvas = toCanvas({ x: 0, y });
          return (
            <line
              key={`y-${y}`}
              x1={padding}
              x2={size - padding}
              y1={canvas.y}
              y2={canvas.y}
              stroke={y === 0 ? "#64748b" : "#e5e7eb"}
              strokeWidth={y === 0 ? 1.5 : 1}
            />
          );
        })}
        <g clipPath={`url(#${clipId})`}>
          {(visual.lines ?? []).map((line, index) => {
            const bounds = getLineBounds(
              visual,
              line.through[0],
              line.through[1],
            );
            if (bounds.length < 2) return null;
            const start = toCanvas(bounds[0]);
            const end = toCanvas(bounds[1]);
            const color = line.color ?? "#0c5bfe";
            return (
              <line
                key={`line-${index}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={color}
                strokeWidth={3}
                strokeDasharray={line.dashed ? "8 6" : undefined}
                strokeLinecap="round"
              />
            );
          })}
        </g>
        {(visual.lines ?? []).map((line, index) => {
          if (!line.label) return null;
          const end = toCanvas(line.through[1]);
          return (
            <text
              key={`line-label-${index}`}
              x={Math.min(Math.max(end.x + 7, padding), size - padding - 20)}
              y={Math.min(Math.max(end.y - 7, padding + 12), size - padding)}
              fill={line.color ?? "#0c5bfe"}
              fontSize="13"
              fontWeight="700"
            >
              {line.label}
            </text>
          );
        })}
        {(visual.points ?? []).map((point, index) => {
          const canvas = toCanvas(point);
          const color = point.color ?? "#dc2626";
          return (
            <g key={`point-${index}`}>
              <circle
                cx={canvas.x}
                cy={canvas.y}
                r={5}
                fill={color}
                stroke="white"
                strokeWidth={2}
              />
              {point.label ? (
                <text
                  x={canvas.x + 8}
                  y={canvas.y - 8}
                  fill={color}
                  fontSize="12"
                  fontWeight="700"
                >
                  {point.label}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

export function QuestionVisualView({
  visual,
}: {
  visual?: QuestionVisual | null;
}) {
  if (!visual || visual.type === "rich_document") return null;

  if (visual.type === "coordinate_graph") {
    return <CoordinateGraph visual={visual} />;
  }

  const width = visual.width && visual.width > 0 ? visual.width : 900;
  const height = visual.height && visual.height > 0 ? visual.height : 600;

  return (
    <figure className="mx-auto flex w-full justify-center overflow-hidden rounded-lg border border-line bg-white p-2">
      <Image
        src={visual.uri}
        alt={visual.alt ?? "Question figure"}
        width={width}
        height={height}
        unoptimized
        className="h-auto max-h-[560px] w-auto max-w-full object-contain"
      />
    </figure>
  );
}
