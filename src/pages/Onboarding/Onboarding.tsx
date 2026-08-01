import { useState } from "react";

import PaginationDots from "../../components/PaginationDots/PaginationDots";
import Button from "../../components/Button/Button";

import onboarding1 from "../../assets/branding/onboarding-1-verified.png";
import onboarding2 from "../../assets/branding/onboarding-2-map.png";
import onboarding3 from "../../assets/branding/onboarding-3-secure-payment.png";

type OnboardingProps = {
  onComplete?: () => void;
};

const slides = [
  {
    image: onboarding1,
    heading: (
      <>
        Find verified <span className="text-primary-700">Properties</span>
      </>
    ),
    body: "Browse only verified properties. No more fake listings or wasted trips.",
    buttonLabel: "Next",
  },
  {
    image: onboarding2,
    heading: (
      <>
        Explore Neighbourhoods
        <br />
        with <span className="text-primary-700">Confidence</span>
      </>
    ),
    body: "Interactive maps and environment insights to help you make the right choice.",
    buttonLabel: "Next",
  },
  {
    image: onboarding3,
    heading: (
      <>
        Secure Deals.
        <br />
        <span className="text-primary-700">Happy Tenants</span>
      </>
    ),
    body: "Connect with verified landlords and agents. Pay securely and transparently.",
    buttonLabel: "Get Started",
  },
];

function Onboarding({ onComplete }: OnboardingProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = slides[activeIndex];
  const isLastSlide = activeIndex === slides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      onComplete?.();
    } else {
      setActiveIndex((index) => index + 1);
    }
  };

  return (
    <div style={{ padding: '10px 15px' }} className="flex min-h-screen flex-col bg-white px-6 pb-8 pt-5">

      <div className="flex justify-end">
        <button
          onClick={onComplete}
          className="text-sm font-medium text-gray-500"
        >
          Skip
        </button>
      </div>

      <div className="mt-6">
        <h1 className="text-[28px] font-bold leading-9 text-gray-900">
          {slide.heading}
        </h1>

        <p className="mt-3 text-base leading-6 text-gray-500">
          {slide.body}
        </p>
      </div>

      <div className="mt-8 flex flex-1 items-center justify-center">
        <img
          src={slide.image}
          alt=""
          className="max-h-80 w-full object-contain"
        />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <PaginationDots total={slides.length} activeIndex={activeIndex} />

        <Button variant="primary" size="lg" onClick={handleNext} className="w-[137px]">
          {slide.buttonLabel}
        </Button>
      </div>

    </div>
  );
}

export default Onboarding;
