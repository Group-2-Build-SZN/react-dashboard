import { UserPlus, Search, ShieldCheck, Link2 } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: "Create an account",
    description: "Sign up in less than a minute using your email",
  },
  {
    number: 2,
    icon: Search,
    title: "Search & Explore",
    description: "Browse verified properties, watch videos and explore neighborhoods",
  },
  {
    number: 3,
    icon: ShieldCheck,
    title: "Verify & Connect",
    description: "View details, read reviews and connect with trusted landlords securely",
  },
  {
    number: 4,
    icon: Link2,
    title: "Rent with Confidence",
    description: "Make informed decisions and move into your perfect home with peace of mind",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-neutral-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-h2 font-bold text-neutral">How It Works</h2>
          <p className="mt-3 text-body text-neutral-500">
            A smarter way to find your home.
          </p>
        </div>

        <div className="relative mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-neutral-200 lg:block" />
          {steps.map((step) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
                <step.icon size={26} className="text-primary" />
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-caption font-semibold text-white">
                  {step.number}
                </span>
              </div>
              <h3 className="mt-5 text-h4 font-semibold text-neutral">
                {step.title}
              </h3>
              <p className="mt-2 max-w-[220px] text-body text-neutral-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
