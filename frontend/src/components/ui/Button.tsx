interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({ children, variant = "primary", size = "md", className = "", ...p }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const vars: Record<string, string> = {
    primary: "bg-primary text-primary-foreground hover:brightness-90 active:scale-[0.98]",
    accent:  "bg-accent text-accent-foreground hover:brightness-90 active:scale-[0.98]",
    outline: "border-2 border-primary text-primary bg-white hover:bg-secondary active:scale-[0.98]",
    ghost:   "text-primary hover:bg-secondary active:scale-[0.98]",
    danger:  "bg-destructive text-destructive-foreground hover:brightness-90 active:scale-[0.98]",
  };
  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };
  return (
    <button className={`${base} ${vars[variant]} ${sizes[size]} ${className}`} {...p}>
      {children}
    </button>
  );
}

