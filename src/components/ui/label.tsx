import * as React from "react";

import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-ink select-none",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
