import React, { forwardRef, useId } from "react";

// Extendemos los atributos nativos del SELECT de HTML
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = "", children, id, ...props }, ref) => {
    const reactId = useId();
    const selectId = id || reactId;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={selectId}
            className="text-label-sm font-label-sm uppercase text-muted-foreground"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={`
              w-full px-4 py-3 bg-card border-2 text-foreground font-body-md transition-all outline-none appearance-none cursor-pointer
              focus:border-secondary focus:ring-1 focus:ring-secondary
              disabled:opacity-50 disabled:bg-muted disabled:cursor-not-allowed
              ${error ? "border-destructive focus:border-destructive focus:ring-destructive" : "border-border"}
              ${className}
            `}
            {...props}
          >
            {children}
          </select>
          
          {/* Icono de flecha personalizado para tapar el diseño feo del navegador por defecto */}
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted-foreground">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {error && (
          <span className="text-[12px] font-label-sm text-destructive uppercase">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";