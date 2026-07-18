import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: ReactNode;
};

function PageHeader({ title, subtitle, onBack, rightAction }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between bg-white px-4 pt-5">

      <div className="flex items-center gap-3">

        <button
          onClick={onBack}
          aria-label="Go back"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gray-200"
        >
          <ArrowLeft size={20} strokeWidth={2} />
        </button>

        <div>
          <h1 className="text-[17px] font-bold text-gray-900">
            {title}
          </h1>

          {subtitle && (
            <p className="text-[13px] text-gray-500">
              {subtitle}
            </p>
          )}
        </div>

      </div>

      {rightAction}

    </div>
  );
}

export default PageHeader;
