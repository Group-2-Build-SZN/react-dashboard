import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-lg bg-[#3366FF] px-4 py-3 text-white font-medium ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
