import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "danger" | "outline";
}

export function Badge({ children, variant = "default", className = "", ...props }: BadgeProps) {

  const base = "inline-flex items-center justify-center px-3 py-1 text-label-sm font label-sm uppercase border-2";

  const variants: Record<string, string> = {
    default: "bg-primary text-on-primary border-primary",
    success: "bg-secondary text-on-secondary border-secondary",
    danger: "bg-error text-on-error border-error",
    outline: "bg-transparent text-primary border-primary",
  }

  return (
    <span className={`${base} ${variants[variant]} ${className}`}{...props}>
      {children} 
    </span>
  );
}

