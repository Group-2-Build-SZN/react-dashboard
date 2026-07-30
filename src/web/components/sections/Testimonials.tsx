import { Quote, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

const testimonials = [
  {
    quote:
      "My Ulo saved me from so much stress. The video walkthrough and neighborhood insights are top notch!",
    name: "Chidinma K.",
    location: "Lagos, Nigeria",
  },
  {
    quote:
      "Finally a platform I can trust. Found my apartment in Abuja without anyone trying to deceive me!",
    name: "Emeka K.",
    location: "Abuja, Nigeria",
  },
  {
    quote:
      "The map feature is a game changer. I knew exactly what the environment looks like!",
    name: "Zainab A.",
    location: "Kano, Nigeria",
  },
];

export function Testimonials() {
  const [active, setActive] = useState(1);

  return (
    <section className="bg-neutral-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-h2 font-bold text-neutral">
            What our users are saying
          </h2>
          <p className="mt-2 text-body text-neutral-500">
            Real stories from real people
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-neutral-200 bg-white p-6"
            >
              <Quote className="text-primary-200" size={28} />
              <p className="mt-3 text-body text-neutral-700">"{t.quote}"</p>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-body font-semibold text-neutral">
                    {t.name}
                  </p>
                  <p className="text-small text-neutral-500">{t.location}</p>
                </div>
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              aria-label={`Show testimonial ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                active === i ? "w-6 bg-primary" : "w-2 bg-neutral-300"
              )}
            />
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/#reviews"
            className="text-body font-medium text-primary hover:underline"
          >
            See All
          </Link>
        </div>
      </div>
    </section>
  );
}
