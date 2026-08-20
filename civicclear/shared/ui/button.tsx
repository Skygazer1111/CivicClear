import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold tracking-tight transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] touch-manipulation",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-[#18a585] to-accent text-white shadow-[0_12px_28px_rgba(15,143,120,0.32),0_1px_0_rgba(255,255,255,0.28)_inset] hover:-translate-y-0.5 hover:from-[#1bb291] hover:to-accent-hover hover:shadow-[0_18px_36px_rgba(15,143,120,0.38)]",
        outline:
          "border border-white/80 bg-white/65 text-ink shadow-[0_8px_24px_rgba(16,56,46,0.06)] backdrop-blur-md hover:-translate-y-0.5 hover:border-accent/35 hover:bg-white hover:shadow-[0_14px_30px_rgba(15,143,120,0.12)]",
        ghost:
          "text-ink-muted hover:bg-white/60 hover:text-ink hover:shadow-[0_6px_16px_rgba(16,56,46,0.06)]",
      },
      size: {
        default: "h-12 px-5 sm:h-11",
        sm: "h-10 px-3.5 text-sm sm:h-9",
        lg: "h-12 px-6 text-base sm:h-12 sm:px-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}
