import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/sections/Hero";
import { Features } from "../components/sections/Features";
import { HowItWorks } from "../components/sections/HowItWorks";
import { FeaturedProperties } from "../components/sections/FeaturedProperties";
import { Testimonials } from "../components/sections/Testimonials";
import { AppPromo } from "../components/sections/AppPromo";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar variant="landing" />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <FeaturedProperties />
        <Testimonials />
        <AppPromo />
      </main>
      <Footer />
    </div>
  );
}
