import { useState } from "react";

type AboutSectionProps = {
  text: string;
};

function AboutSection({ text }: AboutSectionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>

      <h3 className="text-base font-semibold text-gray-900">
        About this property
      </h3>

      <p
        className={`mt-2 text-sm leading-relaxed text-gray-600 ${
          expanded ? "" : "line-clamp-2"
        }`}
      >
        {text}
      </p>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-1 text-sm font-medium text-primary-800"
      >
        {expanded ? "Read less" : "Read more"}
      </button>

    </div>
  );
}

export default AboutSection;
