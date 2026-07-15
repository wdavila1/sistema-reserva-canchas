import React, { forwardRef, useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/* Para poder utilizar RHF en formularios como login, registro, etc*/
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const reactId = useId();
    const inputId = id || reactId;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-label-sm font-label-sm uppercase text-muted-foreground"
          >
            {label}
          </label>
        )}

        <input
          id={inputId}
          ref={ref}
          className={`
            w-full px-4 py-3 bg-card border-2 text-foreground font-body-md transition-all outline-none
            placeholder:text-muted-foreground/50
            focus:border-secondary focus:ring-1 focus:ring-secondary
            disabled:opacity-50 disabled:bg-muted disabled:cursor-not-allowed
            ${error ? "border-destructive focus:border-destructive focus:ring-destructive" : "border-border"}
            ${className}
          `}
          {...props}
        />
      </div>
    );
  }
);