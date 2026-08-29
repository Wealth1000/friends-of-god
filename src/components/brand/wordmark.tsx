import { cn } from "@/lib/utils";

/**
 * Friends of God wordmark.
 *
 * TODO(asset): this is the placeholder logo. When the brand art lands,
 * drop it in /public/brand/ and render it here (e.g. next/image) — every
 * masthead, gate and footer pulls from this one component.
 */
export function Wordmark({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "cream";
}) {
  return (
    <span
      className={cn(
        "font-display text-lg leading-none tracking-tight uppercase",
        tone === "cream" ? "text-cream-white" : "text-ink",
        className,
      )}
    >
      Friends<span className="text-burnt">&nbsp;of&nbsp;</span>God
    </span>
  );
}
