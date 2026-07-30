import type { ReactNode } from "react";

interface AuthLayoutProps {
  image: string;
  imageAlt: string;
  panelTitle: string;
  panelSubtitle: string;
  footer?: ReactNode;
  children: ReactNode;
}

export function AuthLayout({
  image,
  imageAlt,
  panelTitle,
  panelSubtitle,
  footer,
  children,
}: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-primary-50 p-12 lg:flex">
        <div>
          <h1 className="text-h1 font-bold text-neutral">{panelTitle}</h1>
          <p className="mt-4 max-w-sm text-body-lg text-neutral-500">
            {panelSubtitle}
          </p>
        </div>

        <img
          src={image}
          alt={imageAlt}
          className="max-h-[420px] w-full object-contain"
        />

        <div>{footer}</div>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
