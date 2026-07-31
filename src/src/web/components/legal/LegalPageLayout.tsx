import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Navbar } from "../layout/Navbar";
import { Footer } from "../layout/Footer";
import { cn } from "../../lib/utils";

export interface LegalSection {
  title: string;
  body: { heading?: string; paragraph: string }[];
}

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}

export function LegalPageLayout({
  title,
  lastUpdated,
  intro,
  sections,
}: LegalPageLayoutProps) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Link
            to="/"
            className="flex items-center gap-1 text-body text-neutral-500 hover:text-neutral-700"
          >
            <ChevronLeft size={16} />
            Back to Home
          </Link>

          <h1 className="mt-4 text-h1 font-bold text-neutral">{title}</h1>
          <p className="mt-1 text-small text-neutral-500">
            Last Updated: {lastUpdated}
          </p>
          <p className="mt-4 max-w-3xl text-body text-neutral-500">{intro}</p>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
            <nav className="flex flex-col gap-1">
              {sections.map((section, i) => (
                <button
                  key={section.title}
                  onClick={() => setActive(i)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-left text-small",
                    active === i
                      ? "bg-primary-50 font-medium text-primary"
                      : "text-neutral-600 hover:bg-neutral-50"
                  )}
                >
                  {i + 1}. {section.title}
                </button>
              ))}
            </nav>

            <div className="rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-h4 font-bold text-neutral">
                {active + 1}. {sections[active].title}
              </h2>
              <div className="mt-4 flex flex-col gap-5">
                {sections[active].body.map((block, i) => (
                  <div key={i}>
                    {block.heading && (
                      <h3 className="mb-1.5 text-body font-semibold text-neutral">
                        {block.heading}
                      </h3>
                    )}
                    <p className="text-body text-neutral-500">
                      {block.paragraph}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
