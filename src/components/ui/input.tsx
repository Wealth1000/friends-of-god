import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full min-w-0 rounded-md border border-input bg-cream-white px-3.5 text-base text-ink shadow-xs transition-[color,box-shadow,border-color] outline-none",
        "placeholder:text-warm-gray/55",
        "focus-visible:border-burnt focus-visible:ring-[3px] focus-visible:ring-burnt/25",
        "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
