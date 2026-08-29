import { cn } from "@/lib/utils";

// Deterministic "organ-pipe" heights (the rounded vertical bars from the flyer).
const HEIGHTS = [46, 72, 92, 58, 100, 78, 44, 86, 64, 96, 52, 82, 90, 60, 74, 68];

/**
 * Vertical rounded bars — a recurring background motif.
 * Purely decorative; keep it subtle behind real content (set opacity on
 * the wrapper or pass a translucent `color`).
 */
export function BarField({
  className,
  color = "var(--burnt)",
  count = 16,
  align = "bottom",
}: {
  className?: string;
  color?: string;
  count?: number;
  align?: "top" | "bottom";
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 flex gap-[1.5%] overflow-hidden",
        align === "bottom" ? "items-end" : "items-start",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="flex-1 rounded-full"
          style={{
            height: `${HEIGHTS[i % HEIGHTS.length]}%`,
            background: color,
          }}
        />
      ))}
    </div>
  );
}
