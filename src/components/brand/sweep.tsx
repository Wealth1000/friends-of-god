import { cn } from "@/lib/utils";

/**
 * The sweeping hand-drawn line from the flyers.
 * Used as a section divider and to wrap the check-in confirmation.
 * `non-scaling-stroke` keeps the line weight constant as it stretches.
 */
export function Sweep({
  className,
  color = "var(--burnt)",
  width = 7,
}: {
  className?: string;
  color?: string;
  width?: number;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 120"
      fill="none"
      preserveAspectRatio="none"
      className={cn("block w-full", className)}
    >
      <path
        d="M8 84 C 210 20, 430 18, 618 66 C 806 114, 1004 118, 1192 40"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
