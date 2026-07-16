import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
};

function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg bg-[#3366FF] px-4 py-3 text-white font-medium"
    >
      {children}
    </button>
  );
}

export default Button;