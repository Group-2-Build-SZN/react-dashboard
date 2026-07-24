import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
};

const variantStyles = {
  primary: "bg-primary-800 text-white",
  outline: "border border-muted bg-transparent text-gray-900",
};


const sizeStyles = {
  sm: "h-8 px-3 text-xs",
  md: "h-12 px-4 text-sm",
  lg: "h-12 px-8 text-base",
};

function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`flex items-center justify-center rounded-xl font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
