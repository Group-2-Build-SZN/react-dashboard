import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  icon?: ReactNode;
};

function Input({ label, icon, className = "", id, ...props }: InputProps) {
  return (
    <div>

      {label && (
        <label
          htmlFor={id}
          className="mb-[13px] block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">

        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-muted">
            {icon}
          </span>
        )}

        <input
          id={id}
          className={`h-12 w-full rounded-xl border border-muted bg-transparent text-sm text-gray-900 placeholder:text-muted focus:border-primary-800 focus:outline-none ${
            icon ? "pl-11 pr-4" : "px-4"
          } ${className}`}
          {...props}
        />

      </div>

    </div>
  );
}

export default Input;
