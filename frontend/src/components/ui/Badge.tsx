import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "danger" | "outline";
}

export function Badge({ children, variant = "default", className = "", ...props }: BadgeProps) {

  const base = "inline-flex items-center justify-center px-3 py-1 font-label-sm text-xs font-bold uppercase tracking-widest border-2 w-fit";

  const variants: Record<string, string> = {
    default: "bg-primary text-primary-foreground border-primary shadow-[3px_3px_0px_0px_#ff6b2b]",
    success: "bg-green-400 text-primary border-primary shadow-[3px_3px_0px_0px_#0b1f3a]",
    danger: "bg-destructive text-destructive-foreground border-primary shadow-[3px_3px_0px_0px_#0b1f3a]",
    outline: "bg-background text-foreground border-primary shadow-[3px_3px_0px_0px_#0b1f3a]",
    muted: "bg-muted text-muted-foreground border-border",
  }

  return (
    <span className={`${base} ${variants[variant]} ${className}`}{...props}>
      {children} 
    </span>
  );
}

