import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  label?: string;
  error?: string;
}

export function Input({ icon, label, error, className, id, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-body font-medium text-neutral"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={cn(
            "w-full rounded-lg border border-neutral-300 bg-white py-3 text-body text-neutral placeholder:text-neutral-400",
            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
            icon ? "pl-11 pr-4" : "px-4",
            error && "border-error focus:ring-error/30 focus:border-error",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-small text-error">{error}</p>}
    </div>
  );
}
