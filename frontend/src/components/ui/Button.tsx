interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({ children, variant = "primary", size = "md", className = "", ...p }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer uppercase disabled:opacity-50 disabled:cursor-not-allowed";
  const vars: Record<string, string> = {
    primary: "bg-primary text-primary-foreground border-4 border-primary shadow-[8px_8px_0px_0px_#ff6b2b] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#ff6b2b] active:translate-x-2 active:translate-y-2 active:shadow-none",
    secondary: "bg-secondary-container text-on-secondary-container border-2 border-primary shadow-[4px_4px_0px_0px_#0b1f3a] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#0b1f3a] active:translate-x-1 active:translate-y-1 active:shadow-none",
    outline: "bg-transparent text-primary border-2 border-primary shadow-[4px_4px_0px_0px_#0b1f3a] hover:bg-surface-variant",
    ghost: "text-primary hover:bg-surface-variant hover:border-b-4 hover:border-secondary pb-1",
  };
  const sizes: Record<string, string> = {
    sm: "px-4 py-1.5 text-label-sm font-label-sm",
    md: "px-6 py-2 text-headline-md font-headline-md",
    lg: "px-10 py-4 text-headline-lg font-headline-lg",
  };
  return (
    <button className={`${base} ${vars[variant]} ${sizes[size]} ${className}`} {...p}>
      {children}
    </button>
  );
}

