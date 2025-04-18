import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface KaluBetButtonProps extends React.ComponentProps<typeof Button> {
  variant?: "primary" | "secondary" | "outline";
}

const KaluBetButton = React.forwardRef<HTMLButtonElement, KaluBetButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <Button
        className={cn(
          "font-bold transition-all duration-200",
          variant === "primary" && 
            "bg-gradient-to-r from-[#e6b64c] to-[#d4a438] text-[#050d1d] hover:opacity-90",
          variant === "secondary" && 
            "bg-[#0a1c3e] border border-[#e6b64c] text-[#e6b64c] hover:bg-[#e6b64c] hover:text-[#050d1d]",
          variant === "outline" && 
            "bg-[#173776] hover:bg-[#0a1c3e] text-[#f5f5f5] hover:text-[#e6b64c]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
KaluBetButton.displayName = "KaluBetButton";

export { KaluBetButton };
