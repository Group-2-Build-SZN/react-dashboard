import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-700 focus-visible:outline-primary",
  secondary:
    "bg-white text-primary border border-neutral-200 hover:bg-neutral-50 focus-visible:outline-primary",
  outline:
    "bg-transparent text-neutral-700 border border-neutral-300 hover:bg-neutral-50 focus-visible:outline-primary",
  ghost:
    "bg-transparent text-neutral-700 hover:bg-neutral-100 focus-visible:outline-primary",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-small gap-1.5",
  md: "px-5 py-2.5 text-button gap-2",
  lg: "px-6 py-3.5 text-button gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-semibold transition-colors duration-150",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </button>
  );
}
