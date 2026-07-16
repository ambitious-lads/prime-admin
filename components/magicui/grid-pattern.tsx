import { cn } from "@/lib/utils/cn";

export function GridPattern({
  className,
  width = 32,
  height = 32,
}: {
  className?: string;
  width?: number;
  height?: number;
}) {
  const id = `grid-${width}-${height}`;

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    >
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse">
          <path d={`M ${width} 0 L 0 0 0 ${height}`} fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
